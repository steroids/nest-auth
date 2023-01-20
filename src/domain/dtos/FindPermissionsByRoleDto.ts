import {IntegerField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class FindPermissionsByRoleDto {
    @IntegerField({
        required: true,
        label: 'id роли',
    })
    roleId: number;
}
