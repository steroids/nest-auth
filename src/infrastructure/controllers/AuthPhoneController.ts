import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Context} from '@steroidsjs/nest/infrastructure/decorators/Context';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {CodeAuthGuard} from '../guards/CodeAuthGuard';
import {AuthConfirmSendSmsDto} from '../../domain/dtos/AuthConfirmSendSmsDto';
import {AuthConfirmLoginDto} from '../../domain/dtos/AuthConfirmLoginDto';
import {AuthConfirmSchema} from '../schemas/AuthConfirmSchema';
import {AuthLoginSchema} from '../schemas/AuthLoginSchema';
import {AuthConfirmProviderTypeEnum} from '../../domain/enums/AuthConfirmProviderTypeEnum';
import {AuthConfirmSendDto} from '../../domain/dtos/AuthConfirmSendDto';

@ApiTags('Авторизация по телефону')
@Controller('/auth/phone')
export class AuthPhoneController {
    constructor(
        @Inject(AuthConfirmService)
        private authConfirmService: AuthConfirmService,
    ) {
    }

    @Post('/sms')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCode(
        @Body() dto: AuthConfirmSendSmsDto,
        @Context() context: ContextDto,
    ) {
        return this.authConfirmService.sendCode(
            DataMapper.create(AuthConfirmSendDto, {target: dto.phone}),
            AuthConfirmProviderTypeEnum.SMS,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/call')
    @ApiOkResponse({type: AuthConfirmSchema})
    async sendSmsCodeByCall(
        @Body() dto: AuthConfirmSendSmsDto,
        @Context() context: ContextDto,
    ) {
        return this.authConfirmService.sendCode(
            DataMapper.create(AuthConfirmSendDto, {target: dto.phone}),
            AuthConfirmProviderTypeEnum.CALL,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/send')
    @ApiOkResponse({type: AuthConfirmSchema})
    async send(
        @Body() dto: AuthConfirmSendSmsDto,
        @Context() context: ContextDto,
    ) {
        return this.authConfirmService.sendCode(
            DataMapper.create(AuthConfirmSendDto, {target: dto.phone}),
            null,
            context,
            AuthConfirmSchema,
        );
    }

    @Post('/confirm')
    @ApiBody({type: AuthConfirmLoginDto})
    @ApiOkResponse({type: AuthLoginSchema})
    @UseGuards(CodeAuthGuard)
    async loginByPhoneCode(
        @Body() dto: AuthConfirmLoginDto,
        @Context() context: ContextDto,
    ) {
        return this.authConfirmService.confirmCode(dto, context, AuthLoginSchema);
    }
}
