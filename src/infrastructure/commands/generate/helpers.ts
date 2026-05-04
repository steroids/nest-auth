import {format} from '@sqltools/formatter';

/**
 * Gets contents of the migration file.
 */
export const getTemplate = (name: string, timestamp: number, upSqls: string[], downSqls: string[]): string => {
    const migrationName = `${name}${timestamp}`;

    return `import {MigrationInterface, QueryRunner} from '@steroidsjs/typeorm';

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join(`
`)}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join(`
`)}
    }
}
`;
};

export const prettifyQuery = (query: string) => {
    const formattedQuery = format(query, {indent: '    '});
    query = '\n' + formattedQuery.replace(/^/gm, '            ') + '\n        ';
    query = query.replace(/`/g, '\\`');
    return query;
};
