import {SearchInputDto} from '@steroidsjs/nest/usecases/dtos/SearchInputDto';
import {StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthConfirmSearchInputDto extends SearchInputDto {
    @StringField({
        label: 'uid',
    })
    uid: string;
}
