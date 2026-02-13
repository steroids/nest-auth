import {IAuthJwtCookieConfig} from '../domain/interfaces/IAuthJwtCookieConfig';

export interface IAuthModuleConfig {
    jwtAccessSecretKey?: string,
    jwtRefreshSecretKey?: string,
    accessTokenExpiresSec?: string,
    refreshTokenExpiresSec?: string, // Additional token expiration time for FilesAuthGuard
    filesTokenAdditionalTime?: string,
    confirm: {
        expireMins?: number,
        repeatLimitSec?: number,
        attemptsCount?: number,
        smsCodeLength?: number,
        callCodeLength?: number,
        isEnableDebugStaticCode?: boolean,
        providerName?: 'smsc' | string,
        providerType?: 'voice' | 'sms' | 'call',
    },
    jwtCookie?: IAuthJwtCookieConfig,
}

export default () => ({
    jwtAccessSecretKey: process.env.AUTH_JWT_ACCESS_SECRET_KEY,
    jwtRefreshSecretKey: process.env.AUTH_JWT_REFRESH_SECRET_KEY,
    accessTokenExpiresSec: '2d',
    refreshTokenExpiresSec: '90d',
    filesTokenAdditionalTime: '1m',
    confirm: {
        expireMins: 60,
        repeatLimitSec: 60,
        attemptsCount: 5,
        smsCodeLength: Number(process.env.AUTH_CONFIRM_SMS_CODE_LENGTH) || 4,
        callCodeLength: Number(process.env.AUTH_CONFIRM_CALL_CODE_LENGTH) || 4,
        isEnableDebugStaticCode: process.env.AUTH_ENABLE_DEFAULT_CODE === '1',
        providerName: process.env.AUTH_PROVIDER_NAME || 'smsc',
        providerType: process.env.AUTH_PROVIDER_TYPE || 'voice', // or "sms", or "call"
    },
    jwtCookie: {
        httpOnly: true,
        secure: process.env.APP_ENVIRONMENT !== 'dev',
        sameSite: 'lax',
        path: '/',
    },
} as IAuthModuleConfig);
