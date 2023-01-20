import {
    RelationField,
    PrimaryKeyField,
    StringField,
    BooleanField, RelationIdField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';
import {AuthPermissionModel} from './AuthPermissionModel';

/**
 * Роли в системе
 */
export class AuthRoleModel {
    @PrimaryKeyField()
    id: number;

    @StringField({
        label: 'Название',
        nullable: true,
    })
    name: string;

    @StringField({
        label: 'Название',
        nullable: true,
    })
    title: string;

    @StringField({
        label: 'Название',
        nullable: true,
    })
    description: string;

    @BooleanField({
        label: 'Активно?',
    })
    isActive: boolean;

    @StringField({
        label: 'Время истечения роли',
        nullable: true,
    })
    expireTime: Date;

    @RelationField({
        label: 'ID родительской роли (наследование)',
        type: 'ManyToOne',
        nullable: true,
        relationClass: () => AuthRoleModel,
    })
    parent: AuthRoleModel;

    @RelationIdField({
        nullable: true,
        relationName: 'parent',
    })
    parentId: number;

    @RelationField({
        label: '',
        type: 'ManyToMany',
        isOwningSide: true,
        relationClass: () => UserModel,
        inverseSide: (user: UserModel) => user.authRoles,
    })
    users: UserModel[];

    @RelationField({
        label: '',
        type: 'ManyToMany',
        isOwningSide: true,
        relationClass: () => AuthPermissionModel,
    })
    authPermissions: AuthPermissionModel[];
}
