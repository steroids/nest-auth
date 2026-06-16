import {Injectable, OnApplicationBootstrap, Optional} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';
import {DataSource} from '@steroidsjs/typeorm';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {normalizeBoolean} from '@steroidsjs/nest/infrastructure/decorators/fields/BooleanField';
import {IAuthModuleConfig} from '../config';
import {getNewPermissions} from '../commands/generate/getNewPermissions';

@Injectable()
export class AuthNewPermissionsCheckService implements OnApplicationBootstrap {
    constructor(
        private readonly dataSource: DataSource,
        @Optional()
        private readonly httpAdapterHost?: HttpAdapterHost,
    ) {
    }

    async onApplicationBootstrap() {
        const config = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule);

        if (!config?.checkNewPermissions || this.isMigrationCliContext()) {
            return;
        }

        const newPermissions = await getNewPermissions(this.dataSource);

        if (newPermissions.length) {
            throw new Error('The new permissions are available in the code,'
                + ' but they are not in the database. Generate and run migrations.');
        }
    }

    private isMigrationCliContext() {
        return this.isCliApplicationContext() && this.isMigrateCommand();
    }

    private isCliApplicationContext() {
        return normalizeBoolean(process.env.APP_IS_CLI) && !this.httpAdapterHost?.httpAdapter;
    }

    private isMigrateCommand() {
        return process.argv.some(arg => arg.startsWith('migrate'));
    }
}
