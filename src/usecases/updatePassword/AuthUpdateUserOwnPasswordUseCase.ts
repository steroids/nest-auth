import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {IValidator} from '@steroidsjs/nest/usecases/interfaces/IValidator';
import {IUserUpdatePasswordUseCase} from '@steroidsjs/nest-modules/user/usecases/IUserUpdatePasswordUseCase';
import {IAuthUpdateUserOwnPasswordUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {IAuthRevokeUserActiveLoginsUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthRevokeUserActiveLoginsUseCase';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {AuthUpdateUserOwnPasswordUseCaseDto} from './dtos/AuthUpdateUserOwnPasswordUseCaseDto';

export class AuthUpdateUserOwnPasswordUseCase implements IAuthUpdateUserOwnPasswordUseCase {
    constructor(
        private readonly userUpdatePasswordUseCase: IUserUpdatePasswordUseCase,
        private readonly revokeUserActiveLoginsUseCase: IAuthRevokeUserActiveLoginsUseCase,
        private readonly validators: IValidator[],
    ) {}

    public async handle(dto: AuthUpdateUserOwnPasswordUseCaseDto, context: ContextDto) {
        await ValidationHelper.validate(dto, {context}, this.validators);

        await this.userUpdatePasswordUseCase.handle(context.user.id, dto.newPassword, context);

        await this.revokeUserActiveLoginsUseCase.handle(context.user.id);
    }
}
