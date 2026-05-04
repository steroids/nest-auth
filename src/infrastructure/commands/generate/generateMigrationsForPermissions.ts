import {loadConfiguration} from '@nestjs/cli/lib/utils/load-configuration';
import {join} from 'path';
import {CommandUtils} from '@steroidsjs/typeorm/commands/CommandUtils';
import {DataSource} from '@steroidsjs/typeorm';
import {getNewPermissions} from './getNewPermissions';
import {getTemplate, prettifyQuery} from './helpers';

const ADD_PERMISSIONS_NAME = 'AddPermissions';
const DEFAULT_PERMISSION_TABLE = 'auth_permission';
const DEFAULT_PERMISSION_COLUMN = 'name';
const DEFAULT_PERMISSION_MODULE = 'auth';

export const generateMigrationsForPermissions = async (dataSource: DataSource) => {
    const newPermissions = await getNewPermissions(dataSource, DEFAULT_PERMISSION_TABLE, DEFAULT_PERMISSION_COLUMN);

    if (!newPermissions.length) {
        // eslint-disable-next-line no-console
        console.log('info', 'No changes in permissions were found');
        return;
    }

    const cliConfiguration = await loadConfiguration();
    const dirPath = join(process.cwd(), cliConfiguration.sourceRoot, DEFAULT_PERMISSION_MODULE, 'infrastructure', 'migrations');

    const values = newPermissions
        .map(key => `('${key}')`)
        .join(',\n            ');

    const upRaw = `INSERT INTO ${DEFAULT_PERMISSION_TABLE} (${DEFAULT_PERMISSION_COLUMN}) VALUES\n    ${values};`;

    const permissionList = newPermissions
        .map((permission) => `'${permission}'`)
        .join(', ');

    const downRaw = `DELETE FROM ${DEFAULT_PERMISSION_TABLE} WHERE ${DEFAULT_PERMISSION_COLUMN} IN (${permissionList});`;

    const upQueries = [`        await queryRunner.query(\`${prettifyQuery(upRaw)}\`);`];
    const downQueries = [`        await queryRunner.query(\`${prettifyQuery(downRaw)}\`);`];

    const timestamp = new Date().getTime();
    const migrationFileContent = getTemplate(ADD_PERMISSIONS_NAME, timestamp, upQueries, downQueries);
    const migrationFilePath = join(dirPath, `${timestamp}-${ADD_PERMISSIONS_NAME}.ts`);
    // eslint-disable-next-line no-console
    console.log('info', '\t' + migrationFilePath);
    await CommandUtils.createFile(migrationFilePath, migrationFileContent);
};
