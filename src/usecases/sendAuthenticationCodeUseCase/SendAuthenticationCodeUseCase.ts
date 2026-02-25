import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthConfirmSendCodeDto} from '../../domain/dtos/AuthConfirmSendCodeDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthenticateWithCodeDto} from './dtos/AuthenticateWithCodeDto';
import {ISendAuthenticationCodeUseCase} from './ISendAuthenticationCodeUseCase';

@Injectable()
export class SendAuthenticationCodeUseCase implements ISendAuthenticationCodeUseCase {
    constructor(
        protected readonly authConfirmService: AuthConfirmService,
        @Inject(IUserService)
        protected readonly userService: IUserService,
    ) {}

    public async handle(
        providerType: string | null,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ): Promise<AuthConfirmModel> {
        const user = await this.userService.findByLogin(dto.phone);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const sendCodeDto: AuthConfirmSendCodeDto = {
            userId: user.id,
            phone: dto.phone,
        };

        return this.authConfirmService.sendCode(sendCodeDto, providerType, context);
    }
}
