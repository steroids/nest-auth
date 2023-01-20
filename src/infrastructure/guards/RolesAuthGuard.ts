import {
    CanActivate,
    ExecutionContext, ForbiddenException, Inject,
    Injectable,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {STEROIDS_AUTH_GUARD_PERMISSIONS} from '../decorators/AuthPermissions';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthService} from '../../domain/services/AuthService';

@Injectable()
export class RolesAuthGuard implements CanActivate {
    constructor(
        @Inject(Reflector)
        protected reflector: Reflector,
        /** SessionService */
        @Inject(ISessionService)
        protected sessionService: ISessionService,
        @Inject(AuthService)
        protected authService: AuthService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(STEROIDS_AUTH_GUARD_PERMISSIONS, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Check any access
        if (!requiredPermissions || requiredPermissions.length === 0 || requiredPermissions.includes(null)) {
            return true;
        }

        const req = context.switchToHttp().getRequest();

        const permissions = req.permissions || req?.user?.permissions || req?.user?.roles || [];

        if (permissions.some(role => requiredPermissions.includes(role))) {
            return true;
        }

        const isProd = process.env.APP_ENVIRONMENT.indexOf('prod') !== -1;
        if (isProd) {
            throw new ForbiddenException({
                message: 'Нет прав для выполнения данного действия.',
            });
        } else {
            throw new ForbiddenException({
                message: `Нет прав для выполнения данного действия.
                    Требуется разрешение: (${requiredPermissions.join(', ')})`,
            });
        }
    }
}
