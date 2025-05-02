import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {AuthConfirmModel} from '../../domain/models/AuthConfirmModel';

@TableFromModel(AuthConfirmModel, 'auth_confirm')
export class AuthConfirmTable extends AuthConfirmModel {}
