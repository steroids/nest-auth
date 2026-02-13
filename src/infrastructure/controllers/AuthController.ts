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
import {AuthRefreshTokenDto} from '../../domain/dtos/AuthRefreshTokenDto';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {AuthUpdateUserOwnPasswordUseCase} from '../../usecases/updatePassword/AuthUpdateUserOwnPasswordUseCase';
import {
    AuthUpdateUserOwnPasswordUseCaseDto,
} from '../../usecases/updatePassword/dtos/AuthUpdateUserOwnPasswordUseCaseDto';
import {AuthLoginModel} from '../../domain/models/AuthLoginModel';
import {AuthSetCookieInterceptor} from '../interceptors/AuthSetCookieInterceptor';
import {AuthClearCookieInterceptor} from '../interceptors/AuthClearCookieInterceptor';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
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
    @ApiOkResponse({type: AuthLoginModel})
    login(@Context() context: ContextDto) {
        return this.authService.login(context.user, context);
    }

    @Post('/refresh')
    @UseInterceptors(AuthSetCookieInterceptor)
    @ApiBody({type: AuthRefreshTokenDto})
    @ApiOkResponse({type: AuthLoginModel})
    refresh(@Body() dto: AuthRefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
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
