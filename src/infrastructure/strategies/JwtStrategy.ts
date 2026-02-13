import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UnauthorizedException} from '@steroidsjs/nest/usecases/exceptions';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {Request} from 'express';
import {AuthLoginService} from '../../domain/services/AuthLoginService';
import {AuthTokenPayloadDto} from '../../domain/dtos/AuthTokenPayloadDto';
import {IAuthModuleConfig} from '../config';
import {AuthService} from '../../domain/services/AuthService';
import {IJwtStrategyValidateData} from '../../domain/interfaces/IJwtStrategyValidateData';
import {ACCESS_TOKEN_COOKIE_NAME} from '../../domain/constants';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
    constructor(
        private authLoginService: AuthLoginService,
        private authService: AuthService,
    ) {
        /**
         * JWT Validation Settings
         */
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('token'),
                (req: Request) => (
                    ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule)?.jwtCookie?.signed
                        ? req?.signedCookies?.[ACCESS_TOKEN_COOKIE_NAME]
                        : req?.cookies?.[ACCESS_TOKEN_COOKIE_NAME]
                ) || null,
            ]),
            ignoreExpiration: false,
            secretOrKey: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtAccessSecretKey,
        });
    }

    /**
     * Called after verification JWT
     * @param payload contents of JWT
     */
    async validate(payload: AuthTokenPayloadDto) {
        const isValid = await this.authLoginService.isLoginValid(payload.jti);
        if (!isValid) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }
        const validateData: IJwtStrategyValidateData = {
            user: await this.authService.createAuthUserDto(payload),
            loginUid: payload.jti,
        };
        return validateData;
    }
}
