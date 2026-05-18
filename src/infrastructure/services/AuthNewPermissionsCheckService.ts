import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {DataSource} from '@steroidsjs/typeorm';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {AuthModule} from '@steroidsjs/nest-modules/auth/AuthModule';
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

        if (!config?.checkNewPermissions || this.isMigrateCliCommand()) {
            return;
        }

        const newPermissions = await getNewPermissions(this.dataSource);

        if (newPermissions.length) {
            throw new Error('The new permissions are available in the code,'
                + ' but they are not in the database. Generate and run migrations.');
        }
    }

    private isMigrateCliCommand() {
        const cliBinArgIndex = process.argv.findIndex(arg => this.isNestjsCommandBinPath(arg));
        if (cliBinArgIndex === -1) {
            return false;
        }
        const commandName = process.argv[cliBinArgIndex + 1];
        return commandName?.startsWith('migrate');
    }

    private isNestjsCommandBinPath(value: string) {
        const parts = path.normalize(value).split(path.sep);

        return parts.at(-3) === 'nestjs-command'
            && parts.at(-2) === 'bin'
            && parts.at(-1) === 'cli';
    }
}
