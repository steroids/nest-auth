import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Request} from 'express';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IAuthModuleConfig} from '../config';

export const Cookies = createParamDecorator((cookieName: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const cookies = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule)?.jwtCookie?.signed
        ? request?.signedCookies
        : request?.cookies;

    return cookieName
        ? cookies?.[cookieName]
        : cookies;
});
