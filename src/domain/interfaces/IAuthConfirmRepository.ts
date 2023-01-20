import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {AuthConfirmModel} from '../models/AuthConfirmModel';

export const IAuthConfirmRepository = 'IAuthConfirmRepository';

export type IAuthConfirmRepository = ICrudRepository<AuthConfirmModel>
