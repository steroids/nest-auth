import {INotifierSmsOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {Inject} from '@nestjs/common';
import {generateCode} from '../../../domain/services/AuthConfirmService';
import {IAuthConfirmConfig} from '../../config';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

export class AuthConfirmSmsProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
        super(notifierService);
    }

    readonly type: AuthConfirmProviderTypeEnum = AuthConfirmProviderTypeEnum.SMS;

    async generateAndSendCode(config: IAuthConfirmConfig, phone: string): Promise<string> {
        // Отправляем смс код
        const code = generateCode(config.codeLength);

        await this.sendCode({
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
