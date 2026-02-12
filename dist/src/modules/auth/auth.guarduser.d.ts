import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import 'dotenv/config';
import { UsersService } from '@src/modules/users/users.service';
export declare class AuthGuardUser implements CanActivate {
    private readonly jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UsersService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    canActivateS(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
