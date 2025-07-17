import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {IAuthConfirmConfig} from '../../infrastructure/config';

export const AuthConfirmProvidersToken = 'AuthConfirmProvidersToken';

export interface IAuthConfirmProvider {
    readonly notifierProviderType: NotifierProviderType,
    send(config: IAuthConfirmConfig, target: string): Promise<string>,
}
