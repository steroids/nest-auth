import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthPermissionModel} from '../models/AuthPermissionModel';

export class AuthPermissionSearchInputDto {
    @ExtendField(AuthPermissionModel)
    id: number;

    @ExtendField(AuthPermissionModel)
    name: string;
}
