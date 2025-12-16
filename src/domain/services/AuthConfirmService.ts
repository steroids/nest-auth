import {
    repeat as _repeat,
    random as _random,
    padStart as _padStart,
} from 'lodash';
import {formatISO9075, addSeconds, addMinutes} from 'date-fns';
import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {IAuthConfirmRepository} from '../interfaces/IAuthConfirmRepository';
import {AuthConfirmModel} from '../models/AuthConfirmModel';
import {AuthConfirmSearchInputDto} from '../dtos/AuthConfirmSearchInputDto';
import {AuthConfirmLoginDto} from '../dtos/AuthConfirmLoginDto';
import {IAuthConfirmConfig, IAuthModuleConfig} from '../../infrastructure/config';
import {AUTH_CONFIRM_PROVIDERS_TOKEN, IAuthConfirmProvider} from '../interfaces/IAuthConfirmProvider';
import {AuthConfirmProviderTypeEnum, AuthConfirmProviderTypeEnumHelper} from '../enums/AuthConfirmProviderTypeEnum';
import {AuthConfirmSendCodeDto} from '../dtos/AuthConfirmSendCodeDto';
import {AuthConfirmSaveDto} from '../dtos/AuthConfirmSaveDto';

export const generateCode = (length = 6) => {
    length = Math.min(32, Math.max(1, length));
    return _padStart(_random(0, (10 ** length) - 1).toString(), length, '0');
};

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
        @Inject(IUserService)
        protected readonly userService: IUserService,
    ) {
        super();
    }

    async sendCode(
        dto: AuthConfirmSendCodeDto,
        providerType: AuthConfirmProviderTypeEnum | null,
        context: ContextDto,
        schemaClass = null,
    ): Promise<AuthConfirmModel> {
        await ValidationHelper.validate(dto, {context});
        const config: IAuthConfirmConfig = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).confirm;

        if (!providerType) {
            providerType = config.providerType;
        }

        const targetField = AuthConfirmProviderTypeEnumHelper.getTargetField(providerType);

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
                        [targetField]: dto.target,
                        isConfirmed: false,
                    }),
            );
            if (model) {
                return schemaClass ? DataMapper.create(schemaClass, model) : model;
            }
        }

        let code: string;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.codeLength);
        } else {
            const authConfirmProvider = this.authConfirmProviders.find(provider => provider.type === providerType);
            if (!authConfirmProvider) {
                throw new Error('Wrong provider type: ' + providerType);
            }

            code = await authConfirmProvider.generateAndSendCode(config, dto.target);

            if (!code) {
                throw new Error('Code is not sent, provider type: ' + providerType);
            }
        }

        // Сохраняем в БД
        const model = await this.repository.create(
            DataMapper.create(AuthConfirmModel, {
                [targetField]: dto.target,
                code,
                providerName: providerType,
                expireTime: formatISO9075(addMinutes(new Date(), config.expireMins)),
                lastSentTime: formatISO9075(new Date()),
                attemptsCount: config.attemptsCount,
                userId: dto.userId || null,
                ipAddress: context?.ipAddress,
            }),
        );

        return schemaClass ? DataMapper.create(schemaClass, model) : model;
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
