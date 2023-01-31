import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {IModule} from '@steroidsjs/nest/infrastructure/decorators/Module';
import config from './infrastructure/config';
import module from './infrastructure/module';
import permissions from './infrastructure/permissions';
import tables from './infrastructure/tables';

export default {
    rootTarget: AuthModule,
    global: true,
    tables,
    config,
    module,
    permissions,
} as IModule;
