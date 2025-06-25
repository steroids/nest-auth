import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';

export class AuthFilePermissionService {
    constructor(
        //private fileService: FileService,
    ) {}

    public async verifyFileAccess(filename: string, context: ContextDto) {
        return true;
    }
}
