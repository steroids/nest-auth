import {ExecutionContext, Injectable} from '@nestjs/common';
import {getTokenFromHttpRequest} from '../helpers/GetTokenFromHttpRequest';
import {JwtAuthGuard} from './JwtAuthGuard';

/**
 * JWT Guard skipping an empty JWT
 */
@Injectable()
export class PublicJwtAuthGuard extends JwtAuthGuard {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const token = getTokenFromHttpRequest(req);

        if (!token) {
            return true;
        }

        return super.canActivate(context);
    }
}
