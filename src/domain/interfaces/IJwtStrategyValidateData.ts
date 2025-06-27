import {AuthUserDto} from '../dtos/AuthUserDto';

export interface IJwtStrategyValidateData {
    user: AuthUserDto,
    loginUid: string,
}
