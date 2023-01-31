import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import {LOGIN_PASSWORD_STRATEGY_NAME} from '../strategies/LoginPasswordStrategy';

@Injectable()
export class LoginPasswordAuthGuard extends AuthGuard(LOGIN_PASSWORD_STRATEGY_NAME) {
    handleRequest<TUser>(err, user): TUser {
        if (err || !user) {
            if (err) {
                console.error(err);
            }
            throw new ValidationException({
                password: 'Неверный логин или пароль',
            });
        }
        return user;
    }
}
