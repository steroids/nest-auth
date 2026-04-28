import {Injectable} from '@nestjs/common';
import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
import {AuthConfirmProviderTypeEnum} from '../../domain/enums/AuthConfirmProviderTypeEnum';
import {IGetAuthConfirmTargetFieldUseCase} from './IGetAuthConfirmTargetFieldUseCase';
import {AuthConfirmTargetField} from '../../domain/types/AuthConfirmTargetField';

@Injectable()
export class GetAuthConfirmTargetFieldUseCase implements IGetAuthConfirmTargetFieldUseCase {
    handle(type: AuthConfirmProviderType): AuthConfirmTargetField {
        switch (type) {
            case AuthConfirmProviderTypeEnum.CALL:
            case AuthConfirmProviderTypeEnum.SMS:
            case AuthConfirmProviderTypeEnum.VOICE:
                return 'phone';
            case AuthConfirmProviderTypeEnum.EMAIL:
                return 'email';
            default:
                throw new Error(`Неизвестный тип провайдера кода подтверждения: ${type}`);
        }
    }
}
