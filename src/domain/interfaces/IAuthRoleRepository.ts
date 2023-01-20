import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {AuthRoleModel} from '../models/AuthRoleModel';

export const IAuthRoleRepository = 'IAuthRoleRepository';

export type IAuthRoleRepository = ICrudRepository<AuthRoleModel>
