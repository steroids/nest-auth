import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {AuthConfirmModel} from '../models/AuthConfirmModel';

export type AuthConfirmTargetField = Exclude<keyof AuthConfirmModel & keyof UserModel, 'id'>;
