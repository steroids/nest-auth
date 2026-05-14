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

    validate(target: string): string {
        const normalizedTarget = String(target || '')
            .replace(/[^+\d]/g, '')
            .replace(/^8/, '+7')
            .replace(/^7/, '+7')
            .replace(/^00/, '+');

        if (!/^\+\d{11,15}$/.test(normalizedTarget)) {
            throw new ValidationException({
                target: 'Некорректный номер телефона',
            });
        }

        return normalizedTarget;
    }
}
