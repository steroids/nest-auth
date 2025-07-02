import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthConfirmSendCodeDto} from '../../domain/dtos/AuthConfirmSendCodeDto';
import {AuthorizeWithCodeDto} from './dtos/AuthorizeWithCodeDto';

@Injectable()
export class SendAuthorizationCodeUseCase {
    constructor(
        protected readonly authConfirmService: AuthConfirmService,
        @Inject(IUserService)
        protected readonly userService: IUserService,
    ) {}

    public async handle(
        providerType: string | null,
        dto: AuthorizeWithCodeDto,
        context: ContextDto,
        schemaClass = null,
    ) {
        const user = await this.userService.findByLogin(dto.phone);

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const sendCodeDto: AuthConfirmSendCodeDto = {
            userId: user.id,
            phone: dto.phone,
        };

        return this.authConfirmService.sendCode(sendCodeDto, providerType, context, schemaClass);
    }
}
