import { StringField } from '@steroidsjs/nest/infrastructure/decorators/fields';
import { Validator } from '@steroidsjs/nest/usecases/validators';
import { PasswordValidator } from '../../../infrastructure/validators/PasswordValidator';

export class AuthUpdateUserOwnPasswordUseCaseDto {
    @StringField({
        label: 'Текущий пароль',
        required: true,
    })
    @Validator(PasswordValidator)
    currentPassword: string;

    @StringField({
        label: 'Новый пароль',
        required: true,
    })
    newPassword: string;
}
