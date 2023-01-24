import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {Repository} from '@steroidsjs/typeorm';
import {AuthRoleModel} from '../../domain/models/AuthRoleModel';
import {IAuthRoleRepository} from '../../domain/interfaces/IAuthRoleRepository';
import {AuthRoleTable} from '../tables/AuthRoleTable';

export class AuthRoleRepository extends CrudRepository<AuthRoleModel> implements IAuthRoleRepository {
    constructor(
        @InjectRepository(AuthRoleTable)
        public dbRepository: Repository<AuthRoleTable>,
    ) {
        super();
    }

    protected modelClass = AuthRoleModel;
}
