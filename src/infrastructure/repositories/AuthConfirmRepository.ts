import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {Repository} from '@steroidsjs/typeorm';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthConfirmTable} from '../tables/AuthConfirmTable';
import {IAuthConfirmRepository} from '../../domain/interfaces/IAuthConfirmRepository';

export class AuthConfirmRepository extends CrudRepository<AuthConfirmModel> implements IAuthConfirmRepository {
    constructor(
        @InjectRepository(AuthConfirmTable)
        public dbRepository: Repository<AuthConfirmTable>,
    ) {
        super();
    }

    protected modelClass = AuthConfirmModel;
}
