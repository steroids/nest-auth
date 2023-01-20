import {IntegerField, StringField} from '@steroidsjs/nest/infrastructure/decorators/fields';

export class AuthRolesAutocompleteDto {
    @IntegerField()
    id: number;

    @StringField()
    label: string;
}
