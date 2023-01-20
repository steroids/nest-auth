import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {AuthPermissionTable} from '../tables/AuthPermissionTable';
import {AuthPermissionModel} from '../../domain/models/AuthPermissionModel';
import {IAuthPermissionsRepository} from '../../domain/interfaces/IAuthPermissionsRepository';

@Injectable()
export class AuthPermissionRepository extends CrudRepository<AuthPermissionModel> implements IAuthPermissionsRepository {
    constructor(
        @InjectRepository(AuthPermissionTable)
        public dbRepository: Repository<AuthPermissionTable>,
    ) {
        super();
    }

    protected modelClass = AuthPermissionModel;
}
