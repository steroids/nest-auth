import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthPermissionModel} from '../models/AuthPermissionModel';

export class AuthPermissionSaveInputDto {
    @ExtendField(AuthPermissionModel)
    name: string;
}
