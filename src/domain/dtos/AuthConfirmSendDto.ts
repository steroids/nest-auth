import {StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSendDto {
    @StringField()
    target: string;
}
