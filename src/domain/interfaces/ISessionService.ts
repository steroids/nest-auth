import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';

export const ISessionService = 'ISessionService';

// eslint-disable-next-line no-redeclare
export interface ISessionService {
    comparePassword: (password: string, hash: string) => Promise<boolean>,
    hashPassword: (password: string) => Promise<string>,

    signToken: (payload: Buffer | object, options?: any) => string,
    verifyToken: (token: string, options?: any) => Promise<any>,
    getTokenPayload: (token: string, options?: any) => AuthTokenPayloadDto,
    getTokenExpireTime: (token: string) => (Date | null),
}
