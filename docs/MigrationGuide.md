# Steroids Nest Migration Guide

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
