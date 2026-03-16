import {IntegerField, PhoneField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSendCodeDto {
    @PhoneField()
    phone: string;

    @IntegerField()
    userId: number;

    @StringField({
        required: false,
    })
    purpose?: string;
}