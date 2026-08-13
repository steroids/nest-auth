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
    constructor(
        @Inject(AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN)
        protected readonly authConfirmTargetValidators: IAuthConfirmTargetValidator[],
    ) {
    }

    private getTargetValidator(providerType: AuthConfirmProviderType): IAuthConfirmTargetValidator {
        const targetValidator = this.authConfirmTargetValidators
            .find(validator => validator.providerTypes.includes(providerType));

        if (!targetValidator) {
            throw new Error('Wrong provider type: ' + providerType);
        }

        return targetValidator;
    }

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
