import {ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as ms from 'ms';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthService} from '../../domain/services/AuthService';
import {parseCookie} from '../helpers/ParseCookie';
import JwtTokenStatusEnum from '../../domain/enums/JwtTokenStatusEnum';
import {JWT_STRATEGY_NAME} from '../strategies/JwtStrategy';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAuthModuleConfig} from '../config';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';

@Injectable()
export class FilesAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {
    constructor(
        @Inject(ISessionService)
        private sessionsService: ISessionService,
        @Inject(AuthService)
        private authService: AuthService,
    ) {
        super();
    }

    private defaultAdditionalTime = '10s';

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const cookie = parseCookie(req.headers.cookie);
        const token = cookie.accessToken;
        if (!token) {
            return true;
        }
        const {status, payload} = this.sessionsService.verifyToken(token);
        if ([JwtTokenStatusEnum.VALID, JwtTokenStatusEnum.EXPIRED_ERROR].includes(status)
            && payload
        ) {
            if (status === JwtTokenStatusEnum.EXPIRED_ERROR) {
                const additionalTime = ms(
                    ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).filesTokenAdditionalTime
                    || this.defaultAdditionalTime,
                );
                if (Date.now() - payload.exp * 1000 > additionalTime) {
                    throw new UnauthorizedException({message: 'Пользователь не авторизован'});
                }
            }
            req.user = await this.authService.createAuthUserDto(payload);
            return true;
        }
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }
}
