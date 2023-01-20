import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {ContextDto} from '../../domain/dtos/ContextDto';

export const Context = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const {user, permissions} = request;

        const contextDto = new ContextDto();

        contextDto.user = user;
        contextDto.permissions = permissions;

        return contextDto;
    },
);
