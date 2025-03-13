import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {AuthRoleModel} from '../../domain/models/AuthRoleModel';
import {AuthRoleBaseSchema} from './AuthRoleBaseSchema';

export class AuthRoleSchema {
    @ExtendField(AuthRoleModel)
    id: number;

    @ExtendField(AuthRoleModel)
    name: string;

    @ExtendField(AuthRoleModel)
    title: string;

    @ExtendField(AuthRoleModel)
    description: string;

    @ExtendField(AuthRoleModel)
    isActive: boolean;

    @ExtendField(AuthRoleModel, {
        relationClass: () => AuthRoleBaseSchema,
    })
    parent: AuthRoleBaseSchema;

    @ExtendField(AuthRoleModel)
    parentId: number;

    @ExtendField(AuthRoleModel)
    expireTime: Date;
}
