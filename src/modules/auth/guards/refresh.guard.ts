import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import 'dotenv/config';
require('dotenv').config();

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('RefreshJwtGuard token : ' + request);
    console.log('RefreshJwtGuard token : ' + token);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      console.log('RefreshJwtGuard payload : ' + payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  async deCodeToken(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const decoded: any = this.jwtService.decode(token);
    return decoded;
  }

  private extractTokenFromHeader(request: Request) {
    //console.log('extractTokenFromHeader request : ' + request);
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    //console.log('extractTokenFromHeader request.headers : ' + request.headers);
    //console.log('extractTokenFromHeader token : ' + token);
    //console.log('extractTokenFromHeader type : '+type);
    return type === 'Refresh' ? token : undefined;
  }
}
/*
      sign(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): string;
      sign(payload: Buffer | object, options?: JwtSignOptions): string;
      signAsync(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string>;
      signAsync(payload: Buffer | object, options?: JwtSignOptions): Promise<string>;
      verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;
      verifyAsync<T extends object = any>(token: string, options?: JwtVerifyOptions): Promise<T>;
      decode<T = any>(token: string, options?: jwt.DecodeOptions): T;
  
  */
