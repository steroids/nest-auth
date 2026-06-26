import {EmailField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmEmailDto {
    @EmailField()
    email: string;
}
