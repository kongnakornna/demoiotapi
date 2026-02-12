/// <reference types="multer" />
import { Response } from 'express';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { UsersService } from '@src/modules/users/users.service';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { fileDto } from '@src/modules/users/dto/file.dto';
import { FogotPassword } from '@src/modules/users/dto/forgeot-password.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
export declare class UsersController {
    private usersService;
    private authService;
    private readonly jwtService;
    constructor(usersService: UsersService, authService: AuthService, jwtService: JwtService);
    Me(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<User>;
    paginate(res: Response, dto: any, query: any, headers: any, params: any, page: number, limit: number, req: any): Promise<Pagination<User>>;
    uploadFile(res: Response, query: any, headers: any, params: any, req: any, body: fileDto, file: Express.Multer.File): {
        body: fileDto;
        file: string;
    };
    uploadFileAndPassValidation(res: Response, query: any, headers: any, params: any, req: any, body: fileDto, file?: Express.Multer.File): {
        body: fileDto;
        file: string;
    };
    uploadFileAndFailValidation(res: Response, query: any, headers: any, params: any, req: any, body: fileDto, file: Express.Multer.File): {
        body: fileDto;
        file: string;
    };
    listUser(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    deleteprofile(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    profiledetail(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    Profile(res: Response, query: any, headers: any, params: any, req: any): Promise<User>;
    ProfilePost(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<User>;
    updateProfile(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    update_status(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    verifyresetpaas(dto: any, query: any, headers: any, params: any, req: any, Request: any, res: Response, Param: string): Promise<User>;
    ResetSystem(query: any, headers: any, params: any, req: any, Request: any, res: Response, Reset: any): Promise<User>;
    ForgotPassword(res: Response, input: FogotPassword, query: any, headers: any, params: any, req: any): Promise<void>;
    GetrefreshToken(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<any>;
    logOut(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<User>;
    remove(req: any, id: string, res: Response, dto: any, query: any, headers: any, params: any): Promise<void>;
}
