import { AuthService } from '@src/modules/auth/auth.service';
import { UsersService } from '@src/modules/users/users.service';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UserAuthModel } from '@src/modules/users/dto/user-auth.dto';
import { EmailChk } from '@src/modules/users/dto/email-chk.dto';
import { CreateUserDemoDto } from '@src/modules/users/dto/create-demo-user.dto';
import { ResetDto } from '@src/modules/users/dto/Reset.dto';
import { otpverifyDto } from '@src/modules/redis/dto/otpverify.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { redisDto } from '@src/modules/redis/dto/redis.dto';
import { redisUserDto } from '@src/modules/redis/dto/redisuser.dto';
import 'dotenv/config';
export declare class AuthController {
    private readonly jwtService;
    private authService;
    private readonly userService;
    constructor(jwtService: JwtService, authService: AuthService, userService: UsersService);
    generatetoken(request: Request, res: Response, userModel: CreateUserDemoDto): Promise<void>;
    ResetSystem(Request: any, res: Response, ResetModel: ResetDto): Promise<string>;
    allRevenueData(req: any, res: Response): Promise<void>;
    allRevenue(req: any, res: Response): Promise<void>;
    resetToken(req: any, res: Response): Promise<void>;
    SigninvalidateOTP(Request: any, res: Response, caseModel: redisUserDto): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
    Signin(res: Response, auth: UserAuthModel): Promise<void>;
    SigninUser(res: Response, auth: any): Promise<void>;
    Signinapp(query: any, headers: any, params: any, req: any, res: Response, auth: any): Promise<string>;
    userUnlock(Request: any, res: Response, auth: EmailChk): Promise<string>;
    signup(res: Response, userModel: CreateUserDto): Promise<void>;
    signup3(Req: any, query: any, res: Response, userModel: CreateUserDto): Promise<string>;
    otp(Request: any): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
    verifyOTP(Request: any, res: Response, caseModel: redisDto): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
    SigninOTP(Req: any, res: Response, auth: UserAuthModel): Promise<string>;
    verifyUserOTP(Request: any, res: Response, caseModel: otpverifyDto): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
}
