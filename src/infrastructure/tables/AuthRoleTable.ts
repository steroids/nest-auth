import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {AuthRoleModel} from '../../domain/models/AuthRoleModel';

@TypeOrmTableFromModel(AuthRoleModel, 'auth_role')
export class AuthRoleTable implements IDeepPartial<AuthRoleModel> {}
