import {NestInterceptor, ExecutionContext, CallHandler, Injectable} from '@nestjs/common';
import {Response} from 'express';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IAuthModuleConfig} from '../config';
import {ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME} from '../../domain/constants';

@Injectable()
export class AuthClearCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context
            .switchToHttp()
            .getResponse<Response>();

        const config = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule);

        return next.handle().pipe(
            tap(() => {
                res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, config.jwtCookie);
                res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, config.jwtCookie);
            }),
        );
    }
}
