import { IAuthRevokeUserActiveSessionsUseCase } from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveSessionsUseCase';
import { AuthLoginService } from '../../domain/services/AuthLoginService';

export class AuthRevokeUserActiveLoginsUseCase implements IAuthRevokeUserActiveSessionsUseCase {
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
