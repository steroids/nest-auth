import {Response} from 'express';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {Inject, Injectable} from '@nestjs/common';
import {IAuthTokens} from '../../domain/interfaces/IAuthTokens';
import {ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME} from '../../domain/constants';
import {IAuthModuleConfig} from '../config';
import {ISessionService} from '../../domain/interfaces/ISessionService';

@Injectable()
export class AuthCookieService {
    constructor(
        @Inject(ISessionService)
        protected readonly sessionService: ISessionService,
    ) {
    }

    private readonly cookieConfig = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtCookie;

    setTokens(response: Response, tokens: IAuthTokens): void {
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
            ...this.cookieConfig,
            expires: this.sessionService.getTokenExpireTime(tokens.refreshToken),
        });

        response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
            ...this.cookieConfig,
            expires: this.sessionService.getTokenExpireTime(tokens.accessToken),
        });
    }

    clearTokens(response: Response) {
        response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, this.cookieConfig);
        response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, this.cookieConfig);
    }
}
