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
import { Public } from '@src/modules/auth/auth.decorator';
import { AuthUserRequired } from '@src/modules/auth/auth.decorator';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import * as format from '@src/helpers/format.helper';
// We use VERSION_NEUTRAL, so we can return a response at "/"
//Service
import { RedisService } from '@src/modules/redis/redis.service';
@Public()
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}
  // Note: This endpoint is used for health checks at the URL "/".
  // If it doesn't return a 200, the container will fail to deploy.
  @HttpCode(200)
  @ApiOperation({
    summary:
      'This endpoint is used for health checks at the URL "/". If it doesn\'t return a 200, the container will fail to deploy.',
  })
  @Public()
  @Get()
  async getHello(@Req() req) {
    var payload: any = await this.appService.getHello();
    var result: any = {
      statuscode: 200,
      message: 'Index',
      payload: payload,
    };
    return result;
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @AuthUserRequired()
  @ApiOperation({
    summary: 'Retrieves the authorized user',
  })
  @Get('demo')
  async hi(): Promise<{ message: 'ok'; statuscode: 200 }> {
    await this.appService.getHi();
    return { message: 'ok', statuscode: 200 };
  }
}
