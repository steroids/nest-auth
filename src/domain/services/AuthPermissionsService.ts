import {
    union as _union,
    uniq as _uniq,
} from 'lodash';
import {ForbiddenException} from '@steroidsjs/nest/usecases/exceptions';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {normalizeBoolean} from '@steroidsjs/nest/infrastructure/decorators/fields/BooleanField';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {PermissionsFactory} from '@steroidsjs/nest/infrastructure/helpers/PermissionsFactory';
import {AuthRoleModel} from '../models/AuthRoleModel';
import {AuthPermissionModel} from '../models/AuthPermissionModel';
import {IAuthPermissionsRepository} from '../interfaces/IAuthPermissionsRepository';
import {AuthPermissionSearchInputDto} from '../dtos/AuthPermissionSearchInputDto';
import {AuthPermissionSaveInputDto} from '../dtos/AuthPermissionSaveInputDto';
import {IAuthRoleRepository} from '../interfaces/IAuthRoleRepository';

export class AuthPermissionsService extends CrudService<AuthPermissionModel,
    AuthPermissionSearchInputDto,
    AuthPermissionSaveInputDto> {
    protected modelClass = AuthPermissionModel;

    constructor(
        /** @see AuthPermissionRepository **/
        public repository: IAuthPermissionsRepository,

        /** @see AuthRoleRepository **/
        public authRoleRepository: IAuthRoleRepository,
    ) {
        super();
    }

    public async getRolesPermissions(user: UserModel, authRoleIds: number[]): Promise<string[]> {
        // Get all roles
        const allRoles = await this.authRoleRepository.createQuery()
            .with('authPermissions')
            .many();

        const getPermissionRecursive = (roleId) => {
            const role = allRoles.find(({id}) => id === roleId);
            return [
                ...(role?.authPermissions || []).map(item => item.name),
                ...(role?.parentId ? getPermissionRecursive(role?.parentId) : []),
            ];
        };

        let permissions = [];
        for (const roleId of authRoleIds) {
            permissions.push(...getPermissionRecursive(roleId));
        }

        if (normalizeBoolean(process.env.APP_AUTH_DEBUG_ALL_PERMISSIONS)) {
            permissions = PermissionsFactory.getAllPermissionsKeys();
        }

        return _uniq(permissions);
    }

    public checkRolePermission(authRoles: AuthRoleModel[], permission: AuthPermissionModel): boolean {
        const permissionsByRoles = authRoles.map(authRole => {
            const expiredTimeIsOut = new Date(authRole.expireTime) < new Date();
            if (!authRole.isActive || expiredTimeIsOut) {
                return [];
            }

            return (authRole.parent
                ? this.mergeWithParentPermissions(authRole.parent.authPermissions, authRole.authPermissions)
                : authRole.authPermissions)
                .map(authPermission => authPermission.id);
        });

        const permissions = _union(...permissionsByRoles);

        return permissions.includes(permission.id);
    }

    public checkRolePermissionOrPanic(authRoles: AuthRoleModel[], permission: AuthPermissionModel): boolean {
        const checkRolePermission = this.checkRolePermission(authRoles, permission);
        if (!checkRolePermission) {
            // TODO У вас нет разрешения + permission.description
            throw new ForbiddenException('Недостаточно прав');
        }

        return checkRolePermission;
    }

    public async findOrCreate(keys: string[]) {
        if (!keys?.length) {
            return [];
        }
        const searchQuery = new SearchQuery<AuthPermissionModel>();
        searchQuery.where(['in', 'name', keys]);
        const permissions = await this.findMany(searchQuery);
        const permissionsKeysToCreate = keys.filter(e => !permissions.some(element => element.name === e));
        if (permissionsKeysToCreate.length > 0) {
            for (const permissionKey of permissionsKeysToCreate) {
                const permissionDto = new AuthPermissionSaveInputDto();
                permissionDto.name = permissionKey;
                permissions.push(await this.create(permissionDto));
            }
        }
        return permissions;
    }

    private mergeWithParentPermissions(parentPermissions, ownPermissions) {
        return parentPermissions.map(parentItem => ({
            ...ownPermissions.find((ownItem) => (ownItem.id === parentItem.id) && ownItem),
            ...parentItem,
        }));
    }

    public async getPermissionsTree() {
        return PermissionsFactory.getAllPermissionsTreeKeys();
    }
}
