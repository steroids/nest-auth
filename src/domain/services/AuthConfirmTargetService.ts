import {Inject, Injectable} from "@nestjs/common";
import {AuthConfirmTargetField} from "../types/AuthConfirmTargetField";
import {
    AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN,
    IAuthConfirmTargetValidator
} from "../interfaces/IAuthConfirmTargetValidator";
import {AuthConfirmProviderType} from "../types/AuthConfirmProviderType";

export interface IResolvedTargetInfo {
    targetField: AuthConfirmTargetField,

    target: string,
}

@Injectable()
export class AuthConfirmTargetService {
    /**
     * @param authConfirmTargetValidators Валидаторы target, зарегистрированные для провайдеров подтверждения.
     */
    constructor(
        @Inject(AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN)
        protected readonly authConfirmTargetValidators: IAuthConfirmTargetValidator[],
    ) {
    }

    /**
     * Возвращает валидатор, поддерживающий указанный провайдер подтверждения.
     *
     * @param providerType Провайдер подтверждения.
     * @throws {Error} Если для провайдера не зарегистрирован валидатор.
     */
    private getTargetValidator(providerType: AuthConfirmProviderType): IAuthConfirmTargetValidator {
        const targetValidator = this.authConfirmTargetValidators
            .find(validator => validator.providerTypes.includes(providerType));

        if (!targetValidator) {
            throw new Error('Wrong provider type: ' + providerType);
        }

        return targetValidator;
    }

    /**
     * На основе providerType определяет валидатор для target, нормализует target и проводит валидацию.
     * Возвращает информацию о target, которая содержит нормализованный target и поле которому он соответствует
     *
     * @param providerType Провайдер подтверждения.
     * @param target Исходное значение получателя для подтверждения.
     * @returns IResolvedTargetInfo Нормализованный target и соответствующий ему тип поля.
     * @throws {ValidationException} Если target не прошёл валидацию.
     */
    public async resolveTargetInfo(providerType: AuthConfirmProviderType, target: string): Promise<IResolvedTargetInfo> {
        const targetValidator = this.getTargetValidator(providerType);

        const normalizedTarget = targetValidator.normalize(target);

        await targetValidator.validate(normalizedTarget);


        return {
            target: normalizedTarget,
            targetField: targetValidator.targetField,
        };
    }
}
