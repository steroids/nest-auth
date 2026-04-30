import {repeat as _repeat} from 'lodash';
import {addMinutes, addSeconds, formatISO9075} from 'date-fns';
import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IType} from '@steroidsjs/nest/usecases/interfaces/IType';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {IAuthConfirmRepository} from '../interfaces/IAuthConfirmRepository';
import {AuthConfirmModel} from '../models/AuthConfirmModel';
import {AuthConfirmSearchInputDto} from '../dtos/AuthConfirmSearchInputDto';
import {AuthConfirmLoginDto} from '../dtos/AuthConfirmLoginDto';
import {IAuthConfirmConfig, IAuthModuleConfig} from '../../infrastructure/config';
import {AUTH_CONFIRM_PROVIDERS_TOKEN, IAuthConfirmProvider} from '../interfaces/IAuthConfirmProvider';
import {AuthConfirmSendCodeDto} from '../dtos/AuthConfirmSendCodeDto';
import {AuthConfirmSaveDto} from '../dtos/AuthConfirmSaveDto';
import {AuthConfirmProviderType} from '../types/AuthConfirmProviderType';
import {
    AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN,
    IAuthConfirmTargetValidator,
} from '../interfaces/IAuthConfirmTargetValidator';

export interface IResolvedAuthConfirmTarget {
    providerType: AuthConfirmProviderType,
    target: string,
    validator: IAuthConfirmTargetValidator,
}

@Injectable()
export class AuthConfirmService extends CrudService<
    AuthConfirmModel,
    AuthConfirmSearchInputDto,
    AuthConfirmSaveDto
> {
    protected modelClass = AuthConfirmModel;

    constructor(
        @Inject(IAuthConfirmRepository)
        public repository: IAuthConfirmRepository,
        @Inject(AUTH_CONFIRM_PROVIDERS_TOKEN)
        protected readonly authConfirmProviders: IAuthConfirmProvider[],
        @Inject(AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN)
        protected readonly authConfirmTargetValidators: IAuthConfirmTargetValidator[],
    ) {
        super();
    }

    getTargetValidator(providerType: AuthConfirmProviderType): IAuthConfirmTargetValidator {
        const targetValidator = this.authConfirmTargetValidators
            .find(validator => validator.providerTypes.includes(providerType));

        if (!targetValidator) {
            throw new Error('Wrong provider type: ' + providerType);
        }

        return targetValidator;
    }

    async resolveTarget(providerType: AuthConfirmProviderType, target: string): Promise<IResolvedAuthConfirmTarget> {
        const targetValidator = this.getTargetValidator(providerType);

        return {
            providerType,
            validator: targetValidator,
            target: await targetValidator.validate(target),
        };
    }

    async sendCode<TSchema>(
        dto: AuthConfirmSendCodeDto,
        providerType: AuthConfirmProviderType,
        context: ContextDto,
        schemaClass: IType<TSchema> | null,
        resolvedTarget?: IResolvedAuthConfirmTarget,
    ): Promise<AuthConfirmModel> {
        await ValidationHelper.validate(dto, {context});
        const config: IAuthConfirmConfig = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).confirm;
        resolvedTarget = resolvedTarget || await this.resolveTarget(providerType, dto.target);

        // Не отправляем повторно смс, если она была отправлена недавно. Используем ту же модель
        // TODO Не уверен насколько это правильная логика.. Нужно подумать.
        if (config.repeatLimitSec > 0) {
            const model = await this.findOne(
                (new SearchQuery<AuthConfirmModel>())
                    .with('user')
                    .where([
                        '>=',
                        'lastSentTime',
                        formatISO9075(addSeconds(new Date(), -1 * config.repeatLimitSec)),
                    ])
                    .andWhere({
                        target: resolvedTarget.target,
                        isConfirmed: false,
                    }),
            );
            if (model) {
                return schemaClass ? DataMapper.create(schemaClass as unknown as any, model) : model;
            }
        }

        let code: string;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.codeLength);
        } else {
            const authConfirmProvider = this.authConfirmProviders.find(provider => provider.type === resolvedTarget.providerType);
            if (!authConfirmProvider) {
                throw new Error('Wrong provider type: ' + resolvedTarget.providerType);
            }

            code = await authConfirmProvider.generateAndSendCode(config, resolvedTarget.target);

            if (!code) {
                throw new Error('Code is not sent, provider type: ' + resolvedTarget.providerType);
            }
        }

        // Сохраняем в БД
        const model = await this.repository.create(
            DataMapper.create(AuthConfirmModel, {
                target: resolvedTarget.target,
                code,
                providerName: resolvedTarget.providerType,
                expireTime: formatISO9075(addMinutes(new Date(), config.expireMins)),
                lastSentTime: formatISO9075(new Date()),
                attemptsCount: config.attemptsCount,
                userId: dto.userId || null,
                ipAddress: context?.ipAddress,
            }),
        );

        return schemaClass ? DataMapper.create(schemaClass as unknown as any, model) : model;
    }

    async confirmCode(dto: AuthConfirmLoginDto) {
        // Валидация кода происходит в CodeAuthGuard
        const authConfirmModel = await this.createQuery()
            .where({uid: dto.uid})
            .one();

        // Делаем отметку, что код подтвержден
        const saveDto = DataMapper.create(AuthConfirmSaveDto, {
            ...authConfirmModel,
            isConfirmed: true,
        });
        return this.update(authConfirmModel.id, saveDto);
    }
}
