import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {IValidator} from '@steroidsjs/nest/usecases/interfaces/IValidator';
import {IUserUpdatePasswordUseCase} from '@steroidsjs/nest-modules/user/usecases/IUserUpdatePasswordUseCase';
import {IAuthUpdateUserOwnPasswordUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {IAuthRevokeUserActiveLoginsUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveLoginsUseCase';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {AuthUpdateUserOwnPasswordUseCaseDto} from './dtos/AuthUpdateUserOwnPasswordUseCaseDto';
import {AUTH_UPDATE_PASSWORD_VALIDATORS_TOKEN} from '../../domain/constants/AuthUpdatePasswordValidatorsToken';

@Injectable()
export class AuthUpdateUserOwnPasswordUseCase implements IAuthUpdateUserOwnPasswordUseCase {
    constructor(
        @Inject(IUserUpdatePasswordUseCase)
        private readonly userUpdatePasswordUseCase: IUserUpdatePasswordUseCase,
        @Inject(IAuthRevokeUserActiveLoginsUseCase)
        private readonly revokeUserActiveLoginsUseCase: IAuthRevokeUserActiveLoginsUseCase,
        @Inject(AUTH_UPDATE_PASSWORD_VALIDATORS_TOKEN)
        private readonly validators: IValidator[],
    ) {}

    public async handle(dto: AuthUpdateUserOwnPasswordUseCaseDto, context: ContextDto) {
        await ValidationHelper.validate(dto, {context}, this.validators);

        await this.userUpdatePasswordUseCase.handle(context.user.id, dto.newPassword, context);

        await this.revokeUserActiveLoginsUseCase.handle(context.user.id);
    }
}
