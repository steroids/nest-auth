import {
    PrimaryKeyField,
    RelationField,
    StringField,
    CreateTimeField,
    UpdateTimeField, UidField, RelationIdField, BooleanField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';

/**
 * Авторизации пользователя с токенами
 */
export class AuthLoginModel {
    @PrimaryKeyField()
    id: number;

    @UidField()
    uid: string;

    @RelationField({
        label: 'ID пользователя',
        type: 'ManyToOne',
        relationClass: () => UserModel,
    })
    user: UserModel;

    @RelationIdField({
        nullable: true,
        relationName: 'user',
    })
    userId: number;

    @StringField({
        label: 'Токен доступа',
        noColumn: true,
    })
    accessToken: string;

    @StringField({
        label: 'Время истечения токена',
        noColumn: true,
    })
    accessExpireTime: string;

    @StringField({
        label: 'Токен для обновления',
        noColumn: true,
    })
    refreshToken: string;

    @StringField({
        label: 'Время истечения токена обновления',
        noColumn: true,
    })
    refreshExpireTime: string;

    @StringField({
        label: 'IP адрес',
        nullable: true,
    })
    ipAddress: string;

    @StringField({
        label: 'Месторасположение',
        nullable: true,
    })
    location: string;

    @StringField({
        label: 'User-agent',
        nullable: true,
    })
    userAgent: string;

    @BooleanField({
        label: 'Отозван?',
        nullable: true,
    })
    isRevoked: boolean;

    @CreateTimeField({
        label: 'Создан',
    })
    createTime: string;

    @UpdateTimeField({
        label: 'Обновлен',
    })
    updateTime: string;
}
