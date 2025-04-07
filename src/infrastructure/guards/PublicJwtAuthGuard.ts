import {Inject, Injectable} from '@nestjs/common';
import {ISessionService} from '../../domain/interfaces/ISessionService';
import {AuthService} from '../../domain/services/AuthService';
import {JwtAuthGuard} from "./JwtAuthGuard";

@Injectable()
export class PublicJwtAuthGuard extends JwtAuthGuard {
    constructor(
        @Inject(ISessionService)
        protected sessionsService: ISessionService,
        protected authService: AuthService,
    ) {
        super(sessionsService, authService);
    }

    protected readonly allowEmptyToken: boolean = true;
}
