# Steroids Nest Migration Guide

## Unreleased

### Переход `AuthConfirmModel` на единый `target`

Поля `email` и `phone` в `AuthConfirmModel`, `AuthConfirmSaveDto`, `AuthConfirmSaveInputDto` и
`AuthConfirmSchema` заменены единым полем `target`. Канал отправки по-прежнему определяется полем
`providerName`.

При обновлении проекта создайте миграцию таблицы `AuthConfirmTable` в следующем порядке:

1. Добавьте nullable-колонку `target`.
2. Перенесите в неё значения из `email` для email-провайдера и из `phone` для телефонных провайдеров
   (`call`, `sms`, `voice`).
3. Убедитесь, что у всех сохраняемых записей заполнен `target`, и сделайте колонку обязательной.
4. Удалите колонки `email` и `phone`.

Если исторические записи подтверждений сохранять не требуется, вместо переноса данных можно удалить
старые колонки и сразу создать обязательную колонку `target`.

В коде приложения замените обращения к `AuthConfirmModel.email` и `AuthConfirmModel.phone` на
`AuthConfirmModel.target`. То же относится к кастомным DTO, схемам, запросам и переопределениям
`AuthConfirmService`.

### Обработка target и кастомные провайдеры

`GetAuthConfirmTargetFieldUseCase`, `IGetAuthConfirmTargetFieldUseCase` и токен
`GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN` удалены. Определение поля пользователя, нормализация и
валидация target теперь выполняются через `AuthConfirmTargetService`.

Для стандартных провайдеров уже зарегистрированы
[email-валидатор](../src/infrastructure/services/authConfirmTargetValidators/EmailAuthConfirmTargetValidator.ts)
и [phone-валидатор](../src/infrastructure/services/authConfirmTargetValidators/PhoneAuthConfirmTargetValidator.ts).
Если приложение добавляет собственный провайдер подтверждения, для него необходимо реализовать
`IAuthConfirmTargetValidator` и зарегистрировать реализацию в `AUTH_CONFIRM_TARGET_VALIDATORS_TOKEN`:

```ts
export interface IAuthConfirmTargetValidator {
    readonly providerTypes: AuthConfirmProviderType[];
    readonly targetField: AuthConfirmTargetField;
    normalize(target: string): string;
    validate(target: string): Promise<void> | void;
}
```

Стандартный тип `AuthConfirmTargetField` содержит поля `email` и `phone` из `UserModel`. Если модель
пользователя в приложении расширена дополнительным полем, например `tg`, и это поле используется как target,
можно взять `AuthConfirmTargetField` за основу и определить собственный тип:

```ts
export type AppAuthConfirmTargetField = Extract<
    keyof AppUserModel,
    AuthConfirmTargetField | 'tg'
>;
```

Затем этот тип следует использовать для `targetField` в валидаторе нового канала:

```ts
export class TgAuthConfirmTargetValidator implements Omit<IAuthConfirmTargetValidator, 'targetField'> {
    readonly providerTypes: AuthConfirmProviderType[] = ['tg'];

    readonly targetField: AppAuthConfirmTargetField = 'tg';

    normalize(target: string): string {
        return target.trim().replace(/^@/, '');
    }

    validate(target: string): void {
        if (!target) {
            throw new ValidationException({
                target: 'Некорректный Telegram username',
            });
        }
    }
}
```

Аналогично можно добавить любое другое поле модели пользователя. Использование `Extract` сохраняет связь
типа с реально существующими полями модели, в отличие от обычного строкового union.

`targetField` определяет поле пользователя, по которому выполняется поиск, `normalize` приводит target к
формату хранения, а `validate` проверяет полученное значение. Асинхронная валидация поддерживается.

## [0.8.0](../CHANGELOG.md#080-2026-08-11) (2026-08-11)

### Поддержка NestJS 11

Версия `0.8.0` пакета `@steroidsjs/nest-auth` одновременно поддерживает NestJS 10 и NestJS 11.
Обновление пакета не требует обязательного перехода на NestJS 11: проекты на NestJS 10 могут сохранить текущую major-версию NestJS и совместимые с ней версии интеграционных пакетов.

Для перехода приложения на NestJS 11 обновите NestJS- и auth-зависимости согласованно:

```json
{
  "dependencies": {
    "@nestjs/cli": "^11.0.24",
    "@nestjs/common": "^11.1.28",
    "@nestjs/core": "^11.1.28",
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/swagger": "^11.4.6",
    "@nestjs/testing": "^11.1.28"
  },
  "devDependencies": {
    "@types/express": "^5.0.6"
  }
}
```

NestJS 11 требует Node.js 20 или новее, а Nest CLI 11 — Node.js 20.11 или новее.

Перед обновлением `@steroidsjs/nest-auth` также необходимо:

