export interface IAuthJwtCookieConfig {
    signed?: boolean,
    httpOnly?: boolean,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: boolean | 'lax' | 'strict' | 'none',
}
