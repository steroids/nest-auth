import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';

export type AuthConfirmTargetField = Extract<keyof UserModel, 'email' | 'phone'>;
