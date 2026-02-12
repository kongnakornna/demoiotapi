import { Response } from 'express';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { Role } from '@src/modules/roles/entities/role.entity';
import { AuthService } from '@src/modules/auth/auth.service';
import { RolesService } from '@src/modules/roles/roles.service';
export declare class RolesController {
    private readonly rolesService;
    private usersService;
    private authService;
    private readonly jwtService;
    constructor(rolesService: RolesService, usersService: UsersService, authService: AuthService, jwtService: JwtService);
    index(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<Role>;
    list(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<Role>;
}
