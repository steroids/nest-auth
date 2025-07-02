import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {CodeAuthGuard} from '../guards/CodeAuthGuard';
import {AuthorizeWithCodeDto} from '../../usecases/sendAuthorizationCode/dtos/AuthorizeWithCodeDto';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthConfirmSchema} from '../schemas/AuthConfirmSchema';
import {AuthLoginSchema} from '../schemas/AuthLoginSchema';
import {SendAuthorizationCodeUseCase} from '../../usecases/sendAuthorizationCode/SendAuthorizationCodeUseCase';
import {AuthorizeWithCodeUseCase} from '../../usecases/authorizeWithCode/AuthorizeWithCodeUseCase';

@ApiTags('Авторизация по телефону')
@Controller('/auth/phone')
export class AuthPhoneController {
    constructor(
        private readonly authorizeWithCodeUseCase: AuthorizeWithCodeUseCase,
        private readonly sendAuthorizationCodeUseCase: SendAuthorizationCodeUseCase,
    ) {
    }

    @Post('/sms')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCode(
        @Body() dto: AuthorizeWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthorizationCodeUseCase.handle(
            NotifierProviderType.SMS,
            dto,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/call')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCodeByCall(
        @Body() dto: AuthorizeWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthorizationCodeUseCase.handle(
            NotifierProviderType.CALL,
            dto,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/send')
    @ApiOkResponse({type: AuthConfirmSchema})
    async send(
        @Body() dto: AuthorizeWithCodeDto,
        @Context() context: ContextDto,
    ) {
        return this.sendAuthorizationCodeUseCase.handle(
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
    async authorizeWithCode(
        @Body() dto: AuthConfirmLoginDto,
        @Context() context: ContextDto,
    ) {
        return this.authorizeWithCodeUseCase.handle(dto, context, AuthLoginSchema);
    }
}
