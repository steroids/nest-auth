import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiTags} from '@nestjs/swagger';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {AuthRefreshTokenDto} from '../../domain/dtos/AuthRefreshTokenDto';
import {Context} from '../decorators/Context';

@ApiTags('Авторизация')
@Controller('/auth')
export class AdminAuthController {
    constructor(
        @Inject(AuthService) private authService: AuthService,
    ) {}

    @Post('/login')
    @UseGuards(LoginPasswordAuthGuard)
    @ApiBody({type: AuthLoginDto})
    login(@Context() context) {
        return this.authService.login(context.user);
    }

    @Post('/refresh')
    @ApiBody({type: AuthRefreshTokenDto})
    refresh(@Body() dto: AuthRefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
}
