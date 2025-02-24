import { IntegerField, StringField } from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthUserDto {
    @IntegerField({
        label: 'ID пользователя',
    })
    id: number;

    @StringField({
        label: 'Имя пользователя',
        nullable: true,
    })
    name?: string;

    @StringField({
        label: 'Права пользователя',
        nullable: true,
        isArray: true,
    })
    permissions?: string[];

    @StringField({
        label: 'UID устройства пользователя',
        nullable: true,
    })
    deviceUid?: string;
}
