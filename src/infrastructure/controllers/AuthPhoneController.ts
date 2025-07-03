import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {CodeAuthGuard} from '../guards/CodeAuthGuard';
import {AuthenticateWithCodeDto} from '../../usecases/sendAuthenticationCodeUseCase/dtos/AuthenticateWithCodeDto';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthConfirmSchema} from '../schemas/AuthConfirmSchema';
import {AuthLoginSchema} from '../schemas/AuthLoginSchema';
import {SendAuthenticationCodeUseCase} from '../../usecases/sendAuthenticationCodeUseCase/SendAuthenticationCodeUseCase';
import {AuthenticateWithCodeUseCase} from '../../usecases/authenticateWithCodeUseCase/AuthenticateWithCodeUseCase';

@ApiTags('Авторизация по телефону')
@Controller('/auth/phone')
export class AuthPhoneController {
    constructor(
        private readonly authenticateWithCodeUseCase: AuthenticateWithCodeUseCase,
        private readonly sendAuthenticationCodeUseCase: SendAuthenticationCodeUseCase,
    ) {
    }

    @Post('/sms')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCode(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthenticationCodeUseCase.handle(
            NotifierProviderType.SMS,
            dto,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/call')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCodeByCall(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthenticationCodeUseCase.handle(
            NotifierProviderType.CALL,
            dto,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/send')
    @ApiOkResponse({type: AuthConfirmSchema})
    async send(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthenticationCodeUseCase.handle(
            null,
            dto,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/confirm')
    @ApiBody({type: AuthConfirmLoginDto})
    @ApiOkResponse({type: AuthLoginSchema})
    @UseGuards(CodeAuthGuard)
    async authenticateWithCode(
        @Body() dto: AuthConfirmLoginDto,
        @Context() context: ContextDto,
    ) {
        return this.authenticateWithCodeUseCase.handle(dto, context, AuthLoginSchema);
    }
}
