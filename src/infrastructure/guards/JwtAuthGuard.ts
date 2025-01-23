import {ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {getTokenFromHttpRequest} from '../helpers/GetTokenFromHttpRequest';
import {AuthService} from '../../domain/services/AuthService';
import JwtTokenStatusEnum from '../../domain/enums/JwtTokenStatusEnum';
import {JWT_STRATEGY_NAME} from '../strategies/JwtStrategy';
import {PERMISSION_AUTH_AUTHORIZED} from '../permissions';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {
    constructor(
        @Inject(ISessionService)
        private sessionsService: ISessionService,
        private authService: AuthService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const token = getTokenFromHttpRequest(req);

        if (!token) {
            return true;
        }

        const {status, payload} = await this.sessionsService.verifyToken(token);

        if (status === JwtTokenStatusEnum.VALID && payload) {
            const user = await this.authService.createAuthUserDto(payload);

            req.permissions = [
                PERMISSION_AUTH_AUTHORIZED,
                ...(req.permissions || []),
                ...user.permissions,
            ];

            user.permissions = req.permissions;

            req.user = user;
            req.loginUid = payload.jti;

            return true;
        }
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }
}
