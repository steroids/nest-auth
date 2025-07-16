import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {AuthPermissionModel} from '../../domain/models/AuthPermissionModel';

@TypeOrmTableFromModel(AuthPermissionModel, 'auth_permission')
export class AuthPermissionTable extends AuthPermissionModel {}
