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
} from '@nestjs/common';
import { Public } from '@src/modules/auth/auth.decorator';
import { Request, Response, NextFunction } from 'express';
/**********************/
var moment = require('moment');
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUserRequired,
  auth,
  AuthTokenRequired,
} from '@src/modules/auth/auth.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { Useraccessmenu } from '@src/modules/accessmenu/entities/useraccessmenu.entity';
import { UsersService } from '@src/modules/users/users.service';
import * as rediscluster from '@src/utils/cache/rediscluster.cache';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { AuthGuardUser } from '@src/modules/auth/auth.guarduser';
/*********service*************/
import { AccessmenuService } from '@src/modules/accessmenu/accessmenu.service';
/*********dto*************/
import { CreateAccessmenuDto } from '@src/modules/accessmenu/dto/create-accessmenu.dto';
import { UpdateAccessmenuDto } from '@src/modules/accessmenu/dto/update-accessmenu.dto';
/**********************/
@ApiTags('accessmenu')
@Controller('accessmenu')
export class AccessmenuController {
  constructor(
    private accessmenuService: AccessmenuService,
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Post Accessmenu' })
  @Post()
  async create(
    @Req() Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() createAccessmenuDto: CreateAccessmenuDto,
  ) {
    let payloads: any = await this.accessmenuService.create(
      createAccessmenuDto,
    );
    res.status(200).json({
      statusCode: 200,
      payload: payloads,
      message: 'Post.',
      message_th: 'Post.',
    });
    return;
  }

  @Public()
  @Get()
  async getHello(@Req() req) {
    var payload: any = await this.accessmenuService.getHello();
    var result: any = {
      statusCode: 200,
      code: 200,
      message: 'Index accessmenu',
      payload: payload,
    };
    return result;
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Get Accessmenu' })
  @Get('findall')
  async findAll(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<AccessMenu> {
    let admin_access_id: any = query.admin_access_id || '';
    let admin_type_id: any = query.admin_type_id || 1;
    let admin_menu_id: any = query.admin_menu_id || '';
    let InputData: any = {};
    InputData.admin_access_id = admin_access_id;
    InputData.admin_type_id = admin_type_id;
    InputData.admin_menu_id = admin_menu_id;
    // console.log(`findAll Input =>`); console.info(InputData);
    const Results: any = await this.accessmenuService.findAll(InputData);
    res.status(200).json({
      statusCode: 200,
      payload: Results,
      message: 'find accessss.',
      message_th: 'find accessss.',
    });
    return;
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @Get('/finduseraccessss')
  async finduseraccessss(
    @Req() Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Param() Param: string,
    @Query() query: any,
  ): Promise<Useraccessmenu> {
    let access_id: any = query.access_id || null;
    let type_id: any = query.type_id || 1;
    let menu_id: any = query.menu_id || 1;
    let parent_id: any = query.parent_id || null;
    let count: any = query.count || 0;
    let InputData_row: any = {};
    InputData_row.access_id = access_id;
    InputData_row.type_id = type_id;
    InputData_row.menu_id = menu_id;
    InputData_row.parent_id = parent_id;
    InputData_row.count = 1;
    const Results_row: any = await this.accessmenuService.findAllUserMunu(
      InputData_row,
    );
    let InputData: any = {};
    InputData.access_id = access_id;
    InputData.type_id = type_id;
    InputData.menu_id = menu_id;
    InputData.parent_id = parent_id;
    InputData.count = null;
    const Results: any = await this.accessmenuService.findAllUserMunu(
      InputData,
    );
    let payloads: any = {};
    payloads.row = Results_row;
    payloads.Results = Results;
    res.status(200).json({
      statusCode: 200,
      payload: payloads,
      message: 'find user accessss.',
      message_th: 'find user accessss.',
    });
    return;
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Get Accessmenu' })
  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return await this.accessmenuService.findOne(+id);
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Patch Accessmenu' })
  @Patch(':id')
  async update(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param('id') id: string,
    @Body() updateAccessmenuDto: UpdateAccessmenuDto,
  ) {
    return await this.accessmenuService.update(+id, updateAccessmenuDto);
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Delete Accessmenu' })
  @Delete(':id')
  async remove(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param('id') id: string,
  ) {
    return await this.accessmenuService.remove(+id);
  }
}
