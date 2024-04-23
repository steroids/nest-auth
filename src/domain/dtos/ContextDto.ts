import {IContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {RelationField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {AuthConfirmSectionDto} from './AuthConfirmSectionDto';

export class ContextDto implements IContextDto {
    user?: any | {
        id?: number,
        name?: string,
        permissions?: string[],
    };

    @RelationField({
        type: 'ManyToOne',
        relationClass: () => AuthConfirmSectionDto,
    })
    authConfirm?: AuthConfirmSectionDto;

    @StringField({
        nullable: true,
    })
    ipAddress: string;

    @StringField({
        nullable: true,
    })
    userAgent?: string;

    @StringField({
        nullable: true,
    })
    loginUid?: string;
}
