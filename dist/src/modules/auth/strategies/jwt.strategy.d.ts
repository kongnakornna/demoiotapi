import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import { UsersService } from '@src/modules/users/users.service';
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private jwtConfiguration;
    private authService;
    private usersService;
    constructor(jwtConfiguration: ConfigType<typeof jwtConfig>, authService: AuthService, usersService: UsersService);
    validate(payload: AuthJwtPayload): Promise<import("../../users/entities/user.entity").User>;
}
export {};
