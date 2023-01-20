import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {RolesAuthGuard} from '../guards/RolesAuthGuard';

export const STEROIDS_AUTH_GUARD_PERMISSIONS = 'steroids_auth_guard_permissions';

export function AuthPermissions(...permissions: (string|null)[]) {
    return applyDecorators(
        SetMetadata(STEROIDS_AUTH_GUARD_PERMISSIONS, permissions),
        UseGuards(...[
            permissions && permissions.length > 0 && RolesAuthGuard,
        ].filter(Boolean)),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiOperation({
            summary: permissions && permissions.length > 0 && 'Requires permission',
            description: `Required permissions: ${permissions.join(', ')}`,
        }),
    );
}
