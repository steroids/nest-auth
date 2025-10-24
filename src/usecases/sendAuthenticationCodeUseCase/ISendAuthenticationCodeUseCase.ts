import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthenticateWithCodeDto} from './dtos/AuthenticateWithCodeDto';

export const SEND_AUTHENTICATION_CODE_USE_CASE_TOKEN = 'send_authentication_code_use_case_token';

export interface ISendAuthenticationCodeUseCase {
    handle: (
        providerType: string | null,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ) => Promise<AuthConfirmModel>,
}
