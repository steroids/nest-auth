export interface IAuthModuleConfig {
    /**
     * The secret key for signing the access JWT
     */
    jwtAccessSecretKey?: string,
    /**
     * The secret key for signing the refresh JWT
     */
    jwtRefreshSecretKey?: string,
    /**
     * The lifetime of the access JWT in seconds
     */
    accessTokenExpiresSec?: string,
    /**
     * The lifetime of the refresh JWT in seconds
     */
    refreshTokenExpiresSec?: string, // Additional token expiration time for FilesAuthGuard
    /**
     * Additional validity period of the token for FilesAuthGuard
     */
    filesTokenAdditionalTime?: string,
    /**
     * Confirmation code config
     */
    confirm: {
        /**
         * The time in minutes after which the confirmation code will become invalid
         */
        expireMins?: number,
        /**
         * The time in seconds that limits the ability to resend the code
         */
        repeatLimitSec?: number,
        /**
         * The number of attempts to enter the correct confirmation code
         */
        attemptsCount?: number,
        /**
         * The length of the confirmation code that is sent to the user via SMS
         */
        smsCodeLength?: number,
        /**
         * The length of the confirmation code for the call
         */
        callCodeLength?: number,
        /**
         * Enabling debugging mode using a static confirmation code
         */
        isEnableDebugStaticCode?: boolean,
        /**
         * The name of the provider for sending confirmation codes
         */
        providerName?: 'smsc' | string,
        /**
         * The type of the provider for sending confirmation codes
         */
        providerType?: 'voice' | 'sms' | 'call',
    }
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
} as IAuthModuleConfig);
