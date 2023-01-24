import {IntegerField, PasswordField, StringField, PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {IUserRegistrationDto} from '@steroidsjs/nest-modules/user/dtos/IUserRegistrationDto';

export class UserRegistrationDto implements IUserRegistrationDto {
    @StringField({
        nullable: true,
    })
    login: string;

    @StringField({
        nullable: true,
    })
    email: string;

    @PhoneField({
        nullable: true,
    })
    phone: string;

    @PasswordField({
        nullable: true,
    })
    password: string;

    @IntegerField({
        nullable: true,
    })
    authRolesIds: number[];
}
