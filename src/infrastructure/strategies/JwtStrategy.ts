import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UnauthorizedException} from '@steroidsjs/nest/usecases/exceptions';
import {AuthLoginService} from '../../domain/services/AuthLoginService';
import {AuthTokenPayloadDto} from '../../domain/dtos/AuthTokenPayloadDto';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {IAuthModuleConfig} from '../config';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
    constructor(
        private authLoginService: AuthLoginService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('token'),
            ]),
            ignoreExpiration: false,
            secretOrKey: ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule).jwtAccessSecretKey,
        });
    }

    async validate(payload: AuthTokenPayloadDto) {
        const isValid = await this.authLoginService.isLoginValid(payload.jti);
        if (!isValid) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
