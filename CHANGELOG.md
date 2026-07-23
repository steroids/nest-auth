# Steroids nest-auth Changelog

## [Unreleased](https://github.com/steroids/nest-auth/compare/0.6.0...HEAD)

[Migration guide](docs/MigrationGuide.md#unreleased)

### Changes
- Форки `@steroidsjs/typeorm` и `@steroidsjs/nest-typeorm` заменены на оригинальные пакеты `typeorm@^1.1.0` и `@nestjs/typeorm@^11.0.3`; импорты репозиториев, `DataSource`, CLI-утилит и шаблона permission migrations обновлены ([#276](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/276))
- `@steroidsjs/nest` обновлён до `^5.0.0-beta.1`, а зависимости NestJS приведены к совместимым версиям: `@nestjs/common` и `@nestjs/core` до `^10.4.19`, `@nestjs/testing` до `^10.4.19` ([#276](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/276))

## [0.6.0](https://github.com/steroids/nest-auth/compare/0.5.0...0.6.0) (2026-06-26)

[Migration guide](docs/MigrationGuide.md#060-2026-06-26)

### Features
- Добавлена проверка новых permissions (которые есть в коде, но нет в БД) при старте приложения по флагу `AUTH_CHECK_NEW_PERMISSIONS`, при migrate-командах она всегда отключена ([#155](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/155))
- Добавлен email-провайдер кодов подтверждения: `AuthConfirmProviderTypeEnum.EMAIL`, `AuthConfirmEmailProvider` и эндпоинты `/auth/email/send`, `/auth/email/confirm` ([#83](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/83))
- Добавлена peer-зависимость `@sqltools/formatter` для форматирования SQL в генерируемых permission migrations ([#155](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/155))

### Changes
- Ответы эндпоинтов `/auth/login` и `/auth/refresh` теперь приводятся к `AuthLoginSchema` и не содержат служебные поля модели ([#261](https://gitlab.kozhindev.com/steroids/steroids-nest/-/work_items/261))

## [0.5.0](https://github.com/steroids/nest-auth/compare/0.4.0...0.5.0) (2026-05-04)

[Migration guide](docs/MigrationGuide.md#041-2026-05-04)

### Features
- Добавлена команда `migrate:generate-permissions` для генерации миграции с новыми permissions, которых еще нет в таблице `auth_permission`([#247](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/247))
- Добавлены peer-зависимости `@nestjs/cli` и `nestjs-command`, необходимые для работы команды генерации permission migration ([#247](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/247))

### Fixes
- При отправке кода авторизации для несуществующего пользователя теперь выбрасывается `NotFoundException` вместо обычного `Error` ([#209](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/209))
- Удалено использование deprecated `ModuleHelper.provide` при регистрации провайдеров внутри модуля ([#159](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/159))
- Валидаторы смены собственного пароля теперь собираются через токен `AUTH_UPDATE_PASSWORD_VALIDATORS_TOKEN` ([#159](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/159))

## [0.4.0](https://github.com/steroids/nest-auth/compare/0.3.0...0.4.0) (2026-03-25)

[Migration guide](docs/MigrationGuide.md#040-2026-03-25)

### Features
- Отправка кода по разным каналам была вынесена из `AuthConfirmService` в `authConfirmProviders`, которые провайдятся токеном `AUTH_CONFIRM_PROVIDERS_TOKEN`

### Fixes
- Замена ts-типа `Date` на `string` у полей с `DateTimeField` или `StringField` декоратором
- Функция `generateCode` вынесена из `domain/services/AuthConfirmService.ts` в `domain/utils/index.ts`
- Добавлен `GetAuthConfirmTargetFieldUseCase` для получения поля из пользователя, которое надо взять для отправки кода подтверждения, провайдится по токену `GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN`

## [0.3.0](https://github.com/steroids/nest-auth/compare/0.2.3...0.3.0) (2025-12-26)

### Features

- JwtAuthGuard теперь обязательно требует токен. Добавлен PublicJwtAuthGuard, который не требует токен
- Логика авторизации по коду AuthConfirm разделена на отдельные юзкейсы по отправке кода (ISendAuthenticationCodeUseCase) и
    непосредственно авторизации (IAuthenticateWithCodeUseCase). Данные юзкейсы можно переопределить в проекте

## [0.2.1](https://github.com/steroids/nest-auth/compare/0.2.0...0.2.1) (2025-06-27)

### Features

- Декоратор Context и ContextDto удалены. Рекомендуется использовать соответствующие сущности из основного пакета @steroidsjs/nest

## [0.2.0](https://github.com/steroids/nest-auth/compare/0.1.6...0.2.0) (2025-05-12)

### Features

- Обновление Steroids до 3.2.0
- Добавлен PublicJwtAuthGuard. JwtAuthGuard теперь не пропускает пользователя без токена ([#108](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/108))
- PhoneCodeAuthGuard переименован в CodeAuthGuard ([#86](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/86))

## [0.1.6](https://github.com/steroids/nest-auth/compare/0.1.5...0.1.6) (2025-03-13)

### Bugfixes

- Удалено автоматическое создание пользователя при авторизации через код подтверждения ([#84](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/84))
- Исправлено обновление authConfirmModel в PhoneCodeAuthGuard ([#85](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/85))
- Фикс метода AuthPermissionsService.findOrCreate (выдавал ошибку. если в keys передать null)
- Расширен набор схем для сущности AuthRole

## [0.1.5](https://github.com/steroids/nest-auth/compare/0.1.4...0.1.5) (2025-02-28)

### Bugfixes

- PhoneCodeAuthGuard больше не обновляет поле AuthModel.isConfirmed ([#12](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/12))
- В AuthPermissionSaveInputDto добавлено поле id
- Рефакторинг метода AuthPermissionService.findOrCreate

## [0.1.4](https://github.com/steroids/nest-auth/compare/0.1.3...0.1.4) (2025-02-28)

### Bugfixes

- Фикс метода AuthPermissionsService.findOrCreate

## [0.1.3](https://github.com/steroids/nest-auth/compare/0.1.2...0.1.3) (2025-02-24)

### Bugfixes

- Поля в ContextDto и AuthUserDto объявлены с помощью Fields декораторов
- Зависимости в AuthLoginService и AuthService теперь protected вместо private ([#67](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/67))
- При проверке access токена на валидность добавлена проверка на валидность самой сессии ([#66](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/66))
