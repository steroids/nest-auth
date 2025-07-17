import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierCallOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {Inject} from '@nestjs/common';
import {IAuthConfirmProvider} from '../../interfaces/IAuthConfirmProvider';
import {IAuthConfirmConfig} from '../../../infrastructure/config';

export class AuthConfirmSmsProvider implements IAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.SMS;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        let code: string;
        // Делаем дозвон пользователю
        const response = await this.notifierService.send({
            call: {
                phone,
                name: config.providerName,
            } as INotifierCallOptions,
        });

        code = response[NotifierProviderType.CALL];

        // Берем последние цифры из полученного кода
        code = code.substring(code.length - config.callCodeLength);

        return code;
    }
}
