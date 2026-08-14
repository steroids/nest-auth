import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
import {AuthConfirmTargetField} from '../../domain/types/AuthConfirmTargetField';

export const GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN = 'get_auth_confirm_target_field_use_case_token';

export interface IGetAuthConfirmTargetFieldUseCase {
    handle(type: AuthConfirmProviderType): AuthConfirmTargetField,
}
