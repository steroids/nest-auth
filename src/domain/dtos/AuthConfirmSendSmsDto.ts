import {PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSendSmsDto {
    @PhoneField()
    phone: string;
}
