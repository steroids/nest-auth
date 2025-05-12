import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';

@TypeOrmTableFromModel(AuthLoginModel, 'auth_login')
export class AuthLoginTable implements IDeepPartial<AuthLoginModel> {}
