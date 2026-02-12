import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '@src/modules/auth/types/auth-jwtPayload';
import refreshJwtConfig from '@src/modules/auth/config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '@src/modules/auth/auth.service';
declare const RefreshJwtStrategy_base: new (...args: unknown[]) => any;
export declare class RefreshJwtStrategy extends RefreshJwtStrategy_base {
    private refrshJwtConfiguration;
    private authService;
    constructor(refrshJwtConfiguration: ConfigType<typeof refreshJwtConfig>, authService: AuthService);
    validate(req: Request, payload: AuthJwtPayload): Promise<{
        id: string;
    }>;
}
export {};
