import {Body, Controller, Inject, Post, Res, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {
    IAuthUpdateUserOwnPasswordUseCase,
} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {Response} from 'express';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {
    AuthUpdateUserOwnPasswordUseCaseDto,
} from '../../usecases/updatePassword/dtos/AuthUpdateUserOwnPasswordUseCaseDto';
import {REFRESH_TOKEN_COOKIE_NAME} from '../../domain/constants';
import {Cookies} from '../decorators/Cookies';
import {AuthCookieLoginSchema} from '../schemas/AuthCookieLoginSchema';
import {AuthCookieService} from '../services/AuthCookieService';

@ApiTags('Авторизация (через cookie)')
@Controller('/auth/cookie')
export class AuthCookieController {
    constructor(
        private readonly authService: AuthService,
        private readonly authCookieService: AuthCookieService,
        @Inject(IAuthUpdateUserOwnPasswordUseCase)
        private readonly updatePasswordUseCase: IAuthUpdateUserOwnPasswordUseCase,
    ) {}

    @Post('/login')
    @UseGuards(LoginPasswordAuthGuard)
    @ApiBody({type: AuthLoginDto})
    @ApiOkResponse({type: AuthCookieLoginSchema})
    async login(
        @Context() context: ContextDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const authLogin = await this.authService.login(context.user, context);
        this.authCookieService.setTokens(response, {
            accessToken: authLogin.accessToken,
            refreshToken: authLogin.refreshToken,
        });
        return DataMapper.create(AuthCookieLoginSchema, authLogin);
    }

    @Post('/refresh')
    @ApiOkResponse({type: AuthCookieLoginSchema})
    async refresh(
        @Cookies(REFRESH_TOKEN_COOKIE_NAME) refreshToken: string,
        @Res({passthrough: true}) response: Response,
    ) {
        const authLogin = await this.authService.refreshToken(refreshToken);
        this.authCookieService.setTokens(response, {
            accessToken: authLogin.accessToken,
            refreshToken: authLogin.refreshToken,
        });
        return DataMapper.create(AuthCookieLoginSchema, authLogin);
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Context() context: ContextDto,
        @Res({passthrough: true}) response: Response,
    ) {
        await this.authService.logout(context);
        this.authCookieService.clearTokens(response);
    }

    @Post('/update-password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @Context() context: ContextDto,
        @Body() dto: AuthUpdateUserOwnPasswordUseCaseDto,
        @Res({passthrough: true}) response: Response,
    ) {
        await this.updatePasswordUseCase.handle(dto, context);
        this.authCookieService.clearTokens(response);
    }
}
