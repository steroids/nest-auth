import {IntegerField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSendCodeDto {
    @StringField()
    target: string;

    @IntegerField()
    userId: number;
}
