import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {DeepPartial} from 'typeorm';
import { AuthRoleModel } from '../../domain/models/AuthRoleModel';

@TableFromModel(AuthRoleModel, 'auth_role')
export class AuthRoleTable implements DeepPartial<AuthRoleModel> {}
