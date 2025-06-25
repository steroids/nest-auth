import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {generateUid} from '@steroidsjs/nest/infrastructure/decorators/typeorm/fields/TypeOrmUidField/TypeOrmUidBehaviour';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {AuthLoginModel} from '../models/AuthLoginModel';
import {ISessionService} from '../interfaces/ISessionService';
import {IAuthLoginRepository} from '../interfaces/IAuthLoginRepository';
import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';
import {IAuthModuleConfig} from '../../infrastructure/config';

export class AuthLoginService {
    constructor(
        /** @see AuthLoginRepository **/
        protected repository: IAuthLoginRepository,
        protected readonly sessionService: ISessionService,
    ) {
    }

    async findByUid(uid): Promise<AuthLoginModel> {
        return this.repository.findOne({uid});
    }

    async findById(id): Promise<AuthLoginModel> {
        return this.repository.findOne({id});
    }

    async isLoginValid(uid: string): Promise<boolean> {
        const model = await this.repository.findOne({uid});
        return Boolean(model && !model.isRevoked);
    }

    async create(user: UserModel, tokenPayload: AuthTokenPayloadDto, context: ContextDto): Promise<AuthLoginModel> {
        const loginModelUid = generateUid();

        // Base sign options
        const baseTokenOptions = {
            issuer: ModuleHelper.getConfig<IAppModuleConfig>(AppModule).name,
            subject: `${user.id}`,
            jwtid: loginModelUid,
        };

        const authModuleConfig = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule);

        // Generate access token
        const accessToken = this.sessionService.signToken(tokenPayload, {
            ...baseTokenOptions,
            secret: authModuleConfig.jwtAccessSecretKey,
            expiresIn: authModuleConfig.accessTokenExpiresSec,
        });

        // Generate refresh token
        const refreshToken = this.sessionService.signToken(tokenPayload, {
            ...baseTokenOptions,
            secret: authModuleConfig.jwtRefreshSecretKey,
            expiresIn: authModuleConfig.refreshTokenExpiresSec,
        });

        const loginModel = DataMapper.create<AuthLoginModel>(AuthLoginModel, {
            uid: loginModelUid,
            userId: user.id,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            accessToken,
            accessExpireTime: this.sessionService.getTokenExpireTime(accessToken),
            refreshToken,
            refreshExpireTime: this.sessionService.getTokenExpireTime(refreshToken),
        });

        await this.repository.create(loginModel);

        return loginModel;
    }

    async generateAccessToken(user: UserModel, tokenPayload: AuthTokenPayloadDto, jwtid: string) {
        const accessTokenExpires = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).accessTokenExpiresSec;

        return this.sessionService.signToken(tokenPayload, {
            issuer: ModuleHelper.getConfig<IAppModuleConfig>(AppModule).name,
            subject: String(user.id),
            jwtid,
            secret: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtAccessSecretKey,
            expiresIn: accessTokenExpires,
        });
    }

    async getUserActiveAuthLogins(userId: number): Promise<AuthLoginModel[]> {
        return this.repository.createQuery()
            .where({
                userId,
                isRevoked: false,
            })
            .many();
    }

    async revoke(uid: string) {
        const loginModel = await this.findByUid(uid);

        if (loginModel) {
            await this.repository.update(loginModel.id, {
                ...loginModel,
                isRevoked: true,
            });
        }
    }
}
