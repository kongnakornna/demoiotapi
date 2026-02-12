import {
  applyDecorators,
  UseGuards,
  SetMetadata,
  Controller,
  Get,
  Request,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport/dist/auth.guard';
import 'dotenv/config';
require('dotenv').config();
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper';
/**
 * The default auth guard. Will validate the JWT token and load the relevant user from the database.
 * It should be used in the overwhelming majority of the cases.
 */
async function getData(data: any) {
  console.log('getData data=>');
  console.info(data);
  try {
    var response: any = await data; // ได้ข้อมูล จาก API
    console.log('getData response=>');
    console.info(response);
    return response;
  } catch (error) {
    console.error(error);
  }
} // let testDeta:any= await getData(response);  // <= Hoe to use

export function AuthUserRequired() {
  //console.log('REDIS_PORT: '+process.env.REDIS_PORT)
  // console.log('BaseAuthGuard jwt=>');console.info(BaseAuthGuard('jwt'));
  return applyDecorators(
    UseGuards(BaseAuthGuard('jwt')),
    ApiBearerAuth('default'),
  );
}

export function AuthUserRequired2() {
  //console.log('te_port: '+process.env.REDIS_PORT)
  return applyDecorators(
    UseGuards(BaseAuthGuard('jwt')),
    ApiBearerAuth('default'),
  );
}

/**
 * This will load the external user details from Auth0 and not our database.
 * This is useful when a local user might not have been created yet
 */
export function AuthTokenRequired() {
  return applyDecorators(
    UseGuards(BaseAuthGuard('jwt-external-user')),
    ApiBearerAuth('default'),
  );
}
export class auth {
  constructor(private readonly jwtService: JwtService) {}
  async GetrefreshToken(@Req() req) {
    console.log('REDIS_PORT: ' + process.env.REDIS_PORT);
    let jwt = req.headers.authorization.replace('Bearer ', '');
    //console.log("jwt=>"+jwt)
    let jsonString: any = this.jwtService.decode(jwt) as { id: string };
    //console.info("jsonString=>"+jsonString)
  }
}
export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
