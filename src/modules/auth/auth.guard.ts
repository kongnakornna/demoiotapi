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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    console.log('🚀 ~ AuthGuard ~ jwtService:', jwtService);
    console.log('REDIS_HOSTT: ' + process.env.REDIS_HOST);
    console.log('REDIS_PORT: ' + process.env.REDIS_PORT);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    console.log('🚀 ~ AuthGuard ~ token --');
    console.info(token);
    if (!token || !token.startsWith('Bearer ')) {
        console.log('token -->');
        console.info(token);
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token.split(' ')[1]);
      request.user = decoded;
      console.log('request-');
      console.info(request);
      return true;
    } catch (error) {
        console.log('error -->');
        console.info(error);
      return false;
    }
  }
}

/*
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.replace('Bearer ', '');
    console.log(' AuthGuard ~ token --'+token); 
    let jsonString:any = this.jwtService.decode(token);
    console.log('jsonString-');
    console.info(jsonString);
    try {
      const decoded = this.jwtService.decode(token);
      request.user = decoded;
      console.log('decoded-');
      console.info(decoded);
      return true;
    } catch (error) {
          return false;
    }
*/
