import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthConfirmSendCodeDto} from '../../domain/dtos/AuthConfirmSendCodeDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
import {AuthenticateWithCodeDto} from './dtos/AuthenticateWithCodeDto';
import {ISendAuthenticationCodeUseCase} from './ISendAuthenticationCodeUseCase';
import {AuthConfirmTargetService, IResolvedTargetInfo} from "../../domain/services/AuthConfirmTargetService";

@Injectable()
export class SendAuthenticationCodeUseCase implements ISendAuthenticationCodeUseCase {
    constructor(
        protected readonly authConfirmService: AuthConfirmService,
        @Inject(IUserService)
        protected readonly userService: IUserService,
        protected readonly authConfirmTargetService: AuthConfirmTargetService,
    ) {
    }

    public async handle(
        providerType: AuthConfirmProviderType,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ): Promise<AuthConfirmModel> {
        const resolvedTargetInfo: IResolvedTargetInfo = await this.authConfirmTargetService.resolveTargetInfo(providerType, dto.target);

        const user = await this.userService
            .createQuery()
            .where([
                '=',
                resolvedTargetInfo.targetField,
                resolvedTargetInfo.target,
            ])
            .one();

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const sendCodeDto: AuthConfirmSendCodeDto = {
            userId: user.id,
            target: resolvedTargetInfo.target,
        };

        return this.authConfirmService.sendCode(sendCodeDto, providerType, context, null, resolvedTargetInfo);
    }
}
