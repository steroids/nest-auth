# Steroids Nest Migration Guide


## Использование JWT из cookie

Был добавлен `AuthWebController`, который позволяет хранить `JWT` в cookie.
Необходимо настроить конфиг для передачи кук (`jwtCookie`) под нужды проекта.
Также куки можно подписывать на сервере, передав в конфиге `AuthModule` `jwtCookie.signed: true` 
и поставив `cookieSecret` в конфиге `AppModule` (из `steroids-nest`).
Подписанные куки будут храниться не в `request.cookies`, а в `request.signedCookies`,
их можно взять из запроса в контроллере с помощью декоратора `@Cookies(<cookieName>)`.

## [0.3.0](../CHANGELOG.md#015-2024-12-26) (2024-12-26)

### JwtAuthGuard теперь обязательно требует токен

Если в проекте есть эндпоинты, доступ к которым должен быть открыт без токена, для них необходимо заменить JwtAuthGuard на PublicJwtAuthGuard 

## [0.1.5](../CHANGELOG.md#015-2024-02-28) (2024-02-28)

### PhoneCodeAuthGuard больше не обновляет поле AuthModel.isConfirmed

Если в проекте используется PhoneCodeAuthGuard, необходимо самостоятельно обновлять поле isConfirmed
