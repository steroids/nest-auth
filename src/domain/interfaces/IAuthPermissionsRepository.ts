import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {AuthPermissionModel} from '../models/AuthPermissionModel';

export const IAuthPermissionsRepository = 'IAuthPermissionsRepository';

export type IAuthPermissionsRepository = ICrudRepository<AuthPermissionModel>
