# Steroids nest-auth Changelog

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
