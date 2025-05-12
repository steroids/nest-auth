import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import { AuthConfirmModel } from '../../domain/models/AuthConfirmModel';

@TypeOrmTableFromModel(AuthConfirmModel, 'auth_confirm')
export class AuthConfirmTable implements IDeepPartial<AuthConfirmModel> {}
