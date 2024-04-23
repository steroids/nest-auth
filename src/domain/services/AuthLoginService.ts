import * as ms from 'ms';
import {generateUid} from '@steroidsjs/nest/infrastructure/decorators/fields/UidField';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IAppModuleConfig} from '@steroidsjs/nest/infrastructure/applications/IAppModuleConfig';
import {AppModule} from '@steroidsjs/nest/infrastructure/applications/AppModule';
import { DataMapper } from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {AuthLoginModel} from '../models/AuthLoginModel';
import {ISessionService} from '../interfaces/ISessionService';
import {IAuthLoginRepository} from '../interfaces/IAuthLoginRepository';
import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';
import {IAuthModuleConfig} from '../../infrastructure/config';
import { ContextDto } from '../dtos/ContextDto';

export class AuthLoginService {
    constructor(
        /** @see AuthLoginRepository **/
        private repository: IAuthLoginRepository,
        private readonly sessionService: ISessionService,
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
        return model && !model.isRevoked;
    }

    async create(user: UserModel, tokenPayload: AuthTokenPayloadDto, context: ContextDto): Promise<AuthLoginModel> {
        const loginModel = DataMapper.create<AuthLoginModel>(AuthLoginModel, {
            uid: generateUid(),
            userId: user.id,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
        });

        // Base sign options
        const baseOptions = {
            issuer: ModuleHelper.getConfig<IAppModuleConfig>(AppModule).name,
            subject: String(user.id),
            jwtid: String(loginModel.uid),
        };

        // Access token expiration time
        const accessTokenExpires = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).accessTokenExpiresSec;
        const accessTokenExpiresMs = ms(accessTokenExpires);
        const accessExpiration = new Date();
        accessExpiration.setTime(accessExpiration.getTime() + accessTokenExpiresMs);
        loginModel.accessExpireTime = accessExpiration;

        // Refresh token expiration time
        const refreshTokenExpires = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).refreshTokenExpiresSec;
        const refreshTokenExpiresMs = ms(refreshTokenExpires);
        const refreshExpiration = new Date();
        refreshExpiration.setTime(refreshExpiration.getTime() + refreshTokenExpiresMs);
        loginModel.refreshExpireTime = refreshExpiration;

        // Generate access token
        loginModel.accessToken = this.sessionService.signToken(tokenPayload, {
            ...baseOptions,
            secret: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtAccessSecretKey,
            expiresIn: accessTokenExpires,
        });

        // Generate refresh token
        loginModel.refreshToken = this.sessionService.signToken(tokenPayload, {
            ...baseOptions,
            secret: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtRefreshSecretKey,
            expiresIn: refreshTokenExpires,
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
