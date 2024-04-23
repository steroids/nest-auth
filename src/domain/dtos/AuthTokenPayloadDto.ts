import { IntegerField, StringField } from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthTokenPayloadDto {
    @IntegerField()
    id: number;

    @IntegerField()
    iat: number;

    @IntegerField()
    exp: number;

    @StringField()
    iss: string;

    @StringField()
    sub: string;

    @StringField()
    jti: string;

    deviceUid: string; // TODO
}
