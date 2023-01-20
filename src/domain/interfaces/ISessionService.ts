import {AuthTokenPayloadDto} from '../dtos/AuthTokenPayloadDto';

export const ISessionService = 'ISessionService';

export interface ISessionService {
    comparePassword: (password: string, hash: string) => Promise<boolean>,
    hashPassword: (password: string) => Promise<string>,

    signToken: (payload: Buffer | object, options?: any) => string,
    verifyToken: (token: string, options?: any) => any,
    getTokenPayload: (token: string, options?: any) => AuthTokenPayloadDto,
}