1. Обновить `@steroidsjs/nest` до версии, в которой добавлена поддержка NestJS 11.
2. Проверить `peerDependencies` остальных NestJS- и `@steroidsjs/*`-пакетов приложения.
3. Не смешивать разные major-версии `@nestjs/common`, `@nestjs/core`, `@nestjs/testing` и HTTP-адаптера.
4. Для NestJS 11 использовать JWT 11 и Passport adapter 11; их предыдущие major-версии не заявляют поддержку NestJS 11.

Для проекта, который остаётся на NestJS 10, используются JWT 10, Passport adapter 10 и Swagger 8. `peerDependencies` нового релиза допускают обе согласованные комбинации.

### Переход на Express 5

`@nestjs/platform-express` использует Express 4 в NestJS 10 и Express 5 в NestJS 11.
`@steroidsjs/nest-auth` больше не устанавливает собственную версию Express и не добавляет Express 4 в дерево зависимостей приложения на NestJS 11.

Если приложение добавляло `express` только ради типов `Request` и `Response`, прямую runtime-зависимость можно удалить. При переходе на NestJS 11 оставьте типы Express 5 и используйте type-only imports:

```ts
import type {Request, Response} from 'express';
```

Если проект напрямую использует runtime API Express, его собственную зависимость `express` необходимо обновить до версии 5. Также проверьте wildcard-маршруты и middleware paths: в Express 5 wildcard должен иметь имя, например `/files/*path` вместо `/files/*`.

Контроллеры, guards и Passport strategies внутри `@steroidsjs/nest-auth` используют совместимые с Express 4 и Express 5 API; дополнительных изменений их конфигурации не требуется.

### Использование JWT из cookie

Добавлен `AuthCookieController` с эндпоинтами:

- `POST /auth/cookie/login` — записывает access и refresh JWT в cookies;
- `POST /auth/cookie/refresh` — читает refresh token из cookie и обновляет access token;
- `POST /auth/cookie/logout` — завершает сессию и очищает обе cookies;
- `POST /auth/cookie/update-password` — меняет пароль и очищает обе cookies.

В `AuthPhoneController` также добавлен эндпоинт `POST /auth/phone/confirm/cookie`, который проверяет
код подтверждения, авторизует пользователя и записывает access и refresh JWT в cookies.

Ответы cookie-эндпоинтов формируются через `AuthCookieLoginSchema` и не содержат сами токены.
Access token для защищённых эндпоинтов теперь можно передавать в cookie `accessToken`; способы передачи
через заголовок `Authorization` и query-параметр `token` продолжают работать. Refresh token читается из
cookie `refreshToken`.

Настройте `jwtCookie` в конфигурации `AuthModule` под требования приложения:

```ts
jwtCookie: {
    secure: true,
    sameSite: 'lax',
    path: '/',
    domain: '.example.com', // При необходимости.
    signed: true,
},
```

Для `jwtCookie` поддерживаются параметры `signed`, `path`, `domain`, `secure` и `sameSite`.
По умолчанию используются `secure: false` в dev-окружении (`true` в остальных окружениях),
`sameSite: 'lax'` и `path: '/'`; флаг `httpOnly` всегда включён. Срок действия каждой cookie
соответствует сроку действия записанного в неё JWT.

Для подписанных cookies передайте `jwtCookie.signed: true` в конфигурации `AuthModule` и задайте
`cookieSecret` в конфигурации `AppModule` из `@steroidsjs/nest`. Подписанные cookies читаются из
`request.signedCookies`, неподписанные — из `request.cookies`. Для чтения cookies в собственных
контроллерах можно использовать декоратор `@Cookies(<cookieName>)`; установкой и очисткой JWT
занимается `AuthCookieService`.

### Публичные типы `@nestjs/jwt`

`SessionService` больше не импортирует `JwtSignOptions` и `JwtVerifyOptions` из закрытого пути `@nestjs/jwt/dist/interfaces/jwt-module-options.interface`. Все JWT-типы теперь импортируются из публичного API `@nestjs/jwt`:

```ts
import {
    JwtService,
    JwtSignOptions,
    JwtVerifyOptions,
} from '@nestjs/jwt';
```

Публичные методы `SessionService` и формат токенов не изменились. Если код приложения также использует внутренний JWT-import, его рекомендуется заменить аналогичным публичным импортом.

## [0.7.0](../CHANGELOG.md#070-2026-07-23) (2026-07-23)

### Переход с TypeORM-форков на оригинальные пакеты

Пакеты `@steroidsjs/typeorm` и `@steroidsjs/nest-typeorm` больше не используются.
Они заменены на `typeorm@^1.1.0` и `@nestjs/typeorm@^11.0.3`.

При обновлении:

