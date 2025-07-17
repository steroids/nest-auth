import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierCallOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {Inject} from '@nestjs/common';
import {IAuthConfirmConfig} from '../../config';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

export class AuthConfirmCallProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
        super(notifierService);
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.SMS;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        const response = await this.sendInternal({
            call: {
                phone,
                name: config.providerName,
            } as INotifierCallOptions,
        });

        let code = response[NotifierProviderType.CALL];
        code = code.substring(code.length - config.callCodeLength);

        return code;
    }
}
