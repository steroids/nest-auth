import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import { AuthPermissionModel } from '../../domain/models/AuthPermissionModel';

@TableFromModel(AuthPermissionModel, 'auth_permission')
export class AuthPermissionTable implements IDeepPartial<AuthPermissionModel> {}
