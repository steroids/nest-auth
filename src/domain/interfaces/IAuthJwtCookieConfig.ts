export interface IAuthJwtCookieConfig {
    signed?: boolean,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: boolean | 'lax' | 'strict' | 'none',
}
