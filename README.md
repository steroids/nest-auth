# Steroids Nest: Модуль авторизации

Модуль авторизации для библиотеки [Steroids Nest](https://github.com/steroids/nest)

# Предназначение

Модуль позволяет быстро внедрить в проект функциональность, связанную с авторизацией и аутентификацией:
- JWT-авторизация
- аутентификация по почте, по номеру телефона
- подтверждение действий по коду на номер телефона
- управление сессиями пользователей
- разграничение доступа на основе ролей и их прав
- обновление пароля

# Быстрый старт

Для того чтобы подключить AuthModule в существующий проект на Steroids Nest
нужно следовать шагам, описанным ниже.

1. Определить AuthModule с конфигурацией из `@steroidsjs/nest-auth`:

```typescript
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import coreModule from '@steroidsjs/nest-auth';
import authPermissions from './permissions';
import {IAuthModuleConfig} from '../domain/interfaces/IAuthModuleConfig';
import {UserModule} from '../../user/infrastructure/UserModule';

@Module({
    ...coreModule,
    tables: [...(coreModule.tables ?? [])],
    permissions: authPermissions,
    config: authConfig,
    module: (config: IAuthModuleConfig) => {
        const module = coreModule.module(config);
        return {
            ...module,
            imports: [
                ...(module.imports ?? []), forwardRef(() => UserModule),
            ],
            controllers: [
                ...(module.controllers ?? []),
            ],
            providers: [
                ...(module.providers ?? []),
            ],
            exports: [
                ...(module.exports ?? []),
            ],
        };
    },
})
export class AuthModule {}
```

2. Так как AuthModule имеет кольцевую зависимость с UserModule, 
нужно определить и его (либо использовать существующий в проекте, 
который должен быть подобен модулю из `@steroidsjs/nest-user`):

```typescript
import coreModule from '@steroidsjs/nest-user';
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import {AuthModule} from '../../auth/infrastructure/AuthModule';

@Module({
    ...coreModule,
    module: (config) => {
        const module = coreModule.module(config);
        return {
            ...module,
            imports: [
                ...(module.imports ?? []), forwardRef(() => AuthModule),
            ],
        };
    },
})
export class UserModule {}
```

3. Импортировать эти модули в главный модуль:
```typescript
import coreModule from '@steroidsjs/nest-user';
import coreModule from '@steroidsjs/nest/infrastructure/applications/rest/config';
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import {AuthModule} from '../../auth/infrastructure/AuthModule';
import {UserModule} from '../../user/infrastructure/UserModule';

@Module({
    ...coreModule,
    module: (config) => {
        const module = coreModule.module(config);
        return {
            ...module,
            imports: [
                ...(module.imports ?? []), 
                AuthModule,
                UserModule,
            ],
        };
    },
})
export class AppModule {}
```

4. Сгенерировать и запустить миграции:

```shell
yarn cli migrate:generate
````

```shell
yarn cli migrate
```

# Устройство модуля

## Конфигурация

Конфигурация модуля определена интерфейсом `IAuthModuleConfig` 
(находится в файле `src/infrastructure/config.ts`).

`jwtAccessSecretKey?: string`

Секретный ключ для подписи  access токена (JWT).

`jwtRefreshSecretKey?: string`

Секретный ключ для подписи refresh токена (JWT).

`accessTokenExpiresSec?: string`

Время жизни access токена.

`refreshTokenExpiresSec?: string`

Время жизни refresh токена.

`filesTokenAdditionalTime?: string`

Дополнительный срок действия токена для `FilesAuthGuard`.

`confirm.expireMins?: number`

Время в минутах, через которое код подтверждения станет недействительным.

`confirm.repeatLimitSec?: number`

Время в секундах, которое ограничивает возможность повторной отправки кода.

`confirm.attemptsCount?: number`

Количество попыток ввода правильного кода подтверждения.

`confirm.smsCodeLength?: number`

Длина кода подтверждения, который отправляется пользователю через SMS.

`confirm.callCodeLength?: number`

Длина кода подтверждения для звонка.

`confirm.isEnableDebugStaticCode?: boolean`

Включение режима отладки с использованием статического кода подтверждения.

`confirm.providerName?: 'smsc' | string`

Название провайдера для отправки кодов подтверждения.

`confirm.providerType?: 'voice' | 'sms' | 'call'`

Тип провайдера для отправки кода подтверждения.

## Модели


#### AuthRoleModel

Роль в приложении. Имеет возможность наследования родительской роли.

#### AuthPermissionModel

Право доступа роли.

#### AuthLoginModel

Сессия пользователя.

#### AuthConfirmModel

Код подтверждения пользователя.

## Доменные сервисы

#### AuthLoginService

Отвечает за создание и отзыв токенов, а также за управление сессиями пользователей.
Сохраняет в базу данных информацию о сессии пользователя, включающию данные о refresh и access токенах, способе и статусе входа для конкретного пользователя.

#### AuthRoleService

Обеспечивает CRUD операции для ролей пользователей,
автокомплит ролей для фронтенда

#### AuthPermissionsService

Предназначен для работы с правами доступа ролей,
включая получение списка разрешений для заданных ролей,
проверку наличия прав доступа у ролей, создание новых прав,
получения дерева прав.

#### AuthConfirmService

Предназначен для управления процессом подтверждения пользователя при его аутентификации, используя SMS, голосовые сообщения или звонки на телефон.
Основные функции включают отправку кодов подтверждения и проверку их корректности.

#### AuthService

Обеспечивает регистрацию и аутентификацию пользователя, выход из приложения, создание DTO, который содержит информацию о текущем пользователе.

## Инфраструктурные сервисы

#### SessionService

Сервис SessionService предоставляет функциональность для работы с паролями и токенами, используя библиотеки bcryptjs и @nestjs/jwt.
Основные функции включают хеширование пароля, сравнение хешированного пароля с нехешированным, подпись и верификация JWT, извлечение данных из JWT.

## HTTP-контроллеры

#### AuthController

Содержит эндпоинты для аутентификации пользователя, выхода из приложения, обновления пароля и JWT.

#### AuthPermissionController

Содержит эндпоинты для получения дерева прав доступа приложения и прав роли.

#### AuthPhoneController

Содержит эндпоинты для отправки кода подтверждения на телефон с помощью SMS или звонка, проверки кода. Также есть эндпоинт для типа отправки, взятого из конфига.

#### AuthRoleController

Содержит эндпоинты для CRUD операций с ролями пользователей и автозаполнения для фронтенда.

## Guards

#### JwtAuthGuard

Проверяет валидность JWT переданного в заголовке Authorization.

#### LoginPasswordAuthGuard

Проверяет валидность логина и пароля из тела запроса.

#### PhoneCodeAuthGuard

Проверяет валидность кода подтверждения из тела запроса.

#### RolesAuthGuard

Проверяет наличие прав доступа пользователя к конкретному эндпоинту.

#### FilesAuthGuard

Проверяет валидность JWT переданного в заголовке Cookie.
Используется для проверки доступа к файлам.

## Декораторы

#### AuthPermissions

Проверяет права доступа, которые должны быть у пользователя, для конкретного эндпоинта.
Для проверки использует `RolesAuthGuard`.

# Расширение функциональности

Расширить или переопределить компоненты модуля можно с помощью
наследования или добавления новых классов. 
При этом переопределенный класс нужно записать в
массив `providers` после классов-провайдеров из базовой конфигурации.

Например, мы хотим переопределить метод `createAuthUserDto` в классе `AuthService`. 
Тогда сначала нужно наследовать этот класс:

```typescript
import {AuthTokenPayloadDto} from '@steroidsjs/nest-auth/domain/dtos/AuthTokenPayloadDto';
import {AuthPermissionsService} from '@steroidsjs/nest-auth/domain/services/AuthPermissionsService';
import {IUserRegistrationUseCase} from '@steroidsjs/nest-modules/user/usecases/IUserRegistrationUseCase';
import {AuthService as BaseAuthService} from '@steroidsjs/nest-auth/domain/services/AuthService';
import {AuthLoginService} from '@steroidsjs/nest-auth/domain/services/AuthLoginService';
import {ISessionService} from '@steroidsjs/nest-auth/domain/interfaces/ISessionService';
import {ForbiddenException} from '@steroidsjs/nest/usecases/exceptions';
import {AuthUserDto} from '@steroidsjs/nest-auth/domain/dtos/AuthUserDto';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';

export class AuthService extends BaseAuthService {
    constructor(
        protected readonly userService: IUserService,
        protected readonly sessionService: ISessionService,
        protected readonly authLoginService: AuthLoginService,
        protected readonly authPermissionsService: AuthPermissionsService,
        protected readonly userRegistrationUseCase: IUserRegistrationUseCase,
    ) {
        super(
            userService,
            sessionService,
            authLoginService,
            authPermissionsService,
            userRegistrationUseCase,
        );
    }

    async createAuthUserDto(payload: AuthTokenPayloadDto): Promise<AuthUserDto> {
        const user = await this.userService
            .createQuery()
            .where({
                id: payload.id,
                isBlocked: false,
            })
            .one();

        if (!user) {
            throw new ForbiddenException('Пользователь заблокирован');
        }

        return super.createAuthUserDto(paylaod);
    }
}
```

А затем в классе модуля записать `AuthService` в поле `providers` после базовых провайдеров:

```typescript
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import coreModule from '@steroidsjs/nest-auth';
import {AuthService} from '../domain/services/AuthService';

@Module({
    ...coreModule,
    module: (config) => {
        const module = coreModule.module(config);
        return {
            ...module,
            providers: [
                ...(module.providers ?? []),
                AuthService,
            ],
        };
    },
})
export class AuthModule {}
```
