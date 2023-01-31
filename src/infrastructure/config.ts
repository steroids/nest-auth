import {forwardRef} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {UserModule} from '@steroidsjs/nest-modules/user/UserModule';
import {FileModule} from '@steroidsjs/nest-modules/file/FileModule';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {IFileService} from '@steroidsjs/nest-modules/file/services/IFileService';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {SessionService} from './services/SessionService';
import {AuthService} from '../domain/services/AuthService';
import {AuthLoginService} from '../domain/services/AuthLoginService';
import {AuthPermissionsService} from '../domain/services/AuthPermissionsService';
import {AuthLoginRepository} from './repositories/AuthLoginRepository';
import {AuthPermissionRepository} from './repositories/AuthPermissionRepository';
import {IAuthPermissionsRepository} from '../domain/interfaces/IAuthPermissionsRepository';
import {IAuthLoginRepository} from '../domain/interfaces/IAuthLoginRepository';
import {LoginPasswordStrategy} from './strategies/LoginPasswordStrategy';
import {JwtStrategy} from './strategies/JwtStrategy';
import {ISessionService} from '../domain/interfaces/ISessionService';
import {IAuthConfirmRepository} from '../domain/interfaces/IAuthConfirmRepository';
import {AuthConfirmRepository} from './repositories/AuthConfirmRepository';
import {AuthConfirmService} from '../domain/services/AuthConfirmService';
import {LoginSmsCodeStrategy} from './strategies/LoginSmsCodeStrategy';
import {IAuthRoleRepository} from '../domain/interfaces/IAuthRoleRepository';
import {AuthRoleRepository} from './repositories/AuthRoleRepository';
import {AuthRoleService} from '../domain/services/AuthRoleService';
import {AuthFilePermissionService} from '../domain/services/AuthFilePermissionService';
import {AuthConfirmTable} from './tables/AuthConfirmTable';
import {AuthLoginTable} from './tables/AuthLoginTable';
import {AuthPermissionTable} from './tables/AuthPermissionTable';
import {AuthRoleTable} from './tables/AuthRoleTable';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';

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
    }
}

export default {
    global: true,
    config: () => ({
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
    } as IAuthModuleConfig),
    entities: [
        AuthConfirmTable,
        AuthLoginTable,
        AuthPermissionTable,
        AuthRoleTable,
    ],
    module: (config: IAuthModuleConfig) => ({
        imports: [
            PassportModule,
            forwardRef(() => NotifierModule),
            forwardRef(() => UserModule),
            forwardRef(() => FileModule),
            JwtModule.register({
                secret: config.jwtAccessSecretKey,
            }),
        ],
        controllers: ModuleHelper.importDir(__dirname + '/controllers'),
        providers: [
            {
                provide: IAuthLoginRepository,
                useClass: AuthLoginRepository,
            },
            {
                provide: IAuthPermissionsRepository,
                useClass: AuthPermissionRepository,
            },
            {
                provide: IAuthRoleRepository,
                useClass: AuthRoleRepository,
            },
            {
                provide: ISessionService,
                useClass: SessionService,
            },
            {
                provide: IAuthConfirmRepository,
                useClass: AuthConfirmRepository,
            },
            ModuleHelper.provide(AuthRoleService, [
                IAuthRoleRepository,
                AuthPermissionsService,
            ]),
            ModuleHelper.provide(AuthService, [
                IUserService,
                ISessionService,
                AuthLoginService,
                AuthPermissionsService,
            ]),
            ModuleHelper.provide(AuthConfirmService, [
                IAuthConfirmRepository,
                INotifierService,
                IUserService,
                AuthService,
            ]),
            ModuleHelper.provide(AuthLoginService, [
                IAuthLoginRepository,
                ISessionService,
            ]),
            ModuleHelper.provide(AuthPermissionsService, [
                IAuthPermissionsRepository,
                IAuthRoleRepository,
            ]),
            ModuleHelper.provide(AuthFilePermissionService, [
                IFileService,
            ]),
            ModuleHelper.provide(LoginPasswordStrategy, [
                IUserService,
                AuthService,
                ISessionService,
            ]),
            ModuleHelper.provide(LoginSmsCodeStrategy, [
                AuthConfirmService,
                AuthService,
                ISessionService,
            ]),
            JwtStrategy,
        ],
        exports: [
            ISessionService,
            AuthPermissionsService,
            AuthConfirmService,
            AuthService,
            AuthRoleService,
        ],
    }),
};