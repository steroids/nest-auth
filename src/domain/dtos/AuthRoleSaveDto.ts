import {
    StringField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthRoleModel} from '../models/AuthRoleModel';

export class AuthRoleSaveDto {
    @ExtendField(AuthRoleModel, {
        label: 'Системное имя роли',
    })
    name: string;

    @ExtendField(AuthRoleModel, {
        label: 'Название роли',
        required: true,
    })
    title: string;

    @ExtendField(AuthRoleModel, {
        label: 'Описание роли',
    })
    description: string;

    @ExtendField(AuthRoleModel, {
        label: 'Активен?',
        required: true,
    })
    isActive: boolean;

    @ExtendField(AuthRoleModel, {
        label: 'Истекает время',
    })
    expireTime: string;

    @ExtendField(AuthRoleModel, {
        label: 'id роли родителя',
    })
    parentId: number;

    @StringField({
        label: 'Ключи доступа',
        isArray: true,
    })
    permissionKeys: string[];
}
