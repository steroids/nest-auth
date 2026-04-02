import {StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthenticateWithCodeDto {
    @StringField()
    target: string;
}
