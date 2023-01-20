import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {UnauthorizedException} from '@steroidsjs/nest/usecases/exceptions';
import {AuthLoginService} from '../../domain/services/AuthLoginService';
import {AuthService} from '../../domain/services/AuthService';
import {AuthTokenPayloadDto} from '../../domain/dtos/AuthTokenPayloadDto';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
    constructor(
        private configService: ConfigService,
        private authLoginService: AuthLoginService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('token'),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.jwtAccessSecretKey'),
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
