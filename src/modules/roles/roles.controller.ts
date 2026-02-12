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
/******** entity *****************/
import { UsersService } from '@src/modules/users/users.service';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { RolesService } from '@src/modules/roles/roles.service';
import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';

@Controller('roles')
export class RolesController { 
  constructor(
    private readonly rolesService: RolesService,
    private usersService: UsersService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}


  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Role' })
  @Get()
  async index(
      @Res() res: Response,
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<Role> {
    var getlist:any= await this.rolesService.getlist();
    var result: any = {
          statuscode: 200,
          message: 'Role',
          payload: getlist, 
        };
      res.status(200).json(result);
      return;
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Role list' })
  @Get('list')
   async list(
      @Res() res: Response,
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<Role> {
    var getlist:any=  await this.rolesService.getlist();
    var result: any = {
          statuscode: 200,
          message: 'Role',
          payload: getlist, 
        };
      res.status(200).json(result);
      return;
  }

}
