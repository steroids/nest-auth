# Steroids Nest Migration Guide

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
