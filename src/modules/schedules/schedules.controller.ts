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
  DefaultValuePipe,
  ParseIntPipe,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  PipeTransform,
  ArgumentMetadata,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response, NextFunction } from 'express';
import { Public } from '@src/modules/auth/auth.decorator';
var moment = require('moment');
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUserRequired,
  auth,
  AuthTokenRequired,
} from '@src/modules/auth/auth.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { UsersService } from '@src/modules/users/users.service';
// import * as cache from '@src/utils/cache/redis.cache';
import * as rediscluster from '@src/utils/cache/rediscluster.cache';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
//console.log('SECRET_KEY: '+process.env.SECRET_KEY)
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { AuthGuardUser } from '@src/modules/auth/auth.guarduser';
import { passwordtDto } from '@src/modules/users/dto/Resetpassword.dto';
import { fileDto } from '@src/modules/users/dto/file.dto';
import { FogotPassword } from '@src/modules/users/dto/forgeot-password.dto';
const { passwordStrength } = require('check-password-strength');
import { Pagination } from 'nestjs-typeorm-paginate';
import { SettingsService } from '@src/modules/settings/settings.service';
import { CreateSettingDto } from '@src/modules/settings/dto/create-setting.dto';
import { UpdateSettingDto } from '@src/modules/settings/dto/update-setting.dto';
import { SchedulesService } from '@src/modules/schedules/schedules.service';
import { CreateScheduleDto } from '@src/modules/schedules/dto/create-schedule.dto';
import { UpdateScheduleDto } from '@src/modules/schedules/dto/update-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

 @Get()
  async GetIndex(
      @Res() res: Response, 
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ) { 
      //var findAll:any = await this.schedulesService.findAll;
      res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: [],
            message: 'Get schedules Index.',
            message_th: 'Get schedules Index.',
          });
      return;
  }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }
 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
