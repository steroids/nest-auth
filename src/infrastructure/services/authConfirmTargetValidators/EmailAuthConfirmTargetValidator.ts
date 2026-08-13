import {Injectable} from '@nestjs/common';
import {IAuthConfirmTargetValidator} from '../../../domain/interfaces/IAuthConfirmTargetValidator';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {AuthConfirmTargetField} from '../../../domain/types/AuthConfirmTargetField';

@Injectable()
export class EmailAuthConfirmTargetValidator implements IAuthConfirmTargetValidator {
    readonly providerTypes = [AuthConfirmProviderTypeEnum.EMAIL];

    readonly targetField: AuthConfirmTargetField = 'email';

    normalize(target: string): string {
        return String(target || '').trim();
    }

    validate(target: string): void {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
            throw new Error('Invalid email for confirmation');
        }
    }
}
