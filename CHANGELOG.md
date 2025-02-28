# Steroids nest-auth Changelog

## [0.1.4](https://github.com/steroids/nest-auth/compare/0.1.3...0.1.4) (2024-02-24)

### Bugfixes

- Фикс метода AuthPermissionsService.findOrCreate

## [0.1.3](https://github.com/steroids/nest-auth/compare/0.1.2...0.1.3) (2024-02-24)

### Bugfixes

- Поля в ContextDto и AuthUserDto объявлены с помощью Fields декораторов
- Зависимости в AuthLoginService и AuthService теперь protected вместо private ([#67](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/67))
- При проверке access токена на валидность добавлена проверка на валидность самой сессии ([#66](https://gitlab.kozhindev.com/steroids/steroids-nest/-/issues/66))
