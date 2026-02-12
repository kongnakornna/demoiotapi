import {
  VERSION_NEUTRAL,
  Controller,
  Res,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  Req,
  Injectable,
  Headers,
  Header,
  Request,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import { RedisService } from '@src/modules/redis/redis.service';
import { Public } from '@src/modules/auth/auth.decorator';
import { AuthUserRequired } from '@src/modules/auth/auth.decorator';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
import { redisDto } from '@src/modules/redis/dto/redis.dto';
var Cache = new CacheDataOne();
import * as format from '@src/helpers/format.helper';
@Controller('redis')
export class RedisController {
  constructor(private readonly RedisService: RedisService) {}

  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Get('/')
  async otpIndex(@Req() Request): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: any = Request.headers.time || 60;
    console.log('Request_headers_secretkey=>' + secretkey);
    console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
    console.log('Request_headers_time=>' + time);
    if (secretkey != process.env.SECRET_KEY) {
      var result: any = {
        statuscode: 200,
        message: 'Forbidden! SKEY is not valid . ',
      };
      return result;
    }
    const Randomint: any = format.getRandomint(6);
    const otpot: any = await Cache.OTPTIME(Randomint, time);
    console.info('otpot', otpot);
    var result: any = {
      statuscode: 200,
      message: 'OTP',
      payload: otpot,
    };
    return result;
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Get('/otp')
  async otp(@Req() Request): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: Number = Number(Request.headers.time) || 60;
    console.log('Request_headers_secretkey=>' + secretkey);
    console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
    console.log('Request_headers_time=>' + time);
    if (secretkey != process.env.SECRET_KEY) {
      var result: any = {
        statuscode: 200,
        message: 'Forbidden! SKEY is not valid . ',
      };
      return result;
    }
    const Randomint: any = format.getRandomint(6);
    const otpot: any = await Cache.OTPTIME(Randomint, time);
    const keycache: any = otpot.key;
    const otpvalidate: number = otpot.otp;
    console.info('otpot', otpot);
    var input: any = {
      keycache: keycache,
      otpvalidate: otpvalidate,
    };
    var result: any = {
      statuscode: 200,
      message: 'OTP',
      payload: otpot,
      validateOTP: Cache.validateGet(input),
    };
    return result;
  }

  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Post('/validateotp')
  async validateOTP(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) caseModel: redisDto,
  ): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: any = Request.headers.time || 60;
    console.log('Request_headers_secretkey=>' + secretkey);
    console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
    console.log('Request_headers_time=>' + time);
    const keycache: any = caseModel.keycache;
    const otpvalidate: any = caseModel.otpvalidate;
    console.log('keycache=>' + keycache);
    console.log('otpvalidate=>' + otpvalidate);
    if (secretkey != process.env.SECRET_KEY) {
      var result: any = {
        statuscode: 200,
        message: 'Forbidden! SKEY is not valid . ',
      };
      return result;
    }
    console.info('keycache', keycache);
    console.info('otpvalidate', otpvalidate);
    var input: any = {
      keycache: keycache,
      otpvalidate: otpvalidate,
    };
    var result: any = {
      statuscode: 200,
      message: 'OTP',
      payload: Cache.validateOTP(input),
    };
    console.info('otp result', result);
    return result;
  }
}
