import { Response } from 'express';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { RolesService } from '@src/modules/roles/roles.service';
import { UserLog } from '@src/modules/syslog/entities/userlog.entity';
import { SyslogService } from '@src/modules/syslog/syslog.service';
import { CreateSyslogTypeDto } from '@src/modules/syslog/dto/create-syslog-type.dto';
export declare class SyslogController {
    private readonly syslogService;
    private readonly rolesService;
    private usersService;
    private authService;
    private readonly jwtService;
    constructor(syslogService: SyslogService, rolesService: RolesService, usersService: UsersService, authService: AuthService, jwtService: JwtService);
    listuserlog(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    getdevice(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    listuserlogs(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    getlisttypelog(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<UserLog>;
    createtypelog(query: any, headers: any, params: any, req: any, res: Response, TypeDto: CreateSyslogTypeDto): Promise<string>;
    createlog(query: any, headers: any, params: any, req: any, res: Response, dto: any): Promise<string>;
}
