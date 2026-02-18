import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierCallOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {Inject, Injectable} from '@nestjs/common';
import {IAuthConfirmConfig} from '../../config';
import {AuthConfirmProviderTypeEnum} from '../../../domain/enums/AuthConfirmProviderTypeEnum';
import {
    GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN,
    IGetAuthConfirmTargetFieldUseCase,
} from '../../../usecases/getAuthConfirmTargetField/IGetAuthConfirmTargetFieldUseCase';
import {BaseAuthConfirmProvider} from './BaseAuthConfirmProvider';

@Injectable()
export class AuthConfirmCallProvider extends BaseAuthConfirmProvider {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
        @Inject(GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN)
        protected readonly getAuthConfirmTargetFieldUseCase: IGetAuthConfirmTargetFieldUseCase,
    ) {
        super(notifierService, getAuthConfirmTargetFieldUseCase);
    }

    readonly type = AuthConfirmProviderTypeEnum.CALL;

    async generateAndSendCode(config: IAuthConfirmConfig, phone: string): Promise<string> {
        const response = await this.sendCode({
            call: {
                phone,
                name: config.providerName,
            } as INotifierCallOptions,
        });

        let code = response[NotifierProviderType.CALL];
        code = code.substring(code.length - config.codeLength);

        return code;
    }
}
