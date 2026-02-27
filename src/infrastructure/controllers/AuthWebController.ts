import {Body, Controller, Inject, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {
    IAuthUpdateUserOwnPasswordUseCase,
} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {AuthUpdateUserOwnPasswordUseCase} from '../../usecases/updatePassword/AuthUpdateUserOwnPasswordUseCase';
import {
    AuthUpdateUserOwnPasswordUseCaseDto,
} from '../../usecases/updatePassword/dtos/AuthUpdateUserOwnPasswordUseCaseDto';
import {AuthSetCookieInterceptor} from '../interceptors/AuthSetCookieInterceptor';
import {AuthClearCookieInterceptor} from '../interceptors/AuthClearCookieInterceptor';
import {REFRESH_TOKEN_COOKIE_NAME} from '../../domain/constants';
import {Cookies} from '../decorators/Cookies';
import {AuthLoginSchema} from '../../domain/dtos/AuthLoginSchema';

@ApiTags('Авторизация (для веб-приложений)')
@Controller('/auth/web')
export class AuthWebController {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
        @Inject(IAuthUpdateUserOwnPasswordUseCase)
        private readonly updatePasswordUseCase: AuthUpdateUserOwnPasswordUseCase,
    ) {}

    @Post('/login')
    @UseInterceptors(AuthSetCookieInterceptor)
    @UseGuards(LoginPasswordAuthGuard)
    @ApiBody({type: AuthLoginDto})
    @ApiOkResponse({type: AuthLoginSchema})
    login(@Context() context: ContextDto) {
        return this.authService.login(context.user, context);
    }

    @Post('/refresh')
    @UseInterceptors(AuthSetCookieInterceptor)
    @ApiOkResponse({type: AuthLoginSchema})
    refresh(
        @Cookies(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
    ) {
        return this.authService.refreshToken(refreshToken);
    }

    @Post('/logout')
    @UseInterceptors(AuthClearCookieInterceptor)
    @UseGuards(JwtAuthGuard)
    logout(@Context() context: ContextDto) {
        return this.authService.logout(context);
    }

    @Post('/update-password')
    @UseInterceptors(AuthClearCookieInterceptor)
    @UseGuards(JwtAuthGuard)
    updatePassword(
        @Context() context: ContextDto,
        @Body() dto: AuthUpdateUserOwnPasswordUseCaseDto,
    ) {
        return this.updatePasswordUseCase.handle(dto, context);
    }
}
