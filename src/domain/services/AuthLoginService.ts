import * as ms from 'ms';
import {generateUid} from '@steroidsjs/nest/infrastructure/decorators/fields/UidField';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {AuthLoginModel} from '../models/AuthLoginModel';
import {ISessionService} from '../interfaces/ISessionService';
import {IAuthLoginRepository} from '../interfaces/IAuthLoginRepository';
import {IConfigService} from '../interfaces/IConfigService';
import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';

export class AuthLoginService {
    constructor(
        /** @see AuthLoginRepository **/
        private repository: IAuthLoginRepository,
        private readonly configService: IConfigService,
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

    async create(user: UserModel, tokenPayload: AuthTokenPayloadDto): Promise<AuthLoginModel> {
        const loginModel = new AuthLoginModel();
        loginModel.uid = generateUid();
        loginModel.userId = user.id;

        // Base sign options
        const baseOptions = {
            issuer: this.configService.get('name'),
            subject: String(user.id),
            jwtid: String(loginModel.uid),
        };

        // Access token expiration time
        const accessTokenExpires = this.configService.get('auth.accessTokenExpiresSec') || '5m';
        const accessTokenExpiresMs = ms(accessTokenExpires);
        const accessExpiration = new Date();
        accessExpiration.setTime(accessExpiration.getTime() + accessTokenExpiresMs);
        loginModel.accessExpireTime = accessExpiration;

        // Refresh token expiration time
        const refreshTokenExpires = this.configService.get('auth.refreshTokenExpiresSec') || '60d';
        const refreshTokenExpiresMs = ms(refreshTokenExpires);
        const refreshExpiration = new Date();
        refreshExpiration.setTime(refreshExpiration.getTime() + refreshTokenExpiresMs);
        loginModel.refreshExpireTime = refreshExpiration;

        // Generate access token
        loginModel.accessToken = this.sessionService.signToken(tokenPayload, {
            ...baseOptions,
            secret: this.configService.get('auth.jwtAccessSecretKey'),
            expiresIn: accessTokenExpires,
        });

        // Generate refresh token
        loginModel.refreshToken = this.sessionService.signToken(tokenPayload, {
            ...baseOptions,
            secret: this.configService.get('auth.jwtRefreshSecretKey'),
            expiresIn: refreshTokenExpires,
        });

        await this.repository.create(loginModel);

        return loginModel;
    }

    async generateAccessToken(user: UserModel, tokenPayload: AuthTokenPayloadDto, jwtid: string) {
        const accessTokenExpires = this.configService.get('auth.accessTokenExpiresSec') || '5m';

        return this.sessionService.signToken(tokenPayload, {
            issuer: this.configService.get('name'),
            subject: String(user.id),
            jwtid,
            secret: this.configService.get('auth.jwtAccessSecretKey'),
            expiresIn: accessTokenExpires,
        });
    }
}
