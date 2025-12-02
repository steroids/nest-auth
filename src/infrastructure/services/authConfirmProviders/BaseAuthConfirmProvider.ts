import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierSendOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {IAuthConfirmConfig} from 'src/infrastructure/config';
import {IAuthConfirmProvider} from '../../../domain/interfaces/IAuthConfirmProvider';
import {AuthConfirmProviderTypeEnum, AuthConfirmProviderTypeEnumHelper} from '../../../domain/enums/AuthConfirmProviderTypeEnum';

export abstract class BaseAuthConfirmProvider implements IAuthConfirmProvider {
    protected constructor(
        protected readonly notifierService: INotifierService,
    ) {
    }

    abstract readonly type: AuthConfirmProviderTypeEnum;

    abstract generateAndSendCode(config: IAuthConfirmConfig, target: string): Promise<string>;

    protected async sendCode(options: Partial<INotifierSendOptions>) {
        try {
            return await this.notifierService.send(options);
        } catch (e) {
            if (e instanceof NotifierSendException) {
                throw new ValidationException({
                    [AuthConfirmProviderTypeEnumHelper.getTargetField(this.type)]: 'Не удалось отправить код',
                });
            }
            throw e;
        }
    }
}
