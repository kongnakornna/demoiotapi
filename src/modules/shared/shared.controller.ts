import {
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
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
var moment = require('moment');
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApiOperation } from '@nestjs/swagger';
import { SharedService } from '@src/modules/shared/shared.service';
import { AuthUserRequired } from '@src/modules/auth/auth.decorator';
import 'dotenv/config';
require('dotenv').config();

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @AuthUserRequired()
  @Get()
  async index(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<{}> {
    let getIndex: any = await this.sharedService.getIndex();
    var result: any = {
      statuscode: 200,
      message: 'OK',
      data: getIndex,
    };
    res.status(200).json({ result });
    return;
  }
}
