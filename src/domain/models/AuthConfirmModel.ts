import {
    RelationField,
    PrimaryKeyField,
    StringField,
    EmailField,
    PhoneField,
    BooleanField,
    DateTimeField,
    CreateTimeField,
    UpdateTimeField, IntegerField, UidField, RelationIdField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {UserModel} from '@steroidsjs/nest-modules/user/models/UserModel';

/**
 * Отправленные коды подтверждений
 */
export class AuthConfirmModel {
    @PrimaryKeyField()
    id: number;

    @UidField({
        label: 'UID отправки',
    })
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

    @EmailField({
        label: 'Email',
        nullable: true,
    })
    email: string;

    @PhoneField({
        label: 'Телефон',
        max: 20,
        nullable: true,
    })
    phone: string;

    @StringField({
        label: 'Код',
    })
    code: string;

    @StringField({
        label: 'Системное имя провайдера для отправки',
    })
    providerName: string;

    @BooleanField({
        label: 'Код подтвержден?',
    })
    isConfirmed: boolean;

    @DateTimeField({
        label: 'До какого времени действует код',
    })
    expireTime: string;

    @DateTimeField({
        label: 'Время последней отправки кода',
    })
    lastSentTime: string;

    @IntegerField({
        label: 'Количество попыток',
        nullable: true,
    })
    attemptsCount: number;

    @CreateTimeField({
        label: 'Создан',
    })
    createTime: string;

    @UpdateTimeField({
        label: 'Обновлен',
    })
    updateTime: string;
}
