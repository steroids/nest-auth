import {PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthorizeWithCodeDto {
    @PhoneField()
    phone: string;
}
