export class AuthTokenPayloadDto {
    id: number;

    iat: number;

    exp: number;

    iss: string;

    sub: string;

    jti: string;

    // deviceUid: string; // TODO
}
