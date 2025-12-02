import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {CodeAuthGuard} from '../guards/CodeAuthGuard';
import {AuthenticateWithCodeDto} from '../../usecases/sendAuthenticationCodeUseCase/dtos/AuthenticateWithCodeDto';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthConfirmSchema} from '../schemas/AuthConfirmSchema';
import {AuthLoginSchema} from '../schemas/AuthLoginSchema';
import {
    AUTHENTICATE_WITH_CODE_USE_CASE_TOKEN,
    IAuthenticateWithCodeUseCase,
} from '../../usecases/authenticateWithCodeUseCase/IAuthenticateWithCodeUseCase';
import {
    ISendAuthenticationCodeUseCase,
    SEND_AUTHENTICATION_CODE_USE_CASE_TOKEN,
} from '../../usecases/sendAuthenticationCodeUseCase/ISendAuthenticationCodeUseCase';

@ApiTags('Авторизация по телефону')
@Controller('/auth/phone')
export class AuthPhoneController {
    constructor(
        @Inject(AUTHENTICATE_WITH_CODE_USE_CASE_TOKEN)
        private readonly authenticateWithCodeUseCase: IAuthenticateWithCodeUseCase,
        @Inject(SEND_AUTHENTICATION_CODE_USE_CASE_TOKEN)
        private readonly sendAuthenticationCodeUseCase: ISendAuthenticationCodeUseCase,
    ) {
    }

    @Post('/sms')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCode(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        const authConfirm = await this.sendAuthenticationCodeUseCase.handle(
            NotifierProviderType.SMS,
            dto,
            context,
        );
        return DataMapper.create(AuthConfirmSchema, authConfirm);
    }

    @Post('/call')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCodeByCall(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        const authConfirm = await this.sendAuthenticationCodeUseCase.handle(
            NotifierProviderType.CALL,
            dto,
            context,
        );
        return DataMapper.create(AuthConfirmSchema, authConfirm);
    }

    @Post('/send')
    @ApiOkResponse({type: AuthConfirmSchema})
    async send(
        @Body() dto: AuthenticateWithCodeDto,
        @Context() context: ContextDto,
    ) {
        const authConfirm = await this.sendAuthenticationCodeUseCase.handle(
            null,
            dto,
            context,
        );
        return DataMapper.create(AuthConfirmSchema, authConfirm);
    }

    @Post('/confirm')
    @ApiBody({type: AuthConfirmLoginDto})
    @ApiOkResponse({type: AuthLoginSchema})
    @UseGuards(CodeAuthGuard)
    async authenticateWithCode(
        @Body() dto: AuthConfirmLoginDto,
        @Context() context: ContextDto,
    ) {
        const authLogin = await this.authenticateWithCodeUseCase.handle(dto, context);
        return DataMapper.create(AuthLoginSchema, authLogin);
    }
}
