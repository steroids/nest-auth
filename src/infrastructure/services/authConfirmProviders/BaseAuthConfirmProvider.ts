import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierSendOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {IAuthConfirmConfig} from 'src/infrastructure/config';
import {IAuthConfirmProvider} from '../../../domain/interfaces/IAuthConfirmProvider';
import {AuthConfirmProviderType} from '../../../domain/types/AuthConfirmProviderType';
import {IGetAuthConfirmTargetFieldUseCase} from '../../../usecases/getAuthConfirmTargetField/IGetAuthConfirmTargetFieldUseCase';

export abstract class BaseAuthConfirmProvider implements IAuthConfirmProvider {
    protected constructor(
        protected readonly notifierService: INotifierService,
        protected readonly getAuthConfirmTargetFieldUseCase: IGetAuthConfirmTargetFieldUseCase,
    ) {
    }

    abstract readonly type: AuthConfirmProviderType;

    abstract generateAndSendCode(config: IAuthConfirmConfig, target: string): Promise<string>;

    protected async sendCode(options: Partial<INotifierSendOptions>) {
        try {
            return await this.notifierService.send(options);
        } catch (e) {
            if (e instanceof NotifierSendException) {
                throw new ValidationException({
                    [this.getAuthConfirmTargetFieldUseCase.handle(this.type)]: 'Не удалось отправить код',
                });
            }
            throw e;
        }
    }
}
