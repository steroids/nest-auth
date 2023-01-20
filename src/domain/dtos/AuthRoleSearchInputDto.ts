import {StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {SearchInputDto} from '@steroidsjs/nest/usecases/dtos/SearchInputDto';

export class AuthRoleSearchInputDto extends SearchInputDto {
    @StringField({
        label: 'Наименование роли',
    })
    query: string;
}
