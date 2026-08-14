import {IAuthConfirmConfig} from '../../infrastructure/config';
import {AuthConfirmProviderType} from '../types/AuthConfirmProviderType';

export const AUTH_CONFIRM_PROVIDERS_TOKEN = 'auth_confirm_providers_token';

export interface IAuthConfirmProvider {
    readonly type: AuthConfirmProviderType,
    generateAndSendCode(config: IAuthConfirmConfig, target: string): Promise<string>,
}
