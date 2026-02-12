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
 import { UserLog } from '@src/modules/syslog/entities/userlog.entity';
 import { UserLogtype } from '@src/modules/syslog/entities/userlogtype.entity';    

import { SyslogService } from '@src/modules/syslog/syslog.service';
import { CreateSyslogDto } from '@src/modules/syslog/dto/create-syslog.dto';
import { UpdateSyslogDto } from '@src/modules/syslog/dto/update-syslog.dto';
import { CreateSyslogTypeDto } from '@src/modules/syslog/dto/create-syslog-type.dto';
 
 

@Controller('syslog')
export class SyslogController { 
  constructor(
    private readonly syslogService: SyslogService,
    private readonly rolesService: RolesService,
    private usersService: UsersService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
   
  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list syslog' })
  @Get()
  async listuserlog(
      @Res() res: Response,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<any> {
      const page: number = Number(query.page) || 1;
      const pageSize: number = Number(query.pageSize) || 20;
      var status: any = query.status || '';
      let select_status: any = query.select_status || '';
      var sort: any = query.sort || 'create-DESC';
      let keyword: any = query.keyword || '';
      let filter: any = {};
      filter.sort = sort;
      filter.keyword = keyword;
      filter.status = status;
      filter.log_type_id = query.log_type_id;
      filter.select_status = query.select_status;
      filter.insert_status = query.insert_status;
      filter.update_status = query.update_status;
      filter.delete_status = query.delete_status;
      filter.isCount = 1;
      let rowResultData: any = await this.syslogService.loglistpaginate(filter);
      const rowData: any = Number(rowResultData);
      const totalPages: number = Math.round(rowData / pageSize) || 1;
      let filter2: any = {};
      filter.sort = sort;
      filter2.keyword = keyword;
      filter2.status = status;
      filter2.log_type_id = query.log_type_id;
      filter2.select_status = query.select_status;
      filter2.insert_status = query.insert_status;
      filter2.update_status = query.update_status;
      filter2.delete_status = query.delete_status;
      filter2.select_status = select_status;
      filter2.page = page;
      filter2.pageSize = pageSize;
      filter2.isCount = 0;
      console.log(`filter2=`);
      console.info(filter2);
      let ResultData: any = await this.syslogService.loglistpaginate(filter2);
      let tempData = [];
      let tempDataoid = [];
      let tempData2 = [];
      for (const [key, va] of Object.entries(ResultData)) {
        // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
        const id: number = ResultData[key].id || null;
        const DataRs: any = {
          id: ResultData[key].id,
          log_type_id: ResultData[key].log_type_id,
          uid: ResultData[key].uid,
          log_name: ResultData[key].log_name,
          type_name: ResultData[key].type_name,
          detail: ResultData[key].detail,
          select_status: ResultData[key].select_status,
          insert_status: ResultData[key].insert_status,
          update_status: ResultData[key].update_status,
          delete_status: ResultData[key].delete_status,
          status: ResultData[key].status,  
          sername: ResultData[key].sername,
          firstname: ResultData[key].firstname, 
          createddate: format.timeConvertermas(
            format.convertTZ(ResultData[key].create, process.env.tzString),
          ),
          updateddate: format.timeConvertermas(
            format.convertTZ(ResultData[key].update, process.env.tzString),
          ), 
        };
        tempDataoid.push(id);
        tempData.push(va);
        tempData2.push(DataRs);
      }
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: {
          page: page,
          currentPage: page,
          pageSize: pageSize,
          totalPages: totalPages,
          total: rowData,
          filter: filter2,
          data: tempData2,
        },
        message: 'success.',
        message_th: 'success.',
      });
  }
  

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device data redis' })
  @Get('getdevice')
  async getdevice(
      @Res() res: Response,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<any> {
      
    let device: any = query.device; 
      if (device === null || device === '') {
        var result: any = {
          statuscode: 200,
          code: 400,
          message: 'device is null',
          message_th: 'device is null',
          payload: null,
        };
        console.info('device data result', result);
        res.status(200).json(result);
        return;
      }
      const rss: any = await Cache.GetCacheData(device); 
        var result: any = {
          statuscode: 200,
          code: 200,
          message: 'device data',
          message_th: 'device data',
          payload: rss,
        };
        console.info('device data result', result);
        res.status(200).json(result);
        return;
       
  }
  
  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list syslog' })
  @Get('listuserlog')
  async listuserlogs(
      @Res() res: Response,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<any> {
      const idx: any = query.id || '';
      const page: number = Number(query.page) || 1;
      const pageSize: number = Number(query.pageSize) || 20;
      var status: any = query.status || '';
      let select_status: any = query.select_status || '';
      var sort: any = query.sort || 'create-DESC';
      let keyword: any = query.keyword || '';
      let filter: any = {};
      filter.sort = sort;
      filter.keyword = keyword || '';
      filter.idx = idx || '';
      filter.status = status || '';
      filter.log_type_id = query.log_type_id;
      filter.select_status = query.select_status || '';
      filter.insert_status = query.insert_status || '';
      filter.update_status = query.update_status || '';
      filter.delete_status = query.delete_status || '';
      filter.isCount = 1;
      console.log(`filter =>` + filter); console.info(filter);
      let rowResultData: any = await this.syslogService.loglistpaginate(filter);
      if (!rowResultData || rowResultData.status=='422') {
          res.status(200).json({
            statuscode: 200,
            code: 400,
            payload: null, 
            message: 'Data is null.',
            message_th: 'ไม่พบข้อมูล', 
          });
        return;
      } 
      const rowData: any = Number(rowResultData);
      const totalPages: number = Math.round(rowData / pageSize) || 1;
      let filter2: any = {};
      filter2.sort = sort;
      filter2.idx = idx || '';
      filter2.keyword = keyword || '';
      filter2.status = status || '';
      filter2.log_type_id = query.log_type_id || '';
      filter2.select_status = query.select_status || '';
      filter2.insert_status = query.insert_status || '';
      filter2.update_status = query.update_status || '';
      filter2.delete_status = query.delete_status || '';
      filter2.select_status = select_status || '';
      filter2.page = page;
      filter2.pageSize = pageSize;
      filter2.isCount = 0;
      console.log(`filter2=`);
      console.info(filter2);
      let ResultData: any = await this.syslogService.loglistpaginate(filter2);
      let tempData = [];
      let tempDataoid = [];
      let tempData2 = [];
      for (const [key, va] of Object.entries(ResultData)) {
        // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
        const id: number = ResultData[key].id || null;
        const ProfileRs: any = {
          id: ResultData[key].id,
          log_type_id: ResultData[key].log_type_id,
          uid: ResultData[key].uid,
          log_name: ResultData[key].log_name,
          type_name: ResultData[key].type_name,
          detail: ResultData[key].detail,
          select_status: ResultData[key].select_status,
          insert_status: ResultData[key].insert_status,
          update_status: ResultData[key].update_status,
          delete_status: ResultData[key].delete_status,
          status: ResultData[key].status,  
          username: ResultData[key].username,
          sername: ResultData[key].sername,
          firstname: ResultData[key].firstname, 
          lang: ResultData[key].lang, 
          createddate: format.timeConvertermas(
            format.convertTZ(ResultData[key].create, process.env.tzString),
          ),
          updateddate: format.timeConvertermas(
            format.convertTZ(ResultData[key].update, process.env.tzString),
          ), 
        };
        tempDataoid.push(id);
        tempData.push(va);
        tempData2.push(ProfileRs);
      }
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: {
          page: page,
          currentPage: page,
          pageSize: pageSize,
          totalPages: totalPages,
          total: rowData,
          filter: filter2,
          data: tempData2,
        },
        message: 'success.',
        message_th: 'success.',
      });
  }
  
  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'listtype' })
  @Get('listtype')
  async getlisttypelog(
      @Res() res: Response,
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ): Promise<UserLog> {
    var getlist:any= await this.syslogService.getlisttype();
    let ResultData2 = []; 
    for (const [key, va] of Object.entries(getlist)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const log_type_id: string = getlist[key].log_type_id || null; 
      const RS: any = { 
        log_type_id: getlist[key].log_type_id,
        type_name: getlist[key].type_name,
        type_detail: getlist[key].type_detail,
        status: getlist[key].status, 
       createDate: format.timeConvertermas(
          format.convertTZ(getlist[key].create, process.env.tzString),
        ),
        updateDate: format.timeConvertermas(
          format.convertTZ(getlist[key].update, process.env.tzString),
        ),
      }; 
      ResultData2.push(RS);
    } 
    var result: any = {
          statuscode: 200,
          message: 'list type',
          payload: ResultData2, 
        };
      res.status(200).json(result);
      return;
  }

  @HttpCode(201)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @Post('/createtypelog')
  async createtypelog(
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
      @Res() res: Response,
      @Body(new ValidationPipe()) TypeDto: CreateSyslogTypeDto,
    ): Promise<string> { 
      const rs: any = await this.syslogService.getlogtype(TypeDto.type_name);
      if (rs) {
        res.status(200).json({
          statuscode: 200,
          code: 400,
          payload: rs, 
          message: 'This type name have data already.',
          message_th: 'ชื่อ นี้มีข้อมูลแล้ว',
          error: 'Error his type name have data already.',
        });
        return;
      } 
      const data: any = await this.syslogService.createlogtype(TypeDto);
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: data,
        message: 'create type log successfully..',
        message_th: 'สร้างประเภทข้อมูลสำเร็จ..',
      });
      return;
  }

  @HttpCode(201) 
  @Post('/createlog')
  async createlog(
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
      @Res() res: Response,
      // @Body(new ValidationPipe()) TypeDto: CreateSyslogDto,
      @Body() dto: any,
    ): Promise<string> { 
      console.log('dto=>');console.info(dto);   
      let datainput: any = {};
      if (dto.log_type_id) {
        datainput.log_type_id = dto.log_type_id;
      }if (dto.uid) {
        datainput.uid = dto.uid;
      }if (dto.name) {
        datainput.name = dto.name;
      }if (dto.detail) {
        datainput.detail = dto.detail;
      }if (dto.select_status) {
        datainput.select_status = dto.select_status || 0;
      }if (dto.insert_status) {
        datainput.insert_status = dto.insert_status || 0;
      }if (dto.update_status) {
        datainput.update_status = dto.update_status || 0;
      }if (dto.delete_status) {
        datainput.delete_status = dto.delete_status || 0;
      }if (dto.status) {
        datainput.status = dto.status || 1;
      }if (dto.lang) {
        datainput.lang = dto.lang || "en";
      }
      // console.log('datainput=>');console.info(datainput);   
      const data: any = await this.syslogService.createlog(datainput);
      // console.log('data=>');console.info(data);   
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: data,
        message: 'create log successfully..',
        message_th: 'สร้าง log สำเร็จ..',
      });
      return;
  }
}
