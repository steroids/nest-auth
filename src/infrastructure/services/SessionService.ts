import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {JwtSignOptions, JwtVerifyOptions} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthTokenPayloadDto} from '../../domain/dtos/AuthTokenPayloadDto';
import JwtTokenStatusEnum from '../../domain/enums/JwtTokenStatusEnum';
import {AuthLoginService} from '../../domain/services/AuthLoginService';

@Injectable()
export class SessionService implements ISessionService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => AuthLoginService))
        private readonly authLoginService: AuthLoginService,
    ) {}

    async hashPassword(password: string) {
        return bcrypt.hash(password, 5);
    }

    async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    signToken(payload: string | Buffer | object, options?: JwtSignOptions): string {
        if (!(typeof payload === 'object')) {
            throw new Error('Wrong payload type: ' + (typeof payload));
        }
        // make payload plain object, as jwtService doesn't accept class instances
        const {...plainPayload} = payload;
        return this.jwtService.sign(plainPayload, options);
    }

    async verifyToken(token: string, options?: JwtVerifyOptions): Promise<{ status: string, payload: any }> {
        let payload: any;

        try {
            payload = this.jwtService.verify(token, options);
        } catch (e) {
            if (e.name === JwtTokenStatusEnum.TOKEN_ERROR || e.name === JwtTokenStatusEnum.EXPIRED_ERROR) {
                payload = this.jwtService.decode(token, options);
                return {
                    status: e.name,
                    payload,
                };
            }
            throw e;
        }

        const isLoginValid = await this.authLoginService.isLoginValid(payload.jti);

        return {
            status: isLoginValid ? JwtTokenStatusEnum.VALID : JwtTokenStatusEnum.TOKEN_ERROR,
            payload,
        };
    }

    getTokenPayload(token: string, options?: JwtVerifyOptions): AuthTokenPayloadDto {
        return this.jwtService.decode(token, options) as AuthTokenPayloadDto;
    }

    getTokenExpireTime(token: string): Date | null {
        const decoded = this.jwtService.decode(token) as { exp: number };
        return decoded && decoded.exp
            ? new Date(decoded.exp * 1000)
            : null;
    }
}
