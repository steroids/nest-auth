import {
    repeat as _repeat,
    random as _random,
    padStart as _padStart,
} from 'lodash';
import {formatISO9075, addSeconds, addMinutes} from 'date-fns';
import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {validateOrReject} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {INotifierCallOptions, INotifierSmsOptions, INotifierVoiceMessageOptions}
    from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierSmscVoiceType} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSmscVoiceType';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {IAuthConfirmRepository} from '../interfaces/IAuthConfirmRepository';
import {AuthConfirmModel} from '../models/AuthConfirmModel';
import {AuthConfirmSearchInputDto} from '../dtos/AuthConfirmSearchInputDto';
import {AuthConfirmSaveInputDto} from '../dtos/AuthConfirmSaveInputDto';
import {AuthConfirmSendSmsDto} from '../dtos/AuthConfirmSendSmsDto';
import {AuthConfirmLoginDto} from '../dtos/AuthConfirmLoginDto';
import {AuthService} from './AuthService';
import {UserRegistrationDto} from '../dtos/UserRegistrationDto';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IAuthModuleConfig} from '../../infrastructure/config';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {ContextDto} from '../dtos/ContextDto';

export interface IAuthConfirmServiceConfig {
    expireMins: number,
    repeatLimitSec: number,
    attemptsCount: number,
    smsCodeLength: number,
    callCodeLength: number,
    isEnableDebugStaticCode: boolean,
    providerName: string,
    voice: INotifierSmscVoiceType,
    providerType: 'call' | 'sms' | 'voice',
    messageTemplate: string,
}

export const generateCode = (length = 6) => {
    length = Math.min(32, Math.max(1, length));
    return _padStart(_random(0, (10 ** length) - 1), length, '0');
};

export class AuthConfirmService extends CrudService<AuthConfirmModel,
    AuthConfirmSearchInputDto, AuthConfirmSaveInputDto> {
    protected modelClass = AuthConfirmModel;

    constructor(
        public repository: IAuthConfirmRepository,
        protected readonly notifierService: INotifierService,
        protected readonly userService: IUserService,
        protected readonly authService: AuthService,
    ) {
        super();
    }

    protected async sendCall(config: IAuthConfirmServiceConfig, phone: string) {
        let code;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.callCodeLength);
        } else {
            // Делаем дозвон пользователю
            const response = await this.notifierService.send({
                call: {
                    phone,
                    name: config.providerName,
                } as INotifierCallOptions,
            });

            code = response[NotifierProviderType.CALL];

            // Берем последние цифры из полученного кода
            code = code.substring(code.length - config.callCodeLength);
        }

        return code;
    }

    protected async sendSms(config: IAuthConfirmServiceConfig, phone: string) {
        let code;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.smsCodeLength);
        } else {
            // Отправляем смс код
            code = generateCode(config.smsCodeLength);

            try {
                await this.notifierService.send({
                    sms: {
                        phone,
                        message: config.messageTemplate
                            .replace('{code}', code)
                            .replace('{appTitle}', ModuleHelper.getConfig<IAppModuleConfig>(AppModule).title),
                        name: config.providerName,
                    } as INotifierSmsOptions,
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
        }
        return code;
    }

    protected async sendVoiceMessage(config: IAuthConfirmServiceConfig, phone: string) {
        let code;
        if (config.isEnableDebugStaticCode) {
            code = _repeat('1', config.smsCodeLength);
        } else {
            code = generateCode(config.smsCodeLength);
            const pronunciationCode = code.split('').join(' '); // Чтобы проговорил цифры кода, а не число из цифр

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
        }
        return code;
    }

    async sendCode(
        dto: AuthConfirmSendSmsDto,
        providerType: string | null,
        context: ContextDto,
        schemaClass = null,
    ): Promise<AuthConfirmModel> {
        await validateOrReject(dto);

        // Инициализируем конфиг
        const config: IAuthConfirmServiceConfig = {
            expireMins: 60,
            repeatLimitSec: 60,
            attemptsCount: 5,
            smsCodeLength: 4,
            callCodeLength: 4,
            isEnableDebugStaticCode: false,
            providerName: 'smsc',
            providerType: 'voice',
            messageTemplate: 'Ваш код авторизации в {appTitle} - {code}',
            voice: 'm',
            ...ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).confirm,
        };
        if (!config.providerName) {
            throw new Error('Wrong configuration, please set "confirm.providerName" param.');
        }

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

        // Генерируем код и отправляем смс или звоним
        let code;
        let providerName;
        switch (providerType) {
            case NotifierProviderType.CALL:
                try {
                    code = await this.sendCall(config, dto.phone);
                    providerName = NotifierProviderType.CALL;
                } catch (e) {
                    if (e instanceof NotifierSendException) {
                        code = await this.sendSms(config, dto.phone);
                        providerName = NotifierProviderType.SMS;
                    }
                }

                break;

            case NotifierProviderType.SMS:
                code = await this.sendSms(config, dto.phone);
                providerName = NotifierProviderType.SMS;
                break;

            case NotifierProviderType.VOICE:
                code = await this.sendVoiceMessage(config, dto.phone);
                providerName = NotifierProviderType.VOICE;
                break;

            default:
                throw new Error('Wrong provider type: ' + providerType);
        }

        if (!code) {
            throw new Error('Code is not generated, provider type: ' + providerType);
        }

        // Сохраняем в БД
        const model = await this.repository.create(
            DataMapper.create(AuthConfirmModel, {
                phone: dto.phone,
                code,
                providerName,
                expireTime: formatISO9075(addMinutes(new Date(), config.expireMins)),
                lastSentTime: formatISO9075(new Date()),
                attemptsCount: config.attemptsCount,
                userId: user?.id || null,
                ipAddress: context?.ipAddress,
            } as AuthConfirmModel),
        );

        return schemaClass ? DataMapper.create(schemaClass, model) : model;
    }

    async confirmCode(dto: AuthConfirmLoginDto, schemaClass = null) {
        // Валидация кода происходит в PhoneCodeAuthGuard

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

        // Создаем пользователя, если такого еще нет
        if (!authConfirmModel.user) {
            authConfirmModel.user = await this.authService.registration(
                DataMapper.create(UserRegistrationDto, {
                    phone: authConfirmModel.phone,
                }),
            );
        }

        // Авторизуемся
        const authUserDto = await this.authService.createAuthUserDto(
            this.authService.createTokenPayload(authConfirmModel.user),
        );
        const loginModel = await this.authService.login(authUserDto);

        return schemaClass ? DataMapper.create(schemaClass, loginModel) : loginModel;
    }
}
