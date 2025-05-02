import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {AuthPermissionModel} from '../../domain/models/AuthPermissionModel';

@TableFromModel(AuthPermissionModel, 'auth_permission')
export class AuthPermissionTable extends AuthPermissionModel {}
