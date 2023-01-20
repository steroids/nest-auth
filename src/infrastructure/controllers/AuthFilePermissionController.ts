import {ApiTags} from '@nestjs/swagger';
import {Controller, forwardRef, Get, HttpStatus, Inject, Req, Res, UseGuards} from '@nestjs/common';
import { Response } from 'express';
import {AuthFilePermissionService} from '../../domain/services/AuthFilePermissionService';
import {FilesAuthGuard} from '../guards/FilesAuthGuard';
import {Context} from '../decorators/Context';
import {ContextDto} from '../../domain/dtos/ContextDto';

@ApiTags('Проверка прав на доступ к файлу')
@Controller('/auth/file-permission')
export class AuthFilePermissionController {
    constructor(
        @Inject(forwardRef(() => AuthFilePermissionService))
        private service: AuthFilePermissionService,
    ) {
    }

    @UseGuards(FilesAuthGuard)
    @Get()
    async verify(
        @Req() request,
        @Res() res: Response,
        @Context() context: ContextDto,
    ) {
        const originalUri = request.headers['x-original-uri'];
        const fileName = originalUri.split('/').at(-1);
        const userHaveAccess = await this.service.verifyFileAccess(fileName, context);
        if (userHaveAccess) {
            res.status(HttpStatus.OK).send();
        } else {
            res.status(HttpStatus.FORBIDDEN).send();
        }
    }
}
