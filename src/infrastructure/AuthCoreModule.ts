import {forwardRef, Global, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@steroidsjs/nest-typeorm';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {DynamicModule} from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
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

@Global()
@Module({})
export class AuthCoreModule {
    static forRoot(options): DynamicModule | any {
        return {
            module: AuthModule,
            imports: [
                ConfigModule,
                PassportModule,
                NotifierModule,
                forwardRef(() => UserModule),
                forwardRef(() => FileModule),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get('auth.jwtAccessSecretKey'),
                    }),
                }),
                TypeOrmModule.forFeature(ModuleHelper.importDir(__dirname + '/tables')),
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
                    ConfigService,
                ]),
                ModuleHelper.provide(AuthConfirmService, [
                    IAuthConfirmRepository,
                    INotifierService,
                    IUserService,
                    ConfigService,
                    AuthService,
                ]),
                ModuleHelper.provide(AuthLoginService, [
                    IAuthLoginRepository,
                    ConfigService,
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
            ...options,
        };
    }
}
