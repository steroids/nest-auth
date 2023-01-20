export interface IJwtService {
    sign: (payload: string | object | Buffer, options: any) => string,
}
