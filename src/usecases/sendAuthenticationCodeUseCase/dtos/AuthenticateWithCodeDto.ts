import {PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthenticateWithCodeDto {
    @PhoneField()
    phone: string;
}
