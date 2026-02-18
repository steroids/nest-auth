import {IUserService} from '@steroidsjs/nest-modules/user/services/IUserService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {Inject, Injectable} from '@nestjs/common';
import {AuthConfirmService} from '../../domain/services/AuthConfirmService';
import {AuthConfirmSendCodeDto} from '../../domain/dtos/AuthConfirmSendCodeDto';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';
import {
    GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN,
    IGetAuthConfirmTargetFieldUseCase,
} from '../getAuthConfirmTargetField/IGetAuthConfirmTargetFieldUseCase';
import {AuthConfirmProviderType} from '../../domain/types/AuthConfirmProviderType';
import {AuthenticateWithCodeDto} from './dtos/AuthenticateWithCodeDto';
import {ISendAuthenticationCodeUseCase} from './ISendAuthenticationCodeUseCase';

@Injectable()
export class SendAuthenticationCodeUseCase implements ISendAuthenticationCodeUseCase {
    constructor(
        protected readonly authConfirmService: AuthConfirmService,
        @Inject(IUserService)
        protected readonly userService: IUserService,
        @Inject(GET_AUTH_CONFIRM_TARGET_FIELD_USE_CASE_TOKEN)
        protected readonly getAuthConfirmTargetFieldUseCase: IGetAuthConfirmTargetFieldUseCase,
    ) {}

    public async handle(
        providerType: AuthConfirmProviderType | null,
        dto: AuthenticateWithCodeDto,
        context: ContextDto,
    ): Promise<AuthConfirmModel> {
        const targetField = this.getAuthConfirmTargetFieldUseCase.handle(providerType);

        const user = await this.userService
            .createQuery()
            .where([
                '=',
                targetField,
                dto.target,
            ])
            .one();

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const sendCodeDto: AuthConfirmSendCodeDto = {
            userId: user.id,
            target: dto.target,
        };

        return this.authConfirmService.sendCode(sendCodeDto, providerType, context);
    }
}
