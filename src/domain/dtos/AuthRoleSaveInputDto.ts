import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthRoleModel} from '../models/AuthRoleModel';
import {AuthPermissionSaveInputDto} from './AuthPermissionSaveInputDto';

export class AuthRoleSaveInputDto {
    @ExtendField(AuthRoleModel)
    name: string;

    @ExtendField(AuthRoleModel)
    title: string;

    @ExtendField(AuthRoleModel)
    description: string;

    @ExtendField(AuthRoleModel)
    isActive: boolean;

    @ExtendField(AuthRoleModel)
    expireTime: string;

    @ExtendField(AuthRoleModel)
    parentId: number;

    @ExtendField(AuthRoleModel, {
        relationClass: () => AuthPermissionSaveInputDto,
        isArray: true,
    })
    authPermissions: AuthPermissionSaveInputDto[];
}
