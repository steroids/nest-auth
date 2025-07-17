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
import {Inject} from '@nestjs/common';
import {IAuthConfirmRepository} from '../interfaces/IAuthConfirmRepository';
import {AuthConfirmModel} from '../models/AuthConfirmModel';
import {AuthConfirmSearchInputDto} from '../dtos/AuthConfirmSearchInputDto';
import {AuthConfirmSaveInputDto} from '../dtos/AuthConfirmSaveInputDto';
import {AuthConfirmSendSmsDto} from '../dtos/AuthConfirmSendSmsDto';
import {AuthConfirmLoginDto} from '../dtos/AuthConfirmLoginDto';
import {IAuthConfirmConfig, IAuthModuleConfig} from '../../infrastructure/config';
import {AuthConfirmProvidersToken, IAuthConfirmProvider} from '../interfaces/IAuthConfirmProvider';
import {AuthService} from './AuthService';

export const generateCode = (length = 6) => {
    length = Math.min(32, Math.max(1, length));
    return _padStart(_random(0, (10 ** length) - 1).toString(), length, '0');
};

export class AuthConfirmService extends CrudService<AuthConfirmModel,
    AuthConfirmSearchInputDto, AuthConfirmSaveInputDto> {
    protected modelClass = AuthConfirmModel;

    constructor(
        @Inject(IAuthConfirmRepository)
        public repository: IAuthConfirmRepository,
        @Inject(AuthConfirmProvidersToken)
        protected readonly authConfirmProviders: IAuthConfirmProvider[],
        @Inject(IUserService)
        protected readonly userService: IUserService,
        @Inject(AuthService)
        protected readonly authService: AuthService,
    ) {
        super();
    }

    async sendCode(
        dto: AuthConfirmSendSmsDto,
        providerType: string | null,
        context: ContextDto,
        schemaClass = null,
    ): Promise<AuthConfirmModel> {
        await ValidationHelper.validate(dto, {context});
        const config: IAuthConfirmConfig = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).confirm;

        if (!providerType) {
            providerType = config.providerType;
        }

        // Получаем пользователя по номеру телефона
        const user = await this.userService.findByLogin(dto.phone);

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
                        phone: dto.phone,
                        isConfirmed: false,
                    }),
            );
            if (model) {
                return schemaClass ? DataMapper.create(schemaClass, model) : model;
            }
        }

        let code: string;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.smsCodeLength);
        }

        const authConfirmProvider = this.authConfirmProviders.find(provider => provider.notifierProviderType === providerType);
        if (!authConfirmProvider) {
            throw new Error('Wrong provider type: ' + providerType);
        }

        code = await authConfirmProvider.send(config, dto.phone);

        if (!code) {
            throw new Error('Code is not generated, provider type: ' + providerType);
        }

        // Сохраняем в БД
        const model = await this.repository.create(
            DataMapper.create(AuthConfirmModel, {
                phone: dto.phone,
                code,
                providerName: providerType,
                expireTime: formatISO9075(addMinutes(new Date(), config.expireMins)),
                lastSentTime: formatISO9075(new Date()),
                attemptsCount: config.attemptsCount,
                userId: user?.id || null,
                ipAddress: context?.ipAddress,
            } as AuthConfirmModel),
        );

        return schemaClass ? DataMapper.create(schemaClass, model) : model;
    }

    async confirmCode(dto: AuthConfirmLoginDto, context: ContextDto, schemaClass = null) {
        // Валидация кода происходит в CodeAuthGuard

        const authConfirmModel = await this.findOne(
            (new SearchQuery<AuthConfirmModel>())
                .with('user')
                .where({
                    uid: dto.uid,
                }),
        );

        // Делаем отмету, что код подтвержден
        authConfirmModel.isConfirmed = true;
        await this.update(authConfirmModel.id, authConfirmModel);

        // Авторизуемся
        const authUserDto = await this.authService.createAuthUserDto(
            this.authService.createTokenPayload(authConfirmModel.user),
        );
        const loginModel = await this.authService.login(authUserDto, context);

        return schemaClass ? DataMapper.create(schemaClass, loginModel) : loginModel;
    }
}
