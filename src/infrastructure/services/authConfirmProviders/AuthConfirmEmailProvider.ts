import {
    INotifierMailOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
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
export class AuthConfirmEmailProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
        @Inject(GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN)
        protected readonly getAuthConfirmTargetFieldUseCase: IGetAuthConfirmTargetFieldUseCase,
    ) {
        super(notifierService, getAuthConfirmTargetFieldUseCase);
    }

    readonly type = AuthConfirmProviderTypeEnum.EMAIL;

    async generateAndSendCode(config: IAuthConfirmConfig, email: string): Promise<string> {
        const code = generateCode(config.codeLength);

        await this.sendCode({
            mail: {
                to: email,
                text: config.messageTemplate
                    .replace('{code}', `${code}`)
                    .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title),
            } as INotifierMailOptions,
        });

        return code;
    }
}
