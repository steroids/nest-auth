import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthConfirmModel} from '../models/AuthConfirmModel';

export class AuthConfirmSaveDto {
    @ExtendField(AuthConfirmModel)
    id: number;

    @ExtendField(AuthConfirmModel)
    uid: string;

    @ExtendField(AuthConfirmModel)
    userId: number;

    @ExtendField(AuthConfirmModel)
    email: string;

    @ExtendField(AuthConfirmModel)
    phone: string;

    @ExtendField(AuthConfirmModel)
    code: string;

    @ExtendField(AuthConfirmModel)
    providerName: string;

    @ExtendField(AuthConfirmModel)
    isConfirmed: boolean;

    @ExtendField(AuthConfirmModel)
    expireTime: string;

    @ExtendField(AuthConfirmModel)
    lastSentTime: string;

    @ExtendField(AuthConfirmModel)
    attemptsCount: number;

    @ExtendField(AuthConfirmModel)
    ipAddress: string;
}
