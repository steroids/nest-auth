import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {JwtSignOptions, JwtVerifyOptions} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import {Injectable} from '@nestjs/common';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthTokenPayloadDto} from '../../domain/dtos/AuthTokenPayloadDto';
import JwtTokenStatusEnum from '../../domain/enums/JwtTokenStatusEnum';

@Injectable()
export class SessionService implements ISessionService {
    constructor(
        private readonly jwtService: JwtService,
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

    verifyToken(token: string, options?: JwtVerifyOptions): {status: string, payload: any} {
        try {
            return {
                status: JwtTokenStatusEnum.VALID,
                payload: this.jwtService.verify(token, options),
            };
        } catch (e) {
            if (e.name === JwtTokenStatusEnum.TOKEN_ERROR || e.name === JwtTokenStatusEnum.EXPIRED_ERROR) {
                const payload = this.jwtService.decode(token, options);
                return {
                    status: e.name,
                    payload,
                };
            }
            throw e;
        }
    }

    getTokenPayload(token: string, options?: JwtVerifyOptions): AuthTokenPayloadDto {
        return this.jwtService.decode(token, options) as AuthTokenPayloadDto;
    }
}
