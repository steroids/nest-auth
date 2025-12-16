import {INotifierVoiceMessageOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {Inject} from '@nestjs/common';
import {generateCode} from '../../../domain/services/AuthConfirmService';
import {IAuthConfirmConfig} from '../../config';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

export class AuthConfirmVoiceProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
        super(notifierService);
    }

    readonly type: AuthConfirmProviderTypeEnum = AuthConfirmProviderTypeEnum.VOICE;

    async generateAndSendCode(config: IAuthConfirmConfig, phone: string): Promise<string> {
        const code = generateCode(config.codeLength);
        const pronunciationCode = code.split('')
            .join(' '); // Чтобы проговорил цифры кода, а не число из цифр

        await this.sendCode({
            voice: {
                phone,
                message: config.messageTemplate
                    .replace('{code}', `${pronunciationCode}`)
                    .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title)
                    .concat(`, повторяю, ${pronunciationCode}`),
                voice: 'm4',
            } as INotifierVoiceMessageOptions,
        });

        return code;
    }
}
