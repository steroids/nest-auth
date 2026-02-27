import {NestInterceptor, ExecutionContext, CallHandler, Injectable, Inject} from '@nestjs/common';
import {Response} from 'express';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {isObject as _isObject} from 'lodash';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {IAuthModuleConfig} from '../config';
import {ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME} from '../../domain/constants';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';
import {AuthLoginSchema} from '../../domain/dtos/AuthLoginSchema';

interface IAuthTokensResponse {
    refreshToken?: string,
    accessToken?: string,
    [key: string]: any,
}

@Injectable()
export class AuthSetCookieInterceptor implements NestInterceptor {
    constructor(
        @Inject(ISessionService)
        protected readonly sessionService: ISessionService,
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context
            .switchToHttp()
            .getResponse<Response>();

        const config = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule);

        return next.handle().pipe(
            map((data: AuthLoginModel) => {
                const dataObject: IAuthTokensResponse = _isObject(data)
                    ? data
                    : {};

                const {refreshToken, accessToken} = dataObject;

                if (refreshToken) {
                    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                        ...config.jwtCookie,
                        expires: this.sessionService.getTokenExpireTime(refreshToken),
                    });
                }

                if (accessToken) {
                    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
                        ...config.jwtCookie,
                        expires: this.sessionService.getTokenExpireTime(accessToken),
                    });
                }

                return DataMapper.create(AuthLoginSchema, data);
            }),
        );
    }
}
