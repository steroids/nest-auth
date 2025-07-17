import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {UserModule} from '@steroidsjs/nest-modules/user/UserModule';
import {FileModule} from '@steroidsjs/nest-modules/file/FileModule';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {IFileService} from '@steroidsjs/nest-modules/file/services/IFileService';
import {forwardRef, ModuleMetadata} from '@nestjs/common';
import {IAuthUpdateUserOwnPasswordUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {IUserUpdatePasswordUseCase} from '@steroidsjs/nest-modules/user/usecases/IUserUpdatePasswordUseCase';
import {IAuthRevokeUserActiveLoginsUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveLoginsUseCase';
import {AuthService} from '../domain/services/AuthService';
import {AuthLoginService} from '../domain/services/AuthLoginService';
import {AuthPermissionsService} from '../domain/services/AuthPermissionsService';
import {IAuthPermissionsRepository} from '../domain/interfaces/IAuthPermissionsRepository';
import {IAuthLoginRepository} from '../domain/interfaces/IAuthLoginRepository';
import {ISessionService} from '../domain/interfaces/ISessionService';
import {IAuthConfirmRepository} from '../domain/interfaces/IAuthConfirmRepository';
import {AuthConfirmService} from '../domain/services/AuthConfirmService';
import {IAuthRoleRepository} from '../domain/interfaces/IAuthRoleRepository';
import {AuthRoleService} from '../domain/services/AuthRoleService';
import {AuthFilePermissionService} from '../domain/services/AuthFilePermissionService';
import {AuthUpdateUserOwnPasswordUseCase} from '../usecases/updatePassword/AuthUpdateUserOwnPasswordUseCase';
import {AuthRevokeUserActiveLoginsUseCase} from '../usecases/revokeUserActiveLogins/AuthRevokeUserActiveLoginsUseCase';
import {AuthConfirmProvidersToken, IAuthConfirmProvider} from '../domain/interfaces/IAuthConfirmProvider';
import authConfirmProviders from './services/authConfirmProviders';
import {SessionService} from './services/SessionService';
import {AuthLoginRepository} from './repositories/AuthLoginRepository';
import {AuthPermissionRepository} from './repositories/AuthPermissionRepository';
import {LoginPasswordStrategy} from './strategies/LoginPasswordStrategy';
import {JwtStrategy} from './strategies/JwtStrategy';
import {AuthConfirmRepository} from './repositories/AuthConfirmRepository';
import {LoginSmsCodeStrategy} from './strategies/LoginSmsCodeStrategy';
import {AuthRoleRepository} from './repositories/AuthRoleRepository';
import {AuthController} from './controllers/AuthController';
import {AuthFilePermissionController} from './controllers/AuthFilePermissionController';
import {AuthPermissionController} from './controllers/AuthPermissionController';
import {AuthPhoneController} from './controllers/AuthPhoneController';
import {AuthRoleController} from './controllers/AuthRoleController';
import {IAuthModuleConfig} from './config';
import {PasswordValidator} from './validators/PasswordValidator';

export default (config: IAuthModuleConfig): ModuleMetadata => ({
    imports: [
        PassportModule,
        NotifierModule,
        forwardRef(() => UserModule),
        FileModule,
        JwtModule.register({
            secret: config.jwtAccessSecretKey,
        }),
    ],
    controllers: [
        AuthController,
        AuthFilePermissionController,
        AuthPermissionController,
        AuthPhoneController,
        AuthRoleController,
    ],
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
        ...authConfirmProviders,
        {
            provide: AuthConfirmProvidersToken,
            useFactory: (...providers: IAuthConfirmProvider[]) => providers,
            inject: authConfirmProviders,
        },
        AuthConfirmService,
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

        // UseCases
        ModuleHelper.provide(AuthUpdateUserOwnPasswordUseCase, IAuthUpdateUserOwnPasswordUseCase, [
            IUserUpdatePasswordUseCase,
            IAuthRevokeUserActiveLoginsUseCase,
            [
                PasswordValidator,
            ],
        ]),
        ModuleHelper.provide(AuthRevokeUserActiveLoginsUseCase, IAuthRevokeUserActiveLoginsUseCase, [
            AuthLoginService,
        ]),

        // Validators
        ModuleHelper.provide(PasswordValidator, [
            IUserService,
            ISessionService,
        ]),
    ],
    exports: [
        ISessionService,
        AuthPermissionsService,
        AuthConfirmService,
        AuthService,
        AuthRoleService,
    ],
});
