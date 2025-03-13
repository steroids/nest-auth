import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthRoleModel} from '../../domain/models/AuthRoleModel';

export class AuthRoleBaseSchema {
    @ExtendField(AuthRoleModel)
    id: number;

    @ExtendField(AuthRoleModel)
    name: string;

    @ExtendField(AuthRoleModel)
    title: string;
}
