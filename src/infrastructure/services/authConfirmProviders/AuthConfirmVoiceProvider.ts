import {INotifierVoiceMessageOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {Inject, Injectable} from '@nestjs/common';
import {IAuthConfirmConfig} from '../../config';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {generateCode} from '../../../domain/utils';
import {
    GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN,
    IGetAuthConfirmTargetFieldUseCase,
} from '../../../usecases/getAuthConfirmTargetField/IGetAuthConfirmTargetFieldUseCase';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

@Injectable()
export class AuthConfirmVoiceProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
        @Inject(GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN)
        protected readonly getAuthConfirmTargetFieldUseCase: IGetAuthConfirmTargetFieldUseCase,
    ) {
        super(notifierService, getAuthConfirmTargetFieldUseCase);
    }

    readonly type = AuthConfirmProviderTypeEnum.VOICE;

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
