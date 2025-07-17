import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierSmsOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {Inject} from '@nestjs/common';
import {IAuthConfirmProvider} from '../../interfaces/IAuthConfirmProvider';
import {generateCode} from '../AuthConfirmService';
import {IAuthConfirmConfig} from '../../../infrastructure/config';

export class AuthConfirmCallProvider implements IAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.CALL;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        // Отправляем смс код
        const code = generateCode(config.smsCodeLength);

        try {
            await this.notifierService.send({
                sms: {
                    phone,
                    message: config.messageTemplate
                        .replace('{code}', code)
                        .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title),
                    name: config.providerName,
                } as INotifierSmsOptions,
            });
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
