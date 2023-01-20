import {IContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {RelationField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {AuthConfirmSectionDto} from './AuthConfirmSectionDto';

export class ContextDto implements IContextDto {
    user?: any | {
        id?: number,
        name?: string,
    };

    @StringField({
        isArray: true,
    })
    permissions?: string[];

    @RelationField({
        type: 'ManyToOne',
        relationClass: () => AuthConfirmSectionDto,
    })
    authConfirm?: AuthConfirmSectionDto;
}
