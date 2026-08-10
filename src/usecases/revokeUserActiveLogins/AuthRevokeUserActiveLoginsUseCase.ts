import {IAuthRevokeUserActiveLoginsUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveLoginsUseCase';
import {Injectable} from '@nestjs/common';
import {AuthLoginService} from '../../domain/services/AuthLoginService';

@Injectable()
export class AuthRevokeUserActiveLoginsUseCase implements IAuthRevokeUserActiveLoginsUseCase {
    constructor(
        private readonly authLoginService: AuthLoginService,
    ) {}

    public async handle(userId: number) {
        const userAuthLogins = await this.authLoginService.getUserActiveAuthLogins(userId);
        for (const userAuthLogin of userAuthLogins) {
            await this.authLoginService.revoke(userAuthLogin.uid);
        }
    }
}
