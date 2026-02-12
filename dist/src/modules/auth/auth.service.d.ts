import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { User } from '@src/modules/users/entities/user.entity';
import 'dotenv/config';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    generateTokenApikey(payload: any): Promise<string>;
    generateToken(ids: any): Promise<string>;
    generateTokenDecode(ids: any): Promise<string>;
    generateTokenTime(id: string): Promise<string>;
    generateTokenUser(ids: any, expires: any): Promise<string>;
    validateUser(payload: any): Promise<User | undefined>;
    authenticateSetGen(auth: any): Promise<any>;
    authenticateSet(auth: any): Promise<any>;
    authenticate(auth: any): Promise<any>;
    authenticateEmail(auth: any): Promise<any>;
    authenticateuser(auth: any): Promise<any>;
    authenticateemail(auth: any): Promise<any>;
    authenticateUserAuthen(auth: any): Promise<any>;
    authenticateUserAuthen2(auth: any): Promise<any>;
    userUnlock(auth: any): Promise<any>;
    authenticateUserEmail(auth: any): Promise<any>;
    authenticateUser(auth: any): Promise<any>;
    authenticateToken(auth: any): Promise<any>;
    checkRefreshToken(id: string): Promise<void>;
    checkRefreshTokenInt(id: string): Promise<1 | 0>;
    validateRefreshToken(id: string, refreshtoken: string): Promise<{
        id: string;
    }>;
    validateGoogleUser(googleUser: CreateUserDto): Promise<User>;
    generateAccessToken(id: any): Promise<string>;
    generateRefreshToken(id: string, expiresIn: number): Promise<string>;
}
