import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
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
