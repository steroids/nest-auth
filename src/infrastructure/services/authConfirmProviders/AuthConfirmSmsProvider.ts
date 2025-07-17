import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierSmsOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {Inject} from '@nestjs/common';
import {generateCode} from '../../../domain/services/AuthConfirmService';
import {IAuthConfirmConfig} from '../../config';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

export class AuthConfirmSmsProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
        super(notifierService);
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.CALL;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        // Отправляем смс код
        const code = generateCode(config.smsCodeLength);

        await this.sendInternal({
            sms: {
                phone,
                message: config.messageTemplate
                    .replace('{code}', code)
                    .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title),
                name: config.providerName,
            } as INotifierSmsOptions,
        });

        return code;
    }
}
