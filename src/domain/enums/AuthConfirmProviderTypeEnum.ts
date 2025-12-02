import BaseEnum from '@steroidsjs/nest/domain/base/BaseEnum';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {AuthConfirmModel} from '../models/AuthConfirmModel';

export type TargetField = Exclude<keyof AuthConfirmModel & keyof UserModel, 'id'>;

export enum AuthConfirmProviderTypeEnum {
    CALL ='call',
    SMS = 'sms',
    VOICE = 'voice',
}

export class AuthConfirmProviderTypeEnumHelper extends BaseEnum {
    static getLabels() {
        return {
            [AuthConfirmProviderTypeEnum.CALL]: 'Номер телефона, совершившего звонок',
            [AuthConfirmProviderTypeEnum.SMS]: 'СМС',
            [AuthConfirmProviderTypeEnum.VOICE]: 'Продиктованные по телефонному звонку цифры',
        };
    }

    static getTargetField(id: AuthConfirmProviderTypeEnum): TargetField {
        switch (id) {
            case AuthConfirmProviderTypeEnum.CALL:
                return 'phone';
            case AuthConfirmProviderTypeEnum.SMS:
                return 'phone';
            case AuthConfirmProviderTypeEnum.VOICE:
                return 'phone';
            default:
                throw new Error(`Unknown AuthConfirmProviderTypeEnum value: ${id}`);
        }
    }
}
