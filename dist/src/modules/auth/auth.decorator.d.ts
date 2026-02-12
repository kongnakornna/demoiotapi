import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
export declare function AuthUserRequired(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function AuthUserRequired2(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function AuthTokenRequired(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare class auth {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    GetrefreshToken(req: any): Promise<void>;
}
export declare const PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
