import { AuthService } from '@src/modules/auth/auth.service';
import { UsersService } from '@src/modules/users/users.service';
declare const LocalStrategy_base: new (...args: unknown[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    validate(email: string, password: string): Promise<import("../../users/entities/user.entity").User>;
}
export {};
