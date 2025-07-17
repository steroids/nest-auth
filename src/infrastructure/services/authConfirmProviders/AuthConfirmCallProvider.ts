import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierCallOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {Inject} from '@nestjs/common';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {IAuthConfirmConfig} from '../../config';
import {IAuthConfirmProvider} from '../../../domain/interfaces/IAuthConfirmProvider';

export class AuthConfirmCallProvider implements IAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.SMS;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        let code: string;
        // Делаем дозвон пользователю
        try {
            const response = await this.notifierService.send({
                call: {
                    phone,
                    name: config.providerName,
                } as INotifierCallOptions,
            });

            code = response[NotifierProviderType.CALL];
            // Берем последние цифры из полученного кода
            code = code.substring(code.length - config.callCodeLength);
        } catch (e) {
            if (e instanceof NotifierSendException) {
                throw new ValidationException({
                    phone: 'Не удалось отправить код',
                });
            } else {
                throw e;
            }
        }

        return code;
    }
}
