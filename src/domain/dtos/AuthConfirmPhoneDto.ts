import {PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmPhoneDto {
    @PhoneField()
    phone: string;
}
