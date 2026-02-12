import { AuthService } from './auth.service';
import 'dotenv/config';
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<import("../users/entities/user.entity").User>;
}
export {};
