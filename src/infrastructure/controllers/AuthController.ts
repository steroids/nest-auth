import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {
    IAuthUpdateUserOwnPasswordUseCase,
} from '@steroidsjs/nest-modules/auth/usecases/IAuthUpdateUserOwnPasswordUseCase';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {AuthService} from '../../domain/services/AuthService';
import {AuthLoginDto} from '../../domain/dtos/AuthLoginDto';
import {LoginPasswordAuthGuard} from '../guards/LoginPasswordAuthGuard';
import {AuthRefreshTokenDto} from '../../domain/dtos/AuthRefreshTokenDto';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {AuthUpdateUserOwnPasswordUseCase} from '../../usecases/updatePassword/AuthUpdateUserOwnPasswordUseCase';
import {
    AuthUpdateUserOwnPasswordUseCaseDto,
} from '../../usecases/updatePassword/dtos/AuthUpdateUserOwnPasswordUseCaseDto';
import {AuthLoginSchema} from '../schemas/AuthLoginSchema';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(IAuthUpdateUserOwnPasswordUseCase)
        private readonly updatePasswordUseCase: AuthUpdateUserOwnPasswordUseCase,
    ) {}

    @Post('/login')
    @UseGuards(LoginPasswordAuthGuard)
    @ApiBody({type: AuthLoginDto})
    @ApiOkResponse({type: AuthLoginSchema})
    async login(@Context() context: ContextDto) {
        const authLogin = await this.authService.login(context.user, context);
        return DataMapper.create(AuthLoginSchema, authLogin);
    }

    @Post('/refresh')
    @ApiBody({type: AuthRefreshTokenDto})
    @ApiOkResponse({type: AuthLoginSchema})
    async refresh(@Body() dto: AuthRefreshTokenDto) {
        const authLogin = await this.authService.refreshToken(dto.refreshToken);
        return DataMapper.create(AuthLoginSchema, authLogin);
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
