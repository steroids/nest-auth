import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {Inject, Injectable} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthService} from '../../domain/services/AuthService';
import {ISessionService} from '../../domain/interfaces/ISessionService';

export const LOGIN_SMS_CODE_STRATEGY_NAME = 'login-sms-code';

@Injectable()
export class LoginSmsCodeStrategy extends PassportStrategy(Strategy, LOGIN_SMS_CODE_STRATEGY_NAME) {
    constructor(
        @Inject(AuthConfirmService) private authConfirmService: AuthConfirmService,
        @Inject(AuthService) private authService: AuthService,
        /** SessionService */
        private sessionService: ISessionService,
    ) {
        super();
    }

    async validate(uid: string, code: string): Promise<any> {


    }
}
