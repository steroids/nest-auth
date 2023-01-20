import {StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthRefreshTokenDto {
    @StringField()
    refreshToken: string;
}
