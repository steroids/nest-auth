import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
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
import {AuthConfirmEmailDto} from '../../domain/dtos/AuthConfirmEmailDto';
import {AuthConfirmProviderTypeEnum} from '../../domain/enums/AuthConfirmProviderTypeEnum';

@ApiTags('Авторизация по email')
@Controller('/auth/email')
export class AuthEmailController {
    constructor(
        @Inject(AUTHENTICATE_WITH_CODE_USE_CASE_TOKEN)
        private readonly authenticateWithCodeUseCase: IAuthenticateWithCodeUseCase,
        @Inject(SEND_AUTHENTICATION_CODE_USE_CASE_TOKEN)
        private readonly sendAuthenticationCodeUseCase: ISendAuthenticationCodeUseCase,
    ) {
    }

    @Post('/send')
    @ApiOkResponse({type: AuthConfirmSchema})
    async send(
        @Body() dto: AuthConfirmEmailDto,
        @Context() context: ContextDto,
    ) {
        const authConfirm = await this.sendAuthenticationCodeUseCase.handle(
            AuthConfirmProviderTypeEnum.EMAIL,
            DataMapper.create(AuthenticateWithCodeDto, {target: dto.email}),
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
