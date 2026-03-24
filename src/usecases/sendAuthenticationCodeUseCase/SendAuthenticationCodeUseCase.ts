import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthConfirmSendCodeDto} from '../../domain/dtos/AuthConfirmSendCodeDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
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
        providerType: AuthConfirmProviderType,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ): Promise<AuthConfirmModel> {
        const resolvedTarget = await this.authConfirmService.resolveTarget(providerType, dto.target);

        const user = await this.userService
            .createQuery()
            .where([
                '=',
                resolvedTarget.validator.targetField,
                resolvedTarget.target,
            ])
            .one();

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const sendCodeDto: AuthConfirmSendCodeDto = {
            userId: user.id,
            target: resolvedTarget.target,
        };

        return this.authConfirmService.sendCode(sendCodeDto, providerType, context, null, resolvedTarget);
    }
}
