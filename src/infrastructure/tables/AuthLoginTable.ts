import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';

@TableFromModel(AuthLoginModel, 'auth_login')
export class AuthLoginTable extends AuthLoginModel {}
