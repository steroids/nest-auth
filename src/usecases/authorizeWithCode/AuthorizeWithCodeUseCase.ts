import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {Inject, Injectable} from '@nestjs/common';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthService} from '../../domain/services/AuthService';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';

@Injectable()
export class AuthorizeWithCodeUseCase {
    constructor(
        protected readonly authService: AuthService,
        protected readonly authConfirmService: AuthConfirmService,
        @Inject(IUserService)
        protected readonly userService: IUserService,
    ) {}

    public async handle(dto: AuthConfirmLoginDto, context: ContextDto, schemaClass = null) {
        const authConfirmModel = await this.authConfirmService.confirmCode(dto);

        const user = await this.userService.findById(authConfirmModel.userId);

        // Авторизуемся
        const tokenPayload = this.authService.createTokenPayload(user);
        const authUserDto = await this.authService.createAuthUserDto(tokenPayload);
        const loginModel = await this.authService.login(authUserDto, context);

        return schemaClass ? DataMapper.create(schemaClass, loginModel) : loginModel;
    }
}
