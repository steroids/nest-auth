import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';

@TableFromModel(AuthLoginModel, 'auth_login')
export class AuthLoginTable implements IDeepPartial<AuthLoginModel> {}
