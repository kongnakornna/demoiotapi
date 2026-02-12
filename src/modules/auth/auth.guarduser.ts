import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
require('dotenv').config();
import { UsersService } from '@src/modules/users/users.service';

@Injectable()
export class AuthGuardUser implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    // console.log('🚀 ~ AuthGuard ~ jwtService:', jwtService);
    // console.log('REDIS_HOSTT: '+process.env.REDIS_HOST)
    // console.log('REDIS_PORT: '+process.env.REDIS_PORT)
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Throw an exception or return false if the header is missing or malformed
      throw new UnauthorizedException('Authorization header is missing or invalid.');
    }
    const token = request.headers.authorization.replace('Bearer ', '').trim();
    const refreshToken = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();
    // console.log('🚀 ~ AuthGuard ~ token --');
    // console.info(token);
    if (!token) {
      // console.log('token-'+token);
      const decoded: any = this.jwtService.decode(token);
      request.user = decoded;
      // console.log('request-');
      // console.info(request);
      return false;
    }

    try {
      // const decoded1 = this.jwtService.verify(token.split(' ')[1]);
      const decoded: any = this.jwtService.decode(token);
      request.user = decoded;
      // console.log('request-');
      // console.info(request);
      return true;
    } catch (error) {
      return false;
    }
  }

  canActivateS(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization
      .replace('Bearer ', '')
      .replace('Bearer ', '');
    console.log(' AuthGuard ~ token --' + token);
    let jsonString: any = this.jwtService.decode(token);
    // console.log('jsonString-');
    // console.info(jsonString);
    const decoded = this.jwtService.decode(token);
    request.user = decoded;
    const idx: any = decoded.id;
    console.log('idx=>' + idx);

    try {
      if (idx) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
