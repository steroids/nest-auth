import {IntegerField, PhoneField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSendCodeDto {
    @PhoneField()
    phone: string;

    @IntegerField()
    userId: number;
}
