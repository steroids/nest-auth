import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierSendOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {IAuthConfirmConfig} from 'src/infrastructure/config';
import {IAuthConfirmProvider} from '../../../domain/interfaces/IAuthConfirmProvider';

export abstract class BaseAuthConfirmProvider implements IAuthConfirmProvider {
    protected constructor(
        protected readonly notifierService: INotifierService,
    ) {
    }

    abstract readonly notifierProviderType: NotifierProviderType;

    abstract send(config: IAuthConfirmConfig, target: string): Promise<string>;

    protected async sendInternal(options: Partial<INotifierSendOptions>, exceptionFieldName = 'phone') {
        try {
            return await this.notifierService.send(options);
        } catch (e) {
            if (e instanceof NotifierSendException) {
                throw new ValidationException({
                    [exceptionFieldName]: 'Не удалось отправить код',
                });
            }
            throw e;
        }
    }
}