1. Удалите `@steroidsjs/typeorm` и `@steroidsjs/nest-typeorm` из зависимостей проекта.
2. Добавьте `typeorm@^1.1.0` и `@nestjs/typeorm@^11.0.3`.
3. Замените импорты:
   - `@steroidsjs/typeorm` на `typeorm`;
   - `@steroidsjs/nest-typeorm` на `@nestjs/typeorm`;
   - внутренние импорты наподобие `@steroidsjs/typeorm/commands/CommandUtils` на соответствующие импорты из `typeorm`.
4. Проверьте существующие миграции и собственные генераторы миграций: `MigrationInterface`, `QueryRunner`
   и другие TypeORM-типы также должны импортироваться из `typeorm`.
5. Обновите lock-файл после замены зависимостей.

### Обновление NestJS

Минимальные версии NestJS-зависимостей приведены в соответствие с `@steroidsjs/nest@^5.0.0-beta.1`:

- `@nestjs/common@^10.4.19`;
- `@nestjs/core@^10.4.19`;
- `@nestjs/testing@^10.4.19`;
- `@nestjs/typeorm@^11.0.3`.

Перед обновлением `@steroidsjs/nest-auth` обновите эти зависимости в приложении и убедитесь,
что остальные NestJS-модули проекта совместимы с NestJS 10.

## [0.6.0](../CHANGELOG.md#060-2026-06-26) (2026-06-26)

### Проверка новых permissions при старте приложения

Добавлена опциональная проверка новых permissions по флагу `AUTH_CHECK_NEW_PERMISSIONS`.
Если флаг включен и в коде есть permissions, которых еще нет в таблице `auth_permission`,
приложение завершит старт с ошибкой. Для migrate-команд проверка всегда отключена.

Если в проекте включается `AUTH_CHECK_NEW_PERMISSIONS`, перед запуском приложения необходимо
сгенерировать и применить миграцию permissions через `migrate:generate-permissions`.

Для форматирования SQL в генерируемых миграциях добавлена peer-зависимость `@sqltools/formatter`.
Если пакетный менеджер проекта не устанавливает peer-зависимости автоматически, добавьте ее в проект явно.

### Сужение ответа эндпоинтов /login и /refresh

Эндпоинты `/auth/login` и `/auth/refresh` теперь возвращают только `accessToken`,
`accessExpireTime`, `refreshToken`, `refreshExpireTime`. Служебные поля модели больше не включены в ответ.

Если в проекте используется чтение этих полей из ответа, необходимо обновить схему ответа.

## [0.5.0](../CHANGELOG.md#050-2026-05-04) (2026-05-04)

### Валидаторы смены собственного пароля

Регистрация провайдеров внутри модуля больше не использует deprecated `ModuleHelper.provide`.
Валидаторы для `AuthUpdateUserOwnPasswordUseCase` теперь собираются через токен
`AUTH_UPDATE_PASSWORD_VALIDATORS_TOKEN`.

Если в проекте переопределяется `AuthUpdateUserOwnPasswordUseCase` или список валидаторов смены пароля,
обновите DI-конфигурацию: передавайте массив валидаторов через `AUTH_UPDATE_PASSWORD_VALIDATORS_TOKEN`.
Стандартный `PasswordValidator` уже зарегистрирован в пакете.

## [0.4.0](../CHANGELOG.md#040-2026-03-25) (2026-03-25)

### Рефакторинг отправки кода в AuthConfirmService

Если в проекте был переопределён класс `AuthConfirmService`, то стоит делегировать логику отправки кода
провайдерам, массив которых (`authConfirmProviders`) провайдится по токену `AUTH_CONFIRM_PROVIDERS_TOKEN`.
Сейчас есть провайдеры для следующих типов отправки кода:
- `call` - `AuthConfirmCallProvider`
- `sms` - `AuthConfirmSmsProvider`
- `voice` - `AuthConfirmVoiceProvider`

Для кастомизации логики можно переопределить существующий провайдер или создать собственный. 
Новый провайдер должен наследоваться от `BaseAuthConfirmProvider` либо реализовывать интерфейс `IAuthConfirmProvider`.

Для получения поля из пользователя, которое надо взять для отправки кода подтверждения
(например, `phone` или `email`), нужно использовать `IGetAuthConfirmTargetFieldUseCase`, который провайдится по токену `GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN`.

## [0.3.0](../CHANGELOG.md#030-2024-12-26) (2024-12-26)

### JwtAuthGuard теперь обязательно требует токен

Если в проекте есть эндпоинты, доступ к которым должен быть открыт без токена, для них необходимо заменить JwtAuthGuard на PublicJwtAuthGuard 

## [0.1.5](../CHANGELOG.md#015-2024-02-28) (2024-02-28)

### PhoneCodeAuthGuard больше не обновляет поле AuthModel.isConfirmed

Если в проекте используется PhoneCodeAuthGuard, необходимо самостоятельно обновлять поле isConfirmed
