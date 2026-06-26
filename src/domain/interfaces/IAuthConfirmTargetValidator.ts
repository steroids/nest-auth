import {AuthConfirmProviderType} from '../types/AuthConfirmProviderType';
import {AuthConfirmTargetField} from '../types/AuthConfirmTargetField';

export const AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN = 'auth_confirm_target_validators_token';

export interface IAuthConfirmTargetValidator {
    readonly providerTypes: AuthConfirmProviderType[],
    readonly targetField: AuthConfirmTargetField,
    validate(target: string): Promise<string> | string,
}
