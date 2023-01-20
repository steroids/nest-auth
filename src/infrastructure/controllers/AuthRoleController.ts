import {Body, Controller, forwardRef, Get, Inject, Param, Post, Query, UseGuards} from '@nestjs/common';
import {ApiOkSearchResponse} from '@steroidsjs/nest/infrastructure/decorators/ApiOkSearchResponse';
import {ApiBody, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {AuthRoleService} from '../../domain/services/AuthRoleService';
import {AuthRoleDetailSchema} from '../schemas/AuthRoleDetailSchema';
import {AuthRoleSearchInputDto} from '../../domain/dtos/AuthRoleSearchInputDto';
import {AuthRoleSaveDto} from '../../domain/dtos/AuthRoleSaveDto';
import {AuthPermissions} from '../decorators/AuthPermissions';
import {
    PERMISSION_AUTH_MANAGE_ROLES_EDIT,
    PERMISSION_AUTH_MANAGE_ROLES_VIEW,
} from '../permissions';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {Context} from '../decorators/Context';

@ApiTags('Роли')
@Controller('/auth/roles')
export class AuthRoleController {
    constructor(
        @Inject(forwardRef(() => AuthRoleService))
        private roleService: AuthRoleService,
    ) {
    }

    @Get()
    @AuthPermissions(PERMISSION_AUTH_MANAGE_ROLES_VIEW)
    @ApiOkSearchResponse({type: AuthRoleDetailSchema})
    @UseGuards(JwtAuthGuard)
    async search(@Context() context, @Query() dto: AuthRoleSearchInputDto) {
        dto.pageSize = 0;
        return this.roleService.search(dto, context, AuthRoleDetailSchema);
    }

    @Get('/autocomplete')
    @UseGuards(JwtAuthGuard)
    async autocomplete() {
        return this.roleService.getAutocomplete();
    }

    @Get('/:id')
    @AuthPermissions(PERMISSION_AUTH_MANAGE_ROLES_VIEW)
    @ApiOkResponse({type: AuthRoleDetailSchema})
    @UseGuards(JwtAuthGuard)
    async findById(@Context() context, @Param('id') id: string) {
        return this.roleService.findById(id, context, AuthRoleDetailSchema);
    }

    @Post()
    @AuthPermissions(PERMISSION_AUTH_MANAGE_ROLES_EDIT)
    @ApiBody({type: AuthRoleSaveDto})
    @ApiOkResponse({type: AuthRoleDetailSchema})
    @UseGuards(JwtAuthGuard)
    async create(@Context() context, @Body() dto: AuthRoleSaveDto) {
        return this.roleService.updateOrCreate(dto, null, context, AuthRoleDetailSchema);
    }

    @Post('/:id')
    @AuthPermissions(PERMISSION_AUTH_MANAGE_ROLES_EDIT)
    @ApiBody({type: AuthRoleSaveDto})
    @ApiOkResponse({type: AuthRoleDetailSchema})
    @UseGuards(JwtAuthGuard)
    async update(@Context() context, @Param('id') id: string, @Body() dto: AuthRoleSaveDto) {
        return this.roleService.updateOrCreate(dto, id, context, AuthRoleDetailSchema);
    }
}
