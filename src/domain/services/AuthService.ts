import {UnauthorizedException, UserException} from '@steroidsjs/nest/usecases/exceptions';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {IUserRegistrationDto} from '@steroidsjs/nest-modules/user/dtos/IUserRegistrationDto';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {AuthPermissionsService} from './AuthPermissionsService';
import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';
import {AuthUserDto} from '../dtos/AuthUserDto';
import {AuthLoginService} from './AuthLoginService';
import {ISessionService} from '../interfaces/ISessionService';
import {AuthLoginModel} from '../models/AuthLoginModel';
import JwtTokenStatusEnum from '../enums/JwtTokenStatusEnum';
import {IAuthModuleConfig} from '../../infrastructure/config';

export class AuthService {
    constructor(
        private usersService: IUserService,
        /** @see SessionService **/
        private sessionService: ISessionService,
        private authLoginService: AuthLoginService,
        private authPermissionsService: AuthPermissionsService,
    ) {
    }

    createTokenPayload(user: UserModel): AuthTokenPayloadDto {
        const dto = new AuthTokenPayloadDto();
        dto.id = user.id;
        return dto;
    }

    async createAuthUserDto(payload: AuthTokenPayloadDto): Promise<AuthUserDto> {
        const user = await this.usersService.createQuery()
            .with('authRolesIds')
            .where({id: payload.id})
            .one();
        const permissions = await this.authPermissionsService.getRolesPermissions(user, user?.authRolesIds || []);

        const dto = new AuthUserDto();
        dto.id = payload.id;
        dto.permissions = permissions;

        return dto;
    }

    async login(authUser: AuthUserDto): Promise<AuthLoginModel> {
        const user = await this.usersService.findById(authUser.id);
        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        return this.authLoginService.create(user, this.createTokenPayload(user));
    }

    async registration(registrationDto: IUserRegistrationDto) {
        const user = await this.usersService.registration(registrationDto);
        await this.authLoginService.create(user, this.createTokenPayload(user));
        return user;
    }

    async refreshToken(refreshToken: string): Promise<AuthLoginModel> {
        const {payload, status} = await this.sessionService.verifyToken(refreshToken, {
            secret: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtRefreshSecretKey,
        });
        if (status === JwtTokenStatusEnum.VALID && payload) {
            const authLogin = await this.authLoginService.findByUid(payload.jti);
            if (authLogin && !authLogin.isRevoked) {
                const user = await this.usersService.findById(payload.sub);
                authLogin.accessToken = await this.authLoginService.generateAccessToken(
                    user,
                    this.createTokenPayload(user),
                    payload.jti,
                );
                return authLogin;
            }
        }
        throw new UserException('Неверный токен авторизациии');
    }
}
