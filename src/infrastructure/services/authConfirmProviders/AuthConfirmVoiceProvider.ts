import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierVoiceMessageOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {Inject} from '@nestjs/common';
import {IAuthConfirmProvider} from '../../../domain/interfaces/IAuthConfirmProvider';
import {generateCode} from '../../../domain/services/AuthConfirmService';
import {IAuthConfirmConfig} from '../../config';

export class AuthConfirmVoiceProvider implements IAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
    }

    readonly notifierProviderType: NotifierProviderType = NotifierProviderType.VOICE;

    async send(config: IAuthConfirmConfig, phone: string): Promise<string> {
        const code = generateCode(config.smsCodeLength);
        const pronunciationCode = code.split('')
            .join(' '); // Чтобы проговорил цифры кода, а не число из цифр

        try {
            await this.notifierService.send({
                voice: {
                    phone,
                    message: config.messageTemplate
                        .replace('{code}', `${pronunciationCode}`)
                        .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title)
                        .concat(`, повторяю, ${pronunciationCode}`),
                    voice: 'm4',
                } as INotifierVoiceMessageOptions,
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
