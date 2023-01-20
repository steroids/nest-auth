import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {AuthLoginModel} from '../models/AuthLoginModel';

export const IAuthLoginRepository = 'IAuthLoginRepository';

export type IAuthLoginRepository = ICrudRepository<AuthLoginModel>
