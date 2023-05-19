import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {ValidationException} from '@steroidsjs/nest/usecases/exceptions/ValidationException';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthService} from '../../domain/services/AuthService';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';

@Injectable()
export class PhoneCodeAuthGuard implements CanActivate {
    constructor(
        @Inject(AuthConfirmService) private authConfirmService: AuthConfirmService,
        @Inject(AuthService) private authService: AuthService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const authConfirmModel = await this.authConfirmService.findOne(
            (new SearchQuery<AuthConfirmModel>())
                .with('user')
                .where({
                    uid: req.body.uid,
                }),
        );
        if (!authConfirmModel) {
            return false;
        }

        if (authConfirmModel.code === req.body.code) {
            if (new Date() > new Date(authConfirmModel.expireTime)) {
                throw new ValidationException({
                    code: 'Время действия кода истекло',
                });
            }
            if (authConfirmModel.isConfirmed) {
                throw new ValidationException({
                    code: 'Данный код уже был использован',
                });
            }
            if (authConfirmModel.attemptsCount < 1) {
                throw new ValidationException({
                    code: 'Превышено количество попыток',
                });
            }
            authConfirmModel.isConfirmed = true;
            await this.authConfirmService.update(authConfirmModel.id, authConfirmModel);
        } else {
            if (authConfirmModel.attemptsCount > 0) {
                authConfirmModel.attemptsCount = authConfirmModel.attemptsCount - 1;
                await this.authConfirmService.update(authConfirmModel.id, authConfirmModel);
                throw new ValidationException({
                    code: `Неверный код, осталось попыток: ${authConfirmModel.attemptsCount}`,
                });
            }
            throw new ValidationException({
                code: 'Превышено количество попыток',
            });
        }
        return true;
    }

    handleRequest<TUser>(err, user): TUser {
        if (err || !user) {
            throw new ValidationException({
                code: 'Неверный логин или пароль',
            });
        }
        return user;
    }
}
