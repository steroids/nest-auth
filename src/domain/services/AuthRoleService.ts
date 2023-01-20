import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {AuthRoleModel} from '../models/AuthRoleModel';
import {AuthRoleSearchInputDto} from '../dtos/AuthRoleSearchInputDto';
import {AuthRoleSaveInputDto} from '../dtos/AuthRoleSaveInputDto';
import {IAuthRoleRepository} from '../interfaces/IAuthRoleRepository';
import {AuthPermissionsService} from './AuthPermissionsService';
import {AuthRoleSaveDto} from '../dtos/AuthRoleSaveDto';
import {AuthRolesAutocompleteDto} from '../dtos/AuthRolesAutocompleteDto';

export class AuthRoleService extends CrudService<AuthRoleModel,
    AuthRoleSearchInputDto,
    AuthRoleSaveInputDto> {
    protected modelClass = AuthRoleModel;

    constructor(
        public repository: IAuthRoleRepository,
        public permissionService: AuthPermissionsService,
    ) {
        super();
    }

    public async updateOrCreate(
        saveDto: AuthRoleSaveDto,
        id?: number | string | null,
        context?,
        schema?,
    ): Promise<any> {
        const permissions = await this.permissionService.findOrCreate(saveDto.permissionKeys);
        const roleSaveDto = DataMapper.create(AuthRoleSaveInputDto, {
            ...saveDto,
            authPermissions: permissions,
        });
        if (id) {
            return this.update(id, roleSaveDto, context, schema);
        }
        return this.create(roleSaveDto, context, schema);
    }

    public async getAutocomplete() {
        const searchQuery = new SearchQuery();
        searchQuery.select(['id', 'title']);
        const roles = await this.findMany(searchQuery);
        const rolesDtos = [];
        roles.forEach((element) => {
            const roleDto = new AuthRolesAutocompleteDto();
            roleDto.id = element.id;
            roleDto.label = element.title;
            rolesDtos.push(roleDto);
        });
        return rolesDtos;
    }

    public async getPermissionKeysByRoleId(roleId: number) {
        const searchQuery = new SearchQuery();
        searchQuery.where({id: roleId});
        searchQuery.with(['authPermissions', 'parent']);
        const authRole = await this.findOne(searchQuery);

        if (!authRole) {
            return [];
        }
        const permissionKeys = [];
        authRole.authPermissions.forEach((value) => {
            permissionKeys.push(value.name);
        });

        if (authRole.parent) {
            permissionKeys.push(...(await this.getPermissionKeysByRoleId(authRole.parentId)));
        }

        return permissionKeys;
    }

    public async findByAuthRolesIds(authRoleIds: number[]) {
        const searchQuery = new SearchQuery();
        searchQuery.where(['in', 'id', authRoleIds]);
        return this.findMany(searchQuery);
    }
}
