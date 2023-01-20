import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {DeepPartial} from 'typeorm';
import { AuthPermissionModel } from '../../domain/models/AuthPermissionModel';

@TableFromModel(AuthPermissionModel, 'auth_permission')
export class AuthPermissionTable implements DeepPartial<AuthPermissionModel> {}
