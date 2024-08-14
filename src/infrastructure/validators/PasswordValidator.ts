import { IValidator, IValidatorParams } from '@steroidsjs/nest/usecases/interfaces/IValidator';
import { IUserService } from '@steroidsjs/nest-modules/user/services/IUserService';
import { ISessionService } from '@steroidsjs/nest-modules/auth/services/ISessionService';
import { FieldValidatorException } from '@steroidsjs/nest/usecases/exceptions/FieldValidatorException';

interface IPasswordValidatorDto {
    currentPassword: string;
}

export class PasswordValidator implements IValidator {
    constructor(
        private readonly userService: IUserService,
        private readonly sessionService: ISessionService,
    ) {}

    public async validate(dto: IPasswordValidatorDto, params?: IValidatorParams) {
        const userId: number = params.context?.user?.id;
        if (!userId) {
            throw new Error('Context is not provided for PasswordValidator');
        }
        const user = await this.userService.findById(params.context?.user?.id);

        if (!user) {
            throw new Error(`User with id=${userId} not found`);
        }

        const isPasswordEquals = await this.sessionService.comparePassword(dto.currentPassword, user.passwordHash);

        if (!isPasswordEquals) {
            throw new FieldValidatorException('Неверный пароль');
        }
    }
}
