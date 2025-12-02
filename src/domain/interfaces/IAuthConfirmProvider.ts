import {IAuthConfirmConfig} from '../../infrastructure/config';
import {AuthConfirmProviderTypeEnum} from '../enums/AuthConfirmProviderTypeEnum';

export const AUTH_CONFIRM_PROVIDERS_TOKEN = 'auth_confirm_providers_token';

export interface IAuthConfirmProvider {
    readonly type: AuthConfirmProviderTypeEnum,
    generateAndSendCode(config: IAuthConfirmConfig, target: string): Promise<string>,
}
