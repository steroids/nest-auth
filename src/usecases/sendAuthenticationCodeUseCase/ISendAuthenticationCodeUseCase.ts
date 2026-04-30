import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
import {AuthenticateWithCodeDto} from './dtos/AuthenticateWithCodeDto';

export const SEND_AUTHENTICATION_CODE_USE_CASE_TOKEN = 'send_authentication_code_use_case_token';

export interface ISendAuthenticationCodeUseCase {
    handle: (
        providerType: AuthConfirmProviderType,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ) => Promise<AuthConfirmModel>,
}