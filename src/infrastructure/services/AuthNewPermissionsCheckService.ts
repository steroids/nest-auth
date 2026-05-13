import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {DataSource} from '@steroidsjs/typeorm';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
import {normalizeBoolean} from '@steroidsjs/nest/infrastructure/decorators/fields/BooleanField';
import * as path from 'path';
import {IAuthModuleConfig} from '../config';
import {getNewPermissions} from '../commands/generate/getNewPermissions';

@Injectable()
export class AuthNewPermissionsCheckService implements OnApplicationBootstrap {
    constructor(
        private readonly dataSource: DataSource,
    ) {
    }

    async onApplicationBootstrap() {
        const config = ModuleHelper.getConfig<IAuthModuleConfig>(AuthModule);

        if (!config?.checkNewPermissions || this.isCliContext()) {
            return;
        }

        const newPermissions = await getNewPermissions(this.dataSource);

        if (newPermissions.length) {
            throw new Error('The new permissions are available in the code,'
                + ' but they are not in the database. Generate and run migrations.');
        }
    }

    private isCliContext() {
        return normalizeBoolean(process.env.APP_IS_CLI)
            || process.argv.some(arg => this.isNestjsCommandBinPath(arg));
    }

    private isNestjsCommandBinPath(value: string) {
        const parts = path.normalize(value).split(path.sep);

        return parts.at(-3) === 'nestjs-command'
            && parts.at(-2) === 'bin'
            && parts.at(-1) === 'cli';
    }
}
