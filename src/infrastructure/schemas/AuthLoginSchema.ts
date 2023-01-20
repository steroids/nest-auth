import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';

export class AuthLoginSchema {
    @ExtendField(AuthLoginModel)
    accessToken: string;

    @ExtendField(AuthLoginModel)
    accessExpireTime: string;

    @ExtendField(AuthLoginModel)
    refreshToken: string;

    @ExtendField(AuthLoginModel)
    refreshExpireTime: string;
}
