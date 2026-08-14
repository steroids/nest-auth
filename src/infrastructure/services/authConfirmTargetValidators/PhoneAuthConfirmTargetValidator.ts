import {Injectable} from '@nestjs/common';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {IAuthConfirmTargetValidator} from '../../../domain/interfaces/IAuthConfirmTargetValidator';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {AuthConfirmTargetField} from '../../../domain/types/AuthConfirmTargetField';

@Injectable()
export class PhoneAuthConfirmTargetValidator implements IAuthConfirmTargetValidator {
    readonly providerTypes = [
        AuthConfirmProviderTypeEnum.CALL,
        AuthConfirmProviderTypeEnum.SMS,
        AuthConfirmProviderTypeEnum.VOICE,
    ];

    readonly targetField: AuthConfirmTargetField = 'phone';

    normalize(target: string): string {
        return String(target || '')
            .replace(/[^+\d]/g, '')
            .replace(/^8/, '+7')
            .replace(/^7/, '+7')
            .replace(/^00/, '+');
    }

    validate(target: string): void {
        if (!/^\+\d{11,15}$/.test(target)) {
            throw new ValidationException({
                target: 'Некорректный номер телефона для подтверждения',
            });
        }
    }
}
