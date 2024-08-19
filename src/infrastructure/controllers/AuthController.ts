import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiTags} from '@nestjs/swagger';
import {IAuthUpdateUserOwnPasswordUseCase} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {AuthRefreshTokenDto} from '../../domain/dtos/AuthRefreshTokenDto';
import {Context} from '../decorators/Context';
import {ContextDto} from '../../domain/dtos/ContextDto';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {AuthUpdateUserOwnPasswordUseCase} from '../../usecases/updatePassword/AuthUpdateUserOwnPasswordUseCase';
import {AuthUpdateUserOwnPasswordUseCaseDto} from '../../usecases/updatePassword/dtos/AuthUpdateUserOwnPasswordUseCaseDto';

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
    @UseGuards(JwtAuthGuard)
    logout(@Context() context: ContextDto) {
        return this.authService.logout(context);
    }

    @Post('/update-password')
    @UseGuards(JwtAuthGuard)
    updatePassword(
        @Context() context: ContextDto,
        @Body() dto: AuthUpdateUserOwnPasswordUseCaseDto,
    ) {
        return this.updatePasswordUseCase.handle(dto, context);
    }
}
