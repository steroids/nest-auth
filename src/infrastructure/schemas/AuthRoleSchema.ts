import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthRoleModel} from '../../domain/models/AuthRoleModel';

export class AuthRoleSchema {
    @ExtendField(AuthRoleModel)
    id: number;

    @ExtendField(AuthRoleModel)
    title: string;
}
