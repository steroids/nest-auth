import {IContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {RelationField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {AuthConfirmSectionDto} from './AuthConfirmSectionDto';
import {AuthUserDto} from './AuthUserDto';

export class ContextDto implements IContextDto {
    @RelationField({
        type: 'ManyToOne',
        relationClass: () => AuthUserDto,
    })
    user?: AuthUserDto;

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
