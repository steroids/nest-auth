import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiTags} from '@nestjs/swagger';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {AuthRefreshTokenDto} from '../../domain/dtos/AuthRefreshTokenDto';
import {Context} from '../decorators/Context';
import { ContextDto } from '../../domain/dtos/ContextDto';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService: AuthService,
    ) {}

    @Post('/login')
    @UseGuards(LoginPasswordAuthGuard)
    @ApiBody({type: AuthLoginDto})
    login(@Context() context: ContextDto) {
        return this.authService.login(context.user, context);
    }

    @Post('/refresh')
    @ApiBody({type: AuthRefreshTokenDto})
    refresh(@Body() dto: AuthRefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }

    @Post('/logout')
    logout(@Context() context: ContextDto) {
        return this.authService.logout(context);
    }
}
