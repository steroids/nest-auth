import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthPermissionModel} from '../../domain/models/AuthPermissionModel';

export class AuthPermissionSchema {
    @ExtendField(AuthPermissionModel)
    id: number;

    @ExtendField(AuthPermissionModel)
    name: string;
}
