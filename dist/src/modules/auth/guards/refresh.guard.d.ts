import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
export declare class RefreshJwtGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    deCodeToken(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
