import { Response } from 'express';
import { AuthService } from '@src/modules/auth/auth.service';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { Useraccessmenu } from '@src/modules/accessmenu/entities/useraccessmenu.entity';
import { UsersService } from '@src/modules/users/users.service';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { AccessmenuService } from '@src/modules/accessmenu/accessmenu.service';
import { CreateAccessmenuDto } from '@src/modules/accessmenu/dto/create-accessmenu.dto';
import { UpdateAccessmenuDto } from '@src/modules/accessmenu/dto/update-accessmenu.dto';
export declare class AccessmenuController {
    private accessmenuService;
    private usersService;
    private authService;
    private jwtService;
    constructor(accessmenuService: AccessmenuService, usersService: UsersService, authService: AuthService, jwtService: JwtService);
    create(Request: any, res: Response, headers: any, createAccessmenuDto: CreateAccessmenuDto): Promise<void>;
    getHello(req: any): Promise<any>;
    findAll(res: Response, query: any, headers: any, params: any, req: any): Promise<AccessMenu>;
    finduseraccessss(Request: any, res: Response, headers: any, Param: string, query: any): Promise<Useraccessmenu>;
    findOne(res: Response, query: any, headers: any, id: string, req: any): Promise<string>;
    update(res: Response, query: any, headers: any, id: string, updateAccessmenuDto: UpdateAccessmenuDto): Promise<string>;
    remove(res: Response, query: any, headers: any, id: string): Promise<string>;
}
