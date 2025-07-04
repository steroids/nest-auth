import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {JWT_STRATEGY_NAME} from '../strategies/JwtStrategy';
import {PERMISSION_AUTH_AUTHORIZED} from '../permissions';
import {IJwtStrategyValidateData} from '../../domain/interfaces/IJwtStrategyValidateData';

// Working path: Guard.canActivate -> Strategy.constructor verify token -> Strategy.validate -> Guard.handleRequest
@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {
    /**
     * Called after Strategy.validate
     * @param err error thrown to this function
     * @param validateData data returned from Strategy.validate
     * @param info some info about error
     * @param context ExecutionContext
     */
    handleRequest<TUser>(
        err: any,
        validateData: IJwtStrategyValidateData,
        info: any,
        context: ExecutionContext,
    ): TUser {
        if (err || !validateData) {
            throw err || new UnauthorizedException({message: 'Пользователь не авторизован'});
        }

        const {user, loginUid} = validateData;

        const req = context.switchToHttp().getRequest();
        req.permissions = [
            PERMISSION_AUTH_AUTHORIZED,
            ...(req.permissions || []),
            ...user.permissions,
        ];
        user.permissions = req.permissions;
        req.loginUid = loginUid;

        // after returns will be req.user = user
        return user as TUser;
    }
}
