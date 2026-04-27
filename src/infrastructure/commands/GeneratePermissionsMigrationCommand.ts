import {Command} from 'nestjs-command';
import {Inject, Injectable} from '@nestjs/common';
import {DataSource} from '@steroidsjs/typeorm';
import {generateMigrationsForPermissions} from './generate/generateMigrationsForPermissions';

@Injectable()
export class GeneratePermissionsMigrationCommand {
    constructor(
        @Inject(DataSource)
        private dataSource: DataSource,
    ) {
    }

    @Command({
        command: 'migrate:generate-permissions',
        describe: 'Create migrations for permissions, it is used to synchronize the current list of permissions between the code and the database.',
    })
    async generatePermissions() {
        await generateMigrationsForPermissions(this.dataSource);
    }
}