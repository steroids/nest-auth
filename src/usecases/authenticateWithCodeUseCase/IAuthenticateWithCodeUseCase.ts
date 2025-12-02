import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';

export const AUTHENTICATE_WITH_CODE_USE_CASE_TOKEN = 'authenticate_with_code_use_case_token';

export interface IAuthenticateWithCodeUseCase {
    handle: (dto: AuthConfirmLoginDto, context: ContextDto) => Promise<AuthLoginModel>,
}
