import {IAuthRevokeUserActiveLoginsUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveLoginsUseCase';
import {Inject} from '@nestjs/common';
import {AuthLoginService} from '../../domain/services/AuthLoginService';

export class AuthRevokeUserActiveLoginsUseCase implements IAuthRevokeUserActiveLoginsUseCase {
    constructor(
        @Inject(AuthLoginService)
        private readonly authLoginService: AuthLoginService,
    ) {}

    public async handle(userId: number) {
        const userAuthLogins = await this.authLoginService.getUserActiveAuthLogins(userId);
        for (const userAuthLogin of userAuthLogins) {
            await this.authLoginService.revoke(userAuthLogin.uid);
        }
    }
}
