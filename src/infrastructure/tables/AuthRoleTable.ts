import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import { AuthRoleModel } from '../../domain/models/AuthRoleModel';

@TableFromModel(AuthRoleModel, 'auth_role')
export class AuthRoleTable implements IDeepPartial<AuthRoleModel> {}
