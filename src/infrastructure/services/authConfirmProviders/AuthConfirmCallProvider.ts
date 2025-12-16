import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierCallOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {Inject} from '@nestjs/common';
import {IAuthConfirmConfig} from '../../config';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

export class AuthConfirmCallProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
        super(notifierService);
    }

    readonly type: AuthConfirmProviderTypeEnum = AuthConfirmProviderTypeEnum.CALL;

    async generateAndSendCode(config: IAuthConfirmConfig, phone: string): Promise<string> {
        const response = await this.sendCode({
            call: {
                phone,
                name: config.providerName,
            } as INotifierCallOptions,
        });

        let code = response[NotifierProviderType.CALL];
        code = code.substring(code.length - config.codeLength);

        return code;
    }
}
