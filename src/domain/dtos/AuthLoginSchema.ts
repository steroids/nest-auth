import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthLoginModel} from '../models/AuthLoginModel';

export class AuthLoginSchema {
    @ExtendField(AuthLoginModel)
    id: number;

    @ExtendField(AuthLoginModel)
    uid: string;

    @ExtendField(AuthLoginModel)
    userId: number;

    @ExtendField(AuthLoginModel)
    ipAddress: string;

    @ExtendField(AuthLoginModel)
    location: string;

    @ExtendField(AuthLoginModel)
    userAgent: string;

    @ExtendField(AuthLoginModel)
    isRevoked: boolean;

    @ExtendField(AuthLoginModel)
    createTime: string;

    @ExtendField(AuthLoginModel)
    updateTime: string;
}
