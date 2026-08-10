import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {AuthLoginTable} from '../tables/AuthLoginTable';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';
import {IAuthLoginRepository} from '../../domain/interfaces/IAuthLoginRepository';

@Injectable()
export class AuthLoginRepository extends CrudRepository<AuthLoginModel> implements IAuthLoginRepository {
    constructor(
        @InjectRepository(AuthLoginTable)
        public dbRepository: Repository<AuthLoginTable>,
    ) {
        super();
    }

    protected modelClass = AuthLoginModel;
}
