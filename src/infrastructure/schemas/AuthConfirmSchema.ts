import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';

export class AuthConfirmSchema {
    @ExtendField(AuthConfirmModel)
    id: number;

    @ExtendField(AuthConfirmModel)
    uid: string;

    @ExtendField(AuthConfirmModel)
    email: string;

    @ExtendField(AuthConfirmModel)
    phone: string;

    @ExtendField(AuthConfirmModel)
    expireTime: string;

    @ExtendField(AuthConfirmModel)
    updateTime: string;

    @ExtendField(AuthConfirmModel)
    isConfirmed: boolean;
}
