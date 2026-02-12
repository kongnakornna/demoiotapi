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
  Header,
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
import { CreateLocationDto } from '@src/modules/settings/dto/create-location.dto';
import { CreateTypeDto } from '@src/modules/settings/dto/create_type.dto';
import { CreateSensorDto } from '@src/modules/settings/dto/create_sensor.dto';
import { CreateGroupDto } from '@src/modules/settings/dto/create_group.dto';
import { CreateMqttDto } from '@src/modules/settings/dto/create_mqtt.dto';
import { ApiDto } from '@src/modules/settings/dto/create_api.dto';
import { DeviceDto } from '@src/modules/settings/dto/create_device.dto';
import { EmailDto } from '@src/modules/settings/dto/create_email.dto';
import { HostDto } from '@src/modules/settings/dto/create_host.dto';
import { InfluxdbDto } from '@src/modules/settings/dto/create_influxdb.dto';
import { LineDto } from '@src/modules/settings/dto/create_line.dto';
import { NoderedDto } from '@src/modules/settings/dto/create_nodered.dto';
import { SchedulDto } from '@src/modules/settings/dto/create_schedule.dto';
import { SmsDto } from '@src/modules/settings/dto/create_sms.dto';
import { TokenDto } from '@src/modules/settings/dto/create_token.dto';
import { scheduleDevice } from '@src/modules/settings/dto/create_scheduledevice.dto';
/******************/
import { DeviceActionuserDto } from '@src/modules/settings/dto/create_device_action_user.dto';
import { DeviceActionDto } from '@src/modules/settings/dto/create_device_action.dto';
import { DevicealarmactionDto } from '@src/modules/settings/dto/create_device_alarmaction.dto';
import { alarmactionDto } from '@src/modules/settings/dto/alarmaction.dto';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { CreateUserDemoDto } from '@src/modules/users/dto/create-demo-user.dto';
import { TelegramDto } from '@src/modules/settings/dto/create-telegram.dto';
import { updatemqttstatusDto } from '@src/modules/settings/dto/updatemqttstatus.dto';
import { alarmDevice } from '@src/modules/settings/dto/create_alarmdevice.dto';
/******** entity *****************/
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';  // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';

import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity';
import { CreateDashboardConfigDto, UpdateDashboardConfigDto } from '@src/modules/settings/dto/dashboardConfig.dto';
/******** entity ****************/
//Dto
import { CreateDeviceDto } from '@src/modules/settings/dto/create-device.dto';
// import * as cache from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
var md5 = require('md5');
import 'dotenv/config';
var tzString = process.env.tzString;
var SEND_EMAIL = process.env.SEND_EMAIL;
// formatInTimeZone(date, tzString, 'yyyy-MM-dd HH:mm:ssXXX') 
var connectUrl_mqtt: any =
  process.env.MQTT_HOST || 'mqtt://127.0.0.1:1883';
if (!connectUrl_mqtt) {
  var connectUrl_mqtt: any = process.env.MQTT_HOST || 'mqtt://localhost:1883';
}
require('dotenv').config();
import { IotService } from '@src/modules/iot/iot.service';
import { MqttService } from '@src/modules/mqtt/mqtt.service';
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly mqttService: MqttService,
    private settingsService: SettingsService,
    private UsersService: UsersService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list scheduledevice' })
  @Get('listscheduledevice')
  async findscheduledevice(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || 1;
    let schedule_id: any = query.schedule_id || '';
    let device_id: any = query.device_id || '';
    if (!schedule_id || !device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data schedule_id or device_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id หรือ device_id ',
      });
      return;
    }
    var sort: any = query.sort;
    let filter: any = {};
    filter.sort = sort || 'device_id-ASC';
    filter.schedule_id = schedule_id;
    filter.device_id = device_id;
    filter.monday = query.monday;
    filter.tuesday = query.tuesday;
    filter.wednesday = query.wednesday;
    filter.thursday = query.thursday;
    filter.friday = query.friday;
    filter.saturday = query.saturday;
    filter.sunday = query.sunday;
    filter.start = query.start;
    filter.event = query.event;
    filter.status = status || '';
    filter.sort = sort || '';
    let rowResultData: any = await this.settingsService.findscheduledevice(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    let ResultData: any = rowResultData;
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const id: number = ResultData[key].id || null;
      const ProfileRs: any = {
        device_id: ResultData[key].device_id,
        schedule_id: ResultData[key].schedule_id,
        schedule_name: ResultData[key].schedule_name,
        start: ResultData[key].schedule_start,
        event: ResultData[key].schedule_event,
        sunday: ResultData[key].sunday,
        monday: ResultData[key].monday,
        tuesday: ResultData[key].tuesday,
        wednesday: ResultData[key].wednesday,
        thursday: ResultData[key].thursday,
        friday: ResultData[key].friday,
        saturday: ResultData[key].saturday,
        device_name: ResultData[key].device_name,
        mqtt_data_value: ResultData[key].mqtt_data_value,
        mqtt_data_control: ResultData[key].mqtt_data_control,
        oid: ResultData[key].device_oid,
        sn: ResultData[key].device_sn,
      };
      tempDataoid.push(id);
      tempData.push(va);
      tempData2.push(ProfileRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        filter: filter,
        data: tempData2,
      },
      message: 'list setting success.',
      message_th: 'lists etting success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  @ApiOperation({ summary: 'list scheduledevice' })
  @Get('testgemail')
  async testgemail(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    let ResultData: any = await this.settingsService.testGmailConnection();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'testgemail .',
      message_th: 'testgemail.',
    });
  }
  /*********************************/
  @HttpCode(200)
  @ApiOperation({ summary: 'list scheduledevice' })
  @Get('sendemail')
  async sendemail(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var to: any = query.to;
    if (to == '' || to == 'undefined') {
      var to: any = 'icmon0955@gmail.com';
    }
    var subject: any = query.subject;
    if (subject == '' || subject == 'undefined') {
      var subject: any = 'Alarm Test';
    }
    var content: any = query.content;
    if (content == '' || content == 'undefined') {
      var content: any = 'Alarm Test';
    }
    // var to:any='icmon0955@gmail.com';
    // var subject:any='Alarm Test';
    // var content:any='Alarm Test';
    console.log(`---sendemail--`);
    console.log(`to--` + to);
    console.log(`subject--` + subject);
    console.log(`content--` + content);
    let ResultData: any = await this.settingsService.sendEmail(
      to,
      subject,
      content,
    );
    let payloadData: any = {
      ResultData: ResultData,
      to: to,
      subject: subject,
      content: content,
    };
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: payloadData,
      message: 'sendEmail success.',
      message_th: 'sendEmail success.',
    });
  }
  /***********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list scheduledevice' })
  @Get('findscheduledevicechk')
  async findscheduledevicechk(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || 1;
    let schedule_id: any = query.schedule_id || '';
    let device_id: any = query.device_id || '';
    if (!schedule_id || !device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data schedule_id or device_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id หรือ device_id ',
      });
      return;
    }
    var sort: any = query.sort;
    let filter: any = {};
    filter.schedule_id = schedule_id;
    filter.device_id = device_id;
    let rowResultData: any = await this.settingsService.findscheduledevicechk(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        filter: filter,
        data: rowResultData,
      },
      message: 'list setting success.',
      message_th: 'lists etting success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list setting' })
  @Get('listsetting')
  async list_user_logs(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort || 'createddate-ASC';
    filter.keyword = keyword || ''; // setting_name
    filter.status = status || '';
    filter.setting_id = query.setting_id;
    filter.location_id = query.location_id || '';
    filter.setting_type_id = query.setting_type_id || '';
    filter.sn = query.sn || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    let rowResultData: any = await this.settingsService.setting_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.sort = sort || 'createddate-ASC';
    filter2.keyword = keyword || ''; // setting_name
    filter2.status = status || '';
    filter2.setting_id = query.setting_id;
    filter2.location_id = query.location_id || '';
    filter2.setting_type_id = query.setting_type_id || '';
    filter2.sn = query.sn || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 1;
    filter2.page = page;
    filter2.pageSize = pageSize;
    filter2.isCount = 0;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.setting_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const id: number = ResultData[key].id || null;
      const ProfileRs: any = {
        setting_id: ResultData[key].setting_id,
        location_id: ResultData[key].location_id,
        setting_type_id: ResultData[key].setting_type_id,
        setting_name: ResultData[key].setting_name,
        sn: ResultData[key].sn,
        type_name: ResultData[key].type_name,
        location_name: ResultData[key].location_name,
        ipaddress: ResultData[key].ipaddress,
        location_detail: ResultData[key].location_detail,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
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
      message: 'list setting success.',
      message_th: 'lists etting success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  @ApiOperation({ summary: 'list setting' })
  @Get('settingall')
  async setting_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.setting_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'list setting success.',
      message_th: 'lists etting success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list location' })
  @Get('listlocation')
  async list_location(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || ''; // setting_name
    filter.status = status || '';
    filter.location_id = query.location_id || '';
    filter.ipaddress = query.ipaddress || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.location_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || ''; // setting_name
    filter2.idx = idx || '';
    filter2.status = status || '';
    filter2.setting_id = query.setting_id;
    filter2.location_id = query.location_id || '';
    filter2.ipaddress = query.ipaddress || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.location_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ProfileRs: any = {
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        configdata: ResultData[key].configdata,
        ipaddress: ResultData[key].ipaddress,
        location_detail: ResultData[key].location_detail,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list location success.',
      message_th: 'lists location success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@AuthUserRequired()
  @ApiOperation({ summary: 'location_all' })
  @Get('locationall')
  async location_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.location_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list type' })
  @Get('listtype')
  async list_type(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.type_id = query.type_id || '';
    filter.group_id = query.group_id || '';
    filter.ipaddress = query.ipaddress || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.type_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.idx = idx || '';
    filter2.status = status || '';
    filter2.type_id = query.type_id;
    filter2.group_id = query.group_id || '';
    filter2.ipaddress = query.ipaddress || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.type_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ProfileRs: any = {
        type_id: ResultData[key].type_id,
        group_id: ResultData[key].group_id,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list location success.',
      message_th: 'lists location success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'typeall' })
  @Get('typeall')
  async list_type_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.type_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'typeall' })
  @Get('devicetypeall')
  async list_device_type_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.devicetype_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'typeall' })
  @Get('devicetypeallcontrol')
  async devicetypeallcontrol(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.devicetype_all_oi();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list device type' })
  @Get('listdevicetype')
  async listdevicetype(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.type_id = query.type_id || '';
    filter.group_id = query.group_id || '';
    filter.ipaddress = query.ipaddress || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any =
      await this.settingsService.devicetype_list_paginate(filter);
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.idx = idx || '';
    filter2.status = status || '';
    filter2.type_id = query.type_id;
    filter2.ipaddress = query.ipaddress || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.devicetype_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ProfileRs: any = {
        type_id: ResultData[key].type_id,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list location success.',
      message_th: 'lists location success.',
    });
  }
  /***************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'typeall' })
  @Get('devicetypeall')
  async list_devicetype_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.devicetype_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list sensor' })
  @Get('listsensor')
  async list_sensor(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.sn = query.sn;
    filter.max = query.max;
    filter.min = query.min;
    filter.hardware_id = query.hardware_id;
    filter.status_high = query.status_high;
    filter.status_warning = query.status_warning;
    filter.status_alert = query.status_alert;
    filter.model = query.model;
    filter.vendor = query.vendor;
    filter.comparevalue = query.comparevalue;
    filter.mqtt_id = query.mqtt_id;
    filter.oid = query.oid;
    filter.action_id = query.action_id;
    filter.mqtt_data_value = query.mqtt_data_value;
    filter.mqtt_data_control = query.mqtt_data_control;
    filter.type_id = query.type_id || '';
    filter.group_id = query.group_id || '';
    filter.ipaddress = query.ipaddress || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.sensor_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.status = status || '';
    filter2.sn = query.sn;
    filter2.max = query.max;
    filter2.min = query.min;
    filter2.hardware_id = query.hardware_id;
    filter2.status_high = query.status_high;
    filter2.status_warning = query.status_warning;
    filter2.status_alert = query.status_alert;
    filter2.model = query.model;
    filter2.vendor = query.vendor;
    filter2.comparevalue = query.comparevalue;
    filter2.mqtt_id = query.mqtt_id;
    filter2.oid = query.oid;
    filter2.action_id = query.action_id;
    filter2.mqtt_data_value = query.mqtt_data_value;
    filter2.mqtt_data_control = query.mqtt_data_control;
    filter2.type_id = query.type_id;
    filter2.group_id = query.group_id || '';
    filter2.ipaddress = query.ipaddress || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.location_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ArrayRs: any = {
        sensor_id: ResultData[key].sensor_id,
        setting_id: ResultData[key].setting_id,
        setting_type_id: ResultData[key].setting_type_id,
        sensor_name: ResultData[key].sensor_name,
        sn: ResultData[key].sn,
        max: ResultData[key].max,
        min: ResultData[key].min,
        hardware_id: ResultData[key].hardware_id,
        status_high: ResultData[key].status_high,
        status_warning: ResultData[key].status_warning,
        status_alert: ResultData[key].status_alert,
        model: ResultData[key].model,
        vendor: ResultData[key].vendor,
        comparevalue: ResultData[key].comparevalue,
        status: ResultData[key].status,
        unit: ResultData[key].unit,
        mqtt_id: ResultData[key].mqtt_id,
        oid: ResultData[key].oid,
        action_id: ResultData[key].action_id,
        status_alert_id: ResultData[key].status_alert_id,
        mqtt_data_value: ResultData[key].mqtt_data_value,
        mqtt_data_control: ResultData[key].mqtt_data_control,
        type_name: ResultData[key].type_name,
        setting_name: ResultData[key].setting_name,
        location_name: ResultData[key].location_name,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
      tempData2.push(ArrayRs);
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
      message: 'list location success.',
      message_th: 'lists location success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'sensor all' })
  @Get('sensorall')
  async list_sensor_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.sensor_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('createscheduledevice')
  async create_schedule_device(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const schedule_id: number = Number(query.schedule_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`schedule_id =>` + schedule_id);
    console.info(schedule_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!schedule_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is schedule_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      schedule_id: schedule_id,
      device_id: device_id,
    };
    await this.settingsService.createscheduledevice(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Scheduled created successfully.',
      message_th: 'สร้าง Scheduled สำเร็จ.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('deletescheduledevice')
  async delete_schedule_devices(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const schedule_id: number = Number(query.schedule_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`schedule_id =>` + schedule_id);
    console.info(schedule_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!schedule_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is schedule_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      schedule_id: schedule_id,
      device_id: device_id,
    };
    await this.settingsService.delete_schedule_device(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Scheduled delete successfully.',
      message_th: 'ลบ Scheduled สำเร็จแล้ว.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('lisgroup')
  async list_group(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.group_id = query.group_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.group_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.status = status || '';
    filter2.group_id = query.group_id || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.group_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ProfileRs: any = {
        /******************/
        group_id: ResultData[key].group_id,
        group_name: ResultData[key].group_name,
        /******************/
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list group success.',
      message_th: 'lists group success.',
    });
  }
  /******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'lisgroup' })
  @Get('lisgroupall')
  async list_group_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.group_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'group_all success.',
      message_th: 'group_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('listgrouppage')
  async list_group_page(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const idx: any = query.id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.group_id = query.group_id || '';
    filter.ipaddress = query.ipaddress || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.group_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.status = status || '';
    filter2.group_id = query.group_id;
    filter2.ipaddress = query.ipaddress || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.group_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const ProfileRs: any = {
        group_id: ResultData[key].group_id,
        group_name: ResultData[key].group_name,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list group success.',
      message_th: 'lists group success.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list mqtt' })
  @Get('lismqtt')
  async list_mqtt(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    var select_status: any = query.select_status || '';
    var sort: any = query.sort || 'mqtt_id-ASC';
    var keyword: any = query.keyword || '';
    var mqtt_type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.idhost = query.idhost || '';
    filter.secret = query.secret || '';
    filter.status = status || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.mqtt_type_id = mqtt_type_id;
    filter.location_id = location_id;
    filter.hardware_id = query.hardware_id || '';
    filter.expire_in = query.expire_in || '';
    filter.token_value = query.token_value || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.envavorment = query.envavorment || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.mqtt_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.idhost = query.idhost || '';
    filter2.status = status || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2;
    filter2.mqtt_type_id = mqtt_type_id;
    filter2.location_id = location_id;
    filter2.hardware_id = query.hardware_id || '';
    filter2.secret = query.secret || '';
    filter2.expire_in = query.expire_in || '';
    filter2.token_value = query.token_value || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.envavorment = query.envavorment || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.mqtt_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var bucket: any = ResultData[key].bucket;
      let filter2: any = {};
      filter2.bucket = bucket;
      let device: any = await this.settingsService.device_lists_id(filter2);
      let device_count: any = device.length;
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      var date: any = ResultData[key].updateddate;
      if (date) {
        var date: any = format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        );
      }
      const RSdata: any = {
        mqtt_id: ResultData[key].mqtt_id,
        idhost: ResultData[key].idhost,
        host_name: ResultData[key].host_name,
        sort: ResultData[key].sort,
        mqtt_type_id: ResultData[key].mqtt_type_id,
        mqtt_name: ResultData[key].mqtt_name,
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        location_detail: ResultData[key].location_detail,
        host: ResultData[key].host,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        secret: ResultData[key].secret,
        expire_in: ResultData[key].expire_in,
        token_value: ResultData[key].token_value,
        org: ResultData[key].org,
        bucket: ResultData[key].bucket,
        envavorment: ResultData[key].envavorment,
        updateddate: date,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        latitude: ResultData[key].latitude,
        longitude: ResultData[key].longitude,
        mqtt_main_id: ResultData[key].mqtt_main_id,
        configuration: ResultData[key].configuration,
        filter2,
        device_count: device_count,
        device: device,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list mqtt success..',
      message_th: 'lists mqtt success..',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@AuthUserRequired()
  @ApiOperation({ summary: 'lismqtt all' })
  @Get('lismqttall')
  async list_mqtt_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.mqtt_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'mqtt_all success.',
      message_th: 'mqtt_all  success.',
    });
  }
  /************ */
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device all' })
  @Get('mqttdelete')
  async mqttdelete(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`query=`);
    console.info(query);
    if (!query.mqtt_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data device_id is null.',
        message_th: 'ไม่พบข้อมูล device_id',
      });
      return;
    }
    let ResultData: any = await this.settingsService.delete_mqtt(query.mqtt_id);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'delete mqtt success.',
      message_th: 'delete mqtt  success.',
    });
  }
  /********Api**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'api all' })
  @Get('apiall')
  async list_api_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.api_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'api_all success.',
      message_th: 'api_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'api list group' })
  @Get('listapipage')
  async api_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const api_id: any = query.api_id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.api_id = query.api_id || '';
    filter.keyword = keyword || '';
    filter.type_name = query.type_name || '';
    filter.status = status || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.api_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.type_name = query.type_name || '';
    filter2.api_id = query.api_id || '';
    filter2.status = status || '';
    filter2.host = query.host;
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.api_list_paginate(filter2);
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const ProfileRs: any = {
        api_id: ResultData[key].api_id,
        api_name: ResultData[key].api_name,
        host: ResultData[key].host,
        port: ResultData[key].port,
        token_value: ResultData[key].token_value,
        password: ResultData[key].password,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list group success.',
      message_th: 'lists group success.',
    });
  }
  /********Device**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device all' })
  @Get('deviceall')
  async list_device_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.device_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'device_all success.',
      message_th: 'device_all  success.',
    });
  }
  /********Device**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device all' })
  @Get('deviceeditget')
  async deviceeditget(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`query=`);
    console.info(query);
    if (!query.device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data device_id is null.',
        message_th: 'ไม่พบข้อมูล device_id',
      });
      return;
    }
    let ResultData: any = await this.settingsService.deviceeditget(
      query.device_id,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'deviceeditget success.',
      message_th: 'deviceeditget  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device all' })
  @Get('devicedetail')
  async devicedetail(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`query=`);
    console.info(query);
    if (!query.device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data device_id is null.',
        message_th: 'ไม่พบข้อมูล device_id',
      });
      return;
    }
    let filter: any = {};
    filter.device_id = query.device_id || '';
    filter.status = query.status || '';
    let ResultData: any = await this.settingsService.devicedetail(filter);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData['0'],
      message: 'deviceeditget success.',
      message_th: 'deviceeditget  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device all' })
  @Get('devicedelete')
  async deviceedelete(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`query=`);
    console.info(query);
    if (!query.device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data device_id is null.',
        message_th: 'ไม่พบข้อมูล device_id',
      });
      return;
    }
    let ResultData: any = await this.settingsService.delete_device(
      query.device_id,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'delete success.',
      message_th: 'delete  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicepagess')
  async device_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.keyword = keyword || '';
    filter.type_name = query.type_name || '';
    filter.status = status || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.device_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = status || '';
    filter2.host = query.host;
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.device_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var mqtt_data_value: any = ResultData[key].mqtt_data_value;
      var mqtt_data_control: any = ResultData[key].mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
      const DataRs: any = {
        device_id: ResultData[key].device_id,
        setting_id: ResultData[key].setting_id,
        mqtt_id: ResultData[key].mqtt_id,
        type_id: ResultData[key].type_id,
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        device_name: ResultData[key].device_name,
        mqtt_name: ResultData[key].mqtt_name,
        type_name: ResultData[key].type_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_envavorment: ResultData[key].mqtt_envavorment,
        mqtt_host: ResultData[key].mqtt_host,
        mqtt_port: ResultData[key].mqtt_port,
        measurement: ResultData[key].measurement,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        oid: ResultData[key].oid,
        sn: ResultData[key].sn,
        max: ResultData[key].max,
        min: ResultData[key].min,
        hardware_id: ResultData[key].hardware_id,
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        work_status: ResultData[key].work_status,
        unit: ResultData[key].unit,
        model: ResultData[key].model,
        vendor: ResultData[key].vendor,
        comparevalue: ResultData[key].comparevalue,
        action_id: ResultData[key].action_id,
        status_alert_id: ResultData[key].status_alert_id,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        timestamp: mqttdata['payload']['timestamp'],
        temperature_value: mqttdata['payload']['temperature'],
        mqtt_dada: mqttdata['payload']['mqtt_dada'],
        contRelay1: mqttdata['payload']['contRelay1'],
        actRelay1: mqttdata['payload']['actRelay1'],
        contRelay2: mqttdata['payload']['contRelay2'],
        actRelay2: mqttdata['payload']['actRelay2'],
        fan1: mqttdata['payload']['fan1'],
        overFan1: mqttdata['payload']['overFan1'],
        fan2: mqttdata['payload']['fan2'],
        overFan2: mqttdata['payload']['overFan2'],
      };
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
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /********************/
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepage')
  @ApiOperation({ summary: 'list device page active' })
  async device_listdevicepage(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';
    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword: query.keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    var deletecache = query.deletecache;
    var filtercache: any = encodeURI(
      sort +
        device_id +
        query.mqtt_id +
        query.type_id +
        query.org +
        query.bucket +
        keyword +
        query.type_name +
        query.host +
        query.port +
        query.password +
        query.date +
        'isCount1',
    );
    var filterkeymd5: any = md5(filtercache);
    var kaycache: any = 'mqtt_device_list_page_v2_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any = await this.settingsService.device_list_paginate(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 30,
        data: rowResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    // filter สำหรับดึงข้อมูลหน้า
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var filter2cache: any = encodeURI(
      page +
        pageSize +
        sort +
        device_id +
        query.mqtt_id +
        query.type_id +
        query.org +
        query.bucket +
        keyword +
        query.type_name +
        query.host +
        query.port +
        query.password +
        query.date +
        'isCount0',
    );
    var filter2keymd5: any =
      'mqtt_device_list_paginate_v2_2_' + md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any = await this.settingsService.device_list_paginate(
        filter2,
      );
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 30,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    var tempData2 = [];
    for (var va of ResultData) {
      var mqtt_data_value = va.mqtt_data_value;
      var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
      var mqtt_data = mqttrs['data'];
      var mqtt_timestamp = mqttrs['timestamp'];
      var timestamp = mqttrs['timestamp'];
      var configdata = va.configdata;
      var mqttrs_count: any = mqtt_data.length;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      var mqtt_count: any = mqtt_objt_data.length;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqtt_obj2_data = Object.values(obj2);
      var mqtt2_count: any = mqtt_obj2_data.length;
      var mqtt_v1 = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqtt_data[i]]),
      );
      console.log('mqtt_v1=>' + mqtt_v1); // Output: 10
      var mqtt_v2 = Object.fromEntries(
        mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]),
      );
      console.log('mqtt_v2=>' + mqtt_v2); // Output: 10
      // ใช้ mapMqttDataToDeviceV2 เพื่อ map ค่า value_data, value_alarm, value_relay, value_control_relay
      if (mqttrs_count < mqtt_count) {
        var mqtt: any = mqtt_v1;
      } else {
        var mqtt: any = mqtt_v2;
      }
      var merged = format.mapMqttDataToDeviceV2([va], mqtt)[0];
      tempData2.push({
        ...va,
        ...merged,
        timestamp,
        mqttrs,
        mqttrs_count,
        mqtt_v1,
        mqtt_count,
        mqtt_v2,
        mqtt,
      });
    }
    var configdata: any = ResultData['0'].configdata;
    var mqtt_data: any = ResultData['0'].mqtt_data_value;
    var mqttrss: any = await this.mqttService.getdevicedataAll(mqtt_data);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        //mqtt:mqttrss,
        mqttrs: tempData2['0']['data'],
        //configdata:configdata,
        //filter: filter2,
        data: tempData2,
      },
      message: 'v2 list device success.',
      message_th: 'v2 lists device success.',
    });
  }
  /***********************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicepageactive1')
  async device_list_paginate_active1(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.keyword = keyword || '';
    filter.type_name = query.type_name || '';
    //filter.status = status || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any =
      await this.settingsService.device_list_paginate_active(filter);
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    //filter2.status = status || '';
    filter2.host = query.host;
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any =
      await this.settingsService.device_list_paginate_active(filter2);
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var mqtt_data_value: any = ResultData[key].mqtt_data_value;
      var mqtt_data_control: any = ResultData[key].mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
      const DataRs: any = {
        device_id: ResultData[key].device_id,
        setting_id: ResultData[key].setting_id,
        mqtt_id: ResultData[key].mqtt_id,
        type_id: ResultData[key].type_id,
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        device_name: ResultData[key].device_name,
        mqtt_name: ResultData[key].mqtt_name,
        type_name: ResultData[key].type_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_envavorment: ResultData[key].mqtt_envavorment,
        mqtt_host: ResultData[key].mqtt_host,
        mqtt_port: ResultData[key].mqtt_port,
        measurement: ResultData[key].measurement,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        oid: ResultData[key].oid,
        sn: ResultData[key].sn,
        max: ResultData[key].max,
        min: ResultData[key].min,
        hardware_id: ResultData[key].hardware_id,
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        work_status: ResultData[key].work_status,
        unit: ResultData[key].unit,
        model: ResultData[key].model,
        vendor: ResultData[key].vendor,
        comparevalue: ResultData[key].comparevalue,
        action_id: ResultData[key].action_id,
        status_alert_id: ResultData[key].status_alert_id,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        timestamp: mqttdata['payload']['timestamp'],
        temperature_value: mqttdata['payload']['temperature'],
        mqtt_dada: mqttdata['payload']['mqtt_dada'],
        contRelay1: mqttdata['payload']['contRelay1'],
        actRelay1: mqttdata['payload']['actRelay1'],
        contRelay2: mqttdata['payload']['contRelay2'],
        actRelay2: mqttdata['payload']['actRelay2'],
        fan1: mqttdata['payload']['fan1'],
        overFan1: mqttdata['payload']['overFan1'],
        fan2: mqttdata['payload']['fan2'],
        overFan2: mqttdata['payload']['overFan2'],
      };
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
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /***********************/
  // http://192.168.1.59:3003/v1/settings/listdevicepageactive?page=1&pageSize=10&bucket=BAACTW03
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepageactive')
  @ApiOperation({ summary: 'list device page active' })
  async device_list_paginate_actives(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';
    var buckets: any = query.bucket;
    var bucket: string = buckets;
    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort: sort,
      device_id: device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: bucket,
      keyword: keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    var deletecache = query.deletecache;
    var filtercache: any = encodeURI(
      sort +
        device_id +
        query.mqtt_id +
        query.type_id +
        query.org +
        bucket +
        keyword +
        query.type_name +
        query.host +
        query.port +
        query.password +
        query.date +
        'isCount1',
    );
    var filterkeymd5: any = md5(filtercache);
    var kaycache: any = 'mqtt_listdevicepageactive_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 120,
        data: rowResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    // filter สำหรับดึงข้อมูลหน้า
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var filter2cache: any = encodeURI(
      page +
        pageSize +
        sort +
        device_id +
        query.mqtt_id +
        query.type_id +
        query.org +
        query.bucket +
        keyword +
        query.type_name +
        query.host +
        query.port +
        query.password +
        query.date +
        'isCount0',
    );
    var filter2keymd5: any = md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any =
        await this.settingsService.device_list_paginate_active(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 120,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /**********************/
    var tempData2 = [];
    for (var va of ResultData) {
      var mqtt_data_value = va.mqtt_data_value;
      var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
      // res.status(200).json({
      //       statusCode: 200,
      //       code: 200,
      //       payload:  mqttrs,
      //       message: 'listdevicepageactive',
      //       message_th: 'mqttrs',
      //   });
      var mqtt_data = mqttrs['data'];
      var mqtt_timestamp = mqttrs['timestamp'];
      var timestamp = mqttrs['timestamp'];
      var configdata = va.configdata;
      var mqttrs_count: any = mqtt_data.length;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      var mqtt_count: any = mqtt_objt_data.length;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqtt_obj2_data = Object.values(obj2);
      var mqtt2_count: any = mqtt_obj2_data.length;
      var mqtt_v1 = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqtt_data[i]]),
      );
      console.log('mqtt_v1=>' + mqtt_v1); // Output: 10
      var mqtt_v2 = Object.fromEntries(
        mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]),
      );
      console.log('mqtt_v2=>' + mqtt_v2); // Output: 10
      // ใช้ mapMqttDataToDeviceV2 เพื่อ map ค่า value_data, value_alarm, value_relay, value_control_relay
      if (mqttrs_count < mqtt_count) {
        var mqtt: any = mqtt_v1;
      } else {
        var mqtt: any = mqtt_v2;
      }
      var merged = format.mapMqttDataToDeviceV2([va], mqtt)[0];
      tempData2.push({
        ...va,
        ...merged,
        timestamp,
        mqttrs,
        mqttrs_count,
        mqtt_v1,
        mqtt_count,
        mqtt_v2,
        mqtt,
      });
    }
    var configdata: any = ResultData['0'].configdata;
    var mqtt_data: any = ResultData['0'].mqtt_data_value;
    var mqttrss: any = await this.mqttService.getdevicedataAll(mqtt_data);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        //mqtt:mqttrss,
        mqttrs: tempData2['0']['data'],
        //configdata:configdata,
        //filter: filter2,
        data: tempData2,
      },
      message: 'v2 list device success.',
      message_th: 'v2 lists device success.',
    });
  }
  /***********************/
  // seetngs/mqttdata?mqttdata=
  @HttpCode(200)
  @Get('mqttdata')
  @ApiOperation({ summary: 'mqttdata' })
  async mqttdata(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var mqttdata = query.mqttdata;
    if (mqttdata == '') {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'mqttdata is null.',
        message_th: 'mqttdata is null.',
      });
    }
    var mqttrs = await this.mqttService.getdevicedataAll(mqttdata);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: mqttrs,
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }

  /*******************/
  /*******************/
  @HttpCode(200)
  @Get('listdevicepagesensor')
  @ApiOperation({ summary: 'list device page active' })
  async list_device_page_ensor(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id = query.device_id || '';
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 1000;
    const sort = query.sort;
    const keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    const filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      hardware_id: query.hardware_id || 1,
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    const rowResultData: any =
      await this.settingsService.device_list_paginate_all(filter);
    if (
      !rowResultData ||
      rowResultData === '' ||
      rowResultData.status === '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    const rowData = Number(rowResultData);
    const totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    const filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    const ResultData: any = await this.settingsService.device_list_paginate_all(
      filter2,
    );
    const RssData = [];
    if (ResultData && Array.isArray(ResultData)) {
      for (const va of ResultData) {
        const arraydata: any = {};
        arraydata.device_id = va.device_id;
        arraydata.host_id = va.host_id;
        arraydata.sort = va.sort;
        arraydata.mqtt_id = va.mqtt_id;
        arraydata.setting_id = va.setting_id;
        arraydata.type_id = va.type_id;
        arraydata.device_name = va.device_name;
        arraydata.host_name = va.host_name;
        arraydata.port = va.port;
        arraydata.sn = va.sn;
        arraydata.hardware_id = va.hardware_id;
        arraydata.typename = va.hardware_id == 1 ? 'Sensor' : 'IO';
        arraydata.status_warning = va.status_warning;
        arraydata.recovery_warning = va.recovery_warning;
        arraydata.status_alert = va.status_alert;
        arraydata.recovery_alert = va.recovery_alert;
        arraydata.time_life = va.time_life;
        arraydata.period = va.period;
        arraydata.work_status = va.work_status;
        arraydata.max = va.max;
        arraydata.min = va.min;
        arraydata.oid = va.oid;
        arraydata.mqtt_data_value = va.mqtt_data_value;
        arraydata.mqtt_data_control = va.mqtt_data_control;
        arraydata.model = va.model;
        arraydata.vendor = va.vendor;
        arraydata.comparevalue = va.comparevalue;
        arraydata.createddate = va.createddate;
        arraydata.updateddate = va.updateddate;
        arraydata.status = va.status;
        arraydata.unit = va.unit;
        arraydata.action_id = va.action_id;
        arraydata.status_alert_id = va.status_alert_id;
        arraydata.measurement = va.measurement;
        arraydata.mqtt_control_on = va.mqtt_control_on;
        arraydata.mqtt_control_off = va.mqtt_control_off;
        arraydata.device_org = va.device_org;
        arraydata.device_bucket = va.device_bucket;
        arraydata.type_name = va.type_name;
        arraydata.location_name = va.location_name;
        arraydata.configdata = va.configdata;
        arraydata.mqtt_name = va.mqtt_name;
        arraydata.mqtt_org = va.mqtt_org;
        arraydata.device_id = va.device_id; // หรือลบบรรทัดนี้เพราะมีข้างบนแล้ว
        arraydata.mqtt_bucket = va.mqtt_bucket;
        arraydata.mqtt_envavorment = va.mqtt_envavorment;
        arraydata.mqtt_host = va.mqtt_host;
        arraydata.mqtt_port = va.mqtt_port;
        arraydata.timestamp = va.timestamp;
        arraydata.mqtt_device_name = va.mqtt_device_name;
        arraydata.mqtt_status_over_name = va.mqtt_status_over_name;
        arraydata.mqtt_status_data_name = va.mqtt_status_data_name;
        arraydata.mqtt_act_relay_name = va.mqtt_act_relay_name;
        arraydata.mqtt_control_relay_name = va.mqtt_control_relay_name;
        RssData.push(arraydata);
      }
    } else {
      // หาก ResultData ไม่ใช่ array หรือเป็น falsy
      // RssData จะยังคงเป็น array ว่าง
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: RssData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  @Get('listdevicepageall')
  @ApiOperation({ summary: 'list device page active' })
  async device_list_paginate_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id = query.device_id || '';
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 1000;
    const sort = query.sort;
    const keyword = query.keyword || '';
    var layout = query.layout || '';
    // สร้าง filter สำหรับนับจำนวนข้อมูล
    const filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      hardware_id: query.hardware_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      layout:layout,
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    const rowResultData: any =
      await this.settingsService.device_list_paginate_all(filter);
    if (
      !rowResultData ||
      rowResultData === '' ||
      rowResultData.status === '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    const rowData = Number(rowResultData);
    const totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    const filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    const ResultData: any = await this.settingsService.device_list_paginate_all(
      filter2,
    );
    const RssData = [];
    if (ResultData && Array.isArray(ResultData)) {
      for (const va of ResultData) {
        const arraydata: any = {};
        var hardware_id:any= va.hardware_id;
        if(hardware_id==1){
          var typename:any='Sensor';
        }else if(hardware_id==2){
          var typename:any='IO Sensor';
        }else if(hardware_id==3){
          var typename:any='IO Control';
        }else if(hardware_id==4){
          var typename:any='Critical Sensor';
        }else {
          var typename:any='Sensor';
        }  
        arraydata.host_id = va.host_id;
        arraydata.device_id = va.device_id;
        arraydata.sort = va.sort;
        arraydata.mqtt_id = va.mqtt_id;
        arraydata.setting_id = va.setting_id;
        arraydata.type_id = va.type_id;
        arraydata.hardware_id = hardware_id;
        arraydata.type_name_id = hardware_id;
        arraydata.type_name = typename;
        arraydata.typename = va.type_name;
        arraydata.layoutapp = va.layoutapp;
        arraydata.location_name = va.location_name;
        arraydata.device_name = va.device_name;
        arraydata.host_name = va.host_name;
        arraydata.port = va.port;
        arraydata.sn = va.sn;
        arraydata.status_warning = va.status_warning;
        arraydata.recovery_warning = va.recovery_warning;
        arraydata.status_alert = va.status_alert;
        arraydata.recovery_alert = va.recovery_alert;
        arraydata.time_life = va.time_life;
        arraydata.period = va.period;
        arraydata.work_status = va.work_status;
        arraydata.max = va.max;
        arraydata.min = va.min;
        arraydata.oid = va.oid;
        arraydata.mqtt_data_value = va.mqtt_data_value;
        arraydata.mqtt_data_control = va.mqtt_data_control;
        arraydata.mqtt_control_on = va.mqtt_control_on;
        arraydata.mqtt_control_off = va.mqtt_control_off;  
        arraydata.model = va.model;
        arraydata.vendor = va.vendor;
        arraydata.comparevalue = va.comparevalue;
        arraydata.createddate = va.createddate;
        arraydata.updateddate = va.updateddate;
        arraydata.status = va.status;
        arraydata.unit = va.unit;
        arraydata.action_id = va.action_id;
        arraydata.status_alert_id = va.status_alert_id;
        arraydata.measurement = va.measurement;
        arraydata.mqtt_control_on = va.mqtt_control_on;
        arraydata.mqtt_control_off = va.mqtt_control_off;
        arraydata.device_org = va.device_org;
        arraydata.device_bucket = va.device_bucket;
        arraydata.configdata = va.configdata;
        arraydata.mqtt_name = va.mqtt_name;
        arraydata.mqtt_org = va.mqtt_org;
        arraydata.device_id = va.device_id; // หรือลบบรรทัดนี้เพราะมีข้างบนแล้ว
        arraydata.mqtt_bucket = va.mqtt_bucket;
        arraydata.mqtt_envavorment = va.mqtt_envavorment;
        arraydata.mqtt_host = va.mqtt_host;
        arraydata.mqtt_port = va.mqtt_port;
        arraydata.timestamp = va.timestamp;
        arraydata.mqtt_device_name = va.mqtt_device_name;
        arraydata.mqtt_status_over_name = va.mqtt_status_over_name;
        arraydata.mqtt_status_data_name = va.mqtt_status_data_name;
        arraydata.mqtt_act_relay_name = va.mqtt_act_relay_name;
        arraydata.mqtt_control_relay_name = va.mqtt_control_relay_name;
        RssData.push(arraydata);
      }
    } else {
          // หาก ResultData ไม่ใช่ array หรือเป็น falsy
          // RssData จะยังคงเป็น array ว่าง
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: RssData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listdevicepageallactive')
  @ApiOperation({ summary: 'list device page active' })
  async device_list_paginate_all_active(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };

    var ResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter2);
    /*
      var tempData2 = [];
          for (var va of ResultData) {
            var mqtt_data_value = va.mqtt_data_value;
            var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
            var mqtt_data = mqttrs['data'];
            var mqtt_timestamp = mqttrs['timestamp'];
            var timestamp = mqttrs['timestamp'];
            var configdata = va.configdata;
            let obj:any=[];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }

            var mqtt_objt_data = Object.values(obj);
            var result_mqtt = Object.fromEntries(mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]));

           // ใช้ mapMqttDataToDeviceV2 เพื่อ map ค่า value_data, value_alarm, value_relay, value_control_relay
            var merged = format.mapMqttDataToDeviceV2([va], result_mqtt)[0];
            tempData2.push({
              ...va,
              ...merged,
              result_mqtt,
              timestamp,
            });
          }
      */

    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listdevicepageallactiveschedule')
  @ApiOperation({ summary: 'list device page active' })
  async device_list_paginate_all_active_schedule(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var schedule_id = query.schedule_id || ''; 
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || ''; 
    var hardware_id: any = query.hardware_id;
    // สร้าง filter สำหรับนับจำนวนข้อมูล 
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      hardware_id: hardware_id || 3,
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    /*
        get_data_schedule_device
        create_schedule_device
        delete_schedule_device
    */
    if (
      schedule_id == '' ||
      schedule_id == 'undefined' ||
      schedule_id == undefined
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'schedule_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id',
      });
      return;
    }
    var scheduleResultData: any =  await this.settingsService.findOnescheduledevice(schedule_id);
    var rowResultData: any = await this.settingsService.device_list_paginate_all_active(filter);
    // return res.status(200).json({
    //     statuscode: 200,
    //     code: 400,
    //     payload: rowResultData,
    //     scheduleResultData,
    //     message: 'rowResultData.',
    //     message_th: 'rowResultData',
    // }); 

    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      return res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      }); 
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      schedule_id: schedule_id,
      hardware_id:hardware_id,
      pageSize: 1,
      page: 1,
    }; 
    /******************/
    var scheduleResultData: any =await this.settingsService.schedule_list_paginate(schedule_filter);
    // return res.status(200).json({
    //   statusCode: 200,
    //   code: 200,
    //   schedule_filter,
    //   payload: scheduleResultData,
    //   message: 'list scheduleResultData success.',
    //   message_th: 'lists scheduleResultData success.',
    // });
    /******************/
    var ResultData: any = await this.settingsService.device_list_paginate_all_active(filter2);
    console.log(`ResultData`);
    console.info(ResultData);
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;
      var filter_schedule = {
        isCount: 1,
        schedule_id,
        hardware_id,
        device_id,
      };
      var count_schedule_device: any =
        await this.settingsService.get_data_schedule_device(filter_schedule);
      if (count_schedule_device >= 1) {
        var schedule_status = 1;
      } else {
        var schedule_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        schedule_id: schedule_id,
        schedule_status: schedule_status,
        count_schedule_device: count_schedule_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        schedule_name: scheduleResultData['0'].schedule_name,
        schedule_start: scheduleResultData['0'].start,
        schedule_title:
          scheduleResultData['0'].schedule_name +
          ' ' +
          scheduleResultData['0'].start,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        scheduleData: scheduleResultData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('scheduledevicepage')
  @ApiOperation({ summary: 'list device page active' })
  async scheduledevicepage(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var schedule_id = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      schedule_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any = await this.settingsService.scheduledevicepage(
      filter,
    );
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };

    var ResultData: any = await this.settingsService.scheduledevicepage(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('schedulelist')
  @ApiOperation({ summary: 'lists chedule list' })
  async schedulelist(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var schedule_id = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      schedule_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any = await this.settingsService.scheduledevicepage(
      filter,
    );
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };

    var ResultData: any = await this.settingsService.scheduledevicepage(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicealarm')
  async device_list_alarm(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    if (location_id == '') {
      var location_id: any = 1;
    }
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = status || 1;
    var tempData2: any = [];
    /*******************/
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_fan(filter2);
    let tempData = [];
    let tempDataoid = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var mqtt_data_value: any = ResultData[key].mqtt_data_value;
      var mqtt_data_control: any = ResultData[key].mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
      var main_overFan1: any = mqttdata['payload']['overFan1'];
      var main_overFan2: any = mqttdata['payload']['overFan2'];
      var main_temperature: any = mqttdata['payload']['temperature'];
      var main_status_warning: any = ResultData[key].status_warning;
      var main_status_alert: any = ResultData[key].status_alert;
      var main_max: any = ResultData[key].max;
      var main_min: any = ResultData[key].min;
      var main_type_id: any = ResultData[key].type_id;
      var main_fan1: any = mqttdata['payload']['fan1'];
      var main_fan2: any = mqttdata['payload']['fan2'];
      var main_overFan1: any = mqttdata['payload']['overFan1'];
      var main_overFan2: any = mqttdata['payload']['overFan2'];
      if (
        (main_temperature >= main_status_warning && main_type_id == 1) ||
        (main_temperature >= main_status_alert && main_type_id == 1)
      ) {
        var alart_temperature: any = 0;
      } else {
        var alart_temperature: any = 1;
      }
      if (main_type_id == 1) {
        var sensor_name: any = 'temperature';
        var sensor_data: any = main_temperature;
        var sensor_data_name: any = sensor_data + ' ' + ResultData[key].unit;
        var alart_status: any = alart_temperature;
      } else if (main_type_id == 2) {
        var sensor_name: any = 'fan1';
        var sensor_data = main_fan1;
        var sensor_data_name: any = 'Alarm';
        var alart_status: any = main_overFan1;
      } else {
        var sensor_name: any = 'fan2';
        var sensor_data: any = main_fan2;
        var sensor_data_name: any = 'Alarm';
        var alart_status: any = main_overFan2;
      }
      const DataRs: any = {
        device_id: ResultData[key].device_id,
        setting_id: ResultData[key].setting_id,
        mqtt_id: ResultData[key].mqtt_id,
        type_id: ResultData[key].type_id,
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        device_name: ResultData[key].device_name,
        mqtt_name: ResultData[key].mqtt_name,
        type_name: ResultData[key].type_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        unit: ResultData[key].unit,
        sensor_name: sensor_name,
        sensor_data: sensor_data,
        alart_status: alart_status,
        sensor_data_name: sensor_data_name,
        timestamp: mqttdata['payload']['timestamp'],
        mqttdata,
      };
      tempData.push(va);
      if (
        (main_overFan1 != '1' && main_type_id == 2) ||
        (main_overFan2 != '1' && main_type_id == 3) ||
        (main_temperature >= main_status_warning && main_type_id == 1) ||
        (main_temperature >= main_status_alert && main_type_id == 1)
      ) {
        tempData2.push(DataRs);
      }
      /*******************/
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: tempData2,
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicealarmairV1')
  async device_list_alarm_air(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    if (location_id == '') {
      var location_id: any = 5;
    }
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = status || 1;
    console.log(`filter2=`);
    console.info(filter2);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter2);
    var tempData2: any = [];
    /*******************/
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_air(filter2);
    // res.status(200).json({
    //   statuscode: 200,
    //   code: 200,
    //   payload: ResultData,
    //   message: 'Data is ResultData.',
    //   message_th: 'ข้อมูล ResultData',
    // });
    // return;

    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_main_id: any = rs.mqtt_main_id;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );

      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }

      var timestamp: any = createddate;
      var sensor_data_name: any = subject;

      const DataRs: any = {
        //configdata,
        // mqttdata_arr,
        mqttdata,
        mqttData_count,
        //mqttData,
        //merged_data,
        //merged,
        device_id: rs.device_id,
        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        subject,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        device_name: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        main_max,
        main_min,
        main_type_id,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      if (status < 3) {
        tempData.push(va);
        tempData2.push(DataRs);
      }
      /*******************/
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      //ResultData,
      filter2,
      payload: tempData2,
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('listdevicealarmair')
  async listdevicealarmair(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var delete_cache: any = query.deletecache;
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          await this.mqttService.create_mqttlogRepository(inputCreate);
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt',
            message_th: 'check Connection Status Mqtt',
          });
          return;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        await this.mqttService.create_mqttlogRepository(inputCreate);
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt',
          message_th: 'check Connection Status Mqtt',
        });
        return;
      }
      ///////////////////////
      var sort: any = query.sort;
      var keyword: any = query.keyword;
      var location_id: any = query.location_id;
      if (!location_id) {
        var location_id: any = 5;
      }
      var filter2: any = {};
      filter2.sort = sort;
      filter2.keyword = keyword || '';
      filter2.location_id = location_id;
      filter2.type_name = query.type_name || '';
      filter2.device_id = query.device_id || '';
      filter2.mqtt_id = query.mqtt_id || '';
      filter2.type_id = query.type_id || '';
      filter2.org = query.org || '';
      filter2.bucket = query.bucket || '';
      filter2.status = status || 1;
      console.log(`filter2=`);
      console.info(filter2);
      const deletecache: any = query.deletecache || 0;
      var tempData2: any = [];
      var filtercache: any = encodeURI(
        sort +
          keyword +
          query.type_name +
          query.device_id +
          query.mqtt_id +
          query.type_id +
          query.org +
          query.bucket +
          status,
      );
      var filterkeymd5: any = md5(filtercache);
      var kaycache: any = 'data_device_alarm_air' + filterkeymd5;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var ResultDataalarm: any = await Cache.GetCacheData(kaycache);
      if (!ResultDataalarm) {
        let ResultDataalarm: any =
          await this.settingsService.device_list_ststus_alarm_air(filter2);
        var InpuDatacache: any = {
          keycache: `${kaycache}`,
          time: 300,
          data: ResultDataalarm,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }

      let tempDataoid = [];
      let dataAlert = [];
      for (var [key, va] of Object.entries(ResultDataalarm)) {
        var rs: any = ResultDataalarm[key];
        var device_id: any = rs.device_id;
        var mqtt_id: any = rs.mqtt_id;
        var setting_id: any = rs.setting_id;
        var type_id: any = rs.type_id;
        var device_name: any = rs.device_name;
        var sn: any = rs.sn;
        var hardware_id: any = rs.hardware_id;
        var status_warning: any = rs.status_warning;
        var recovery_warning: any = rs.recovery_warning;
        var status_alert: any = rs.status_alert;
        var recovery_alert: any = rs.recovery_alert;
        var time_life: any = rs.time_life;
        var period: any = rs.period;
        var work_status: any = rs.work_status;
        var max: any = rs.max;
        var min: any = rs.min;
        var oid: any = rs.oid;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var comparevalue: any = rs.comparevalue;
        var createddate: any = rs.createddate;
        var status: any = rs.status;
        var unit: any = rs.unit;
        var action_id: any = rs.action_id;
        var status_alert_id: any = rs.status_alert_id;
        var measurement: any = rs.measurement;
        var mqtt_control_on: any = rs.mqtt_control_on;
        var mqtt_control_off: any = rs.mqtt_control_off;
        var device_org: any = rs.device_org;
        var device_bucket: any = rs.device_bucket;
        var type_name: any = rs.type_name;
        var location_name: any = rs.location_name;
        var mqtt_name: any = rs.mqtt_name;
        var mqtt_org: any = rs.mqtt_org;
        var mqtt_bucket: any = rs.mqtt_bucket;
        var mqtt_envavorment: any = rs.mqtt_envavorment;
        var latitude: any = rs.latitude;
        var longitude: any = rs.longitude;
        var mqtt_main_id: any = rs.mqtt_main_id;
        var mqtt_device_name: any = rs.mqtt_device_name;
        var mqtt_status_over_name: any = rs.mqtt_status_over_name;
        var mqtt_status_data_name: any = rs.mqtt_status_data_name;
        var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
        var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
        var main_status_warning: any = rs.status_warning;
        var main_status_alert: any = rs.status_alert;
        var main_max: any = rs.max;
        var main_min: any = rs.min;
        var main_type_id: any = rs.type_id;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var configdata = mqtt_status_data_name;
        ///////////////////////
        //////////////////
        var main_type_id: any = rs.type_id;
        var configdata = mqtt_status_data_name;
        const topic: any = encodeURI(mqtt_data_value);
        const mqttrs: any = await this.mqttService.getDataTopicCacheData(topic);
        ///////////////////////
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          if (mqttstatus == 0) {
            var inputCreate: any = {
              name: device_bucket,
              statusmqtt: mqttstatus || 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: mqttdata,
              status: 1,
              createddate: new Date(),
            };
          }
          let obj: any = [];
          try {
            obj = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }
          var mqtt_objt_data = Object.values(obj);
          let obj2: any = [];
          try {
            obj2 = JSON.parse(mqtt_status_data_name);
          } catch (e) {
            throw e;
          }
          var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
          var mqttdata_arr: any = mqttdata_arrs['data'];
          var mqtt_obj2_data = Object.values(obj2);
          var mqttData_count: any = mqttdata_arr.length;
          var mqttData = Object.fromEntries(
            mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
          );
          var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
          var merged_data: any = merged_dataRs[0];
          var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          var merged: any = merged2['0'];
          if (merged) {
            var value_data: any = merged.value_data;
            var value_alarm: any = merged.value_alarm;
            var value_relay: any = merged.value_relay;
            var value_control_relay: any = merged.value_control_relay;
          } else {
            var value_data: any = '';
            var value_alarm: any = '';
            var value_relay: any = '';
            var value_control_relay: any = '';
          }
          var createddated: any = merged_data.createddate;
          var createddate: any = format.timeConvertermas(
            format.convertTZ(createddated, process.env.tzString),
          );
          var updateddated: any = merged_data.updateddate;
          var updateddate: any = format.timeConvertermas(
            format.convertTZ(updateddated, process.env.tzString),
          );
          var filter: any = {};
          filter.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filter.sensorValueData = encodeURI(value_data); //sensor
            filter.status_warning = encodeURI(status_warning);
            filter.status_alert = encodeURI(status_alert);
            filter.recovery_warning = encodeURI(recovery_warning);
            filter.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filter.sensorValueData = encodeURI(value_alarm); //IO
            filter.status_warning = parseInt('0');
            filter.status_alert = parseInt('0');
            filter.recovery_warning = parseInt('1');
            filter.recovery_alert = parseInt('1');
            var data: any = Number(value_alarm);
          }
          filter.mqtt_name = mqtt_name;
          filter.device_name = mqtt_device_name;
          filter.action_name = mqtt_name;
          filter.mqtt_control_on = encodeURI(mqtt_control_on);
          filter.mqtt_control_off = encodeURI(mqtt_control_off);
          filter.event = 1;
          filter.unit = unit;
          var getAlarmDetails: any =
            await this.settingsService.getAlarmDetailsAlert(filter);
          if (getAlarmDetails) {
            var subject: any = getAlarmDetails.subject;
            var content: any = getAlarmDetails.content;
            var status: any = getAlarmDetails.status;
            var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
            var dataAlarm: any = getAlarmDetails.dataAlarm;
            var eventControl: any = getAlarmDetails.eventControl;
            var messageMqttControl: any = getAlarmDetails.messageMqttControl;
            var sensor_data: any = getAlarmDetails.sensor_data;
            var count_alarm: any = getAlarmDetails.count_alarm;
          } else {
            var subject: any = 'Normal';
            var status: any = getAlarmDetails.status;

            var alarmStatusSet: any = '';
          }
          var status_report: any = {
            1: 'Warning',
            2: 'Alarm',
            3: 'Recovery Warning',
            4: 'Recovery Alarm',
            5: 'Normal',
          };
          var timestamp: any = timestamps;
          var sensor_data_name: any = subject;
          if (type_id == 1) {
            var value_data_msg: any = value_data;
          } else {
            if (value_data == 1) {
              var value_data_msg: any = 'ON';
            } else {
              var value_data_msg: any = 'OFF';
            }
          }
          if (value_alarm == 1) {
            var value_alarm_msg: any = 'Normal';
          } else {
            var value_alarm_msg: any = 'Alarm!';
          }
        }
        ///////////////////////
        var DataRs: any = {
          cache_data,
          topic,
          //mqttrs,
          //merged,
          status,
          status_report,
          timestamp,
          sensor_data_name,
          mqttdata,
          mqttData_count,
          device_id: rs.device_id,
          setting_id: rs.setting_id,
          mqtt_id: rs.mqtt_id,
          type_id: rs.type_id,
          subject,
          value_data_msg,
          value_alarm_msg,
          value_data,
          value_alarm,
          value_relay,
          value_control_relay,
          createddate,
          updateddate,
          location_id: rs.location_id,
          location_name: rs.location_name,
          device_name: rs.device_name,
          mqtt_name: rs.mqtt_name,
          type_name: rs.type_name,
          mqtt_bucket: rs.mqtt_bucket,
          main_status_warning,
          main_status_alert,
          main_max,
          main_min,
          main_type_id,
          // device:{
          //               device_id: rs.device_id,
          //               setting_id: rs.setting_id,
          //               mqtt_id: rs.mqtt_id,
          //               type_id: rs.type_id,
          //               location_id: rs.location_id,
          //               location_name: rs.location_name,
          //               device_name: rs.device_name,
          //               mqtt_name: rs.mqtt_name,
          //               type_name: rs.type_name,
          //               main_max,
          //               main_min,
          //               main_type_id,
          // },
          // mqttinfo:{
          //               mqtt_bucket: rs.mqtt_bucket,
          //               main_status_warning,
          //               main_status_alert,
          //               status_warning: rs.status_warning,
          //               recovery_warning: rs.recovery_warning,
          //               status_alert: rs.status_alert,
          //               recovery_alert: rs.recovery_alert,
          // },
          //mqttData,
          //merged_data,
          //merged,
          //getAlarmDetails,
          // mqtt:{
          //               mqtt_device_name,
          //               mqtt_status_over_name,
          //               mqtt_status_data_name,
          //               mqtt_act_relay_name,
          //               mqtt_control_relay_name,
          //               mqtt_data_value: mqtt_data_value,
          //               mqtt_data_control: mqtt_data_control,
          //               mqtt_control_on: rs.mqtt_control_on,
          //               mqtt_control_off: rs.mqtt_control_off,
          //               mqtt_org: rs.mqtt_org,
          //               unit: unit,
          // },
        };
        if (status != 5) {
          tempDataoid.push(DataRs);
        }
      }
      ///////////////////////
      res.status(200).json({
        statuscode: 200,
        code: 200,
        checkConnectionMqtt,
        Mqttstatus,
        payload: tempDataoid,
        message: 'check Connection Mqtt device alarm',
        message_th: 'check Connection Mqtt ',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'deviceactivemqttt Internal server error 500',
        message_th: 'deviceactivemqttt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  /////////////////////////////////////
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicealarmall')
  async deviceactivemqtttalarm(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var delete_cache: any = query.deletecache;
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          await this.mqttService.create_mqttlogRepository(inputCreate);
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt',
            message_th: 'check Connection Status Mqtt',
          });
          return;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        await this.mqttService.create_mqttlogRepository(inputCreate);
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt',
          message_th: 'check Connection Status Mqtt',
        });
        return;
      }
      ///////////////////////
      var sort: any = query.sort;
      var keyword: any = query.keyword;
      var location_id: any = query.location_id;
      var deletecache: any = query.deletecache;
      ///////////////////////
      var filter2alarm: any = {};
      filter2alarm.sort = sort;
      filter2alarm.keyword = keyword || '';
      // filter2alarm.location_id = location_id;
      filter2alarm.type_name = query.type_name || '';
      // filter2alarm.device_id = query.device_id || '';
      // filter2alarm.mqtt_id = query.mqtt_id || '';
      // filter2alarm.type_id = query.type_id || '';
      //filter2alarm.org = query.org || '';
      //filter2alarm.bucket = query.bucket || '';
      filter2alarm.status = status || 1;
      console.log(`filter2alarm=`);
      console.info(filter2alarm);
      var filtercache: any = encodeURI(
        sort +
          keyword +
          query.type_name +
          query.device_id +
          query.mqtt_id +
          query.type_id +
          query.org +
          query.bucket +
          status,
      );
      var filterkeymd5: any = md5(filtercache);
      var kaycache: any = 'device_list_ststus_alarm_all_' + filterkeymd5;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var ResultDataalarm: any = await Cache.GetCacheData(kaycache);
      if (!ResultDataalarm) {
        let ResultDataalarm: any =
          await this.settingsService.device_list_ststus_alarm_all(filter2alarm);
        var InpuDatacache: any = {
          keycache: `${kaycache}`,
          time: 600,
          data: ResultDataalarm,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      let tempDataoid = [];
      let dataAlert = [];
      for (var [key, va] of Object.entries(ResultDataalarm)) {
        var rs: any = ResultDataalarm[key];
        var device_id: any = rs.device_id;
        var mqtt_id: any = rs.mqtt_id;
        var setting_id: any = rs.setting_id;
        var type_id: any = rs.type_id;
        var device_name: any = rs.device_name;
        var sn: any = rs.sn;
        var hardware_id: any = rs.hardware_id;
        var status_warning: any = rs.status_warning;
        var recovery_warning: any = rs.recovery_warning;
        var status_alert: any = rs.status_alert;
        var recovery_alert: any = rs.recovery_alert;
        var time_life: any = rs.time_life;
        var period: any = rs.period;
        var work_status: any = rs.work_status;
        var max: any = rs.max;
        var min: any = rs.min;
        var oid: any = rs.oid;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var comparevalue: any = rs.comparevalue;
        var createddate: any = rs.createddate;
        var status: any = rs.status;
        var unit: any = rs.unit;
        var action_id: any = rs.action_id;
        var status_alert_id: any = rs.status_alert_id;
        var measurement: any = rs.measurement;
        var mqtt_control_on: any = rs.mqtt_control_on;
        var mqtt_control_off: any = rs.mqtt_control_off;
        var device_org: any = rs.device_org;
        var device_bucket: any = rs.device_bucket;
        var type_name: any = rs.type_name;
        var location_name: any = rs.location_name;
        var mqtt_name: any = rs.mqtt_name;
        var mqtt_org: any = rs.mqtt_org;
        var mqtt_bucket: any = rs.mqtt_bucket;
        var mqtt_envavorment: any = rs.mqtt_envavorment;
        var latitude: any = rs.latitude;
        var longitude: any = rs.longitude;
        var mqtt_main_id: any = rs.mqtt_main_id;
        var mqtt_device_name: any = rs.mqtt_device_name;
        var mqtt_status_over_name: any = rs.mqtt_status_over_name;
        var mqtt_status_data_name: any = rs.mqtt_status_data_name;
        var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
        var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
        var main_status_warning: any = rs.status_warning;
        var main_status_alert: any = rs.status_alert;
        var main_max: any = rs.max;
        var main_min: any = rs.min;
        var main_type_id: any = rs.type_id;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var configdata = mqtt_status_data_name;
        ///////////////////////
        //////////////////
        var main_type_id: any = rs.type_id;
        var configdata = mqtt_status_data_name;
        const topic: any = encodeURI(mqtt_data_value);
        const mqttrs: any = await this.mqttService.getDataTopicCacheData(topic);
        ///////////////////////
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          if (mqttstatus == 0) {
            var inputCreate: any = {
              name: device_bucket,
              statusmqtt: mqttstatus || 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: mqttdata,
              status: 1,
              createddate: new Date(),
            };
          }
          let obj: any = [];
          try {
            obj = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }
          var mqtt_objt_data = Object.values(obj);
          let obj2: any = [];
          try {
            obj2 = JSON.parse(mqtt_status_data_name);
          } catch (e) {
            throw e;
          }
          var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
          var mqttdata_arr: any = mqttdata_arrs['data'];
          var mqtt_obj2_data = Object.values(obj2);
          var mqttData_count: any = mqttdata_arr.length;
          var mqttData = Object.fromEntries(
            mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
          );
          var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
          var merged_data: any = merged_dataRs[0];
          var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          var merged: any = merged2['0'];
          if (merged) {
            var value_data: any = merged.value_data;
            var value_alarm: any = merged.value_alarm;
            var value_relay: any = merged.value_relay;
            var value_control_relay: any = merged.value_control_relay;
          } else {
            var value_data: any = '';
            var value_alarm: any = '';
            var value_relay: any = '';
            var value_control_relay: any = '';
          }
          var createddated: any = merged_data.createddate;
          var createddate: any = format.timeConvertermas(
            format.convertTZ(createddated, process.env.tzString),
          );
          var updateddated: any = merged_data.updateddate;
          var updateddate: any = format.timeConvertermas(
            format.convertTZ(updateddated, process.env.tzString),
          );
          var filter: any = {};
          filter.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filter.sensorValueData = encodeURI(value_data); //sensor
            filter.status_warning = encodeURI(status_warning);
            filter.status_alert = encodeURI(status_alert);
            filter.recovery_warning = encodeURI(recovery_warning);
            filter.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filter.sensorValueData = encodeURI(value_alarm); //IO
            filter.status_warning = parseInt('0');
            filter.status_alert = parseInt('0');
            filter.recovery_warning = parseInt('1');
            filter.recovery_alert = parseInt('1');
            var data: any = Number(value_alarm);
          }
          filter.mqtt_name = mqtt_name;
          filter.device_name = mqtt_device_name;
          filter.action_name = mqtt_name;
          filter.mqtt_control_on = encodeURI(mqtt_control_on);
          filter.mqtt_control_off = encodeURI(mqtt_control_off);
          filter.event = 1;
          filter.unit = unit;
          var getAlarmDetails: any =
            await this.settingsService.getAlarmDetailsAlert(filter);
          if (getAlarmDetails) {
            var subject: any = getAlarmDetails.subject;
            var content: any = getAlarmDetails.content;
            var status: any = getAlarmDetails.status;
            var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
            var dataAlarm: any = getAlarmDetails.dataAlarm;
            var eventControl: any = getAlarmDetails.eventControl;
            var messageMqttControl: any = getAlarmDetails.messageMqttControl;
            var sensor_data: any = getAlarmDetails.sensor_data;
            var count_alarm: any = getAlarmDetails.count_alarm;
          } else {
            var subject: any = 'Normal';
            var status: any = getAlarmDetails.status;

            var alarmStatusSet: any = '';
          }
          var status_report: any = {
            1: 'Warning',
            2: 'Alarm',
            3: 'Recovery Warning',
            4: 'Recovery Alarm',
            5: 'Normal',
          };
          var timestamp: any = timestamps;
          var sensor_data_name: any = subject;
          if (type_id == 1) {
            var value_data_msg: any = value_data;
          } else {
            if (value_data == 1) {
              var value_data_msg: any = 'ON';
            } else {
              var value_data_msg: any = 'OFF';
            }
          }
          if (value_alarm == 1) {
            var value_alarm_msg: any = 'Normal';
          } else {
            var value_alarm_msg: any = 'Alarm!';
          }
        }
        ///////////////////////
        var DataRs: any = {
          cache_data,
          topic,
          //mqttrs,
          //merged,
          status,
          status_report,
          timestamp,
          sensor_data_name,
          mqttdata,
          mqttData_count,
          device_id: rs.device_id,
          setting_id: rs.setting_id,
          mqtt_id: rs.mqtt_id,
          type_id: rs.type_id,
          subject,
          value_data_msg,
          value_alarm_msg,
          value_data,
          value_alarm,
          value_relay,
          value_control_relay,
          createddate,
          updateddate,
          location_id: rs.location_id,
          location_name: rs.location_name,
          device_name: rs.device_name,
          mqtt_name: rs.mqtt_name,
          type_name: rs.type_name,
          mqtt_bucket: rs.mqtt_bucket,
          main_status_warning,
          main_status_alert,
          main_max,
          main_min,
          main_type_id,
          // device:{
          //               device_id: rs.device_id,
          //               setting_id: rs.setting_id,
          //               mqtt_id: rs.mqtt_id,
          //               type_id: rs.type_id,
          //               location_id: rs.location_id,
          //               location_name: rs.location_name,
          //               device_name: rs.device_name,
          //               mqtt_name: rs.mqtt_name,
          //               type_name: rs.type_name,
          //               main_max,
          //               main_min,
          //               main_type_id,
          // },
          // mqttinfo:{
          //               mqtt_bucket: rs.mqtt_bucket,
          //               main_status_warning,
          //               main_status_alert,
          //               status_warning: rs.status_warning,
          //               recovery_warning: rs.recovery_warning,
          //               status_alert: rs.status_alert,
          //               recovery_alert: rs.recovery_alert,
          // },
          //mqttData,
          //merged_data,
          //merged,
          //getAlarmDetails,
          // mqtt:{
          //               mqtt_device_name,
          //               mqtt_status_over_name,
          //               mqtt_status_data_name,
          //               mqtt_act_relay_name,
          //               mqtt_control_relay_name,
          //               mqtt_data_value: mqtt_data_value,
          //               mqtt_data_control: mqtt_data_control,
          //               mqtt_control_on: rs.mqtt_control_on,
          //               mqtt_control_off: rs.mqtt_control_off,
          //               mqtt_org: rs.mqtt_org,
          //               unit: unit,
          // },
        };
        if (status != 5) {
          tempDataoid.push(DataRs);
        }
      }
      ///////////////////////
      res.status(200).json({
        statuscode: 200,
        code: 200,
        checkConnectionMqtt,
        Mqttstatus,
        payload: tempDataoid,
        message: 'check Connection Mqtt device alarm',
        message_th: 'check Connection Mqtt ',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'deviceactivemqttt Internal server error 500',
        message_th: 'deviceactivemqttt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  ////////////////////////////////////
  /******listdevicealarmall*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('_listdevicealarmfan')
  async _device_list_alarm_fan(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    if (location_id == '') {
      var location_id: any = 1;
    }
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = status || 1;
    console.log(`filter2=`);
    console.info(filter2);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter2);
    var tempData2: any = [];
    /*******************/
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_fans(filter2);
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_main_id: any = rs.mqtt_main_id;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );

      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }

      var timestamp: any = createddate;
      var sensor_data_name: any = subject;

      const DataRs: any = {
        //configdata,
        // mqttdata_arr,
        mqttdata,
        mqttData_count,
        //mqttData,
        //merged_data,
        //merged,
        device_id: rs.device_id,
        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        subject,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        device_name: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        main_max,
        main_min,
        main_type_id,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      if (status < 3) {
        tempData.push(va);
        tempData2.push(DataRs);
      }
      /*******************/
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      //ResultData,
      filter2,
      payload: tempData2,
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicealarmfan')
  async device_list_alarm_fan(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var delete_cache: any = query.deletecache;
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          await this.mqttService.create_mqttlogRepository(inputCreate);
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt',
            message_th: 'check Connection Status Mqtt',
          });
          return;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        await this.mqttService.create_mqttlogRepository(inputCreate);
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt',
          message_th: 'check Connection Status Mqtt',
        });
        return;
      }
      ///////////////////////
      var sort: any = query.sort;
      var keyword: any = query.keyword;
      var location_id: any = query.location_id;
      if (!location_id) {
        var location_id: any = 1;
      }
      var filter2: any = {};
      filter2.sort = sort;
      filter2.keyword = keyword || '';
      filter2.location_id = location_id;
      filter2.type_name = query.type_name || '';
      filter2.device_id = query.device_id || '';
      filter2.mqtt_id = query.mqtt_id || '';
      filter2.type_id = query.type_id || '';
      filter2.org = query.org || '';
      filter2.bucket = query.bucket || '';
      filter2.status = status || 1;
      console.log(`filter2=`);
      console.info(filter2);
      const deletecache: any = query.deletecache || 0;
      var tempData2: any = [];
      var filtercache: any = encodeURI(
        sort +
          keyword +
          query.type_name +
          query.device_id +
          query.mqtt_id +
          query.type_id +
          query.org +
          query.bucket +
          status,
      );
      var filterkeymd5: any = md5(filtercache);
      var kaycache: any = 'device_list_ststus_alarm_fan_' + filterkeymd5;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var ResultDataalarm: any = await Cache.GetCacheData(kaycache);
      if (!ResultDataalarm) {
        let ResultDataalarm: any =
          await this.settingsService.device_list_ststus_alarm_fans(filter2);
        var InpuDatacache: any = {
          keycache: `${kaycache}`,
          time: 300,
          data: ResultDataalarm,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }

      let tempDataoid = [];
      let dataAlert = [];
      for (var [key, va] of Object.entries(ResultDataalarm)) {
        var rs: any = ResultDataalarm[key];
        var device_id: any = rs.device_id;
        var mqtt_id: any = rs.mqtt_id;
        var setting_id: any = rs.setting_id;
        var type_id: any = rs.type_id;
        var device_name: any = rs.device_name;
        var sn: any = rs.sn;
        var hardware_id: any = rs.hardware_id;
        var status_warning: any = rs.status_warning;
        var recovery_warning: any = rs.recovery_warning;
        var status_alert: any = rs.status_alert;
        var recovery_alert: any = rs.recovery_alert;
        var time_life: any = rs.time_life;
        var period: any = rs.period;
        var work_status: any = rs.work_status;
        var max: any = rs.max;
        var min: any = rs.min;
        var oid: any = rs.oid;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var comparevalue: any = rs.comparevalue;
        var createddate: any = rs.createddate;
        var status: any = rs.status;
        var unit: any = rs.unit;
        var action_id: any = rs.action_id;
        var status_alert_id: any = rs.status_alert_id;
        var measurement: any = rs.measurement;
        var mqtt_control_on: any = rs.mqtt_control_on;
        var mqtt_control_off: any = rs.mqtt_control_off;
        var device_org: any = rs.device_org;
        var device_bucket: any = rs.device_bucket;
        var type_name: any = rs.type_name;
        var location_name: any = rs.location_name;
        var mqtt_name: any = rs.mqtt_name;
        var mqtt_org: any = rs.mqtt_org;
        var mqtt_bucket: any = rs.mqtt_bucket;
        var mqtt_envavorment: any = rs.mqtt_envavorment;
        var latitude: any = rs.latitude;
        var longitude: any = rs.longitude;
        var mqtt_main_id: any = rs.mqtt_main_id;
        var mqtt_device_name: any = rs.mqtt_device_name;
        var mqtt_status_over_name: any = rs.mqtt_status_over_name;
        var mqtt_status_data_name: any = rs.mqtt_status_data_name;
        var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
        var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
        var main_status_warning: any = rs.status_warning;
        var main_status_alert: any = rs.status_alert;
        var main_max: any = rs.max;
        var main_min: any = rs.min;
        var main_type_id: any = rs.type_id;
        var mqtt_data_value: any = rs.mqtt_data_value;
        var mqtt_data_control: any = rs.mqtt_data_control;
        var configdata = mqtt_status_data_name;
        ///////////////////////
        //////////////////
        var main_type_id: any = rs.type_id;
        var configdata = mqtt_status_data_name;
        const topic: any = encodeURI(mqtt_data_value);
        const mqttrs: any = await this.mqttService.getDataTopicCacheData(topic);
        ///////////////////////
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          if (mqttstatus == 0) {
            var inputCreate: any = {
              name: device_bucket,
              statusmqtt: mqttstatus || 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: mqttdata,
              status: 1,
              createddate: new Date(),
            };
          }
          let obj: any = [];
          try {
            obj = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }
          var mqtt_objt_data = Object.values(obj);
          let obj2: any = [];
          try {
            obj2 = JSON.parse(mqtt_status_data_name);
          } catch (e) {
            throw e;
          }
          var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
          var mqttdata_arr: any = mqttdata_arrs['data'];
          var mqtt_obj2_data = Object.values(obj2);
          var mqttData_count: any = mqttdata_arr.length;
          var mqttData = Object.fromEntries(
            mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
          );
          var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
          var merged_data: any = merged_dataRs[0];
          var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          var merged: any = merged2['0'];
          if (merged) {
            var value_data: any = merged.value_data;
            var value_alarm: any = merged.value_alarm;
            var value_relay: any = merged.value_relay;
            var value_control_relay: any = merged.value_control_relay;
          } else {
            var value_data: any = '';
            var value_alarm: any = '';
            var value_relay: any = '';
            var value_control_relay: any = '';
          }
          var createddated: any = merged_data.createddate;
          var createddate: any = format.timeConvertermas(
            format.convertTZ(createddated, process.env.tzString),
          );
          var updateddated: any = merged_data.updateddate;
          var updateddate: any = format.timeConvertermas(
            format.convertTZ(updateddated, process.env.tzString),
          );
          var filter: any = {};
          filter.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filter.sensorValueData = encodeURI(value_data); //sensor
            filter.status_warning = encodeURI(status_warning);
            filter.status_alert = encodeURI(status_alert);
            filter.recovery_warning = encodeURI(recovery_warning);
            filter.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filter.sensorValueData = encodeURI(value_alarm); //IO
            filter.status_warning = parseInt('0');
            filter.status_alert = parseInt('0');
            filter.recovery_warning = parseInt('1');
            filter.recovery_alert = parseInt('1');
            var data: any = Number(value_alarm);
          }
          filter.mqtt_name = mqtt_name;
          filter.device_name = mqtt_device_name;
          filter.action_name = mqtt_name;
          filter.mqtt_control_on = encodeURI(mqtt_control_on);
          filter.mqtt_control_off = encodeURI(mqtt_control_off);
          filter.event = 1;
          filter.unit = unit;
          var getAlarmDetails: any =
            await this.settingsService.getAlarmDetailsAlert(filter);
          if (getAlarmDetails) {
            var subject: any = getAlarmDetails.subject;
            var content: any = getAlarmDetails.content;
            var status: any = getAlarmDetails.status;
            var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
            var dataAlarm: any = getAlarmDetails.dataAlarm;
            var eventControl: any = getAlarmDetails.eventControl;
            var messageMqttControl: any = getAlarmDetails.messageMqttControl;
            var sensor_data: any = getAlarmDetails.sensor_data;
            var count_alarm: any = getAlarmDetails.count_alarm;
          } else {
            var subject: any = 'Normal';
            var status: any = getAlarmDetails.status;

            var alarmStatusSet: any = '';
          }
          var status_report: any = {
            1: 'Warning',
            2: 'Alarm',
            3: 'Recovery Warning',
            4: 'Recovery Alarm',
            5: 'Normal',
          };
          var timestamp: any = timestamps;
          var sensor_data_name: any = subject;
          if (type_id == 1) {
            var value_data_msg: any = value_data;
          } else {
            if (value_data == 1) {
              var value_data_msg: any = 'ON';
            } else {
              var value_data_msg: any = 'OFF';
            }
          }
          if (value_alarm == 1) {
            var value_alarm_msg: any = 'Normal';
          } else {
            var value_alarm_msg: any = 'Alarm!';
          }
        }
        ///////////////////////
        var DataRs: any = {
          cache_data,
          topic,
          //mqttrs,
          //merged,
          status,
          status_report,
          timestamp,
          sensor_data_name,
          mqttdata,
          mqttData_count,
          device_id: rs.device_id,
          setting_id: rs.setting_id,
          mqtt_id: rs.mqtt_id,
          type_id: rs.type_id,
          subject,
          value_data_msg,
          value_alarm_msg,
          value_data,
          value_alarm,
          value_relay,
          value_control_relay,
          createddate,
          updateddate,
          location_id: rs.location_id,
          location_name: rs.location_name,
          device_name: rs.device_name,
          mqtt_name: rs.mqtt_name,
          type_name: rs.type_name,
          mqtt_bucket: rs.mqtt_bucket,
          main_status_warning,
          main_status_alert,
          main_max,
          main_min,
          main_type_id,
          // device:{
          //               device_id: rs.device_id,
          //               setting_id: rs.setting_id,
          //               mqtt_id: rs.mqtt_id,
          //               type_id: rs.type_id,
          //               location_id: rs.location_id,
          //               location_name: rs.location_name,
          //               device_name: rs.device_name,
          //               mqtt_name: rs.mqtt_name,
          //               type_name: rs.type_name,
          //               main_max,
          //               main_min,
          //               main_type_id,
          // },
          // mqttinfo:{
          //               mqtt_bucket: rs.mqtt_bucket,
          //               main_status_warning,
          //               main_status_alert,
          //               status_warning: rs.status_warning,
          //               recovery_warning: rs.recovery_warning,
          //               status_alert: rs.status_alert,
          //               recovery_alert: rs.recovery_alert,
          // },
          //mqttData,
          //merged_data,
          //merged,
          //getAlarmDetails,
          // mqtt:{
          //               mqtt_device_name,
          //               mqtt_status_over_name,
          //               mqtt_status_data_name,
          //               mqtt_act_relay_name,
          //               mqtt_control_relay_name,
          //               mqtt_data_value: mqtt_data_value,
          //               mqtt_data_control: mqtt_data_control,
          //               mqtt_control_on: rs.mqtt_control_on,
          //               mqtt_control_off: rs.mqtt_control_off,
          //               mqtt_org: rs.mqtt_org,
          //               unit: unit,
          // },
        };
        if (status != 5) {
          tempDataoid.push(DataRs);
        }
      }
      ///////////////////////
      res.status(200).json({
        statuscode: 200,
        code: 200,
        checkConnectionMqtt,
        Mqttstatus,
        payload: tempDataoid,
        message: 'check Connection Mqtt device alarm',
        message_th: 'check Connection Mqtt ',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'deviceactivemqttt Internal server error 500',
        message_th: 'deviceactivemqttt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  // http://172.25.99.10:3003/v1/settings/devicemonitor?bucket=AIR1&deletecache=
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'devicemonitor' })
  @Get('_devicemonitor')
  async _devicemonitor(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    var option: any = query.option || '';
    if (!option) {
      var option: any = 2;
    }
    if (location_id == '') {
      var location_id: any = 5;
    }
    var bucket: any = query.bucket;
    if (!bucket) {
      res.status(200).json({
        statusCode: 200,
        code: 200,
        filter: null,
        payload: null,
        message: 'bucket is null.',
        message_th: 'device monitor bucket is null.',
      });
    }
    var filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    filter.location_id = location_id;
    filter.type_name = query.type_name || '';
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.status = status || 1;
    filter.option = option;
    console.log(`filter=`);
    console.info(filter);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter);
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน
    var timestamps = datePart + ' ' + timePart;
    var tempData2: any = [];
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_air(filter);
    //////////////////////////
    // res.status(200).json({
    //             statusCode: 200,
    //             code: 200,
    //             filter,
    //             payload: ResultData,
    //             message: 'device monitor success.',
    //             message_th: 'device monitor success.',
    //   });
    //////////////////////////
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_main_id: any = rs.mqtt_main_id;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );
      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
        var data: any = value_data + ' ' + unit;
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
        var data: any = Number(value_alarm);
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }
      var timestamp: any = timestamps;
      var sensor_data_name: any = subject;
      const DataRs: any = {
        //configdata,
        // mqttdata_arr,
        mqttdata,
        mqttData_count,
        //mqttData,
        //merged_data,
        //merged,
        device_id: rs.device_id,
        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        device_name: mqtt_device_name,
        data: data,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        subject,
        status,
        status_remart:
          '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        devicename: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        main_max,
        main_min,
        main_type_id,
        date,
        time,
        option,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      tempData.push(va);
      tempData2.push(DataRs);
      /*******************/
    }
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = query.type_id || '';
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = status || 1;
    filter2.option = 1;
    console.log(`filter2=`);
    console.info(filter2);
    var tem: any = await this.devicemoniiterRS(filter2);
    if (tem) {
      var tem: any = tem['0'];
    } else {
      var tem: any = {};
    }
    var maindata: any = {};
    if (tempData2) {
      maindata.mqtt_name = tempData2['0'].mqtt_name;
      maindata.bucket = tempData2['0'].mqtt_bucket;
      maindata.type_name = tempData2['0'].type_name;
      maindata.timestamp = tempData2['0'].timestamp;
      maindata.location_name = tempData2['0'].location_name;
      maindata.mqttdata = tempData2['0'].mqttdata;
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      maindata,
      data: tem,
      payload: tempData2,
      //ResultData,
      filter,
      message: 'device monitor success.',
      message_th: 'device monitor success.',
    });
  }
  /***********************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'devicemonitor' })
  @Get('devicemonitor')
  async devicemonitor(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    var option: any = query.option || '';
    if (!option) {
      var option: any = 2;
    }
    if (location_id == '') {
      var location_id: any = 5;
    }
    var bucket: any = query.bucket;
    if (!bucket) {
      res.status(200).json({
        statusCode: 200,
        code: 200,
        filter: null,
        payload: null,
        message: 'bucket is null.',
        message_th: 'device monitor bucket is null.',
      });
    }
    var filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    //filter.location_id = location_id;
    filter.type_name = query.type_name || '';
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.status = status || 1;
    filter.option = option;
    console.log(`filter=`);
    console.info(filter);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter);
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน
    var timestamps = datePart + ' ' + timePart;
    var tempData2: any = [];
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_airs(filter);
    //////////////////////////
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_main_id: any = rs.mqtt_main_id;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );
      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
        var data: any = value_data + ' ' + unit;
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
        var data: any = Number(value_alarm);
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }
      var timestamp: any = timestamps;
      var sensor_data_name: any = subject;
      const DataRs: any = {
        //configdata,
        // mqttdata_arr,
        mqttdata,
        mqttData_count,
        //mqttData,
        //merged_data,
        //merged,
        device_id: rs.device_id,
        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        device_name: mqtt_device_name,
        data: data,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        subject,
        status,
        status_remart:
          '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        devicename: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        main_max,
        main_min,
        main_type_id,
        date,
        time,
        option,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      tempData.push(va);
      tempData2.push(DataRs);
      /*******************/
    }
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    //filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = 1;
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = 1;
    filter2.option = 1;
    console.log(`filter2=`);
    console.info(filter2);
    var tem: any = [];
    var tem: any = await this.devicemoniiterRSS(filter2);
    if (!tem) {
      var tem: any = [];
    } else {
      var tem: any = tem['0'];
    }
    var maindata: any = {};
    if (tempData2) {
      maindata.mqtt_name = tempData2['0'].mqtt_name;
      maindata.bucket = tempData2['0'].mqtt_bucket;
      maindata.type_name = tempData2['0'].type_name;
      maindata.timestamp = tempData2['0'].timestamp;
      maindata.location_name = tempData2['0'].location_name;
      maindata.mqttdata = tempData2['0'].mqttdata;
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      maindata,
      data: tem,
      payload: tempData2,
      //ResultData,
      filter,
      filter2,
      message: 'device monitors success.',
      message_th: 'device monitors success.',
    });
  }
  /*******************/
  // http://172.25.99.10:3003/v1/settings/devicemonitor?devicemonitor=AIR1&deletecache=
  // http://172.25.99.10:3003/v1/settings/devicemonitor?devicemonitor=BAACTW02&deletecache=
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'devicemonitor' })
  @Get('devicemonitors')
  async devicemonitors(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var location_id: any = query.location_id || '';
    var option: any = query.option || '';
    if (!option) {
      var option: any = 2;
    }
    if (location_id == '') {
      var location_id: any = 5;
    }
    var bucket: any = query.bucket;
    if (!bucket) {
      res.status(200).json({
        statusCode: 200,
        code: 200,
        filter: null,
        payload: null,
        message: 'bucket is null.',
        message_th: 'device monitor bucket is null.',
      });
    }
    var filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword || '';
    //filter.location_id = location_id;
    filter.type_name = query.type_name || '';
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.status = status || 1;
    filter.option = option;
    console.log(`filter=`);
    console.info(filter);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter);
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน
    var timestamps = datePart + ' ' + timePart;
    var tempData2: any = [];
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_airss(filter);
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_main_id: any = rs.mqtt_main_id;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );
      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
        var data: any = value_data + ' ' + unit;
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
        var data: any = Number(value_alarm);
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }
      var timestamp: any = timestamps;
      var sensor_data_name: any = subject;
      const DataRs: any = {
        //configdata,
        // mqttdata_arr,
        mqttdata,
        mqttData_count,
        //mqttData,
        //merged_data,
        //merged,
        device_id: rs.device_id,
        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        device_name: mqtt_device_name,
        data: data,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        subject,
        status,
        status_remart:
          '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        devicename: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        main_max,
        main_min,
        main_type_id,
        date,
        time,
        option,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      tempData.push(va);
      tempData2.push(DataRs);
      /*******************/
    }
    ////////////////////////
    var filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    //filter2.location_id = location_id;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = 1;
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.status = 1;
    filter2.option = 1;
    console.log(`filter2=`);
    console.info(filter2);
    var tem: any = [];
    var tem: any = await this.devicemoniiterRSS(filter2);
    if (!tem) {
      var tem: any = [];
    } else {
      var tem: any = tem['0'];
    }
    var maindata: any = {};
    if (tempData2) {
      maindata.mqtt_name = tempData2['0'].mqtt_name;
      maindata.bucket = tempData2['0'].mqtt_bucket;
      maindata.type_name = tempData2['0'].type_name;
      maindata.timestamp = tempData2['0'].timestamp;
      maindata.location_name = tempData2['0'].location_name;
      maindata.mqttdata = tempData2['0'].mqttdata;
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      maindata,
      data: tem,
      payload: tempData2,
      //ResultData,
      filter,
      filter2,
      message: 'device monitors success.',
      message_th: 'device monitors success.',
    });
  }
  /***********************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'device list group' })
  @Get('listdevicealarmlimit')
  async device_list_alarm_limit(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const device_id: any = query.device_id || '';
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort;
    let keyword: any = query.keyword || '';
    var type_id: number = query.type_id;
    let filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword || '';
    filter2.location_id = query.location_id || 1;
    filter2.type_name = query.type_name || '';
    filter2.device_id = query.device_id || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.type_id = type_id;
    filter2.org = query.org || '';
    filter2.bucket = query.bucket || '';
    filter2.page = query.page || 1;
    filter2.pageSize = query.pageSize || 3;
    filter2.status = status || 1;
    console.log(`filter2=`);
    console.info(filter2);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_ststus_alarm_limit_' + md5(filter2);
    // if(deletecache==1){
    //   await Cache.DeleteCacheData(cachekey);
    // }
    // var tempDataRs:any =  await Cache.GetCacheData(cachekey);
    // if(!tempDataRs){
    //     var tempData2:any =  await Cache.GetCacheData(cachekey);
    // }else{
    //   var InpuDatacache:any={keycache: `${cachekey}`,time: 10,data: tempData2};
    //     await Cache.SetCacheData(InpuDatacache);
    // }
    var tempData2: any = [];
    /*******************/
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_limit(filter2);
    let tempData = [];
    let tempDataoid = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var mqtt_data_value: any = ResultData[key].mqtt_data_value;
      var mqtt_data_control: any = ResultData[key].mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
      var main_overFan1: any = mqttdata['payload']['overFan1'];
      var main_overFan2: any = mqttdata['payload']['overFan2'];
      var main_temperature: any = mqttdata['payload']['temperature'];
      var main_status_warning: any = ResultData[key].status_warning;
      var main_status_alert: any = ResultData[key].status_alert;
      var main_max: any = ResultData[key].max;
      var main_min: any = ResultData[key].min;
      var main_type_id: any = ResultData[key].type_id;
      var main_fan1: any = mqttdata['payload']['fan1'];
      var main_fan2: any = mqttdata['payload']['fan2'];
      var main_overFan1: any = mqttdata['payload']['overFan1'];
      var main_overFan2: any = mqttdata['payload']['overFan2'];
      if (
        (main_temperature >= main_status_warning && main_type_id == 1) ||
        (main_temperature >= main_status_alert && main_type_id == 1)
      ) {
        var alart_temperature: any = 0;
      } else {
        var alart_temperature: any = 1;
      }
      if (main_type_id == 1) {
        var sensor_name: any = 'temperature';
        var sensor_data: any = main_temperature;
        var sensor_data_name: any = sensor_data + ' ' + ResultData[key].unit;
        var alart_status: any = alart_temperature;
      } else if (main_type_id == 2) {
        var sensor_name: any = 'fan1';
        var sensor_data = main_fan1;
        var sensor_data_name: any = 'Alarm';
        var alart_status: any = main_overFan1;
      } else {
        var sensor_name: any = 'fan2';
        var sensor_data: any = main_fan2;
        var sensor_data_name: any = 'Alarm';
        var alart_status: any = main_overFan2;
      }
      const DataRs: any = {
        device_id: ResultData[key].device_id,
        setting_id: ResultData[key].setting_id,
        mqtt_id: ResultData[key].mqtt_id,
        type_id: ResultData[key].type_id,
        location_id: ResultData[key].location_id,
        location_name: ResultData[key].location_name,
        device_name: ResultData[key].device_name,
        mqtt_name: ResultData[key].mqtt_name,
        type_name: ResultData[key].type_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        unit: ResultData[key].unit,
        sensor_name: sensor_name,
        sensor_data: sensor_data,
        alart_status: alart_status,
        sensor_data_name: sensor_data_name,
        timestamp: mqttdata['payload']['timestamp'],
      };
      tempData.push(va);
      if (
        (main_overFan1 != '1' && main_type_id == 2) ||
        (main_overFan2 != '1' && main_type_id == 3) ||
        (main_temperature >= main_status_warning && main_type_id == 1) ||
        (main_temperature >= main_status_alert && main_type_id == 1)
      ) {
        tempData2.push(DataRs);
      }
      /*******************/
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: tempData2,
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /***********************/
  /********Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list email' })
  @Get('listemail')
  async email_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.email_id = query.email_id || '';
    filter.host_id = query.host_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.email_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.email_id = query.email_id || '';
    filter2.host_id = query.host_id || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.email_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const RSdata: any = {
        email_id: ResultData[key].email_id,
        email_name: ResultData[key].email_name,
        host_name: ResultData[key].host_name,
        host: ResultData[key].host,
        host_id: ResultData[key].host_id,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list email success..',
      message_th: 'lists email success..',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'email all' })
  @Get('emailall')
  async list_email_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.email_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'email_all success.',
      message_th: 'email_all  success.',
    });
  }
  /********Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list mqtthost' })
  @Get('listmqtthost')
  async mqtthost_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.id = query.id || '';
    filter.host_id = query.host_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.mqtthost_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.id = query.id || '';
    filter2.host = query.host || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.mqtthost_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const RSdata: any = {
        id: ResultData[key].id,
        hostname: ResultData[key].hostname,
        host: ResultData[key].host,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        status: ResultData[key].status,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list data success..',
      message_th: 'lists data success..',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'email all' })
  @Get('mqtthostall')
  async list_mqtthost_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.mqtthost_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'mqtthost_all success.',
      message_th: 'mqtthost_all  success.',
    });
  }
  /********Host**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'host all' })
  @Get('hostall')
  async list_host_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.host_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'host_all success.',
      message_th: 'host_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'host list ' })
  @Get('listhostpage')
  async host_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.host_id = query.host_id || '';
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.host_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.host_id = query.host_id || '';
    filter2.status = status || '';
    filter2.host = query.host;
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.host_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const ProfileRs: any = {
        host_id: ResultData[key].host_id,
        host_name: ResultData[key].host_name,
        host: ResultData[key].host,
        port: ResultData[key].port,
        token_value: ResultData[key].token_value,
        password: ResultData[key].password,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list group success.',
      message_th: 'lists group success.',
    });
  }
  // http://192.168.1.59:3003/v1/settings/listinfluxdbpage
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'influxdb list' })
  @Get('listinfluxdbpage')
  async influxdb_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.influxdb_id = query.influxdb_id || '';
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.influxdb_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.influxdb_id = query.influxdb_id || '';
    filter2.status = status || '';
    filter2.host = query.host;
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.influxdb_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const ProfileRs: any = {
        influxdb_id: ResultData[key].influxdb_id,
        influxdb_name: ResultData[key].influxdb_name,
        host: ResultData[key].host,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        token_value: ResultData[key].token_value,
        buckets: ResultData[key].buckets,
        status: ResultData[key].status,
        date: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list influxdb success.',
      message_th: 'lists influxdb success.',
    });
  }
  /********Influxdb**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'influxdb all' })
  @Get('influxdball')
  async list_influxdb_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.influxdb_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'influxdb_all success.',
      message_th: 'influxdb_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'mqtt list paginate' })
  @Get('listmqttpaginateactive')
  async mqtt_list_active_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 10000;
    var status: any = query.status || '';
    var select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    var deletecache: any = query.deletecache || '';
    var keyword: any = query.keyword || '';
    var filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.username = query.username || '';
    filter.password = query.password || '';
    filter.type_name = query.type_name || '';
    filter.updateddate = query.updateddate || '';
    filter.mqtt_type_id = query.mqtt_type_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.mqtt_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.host = query.host || '';
    filter2.port = query.port || '';
    filter2.username = query.username || '';
    filter2.password = query.password || '';
    filter2.type_name = query.type_name || '';
    filter2.updateddate = query.updateddate || '';
    filter2.mqtt_type_id = query.mqtt_type_id || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    var md5 = require('md5');
    var keycache_na: any =
      query.keyword +
      '_' +
      query.status +
      '_' +
      query.host +
      '_' +
      query.port +
      '_' +
      query.username +
      '_' +
      query.password +
      '_' +
      query.type_name +
      '_' +
      query.mqtt_type_id +
      '_' +
      page +
      '_' +
      pageSize;
    var keycache2: any = md5(keycache_na);
    var keycache: any = 'mqtt_list_paginate_' + keycache2;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(keycache);
    }
    var ResultData: any = await Cache.GetCacheData(keycache);
    if (!ResultData) {
      var ResultData: any = await this.settingsService.mqtt_list_paginate(
        filter2,
      );
      let setCache: any = {};
      setCache.time = 3000;
      setCache.keycache = keycache;
      setCache.data = ResultData;
      await Cache.SetCacheData(setCache);
    }
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      //const device_cache:any=await Cache.GetCacheData(ResultData[key].bucket);
      let mqtt_id: any = ResultData[key].mqtt_id;
      let filterRss: any = {};
      filterRss.mqtt_id = mqtt_id;
      var keycache2: any = 'device_mqtt_id' + mqtt_id;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(keycache2);
      }
      var rss_device: any = await Cache.GetCacheData(keycache2);
      if (!rss_device) {
        var rss_device: any = await this.settingsService.device_lists(
          filterRss,
        );
        let setCache2: any = {};
        setCache2.time = 3000;
        setCache2.keycache = keycache;
        setCache2.data = ResultData;
        await Cache.SetCacheData(setCache2);
      }
      let rss_device_count: any = rss_device.length;
      if (rss_device_count >= 1) {
        const mqtt_data_value: any = rss_device['0']['mqtt_data_value'];
        const mqtt_data_control: any = rss_device['0']['mqtt_data_control'];
        const device_cache: any = await Cache.GetCacheData(mqtt_data_value);
        const RSdata: any = {
          mqtt_id: ResultData[key].mqtt_id,
          mqtt_name: ResultData[key].mqtt_name,
          // host_name: ResultData[key].host_name,
          // host: ResultData[key].host,
          org: ResultData[key].org,
          bucket: ResultData[key].bucket,
          envavorment: ResultData[key].envavorment,
          mqtt_type_id: ResultData[key].mqtt_type_id,
          // port: ResultData[key].port,
          // username: ResultData[key].username,
          // password: ResultData[key].password,
          updateddate: ResultData[key].updateddate,
          type_name: ResultData[key].type_name,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          status: ResultData[key].status,
          device: rss_device,
          count: rss_device_count,
          data_io: device_cache['data'],
          temperature: device_cache['temperature'],
          contRelay1: device_cache['contRelay1'],
          actRelay1: device_cache['actRelay1'],
          fan1: device_cache['fan1'],
          overFan1: device_cache['overFan1'],
          contRelay2: device_cache['contRelay2'],
          actRelay2: device_cache['actRelay2'],
          fan2: device_cache['fan2'],
          overFan2: device_cache['overFan2'],
          timestamp: device_cache['timestamp'],
          remark: device_cache['remark'],
          //device_cache:device_cache,
        };
        tempData.push(va);
        tempData2.push(RSdata);
      }
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
        //filter: filter2,
        data: tempData2,
      },
      message: 'list mqtt success..',
      message_th: 'lists mqtt success..',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'mqtt list paginate' })
  @Get('listmqttpaginate')
  async mqtt_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.username = query.username || '';
    filter.password = query.password || '';
    filter.type_name = query.type_name || '';
    filter.updateddate = query.updateddate || '';
    filter.mqtt_type_id = query.mqtt_type_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.mqtt_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.host = query.host || '';
    filter2.port = query.port || '';
    filter2.username = query.username || '';
    filter2.password = query.password || '';
    filter2.type_name = query.type_name || '';
    filter2.updateddate = query.updateddate || '';
    filter2.mqtt_type_id = query.mqtt_type_id || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.mqtt_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ

      let mqtt_id: any = ResultData[key].mqtt_id;
      let filterRss: any = {};
      filterRss.mqtt_id = mqtt_id;
      var rss_device: any = await this.settingsService.device_lists(filterRss);
      let rss_device_count: any = rss_device.length;
      const RSdata: any = {
        mqtt_id: ResultData[key].mqtt_id,
        mqtt_name: ResultData[key].mqtt_name,
        // host_name: ResultData[key].host_name,
        // host: ResultData[key].host,
        org: ResultData[key].org,
        bucket: ResultData[key].bucket,
        envavorment: ResultData[key].envavorment,
        mqtt_type_id: ResultData[key].mqtt_type_id,
        // port: ResultData[key].port,
        // username: ResultData[key].username,
        // password: ResultData[key].password,
        updateddate: ResultData[key].updateddate,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        device_count: rss_device_count,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
        //filter: filter2,
        data: tempData2,
      },
      message: 'list mqtt success..',
      message_th: 'lists mqtt success..',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'mqtt list paginate' })
  @Get('listmqttdevicepaginate')
  async mqtt_list_device_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'mqtt_id-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.username = query.username || '';
    filter.password = query.password || '';
    filter.type_name = query.type_name || '';
    filter.updateddate = query.updateddate || '';
    filter.mqtt_type_id = query.mqtt_type_id || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.mqtt_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.mqtt_id = query.mqtt_id || '';
    filter2.host = query.host || '';
    filter2.port = query.port || '';
    filter2.username = query.username || '';
    filter2.password = query.password || '';
    filter2.type_name = query.type_name || '';
    filter2.updateddate = query.updateddate || '';
    filter2.mqtt_type_id = query.mqtt_type_id || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.mqtt_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ

      // const rss:any=await Cache.GetCacheData(device);
      let mqtt_id: any = ResultData[key].mqtt_id;
      let filterRss: any = {};
      filterRss.mqtt_id = mqtt_id;
      let rss_device: any = await this.settingsService.device_lists(filterRss);
      const RSdata: any = {
        mqtt_id: ResultData[key].mqtt_id,
        mqtt_name: ResultData[key].mqtt_name,
        host_name: ResultData[key].host_name,
        host: ResultData[key].host,
        mqtt_type_id: ResultData[key].mqtt_type_id,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        updateddate: ResultData[key].updateddate,
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
        device: rss_device,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list mqtt success..',
      message_th: 'lists mqtt success..',
    });
  }
  /********Line**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'line all' })
  @Get('lineall')
  async list_line_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.line_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'line_all success.',
      message_th: 'line_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'line list group' })
  @Get('listlinepage')
  async line_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.line_id = query.line_id || '';
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.line_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.line_id = query.line_id || '';
    filter2.status = status || '';
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.line_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const ProfileRs: any = {
        line_id: ResultData[key].line_id,
        line_name: ResultData[key].line_name,
        client_id: ResultData[key].client_id,
        client_secret: ResultData[key].client_secret,
        secret_key: ResultData[key].secret_key,
        redirect_uri: ResultData[key].redirect_uri,
        grant_type: ResultData[key].grant_type,
        code: ResultData[key].code,
        accesstoken: ResultData[key].accesstoken,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'list group success.',
      message_th: 'lists group success.',
    });
  }
  /********Nodered**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'nodered all' })
  @Get('noderedall')
  async list_nodered_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.nodered_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'nodered_all success.',
      message_th: 'nodered_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'nodered list paginate' })
  @Get('listnoderedpaginate')
  async nodered_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    // filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.status = query.status || '';
    filter.nodered_id = query.nodered_id || '';
    filter.host = query.host || '';
    filter.port = query.port || '';
    filter.username = query.username || '';
    filter.password = query.password || '';
    filter.type_name = query.type_name || '';
    filter.updateddate = query.updateddate || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.nodered_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    //filter2.sort = sort;
    filter2.keyword = query.keyword || '';
    filter2.status = query.status || '';
    filter2.nodered_id = query.nodered_id || '';
    filter2.host = query.host || '';
    filter2.port = query.port || '';
    filter2.username = query.username || '';
    filter2.password = query.password || '';
    filter2.type_name = query.type_name || '';
    filter2.updateddate = query.updateddate || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.nodered_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const RSdata: any = {
        nodered_id: ResultData[key].nodered_id,
        nodered_name: ResultData[key].nodered_name,
        routing: ResultData[key].routing,
        client_id: ResultData[key].client_id,
        grant_type: ResultData[key].grant_type,
        scope: ResultData[key].scope,
        host: ResultData[key].host,
        nodered_type_id: ResultData[key].nodered_type_id,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        type_name: ResultData[key].type_name,
        status: ResultData[key].status,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list nodered success..',
      message_th: 'lists nodered success..',
    });
  }
  /********Schedule**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'schedule all' })
  @Get('scheduleall')
  async list_schedule_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const schedule_id: number = Number(query.schedule_id) || 1;
    const dto: any = {
      schedule_id: schedule_id,
    };
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.schedule_all(dto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'schedule_all success.',
      message_th: 'schedule_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'scheduled list paginate' })
  @Get('listschedulepage')
  async schedule_list_page(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = query.keyword || '';
    filter.schedule_id = query.schedule_id;
    filter.device_id = query.device_id;
    filter.start = query.start;
    filter.event = query.event;
    filter.sunday = query.sunday;
    filter.monday = query.monday;
    filter.tuesday = query.tuesday;
    filter.wednesday = query.wednesday;
    filter.thursday = query.thursday;
    filter.friday = query.friday;
    filter.saturday = query.saturday;
    filter.status = query.status || '';
    filter.updateddate = query.updateddate;
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.schedule_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = query.keyword || '';
    filter2.schedule_id = query.schedule_id;
    filter2.device_id = query.device_id;
    filter2.start = query.start;
    filter2.event = query.event;
    filter2.sunday = query.sunday;
    filter2.monday = query.monday;
    filter2.tuesday = query.tuesday;
    filter2.wednesday = query.wednesday;
    filter2.thursday = query.thursday;
    filter2.friday = query.friday;
    filter2.saturday = query.saturday;
    filter2.status = query.status || '';
    filter2.updateddate = query.updateddate;
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.schedule_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ

      let filterDATA: any = {};
      filterDATA.schedule_id = ResultData[key].schedule_id;
      let countRs: any = await this.settingsService.scheduledeviceCOUNT(
        filterDATA,
      );
      const RSdata: any = {
        schedule_id: ResultData[key].schedule_id,
        schedule_name: ResultData[key].schedule_name,
        device_id: ResultData[key].device_id,
        start: ResultData[key].start,
        event: ResultData[key].event,
        sunday: ResultData[key].sunday,
        monday: ResultData[key].monday,
        tuesday: ResultData[key].tuesday,
        wednesday: ResultData[key].wednesday,
        thursday: ResultData[key].thursday,
        friday: ResultData[key].friday,
        saturday: ResultData[key].saturday,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        status: ResultData[key].status,
        countRs: countRs,
      };
      tempData.push(va);
      tempData2.push(RSdata);
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
      message: 'list scheduled success..',
      message_th: 'lists scheduled success..',
    });
  }
  /********Sms**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'sms all' })
  @Get('smsall')
  async list_sms_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.sms_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'sms_all success.',
      message_th: 'sms_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'sms list group' })
  @Get('listsmspage')
  async sms_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.sms_id = query.sms_id || '';
    filter.keyword = keyword || '';
    filter.status = status || '';
    filter.port = query.port || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.sms_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.keyword = keyword || '';
    filter2.sms_id = query.sms_id || '';
    filter2.status = status || '';
    filter2.port = query.port || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.sms_list_paginate(filter2);
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var createddate: any = ResultData[key].createddate;
      var updateddate1: any = ResultData[key].updateddate;
      // var updateddate:any=format.timeConvertermas(
      //     format.convertTZ(ResultData[key].createddate, process.env.tzString),
      //   );
      const ProfileRs: any = {
        sms_id: ResultData[key].sms_id,
        sms_name: ResultData[key].sms_name,
        host: ResultData[key].host,
        port: ResultData[key].port,
        username: ResultData[key].username,
        password: ResultData[key].password,
        apikey: ResultData[key].apikey,
        originator: ResultData[key].originator,
        status: ResultData[key].status,
        createddate: createddate,
        updateddate: updateddate1,
      };
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
      message: 'list sms success.',
      message_th: 'lists sms success.',
    });
  }
  /********Token**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'token all' })
  @Get('tokenall')
  async list_token_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.token_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'token_all success.',
      message_th: 'token_all  success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'token ' })
  @Get('tokensmspage')
  async token_list_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var status: any = query.status || '';
    let select_status: any = query.select_status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.token_id = query.token_id || '';
    filter.keyword = query.keyword || '';
    filter.host = query.host || '';
    filter.status = query.status || '';
    filter.port = query.port || '';
    filter.username = query.username || '';
    filter.password = query.password || '';
    filter.createddate = query.date || '';
    filter.isCount = 1;
    console.log(`filter =>` + filter);
    console.info(filter);
    let rowResultData: any = await this.settingsService.token_list_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.sort = query.sort;
    filter2.keyword = query.keyword || '';
    filter2.token_id = query.token_id || '';
    filter2.status = query.status || '';
    filter2.host = query.host || '';
    filter2.port = query.port || '';
    filter2.username = query.username || '';
    filter2.password = query.password || '';
    filter2.createddate = query.date || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.token_list_paginate(
      filter2,
    );
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const ProfileRs: any = {
        token_id: ResultData[key].token_id,
        token_name: ResultData[key].token_name,
        host: ResultData[key].host,
        port: ResultData[key].port,
        token_value: ResultData[key].token_value,
        username: ResultData[key].username,
        password: ResultData[key].password,
        status: ResultData[key].status,
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
      };
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
      message: 'token_value  success.',
      message_th: 'token_values  success.',
    });
  }
  /************************create************************/
  /************create_setting***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createsetting')
  async create_setting(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateSettingDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_setting_sn(DataDto.sn);
    if (Rs) {
      console.log('dto.sn=>' + DataDto.sn);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { sn: DataDto.sn },
        message: 'The SN  duplicate this data cannot createddate.',
        message_th: 'ข้อมูล SN ' + DataDto.sn + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_setting(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************create_location***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createlocation')
  async create_location(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateLocationDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_location_ip(
      DataDto.ipaddress,
    );
    if (Rs) {
      console.log('ipaddress>' + DataDto.ipaddress);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { ipaddress: DataDto.ipaddress },
        message: 'The ipaddress  duplicate this data cannot create.',
        message_th:
          'ข้อมูล ipaddress ' + DataDto.ipaddress + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_location(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************create_type***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createtype')
  async create_type(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateTypeDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_type_name(DataDto.type_name);
    if (Rs) {
      console.log('type_name=>' + DataDto.type_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { type_name: DataDto.type_name },
        message: 'The type_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล type_name ' + DataDto.type_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_type(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************createdevicetype***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createdevicetype')
  async create_device_type(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateTypeDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_type_name(DataDto.type_name);
    if (Rs) {
      console.log('type_name=>' + DataDto.type_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { type_name: DataDto.type_name },
        message: 'The type_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล type_name ' + DataDto.type_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_device_type(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************create_sensor***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createsensor')
  async create_sensor(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateSensorDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_sensor_chk(
      DataDto.sensor_name,
    );
    if (Rs) {
      console.log('sensor_name=>' + DataDto.sensor_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { sensor_name: DataDto.sensor_name },
        message: 'The sensor_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล sensor_name ' +
          DataDto.sensor_name +
          ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_sensor(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************create_group***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('creategroup')
  async create_group(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateGroupDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_group(
      DataDto.group_name,
    );
    if (Rs) {
      console.log('group_name=>' + DataDto.group_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { group_name: DataDto.group_name },
        message: 'The group_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล group_name ' + DataDto.group_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_group(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************create_mqtt***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createmqtt')
  async create_mqtt(
    @Res() res: Response,
    // @Body() DataDto: any,
    @Body(new ValidationPipe()) DataDto: CreateMqttDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_mqtt(
      DataDto.mqtt_name,
    );
    if (Rs) {
      console.log('mqtt_name=>' + DataDto.mqtt_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { mqtt_name: DataDto.mqtt_name },
        message: 'The mqtt_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล mqtt_name ' + DataDto.mqtt_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    // get_maxId_mqtt
    var sort_lasst: any = await this.settingsService.mqtt_last_sort();
    var sort_last: any = sort_lasst + 1;
    var mqtt_id: any = await this.settingsService.get_maxId_mqtt();
    console.log('mqtt_id=');
    console.info(mqtt_id);
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    const autoddate = moment(new Date(), DATE_TIME_FORMAT);
    var DataDtos: any = {
      mqtt_id: mqtt_id,
      mqtt_type_id: DataDto.mqtt_type_id,
      sort: sort_last, //DataDto.sort,
      mqtt_name: DataDto.mqtt_name,
      host: DataDto.host,
      port: DataDto.port,
      username: DataDto.username,
      password: DataDto.password,
      secret: DataDto.secret,
      expire_in: DataDto.expire_in,
      token_value: DataDto.token_value,
      org: DataDto.org,
      bucket: DataDto.bucket,
      envavorment: DataDto.envavorment,
      status: DataDto.status,
      location_id: DataDto.location_id,
      createddate: autoddate,
      //updateddate: autoddate,
      latitude: DataDto.latitude,
      longitude: DataDto.longitude,
      mqtt_main_id: DataDto.mqtt_main_id,
    };
    console.log(`createmqttDataDtos=`);
    console.info(DataDtos);
    await this.settingsService.create_mqtt(DataDtos);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('mqtttsort')
  async update_mqttt_sort(
    @Res() res: Response,
    @Body() dto: any,
    @Body() DataDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    if (!DataDto.mqtt_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data mqtt_id is null.',
        message_th: 'ไม่พบข้อมูล mqtt_id.',
      });
      return;
    }
    if (!DataDto.sort) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data sort is null.',
        message_th: 'ไม่พบข้อมูล sort.',
      });
      return;
    }
    var DataDtos: any = {
      mqtt_id: DataDto.mqtt_id,
      sort: DataDto.sort,
    };
    await this.settingsService.update_mqttt_sort(DataDtos);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Api**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createapi')
  async create_api(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: ApiDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_api(
      DataDto.api_name,
    );
    if (Rs) {
      console.log('api_name=>' + DataDto.api_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { api_name: DataDto.api_name },
        message: 'The api_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล api_name ' + DataDto.api_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_api(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Device**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createdevice')
  async create_device(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: DeviceDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_sn(DataDto.sn);
    if (Rs) {
      const Rscount: any = Rs.length;
      console.log('SN=>' + DataDto.sn);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { device_name: DataDto.sn, Rs, Rscount },
        message: 'The SN  duplicate this data cannot create.',
        message_th: 'ข้อมูล SN ' + DataDto.sn + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }

    // res.status(200).json({
    //     statusCode: 200,
    //     code: 200,
    //     payload: DataDto,
    //     message: 'DataDto.',
    //     message_th: 'DataDto..',
    //   });
    // return;

    await this.settingsService.create_device(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Email**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createemail')
  async create_email(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: EmailDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_email(
      DataDto.email_name,
    );
    if (Rs) {
      console.log('email_name=>' + DataDto.email_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { email_name: DataDto.email_name },
        message: 'The email_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล email_name ' + DataDto.email_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_email(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Email**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createmqtthost')
  async create_mqtthost(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_mqtthost(DataDto.hostname);
    if (Rs) {
      console.log('hostname=>' + DataDto.hostname);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { hostname: DataDto.hostname },
        message: 'The hostname  duplicate this data cannot create.',
        message_th:
          'ข้อมูล hostname ' + DataDto.hostname + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_mqtthost(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Host**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createhost')
  async create_host(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: HostDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_email(
      DataDto.host_name,
    );
    if (Rs) {
      console.log('host_name=>' + DataDto.host_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { host_name: DataDto.host_name },
        message: 'The host_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล host_name ' + DataDto.host_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_host(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Influxdb**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createinfluxdb')
  async create_influxdb(
    @Res() res: Response,
    @Body() DataDto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    // const Rs:any=await this.settingsService.get_name_create_influxdb(DataDto.influxdb_name);
    // if (Rs) {
    //     console.log('influxdb_name=>' + DataDto.influxdb_name);
    //     res.status(200).json({
    //       statusCode: 200,
    //       code: 422,
    //       payload: {  influxdb_name: DataDto.influxdb_name },
    //       message: 'The influxdb_name  duplicate this data cannot create.',
    //       message_th: 'ข้อมูล influxdb_name '+DataDto.influxdb_name+' ซ้ำไม่สามารถเพิ่มได้.',
    //     });
    //     return;
    //    //throw new UnprocessableEntityException();
    // }
    await this.settingsService.create_influxdb(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Line**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createline')
  async create_line(
    @Res() res: Response,
    @Body() DataDto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_line(
      DataDto.line_name,
    );
    if (Rs) {
      console.log('line_name=>' + DataDto.line_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { line_name: DataDto.line_name },
        message: 'The line_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล line_name ' + DataDto.line_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_line(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Nodered**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createnodered')
  async create_nodered(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: NoderedDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_nodered(
      DataDto.nodered_name,
    );
    if (Rs) {
      console.log('nodered_name=>' + DataDto.nodered_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { nodered_name: DataDto.nodered_name },
        message: 'The nodered_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล nodered_name ' +
          DataDto.nodered_name +
          ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_nodered(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Schedule**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createschedule')
  async create_schedule(
    @Body(new ValidationPipe()) dataDto: SchedulDto,
  ): Promise<any> {
    // ตรวจสอบข้อมูลที่ส่งมา
    if (!dataDto) {
      return {
        statusCode: 422,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      };
    }

    // ตรวจสอบชื่อ schedule ซ้ำ
    const isDuplicate = await this.settingsService.get_name_create_schedule(
      dataDto.schedule_name,
    );
    if (isDuplicate) {
      return {
        statusCode: 409,
        code: 409,
        payload: { schedule_name: dataDto.schedule_name },
        message: 'The schedule_name is duplicate, cannot create.',
        message_th: `ข้อมูล schedule_name ${dataDto.schedule_name} ซ้ำไม่สามารถเพิ่มได้.`,
      };
    }

    // สร้างข้อมูลใหม่
    await this.settingsService.create_schedule(dataDto);
    return {
      statusCode: 201,
      code: 201,
      payload: dataDto,
      message: 'Create Data successfully.',
      message_th: 'เพิ่มข้อมูลสำเร็จ.',
    };
  }
  /********create_scheduleDevice**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createscheduledevice')
  async create_scheduleDevice(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: scheduleDevice,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.findOnescheduledevice(
      DataDto.schedule_id,
    );
    if (Rs) {
      console.log('schedule_id=>' + DataDto.schedule_id);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { schedule_id: DataDto.schedule_id },
        message: 'The schedule_id  duplicate this data cannot create.',
        message_th:
          'ข้อมูล schedule_id ' +
          DataDto.schedule_id +
          ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.createscheduledevice(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Sms**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createsms')
  async create_sms(
    @Res() res: Response,
    @Body() DataDto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_sms(
      DataDto.sms_name,
    );
    if (Rs) {
      console.log('sms_name=>' + DataDto.sms_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { sms_name: DataDto.sms_name },
        message: 'The sms_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล sms_name ' + DataDto.sms_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_sms(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_Token**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createtoken')
  async create_token(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: TokenDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_token(
      DataDto.token_name,
    );
    if (Rs) {
      console.log('token_name=>' + DataDto.token_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { token_name: DataDto.token_name },
        message: 'The token_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล token_name ' + DataDto.token_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_token(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_telegram_**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createtelegram')
  async create_telegram(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: TelegramDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_name_create_telegram(
      DataDto.telegram_name,
    );
    if (Rs) {
      console.log('telegram_name=>' + DataDto.telegram_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { telegram_name: DataDto.telegram_name },
        message: 'The telegram_name  duplicate this data cannot create.',
        message_th:
          'ข้อมูล telegram_name ' +
          DataDto.telegram_name +
          ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_telegram(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /********create_deviceactionuser**********/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('deviceactionuser')
  async Deviceactionuser(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: DeviceActionuserDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_deviceactionuserlog(
      DataDto.alarm_action_id,
    );
    if (Rs) {
      console.log('alarm_action_id=>' + DataDto.alarm_action_id);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { alarm_action_id: DataDto.alarm_action_id },
        message: 'The alarm_action_id  duplicate this data cannot create.',
        message_th:
          'ข้อมูล alarm_action_id ' +
          DataDto.alarm_action_id +
          ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_deviceactionuserlog(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /************************update************************/
  /****************update_setting*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_setting' })
  @Post('updatesetting')
  async update_setting(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_setting(dto.setting_id);
    if (!Rs) {
      console.log('setting_id>' + dto.setting_id);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { setting_id: dto.setting_id },
        message: 'setting_id information not found..',
        message_th: 'ไม่พบข้อมูล setting_id ' + dto.setting_id,
      });
      return;
      //throw new UnprocessableEntityException();
    }
    const setting_id: string = dto.setting_id;
    if (!setting_id) {
      const setting_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + setting_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + setting_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.setting_id = setting_id;
    if (dto.location_id) {
      DataUpdate.location_id = dto.location_id;
    }
    if (dto.setting_type_id) {
      DataUpdate.setting_type_id = dto.setting_type_id;
    }
    if (dto.setting_name) {
      DataUpdate.setting_name = dto.setting_name;
    }
    if (dto.sn) {
      DataUpdate.sn = dto.sn;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_setting(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_location*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_location' })
  @Post('updatelocation')
  async update_location(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_location(dto.location_id);
    if (!Rs) {
      console.log('ipaddress>' + dto.location_id);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { location_id: dto.location_id },
        message: 'Location_id information not found..',
        message_th: 'ไม่พบข้อมูล location_id ' + dto.location_id,
      });
      return;
      //throw new UnprocessableEntityException();
    }
    const location_id: string = dto.location_id;
    if (!location_id) {
      const location_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + location_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + location_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.location_id = location_id;
    if (dto.location_name) {
      DataUpdate.location_name = dto.location_name;
    }
    if (dto.ipaddress) {
      DataUpdate.ipaddress = dto.ipaddress;
    }
    if (dto.location_detail) {
      DataUpdate.location_detail = dto.location_detail;
    }
    if (dto.configdata) {
      DataUpdate.configdata = dto.configdata;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_location(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_type*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_type' })
  @Post('updatetype')
  async update_type(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    const type_id: string = dto.type_id;
    if (!type_id) {
      const type_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + type_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + type_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.type_id = type_id;
    if (dto.type_name) {
      DataUpdate.type_name = dto.type_name;
    }
    if (dto.group_id) {
      DataUpdate.group_id = dto.group_id;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_type(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_type*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_device_type' })
  @Post('updatedevicetype')
  async update_device_type(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    const type_id: string = dto.type_id;
    if (!type_id) {
      const type_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + type_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + type_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.type_id = type_id;
    if (dto.type_name) {
      DataUpdate.type_name = dto.type_name;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_device_type(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_sensor*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_sensor' })
  @Post('updatesensor')
  async update_sensor(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    const sensor_id: string = dto.sensor_id;
    if (!sensor_id) {
      const sensor_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + sensor_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + sensor_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.sensor_id = sensor_id;
    if (dto.setting_type_id) {
      DataUpdate.setting_type_id = dto.setting_type_id;
    }
    if (dto.sensor_name) {
      DataUpdate.sensor_name = dto.setting_type_id;
    }
    if (dto.sn) {
      DataUpdate.sn = dto.sn;
    }
    if (dto.max) {
      DataUpdate.max = dto.max;
    }
    if (dto.min) {
      DataUpdate.min = dto.min;
    }
    if (dto.hardware_id) {
      DataUpdate.hardware_id = dto.hardware_id;
    }
    if (dto.status_high) {
      DataUpdate.status_high = dto.status_high;
    }
    if (dto.status_warning) {
      DataUpdate.status_warning = dto.status_warning;
    }
    if (dto.status_alert) {
      DataUpdate.status_alert = dto.status_alert;
    }
    if (dto.model) {
      DataUpdate.model = dto.model;
    }
    if (dto.vendor) {
      DataUpdate.vendor = dto.vendor;
    }
    if (dto.comparevalue) {
      DataUpdate.comparevalue = dto.comparevalue;
    }
    if (dto.updateddate) {
      DataUpdate.updateddate = dto.updateddate;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    if (dto.unit) {
      DataUpdate.unit = dto.unit;
    }
    if (dto.mqtt_id) {
      DataUpdate.mqtt_id = dto.mqtt_id;
    }
    if (dto.action_id) {
      DataUpdate.action_id = dto.action_id;
    }
    if (dto.status_alert_id) {
      DataUpdate.status_alert_id = dto.status_alert_id;
    }
    if (dto.mqtt_data_value) {
      DataUpdate.mqtt_data_value = dto.mqtt_data_value;
    }
    if (dto.mqtt_data_control) {
      DataUpdate.mqtt_data_control = dto.mqtt_data_control;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_sensor(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_group*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_group' })
  @Post('updategroup')
  async update_group(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    const group_id: string = dto.group_id;
    if (!group_id) {
      const group_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + group_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + group_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.group_id = group_id;
    if (dto.group_id) {
      DataUpdate.group_id = dto.group_id;
    }

    if (dto.group_name) {
      DataUpdate.group_name = dto.group_name;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.settingsService.update_group(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************update_mqtt*************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_mqtt' })
  @Post('updatemqtt')
  async update_mqtt(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var mqtt_id: string = dto.mqtt_id;
    var status: string = dto.status;
    if (!mqtt_id) {
      const mqtt_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + mqtt_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + mqtt_id + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.mqtt_id = mqtt_id;
    if (dto.mqtt_type_id) {
      DataUpdate.mqtt_type_id = dto.mqtt_type_id;
    }
    if (dto.location_id) {
      DataUpdate.location_id = dto.location_id;
    }
    if (dto.mqtt_name) {
      DataUpdate.mqtt_name = dto.mqtt_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    if (dto.secret) {
      DataUpdate.secret = dto.secret;
    }
    if (dto.expire_in) {
      DataUpdate.expire_in = dto.expire_in;
    }
    if (dto.token_value) {
      DataUpdate.token_value = dto.token_value;
    }
    if (dto.org) {
      DataUpdate.org = dto.org;
    }
    if (dto.bucket) {
      DataUpdate.bucket = dto.bucket;
    }
    if (dto.envavorment) {
      DataUpdate.envavorment = dto.envavorment;
    }
    if (dto.latitude) {
      DataUpdate.latitude = dto.latitude;
    }
    if (dto.longitude) {
      DataUpdate.longitude = dto.longitude;
    }
    if (!dto.mqtt_main_id) {
      DataUpdate.mqtt_main_id = 1;
    } else if (dto.mqtt_main_id) {
      DataUpdate.mqtt_main_id = dto.mqtt_main_id;
    }
    if (dto.configuration) {
      DataUpdate.configuration = dto.configuration;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_mqtt(DataUpdate);
    var rsbucket: any = await this.settingsService.get_mqtt(mqtt_id);
    // var mqtt_name: any =rsbucket['mqtt_name'];
    // var org: any =rsbucket['org'];
    var rs_bucket: any = rsbucket.bucket;
    var org: any = rsbucket.org;
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        mqtt_id: mqtt_id,
        bucket: rs_bucket,
        payload: DataUpdate,
        payload2: rt,
        DataUpdate: DataUpdate,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updatemqttstatus')
  async update_mqtt_status(
    @Res() res: Response,
    @Body() dto: updatemqttstatusDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var mqtt_id: number = dto.mqtt_id;
    if (mqtt_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + mqtt_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + mqtt_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.mqtt_id = mqtt_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_mqtt(mqtt_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_mqtt_status(
        mqtt_id,
        status,
      );
    } else {
      var rt: any = await this.settingsService.update_mqtt_status(mqtt_id, 0);
    }
    if (rsbucket_count != 0) {
      // let filter2:any={};
      // filter2.bucket = rsbucket.bucket ;
      // let device:any=await this.settingsService.device_lists_id(filter2);
      // let device_count:any=device.length;
      // var mqtt_name: any =rsbucket['mqtt_name'];
      // var org: any =rsbucket['org'];
      var rs_bucket: any = rsbucket.bucket;
      var org: any = rsbucket.org;
      if (rt) {
        var DataUpdate2: any = {};
        DataUpdate2.mqtt_id = mqtt_id;
        DataUpdate2.bucket = rs_bucket;
        DataUpdate2.status = dto.status;
        var mqtt_bucket: any =
          await this.settingsService.update_device_mqtt_status(
            rs_bucket,
            status,
          );
      }
    }
    // http://192.168.1.59:3003/v1/settings/updatemqtt
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        mqtt_id: mqtt_id,
        bucket: rs_bucket,
        payload: DataUpdate,
        DataUpdate: DataUpdate,
        DataUpdate2: DataUpdate2,
        mqtt_bucket: mqtt_bucket,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Api**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_api' })
  @Post('updateapi')
  async update_api(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var api_id: string = dto.api_id;
    if (!api_id) {
      var api_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + api_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + api_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.api_id = api_id;
    if (dto.api_name) {
      DataUpdate.api_name = dto.api_name;
    }
    if (dto.mqtt_name) {
      DataUpdate.mqtt_name = dto.mqtt_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.token_value) {
      DataUpdate.token_value = dto.token_value;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_api(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Device**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_device' })
  @Post('updatedevice')
  async update_device(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var device_id: string = dto.device_id;
    if (!device_id) {
      var device_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + device_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + device_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.device_id = device_id;
    if (dto.setting_id) {
      DataUpdate.setting_id = dto.setting_id;
    }
    if (dto.type_id) {
      DataUpdate.type_id = dto.type_id;
    }
    if (dto.location_id) {
      DataUpdate.location_id = dto.location_id;
    }
    if (dto.device_name) {
      DataUpdate.device_name = dto.device_name;
    }
    if (dto.sn) {
      DataUpdate.sn = dto.sn;
    }
    if (dto.max) {
      DataUpdate.max = dto.max;
    }
    if (dto.min) {
      DataUpdate.min = dto.min;
    }
    if (dto.hardware_id) {
      DataUpdate.hardware_id = dto.hardware_id;
    }
    if (dto.status_warning) {
      DataUpdate.status_warning = dto.status_warning;
    }
    if (dto.recovery_warning) {
      DataUpdate.recovery_warning = dto.recovery_warning;
    }
    if (dto.status_alert) {
      DataUpdate.status_alert = dto.status_alert;
    }
    if (dto.recovery_alert) {
      DataUpdate.recovery_alert = dto.recovery_alert;
    }
    if (dto.time_life) {
      DataUpdate.time_life = dto.time_life;
    }
    if (dto.period) {
      DataUpdate.period = dto.period;
    }
    if (dto.model) {
      DataUpdate.model = dto.model;
    }
    if (dto.vendor) {
      DataUpdate.vendor = dto.vendor;
    }
    if (dto.comparevalue) {
      DataUpdate.comparevalue = dto.comparevalue;
    }
    if (dto.updateddate) {
      DataUpdate.updateddate = dto.updateddate;
    }
    if (dto.unit) {
      DataUpdate.unit = dto.unit;
    }
    if (dto.mqtt_id) {
      DataUpdate.mqtt_id = dto.mqtt_id;
    }
    if (dto.action_id) {
      DataUpdate.action_id = dto.action_id;
    }
    if (dto.status_alert_id) {
      DataUpdate.status_alert_id = dto.status_alert_id;
    }
    if (dto.oid) {
      DataUpdate.oid = dto.oid;
    }
    if (dto.mqtt_data_value) {
      DataUpdate.mqtt_data_value = dto.mqtt_data_value;
    }
    if (dto.mqtt_data_control) {
      DataUpdate.mqtt_data_control = dto.mqtt_data_control;
    }
    if (dto.measurement) {
      DataUpdate.measurement = dto.measurement;
    }
    if (dto.mqtt_control_on) {
      DataUpdate.mqtt_control_on = dto.mqtt_control_on;
    }
    if (dto.mqtt_control_off) {
      DataUpdate.mqtt_control_off = dto.mqtt_control_off;
    }
    if (dto.org) {
      DataUpdate.org = dto.org;
    }
    if (dto.bucket) {
      DataUpdate.bucket = dto.bucket;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    if (dto.mqtt_device_name) {
      DataUpdate.mqtt_device_name = dto.mqtt_device_name;
    }
    if (dto.mqtt_status_over_name) {
      DataUpdate.mqtt_status_over_name = dto.mqtt_status_over_name;
    }
    if (dto.mqtt_status_data_name) {
      DataUpdate.mqtt_status_data_name = dto.mqtt_status_data_name;
    }
    if (dto.mqtt_act_relay_name) {
      DataUpdate.mqtt_act_relay_name = dto.mqtt_act_relay_name;
    }
    if (dto.mqtt_control_relay_name) {
      DataUpdate.mqtt_control_relay_name = dto.mqtt_control_relay_name;
    }
    if (dto.layout) {
      DataUpdate.layout = dto.layout;
    }
    if (dto.alert_set) {
      DataUpdate.alert_set = dto.alert_set;
    }
    if (dto.icon_normal) {
      DataUpdate.icon_normal = dto.icon_normal;
    }
    if (dto.icon_warning) {
      DataUpdate.icon_warning = dto.icon_warning;
    }
    if (dto.icon_alert) {
      DataUpdate.icon_alert = dto.icon_alert;
    }
    if (dto.icon) {
      DataUpdate.icon = dto.icon;
    }
    if (dto.icon_on) {
      DataUpdate.icon_on = dto.icon_on;
    }
    if (dto.icon_off) {
      DataUpdate.icon_off = dto.icon_off;
    }
    if (dto.color_normal) {
      DataUpdate.color_normal = dto.color_normal;
    }
    if (dto.color_warning) {
      DataUpdate.color_warning = dto.color_warning;
    }
    if (dto.color_alert) {
      DataUpdate.color_alert = dto.color_alert;
    }
    if (dto.code) {
      DataUpdate.code = dto.code; // 'normal', 'warning', 'alarm', 'recovery_warning', 'recovery_alarm'
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_device(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_email' })
  @Post('updateemail')
  async update_email(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var email_id: string = dto.email_id;
    if (!email_id) {
      var email_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + email_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + email_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.email_id = email_id;
    if (dto.email_type_id) {
      DataUpdate.email_type_id = dto.email_type_id;
    }
    if (dto.email_name) {
      DataUpdate.email_name = dto.email_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_email(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updateemailstatus')
  async updateemailstatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var email_id: any = dto.email_id;
    if (email_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + email_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + email_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.email_id = email_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_email(email_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_email_status(email_id, 1);
    } else {
      var rt: any = await this.settingsService.update_email_status(email_id, 0);
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        email_id: email_id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtthost' })
  @Post('updatemqtthost')
  async update_mqtthost(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var id: string = dto.id;
    if (!id) {
      var id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.id = id;
    if (dto.hostname) {
      DataUpdate.hostname = dto.hostname;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_mqtthost(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update _mqtthost status' })
  @Post('updatemqtthoststatus')
  async update_mqtthoststatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var id: any = dto.id;
    if (id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.id = id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_mqtthost_id(id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_mqtthost_status(id, 1);
    } else {
      var rt: any = await this.settingsService.update_mqtthost_status(id, 0);
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        id: id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Host**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_host' })
  @Post('updatehost')
  async update_host(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var host_id: string = dto.host_id;
    if (!host_id) {
      var host_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + host_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + host_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.host_id = host_id;
    if (dto.host_type_id) {
      DataUpdate.host_type_id = dto.host_type_id;
    }
    if (dto.host_name) {
      DataUpdate.host_name = dto.host_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_host(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Influxdb**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_influxdb' })
  @Post('updateinfluxdb')
  async update_influxdb(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var influxdb_id: string = dto.influxdb_id;
    if (!influxdb_id) {
      var influxdb_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + influxdb_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + influxdb_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.influxdb_id = influxdb_id;
    if (dto.influxdb_name) {
      DataUpdate.influxdb_name = dto.influxdb_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    if (dto.token_value) {
      DataUpdate.token_value = dto.token_value;
    }
    if (dto.buckets) {
      DataUpdate.buckets = dto.buckets;
    }

    /*
            sd_iot_influxdb
              influxdb_id: string; 
              influxdb_name: string;
              host:number;
              port: string;
              username: string;
              password: string;
              token_value: string;
              buckets: string;
              createddate: Date;
              updateddate: Date;
              status:number;
        */
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_influxdb(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updateinfluxdbstatus')
  async updateinfluxdbstatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var influxdb_id: any = dto.influxdb_id;
    if (influxdb_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + influxdb_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + influxdb_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.influxdb_id = influxdb_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_influxdb(influxdb_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_influxdb_status(
        influxdb_id,
        1,
      );
    } else {
      var rt: any = await this.settingsService.update_influxdb_status(
        influxdb_id,
        0,
      );
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        influxdb_id: influxdb_id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Line**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_line' })
  @Post('updateline')
  async update_line(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var line_id: string = dto.line_id;
    if (!line_id) {
      var line_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + line_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + line_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.line_id = line_id;
    if (dto.line_name) {
      DataUpdate.line_name = dto.line_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_line(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Nodered**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_nodered' })
  @Post('updatenodered')
  async update_nodered(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var nodered_id: string = dto.nodered_id;
    if (!nodered_id) {
      var nodered_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + nodered_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + nodered_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.nodered_id = nodered_id;
    if (dto.nodered_name) {
      DataUpdate.nodered_name = dto.nodered_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.routing) {
      DataUpdate.routing = dto.routing;
    }
    if (dto.client_id) {
      DataUpdate.client_id = dto.client_id;
    }
    if (dto.grant_type) {
      DataUpdate.grant_type = dto.grant_type;
    }
    if (dto.scope) {
      DataUpdate.scope = dto.scope;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_nodered(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /***********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updatenoderedstatus')
  async updatenoderedstatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var nodered_id: any = dto.nodered_id;
    if (nodered_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + nodered_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + nodered_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.nodered_id = nodered_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsdata: any = await this.settingsService.get_nodered(nodered_id);
    let rsdata_count: any = rsdata.length;
    if (rsdata_count != 0) {
      var rt: any = await this.settingsService.update_nodered_status(
        nodered_id,
        1,
      );
    } else {
      var rt: any = await this.settingsService.update_nodered_status(
        nodered_id,
        0,
      );
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        nodered_id: nodered_id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /***********/
  /********update_Schedule**********/
  @Post('updateschedule')
  @ApiOperation({ summary: 'update_schedule' })
  @HttpCode(200)
  async update_schedule(@Body() dto: any, @Req() req: any): Promise<any> {
    // ตรวจสอบ JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        code: 401,
        payload: null,
        message: 'Unauthorized',
        message_th: 'ไม่ได้รับอนุญาต',
      };
    }
    const token = authHeader.replace('Bearer ', '').trim();
    let user: any;
    try {
      user = this.jwtService.decode(token);
    } catch (e) {
      return {
        statusCode: 401,
        code: 401,
        payload: null,
        message: 'Invalid token',
        message_th: 'Token ไม่ถูกต้อง',
      };
    }

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!dto || !dto.schedule_id) {
      return {
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'schedule_id is required.',
        message_th: 'ต้องระบุ schedule_id.',
      };
    }

    // เตรียมข้อมูลสำหรับอัปเดต (รองรับ field ใหม่ได้ง่าย)
    const updatableFields = [
      'schedule_name',
      'device_id',
      'start',
      'event',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'status',
      'calendar_time',
    ];
    const DataUpdate: any = { schedule_id: dto.schedule_id };
    for (const key of updatableFields) {
      if (dto[key] !== undefined) {
        DataUpdate[key] = dto[key];
      }
    }

    // เรียก service อัปเดต
    const rt = await this.settingsService.update_schedule(DataUpdate);

    // ส่ง response
    if (rt && rt.code == 200) {
      return {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        message: 'Update successful.',
        message_th: 'อัปเดตสำเร็จ.',
      };
    } else {
      return {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดตไม่สำเร็จ',
      };
    }
  }
  /********update_Sms**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_sms' })
  @Post('updatesms')
  async update_sms(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var sms_id: string = dto.sms_id;
    if (!sms_id) {
      var sms_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + sms_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + sms_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.sms_id = sms_id;
    if (dto.sms_name) {
      DataUpdate.sms_name = dto.sms_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    if (dto.apikey) {
      DataUpdate.apikey = dto.apikey;
    }
    if (dto.originator) {
      DataUpdate.originator = dto.originator;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_sms(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************/

  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updatelinestatus')
  async updatelinestatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var line_id: any = dto.line_id;
    if (!line_id) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' line_id ' + line_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + line_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.line_id = line_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_line(line_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_line_status(line_id, 1);
    } else {
      var rt: any = await this.settingsService.update_line_status(line_id, 0);
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        line_id: line_id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /****************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updatesmsstatus')
  async updatesmsstatus(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var sms_id: any = dto.sms_id;
    if (!sms_id) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' sms_id ' + sms_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + sms_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.sms_id = sms_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_sms(sms_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_sms_status(sms_id, 1);
    } else {
      var rt: any = await this.settingsService.update_sms_status(sms_id, 0);
    }
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        sms_id: sms_id,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********update_Token**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_token' })
  @Post('updatetoken')
  async update_token(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    var token_id: string = dto.token_id;
    if (!token_id) {
      var token_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + token_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + token_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.token_id = token_id;
    if (dto.token_name) {
      DataUpdate.token_name = dto.token_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_token(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update status device id' })
  @Post('updatestatusdeviceid')
  async update_status_deviceid(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    //console.log('Post req');  console.info(req);
    // console.log(`dto=>`); console.info(dto);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var device_id: any = dto.device_id;
    if (device_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' device_id ' + device_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  device_id ' + device_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var mqtt_bucket: any =
      await this.settingsService.update_device_mqtt_status_device_id(
        device_id,
        status,
      );
    if (mqtt_bucket) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: mqtt_bucket,
        message: 'Update status device successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Update status device Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********updateschedulestatus**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update schedule status' })
  @Post('updateschedulestatus')
  async update_schedule_status(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    //  UPDATE public.sd_iot_mqtt SET status = 0 WHERE mqtt_id=1
    //  console.log('Post req');  console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var schedule_id: number = dto.schedule_id;
    if (schedule_id == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + schedule_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + schedule_id + '.',
      };
      res.status(200).json(result);
    }
    var status: number = dto.status;
    if (status == null) {
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: dto,
        message: ' id ' + status + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + status + '.',
      };
      res.status(200).json(result);
    }
    var DataUpdate: any = {};
    DataUpdate.schedule_id = schedule_id;
    DataUpdate.status = status;
    // console.log(`DataUpdate=>`);
    // console.info(DataUpdate);
    var rsbucket: any = await this.settingsService.get_schedule(schedule_id);
    let rsbucket_count: any = rsbucket.length;
    if (rsbucket_count != 0) {
      var rt: any = await this.settingsService.update_schedule_status(
        schedule_id,
        status,
      );
    } else {
      var rt: any = await this.settingsService.update_schedule_status(
        schedule_id,
        0,
      );
    }
    if (rsbucket_count != 0) {
      if (rt) {
        var mqtt_bucket: any =
          await this.settingsService.update_schedule_status(
            schedule_id,
            status,
          );
      }
    }
    // http://192.168.1.59:3003/v1/settings/updatemqtt
    if (rt) {
      var result: any = {
        statusCode: 200,
        code: 200,
        schedule_id: schedule_id,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /********updateschedulestatus**********/
  @HttpCode(200)
  @ApiOperation({ summary: 'update schedule status' })
  @Post('updatescheduledaystatus')
  async update_schedule_day_status(
    @Res() res: Response,
    @Body() dto: any,
    @Req() req: any,
  ) {
    try {
      // ตรวจสอบ token
      const token = req.headers.authorization?.replace('Bearer ', '').trim();
      if (!token) {
        return res.status(401).json({
          statusCode: 401,
          code: 401,
          message: 'Unauthorized',
          message_th: 'ไม่ได้รับอนุญาต',
        });
      }
      const schedule_id: number = dto.schedule_id;
      if (!schedule_id) {
        return res.status(200).json({
          statusCode: 200,
          code: 404,
          payload: dto,
          message: 'schedule_id is null.',
          message_th: 'ไม่พบข้อมูล schedule_id.',
        });
      }
      // ตรวจสอบว่า schedule มีอยู่จริงหรือไม่
      const rsbucket: any = await this.settingsService.get_schedule(
        schedule_id,
      );
      if (!rsbucket || rsbucket.length == 0) {
        return res.status(200).json({
          statusCode: 200,
          code: 404,
          payload: dto,
          message: `ไม่พบ schedule_id ${schedule_id}`,
          message_th: `ไม่พบ schedule_id ${schedule_id}`,
        });
      }

      // เตรียมข้อมูลที่จะอัปเดต
      const days = [
        'event',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'status',
      ];
      const DataUpdate: any = {};
      for (const day of days) {
        if (dto[day] !== undefined && dto[day] !== '') {
          DataUpdate[day] = dto[day];
        }
      }
      if (Object.keys(DataUpdate).length == 0) {
        return res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: dto,
          message: 'No valid fields to update.',
          message_th: 'ไม่มีข้อมูลที่ต้องอัปเดต',
        });
      }

      // อัปเดต schedule
      const rt: any = await this.settingsService.update_schedule_status_day(
        schedule_id,
        DataUpdate,
      );

      if (rt) {
        return res.status(200).json({
          statusCode: 200,
          code: 200,
          schedule_id,
          payload: DataUpdate,
          rt,
          message: 'Update successful.',
          message_th: 'อัปเดตสำเร็จ.',
        });
      } else {
        return res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: DataUpdate,
          rt,
          message: 'Update Unsuccessful',
          message_th: 'อัปเดตไม่สำเร็จ',
        });
      }
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        message: 'Internal Server Error',
        message_th: 'เกิดข้อผิดพลาดภายในระบบ',
        error: err.message,
      });
    }
  }
  /********update_Api**********/
  /************************delete*************************/
  /***************delete_setting******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_setting' })
  @Get('deletesetting')
  async delete_setting(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var setting_id: any = query.setting_id;
    res.status(200).json({
      statusCode: 200,
      code: 422,
      payload: setting_id,
      message: 'setting_id is null.',
      message_th: 'ไม่พบข้อมูล.',
    });
    return;

    if (!setting_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: setting_id,
        message: 'setting_id is null.',
        message_th: 'setting_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_setting(setting_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'setting_id is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_setting(setting_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          setting_id: setting_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          setting_id: setting_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Delete('deletesetting')
  async delete_setting_del(
    @Res() res: Response,
    @Query('setting_id') setting_id: string, // หรือ @Param('setting_id') ถ้าใช้ param
  ) {
    // แปลงค่าและตรวจสอบก่อน
    const id = Number(setting_id);
    if (!setting_id || isNaN(id) || id <= 0) {
      res.status(400).json({
        statusCode: 400,
        code: 400,
        payload: null,
        message: 'Invalid or missing setting_id',
        message_th: 'setting_id ไม่ถูกต้องหรือไม่ได้ส่งค่า',
      });
      return;
    }

    try {
      const result = await this.settingsService.delete_setting(id);
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: result,
        message: 'Delete setting success',
        message_th: 'ลบข้อมูลสำเร็จ',
      });
    } catch (e) {
      res.status(422).json({
        statusCode: 422,
        code: 422,
        payload: null,
        message: 'Delete setting failed',
        message_th: 'ลบข้อมูลไม่สำเร็จ',
      });
    }
  }
  /********update_telegram**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update_telegram' })
  @Post('updatetelegram')
  async update_telegram(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    var telegram_id: string = dto.telegram_id;
    if (!telegram_id) {
      var telegram_id: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: ' id ' + telegram_id + ' is null.',
        message_th: 'ไม่พบข้อมูล  id ' + telegram_id + '.',
      };
      res.status(200).json(result);
    }
    let DataUpdate: any = {};
    DataUpdate.telegram_id = telegram_id;
    if (dto.telegram_name) {
      DataUpdate.telegram_name = dto.telegram_name;
    }
    if (dto.host) {
      DataUpdate.host = dto.host;
    }
    if (dto.port) {
      DataUpdate.port = dto.port;
    }
    if (dto.username) {
      DataUpdate.username = dto.username;
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    var rt: any = await this.settingsService.update_telegram(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Update successful.',
        message_th: 'อัปเดต  สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Update Unsuccessful',
        message_th: 'อัปเดต ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }
  /***************delete_location******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_location' })
  @Get('deletelocation')
  async delete_location(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    var location_id: any = query.location_id;
    if (!location_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: location_id,
        message: 'location_id is null.',
        message_th: 'location_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_location(location_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_location(location_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          location_id: location_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          location_id: location_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete_type******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_type' })
  @Get('deletetype')
  async delete_type(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //console.info("jsonString=>"+jsonString)
    //var idxs:number=   parseInt( dto.idx);
    var type_id: any = query.type_id;
    if (!type_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: type_id,
        message: 'type_id is null.',
        message_th: 'type_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_type(type_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_type(type_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          type_id: type_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          type_id: type_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete_device_type******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_device_type' })
  @Get('deletedevicetype')
  async delete_device_type(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //console.info("jsonString=>"+jsonString)
    //var idxs:number=   parseInt( dto.idx);
    var type_id: any = query.type_id;
    if (!type_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: type_id,
        message: 'type_id is null.',
        message_th: 'type_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_type(type_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_device_type(type_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          type_id: type_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          type_id: type_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete_sensor******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_sensor' })
  @Get('deletesensor')
  async delete_sensor(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //console.info("jsonString=>"+jsonString)
    //var idxs:number=   parseInt( dto.idx);
    var sensor_id: any = query.sensor_id;
    if (!sensor_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: sensor_id,
        message: 'sensor_id is null.',
        message_th: 'sensor_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_sensor(sensor_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_sensor(sensor_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          sensor_id: sensor_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          sensor_id: sensor_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete_group******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_group' })
  @Get('deletegroup')
  async delete_group(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var group_id: any = query.group_id;
    if (!group_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: group_id,
        message: 'group_id is null.',
        message_th: 'group_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_group(group_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_group(group_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          group_id: group_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          group_id: group_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete_mqtt******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_mqtt' })
  @Get('deletemqtt')
  async delete_mqtt(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var mqtt_id: any = query.mqtt_id;
    if (!mqtt_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: mqtt_id,
        message: 'mqtt_id is null.',
        message_th: 'mqtt_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_mqtt(mqtt_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_mqtt(mqtt_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          mqtt_id: mqtt_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          mqtt_id: mqtt_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Api**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_api' })
  @Get('deleteapi')
  async delete_api(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var api_id: any = query.api_id;
    if (!api_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: api_id,
        message: 'api_id is null.',
        message_th: 'api_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_api(api_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_api(api_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          api_id: api_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          api_id: api_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Device**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_device' })
  @Get('deletedevice')
  async delete_device(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //console.info("jsonString=>"+jsonString)
    //var idxs:number=   parseInt( dto.idx);
    var device_id: any = query.device_id;
    if (!device_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: device_id,
        message: 'device_id is null.',
        message_th: 'device_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_device(device_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_device(device_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          device_id: device_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          device_id: device_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_email' })
  @Get('deleteemail')
  async delete_email(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var email_id: any = query.email_id;
    if (!email_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: email_id,
        message: 'email_id is null.',
        message_th: 'email_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_email(email_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_email(email_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          email_id: email_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          email_id: email_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Email**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'deletemqtthost' })
  @Get('deletemqtthost')
  async delete_emqtthost(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var id: any = query.id;
    if (!id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: id,
        message: 'id is null.',
        message_th: 'id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_mqtthost_id(id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'id is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_mqtthost(id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          id: id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          id: id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Host**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_host' })
  @Get('deletehost')
  async delete_host(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var host_id: any = query.host_id;
    if (!host_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: host_id,
        message: 'host_id is null.',
        message_th: 'host_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_host(host_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_host(host_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          host_id: host_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          host_id: host_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Influxdb**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_influxdb' })
  @Get('deleteinfluxdb')
  async delete_influxdb(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //var idxs:number=   parseInt( dto.idx);
    var influxdb_id: any = query.influxdb_id;
    if (!influxdb_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: influxdb_id,
        message: 'influxdb_id is null.',
        message_th: 'influxdb_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      var Rs: any = await this.settingsService.get_influxdb(influxdb_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_influxdb(influxdb_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          influxdb_id: influxdb_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          influxdb_id: influxdb_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Line**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_line' })
  @Get('deleteline')
  async delete_line(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //const idxs:number=   parseInt( dto.idx);
    var line_id: any = query.line_id;
    if (!line_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: line_id,
        message: 'line_id is null.',
        message_th: 'line_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_line(line_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_line(line_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          line_id: line_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          line_id: line_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Nodered**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_nodered' })
  @Get('deletenodered')
  async delete_nodered(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    //const idxs:number=   parseInt( dto.idx);
    var nodered_id: any = query.nodered_id;
    if (!nodered_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: nodered_id,
        message: 'nodered_id is null.',
        message_th: 'nodered_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_nodered(nodered_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_nodered(nodered_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          nodered_id: nodered_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          nodered_id: nodered_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Schedule**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_schedule' })
  @Get('deleteschedule')
  async delete_schedule(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var schedule_id: any = query.schedule_id;
    if (!schedule_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: schedule_id,
        message: 'schedule_id is null.',
        message_th: 'schedule_id ไม่พบข้อมูล.',
      });
      return;
    }
    const schedule = await this.settingsService.get_schedule(schedule_id);
    if (!schedule) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Schedule not found.',
        message_th: 'ไม่พบข้อมูล Schedule',
      });
    }
    if (schedule) {
      await this.settingsService.delete_schedule(schedule_id);
      res.status(200).json({
        statusCode: 200,
        code: 200,
        schedule_id: schedule_id,
        payload: null,
        message: 'Deleted complete.',
        message_th: 'ลบออกเรียบร้อยแล้ว',
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        schedule_id: schedule_id,
        payload: null,
        message: 'Not in database.',
        message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
      });
    }
  }
  /********delete_Sms**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_sms' })
  @Get('deletesms')
  async delete_sms(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var sms_id: any = query.sms_id;
    if (!sms_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: sms_id,
        message: 'sms_id is null.',
        message_th: 'sms_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_sms(sms_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_sms(sms_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          sms_id: sms_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          sms_id: sms_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /********delete_Token**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_token' })
  @Get('deletetoken')
  async delete_token(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var token_id: any = query.token_id;
    if (!token_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: token_id,
        message: 'token_id is null.',
        message_th: 'token_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_token(token_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.delete_token(token_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          token_id: token_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          token_id: token_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete device schedule******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_device_schedule_id' })
  @Get('deletedeviceschedule')
  async delete_device_schedule_id(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var schedule_id: any = query.schedule_id;
    if (!schedule_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: schedule_id,
        message: 'schedule_id is null.',
        message_th: 'schedule_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_ScscheduleId(schedule_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        await this.settingsService.removeScscheduleId(schedule_id);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          schedule_id: schedule_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          location_id: schedule_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete device schedule******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_deviceandschedule' })
  @Get('deletedeviceandschedule')
  async delete_device_and_schedule(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('query');
    // console.info(query);
    var device_id: any = query.device_id;
    if (!device_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: device_id,
        message: 'device_id is null.',
        message_th: 'device_id ไม่พบข้อมูล.',
      });
      return;
    }
    var schedule_id: any = query.schedule_id;
    if (!schedule_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: schedule_id,
        message: 'schedule_id is null.',
        message_th: 'schedule_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_ScscheduleId(schedule_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        let filter: any = {};
        filter.schedule_id = query.schedule_id;
        filter.device_id = query.device_id;
        await this.settingsService.removeScdeviceId(filter);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          schedule_id: schedule_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          location_id: schedule_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************delete telegram******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_telegram' })
  @Get('deletetelegram')
  async delete_telegram(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('query');
    // console.info(query);
    var telegram_id: any = query.telegram_id;
    if (!telegram_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: telegram_id,
        message: 'telegram_id is null.',
        message_th: 'telegram_id ไม่พบข้อมูล.',
      });
      return;
    }
    var schedule_id: any = query.schedule_id;
    if (!schedule_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: schedule_id,
        message: 'schedule_id is null.',
        message_th: 'schedule_id ไม่พบข้อมูล.',
      });
      return;
    } else {
      const Rs: any = await this.settingsService.get_telegram(schedule_id);
      if (!Rs) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if (Rs) {
        let filter: any = {};
        filter.telegram_id = query.telegram_id;
        await this.settingsService.delete_telegram(filter);
        res.status(200).json({
          statusCode: 200,
          code: 200,
          schedule_id: schedule_id,
          payload: null,
          message: 'Deleted complete.',
          message_th: 'ลบออกเรียบร้อยแล้ว',
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          code: 400,
          location_id: schedule_id,
          payload: null,
          message: 'Not in database.',
          message_th: 'ไม่มีข้อมูลอยู่ในฐานข้อมูล',
        });
      }
    }
  }
  /***************#################*****************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listdevicescheduledata')
  @ApiOperation({ summary: 'list device page active' })
  async listdevicescheduledata(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any =
      await this.settingsService.device_list_paginate_all_filter(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };

    var ResultData: any =
      await this.settingsService.device_list_paginate_all_filter(filter2);
    /*
      var tempData2 = [];
          for (var va of ResultData) {
            var mqtt_data_value = va.mqtt_data_value;
            var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
            var mqtt_data = mqttrs['data'];
            var mqtt_timestamp = mqttrs['timestamp'];
            var timestamp = mqttrs['timestamp'];
            var configdata = va.configdata;
            let obj:any=[];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }

            var mqtt_objt_data = Object.values(obj);
            var result_mqtt = Object.fromEntries(mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]));

           // ใช้ mapMqttDataToDeviceV2 เพื่อ map ค่า value_data, value_alarm, value_relay, value_control_relay
            var merged = format.mapMqttDataToDeviceV2([va], result_mqtt)[0];
            tempData2.push({
              ...va,
              ...merged,
              result_mqtt,
              timestamp,
            });
          }
      */

    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*********###############alarmdevicepaginate#################**********/
  /***************delete telegram******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_armdevice' })
  @Get('deletearmdevice')
  async delete_armdevice(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('query');
    // console.info(query);
    var alarm_action_id: any = query.alarm_action_id;
    if (!alarm_action_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: alarm_action_id,
        message: 'alarm_action_id is null.',
        message_th: 'alarm_action_id ไม่พบข้อมูล.',
      });
      return;
    }
    let filter: any = {};
    filter.alarm_action_id = query.alarm_action_id;
    await this.settingsService.alarm_device_id_alarm_delete(filter);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      alarm_action_id: alarm_action_id,
      payload: null,
      message: 'Deleted complete.',
      message_th: 'ลบออกเรียบร้อยแล้ว',
    });
  }
  /******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'delete_armdevice' })
  @Get('deletearmdevicev2')
  async delete_armdevice_v2(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('query');
    // console.info(query);
    var alarm_action_id: any = query.alarm_action_id;
    if (!alarm_action_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: alarm_action_id,
        message: 'alarm_action_id is null.',
        message_th: 'alarm_action_id ไม่พบข้อมูล.',
      });
      return;
    }
    var device_id: any = query.device_id;
    if (!device_id) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: device_id,
        message: 'device_id is null.',
        message_th: 'device_id ไม่พบข้อมูล.',
      });
      return;
    }
    let filter: any = {};
    filter.alarm_action_id = query.alarm_action_id;
    await this.settingsService.alarm_device_id_alarm_delete(filter);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      alarm_action_id: alarm_action_id,
      device_id: device_id,
      payload: null,
      message: 'Deleted complete.',
      message_th: 'ลบออกเรียบร้อยแล้ว',
    });
  }
  /******************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createalarmDevice')
  async create_alarmDevice(
    @Res() res: Response,
    @Body() DataDto: alarmactionDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    await this.settingsService.create_alarmdevice(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create devicealarmaction successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  /******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update alarm device' })
  @Post('updatealarmdevice')
  async update_alarm_device(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    let DataUpdate: any = {};
    DataUpdate.alarm_action_id = dto.alarm_action_id;
    const valdata = [
      'action_name',
      'status_warning',
      'recovery_warning',
      'status_alert',
      'recovery_alert',
      'email_alarm',
      'line_alarm',
      'telegram_alarm',
      'sms_alarm',
      'nonc_alarm',
      'time_life',
      'event',
      'status',
    ];
    for (const da of valdata) {
      if (dto[da] !== undefined && dto[da] !== '') {
        DataUpdate[da] = dto[da];
      }
    }
    if (Object.keys(DataUpdate).length == 0) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: dto,
        message: 'No valid fields to update.',
        message_th: 'ไม่มีข้อมูลที่ต้องอัปเดต',
      });
    }
    const rt: any = await this.settingsService.update_alarm_device_status_val(
      dto.alarm_action_id,
      DataUpdate,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataUpdate,
      message: 'Update devicealarmaction successfully..',
      message_th: 'แก้ไข ข้อมูลสำเร็จ..',
    });
    return;
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listalarmdevicepage')
  @ApiOperation({ summary: 'list alarm device page all' })
  async list_alarm_device_page(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var alarm_action_id = query.alarm_action_id || '';
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      hardware_id: query.hardware_id || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    /*
        get_data_schedule_device
        create_schedule_device
        delete_schedule_device
    */
    if (
      alarm_action_id == '' ||
      alarm_action_id == 'undefined' ||
      alarm_action_id == undefined
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'alarm_action_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id',
      });
      return;
    }
    var eventResultData: any = await this.settingsService.get_alarm_device_map(
      alarm_action_id,
    );
    var rowResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      alarm_action_id: alarm_action_id,
      pageSize: 1,
      page: 1,
    };
    var alarmData: any = await this.settingsService.device_alarm_list_paginate(
      schedule_filter,
    );
    var ResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter2);
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;
      var filter_as = {
        alarm_action_id,
        device_id,
      };
      var count_alarm_device: any =
        await this.settingsService.alarm_device_id_alarm_count(filter_as);
      if (count_alarm_device >= 1) {
        var alarm_status = 1;
      } else {
        var alarm_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        alarm_action_id: alarm_action_id,
        alarm_status: alarm_status,
        count_alarm_device: count_alarm_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        action_name: alarmData['0'].action_name,
        event: alarmData['0'].event,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        alarmData: alarmData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listalarmeventdevicepage')
  @ApiOperation({ summary: 'list alarm event device page all' })
  async list_alarm_event_device_page(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var alarm_action_id = query.alarm_action_id || '';
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    if (
      alarm_action_id == '' ||
      alarm_action_id == 'undefined' ||
      alarm_action_id == undefined
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'alarm_action_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id',
      });
      return;
    }
    var eventResultData: any =
      await this.settingsService.get_alarm_device_event_map(alarm_action_id);
    var rowResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      alarm_action_id: alarm_action_id,
      pageSize: 1,
      page: 1,
    };
    var alarmData: any = await this.settingsService.device_alarm_list_paginate(
      schedule_filter,
    );
    var ResultData: any =
      await this.settingsService.device_list_paginate_all_active(filter2);
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;

      var filter_as = {
        isCount: 1,
        alarm_action_id,
        device_id,
      };
      var count_alarm_event_device: any =
        await this.settingsService.alarm_device_id_event_count(filter_as);
      if (count_alarm_event_device >= 1) {
        var alarm_event_status = 1;
      } else {
        var alarm_event_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        alarm_action_id: alarm_action_id,
        alarm_event_status: alarm_event_status,
        count_alarm_event_device: count_alarm_event_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        action_name: alarmData['0'].action_name,
        event: alarmData['0'].event,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        alarmData: alarmData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('listalarmeventdevicecontrolpage')
  @ApiOperation({ summary: 'list alarm event device page all' })
  async listalarmeventdevicecontrolpage(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var alarm_action_id = query.alarm_action_id || '';
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';

    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    /*
        get_data_schedule_device
        create_schedule_device
        delete_schedule_device
    */
    if (
      alarm_action_id == '' ||
      alarm_action_id == 'undefined' ||
      alarm_action_id == undefined
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'alarm_action_id is null.',
        message_th: 'ไม่พบข้อมูล schedule_id',
      });
      return;
    }
    var eventResultData: any =
      await this.settingsService.get_alarm_device_event_map(alarm_action_id);
    var rowResultData: any =
      await this.settingsService.device_list_paginate_all_active_control(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      alarm_action_id: alarm_action_id,
      pageSize: 1,
      page: 1,
    };
    var alarmData: any = await this.settingsService.device_alarm_list_paginate(
      schedule_filter,
    );
    var ResultData: any =
      await this.settingsService.device_list_paginate_all_active_control(filter2);
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;

      var filter_as = {
        isCount: 1,
        alarm_action_id,
        device_id,
      };
      var count_alarm_event_device: any =
        await this.settingsService.alarm_device_id_event_count(filter_as);
      if (count_alarm_event_device >= 1) {
        var alarm_event_status = 1;
      } else {
        var alarm_event_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        alarm_action_id: alarm_action_id,
        alarm_event_status: alarm_event_status,
        count_alarm_event_device: count_alarm_event_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        action_name: alarmData['0'].action_name,
        event: alarmData['0'].event,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        alarmData: alarmData,
      },
      message: 'list alarmevent device control page.',
      message_th: 'list alarmevent device control page.',
    });
  }
  /*********device_list_paginate_alarm_active**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('activealarmdevicepage')
  @ApiOperation({ summary: 'list alarm event device page all' })
  async device_list_paginate_alarm_active(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var alarm_action_id = query.alarm_action_id || '';
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';
    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    var rowResultData: any =
      await this.settingsService.device_list_paginate_alarm_active(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      alarm_action_id: alarm_action_id,
      pageSize: 1,
      page: 1,
    };
    var alarmData: any = await this.settingsService.device_alarm_list_paginate(
      schedule_filter,
    );
    var ResultData: any =
      await this.settingsService.device_list_paginate_alarm_active(filter2);
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;

      var filter_as = {
        isCount: 1,
        alarm_action_id,
        device_id,
      };
      var count_alarm_event_device: any =
        await this.settingsService.alarm_device_id_event_count(filter_as);
      if (count_alarm_event_device >= 1) {
        var alarm_event_status = 1;
      } else {
        var alarm_event_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        alarm_action_id: alarm_action_id,
        alarm_event_status: alarm_event_status,
        count_alarm_event_device: count_alarm_event_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        action_name: alarmData['0'].action_name,
        event: alarmData['0'].event,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        alarmData: alarmData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*********device_list_paginate_alarm_active**********/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('activealarmeventdeviceeventpage')
  @ApiOperation({ summary: 'list alarm event device page all' })
  async device_event_list_paginate_alarm_active(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var alarm_action_id = query.alarm_action_id || '';
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 1000;
    var sort = query.sort;
    var keyword = query.keyword || '';
    // สร้าง filter สำหรับนับจำนวนข้อมูล
    var filter = {
      sort,
      device_id,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    var rowResultData: any =
      await this.settingsService.device_event_list_paginate_alarm_active(
        filter,
      );
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var schedule_filter: any = {
      alarm_action_id: alarm_action_id,
      pageSize: 1,
      page: 1,
    };
    var alarmData: any = await this.settingsService.device_alarm_list_paginate(
      schedule_filter,
    );
    var ResultData: any =
      await this.settingsService.device_event_list_paginate_alarm_active(
        filter2,
      );
    var tempData2 = [];
    for (var va of ResultData) {
      /***************/
      var device_id = va.device_id;
      var mqtt_id = va.mqtt_id;
      var setting_id = va.setting_id;
      var type_id = va.type_id;
      var device_name = va.device_name;
      var sn = va.sn;
      var hardware_id = va.hardware_id;
      var status_warning = va.status_warning;
      var recovery_warning = va.recovery_warning;
      var status_alert = va.status_alert;
      var recovery_alert = va.recovery_alert;
      var time_life = va.time_life;
      var work_status = va.work_status;
      var max = va.max;
      var min = va.min;
      var oid = va.oid;
      var mqtt_data_value = va.mqtt_data_value;
      var mqtt_data_control = va.mqtt_data_control;
      var model = va.model;
      var vendor = va.vendor;
      var comparevalue = va.comparevalue;
      var status = va.status;
      var mqtt_control_on = va.mqtt_control_on;
      var mqtt_control_off = va.mqtt_control_off;
      var device_org = va.device_org;
      var device_bucket = va.device_bucket;
      var type_name = va.type_name;
      var location_name = va.location_name;
      var configdata = va.configdata;
      var mqtt_name = va.mqtt_name;
      var mqtt_org = va.mqtt_org;
      var mqtt_bucket = va.mqtt_bucket;
      var mqtt_envavorment = va.mqtt_envavorment;
      var mqtt_host = va.mqtt_host;
      var mqtt_port = va.mqtt_port;
      var timestamp = va.timestamp;
      var mqtt_device_name = va.mqtt_device_name;
      var mqtt_status_over_name = va.mqtt_status_over_name;
      var mqtt_status_data_name = va.mqtt_status_data_name;
      var mqtt_act_relay_name = va.mqtt_act_relay_name;
      var mqtt_control_relay_name = va.mqtt_control_relay_name;

      var filter_as = {
        isCount: 1,
        alarm_action_id,
        device_id,
      };
      var count_alarm_event_device: any =
        await this.settingsService.alarm_device_id_event_count(filter_as);
      if (count_alarm_event_device >= 1) {
        var alarm_event_status = 1;
      } else {
        var alarm_event_status = 0;
      }
      const arraydata: any = {
        device_id: device_id,
        alarm_action_id: alarm_action_id,
        alarm_event_status: alarm_event_status,
        count_alarm_event_device: count_alarm_event_device,
        mqtt_id: mqtt_id,
        setting_id: setting_id,
        type_id: type_id,
        device_name: device_name,
        action_name: alarmData['0'].action_name,
        event: alarmData['0'].event,
        sn: sn,
        hardware_id: hardware_id,
        status_warning: status_warning,
        recovery_warning: recovery_warning,
        status_alert: status_alert,
        recovery_alert: recovery_alert,
        time_life: time_life,
        work_status: work_status,
        max: max,
        min: min,
        oid: oid,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        model: model,
        vendor: vendor,
        comparevalue: comparevalue,
        status: status,
        mqtt_control_on: mqtt_control_on,
        mqtt_control_off: mqtt_control_off,
        device_org: device_org,
        device_bucket: device_bucket,
        type_name: type_name,
        location_name: location_name,
        configdata: configdata,
        mqtt_name: mqtt_name,
        mqtt_org: mqtt_org,
        mqtt_bucket: mqtt_bucket,
        mqtt_envavorment: mqtt_envavorment,
        mqtt_host: mqtt_host,
        mqtt_port: mqtt_port,
        timestamp: timestamp,
        mqtt_device_name: mqtt_device_name,
        mqtt_status_over_name: mqtt_status_over_name,
        mqtt_status_data_name: mqtt_status_data_name,
        mqtt_act_relay_name: mqtt_act_relay_name,
        mqtt_control_relay_name: mqtt_control_relay_name,
      };
      tempData2.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: tempData2,
        alarmData: alarmData,
      },
      message: 'list device success.',
      message_th: 'lists device success.',
    });
  }
  /*******************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('createalarmdevice')
  async create_alarm_device(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const alarm_action_id: number = Number(query.alarm_action_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`alarm_action_id =>` + alarm_action_id);
    console.info(alarm_action_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!alarm_action_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is alarm_action_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id,
    };
    await this.settingsService.create_alarm_device_map(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Alarm device created successfully.',
      message_th: 'สร้าง Alarm device สำเร็จ.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('deletealarmdevice')
  async delete_alarm__devices(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const alarm_action_id: number = Number(query.alarm_action_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`alarm_action_id =>` + alarm_action_id);
    console.info(alarm_action_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!alarm_action_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is alarm_action_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id,
    };
    await this.settingsService.delete_alarm_device_map(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Alarm device delete successfully.',
      message_th: 'ลบ Scheduled สำเร็จแล้ว.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('createalarmeventdevice')
  async create_alarm_event_device(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const alarm_action_id: number = Number(query.alarm_action_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`alarm_action_id =>` + alarm_action_id);
    console.info(alarm_action_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!alarm_action_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is alarm_action_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id,
    };
    await this.settingsService.create_alarm_device_event_map(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Alarm device created successfully.',
      message_th: 'สร้าง Scheduled สำเร็จ.',
    });
  }
  /*********************************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list group' })
  @Get('deletealarmeventdevice')
  async delete_alarm_event_devices(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const alarm_action_id: number = Number(query.alarm_action_id) || 1;
    const device_id: number = Number(query.device_id) || 1;
    console.log(`alarm_action_id =>` + alarm_action_id);
    console.info(alarm_action_id);
    console.log(`device_id =>` + device_id);
    console.info(device_id);
    if (!alarm_action_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is alarm_action_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    if (!device_id) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is device_id null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var dtost: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id,
    };
    await this.settingsService.delete_alarm_device_event_map(dtost);
    //////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: null,
      message: 'Alarm device event delete successfully.',
      message_th: 'ลบ Alarm device event สำเร็จแล้ว.',
    });
  }

  /***********scheduleprocess start**********************/
   // http://172.25.99.10:3003/v1/mqtt3/scheduleproces
   @HttpCode(200)
   @Get('scheduleproces')
   @ApiOperation({ summary: 'schedule process' })
   async scheduleproces(
     @Res() res: Response,
     @Query() query: any,
     @Headers() headers: any,
     @Param() params: any,
     @Req() req: any,
   ): Promise<any> {
     try {
       var today: any = format.getDayname();
       var getDaynameall: any = format.getDaynameall();
       const now = new Date();
       const pad = (num) => String(num).padStart(2, '0');
       const datePart = [
         now.getFullYear(),
         pad(now.getMonth() + 1),
         pad(now.getDate()),
       ].join('-');
       const timePart = [
         pad(now.getHours()),
         pad(now.getMinutes()),
         pad(now.getSeconds()),
       ].join(':');
       var timestamp = datePart + ' ' + timePart;
       var device_status: any = 0;
       var ResultDatasendEmail: any = [];
       var useractive_arr: any = [];
       var filter_useractive: any = { status: 1 };
       var useractive: any = await this.UsersService.useractiveemail(
         filter_useractive,
       );
       var user_arr: any = [];
       var device_id = query.device_id || '';
       var schedule_id = query.schedule_id || '';
       var page = Number(query.page) || 1;
       var pageSize = Number(query.pageSize) || 100000000000;
       var sort = query.sort;
       var keyword = query.keyword || '';
       var devicecontrol: any = '';
      if (!query.host_name) {
        var host_name: any = connectUrl_mqtt;
      }else{
        var host_name: any = query.host_name;
      }
       var cases: any = 0; 
       var filter :any= []; 
         filter.host_name=host_name;
         filter.sort=sort;
         filter.device_id=device_id;
         filter.schedule_id=schedule_id;
         filter.page=page;
         filter.pageSize=pageSize; 
         filter.sort=sort;  
         filter.keyword=keyword; 
         filter.devicecontrol=devicecontrol;
         filter.type_id=query.type_id;
         filter.org=query.org;
         filter.bucket=query.org; 
         filter.type_name=query.type_name;
         filter.host=query.host;
         filter.port=query.port; 
         filter.password=query.query;
         filter.createddate=query.createddate;
         filter.updateddate=query.updateddate;
         filter.status=query.status || 1;
         filter.ipaddress=query.ipaddress;
         filter.location_id=query.location_id;
         filter.isCount=1; 
       var rowResultData: any = await this.settingsService.scheduleprocess(filter);
       if (
         rowResultData == '' ||
         !rowResultData ||
         rowResultData.status == '422'
       ) {
         res.status(200).json({
           statuscode: 200,
           host_name,
           payload: filter,
           message: 'Data schedule proces is null.',
           message_th: 'ไม่พบข้อมูล schedule proces.',
         });
         return;
       }
 
       var rowData = Number(rowResultData);
       var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
       var filter2 = {
         ...filter,
         isCount: 0,
         page,
         pageSize,
       };
 
       var today_name: any = '';
       var now_time: any = format.getCurrentTime();
       var now_time_cal: any = 3;
       var start_time: any = '';
       var end_time: any = '';
       var do_ststus: any = '';
       var ResultData: any = await this.settingsService.scheduleprocess(filter2);
       let tempData = [];
       let tempDataoid = [];
       let tempData2 = []; 
       for (const [key, va] of Object.entries(ResultData)) {
         const device_id: any = ResultData[key].device_id;
         var schedule_id: any = ResultData[key].schedule_id;
         var schedule_name: any = ResultData[key].schedule_name;
         var schedule_start: any = ResultData[key].schedule_event_start;
         var device_name: any = ResultData[key].device_name;
         var device_bucket: any = ResultData[key].device_bucket;
         var mqtt_bucket: any = ResultData[key].mqtt_bucket;
         var mqtt_name: any = ResultData[key].mqtt_name;
         var type_name: any = ResultData[key].type_name;
         var location_id: any = ResultData[key].location_id;
         var location_name: any = ResultData[key].location_name;
         var location_address: any = ResultData[key].location_address;
         var schedule_event_start: any = ResultData[key].schedule_event_start;
         var schedule_event: any = ResultData[key].schedule_event;
         var event: any = ResultData[key].schedule_event;
         var time_life: any = ResultData[key].time_life;
         var period: any = ResultData[key].period;
         var sunday: any = ResultData[key].sunday;
         var monday: any = ResultData[key].monday;
         var tuesday: any = ResultData[key].tuesday;
         var wednesday: any = ResultData[key].wednesday;
         var thursday: any = ResultData[key].thursday;
         var friday: any = ResultData[key].friday; 
         var saturday: any = ResultData[key].saturday;
         var mqtt_id: any = ResultData[key].mqtt_id;
         var setting_id: any = ResultData[key].setting_id;
         var type_id: any = ResultData[key].type_id;
         var mqtt_data_value: any = ResultData[key].mqtt_data_value;
         var mqtt_data_control: any = ResultData[key].mqtt_data_control;
         var mqtt_control_on: any = ResultData[key].mqtt_control_on;
         var mqtt_control_off: any = ResultData[key].mqtt_control_off;
         var status_warning: any = ResultData[key].status_warning;
         var recovery_warning: any = ResultData[key].recovery_warning;
         var status_alert: any = ResultData[key].status_alert;
         var recovery_alert: any = ResultData[key].recovery_alert;
         var work_status: any = ResultData[key].work_status;
         var max: any = ResultData[key].max;
         var min: any = ResultData[key].min;
         var measurement: any = ResultData[key].measurement;
         var device_org: any = ResultData[key].device_org;
         var mqtt_org: any = ResultData[key].mqtt_org;
         var mqtt_device_name: any = ResultData[key].mqtt_device_name;
         var mqtt_status_over_name: any = ResultData[key].mqtt_status_over_name;
         var mqtt_act_relay_name: any = ResultData[key].mqtt_act_relay_name;
         var mqtt_control_relay_name: any = ResultData[key].mqtt_control_relay_name;
         var mqtt_message: any = ResultData[key].mqtt_control_relay_name;
         var type_id: any = ResultData[key].type_id;
         var type_name: any = ResultData[key].type_name;
         var group_id: any = ResultData[key].group_id;
         var host_id: any = ResultData[key].host_id;
         var host_name: any = ResultData[key].host_name;  // connectUrl_mqtt
         var idhost: any = ResultData[key].idhost;  
         const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
         var today_name: any = format.getCurrentDayname();
         var now_time: any = format.getCurrentTime();
         if (today_name == 'sunday') {
           if (sunday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'monday') {
           if (monday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'tuesday') {
           if (tuesday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'wednesday') {
           if (wednesday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'thursday') {
           if (thursday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'friday') {
           if (friday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         } else if (today_name == 'saturday') {
           if (saturday == 1) {
             var today_status: any = 1;
           } else {
             var today_status: any = 0;
           }
         }
         if (event == 1) {
           var message_mqtt_control: any = mqtt_control_on;
           var message_control: any = 'ON';
           var device_1: any = 1;
         } else {
           var message_mqtt_control: any = mqtt_control_off;
           var message_control: any = 'OFF';
           var device_1: any = 0;
         }
         var now_time_s: any = timestamp;
         var control_url =
           process.env.API_URL +
           '/v1/mqtt3/control?topic=' +
           mqtt_data_control +
           '&message=' +
           message_mqtt_control;
         var today_name: any = format.getCurrentDayname();
         var now_time: any = format.getCurrentTime();
         var now_time_1: any = format.getCurrentTimeStatus(
           now_time,
           schedule_event_start,
         );
         var now_time_2: any = format.getCurrentTimeStatus(
           schedule_event_start,
           schedule_event_start,
         );
         var now_time_1_s: any = format.getCurrentTimeStatusMsg(
           now_time,
           schedule_event_start,
         );
         var now_time_2_s: any = format.getCurrentTimeStatusMsg(
           schedule_event_start,
           schedule_event_start,
         );
         var date_now = format.getCurrentDatenow();
         var time_now = format.getCurrentTimenow();
         //
         if (today_status == 1 && now_time_1 == now_time_2) {
           if (now_time_1 == '1' && now_time_2 == '1') {
             var dataset: any = {
               schedule_id: schedule_id,
               device_id: device_id,
               schedule_event_start: schedule_event_start,
               date: date_now,
               schedule_event: message_mqtt_control,
             };
 
             var log_count: any =
               await this.settingsService.scheduleprocesslog_count(dataset);
             if (log_count >= 1) {
               var log_count2: any =
                 await this.settingsService.scheduleprocesslog_count_status(
                   dataset,
                 );
 
               if (log_count2 == 0) {
                 var deviceData: any = await this.settingsService.getdevicedata(
                   mqtt_data_value,
                 );
                 if (deviceData) {
                   var devicecontrol: any =
                     await this.settingsService.devicecontrol(
                       mqtt_data_control,
                       message_mqtt_control,
                     );
                   var now_time_s: any = timestamp;
 
                   var datasetupdate: any = {
                     schedule_id: schedule_id,
                     device_id: device_id,
                     schedule_event_start: schedule_event_start,
                     schedule_event: message_mqtt_control,
                     date: date_now,
                     time: time_now,
                     device_status: message_mqtt_control,
                     status: 1,
                     updateddate: Date(),
                   };
                   await this.settingsService.update_scheduleprocesslog_v2(
                     datasetupdate,
                   );
                 }
               }
             } else {
               var createset: any = {
                 schedule_id: schedule_id,
                 device_id: device_id,
                 schedule_event_start: schedule_event_start,
                 day: today_name,
                 doday: today_name,
                 dotime: now_time_s,
                 schedule_event: message_mqtt_control,
                 device_status: message_mqtt_control,
                 status: device_1,
                 date: date_now,
                 time: time_now,
                 createddate: Date(),
                 updateddate: Date(),
               };
               if (log_count == 0) {
                 var devicecontrol: any = await this.settingsService.devicecontrols(
                   mqtt_data_control,
                   message_mqtt_control,
                   message_control,
                 );
               }
               var now_time_s: any = timestamp;
 
               var deviceData: any = await this.settingsService.getdevicedata(
                 mqtt_data_value,
               );
               if (deviceData) {
                 if (log_count == 0) {
                   await this.settingsService.create_scheduleprocesslog(
                     createset,
                   );
                 }
 
                 // sendEmail scheduleproces
                 if (message_control == 'ON') {
                   var subject_event: any = 'On';
                 } else {
                   var subject_event: any = 'Off';
                 }
                 var subject: any =
                   'Schedule process ' +
                   schedule_name +
                   ' start ' +
                   schedule_event_start +
                   '  day ' +
                   today_name;
                 var content: any =
                   'Schedule process ' +
                   schedule_name +
                   ' start ' +
                   schedule_event_start +
                   '  day ' +
                   today_name +
                   '  event ' +
                   subject_event +
                   '  date ' +
                   date_now +
                   '  time ' +
                   time_now +
                   ' device_id: ' +
                   device_id;
                 var log_alarm_log: any = '';
                 if (log_count == 0) {
                   var emails: string[] = [];
                   for (const [k, v] of Object.entries(useractive)) {
                     var email: any = useractive[k].email;
                     emails.push(email);
                     var mobile_number: any = useractive[k].mobile_number;
                     var lineid: any = useractive[k].lineid;
                     var user_arr: any = {
                       email: email,
                       mobile: mobile_number,
                       lineid: lineid,
                     };
                     useractive_arr.push(user_arr);
                   }
                   await this.settingsService.sendEmail(
                     emails,
                     subject,
                     content,
                   );
                   var ResultDatasendEmail: any =
                     'sendEmail to ' + emails.join(', ');
                 }
                 // sendEmail
               }
             }
           }
         } else {
           const ts: any = {
             device_id: device_id,
             schedule_id: schedule_id,
           };
         }
         var event_control='OFF';
         if(event==1){
           var event_control='ON';
         }
         const ProfileRs: any = {
           device_id: device_id,
           schedule_id: schedule_id,
           schedule_name: schedule_name,
           host_name,
           location_address,
           idhost,
           location_id,
           location_name,
           //connectUrl_mqtt,
           start: schedule_start,
           event: event,
           schedule_event: schedule_event,
           event_control,
           sunday: sunday,
           monday: monday,
           tuesday: tuesday,
           wednesday: wednesday,
           thursday: thursday,
           friday: friday,
           saturday: saturday,
           device_name: device_name,
           today_name: today_name,
           now_time: now_time,
           schedule_event_start: schedule_event_start,
           today_status: today_status,
           now_time_1: now_time_1,
           now_time_2: now_time_2,
           date_now: date_now,
           time_now: time_now,
           mqtt_data_value,
           mqtt_data_control,
           mqtt_control_on,
           mqtt_control_off,
           createset,
           control_url,
           deviceData,
           dataset,
           log_count: log_count,
           devicecontrol: devicecontrol,
           case: cases,
           device_bucket,
           measurement,
           type_id,
           type_name,
           group_id,
           //host_id,
         }; 
         tempDataoid.push(device_id);
         tempData.push(va);
         tempData2.push(ProfileRs);
       }
 
       res.status(200).json({
         statusCode: 200,
         code: 200,
         filter:filter2,
         host_name,
         payload: {
           page,
           currentPage: page,
           pageSize,
           totalPages,
           total: rowData, 
           data: tempData2,
         },
         message: 'success',
         message_th: 'success',
       });
     } catch (error) {
       return res.status(500).json({
         statusCode: 500,
         code: 500,
         connectUrl_mqtt,
         payload: {},
         message: 'Internal server error 500',
         message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
         error: error.message || error,
       });
     }
   }
  /***********scheduleprocess end**********************/
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('scheduleprocesslog')
  @ApiOperation({ summary: 'schedule process' })
  async schedule_process_log_page(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000000000;
    var sort: any = query.sort;
    var keyword: any = query.keyword || '';
    var schedule_event_start: any = query.schedule_event_start || '';
    var day: any = query.day || '';
    var doday: any = query.doday || '';
    var dotime: any = query.dotime || '';
    var schedule_event: any = query.schedule_event || '';
    var device_status: any = query.device_status || '';
    var filter = {
      sort,
      device_id,
      schedule_id,
      schedule_event_start,
      day,
      doday,
      dotime,
      schedule_event,
      device_status,
      mqtt_id: query.mqtt_id || '',
      type_id: query.type_id || '',
      org: query.org || '',
      bucket: query.bucket || '',
      keyword,
      type_name: query.type_name || '',
      host: query.host || '',
      port: query.port || '',
      password: query.password || '',
      createddate: query.date || '',
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any =
      await this.settingsService.scheduleprocesslog_paginate(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any =
      await this.settingsService.scheduleprocesslog_paginate(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /************create_setting***************/
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createdevicealarmaction')
  async create_devicealarmaction(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: alarmactionDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_devicealarmaction_chk(
      DataDto.action_name,
    );
    if (Rs) {
      console.log('dto.sn=>' + DataDto.action_name);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { sn: DataDto.action_name },
        message: 'The SN  duplicate this data cannot createddate.',
        message_th:
          'ข้อมูล SN ' + DataDto.action_name + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_devicealarmaction(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create device alarm action successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  @HttpCode(201)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('createalarmdevicepaginate')
  async create_alarmdevicepaginate(
    @Res() res: Response,
    @Body() dto: any,
    @Body(new ValidationPipe()) DataDto: CreateSettingDto,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<string> {
    if (!DataDto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }
    const Rs: any = await this.settingsService.get_setting_sn(DataDto.sn);
    if (Rs) {
      console.log('dto.sn=>' + DataDto.sn);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { sn: DataDto.sn },
        message: 'The SN  duplicate this data cannot createddate.',
        message_th: 'ข้อมูล SN ' + DataDto.sn + ' ซ้ำไม่สามารถเพิ่มได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    }
    await this.settingsService.create_setting(DataDto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: DataDto,
      message: 'Create Data successfully..',
      message_th: 'เพิ่มข้อมูลสำเร็จ..',
    });
    return;
  }
  @HttpCode(200)
  //@AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'alarm device paginate' })
  @Get('alarmdevice')
  async alarm_device_paginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var alarm_action_id: any = query.alarm_action_id || '';
    var status: any = query.status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = query.sort;
    filter.keyword = keyword || '';
    filter.status = query.status || '';
    filter.alarm_action_id = alarm_action_id || '';
    filter.event = query.event || '';
    filter.isCount = 1;
    let rowResultData: any = await this.settingsService.alarm_device_paginate(
      filter,
    );
    if (!rowResultData || rowResultData.status == '422') {
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
    filter2.sort = query.sort;
    filter2.keyword = keyword || '';
    filter2.status = query.status || '';
    filter2.alarm_action_id = alarm_action_id || '';
    filter2.event = query.event || '';
    filter2.isCount = 0;
    filter2.page = page;
    filter2.pageSize = pageSize;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.settingsService.alarm_device_paginate(
      filter2,
    );
    let tempDataoid = [];
    for (const [key, va] of Object.entries(ResultData)) {
      var alarm_action_id: any = ResultData[key].alarm_action_id;
      var action_name: any = ResultData[key].action_name;
      var filter1: any = {};
      filter1.alarm_action_id = alarm_action_id;
      var count_device: any =
        await this.settingsService.alarm_device_id_alarm_count(filter1);
      var filter3: any = {};
      filter3.alarm_action_id = alarm_action_id;
      var count_device_event: any =
        await this.settingsService.alarm_device_id_event_count(filter3);
      var device_event: any = await this.settingsService.deviceeventmap(
        filter3,
      );
      // var device_event:any=[];
      const DataRs: any = {
        alarm_action_id: alarm_action_id,
        action_name: action_name,
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        email_alarm: ResultData[key].email_alarm,
        line_alarm: ResultData[key].line_alarm,
        telegram_alarm: ResultData[key].telegram_alarm,
        sms_alarm: ResultData[key].sms_alarm,
        nonc_alarm: ResultData[key].nonc_alarm,
        time_life: ResultData[key].time_life,
        event: ResultData[key].event,
        status: ResultData[key].status,
        count_device: count_device,
        count_device_event: count_device_event,
        device_event: device_event,
      };
      tempDataoid.push(DataRs);
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
        data: tempDataoid,
      },
      message: 'get data success.',
      message_th: 'get data success.',
    });
  }
  // updatealarmstatus
  @HttpCode(200)
  @ApiOperation({ summary: 'update alarm status' })
  @Post('updatealarmstatus')
  async updatealarmstatus(
    @Res() res: Response,
    @Body() dto: any,
    @Req() req: any,
  ) {
    try {
      // ตรวจสอบ token
      const token = req.headers.authorization?.replace('Bearer ', '').trim();
      if (!token) {
        return res.status(401).json({
          statusCode: 401,
          code: 401,
          message: 'Unauthorized',
          message_th: 'ไม่ได้รับอนุญาต',
        });
      }
      const alarm_action_id: number = dto.alarm_action_id;
      if (!alarm_action_id) {
        return res.status(200).json({
          statusCode: 200,
          code: 404,
          payload: dto,
          message: 'alarm_action_id is null.',
          message_th: 'ไม่พบข้อมูล alarm_action_id.',
        });
      }
      // ตรวจสอบว่า schedule มีอยู่จริงหรือไม่
      const rsbucket: any = await this.settingsService.get_alarm_device(
        alarm_action_id,
      );
      if (!rsbucket || rsbucket.length == 0) {
        return res.status(200).json({
          statusCode: 200,
          code: 404,
          payload: dto,
          message: `ไม่พบ alarm_action_id ${alarm_action_id}`,
          message_th: `ไม่พบ alarm_action_id ${alarm_action_id}`,
        });
      }

      // เตรียมข้อมูลที่จะอัปเดต
      const valdata = [
        'status_warning',
        'recovery_warning',
        'status_alert',
        'recovery_alert',
        'email_alarm',
        'line_alarm',
        'telegram_alarm',
        'sms_alarm',
        'nonc_alarm',
        'event',
        'status',
      ];
      const DataUpdate: any = {};
      for (const da of valdata) {
        if (dto[da] !== undefined && dto[da] !== '') {
          DataUpdate[da] = dto[da];
        }
      }
      if (Object.keys(DataUpdate).length == 0) {
        return res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: dto,
          message: 'No valid fields to update.',
          message_th: 'ไม่มีข้อมูลที่ต้องอัปเดต',
        });
      }
      // อัปเดต schedule
      const rt: any = await this.settingsService.update_alarm_device_status_val(
        alarm_action_id,
        DataUpdate,
      );
      if (rt) {
        return res.status(200).json({
          statusCode: 200,
          code: 200,
          alarm_action_id,
          payload: DataUpdate,
          rt,
          message: 'Update successful.',
          message_th: 'อัปเดตสำเร็จ.',
        });
      } else {
        return res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: DataUpdate,
          rt,
          message: 'Update Unsuccessful',
          message_th: 'อัปเดตไม่สำเร็จ',
        });
      }
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        message: 'Internal Server Error',
        message_th: 'เกิดข้อผิดพลาดภายในระบบ',
        error: err.message,
      });
    }
  }
  @HttpCode(200)
  @Get('scheduleprocesslogpaginate')
  @ApiOperation({ summary: 'schedule process log paginate' })
  async scheduleprocesslogpaginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var filter = {
      sort,
      type_id,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any =
      await this.settingsService.scheduleprocesslogpaginate(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.scheduleprocesslogpaginate(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  ////////////////
  @HttpCode(200)
  @Get('mqtterrorlogpaginate')
  @ApiOperation({ summary: 'mqtt error log paginate' })
  async mqtterrorlogpaginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any = await this.settingsService.mqttlogpaginate(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.mqttlogpaginate(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  ////////////////
  @HttpCode(200)
  @Get('alarmlogpaginate')
  @ApiOperation({ summary: 'alarm log paginate' })
  async alarmlogpaginate(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    /*
        if(type_id_log==1){
            var email_alarm:any=1;
          }else if(type_id_log==2){
            var line_alarm:any=1;
          }if(type_id_log==3){
            var telegram_alarm:any=1;
          }if(type_id_log==4){
            var sms_alarm:any=1;
          }if(type_id_log==5){
            var nonc_alarm:any=1;
          } 
    */
    var rowResultData: any = await this.settingsService.alarmlogpaginate(
      filter,
    );
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpaginate(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*****alarmlogpaginateemail****/
  @HttpCode(200)
  @Get('alarmlogpaginateemail')
  @ApiOperation({ summary: 'alarm log email paginate' })
  async alarmlogpaginateemail(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any = await this.settingsService.alarmlogpaginateemail(
      filter,
    );
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpaginateemail(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*****alarmlogpaginatecontrol****/
  @HttpCode(200)
  @Get('alarmlogpaginatecontrols')
  @ApiOperation({ summary: 'alarm log controls paginate' })
  async alarmlogpaginatecontrols(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any =
      await this.settingsService.alarmlogpaginateecontrol(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpaginateecontrol(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*****alarmlogpaginateline****/
  @HttpCode(200)
  @Get('alarmlogpaginateline')
  @ApiOperation({ summary: 'alarm log line paginate' })
  async alarmlogpaginateline(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any = await this.settingsService.alarmlogpagline(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpagline(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*****alarmlogpaginatesms****/
  @HttpCode(200)
  @Get('alarmlogpaginatesms')
  @ApiOperation({ summary: 'alarm log sms paginate' })
  async alarmlogpaginatesms(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any = await this.settingsService.alarmlogpagesms(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpagesms(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  /*****alarmlogpaginatetelegram****/
  @HttpCode(200)
  @Get('alarmlogpaginatetelegram')
  @ApiOperation({ summary: 'alarm log telegram paginate' })
  async alarmlogpaginatetelegram(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    var device_id: any = query.device_id || '';
    var schedule_id: any = query.schedule_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 10;
    var sort: any = query.sort;
    var status: any = query.status;
    var keyword: any = query.keyword || '';
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var type_id_log: any = query.type_id_log || '';
    var filter = {
      sort,
      type_id,
      type_id_log,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      schedule_id,
      status,
      isCount: 1,
    };
    var rowResultData: any =
      await this.settingsService.alarmlogpaginatetelegram(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any = await this.settingsService.alarmlogpaginatetelegram(
      filter2,
    );
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  @HttpCode(200)
  @Get('alarmlogpaginatecontrol')
  @ApiOperation({ summary: 'alarm log paginate' })
  async alarmlogpaginatecontrol(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 1000;
    var alarm_action_id: any = query.alarm_action_id || '';
    var status: any = query.status || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    var device_id: any = query.device_id || '';
    var sort: any = query.sort;
    var status: any = query.status;
    var type_id: any = query.type_id || '';
    var location_id: any = query.location_id || '';
    var event: any = query.event || '';
    var bucket: any = query.bucket || '';
    var start: any = query.start || '';
    var end: any = query.end || '';
    var filter = {
      sort,
      type_id,
      location_id,
      bucket,
      event,
      start,
      end,
      keyword,
      device_id,
      alarm_action_id,
      status,
      isCount: 1,
    };
    // นับจำนวนข้อมูลทั้งหมด
    var rowResultData: any =
      await this.settingsService.alarm_processlog_page_temp_control(filter);
    if (
      rowResultData == '' ||
      !rowResultData ||
      rowResultData.status == '422'
    ) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล',
      });
      return;
    }
    var rowData = Number(rowResultData);
    var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
    var filter2 = {
      ...filter,
      isCount: 0,
      page,
      pageSize,
    };
    var ResultData: any =
      await this.settingsService.alarm_processlog_page_temp_control(filter2);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        filter: filter2,
        data: ResultData,
      },
      message: 'ok',
      message_th: 'success',
    });
  }
  // ฟังก์ชันแยกสำหรับการจัดการข้อผิดพลาด MQTT
  async handleMqttError(deviceInfo) {
    const {
      alarm_action_id,
      device_id,
      type_id,
      event,
      alarm_type_id,
      status_warning,
      recovery_warning,
      status_alert,
      recovery_alert,
    } = deviceInfo;
    const inputCreate: any = {
      alarm_action_id,
      device_id,
      type_id,
      event,
      alarm_type: alarm_type_id,
      status_warning,
      recovery_warning,
      status_alert,
      recovery_alert,
      email_alarm: 0,
      line_alarm: 0,
      telegram_alarm: 0,
      sms_alarm: 0,
      nonc_alarm: 1,
      status: 0,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: 0,
      data_alarm: 0,
      createddate: new Date(),
      updateddate: new Date(),
      alarm_status: 0,
      subject: 'Mqtt Error Connect',
      content: 'Mqtt Error Connect',
    };
    const now_time_full: any = format.timeConvertermas(
      format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString),
    );
    const date_now: any = format.getCurrentDatenow();
    const setdatachk: any = {
      alarm_action_id,
      device_id,
      type_id,
      date: date_now,
    };
    const count_alarm: number = Number(
      await this.settingsService.count_alarmprocesslogmqtt(setdatachk),
    );
    if (count_alarm >= 3) {
      const setdata_chk_delete: any = {
        alarm_action_id,
        device_id,
        type_id: alarm_type_id,
        date_now: format.getCurrentDatenow(),
      };
      await this.settingsService.delete_alarmprocesslog_mqtt(
        setdata_chk_delete,
      );
    }
    const log_alarm_logs: any =
      await this.settingsService.chk_alarmprocesslogmqtt(setdatachk);
    let now_time_cal: number = 0;
    if (count_alarm >= 1) {
      const log_time = format.timeConvertermas(
        format.convertTZ(log_alarm_logs[0].createddate, process.env.tzString),
      );
      now_time_cal = Number(format.diffMinutes(now_time_full, log_time));
    }
    const time_lifes: number = 10;
    if (count_alarm == 0 && now_time_cal > time_lifes) {
      await this.settingsService.create_alarmprocesslogmqtt(inputCreate);
      await this.settingsService.create_alarmprocesslogtemp(inputCreate);
    }
  }
  /***********alarmdevice*************/
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqttalarm')
  async deviceactivemqttAlarm(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          await this.mqttService.create_mqttlogRepository(inputCreate);
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt',
            message_th: 'check Connection Status Mqtt',
          });
          return;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        await this.mqttService.create_mqttlogRepository(inputCreate);
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt',
          message_th: 'check Connection Status Mqtt',
        });
        return;
      }
      var deletecache: any = query.deletecache;
      var cachetimeset: any = 300;
      var filter: any = {};
      if (query.device_id) {
        filter.device_id = query.device_id;
      }
      if (query.keyword) {
        filter.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filter.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filter.bucket = query.bucket;
      }
      if (query.type_id) {
        filter.type_id = query.type_id;
      }
      //////////////////////
      var filter_md5: any = md5(
        query.device_id +
          query.keyword +
          query.mqtt_id +
          query.bucket +
          query.type_id,
      );
      var kaycache_cache: any = 'deviceactive_AL_mqtt_key_' + filter_md5;
      var ResultData: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (ResultData) {
        var ResultData: any = ResultData;
        var cache_data_ResultData: any = 'cache';
      } else if (!ResultData) {
        var ResultData: any = await this.settingsService.deviceactiveAl(filter);
        var rs: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: ResultData,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      var ResultDataRS: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
          var mqtt_id: any = rs.mqtt_id;
          var setting_id: any = rs.setting_id;
          var sn: any = rs.sn;
          var hardware_id: any = rs.hardware_id;
          var status_warning: any = rs.status_warning;
          var status_alert: any = rs.status_alert;
          var recovery_warning: any = rs.recovery_warning;
          var recovery_alert: any = rs.recovery_alert;
          var time_life: any = rs.time_life;
          var period: any = rs.period;
          var work_status: any = rs.work_status;
          var max: any = rs.max;
          var min: any = rs.min;
          var oid: any = rs.oid;
          var comparevalue: any = rs.comparevalue;
          var createddate: any = rs.createddate;
          var status: any = rs.status;
          var unit: any = rs.unit;
          var action_id: any = rs.action_id;
          var status_alert_id: any = rs.status_alert_id;
          var measurement: any = rs.measurement;
          var type_name: any = rs.type_name;
          var location_name: any = rs.location_name;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          var latitude: any = rs.latitude;
          var longitude: any = rs.longitude;
          var mqtt_device_name: any = rs.mqtt_device_name;
          var mqtt_status_over_name: any = rs.mqtt_status_over_name;
          var mqtt_status_data_name: any = rs.mqtt_status_data_name;
          var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
          var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
          var main_status_warning: any = rs.status_warning;
          var main_status_alert: any = rs.status_alert;
          var main_max: any = rs.max;
          var main_min: any = rs.min;
          var main_type_id: any = rs.type_id;
          var configdata = mqtt_status_data_name;
          const topic: any = encodeURI(mqtt_data_value);
          //const mqttrs: any = await this.mqttService.getDataTopic(topic);
          const mqttrs: any = await this.mqttService.getDataTopicCacheData(
            topic,
          );
          var alarmStatusSet: any = 999;
          if (mqttrs) {
            var mqttstatus: any = mqttrs.status;
            var mqttdata: any = mqttrs.msg;
            if (mqttstatus == 0) {
              var inputCreate: any = {
                name: device_bucket,
                statusmqtt: mqttstatus || 0,
                msg: 'Error',
                device_id: device_id,
                type_id: type_id,
                device_name: device_name,
                date: format.getCurrentDatenow(),
                time: format.getCurrentTimenow(),
                data: mqttdata,
                status: 1,
                createddate: new Date(),
              };
            }
            let obj: any = [];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }
            var mqtt_objt_data = Object.values(obj);
            let obj2: any = [];
            try {
              obj2 = JSON.parse(mqtt_status_data_name);
            } catch (e) {
              throw e;
            }
            var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
            var mqttdata_arr: any = mqttdata_arrs['data'];
            var mqtt_obj2_data = Object.values(obj2);
            var mqttData_count: any = mqttdata_arr.length;
            var mqttData = Object.fromEntries(
              mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
            );
            var merged_dataRs: any = format.mapMqttDataToDevices(
              [va],
              mqttData,
            );
            var merged_data: any = merged_dataRs[0];
            var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
            var merged: any = merged2['0'];
            if (merged) {
              var value_data: any = merged.value_data;
              var value_alarm: any = merged.value_alarm;
              var value_relay: any = merged.value_relay;
              var value_control_relay: any = merged.value_control_relay;
            } else {
              var value_data: any = '';
              var value_alarm: any = '';
              var value_relay: any = '';
              var value_control_relay: any = '';
            }
            var createddated: any = merged_data.createddate;
            var createddate: any = format.timeConvertermas(
              format.convertTZ(createddated, process.env.tzString),
            );
            var updateddated: any = merged_data.updateddate;
            var updateddate: any = format.timeConvertermas(
              format.convertTZ(updateddated, process.env.tzString),
            );
            var filter: any = {};
            filter.alarmTypeId = main_type_id;
            if (main_type_id == 1) {
              filter.sensorValueData = encodeURI(value_data); //sensor
              filter.status_warning = encodeURI(status_warning);
              filter.status_alert = encodeURI(status_alert);
              filter.recovery_warning = encodeURI(recovery_warning);
              filter.recovery_alert = encodeURI(recovery_alert);
              var data: any = value_data + ' ' + unit;
            } else {
              filter.sensorValueData = encodeURI(value_alarm); //IO
              filter.status_warning = parseInt('0');
              filter.status_alert = parseInt('0');
              filter.recovery_warning = parseInt('1');
              filter.recovery_alert = parseInt('1');
              var data: any = Number(value_alarm);
            }
            filter.mqtt_name = mqtt_name;
            filter.device_name = mqtt_device_name;
            filter.action_name = mqtt_name;
            filter.mqtt_control_on = encodeURI(mqtt_control_on);
            filter.mqtt_control_off = encodeURI(mqtt_control_off);
            filter.event = 1;
            filter.unit = unit;
            var getAlarmDetails: any =
              await this.settingsService.getAlarmDetailsAlert(filter);
            if (getAlarmDetails) {
              var subject: any = getAlarmDetails.subject;
              var content: any = getAlarmDetails.content;
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
              var dataAlarm: any = getAlarmDetails.dataAlarm;
              var eventControl: any = getAlarmDetails.eventControl;
              var messageMqttControl: any = getAlarmDetails.messageMqttControl;
              var sensor_data: any = getAlarmDetails.sensor_data;
              var count_alarm: any = getAlarmDetails.count_alarm;
            } else {
              var subject: any = 'Normal';
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = 999;
            }
            var status_report: any = {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            };
            var timestamp: any = timestamps;
            var sensor_data_name: any = subject;
            if (type_id == 1) {
              var value_data_msg: any = value_data;
            } else {
              if (value_data == 1) {
                var value_data_msg: any = 'ON';
              } else {
                var value_data_msg: any = 'OFF';
              }
            }
            if (value_alarm == 1) {
              var value_alarm_msg: any = 'Normal';
            } else {
              var value_alarm_msg: any = 'Alarm!';
            }
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              device_org,
              device_bucket,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              content,
              status,
              status_report,
              mqttdata,
              dataAlarm,
              eventControl,
              sensor_data,
              value_data,
              value_data_msg,
              messageMqttControl,
              count_alarm,
              value_alarm,
              value_alarm_msg,
              alarmStatusSet,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              // getAlarmDetails,
              mqttrs,
            };
          } else {
            const inputCreate: any = {
              name: device_bucket,
              statusmqtt: 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: 'Error',
              status: 0,
              createddate: new Date(),
            };
            // await this.mqttService.create_mqttlogRepository(inputCreate);
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              device_org,
              device_bucket,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              status,
              status_report,
              mqttdata,
              value_data,
              value_data_msg,
              value_alarm,
              value_alarm_msg,
              alarmStatusSet,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              //getAlarmDetails,
              mqttrs: 'Error',
            };
          }
          if (alarmStatusSet != 999) {
            ResultDataRS.push(arraydata);
          }
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          cache: cache_data_ResultData,
          checkConnectionMqtt,
          deviceactive: ResultDataRS,
        },
        message: 'check Connection Status Mqtt',
        message_th: 'check Connection Status Mqtt',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  /*********************/
  @HttpCode(200)
  @ApiOperation({ summary: 'alarm device status' })
  @Get('alarmdevicestatus')
  async alarmdevicestatus(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    try {
      var alarm_to_control: any = [];
      var alarm_to_email: any = [];
      var alarm_to_line: any = [];
      var alarm_to_sms: any = [];
      var alarm_to_telegram: any = [];
      var device_event_control_ar: any = [];
      var get_alarm_to_email: any = [];
      var get_alarm_to_line: any = [];
      var get_alarm_to_sms: any = [];
      var get_alarm_to_telegram: any = [];
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamps: any = datePart + ' ' + timePart;
      var date_now: any = format.getCurrentDatenow();
      var time_now: any = format.getCurrentTimenow();
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          return res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt',
            message_th: 'check Connection Status Mqtt',
          });
        }
      } else {
        return res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt',
          message_th: 'check Connection Status Mqtt',
        });
      }
      var cachetimeset: number = parseInt('60');
      var cachetimeset1: number = parseInt('30');
      var cachetimeset2: number = parseInt('180');
      var cachetimeset3: number = parseInt('300');
      var cachetimeset4: number = parseInt('120');
      var device_status: any = 0;
      var ResultDatasendEmail: any = [];
      var useractive_arr: any = [];
      var kaycache_cache_user: any = 'useractiveemail_status_1';
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache_user);
      }
      var useractive: any = await Cache.GetCacheData(kaycache_cache_user);
      if (useractive) {
        var useractive: any = useractive;
        var cache_data_useractive: any = 'cache';
      } else if (!useractive) {
        var filter_useractive: any = { status: 1 };
        var useractive: any = await this.UsersService.useractiveemail(
          filter_useractive,
        );
        var useractiveRs: any = {
          keycache: `${kaycache_cache_user}`,
          time: cachetimeset,
          data: useractive,
        };
        await Cache.SetCacheData(useractiveRs);
        var cache_data_useractive: any = 'no cache';
      }
      const page: number = parseInt(query.page) || 1;
      const pageSize: number = parseInt(query.pageSize) || 100000000;
      var alarm_action_id_mas: any = query.alarm_action_id || '';
      var status: any = query.status || '';
      var sort: any = query.sort || 'createddate-ASC';
      var keyword: any = query.keyword || '';
      var deletecache: any = query.deletecache;
      var filter: any = {};
      filter.sort = query.sort;
      filter.keyword = keyword || '';
      filter.alarm_action_id = alarm_action_id_mas || '';
      filter.event = query.event || '';
      filter.isCount = 1;
      var filter_md5: any = md5(filter);
      var kaycache_cache: any = 'alarmdevicestatus_row_' + filter_md5;
      var row: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var rowResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (rowResultData) {
        var row: any = rowResultData;
      } else if (!rowResultData) {
        var rowResultData: any =
          await this.settingsService.alarm_device_paginate_status(filter);
        var row: any = rowResultData;
        var rowResultData: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: rowResultData,
        };
        await Cache.SetCacheData(rowResultData);
        var cache_data_rowResultData: any = 'no cache';
      } else if (rowResultData) {
        var rowResultData: any = rowResultData;
        var row: any = rowResultData['data'];
        var cache_data_rowResultData: any = 'cache';
      }
      if (!row || row.status == '422') {
        return res.status(200).json({
          statuscode: 200,
          code: 400,
          payload: null,
          message: 'Data is null.',
          message_th: 'ไม่พบข้อมูล',
        });
      }
      var device_status: any = 0;
      const rowData: any = parseInt(row);
      const totalPages: number = Math.round(rowData / pageSize) || 1;
      let filter2: any = {};
      filter2.sort = query.sort;
      filter2.keyword = keyword || '';
      filter2.alarm_action_id = alarm_action_id_mas || '';
      filter2.event = query.event || '';
      filter2.isCount = 0;
      filter2.page = page;
      filter2.pageSize = pageSize;
      console.log(`filter2=`);
      console.info(filter2);
      //var alarm_status:any =0;
      //////////////////////
      var filter2_md5: any = md5(filter2);
      var kaycache_cache: any = 'alarmdevicestatus_rs_' + filter2_md5;
      var ResultData: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (ResultData) {
        var ResultData: any = ResultData;
        var cache_data_ResultData: any = 'cache';
      } else if (!ResultData) {
        var ResultData: any =
          await this.settingsService.alarm_device_paginate_status(filter2);
        var rs: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: ResultData,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      //////////////////////
      var tempDataoid: any = [];
      for (const [key, va] of Object.entries(ResultData)) {
        var alarm_action_id_master: number = parseInt(
          ResultData[key].alarm_action_id,
        );
        var action_name: any = ResultData[key].action_name;
        var status_warning: any = ResultData[key].status_warning;
        var status_alert: any = ResultData[key].status_alert;
        var recovery_warning: any = ResultData[key].recovery_warning;
        var recovery_alert: any = ResultData[key].recovery_alert;
        var email_alarm: any = ResultData[key].email_alarm;
        if (!email_alarm) {
          var email_alarm: any = 0;
        }
        var line_alarm: any = ResultData[key].line_alarm;
        if (!line_alarm) {
          var line_alarm: any = 0;
        }
        var telegram_alarm: any = ResultData[key].telegram_alarm;
        if (!telegram_alarm) {
          var telegram_alarm: any = 0;
        }
        var sms_alarm: any = ResultData[key].sms_alarm;
        if (!sms_alarm) {
          var sms_alarm: any = 0;
        }
        var nonc_alarm: any = ResultData[key].nonc_alarm;
        if (!nonc_alarm) {
          var nonc_alarm: any = 0;
        }
        var time_life: number = parseInt(ResultData[key].time_life);
        var event: number = parseInt(ResultData[key].event);
        if (event == 0) {
          var event_name: any = 'OFF';
        }
        if (event == 1) {
          var event_name: any = 'ON';
        }
        var status: any = ResultData[key].status;
        if (status == 1) {
          var status_name: any = 'enable';
        }
        if (status == 0) {
          var status_name: any = 'disable';
        }
        var device: any = {};
        var alarm_config_mas: any = {};
        alarm_config_mas.alarm_action_id = alarm_action_id_master;
        alarm_config_mas.action_name = action_name;
        alarm_config_mas.event_name = event_name;
        alarm_config_mas.status_name = status_name;
        alarm_config_mas.timelife = time_life + ' Minute';
        /////////////
        var alarm_config: any = {};
        alarm_config.alarm_action_id = alarm_action_id_master;
        alarm_config.action_name = action_name;
        alarm_config.status_warning = status_warning;
        alarm_config.status_alert = status_alert;
        alarm_config.recovery_warning = recovery_warning;
        alarm_config.recovery_alert = recovery_alert;
        alarm_config.nonc_alarm = nonc_alarm;
        alarm_config.email_alarm = email_alarm;
        alarm_config.line_alarm = line_alarm;
        alarm_config.telegram_alarm = telegram_alarm;
        alarm_config.sms_alarm = sms_alarm;
        alarm_config.time_life = time_life;
        alarm_config.time_life_name = time_life + ' Minute';
        alarm_config.event = event;
        alarm_config.event_name = event_name;
        alarm_config.status = status;
        alarm_config.status_name = status_name;
        ////////////
        var filter_alarm: any = {};
        filter_alarm.alarm_action_id = alarm_action_id_master;
        /**************Cache*************/
        var filter_md5: any = md5(filter_alarm);
        var kaycachecache: any = 'alarmdevice_rs_' + alarm_action_id_master;
        if (deletecache == 1) {
          await Cache.DeleteCacheData(kaycachecache);
        }
        var alarmdevice: any = await Cache.GetCacheData(kaycachecache);
        if (alarmdevice) {
          var alarmdevice: any = alarmdevice;
        } else if (!alarmdevice) {
          try {
            var alarmdevice: any =
              await this.settingsService.sd_iot_alarm_device_list_map(
                filter_alarm,
              );
            var rs: any = {
              keycache: `${kaycachecache}`,
              time: cachetimeset,
              data: alarmdevice,
            };
            await Cache.SetCacheData(rs);
            var cache_data_alarmdevice: any = 'no cache';
          } catch (error) {
            console.error('Error fetching alarm device:', error);
            alarmdevice = [];
          }
          var rs: any = {
            keycache: `${kaycachecache}`,
            time: cachetimeset,
            data: alarmdevice,
          };
          await Cache.SetCacheData(rs);
          var cache_data_alarmdevice: any = 'no cache';
        }
        /**************Cache*************/
        if (alarmdevice) {
          var count_device: number = 0;
          if (alarmdevice && Array.isArray(alarmdevice)) {
            count_device = alarmdevice.length;
          }
        } else {
          var count_device: number = parseInt('0');
        }
        alarm_config.count_device = count_device;
        /***************************/
        var alarm_device_arr: any = [];
        if (alarmdevice) {
          for (const [key, value] of Object.entries(alarmdevice)) {
            var values: any = value;
            var valuesMain: any = value;
            const alarm_action_id: any = values.alarm_action_id;
            const device_id: any = values.device_id;
            const type_id: any = values.type_id;
            const mqtt_id: any = values.mqtt_id;
            const event: any = values.event;
            const mqtt_name: any = values.mqtt_name;
            const device_name: any = values.device_name;
            const type_name: any = values.type_name;
            /*******************/
            const time_life: any = values.time_life;
            var status_warning: any = values.status_warning;
            var status_alert: any = values.status_alert;
            var recovery_warning: any = values.recovery_warning;
            var recovery_alert: any = values.recovery_alert;
            const mqtt_control_on: any = values.mqtt_control_on;
            const mqtt_control_off: any = values.mqtt_control_off;
            const mqtt_data_value: any = encodeURI(values.mqtt_data_value);
            const mqtt_data_control: any = encodeURI(values.mqtt_data_control);
            const mqtt_data_set: any = {
              alarm_action_id,
              device_id,
              type_id,
              event,
              time_life,
              status_warning: status_warning,
              status_alert: status_alert,
              recovery_warning: recovery_warning,
              recovery_alert: recovery_alert,
              mqtt_control_on,
              mqtt_control_off,
              mqtt_data_value,
              mqtt_data_control,
            };
            /*******************/
            const setting_id: any = values.setting_id;
            const hardware_id: any = values.hardware_id;
            const period: any = values.period;
            const comparevalue: any = values.comparevalue;
            const status: any = values.status;
            const action_id: any = values.action_id;
            const status_alert_id: any = values.status_alert_id;
            const device_bucket: any = values.device_bucket;
            const location_name: any = values.location_name;
            const configdata: any = values.configdata;
            const mqtt_org: any = values.mqtt_org;
            const mqtt_bucket: any = values.mqtt_bucket;
            const mqtt_device_name: any = values.mqtt_device_name;
            const mqtt_status_over_name: any = values.mqtt_status_over_name;
            const mqtt_status_data_name: any = values.mqtt_status_data_name;
            const mqtt_act_relay_name: any = values.mqtt_act_relay_name;
            const mqtt_control_relay_name: any = values.mqtt_control_relay_name;
            const location_id: any = values.location_id;
            const mqtt_data: any = {
              type_id,
              mqtt_org,
              mqtt_bucket,
              mqtt_device_name,
              mqtt_status_over_name,
              mqtt_status_data_name,
              mqtt_act_relay_name,
              mqtt_control_relay_name,
            };
            //////////////////mqttconnect//////////////////////////////////////////
            var fillterAlarm: any = {};
            fillterAlarm.values = values;
            fillterAlarm.mqtt_status_data_name = mqtt_status_data_name;
            fillterAlarm.location_id = location_id;
            fillterAlarm.configdata = configdata;
            fillterAlarm.mqtt_status_data_name = mqtt_status_data_name;
            fillterAlarm.type_id = type_id;
            fillterAlarm.alarmTypeId = type_id;
            fillterAlarm.status_alert = status_alert;
            fillterAlarm.status_warning = status_warning;
            fillterAlarm.recovery_warning = recovery_warning;
            fillterAlarm.recovery_alert = recovery_alert;
            fillterAlarm.mqtt_name = mqtt_name;
            fillterAlarm.device_name = device_name;
            fillterAlarm.action_name = action_name;
            fillterAlarm.mqtt_control_on = mqtt_control_on;
            fillterAlarm.mqtt_control_off = mqtt_control_off;
            fillterAlarm.mqtt_data_value = mqtt_data_value;
            fillterAlarm.mqtt_data_control = mqtt_data_control;
            fillterAlarm.alarm_action_id = alarm_action_id;
            fillterAlarm.time_life = time_life;
            fillterAlarm.device_id1 = device_id;
            fillterAlarm.event = event;
            fillterAlarm.bucket = device_bucket;
            fillterAlarm.cachetimeset = cachetimeset;
            fillterAlarm.cachetimeset1 = cachetimeset1;
            fillterAlarm.cachetimeset2 = cachetimeset2;
            fillterAlarm.cachetimeset3 = cachetimeset3;
            fillterAlarm.cachetimeset4 = cachetimeset4;
            fillterAlarm.deletecache = deletecache;
            const nonc_alarm: any = values.nonc_alarm;
            const email_alarm: any = values.email_alarm;
            const line_alarm: any = values.line_alarm;
            const telegram_alarm: any = values.telegram_alarm;
            const sms_alarm: any = values.sms_alarm;
            const config_alert: any = {
              nonc_alarm,
              email_alarm,
              line_alarm,
              telegram_alarm,
              sms_alarm,
            };
            /**************Cache*************/
            var mqttrs: any = await this.mqttService.getMqttTopicPA1(
              mqtt_data_value,
              deletecache,
            );
            // return res.status(200).json({message: 'Data  alarmdevice',message_th: 'พบข้อมูล alarmdevice',mqttrs,payload: alarmdevice,});
            var timestampMqtt: any = mqttrs.timestamp;
            if (timestampMqtt) {
              var timestamps: any = timestampMqtt;
            }
            var mqttstatus: any = mqttrs.status;
            var mqttdata: any = mqttrs.msg;
            let obj: any = [];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }
            var mqtt_objt_data = Object.values(obj);
            let obj2: any = [];
            try {
              obj2 = JSON.parse(mqtt_status_data_name);
            } catch (e) {
              throw e;
            }
            var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
            var mqttdata_arr: any = mqttdata_arrs['data'];
            var mqtt_obj2_data = Object.values(obj2);
            var mqttData_count: any = mqttdata_arr.length;
            var mqttData = Object.fromEntries(
              mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
            );
            var merged_dataRs: any = format.mapMqttDataToDevices(
              [values],
              mqttData,
            );
            var merged_data: any = merged_dataRs[0];
            var merged2: any = format.mapMqttDataToDeviceV2([values], mqttData);
            var merged2Mode: any = format.mapMqttDataToDeviceALLMode(
              [va],
              mqttData,
            );
            var merged: any = merged2['0'];
            if (merged) {
              if (type_id > 1) {
                // IO
                var value_data: any =
                  parseInt(merged.value_data) ?? parseInt('0');
                var value_alarm: any =
                  parseInt(merged.value_alarm) ?? parseInt('0');
                var value_relay: any =
                  parseInt(merged.value_relay) ?? parseInt('0');
                var value_control_relay: number =
                  parseInt(merged.value_control_relay) ?? parseInt('0');
                var status_alert: any = parseInt(status_alert) ?? parseInt('0');
                var status_warning: any =
                  parseInt(status_warning) ?? parseInt('0');
                var recovery_warning: any =
                  parseInt(recovery_warning) ?? parseInt('1');
                var recovery_alert: any =
                  parseInt(recovery_alert) ?? parseInt('1');
              } else {
                // Sensor
                var value_data: any = merged.value_data;
                var value_data_merged: any = merged.value_data;
                var value_alarm: any = merged.value_alarm;
                var value_relay: any = merged.value_relay;
                var value_control_relay: number =
                  merged.value_control_relay || 0;
                var status_alert: any = status_alert;
                var status_warning: any = status_warning;
                var recovery_warning: any = recovery_warning;
                var recovery_alert: any = recovery_alert;
              }
            } else {
              if (type_id > 1) {
                // IO
                var value_data: any = parseInt('0');
                var value_alarm: any = parseInt('0');
                var value_relay: any = parseInt('0');
                var value_control_relay: number = parseInt('0');
                var status_alert: any = parseInt('0');
                var status_warning: any = parseInt('0');
                var recovery_warning: any = parseInt('1');
                var recovery_alert: any = parseInt('1');
              } else {
                // Sensor
                var value_data: any = parseFloat('0.00');
                var value_data_merged: any = parseFloat('0.00');
                var value_alarm: any = parseFloat('0.00');
                var value_relay: any = parseFloat('0.00');
                var value_control_relay: number = parseFloat('0.00');
                var status_alert: any = parseFloat('0');
                var status_warning: any = parseFloat('0');
                var recovery_warning: any = parseFloat('1.00');
                var recovery_alert: any = parseFloat('01.00');
              }
            }
            var createddated: any = merged_data.createddate;
            var createddate: any = format.timeConvertermas(
              format.convertTZ(createddated, process.env.tzString),
            );
            var updateddated: any = merged_data.updateddate;
            var updateddate: any = format.timeConvertermas(
              format.convertTZ(updateddated, process.env.tzString),
            );
            var filterAlarmValidate: any = {};
            filterAlarmValidate.type_id = type_id;
            if (type_id == 1) {
              filterAlarmValidate.value_data = parseFloat(value_data);
              filterAlarmValidate.value_alarm = parseInt(value_alarm);
              filterAlarmValidate.value_relay = parseInt(value_relay);
              filterAlarmValidate.value_control_relay = value_control_relay;
              filterAlarmValidate.sensorValueData = encodeURI(value_data); //sensor
              filterAlarmValidate.status_warning = status_warning;
              filterAlarmValidate.status_alert = status_alert;
              filterAlarmValidate.recovery_warning = recovery_warning;
              filterAlarmValidate.recovery_alert = recovery_alert;
            } else {
              filterAlarmValidate.value_data = parseFloat(value_data);
              filterAlarmValidate.value_alarm = parseInt(value_alarm);
              filterAlarmValidate.value_relay = parseInt(value_relay);
              filterAlarmValidate.value_control_relay = value_control_relay;
              filterAlarmValidate.sensorValueData = encodeURI(value_alarm); //IO
              filterAlarmValidate.status_warning = parseInt('0');
              filterAlarmValidate.status_alert = parseInt('0');
              filterAlarmValidate.recovery_warning = parseInt('1');
              filterAlarmValidate.recovery_alert = parseInt('1');
              var data: any = parseFloat(value_alarm);
            }
            filterAlarmValidate.mqtt_name = mqtt_name;
            filterAlarmValidate.device_name = mqtt_device_name;
            filterAlarmValidate.action_name = mqtt_name;
            filterAlarmValidate.mqtt_control_on = encodeURI(mqtt_control_on);
            filterAlarmValidate.mqtt_control_off = encodeURI(mqtt_control_off);
            filterAlarmValidate.event = 1;
            // var getAlarmDetails:any = await this.settingsService.getAlarmDetail(filterAlarmValidate);
            var getAlarmDetails: any =
              await this.settingsService.getAlarmDetailValidate(
                filterAlarmValidate,
              );

            //     return res.status(200).json({
            //         message: 'TESTData  alarmdevice getAlarmDetails'
            //         ,message_th: 'ทดสอบ alarmdevice getAlarmDetails'
            //         ,payload: alarmdevice
            //         ,mqttrs
            //         ,merged
            //         ,checkConnectionMqtt
            //         ,count_device
            //         ,alarm_config
            //         ,filterAlarmValidate
            //         ,getAlarmDetails                                                                                                                                                   gafana
            // });
            var alarmStatusSet: number = parseInt('999');
            if (getAlarmDetails) {
              var subject: any = getAlarmDetails.subject;
              var content: any = getAlarmDetails.content;
              var statusAlert: any = getAlarmDetails.status;
              var alarmStatusSet: number = parseInt(
                getAlarmDetails.alarmStatusSet,
              );
              var dataAlarm: any = getAlarmDetails.dataAlarm;
              var eventControl: any = getAlarmDetails.eventControl;
              var messageMqttControl: any = getAlarmDetails.messageMqttControl;
              var sensor_data: any = getAlarmDetails.sensor_data;
              var count_alarm: any = getAlarmDetails.count_alarm;
            } else {
              var subject: any = 'Normal';
              var messageMqttControl: any = '';
              var statusAlert: any = getAlarmDetails.status;
              var alarmStatusSet: number = parseInt('999');
            }

            fillterAlarm.alarmStatusSet = alarmStatusSet;
            var data_alarm: any = getAlarmDetails.data_alarm;
            var status_report: any = {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            };
            var timestamp: any = timestamps;
            var sensor_data_name: any = subject;
            if (type_id == 1) {
              var value_data_msg: any = value_data;
            } else {
              if (value_data == 1) {
                var value_data_msg: any = 'ON';
              } else {
                var value_data_msg: any = 'OFF';
              }
            }
            if (value_alarm == 1) {
              var value_alarm_msg: any = 'Normal';
            } else {
              var value_alarm_msg: any = 'Alarm!';
            }
            var mqtt_on = encodeURI(mqtt_control_on);
            var mqtt_off = encodeURI(mqtt_control_off);
            var statusControl: any = getAlarmDetails.statusControl;
            if (statusControl == 1 || statusControl == 2) {
              var msgControl: any = mqtt_on;
            } else if (statusControl == 3 || statusControl == 4) {
              var msgControl: any = mqtt_off;
            } else {
              var msgControl: any = mqtt_off;
            }
            fillterAlarm.data_alarm = data_alarm;
            fillterAlarm.subject = getAlarmDetails.subject;
            fillterAlarm.content = getAlarmDetails.content;
            fillterAlarm.status = getAlarmDetails.status;
            fillterAlarm.dataAlarm = getAlarmDetails.dataAlarm;
            fillterAlarm.eventControl = getAlarmDetails.eventControl;
            fillterAlarm.messageMqttControl =
              getAlarmDetails.messageMqttControl;
            fillterAlarm.sensor_data = getAlarmDetails.sensor_data;
            fillterAlarm.count_alarm = getAlarmDetails.count_alarm;

            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id;
            //chk_alarmprocesslog
            // chk_alarm_temp_log_desc
            var crsmaster: any =
              await this.settingsService.chk_alarm_temp_log_desc(
                setdatachk_main,
              );
            if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
              var createddate_logs_control: any = format.timeConvertermas(
                format.convertTZ(
                  crsmaster[0].createddate,
                  process.env.tzString,
                ),
              );
            } else {
              // กำหนดค่า default หรือข้ามไป
              var crsmaster: any = null;
              var createddate_logs_control: any = null;
            }

            //return res.status(200).json({code: 200,merged,fillterAlarm});
            var filter: any = {};
            if (device_id) {
              filter.device_id = device_id;
            }
            if (keyword) {
              filter.keyword = keyword;
            }
            if (mqtt_id) {
              filter.mqtt_id = mqtt_id;
            }
            if (mqtt_bucket) {
              filter.bucket = mqtt_bucket;
              time_life;
            }
            if (type_id) {
              filter.type_id = type_id;
            }
            if (alarm_action_id) {
              filter.alarm_action_id = alarm_action_id;
            }
            /**********************************/
            const device_id_val: number = parseInt(device_id);
            var alarmdevice_arr_rs: any = [];
            var filter_alarm_ctl: any = {};
            filter_alarm_ctl.alarm_action_id = alarm_action_id_master;
            /**************Cache*************/
            var filter_md5_ctl: any = md5(filter_alarm_ctl);
            var kaycachecache_ctl: any =
              'alarmdevice_rs__ctl' + alarm_action_id_master;
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycachecache_ctl);
            }
            var alarmdevice_ctl: any = await Cache.GetCacheData(
              kaycachecache_ctl,
            );
            if (alarmdevice_ctl) {
              var alarmdevice: any = alarmdevice_ctl;
            } else if (!alarmdevice_ctl) {
              var filter3: any = {};
              filter3.alarm_action_id = alarm_action_id;
              var alarmdevice_ctl: any =
                await this.settingsService.deviceeventmap(filter3);
              var rs: any = {
                keycache: `${kaycachecache_ctl}`,
                time: cachetimeset,
                data: alarmdevice_ctl,
              };
              await Cache.SetCacheData(rs);
              var cache_data_alarmdevice: any = 'no cache';
            }
            /**-- 2026-01-02 ---**/
            if (alarmStatusSet == 1) {
              var validate_count: number = parseInt('3');
            } else if (alarmStatusSet == 2) {
              var validate_count: number = parseInt('3');
            } else if (alarmStatusSet == 3) {
              var validate_count: number = parseInt('1');
            } else {
              var validate_count: number = parseInt('1');
            }
            //return res.status(200).json({code: 200,merged,alarmdevice_ctl,fillterAlarm});
            /**************Cache*************/
            if (alarmdevice_ctl) {
              for (const [key2, value2] of Object.entries(alarmdevice_ctl)) {
                var values2: any = value2;
                const alarm_action_id2: any = values.alarm_action_id;
                // const device_id :any= values2.device_id;
                var device_id2: number = parseInt(values2.device_id);
                const type_id2: any = values2.type_id;
                const mqtt_id: any = values2.mqtt_id;
                const event: any = values.event;
                const mqtt_name: any = values.mqtt_name;
                const device_name: any = values2.device_name;
                const type_name: any = values2.type_name;
                const time_life: number = parseInt(values.time_life);
                const bucket_main: any = values2.bucket;
                var now_time_full: any = format.timeConvertermas(
                  format.convertTZ(
                    format.getCurrentFullDatenow(),
                    process.env.tzString,
                  ),
                );
                var date_now2: any = format.getCurrentDatenow();

                const setdatachk_alarm_process_logs: any = {
                  alarm_action_id: alarm_action_id2,
                  device_id: device_id_val,
                  type_id: type_id2,
                  date: date_now2,
                };
                var now_time_cal_main: number = parseInt('0');
                var count_alarm_process_log: any =
                  await this.settingsService.count_alarmprocesslogmqtt(
                    setdatachk_alarm_process_logs,
                  );
                var count_alarm_process_logs: number =
                  parseInt(count_alarm_process_log) || 0;
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id2;
                var countAlarmDeviceControl: number = 0;

                try {
                  var countResult: any =
                    await this.settingsService.count_alarmprocesslog(
                      fillter_device_control,
                    );
                  if (countResult !== null && countResult !== undefined) {
                    var countAlarmDeviceControl: number =
                      parseInt(countResult) || 0;
                  }
                } catch (error) {
                  console.error('Error counting alarm process log:', error);
                  countAlarmDeviceControl = 0;
                  console.error(`Error processing main record ${key}:`, error);
                  continue;
                }
                /**-- 2026-01-02 ---**/
                var setdatachk_main_control_logs: any = {};
                setdatachk_main_control_logs.alarm_action_id = alarm_action_id2;
                setdatachk_main_control_logs.device_id = device_id;
                var crsmaster_control_logsm: any =
                  await this.settingsService.chk_alarmprocesslog(
                    setdatachk_main_control_logs,
                  );
                var crsmaster_control_logs_count: any =
                  crsmaster_control_logsm.length;
                if (crsmaster_control_logs_count >= 1) {
                  var crsmaster_control_logs_v1: any =
                    crsmaster_control_logsm['0'];
                  var createddate_logs_control_v1: any =
                    format.timeConvertermas(
                      format.convertTZ(
                        crsmaster_control_logs_v1.createddate,
                        process.env.tzString,
                      ),
                    );
                  var now_time_cal_control_log: any = format.diffMinutes(
                    now_time_full,
                    createddate_logs_control_v1,
                  );
                  var now_time_cal_control_v1: number = parseInt(
                    now_time_cal_control_log,
                  );
                  if (now_time_cal_control_log > time_life) {
                    if (crsmaster_control_logs_count >= validate_count) {
                      const fillter_device_control: any = {};
                      fillter_device_control.alarm_action_id = alarm_action_id;
                      fillter_device_control.device_id = device_id;
                      await this.settingsService.delete_alarmprocesslogal(
                        fillter_device_control,
                      );
                    }
                  }
                } else {
                  var crsmaster_control_logs: any = [];
                  var createddate_logs_control: any = '';
                  var now_time_cal_control_v1: number = 0;
                }

                // return res.status(200).json({
                //                                 code: 200,
                //                                 setdatachk_alarm_process_logs,
                //                                 fillter_device_control,
                //                                 countAlarmDeviceControl,
                //                                 count_alarm_process_log,
                //                                 setdatachk_main_control_logs,
                //                                 crsmaster_control_logs
                //                             });

                // var status_warning :any=status_warning;
                // var status_alert :any=status_alert;
                // var recovery_warning :any=recovery_warning;
                // var recovery_alert :any=recovery_alert;

                let mqtt_control_on: any = values2.mqtt_control_on;
                let mqtt_control_off: any = values2.mqtt_control_off;
                let mqtt_data_value: any = encodeURI(values2.mqtt_data_value);
                let mqtt_data_control: any = encodeURI(
                  values2.mqtt_data_control,
                );
                let fillterAlarmCtl: any = {};

                fillterAlarmCtl.value_data = value_data;
                fillterAlarmCtl.sensor_data = value_data;
                fillterAlarmCtl.value = value;
                // fillterAlarmCtl.values=values;
                // fillterAlarmCtl.values2=values2;
                fillterAlarmCtl.data_alarm = data_alarm;
                fillterAlarmCtl.mqtt_status_data_name = mqtt_status_data_name;
                fillterAlarmCtl.location_id = location_id;
                fillterAlarmCtl.configdata = configdata;
                fillterAlarmCtl.mqtt_status_data_name = mqtt_status_data_name;
                fillterAlarmCtl.type_id = type_id;
                fillterAlarmCtl.alarmTypeId = type_id;
                fillterAlarmCtl.status_alert = status_alert;
                fillterAlarmCtl.status_warning = status_warning;
                fillterAlarmCtl.recovery_warning = recovery_warning;
                fillterAlarmCtl.recovery_alert = recovery_alert;
                fillterAlarmCtl.mqtt_name = mqtt_name;
                fillterAlarmCtl.device_name = device_name;
                fillterAlarmCtl.action_name = action_name;
                fillterAlarmCtl.mqtt_control_on = mqtt_control_on;
                fillterAlarmCtl.mqtt_control_off = mqtt_control_off;
                fillterAlarmCtl.mqtt_data_value = mqtt_data_value;
                fillterAlarmCtl.mqtt_data_control = mqtt_data_control;
                fillterAlarmCtl.alarm_action_id = alarm_action_id;
                fillterAlarmCtl.time_life = time_life;
                fillterAlarmCtl.device_id1 = device_id;
                fillterAlarmCtl.event = event;
                fillterAlarmCtl.bucket = device_bucket;
                fillterAlarmCtl.bucket_main = bucket_main;
                fillterAlarmCtl.cachetimeset = cachetimeset;
                fillterAlarmCtl.cachetimeset1 = cachetimeset1;
                fillterAlarmCtl.cachetimeset2 = cachetimeset2;
                fillterAlarmCtl.cachetimeset3 = cachetimeset3;
                fillterAlarmCtl.cachetimeset4 = cachetimeset4;
                fillterAlarmCtl.deletecache = deletecache;
                fillterAlarmCtl.alarmStatusSet = alarmStatusSet;
                fillterAlarmCtl.subject = getAlarmDetails.subject;
                fillterAlarmCtl.content = getAlarmDetails.content;
                fillterAlarmCtl.status = getAlarmDetails.status;
                fillterAlarmCtl.dataAlarm = getAlarmDetails.dataAlarm;
                fillterAlarmCtl.eventControl = getAlarmDetails.eventControl;
                fillterAlarmCtl.messageMqttControl =
                  getAlarmDetails.messageMqttControl;
                fillterAlarmCtl.sensor_data = getAlarmDetails.sensor_data;
                fillterAlarmCtl.count_alarm = getAlarmDetails.count_alarm;
                fillterAlarmCtl.value_data = getAlarmDetails.value_data;
                fillterAlarmCtl.value_alarm = getAlarmDetails.value_alarm;
                fillterAlarmCtl.value_relay = getAlarmDetails.value_relay;
                fillterAlarmCtl.device_id_val = device_id_val;
                fillterAlarmCtl.device_id2 = device_id2;
                fillterAlarmCtl.device_id_mas = device_id_val;
                fillterAlarmCtl.device_id = device_id;
                fillterAlarmCtl.value_control_relay =
                  getAlarmDetails.value_control_relay;
                if (bucket_main == device_bucket) {
                  if (countAlarmDeviceControl >= 1) {
                    var type_ctl: number = 1;
                    var crsmaster_control: any = 0;
                    var setdatachk_main_control: any = {};
                    setdatachk_main_control.alarm_action_id = alarm_action_id2;
                    setdatachk_main_control.device_id = device_id;
                    // var crsmaster_control:any = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main_control);
                    var crsmaster_control: any =
                      await this.settingsService.chk_alarmprocesslog(
                        setdatachk_main_control,
                      );
                    var crsmaster_control_logs_count: any =
                      crsmaster_control.length;
                    // if (!crsmaster_control) {
                    //   return res.status(200).json({ code: 200, playload: { setdatachk_main_control,crsmaster_control, data: null } });
                    // }
                    if (crsmaster_control_logs_count < 1) {
                      if (type_id2 > 1) {
                        var alarm_to_control: any =
                          await this.alarm_device_arr_to_event_control(
                            fillterAlarmCtl,
                          );
                      }
                      //var alarm_to_control:any= await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                    } else {
                      var createddate: any = format.timeConvertermas(
                        format.convertTZ(
                          crsmaster_control[0].createddate,
                          process.env.tzString,
                        ),
                      );
                      var createddate_logs_control: any =
                        format.timeConvertermas(
                          format.convertTZ(
                            crsmaster_control[0].createddate,
                            process.env.tzString,
                          ),
                        );
                      var now_time_cal_control_log: any = format.diffMinutes(
                        now_time_full,
                        createddate_logs_control,
                      );
                      var now_time_cal_control: number = parseInt(
                        now_time_cal_control_log,
                      );
                      fillterAlarmCtl.createddate = createddate;
                      fillterAlarmCtl.createddate_logs_control =
                        createddate_logs_control;
                      fillterAlarmCtl.now_time_cal_control =
                        now_time_cal_control;
                      if (now_time_cal_control > time_life) {
                        if (type_id2 > 1) {
                          var alarm_to_control: any =
                            await this.alarm_device_arr_to_event_control(
                              fillterAlarmCtl,
                            );
                        }
                        //var alarm_to_control:any= await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                      }
                    }
                  } else {
                    fillterAlarm;
                    var type_ctl: number = 2;
                    var crsmaster_control: any = {};
                    if (type_id2 > 1) {
                      var alarm_to_control: any =
                        await this.alarm_device_arr_to_event_control(
                          fillterAlarmCtl,
                        );
                    }
                    //var alarm_to_control:any= await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                  }
                  let fillterAlarmToCtl: any = {};
                  // fillterAlarmToCtl.mqttdata_arrs=mqttdata_arrs;
                  // fillterAlarmToCtl.mqttdata_arr=mqttdata_arr;
                  // fillterAlarmToCtl.mqtt_obj2_data=mqtt_obj2_data;
                  // fillterAlarmToCtl.mqttData_count=mqttData_count;
                  fillterAlarmToCtl.mqttData = mqttData;
                  // fillterAlarmToCtl.merged2Mode=merged2Mode;
                  // fillterAlarmToCtl.merged_dataRs=merged_dataRs;
                  fillterAlarmToCtl.merged = merged;
                  fillterAlarmToCtl.value_data = fillterAlarmCtl.value_data;
                  fillterAlarmToCtl.sensor_data = fillterAlarmCtl.sensor_data;
                  fillterAlarmToCtl.data_alarm = fillterAlarmCtl.data_alarm;
                  // fillterAlarmToCtl.mqtt_status_data_name=fillterAlarmCtl.mqtt_status_data_name;
                  // fillterAlarmToCtl.location_id=fillterAlarmCtl.location_id;
                  // fillterAlarmToCtl.configdata=fillterAlarmCtl.configdata;
                  fillterAlarmToCtl.type_id = fillterAlarmCtl.type_id;
                  fillterAlarmToCtl.alarmTypeId = fillterAlarmCtl.alarmTypeId;
                  // fillterAlarmToCtl.status_alert=fillterAlarmCtl.status_alert;
                  // fillterAlarmToCtl.status_warning=fillterAlarmCtl.status_warning;
                  // fillterAlarmToCtl.recovery_warning=fillterAlarmCtl.recovery_warning;
                  // fillterAlarmToCtl.recovery_alert=fillterAlarmCtl.recovery_alert;
                  // fillterAlarmToCtl.mqtt_name=fillterAlarmCtl.mqtt_name;
                  // fillterAlarmToCtl.device_name=fillterAlarmCtl.device_name;
                  // fillterAlarmToCtl.action_name=fillterAlarmCtl.action_name;
                  // fillterAlarmToCtl.mqtt_control_on=fillterAlarmCtl.mqtt_control_on;
                  // fillterAlarmToCtl.mqtt_control_off=fillterAlarmCtl.mqtt_control_off;
                  // fillterAlarmToCtl.mqtt_data_value=fillterAlarmCtl.mqtt_data_value;
                  // fillterAlarmToCtl.mqtt_data_control=fillterAlarmCtl.mqtt_data_control;
                  // fillterAlarmToCtl.alarm_action_id=fillterAlarmCtl.alarm_action_id;
                  // fillterAlarmToCtl.device_id1=fillterAlarmCtl.device_id1;
                  // fillterAlarmToCtl.event=fillterAlarmCtl.event;
                  // fillterAlarmToCtl.bucket=fillterAlarmCtl.bucket;
                  // fillterAlarmToCtl.bucket_main=fillterAlarmCtl.bucket_main;
                  // fillterAlarmToCtl.cachetimeset=fillterAlarmCtl.cachetimeset;
                  // fillterAlarmToCtl.cachetimeset1=fillterAlarmCtl.cachetimeset1;
                  // fillterAlarmToCtl.cachetimeset2=fillterAlarmCtl.cachetimeset2;
                  // fillterAlarmToCtl.cachetimeset3=fillterAlarmCtl.cachetimeset3;
                  // fillterAlarmToCtl.cachetimeset4=fillterAlarmCtl.cachetimeset4;
                  // fillterAlarmToCtl.alarmStatusSet=fillterAlarmCtl.alarmStatusSet;
                  fillterAlarmToCtl.subject = fillterAlarmCtl.subject;
                  fillterAlarmToCtl.content = fillterAlarmCtl.content;
                  // fillterAlarmToCtl.status=fillterAlarmCtl.status;
                  // fillterAlarmToCtl.dataAlarm=fillterAlarmCtl.dataAlarm;
                  // fillterAlarmToCtl.eventControl=fillterAlarmCtl.eventControl;
                  // fillterAlarmToCtl.messageMqttControl=fillterAlarmCtl.messageMqttControl;
                  // fillterAlarmToCtl.count_alarm=fillterAlarmCtl.count_alarm;
                  // fillterAlarmToCtl.value_alarm=fillterAlarmCtl.value_alarm;
                  // fillterAlarmToCtl.value_relay=fillterAlarmCtl.value_relay
                  // fillterAlarmToCtl.device_id_val=fillterAlarmCtl.device_id_val;
                  // fillterAlarmToCtl.device_id2=fillterAlarmCtl.device_id2;
                  fillterAlarmToCtl.device_id_mas =
                    fillterAlarmCtl.device_id_mas;
                  fillterAlarmToCtl.device_id = fillterAlarmCtl.device_id;
                  // fillterAlarmToCtl.value_control_relay=fillterAlarmCtl.value_control_relay;
                  // fillterAlarmToCtl.createddate=fillterAlarmCtl.createddate;
                  // fillterAlarmToCtl.createddate_logs_control=fillterAlarmCtl.createddate_logs_control;

                  fillterAlarmToCtl.time_life = fillterAlarmCtl.time_life;
                  fillterAlarmToCtl.now_time_cal_control =
                    fillterAlarmCtl.now_time_cal_control;
                  if (device_id_val != device_id2 && type_id2 > 1) {
                    alarmdevice_arr_rs.push({
                      device_id: device_id2,
                      type_id: type_id2,
                      device_name: device_name,
                      type_name: type_name,
                      bucket: device_bucket,
                      subject,
                      content,
                      // info:{
                      //     alarm_action_id:alarm_action_id,
                      //     device_id_main:device_id_val,
                      //     device_id_val,
                      //     device_id:device_id2,
                      //     type_id:type_id,
                      //     type_id2:type_id2,
                      //     mqtt_id:mqtt_id,
                      //     bucket_main,
                      //     type_ctl,
                      //     time_life,
                      //     crsmaster_control_logs_count,
                      //     mqtt_name:mqtt_name,
                      // },
                      // now_time_cal_control:fillterAlarmCtl.now_time_cal_control,
                      // mqttData:fillterAlarmToCtl.mqttData,
                      control: alarm_to_control,
                      /********/
                      //setdatachk_alarm_process_logs,
                      //fillter_device_control,
                      //countAlarmDeviceControl,
                      //count_alarm_process_log,
                      //setdatachk_main_control_logs,
                      //crsmaster_control_logs,
                      //fillterAlarmCtl,fillterAlarmToCtl,
                      //fiiter: {getAlarmDetails,filterAlarmValidate,value2}
                    });
                  }
                }
              }
            }
            /********************************/
            var fillterAlarmMain: any = {};
            fillterAlarmMain.values = valuesMain;
            fillterAlarmMain.alarm_action_id = alarm_action_id;
            fillterAlarmMain.device_id = device_id;
            fillterAlarmMain.type_id = type_id;
            fillterAlarmMain.mqtt_id = mqtt_id;
            fillterAlarmMain.event = event;
            fillterAlarmMain.mqtt_name = mqtt_name;
            fillterAlarmMain.device_name = device_name;
            fillterAlarmMain.type_name = type_name;
            fillterAlarmMain.time_life = time_life;
            fillterAlarmMain.status_warning = status_warning;
            fillterAlarmMain.status_alert = status_alert;
            fillterAlarmMain.recovery_warning = recovery_warning;
            fillterAlarmMain.recovery_alert = recovery_alert;
            fillterAlarmMain.mqtt_data_set = {
              alarm_action_id,
              device_id,
              type_id,
              event,
              time_life,
              status_warning: status_warning,
              status_alert: status_alert,
              recovery_warning: recovery_warning,
              recovery_alert: recovery_alert,
              mqtt_control_on,
              mqtt_control_off,
              mqtt_data_value,
              mqtt_data_control,
            };
            fillterAlarmMain.setting_id = setting_id;
            fillterAlarmMain.hardware_id = hardware_id;
            fillterAlarmMain.period = period;
            fillterAlarmMain.comparevalue = comparevalue;
            fillterAlarmMain.status = status;
            fillterAlarmMain.action_id = action_id;
            fillterAlarmMain.status_alert_id = status_alert_id;
            fillterAlarmMain.device_bucket = device_bucket;
            fillterAlarmMain.location_name = location_name;
            fillterAlarmMain.configdata = configdata;
            fillterAlarmMain.mqtt_org = mqtt_org;
            fillterAlarmMain.mqtt_bucket = mqtt_bucket;
            fillterAlarmMain.mqtt_device_name = mqtt_device_name;
            fillterAlarmMain.mqtt_status_over_name = mqtt_status_over_name;
            fillterAlarmMain.mqtt_status_data_name = mqtt_status_data_name;
            fillterAlarmMain.mqtt_act_relay_name = mqtt_act_relay_name;
            fillterAlarmMain.mqtt_control_relay_name = mqtt_control_relay_name;
            fillterAlarmMain.location_id = location_id;
            fillterAlarmMain.value_data = value_data;
            fillterAlarmMain.sensor_data = value_data;
            fillterAlarmMain.value = value;
            fillterAlarmMain.data_alarm = data_alarm;
            fillterAlarmMain.mqtt_status_data_name = mqtt_status_data_name;
            fillterAlarmMain.location_id = location_id;
            fillterAlarmMain.configdata = configdata;
            fillterAlarmMain.mqtt_status_data_name = mqtt_status_data_name;
            fillterAlarmMain.type_id = type_id;
            fillterAlarmMain.alarmTypeId = type_id;
            fillterAlarmMain.status_alert = status_alert;
            fillterAlarmMain.status_warning = status_warning;
            fillterAlarmMain.recovery_warning = recovery_warning;
            fillterAlarmMain.recovery_alert = recovery_alert;
            fillterAlarmMain.mqtt_name = mqtt_name;
            fillterAlarmMain.device_name = device_name;
            fillterAlarmMain.action_name = action_name;
            fillterAlarmMain.mqtt_control_on = mqtt_control_on;
            fillterAlarmMain.mqtt_control_off = mqtt_control_off;
            fillterAlarmMain.mqtt_data_value = mqtt_data_value;
            fillterAlarmMain.mqtt_data_control = mqtt_data_control;
            fillterAlarmMain.alarm_action_id = alarm_action_id;
            fillterAlarmMain.time_life = time_life;
            fillterAlarmMain.device_id1 = device_id;
            fillterAlarmMain.event = event;
            fillterAlarmMain.bucket = device_bucket;
            fillterAlarmMain.bucket_main = device_bucket;
            fillterAlarmMain.cachetimeset = cachetimeset;
            fillterAlarmMain.cachetimeset1 = cachetimeset1;
            fillterAlarmMain.cachetimeset2 = cachetimeset2;
            fillterAlarmMain.cachetimeset3 = cachetimeset3;
            fillterAlarmMain.cachetimeset4 = cachetimeset4;
            fillterAlarmMain.deletecache = deletecache;
            fillterAlarmMain.alarmStatusSet = alarmStatusSet;
            fillterAlarmMain.subject = getAlarmDetails.subject;
            fillterAlarmMain.content = getAlarmDetails.content;
            fillterAlarmMain.status = getAlarmDetails.status;
            fillterAlarmMain.dataAlarm = getAlarmDetails.dataAlarm;
            fillterAlarmMain.eventControl = getAlarmDetails.eventControl;
            fillterAlarmMain.messageMqttControl =
              getAlarmDetails.messageMqttControl;
            fillterAlarmMain.sensor_data = getAlarmDetails.sensor_data;
            fillterAlarmMain.count_alarm = getAlarmDetails.count_alarm;
            fillterAlarmMain.value_data = getAlarmDetails.value_data;
            fillterAlarmMain.value_alarm = getAlarmDetails.value_alarm;
            fillterAlarmMain.value_relay = getAlarmDetails.value_relay;
            fillterAlarmMain.device_id_val = device_id_val;
            fillterAlarmMain.device_id2 = device_id2;
            fillterAlarmMain.device_id_mas = device_id_val;
            fillterAlarmMain.device_id = device_id;
            fillterAlarmMain.value_control_relay =
              getAlarmDetails.value_control_relay;
            var crsmaster_email: any =
              await this.settingsService.chk_alarmprocesslogemail(
                fillterAlarmMain,
              );
            var count_crsmaster_email: number =
              parseInt(crsmaster_email.length) || 0;
            if (count_crsmaster_email >= 1) {
              var createddate_logsMaim: any = format.timeConvertermas(
                format.convertTZ(
                  crsmaster_email[0].createddate,
                  process.env.tzString,
                ),
              );
              var now_time_cal_mains: any = format.diffMinutes(
                now_time_full,
                createddate_logsMaim,
              );
              var now_time_cal_main: number = parseInt(now_time_cal_mains);
              if (now_time_cal_main > time_life) {
                if (email_alarm == '1') {
                  var alarm_to_email: any = await this.alarm_to_email(
                    fillterAlarmMain,
                  );
                }
              }
            } else {
              if (email_alarm == '1') {
                var alarm_to_email: any = await this.alarm_to_email(
                  fillterAlarmMain,
                );
              }
            }
            if (line_alarm == '1') {
              var alarm_to_line: any = fillterAlarmMain['type_name'];
            }
            if (sms_alarm == '1') {
              var alarm_to_sms: any = fillterAlarmMain['type_name'];
            }
            if (telegram_alarm == '1') {
              var alarm_to_telegram: any = fillterAlarmMain['type_name'];
            }
            /********************************/
            alarm_device_arr.push({
              type_ctl,
              alarm_action_id: alarm_action_id,
              device_id: device_id,
              type_id: type_id,
              mqtt_id: mqtt_id,
              mqtt_name: mqtt_name,
              device_name: device_name,
              type_name: type_name,
              device_bucket: device_bucket,
              bucket: device_bucket,
              now_time_full,
              date_now,
              createddate_logs_control,
              time_life,
              now_time_cal_main,
              value_data,
              value_alarm,
              value_relay,
              value_control_relay,
              subject: getAlarmDetails.subject,
              status: getAlarmDetails.status,
              alarmStatusSet: getAlarmDetails.alarmStatusSet,
              dataAlarm: getAlarmDetails.dataAlarm,
              status_alert: status_alert,
              status_warning: status_warning,
              recovery_warning: recovery_warning,
              recovery_alert: recovery_alert,
              msgControl,
              messageMqttControl,
              value_data_msg,
              // rss:{ mqttrs,mqttData,filterAlarmValidate,getAlarmDetails },
              // crsmaster_email,
              // fillterAlarm,
              // setdatachk_alarm_process_logs,
              // count_alarm_process_logs,
              // filterAlarmValidate,getAlarmDetails,
              last_subject_log_control: crsmaster[0].subject,
              last_create_log_control: createddate_logs_control,
              config_alert,
              control_device: alarmdevice_arr_rs,
              count_crsmaster_email,
              alarm_to_email,
              alarm_to_line,
              alarm_to_sms,
              alarm_to_telegram,
              //fillterAlarmMain,
            });
            // res.status(200).json({code: 200,  alarm_device_arr});
          }
        } else {
          alarm_device_arr = [];
        }
        const DataRs: any = {
          masterdata: alarm_config_mas,
          // config:alarm_config,
          alarmdevice: alarm_device_arr,
          //user:useractive,
          cache: cache_data_ResultData,
        };
        tempDataoid.push(DataRs);
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
          checkConnectionMqtt,
          // filter: filter2,
          data: tempDataoid,
        },
        //ResultData,
        message: 'get alarmdevicestatus success.',
        message_th: 'get alarmdevicestatus success.',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: 'alarm device status is null',
        message: 'alarmdevicestatus Internal server error 500',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  /*********************/
  async alarm_device_arr_to_event_control(dto: any) {
    var status_del: any = 0;
    var parsedCounts: number = 0;
    var countAlarmDeviceControl: number = 0;
    var validate_count: number = 0;
    // Validate input
    if (!dto) {
      throw new Error('DTO is required');
    }
    // Get current date/time
    // return {alarm_device_arr_to_event_control_dto:dto};

    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน

    var timestamps: any = datePart + ' ' + timePart;
    var date_now: any = format.getCurrentDatenow();
    var time_now: any = format.getCurrentTimenow();
    //var UrlMqtt:any = process.env.MQTT_HOST;
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      var Mqttstatus: any = checkConnectionMqtt.status;
    } else {
      var Mqttstatus: any = false;
    }

    var setOption = dto.setOption;
    var cachetimeset = dto.cachetimeset;
    var cachetimeset1 = dto.cachetimeset1;
    var cachetimeset2 = dto.cachetimeset2;
    var cachetimeset3 = dto.cachetimeset3;
    var cachetimeset4 = dto.cachetimeset4;
    var deletecache = dto.deletecache;
    var kaycache_cache_a1 = dto.kaycache_cache_a1;
    var device_id2: number = parseInt(dto.device_id2);
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var device_id_mas: number = parseInt(dto.device_id_mas);
    if (!dto.device_id_mas) {
      var device_id_mas: number = parseInt(dto.device_id);
    }
    var crsmasterio = dto.crsmasterio;
    var countalarm_master_io = dto.countalarm_master_io;
    var device_control = dto.device_control;
    var device_control_map_count = dto.device_control_map_count;
    var event: number = parseInt(dto.event);
    var eventSet: number = parseInt(dto.event);
    var time_life: any = dto.time_life;
    var bucket: any = dto.bucket;
    var location_id: any = dto.location_id;
    var device_id: any = dto.device_id;
    var values: any = dto.values;
    var mqtt_data_value: any = dto.mqtt_data_value;
    var mqtt_data_control: any = dto.mqtt_data_control;
    var configdata: any = dto.configdata;
    var mqtt_status_data_name: any = dto.mqtt_status_data_name;
    var type_id: number = parseInt(dto.type_id);
    var alarmTypeId: any = type_id;
    var status_alert: any = dto.status_alert;
    var status_warning: any = dto.status_warning;
    var recovery_warning: any = dto.recovery_warning;
    var recovery_alert: any = dto.recovery_alert;
    var mqtt_name: any = dto.mqtt_name;
    var device_name: any = dto.device_name;
    var action_name: any = dto.action_name;
    var mqtt_control_on: any = dto.mqtt_control_on;
    var mqtt_control_off: any = dto.mqtt_control_off;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var subject: any = dto.subject;
    var content: any = dto.content;
    var status: any = dto.status;
    var alarmStatusSet: any = parseInt(dto.alarmStatusSet);
    var dataAlarm: any = dto.dataAlarm;
    var eventControl: any = dto.eventControl;
    var messageMqttControl: any = dto.messageMqttControl;
    var sensor_data: any = dto.sensor_data;
    var count_alarm = dto.count_alarm;
    var mqttconnect: any = [];
    var dtos: any = {};
    dtos.cachetimeset = cachetimeset;
    dtos.cachetimeset2 = cachetimeset2;
    dtos.deletecache = deletecache;
    dtos.kaycache_cache_a1 = kaycache_cache_a1;
    dtos.alarm_action_id = alarm_action_id;
    dtos.device_id_mas = device_id_mas;
    dtos.crsmasterio = crsmasterio;
    dtos.countalarm_master_io = countalarm_master_io;
    dtos.device_control = device_control;
    dtos.device_control_map_count = device_control_map_count;
    //dtos.values=dto.values;
    dtos.configdata = dto.configdata;
    dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
    dtos.type_id = dto.type_id;
    dtos.status_alert = dto.status_alert;
    dtos.status_warning = dto.status_warning;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_alert = dto.ecovery_alert;
    dtos.mqtt_name = dto.mqtt_name;
    dtos.device_name = dto.device_name;
    dtos.action_name = dto.action_name;
    dtos.mqtt_control_on = dto.mqtt_control_on;
    dtos.mqtt_control_off = dto.mqtt_control_off;
    dtos.mqtt_data_value = dto.mqtt_data_value;
    dtos.mqtt_data_control = dto.mqtt_data_control;
    dtos.location_id = dto.location_id;
    dtos.time_life = dto.time_life;
    dtos.device_id = dto.device_id;
    dtos.event = dto.event;
    dtos.bucket = dto.device_bucket;
    dtos.cachetimeset = dto.cachetimeset;
    dtos.deletecache = dto.deletecache;
    dtos.setOption = 1;
    if (alarmStatusSet == 1) {
      var validate_count: number = parseInt('3');
    } else if (alarmStatusSet == 2) {
      var validate_count: number = parseInt('3');
    } else if (alarmStatusSet == 3) {
      var validate_count: number = parseInt('1');
    } else {
      var validate_count: number = parseInt('1');
    }
    var fillterDataSENSOR: any = {};
    if (alarm_action_id) {
      fillterDataSENSOR.alarm_action_id = alarm_action_id;
    }
    if (eventSet) {
      fillterDataSENSOR.event = eventSet;
    }
    if (date_now) {
      fillterDataSENSOR.date = date_now;
    }
    if (time_now) {
      fillterDataSENSOR.time = time_now;
    }
    if (alarmStatusSet == 1) {
      fillterDataSENSOR.status_warning = dto.status_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 2) {
      fillterDataSENSOR.status_alert = dto.status_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 3) {
      fillterDataSENSOR.recovery_warning = dto.recovery_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 4) {
      fillterDataSENSOR.recovery_alert = dto.recovery_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    }

    var inputCreate: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id2,
      type_id: type_id,
      event: eventSet,
      status: 1,
      alarm_type: alarmTypeId,
      status_warning: dto.status_warning,
      recovery_warning: dto.recovery_warning,
      status_alert: dto.status_alert,
      recovery_alert: dto.recovery_alert,
      email_alarm: 0,
      line_alarm: 0,
      telegram_alarm: 0,
      sms_alarm: 0,
      nonc_alarm: 1,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: dataAlarm,
      createddate: new Date(),
      updateddate: new Date(),
      ata_alarm: dataAlarm,
      alarm_status: alarmStatusSet,
      subject: subject,
      content: content,
    };
    var deviceFillter: any = {
      alarm_action_id: alarm_action_id,
      device_id: dto.device_id2,
      device_id_mas: device_id_mas,
      bucket: bucket,
    };
    /**************Cache*************/
    var kaycachecache: any =
      'alarm_device_id_event_rss_iot_crt' +
      md5(alarm_action_id + '-' + device_id + '-' + bucket);
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycachecache);
    }
    var device: any = await Cache.GetCacheData(kaycachecache);
    if (device) {
      var device: any = device;
    } else if (!device) {
      var device: any = await this.settingsService.alarm_device_id_event_crt(
        deviceFillter,
      );
      var rs: any = {
        keycache: `${kaycachecache}`,
        time: cachetimeset,
        data: device,
      };
      await Cache.SetCacheData(rs);
      var cache_data_alarmdevice: any = 'no cache';
    }
    /**************Cache*************/
    /***************Alarm Status **************/
    try {
      if (alarmStatusSet === 1 || alarmStatusSet === 2) {
        var mqtt_get_data: any = encodeURI(mqtt_data_value);
        var mqtt_access_control: any = encodeURI(mqtt_data_control);
        if (event == 1) {
          var messageMqttControls: any = mqtt_control_on;
          var eventSet: number = parseInt('1');
        } else {
          var messageMqttControls: any = mqtt_control_off;
          var eventSet: number = parseInt('0');
        }
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.device_id = device_id2;
        //  ตรวจสอบค่า countResult ก่อนแปลง
        var countAlarmDeviceControl: number = parseInt('0');
        try {
          const countResult: any =
            await this.settingsService.count_alarmprocesslog(
              fillter_device_control,
            );
          // ตรวจสอบว่า countResult ไม่ใช่ null/undefined และสามารถแปลงเป็นตัวเลขได้
          if (countResult !== null && countResult !== undefined) {
            const parsedCount = parseInt(countResult.toString(), 10);
            countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
          }
        } catch (error) {
          console.error('Error counting alarm process log:', error);
          countAlarmDeviceControl = 0;
        }
        if (countAlarmDeviceControl >= 1) {
          if (alarmStatusSet == 999) {
            var status_del: any = 1;
            await this.settingsService.delete_alarmprocesslogal(
              fillter_device_control,
            );
          }
        }
        if (countAlarmDeviceControl == 0) {
          var Option: any = 1;
          var msg: any = 'device_access_control_new';
          var rs1: any = 0;
          var fillterData: any = {};
          if (alarm_action_id) {
            fillterData.alarm_action_id = alarm_action_id;
          }
          if (eventSet) {
            fillterData.event = eventSet;
          }
          if (type_id) {
            fillterData.type_id = type_id;
          }
          if (date_now) {
            fillterData.date = date_now;
          }
          if (time_now) {
            fillterData.time = time_now;
          }
          if (alarmStatusSet == 1) {
            fillterData.status_warning = dto.status_warning;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 2) {
            fillterData.status_alert = dto.status_alert;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 3) {
            fillterData.recovery_warning = dto.recovery_warning;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 4) {
            fillterData.recovery_alert = dto.recovery_alert;
            fillterData.alarm_status = alarmStatusSet;
          }
          var isDuplicate = await this.settingsService.checkDuplicateLogOne(
            inputCreate,
          );
          if (!isDuplicate) {
            await this.settingsService.manageAlarmLogRecovery(
              inputCreate,
              fillterData,
              validate_count,
            );
          }
          await this.mqtt_control_device(
            mqtt_access_control,
            messageMqttControls,
          );
        } else {
          var inputCreate: any = {
            alarm_action_id: alarm_action_id,
            device_id: device_id2,
            type_id: type_id,
            event: eventSet,
            status: 1,
            alarm_type: alarmTypeId,
            status_warning: dto.status_warning,
            recovery_warning: dto.recovery_warning,
            status_alert: dto.status_alert,
            recovery_alert: dto.recovery_alert,
            email_alarm: 0,
            line_alarm: 0,
            telegram_alarm: 0,
            sms_alarm: 0,
            nonc_alarm: 1,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: dataAlarm,
            createddate: new Date(),
            updateddate: new Date(),
            ata_alarm: dataAlarm,
            alarm_status: alarmStatusSet,
            subject: subject + ` SENEOR Alarm `,
            content: content + ` SENEOR Alarm `,
          };
          var now_time_full: any = format.timeConvertermas(
            format.convertTZ(
              format.getCurrentFullDatenow(),
              process.env.tzString,
            ),
          );
          var setdatachk_main: any = {};
          setdatachk_main.alarm_action_id = alarm_action_id;
          setdatachk_main.device_id = device_id2;
          var crsmaster: any =
            await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
          if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
            var createddate_logs_control: any = format.timeConvertermas(
              format.convertTZ(crsmaster[0].createddate, process.env.tzString),
            );
          } else {
            // กำหนดค่า default หรือข้ามไป
            var createddate_logs_control: any = null;
          }
          // แก้ไขจุดที่ 2: ตรวจสอบ crsmaster ก่อนเข้าถึง length
          var countalarm_LogSensor: number = 0;
          if (crsmaster && Array.isArray(crsmaster)) {
            countalarm_LogSensor = crsmaster.length;
          }
          if (crsmaster && crsmaster.length > 0) {
            var createddate_logsMaim: any = format.timeConvertermas(
              format.convertTZ(crsmaster[0].createddate, process.env.tzString),
            );
            var now_time_cal_main: number = Number(
              format.diffMinutes(now_time_full, createddate_logsMaim),
            );
            // ตรวจสอบว่า now_time_cal_main เป็นตัวเลขที่ถูกต้อง
            if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
              var mqttconnect: any = [];
              var setdatachk_main: any = {};
              setdatachk_main.alarm_action_id = alarm_action_id;
              setdatachk_main.device_id = device_id2;
              setdatachk_main.alarm_status = alarmStatusSet;
              setdatachk_main.date = format.getCurrentDatenow();
              setdatachk_main.time = format.getCurrentTimenow();
              var crsmaster: any =
                await this.settingsService.checkDuplicateLogSensor(
                  setdatachk_main,
                );
              var countalarm_LogSensor: number = 0;
              if (crsmaster && Array.isArray(crsmaster)) {
                countalarm_LogSensor = crsmaster.length;
              }
              if (countalarm_LogSensor == 0) {
                var isDuplicate =
                  await this.settingsService.checkDuplicateLogTwo(inputCreate);
                if (!isDuplicate) {
                  await this.settingsService.manageAlarmLogRecoveryTwo(
                    inputCreate,
                    fillterDataSENSOR,
                    validate_count,
                  );
                }
              }
              if (countalarm_LogSensor >= validate_count) {
                if (alarmStatusSet == 999) {
                  const fillter_device_control: any = {};
                  fillter_device_control.alarm_action_id = alarm_action_id;
                  fillter_device_control.alarm_status = alarmStatusSet;
                  var status_del: any = 2;
                  await this.settingsService.delete_alarmprocesslogal(
                    fillter_device_control,
                  );
                  return { msg, alarmStatusSet };
                }
              }

              var devicecontroliot: any = [];
              //******************/
              if (device) {
                for (const [key, value] of Object.entries(device)) {
                  var va: any = device[key];
                  var device_id: any = va.device_id;
                  var mqtt_id: any = va.mqtt_id;
                  var setting_id: any = va.setting_id;
                  var action_id: any = va.action_id;
                  var status_alert_id: any = va.status_alert_id;
                  var type_ids: any = va.type_id;
                  var device_name: any = va.device_name;
                  var work_status: any = va.work_status;
                  var mqtt_data_value: any = va.mqtt_data_value;
                  var mqtt_data_control: any = va.mqtt_data_control;
                  var measurement: any = va.measurement;
                  var mqtt_control_on: any = va.mqtt_control_on;
                  var mqtt_control_off: any = va.mqtt_control_off;
                  var bucket: any = va.bucket;
                  var timestamp: any = va.timestamp;
                  var mqtt_device_name: any = va.mqtt_device_name;
                  var id: any = va.id;
                  var alarm_action_ids: any = va.alarm_action_id;
                  //var device_id = rs.device_id;
                  var mqtt_get_data: any = encodeURI(mqtt_data_value);
                  var mqtt_data_control: any = encodeURI(mqtt_data_control);
                  if (event == 1) {
                    var messageMqttControls: any = encodeURI(mqtt_control_on);
                    var eventSet: number = 1;
                  } else {
                    var messageMqttControls: any = encodeURI(mqtt_control_off);
                    var eventSet: number = 0;
                  }
                  await this.mqtt_control_device(
                    mqtt_access_control,
                    messageMqttControls,
                  );
                  // await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                  var arraydatarr: any = {
                    id,
                    device_id,
                    alarm_action_id,
                    mqtt_id,
                    setting_id,
                    status_alert_id,
                    device_name,
                    work_status,
                    mqtt_data_value,
                    mqtt_data_control,
                    bucket,
                  };
                  devicecontroliot.push(arraydatarr);
                }
              }
            }
          }
        }
      } else if (alarmStatusSet === 3 || alarmStatusSet === 4) {
        var rs: any = await this.device_access_control_check(dtos);
        var mqttconnect: any = [];
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id;
        setdatachk_main.alarm_status = alarmStatusSet;
        setdatachk_main.date = format.getCurrentDatenow();
        setdatachk_main.time = format.getCurrentTimenow();

        var crsmaster: any = await this.settingsService.checkDuplicateLogSensor(
          setdatachk_main,
        );

        // แก้ไขจุดที่ 4: ตรวจสอบ crsmaster อีกครั้ง
        var countalarm_LogSensor: number = 0;
        if (crsmaster && Array.isArray(crsmaster)) {
          countalarm_LogSensor = crsmaster.length;
        }

        if (countalarm_LogSensor == 0) {
          var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
            inputCreate,
          );
          if (!isDuplicate) {
            await this.settingsService.manageAlarmLogRecoveryTwo(
              inputCreate,
              fillterDataSENSOR,
              validate_count,
            );
          }

          var devicecontroliot: any = [];
          //******************/
          if (device) {
            for (const [key, value] of Object.entries(device)) {
              var va: any = device[key];
              var device_id: any = va.device_id;
              var mqtt_id: any = va.mqtt_id;
              var setting_id: any = va.setting_id;
              var action_id: any = va.action_id;
              var status_alert_id: any = va.status_alert_id;
              var type_ids: any = va.type_id;
              var device_name: any = va.device_name;
              var work_status: any = va.work_status;
              var mqtt_data_value: any = va.mqtt_data_value;
              var mqtt_data_controls: any = va.mqtt_data_control;
              var measurement: any = va.measurement;
              var mqtt_control_on: any = va.mqtt_control_on;
              var mqtt_control_off: any = va.mqtt_control_off;
              var bucket: any = va.bucket;
              var timestamp: any = va.timestamp;
              var mqtt_device_name: any = va.mqtt_device_name;
              var id: any = va.id;
              var alarm_action_ids: any = va.alarm_action_id;
              //var device_id = rs.device_id;

              var mqtt_get_data: any = encodeURI(mqtt_data_value);
              var mqtt_data_control: any = encodeURI(mqtt_data_controls);

              if (event == 1) {
                var messageMqttControls: any = encodeURI(mqtt_control_on);
                var eventSet: number = 1;
              } else {
                var messageMqttControls: any = encodeURI(mqtt_control_off);
                var eventSet: number = 0;
              }

              await this.mqtt_control_device(
                mqtt_data_control,
                messageMqttControls,
              );

              var arraydatarr: any = {
                id,
                device_id,
                alarm_action_id,
                mqtt_id,
                setting_id,
                status_alert_id,
                device_name,
                work_status,
                mqtt_data_value,
                mqtt_data_control,
                bucket,
              };
              devicecontroliot.push(arraydatarr);
            }
          }
        }

        if (countalarm_LogSensor >= validate_count) {
          // if (alarmStatusSet == 999) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          fillter_device_control.alarm_status = alarmStatusSet;
          var status_del: any = 3;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
          return alarmStatusSet;
          // }

          var devicecontroliot: any = [];
          //******************/
          if (device) {
            for (const [key, value] of Object.entries(device)) {
              var va: any = device[key];
              var device_id: any = va.device_id;
              var mqtt_id: any = va.mqtt_id;
              var setting_id: any = va.setting_id;
              var action_id: any = va.action_id;
              var status_alert_id: any = va.status_alert_id;
              var type_ids: any = va.type_id;
              var device_name: any = va.device_name;
              var work_status: any = va.work_status;
              var mqtt_data_value: any = va.mqtt_data_value;
              var mqtt_data_control: any = va.mqtt_data_control;
              var measurement: any = va.measurement;
              var mqtt_control_on: any = va.mqtt_control_on;
              var mqtt_control_off: any = va.mqtt_control_off;
              var bucket: any = va.bucket;
              var timestamp: any = va.timestamp;
              var mqtt_device_name: any = va.mqtt_device_name;
              var id: any = va.id;
              var alarm_action_ids: any = va.alarm_action_id;
              //var device_id = rs.device_id;

              var mqtt_get_data: any = encodeURI(mqtt_data_value);
              var mqtt_data_control: any = encodeURI(mqtt_data_control);

              if (event == 1) {
                var messageMqttControls: any = encodeURI(mqtt_control_on);
                var eventSet: number = 1;
              } else {
                var messageMqttControls: any = encodeURI(mqtt_control_off);
                var eventSet: number = 0;
              }

              await this.mqtt_control_device(
                mqtt_data_control,
                messageMqttControls,
              );

              var arraydatarr: any = {
                id,
                device_id,
                alarm_action_id,
                mqtt_id,
                setting_id,
                status_alert_id,
                device_name,
                work_status,
                mqtt_data_value,
                mqtt_data_control,
                bucket,
              };
              devicecontroliot.push(arraydatarr);
            }
          }
          //******************/
        }
      } else if (alarmStatusSet === 999) {
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.device_id = device_id;
        var countAlarmDeviceControl: number = 0;
        try {
          const countResult: any =
            await this.settingsService.count_alarmprocesslog(
              fillter_device_control,
            );
          if (countResult !== null && countResult !== undefined) {
            const parsedCount = parseInt(countResult.toString(), 10);
            countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
          }
        } catch (error) {
          countAlarmDeviceControl = 0;
          console.error(`Error processing :`, error);
        }
        if (countAlarmDeviceControl >= validate_count) {
          var status_del: any = 4;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id;
        // var crsmaster_log: any = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
        // var countalarmLogSensor :any = crsmaster_log.length;
        // var parsedCounts:number = parseInt(countalarmLogSensor);
        var parsedCount: any = await this.settingsService.count_alarmprocesslog(
          setdatachk_main,
        );
        if (parsedCount >= validate_count) {
          var status_del: any = 5;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
      }
    } catch (error) {
      console.error('Error in alarm processing:', error);
      throw new Error(`Alarm processing failed: ${error.message}`);
    }
    /***************Alarm Status **************/
    var Rss: any = {
      alarmStatusSet,
      device_id,
      type_id,
      action_name,
      bucket,
      subject,
      content,
      status,
      dataAlarm,
      eventControl,
      messageMqttControl,
      sensor_data,
      count_alarm,
      deviceCount: device.length,
      mqtt_name: dto.mqtt_name,
      device_name: dto.device_name,
      mqtt_control_on: dto.mqtt_control_on,
      mqtt_control_off: dto.mqtt_control_off,
      mqtt_data_value: dto.mqtt_data_value,
      mqtt_data_control: dto.mqtt_data_control,
      location_id: dto.location_id,
      fillterData,
      value_data: dto.value_data,
      status_alert: dto.status_alert,
      status_warning: dto.status_warning,
      recovery_warning: dto.recovery_warning,
      recovery_alert: dto.recovery_alert,
      count_arry: {
        status_del,
        parsedCount,
        countAlarmDeviceControl,
        validate_count,
      },
      //,filter:{dto,dtos,device,deviceFillter}
    };
    return await Rss;
  }
  async alarm_device_arr_to_event_email(dto: any) {
    var status_del: any = 0;
    var parsedCounts: number = 0;
    var countAlarmDeviceControl: number = 0;
    var validate_count: number = 0;
    // Validate input
    if (!dto) {
      throw new Error('DTO is required');
    }
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน

    var timestamps: any = datePart + ' ' + timePart;
    var date_now: any = format.getCurrentDatenow();
    var time_now: any = format.getCurrentTimenow();
    //var UrlMqtt:any = process.env.MQTT_HOST;
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      var Mqttstatus: any = checkConnectionMqtt.status;
    } else {
      var Mqttstatus: any = false;
    }

    var setOption = dto.setOption;
    var cachetimeset = dto.cachetimeset;
    var cachetimeset1 = dto.cachetimeset1;
    var cachetimeset2 = dto.cachetimeset2;
    var cachetimeset3 = dto.cachetimeset3;
    var cachetimeset4 = dto.cachetimeset4;
    var deletecache = dto.deletecache;
    var kaycache_cache_a1 = dto.kaycache_cache_a1;
    var device_id2: number = parseInt(dto.device_id2);
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var device_id_mas: number = parseInt(dto.device_id_mas);
    if (!dto.device_id_mas) {
      var device_id_mas: number = parseInt(dto.device_id);
    }
    var crsmasterio = dto.crsmasterio;
    var countalarm_master_io = dto.countalarm_master_io;
    var device_control = dto.device_control;
    var device_control_map_count = dto.device_control_map_count;
    var event: number = parseInt(dto.event);
    var eventSet: number = parseInt(dto.event);
    var time_life: any = dto.time_life;
    var bucket: any = dto.bucket;
    var location_id: any = dto.location_id;
    var device_id: any = dto.device_id;
    var values: any = dto.values;
    var mqtt_data_value: any = dto.mqtt_data_value;
    var mqtt_data_control: any = dto.mqtt_data_control;
    var configdata: any = dto.configdata;
    var mqtt_status_data_name: any = dto.mqtt_status_data_name;
    var type_id: number = parseInt(dto.type_id);
    var alarmTypeId: any = type_id;
    var status_alert: any = dto.status_alert;
    var status_warning: any = dto.status_warning;
    var recovery_warning: any = dto.recovery_warning;
    var recovery_alert: any = dto.recovery_alert;
    var mqtt_name: any = dto.mqtt_name;
    var device_name: any = dto.device_name;
    var action_name: any = dto.action_name;
    var mqtt_control_on: any = dto.mqtt_control_on;
    var mqtt_control_off: any = dto.mqtt_control_off;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var subject: any = dto.subject;
    var content: any = dto.content;
    var status: any = dto.status;
    var alarmStatusSet: any = parseInt(dto.alarmStatusSet);
    var dataAlarm: any = dto.dataAlarm;
    var eventControl: any = dto.eventControl;
    var messageMqttControl: any = dto.messageMqttControl;
    var sensor_data: any = dto.sensor_data;
    var count_alarm = dto.count_alarm;
    var mqttconnect: any = [];
    var dtos: any = {};
    dtos.cachetimeset = cachetimeset;
    dtos.cachetimeset2 = cachetimeset2;
    dtos.deletecache = deletecache;
    dtos.kaycache_cache_a1 = kaycache_cache_a1;
    dtos.alarm_action_id = alarm_action_id;
    dtos.device_id_mas = device_id_mas;
    dtos.crsmasterio = crsmasterio;
    dtos.countalarm_master_io = countalarm_master_io;
    dtos.device_control = device_control;
    dtos.device_control_map_count = device_control_map_count;
    //dtos.values=dto.values;
    dtos.configdata = dto.configdata;
    dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
    dtos.type_id = dto.type_id;
    dtos.status_alert = dto.status_alert;
    dtos.status_warning = dto.status_warning;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_alert = dto.ecovery_alert;
    dtos.mqtt_name = dto.mqtt_name;
    dtos.device_name = dto.device_name;
    dtos.action_name = dto.action_name;
    dtos.mqtt_control_on = dto.mqtt_control_on;
    dtos.mqtt_control_off = dto.mqtt_control_off;
    dtos.mqtt_data_value = dto.mqtt_data_value;
    dtos.mqtt_data_control = dto.mqtt_data_control;
    dtos.location_id = dto.location_id;
    dtos.time_life = dto.time_life;
    dtos.device_id = dto.device_id;
    dtos.event = dto.event;
    dtos.bucket = dto.device_bucket;
    dtos.cachetimeset = dto.cachetimeset;
    dtos.deletecache = dto.deletecache;
    dtos.setOption = 1;
    if (alarmStatusSet == 1) {
      var validate_count: number = parseInt('3');
    } else if (alarmStatusSet == 2) {
      var validate_count: number = parseInt('3');
    } else if (alarmStatusSet == 3) {
      var validate_count: number = parseInt('1');
    } else {
      var validate_count: number = parseInt('1');
    }
    var fillterDataSENSOR: any = {};
    if (alarm_action_id) {
      fillterDataSENSOR.alarm_action_id = alarm_action_id;
    }
    if (eventSet) {
      fillterDataSENSOR.event = eventSet;
    }
    if (date_now) {
      fillterDataSENSOR.date = date_now;
    }
    if (time_now) {
      fillterDataSENSOR.time = time_now;
    }
    if (alarmStatusSet == 1) {
      fillterDataSENSOR.status_warning = dto.status_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 2) {
      fillterDataSENSOR.status_alert = dto.status_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 3) {
      fillterDataSENSOR.recovery_warning = dto.recovery_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 4) {
      fillterDataSENSOR.recovery_alert = dto.recovery_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    }

    var inputCreate: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id2,
      type_id: type_id,
      event: eventSet,
      status: 1,
      alarm_type: alarmTypeId,
      status_warning: dto.status_warning,
      recovery_warning: dto.recovery_warning,
      status_alert: dto.status_alert,
      recovery_alert: dto.recovery_alert,
      email_alarm: 0,
      line_alarm: 0,
      telegram_alarm: 0,
      sms_alarm: 0,
      nonc_alarm: 1,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: dataAlarm,
      createddate: new Date(),
      updateddate: new Date(),
      ata_alarm: dataAlarm,
      alarm_status: alarmStatusSet,
      subject: subject,
      content: content,
    };
    var deviceFillter: any = {
      alarm_action_id: alarm_action_id,
      device_id: dto.device_id2,
      device_id_mas: device_id_mas,
      bucket: bucket,
    };
    /**************Cache*************/
    var kaycachecache: any =
      'alarm_device_id_event_rss_iot_crt' +
      md5(alarm_action_id + '-' + device_id + '-' + bucket);
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycachecache);
    }
    var device: any = await Cache.GetCacheData(kaycachecache);
    if (device) {
      var device: any = device;
    } else if (!device) {
      var device: any = await this.settingsService.alarm_device_id_event_crt(
        deviceFillter,
      );
      var rs: any = {
        keycache: `${kaycachecache}`,
        time: cachetimeset,
        data: device,
      };
      await Cache.SetCacheData(rs);
      var cache_data_alarmdevice: any = 'no cache';
    }
    /**************Cache*************/
    /***************Alarm Status **************/
    try {
      if (alarmStatusSet === 1 || alarmStatusSet === 2) {
        var mqtt_get_data: any = encodeURI(mqtt_data_value);
        var mqtt_access_control: any = encodeURI(mqtt_data_control);
        if (event == 1) {
          var messageMqttControls: any = mqtt_control_on;
          var eventSet: number = parseInt('1');
        } else {
          var messageMqttControls: any = mqtt_control_off;
          var eventSet: number = parseInt('0');
        }
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.device_id = device_id2;
        //  ตรวจสอบค่า countResult ก่อนแปลง
        var countAlarmDeviceControl: number = parseInt('0');
        try {
          const countResult: any =
            await this.settingsService.count_alarmprocesslog(
              fillter_device_control,
            );
          // ตรวจสอบว่า countResult ไม่ใช่ null/undefined และสามารถแปลงเป็นตัวเลขได้
          if (countResult !== null && countResult !== undefined) {
            const parsedCount = parseInt(countResult.toString(), 10);
            countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
          }
        } catch (error) {
          console.error('Error counting alarm process log:', error);
          countAlarmDeviceControl = 0;
        }
        if (countAlarmDeviceControl >= 1) {
          if (alarmStatusSet == 999) {
            var status_del: any = 1;
            await this.settingsService.delete_alarmprocesslogal(
              fillter_device_control,
            );
          }
        }
        if (countAlarmDeviceControl == 0) {
          var Option: any = 1;
          var msg: any = 'device_access_control_new';
          var rs1: any = 0;
          var fillterData: any = {};
          if (alarm_action_id) {
            fillterData.alarm_action_id = alarm_action_id;
          }
          if (eventSet) {
            fillterData.event = eventSet;
          }
          if (type_id) {
            fillterData.type_id = type_id;
          }
          if (date_now) {
            fillterData.date = date_now;
          }
          if (time_now) {
            fillterData.time = time_now;
          }
          if (alarmStatusSet == 1) {
            fillterData.status_warning = dto.status_warning;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 2) {
            fillterData.status_alert = dto.status_alert;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 3) {
            fillterData.recovery_warning = dto.recovery_warning;
            fillterData.alarm_status = alarmStatusSet;
          } else if (alarmStatusSet == 4) {
            fillterData.recovery_alert = dto.recovery_alert;
            fillterData.alarm_status = alarmStatusSet;
          }
          var isDuplicate = await this.settingsService.checkDuplicateLogOne(
            inputCreate,
          );
          if (!isDuplicate) {
            await this.settingsService.manageAlarmLogRecovery(
              inputCreate,
              fillterData,
              validate_count,
            );
          }
          await this.mqtt_control_device(
            mqtt_access_control,
            messageMqttControls,
          );
        } else {
          var inputCreate: any = {
            alarm_action_id: alarm_action_id,
            device_id: device_id2,
            type_id: type_id,
            event: eventSet,
            status: 1,
            alarm_type: alarmTypeId,
            status_warning: dto.status_warning,
            recovery_warning: dto.recovery_warning,
            status_alert: dto.status_alert,
            recovery_alert: dto.recovery_alert,
            email_alarm: 0,
            line_alarm: 0,
            telegram_alarm: 0,
            sms_alarm: 0,
            nonc_alarm: 1,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: dataAlarm,
            createddate: new Date(),
            updateddate: new Date(),
            ata_alarm: dataAlarm,
            alarm_status: alarmStatusSet,
            subject: subject + ` SENEOR Alarm `,
            content: content + ` SENEOR Alarm `,
          };
          var now_time_full: any = format.timeConvertermas(
            format.convertTZ(
              format.getCurrentFullDatenow(),
              process.env.tzString,
            ),
          );
          var setdatachk_main: any = {};
          setdatachk_main.alarm_action_id = alarm_action_id;
          setdatachk_main.device_id = device_id2;
          var crsmaster: any =
            await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
          if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
            var createddate_logs_control: any = format.timeConvertermas(
              format.convertTZ(crsmaster[0].createddate, process.env.tzString),
            );
          } else {
            // กำหนดค่า default หรือข้ามไป
            var createddate_logs_control: any = null;
          }
          // แก้ไขจุดที่ 2: ตรวจสอบ crsmaster ก่อนเข้าถึง length
          var countalarm_LogSensor: number = 0;
          if (crsmaster && Array.isArray(crsmaster)) {
            countalarm_LogSensor = crsmaster.length;
          }
          if (crsmaster && crsmaster.length > 0) {
            var createddate_logsMaim: any = format.timeConvertermas(
              format.convertTZ(crsmaster[0].createddate, process.env.tzString),
            );
            var now_time_cal_main: number = Number(
              format.diffMinutes(now_time_full, createddate_logsMaim),
            );
            // ตรวจสอบว่า now_time_cal_main เป็นตัวเลขที่ถูกต้อง
            if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
              var mqttconnect: any = [];
              var setdatachk_main: any = {};
              setdatachk_main.alarm_action_id = alarm_action_id;
              setdatachk_main.device_id = device_id2;
              setdatachk_main.alarm_status = alarmStatusSet;
              setdatachk_main.date = format.getCurrentDatenow();
              setdatachk_main.time = format.getCurrentTimenow();
              var crsmaster: any =
                await this.settingsService.checkDuplicateLogSensor(
                  setdatachk_main,
                );
              var countalarm_LogSensor: number = 0;
              if (crsmaster && Array.isArray(crsmaster)) {
                countalarm_LogSensor = crsmaster.length;
              }
              if (countalarm_LogSensor == 0) {
                var isDuplicate =
                  await this.settingsService.checkDuplicateLogTwo(inputCreate);
                if (!isDuplicate) {
                  await this.settingsService.manageAlarmLogRecoveryTwo(
                    inputCreate,
                    fillterDataSENSOR,
                    validate_count,
                  );
                }
              }
              if (countalarm_LogSensor >= validate_count) {
                if (alarmStatusSet == 999) {
                  const fillter_device_control: any = {};
                  fillter_device_control.alarm_action_id = alarm_action_id;
                  fillter_device_control.alarm_status = alarmStatusSet;
                  var status_del: any = 2;
                  await this.settingsService.delete_alarmprocesslogal(
                    fillter_device_control,
                  );
                  return { msg, alarmStatusSet };
                }
              }

              var devicecontroliot: any = [];
              //******************/
              if (device) {
                for (const [key, value] of Object.entries(device)) {
                  var va: any = device[key];
                  var device_id: any = va.device_id;
                  var mqtt_id: any = va.mqtt_id;
                  var setting_id: any = va.setting_id;
                  var action_id: any = va.action_id;
                  var status_alert_id: any = va.status_alert_id;
                  var type_ids: any = va.type_id;
                  var device_name: any = va.device_name;
                  var work_status: any = va.work_status;
                  var mqtt_data_value: any = va.mqtt_data_value;
                  var mqtt_data_control: any = va.mqtt_data_control;
                  var measurement: any = va.measurement;
                  var mqtt_control_on: any = va.mqtt_control_on;
                  var mqtt_control_off: any = va.mqtt_control_off;
                  var bucket: any = va.bucket;
                  var timestamp: any = va.timestamp;
                  var mqtt_device_name: any = va.mqtt_device_name;
                  var id: any = va.id;
                  var alarm_action_ids: any = va.alarm_action_id;
                  //var device_id = rs.device_id;
                  var mqtt_get_data: any = encodeURI(mqtt_data_value);
                  var mqtt_data_control: any = encodeURI(mqtt_data_control);
                  if (event == 1) {
                    var messageMqttControls: any = encodeURI(mqtt_control_on);
                    var eventSet: number = 1;
                  } else {
                    var messageMqttControls: any = encodeURI(mqtt_control_off);
                    var eventSet: number = 0;
                  }
                  await this.mqtt_control_device(
                    mqtt_access_control,
                    messageMqttControls,
                  );
                  // await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                  var arraydatarr: any = {
                    id,
                    device_id,
                    alarm_action_id,
                    mqtt_id,
                    setting_id,
                    status_alert_id,
                    device_name,
                    work_status,
                    mqtt_data_value,
                    mqtt_data_control,
                    bucket,
                  };
                  devicecontroliot.push(arraydatarr);
                }
              }
            }
          }
        }
      } else if (alarmStatusSet === 3 || alarmStatusSet === 4) {
        var rs: any = await this.device_access_control_check(dtos);
        var mqttconnect: any = [];
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id;
        setdatachk_main.alarm_status = alarmStatusSet;
        setdatachk_main.date = format.getCurrentDatenow();
        setdatachk_main.time = format.getCurrentTimenow();

        var crsmaster: any = await this.settingsService.checkDuplicateLogSensor(
          setdatachk_main,
        );

        // แก้ไขจุดที่ 4: ตรวจสอบ crsmaster อีกครั้ง
        var countalarm_LogSensor: number = 0;
        if (crsmaster && Array.isArray(crsmaster)) {
          countalarm_LogSensor = crsmaster.length;
        }

        if (countalarm_LogSensor == 0) {
          var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
            inputCreate,
          );
          if (!isDuplicate) {
            await this.settingsService.manageAlarmLogRecoveryTwo(
              inputCreate,
              fillterDataSENSOR,
              validate_count,
            );
          }

          var devicecontroliot: any = [];
          //******************/
          if (device) {
            for (const [key, value] of Object.entries(device)) {
              var va: any = device[key];
              var device_id: any = va.device_id;
              var mqtt_id: any = va.mqtt_id;
              var setting_id: any = va.setting_id;
              var action_id: any = va.action_id;
              var status_alert_id: any = va.status_alert_id;
              var type_ids: any = va.type_id;
              var device_name: any = va.device_name;
              var work_status: any = va.work_status;
              var mqtt_data_value: any = va.mqtt_data_value;
              var mqtt_data_controls: any = va.mqtt_data_control;
              var measurement: any = va.measurement;
              var mqtt_control_on: any = va.mqtt_control_on;
              var mqtt_control_off: any = va.mqtt_control_off;
              var bucket: any = va.bucket;
              var timestamp: any = va.timestamp;
              var mqtt_device_name: any = va.mqtt_device_name;
              var id: any = va.id;
              var alarm_action_ids: any = va.alarm_action_id;
              //var device_id = rs.device_id;

              var mqtt_get_data: any = encodeURI(mqtt_data_value);
              var mqtt_data_control: any = encodeURI(mqtt_data_controls);

              if (event == 1) {
                var messageMqttControls: any = encodeURI(mqtt_control_on);
                var eventSet: number = 1;
              } else {
                var messageMqttControls: any = encodeURI(mqtt_control_off);
                var eventSet: number = 0;
              }

              await this.mqtt_control_device(
                mqtt_data_control,
                messageMqttControls,
              );

              var arraydatarr: any = {
                id,
                device_id,
                alarm_action_id,
                mqtt_id,
                setting_id,
                status_alert_id,
                device_name,
                work_status,
                mqtt_data_value,
                mqtt_data_control,
                bucket,
              };
              devicecontroliot.push(arraydatarr);
            }
          }
        }

        if (countalarm_LogSensor >= validate_count) {
          // if (alarmStatusSet == 999) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          fillter_device_control.alarm_status = alarmStatusSet;
          var status_del: any = 3;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
          return alarmStatusSet;
          // }

          var devicecontroliot: any = [];
          //******************/
          if (device) {
            for (const [key, value] of Object.entries(device)) {
              var va: any = device[key];
              var device_id: any = va.device_id;
              var mqtt_id: any = va.mqtt_id;
              var setting_id: any = va.setting_id;
              var action_id: any = va.action_id;
              var status_alert_id: any = va.status_alert_id;
              var type_ids: any = va.type_id;
              var device_name: any = va.device_name;
              var work_status: any = va.work_status;
              var mqtt_data_value: any = va.mqtt_data_value;
              var mqtt_data_control: any = va.mqtt_data_control;
              var measurement: any = va.measurement;
              var mqtt_control_on: any = va.mqtt_control_on;
              var mqtt_control_off: any = va.mqtt_control_off;
              var bucket: any = va.bucket;
              var timestamp: any = va.timestamp;
              var mqtt_device_name: any = va.mqtt_device_name;
              var id: any = va.id;
              var alarm_action_ids: any = va.alarm_action_id;
              //var device_id = rs.device_id;

              var mqtt_get_data: any = encodeURI(mqtt_data_value);
              var mqtt_data_control: any = encodeURI(mqtt_data_control);

              if (event == 1) {
                var messageMqttControls: any = encodeURI(mqtt_control_on);
                var eventSet: number = 1;
              } else {
                var messageMqttControls: any = encodeURI(mqtt_control_off);
                var eventSet: number = 0;
              }

              await this.mqtt_control_device(
                mqtt_data_control,
                messageMqttControls,
              );

              var arraydatarr: any = {
                id,
                device_id,
                alarm_action_id,
                mqtt_id,
                setting_id,
                status_alert_id,
                device_name,
                work_status,
                mqtt_data_value,
                mqtt_data_control,
                bucket,
              };
              devicecontroliot.push(arraydatarr);
            }
          }
          //******************/
        }
      } else if (alarmStatusSet === 999) {
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.device_id = device_id;
        var countAlarmDeviceControl: number = 0;
        try {
          const countResult: any =
            await this.settingsService.count_alarmprocesslog(
              fillter_device_control,
            );
          if (countResult !== null && countResult !== undefined) {
            const parsedCount = parseInt(countResult.toString(), 10);
            countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
          }
        } catch (error) {
          countAlarmDeviceControl = 0;
          console.error(`Error processing :`, error);
        }
        if (countAlarmDeviceControl >= validate_count) {
          var status_del: any = 4;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id;
        var parsedCount: any = await this.settingsService.count_alarmprocesslog(
          setdatachk_main,
        );
        if (parsedCount >= validate_count) {
          var status_del: any = 5;
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
      }
    } catch (error) {
      console.error('Error in alarm processing:', error);
      throw new Error(`Alarm processing failed: ${error.message}`);
    }
    /***************Alarm Status **************/
    var Rss: any = {
      alarmStatusSet,
      device_id,
      type_id,
      action_name,
      bucket,
      subject,
      content,
      status,
      dataAlarm,
      eventControl,
      messageMqttControl,
      sensor_data,
      count_alarm,
      deviceCount: device.length,
      mqtt_name: dto.mqtt_name,
      device_name: dto.device_name,
      mqtt_control_on: dto.mqtt_control_on,
      mqtt_control_off: dto.mqtt_control_off,
      mqtt_data_value: dto.mqtt_data_value,
      mqtt_data_control: dto.mqtt_data_control,
      location_id: dto.location_id,
      fillterData,
      value_data: dto.value_data,
      status_alert: dto.status_alert,
      status_warning: dto.status_warning,
      recovery_warning: dto.recovery_warning,
      recovery_alert: dto.recovery_alert,
      count_arry: {
        status_del,
        parsedCount,
        countAlarmDeviceControl,
        validate_count,
      },
    };
    return await Rss;
  }
  /***********************/
  async alarm_to_control_rss(dto: any) {
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน

    var timestamps: any = datePart + ' ' + timePart;
    var date_now: any = format.getCurrentDatenow();
    var time_now: any = format.getCurrentTimenow();
    //var UrlMqtt:any = process.env.MQTT_HOST;
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      var Mqttstatus: any = checkConnectionMqtt.status;
    } else {
      var Mqttstatus: any = false;
    }
    var setOption = dto.setOption;
    var cachetimeset = dto.cachetimeset;
    var cachetimeset1 = dto.cachetimeset1;
    var cachetimeset2 = dto.cachetimeset2;
    var cachetimeset3 = dto.cachetimeset3;
    var cachetimeset4 = dto.cachetimeset4;
    var deletecache = dto.deletecache;
    var kaycache_cache_a1 = dto.kaycache_cache_a1;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var device_id_mas: number = parseInt(dto.device_id_mas);
    if (!dto.device_id_mas) {
      var device_id_mas: number = parseInt(dto.device_id);
    }
    var crsmasterio = dto.crsmasterio;
    var countalarm_master_io = dto.countalarm_master_io;
    var device_control = dto.device_control;
    var device_control_map_count = dto.device_control_map_count;
    var event: number = parseInt(dto.event);
    var eventSet: number = parseInt(dto.event);
    var time_life: any = dto.time_life;
    var bucket: any = dto.bucket;
    var location_id: any = dto.location_id;
    var device_id: any = dto.device_id;
    var values: any = dto.values;
    var mqtt_data_value: any = dto.mqtt_data_value;
    var mqtt_data_control: any = dto.mqtt_data_control;
    var configdata: any = dto.configdata;
    var mqtt_status_data_name: any = dto.mqtt_status_data_name;
    var type_id: number = parseInt(dto.type_id);
    var alarmTypeId: any = type_id;
    var status_alert: any = dto.status_alert;
    var status_warning: any = dto.status_warning;
    var recovery_warning: any = dto.recovery_warning;
    var recovery_alert: any = dto.recovery_alert;
    var mqtt_name: any = dto.mqtt_name;
    var device_name: any = dto.device_name;
    var action_name: any = dto.action_name;
    var mqtt_control_on: any = dto.mqtt_control_on;
    var mqtt_control_off: any = dto.mqtt_control_off;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var subject: any = dto.subject;
    var content: any = dto.content;
    var status: any = dto.status;
    var alarmStatusSet: any = parseInt(dto.alarmStatusSet);
    var dataAlarm: any = dto.dataAlarm;
    var eventControl: any = dto.eventControl;
    var messageMqttControl: any = dto.messageMqttControl;
    var sensor_data: any = dto.sensor_data;
    var count_alarm = dto.count_alarm;
    var mqttconnect: any = [];
    var dtos: any = {};
    dtos.cachetimeset = cachetimeset;
    dtos.cachetimeset2 = cachetimeset2;
    dtos.deletecache = deletecache;
    dtos.kaycache_cache_a1 = kaycache_cache_a1;
    dtos.alarm_action_id = alarm_action_id;
    dtos.device_id_mas = device_id_mas;
    dtos.crsmasterio = crsmasterio;
    dtos.countalarm_master_io = countalarm_master_io;
    dtos.device_control = device_control;
    dtos.device_control_map_count = device_control_map_count;
    //dtos.values=dto.values;
    dtos.configdata = dto.configdata;
    dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
    dtos.type_id = dto.type_id;
    dtos.status_alert = dto.status_alert;
    dtos.status_warning = dto.status_warning;
    dtos.status_alert = dto.status_alert;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_alert = dto.recovery_alert;
    dtos.mqtt_name = dto.mqtt_name;
    dtos.device_name = dto.device_name;
    dtos.action_name = dto.action_name;
    dtos.mqtt_control_on = dto.mqtt_control_on;
    dtos.mqtt_control_off = dto.mqtt_control_off;
    dtos.mqtt_data_value = dto.mqtt_data_value;
    dtos.mqtt_data_control = dto.mqtt_data_control;
    dtos.location_id = dto.location_id;
    dtos.time_life = dto.time_life;
    dtos.device_id = dto.device_id;
    dtos.event = dto.event;
    dtos.bucket = dto.device_bucket;
    dtos.cachetimeset = dto.cachetimeset;
    dtos.deletecache = dto.deletecache;
    dtos.setOption = 1;
    if (alarmStatusSet == 1) {
      var validate_count: number = parseInt('2');
    } else if (alarmStatusSet == 2) {
      var validate_count: number = parseInt('2');
    } else if (alarmStatusSet == 3) {
      var validate_count: number = parseInt('1');
    } else {
      var validate_count: number = parseInt('1');
    }
    var fillterDataSENSOR: any = {};
    if (alarm_action_id) {
      fillterDataSENSOR.alarm_action_id = alarm_action_id;
    }
    if (eventSet) {
      fillterDataSENSOR.event = eventSet;
    }
    if (date_now) {
      fillterDataSENSOR.date = date_now;
    }
    if (time_now) {
      fillterDataSENSOR.time = time_now;
    }
    if (alarmStatusSet == 1) {
      fillterDataSENSOR.status_warning = status_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 2) {
      fillterDataSENSOR.status_alert = status_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 3) {
      fillterDataSENSOR.recovery_warning = recovery_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 4) {
      fillterDataSENSOR.recovery_alert = recovery_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    }

    var inputCreate: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id_mas,
      type_id: type_id,
      event: eventSet,
      status: 1,
      alarm_type: alarmTypeId,
      status_warning: status_warning,
      recovery_warning: recovery_warning,
      status_alert: status_alert,
      recovery_alert: recovery_alert,
      email_alarm: 0,
      line_alarm: 0,
      telegram_alarm: 0,
      sms_alarm: 0,
      nonc_alarm: 1,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: dataAlarm,
      createddate: new Date(),
      updateddate: new Date(),
      ata_alarm: dataAlarm,
      alarm_status: alarmStatusSet,
      subject: subject,
      content: content,
    };
    var deviceFillter: any = {
      alarm_action_id: alarm_action_id,
      device_id: dto.device_id,
      bucket: bucket,
    };
    /**************Cache*************/
    var kaycachecache: any =
      'alarm_device_id_event_rss_iot_crt' +
      md5(alarm_action_id + '-' + device_id + '-' + bucket);
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycachecache);
    }
    var device: any = await Cache.GetCacheData(kaycachecache);
    if (device) {
      var device: any = device;
    } else if (!device) {
      var device: any = await this.settingsService.alarm_device_id_event_crt(
        deviceFillter,
      );
      var rs: any = {
        keycache: `${kaycachecache}`,
        time: cachetimeset,
        data: device,
      };
      await Cache.SetCacheData(rs);
      var cache_data_alarmdevice: any = 'no cache';
    }
    /**************Cache*************/
    /***************Alarm Status **************/
    if (alarmStatusSet == 1 || alarmStatusSet == 2) {
      var mqtt_get_data: any = encodeURI(mqtt_data_value);
      var mqtt_access_control: any = encodeURI(mqtt_data_control);
      if (event == 1) {
        var messageMqttControls: any = mqtt_control_on;
        var eventSet: number = parseInt('1');
      } else {
        var messageMqttControls: any = mqtt_control_off;
        var eventSet: number = parseInt('0');
      }
      const fillter_device_control: any = {};
      fillter_device_control.alarm_action_id = alarm_action_id;

      //  ตรวจสอบค่า countResult ก่อนแปลง
      var countAlarmDeviceControl: number = parseInt('0');

      // var url:any ='http://172.25.99.10:3003/v1/mqtt/control?topic='+mqtt_access_control+'&message='+messageMqttControls;
      // await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
      // return {mqtt_access_control,messageMqttControls,alarmStatusSet,event,url,eventSet,fillter_device_control,countAlarmDeviceControl}

      try {
        const countResult: any =
          await this.settingsService.count_alarmprocesslog(
            fillter_device_control,
          );
        // ตรวจสอบว่า countResult ไม่ใช่ null/undefined และสามารถแปลงเป็นตัวเลขได้
        if (countResult !== null && countResult !== undefined) {
          const parsedCount = parseInt(countResult.toString(), 10);
          countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
        }
      } catch (error) {
        console.error('Error counting alarm process log:', error);
        countAlarmDeviceControl = 0;
      }
      if (countAlarmDeviceControl >= 1) {
        if (alarmStatusSet == 999) {
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
      }
      if (countAlarmDeviceControl == 0) {
        var Option: any = 1;
        var msg: any = 'device_access_control_new';
        var rs1: any = 0;
        var fillterData: any = {};
        if (alarm_action_id) {
          fillterData.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterData.event = eventSet;
        }
        if (type_id) {
          fillterData.type_id = type_id;
        }
        if (date_now) {
          fillterData.date = date_now;
        }
        if (time_now) {
          fillterData.time = time_now;
        }
        if (alarmStatusSet == 1) {
          fillterData.status_warning = status_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterData.status_alert = status_alert;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterData.recovery_warning = recovery_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterData.recovery_alert = recovery_alert;
          fillterData.alarm_status = alarmStatusSet;
        }
        var isDuplicate = await this.settingsService.checkDuplicateLogOne(
          inputCreate,
        );
        if (!isDuplicate) {
          await this.settingsService.manageAlarmLogRecovery(
            inputCreate,
            fillterData,
            validate_count,
          );
        }
        await this.mqtt_control_device(
          mqtt_access_control,
          messageMqttControls,
        );
      } else {
        var inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: subject + ` SENEOR Alarm `,
          content: content + ` SENEOR Alarm `,
        };
        var now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id_mas;
        var crsmaster: any = await this.settingsService.chk_alarm_temp_log_desc(
          setdatachk_main,
        );
        if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
          var createddate_logs_control: any = format.timeConvertermas(
            format.convertTZ(crsmaster[0].createddate, process.env.tzString),
          );
        } else {
          // กำหนดค่า default หรือข้ามไป
          var createddate_logs_control: any = null;
        }
        // แก้ไขจุดที่ 2: ตรวจสอบ crsmaster ก่อนเข้าถึง length
        var countalarm_LogSensor: number = 0;
        if (crsmaster && Array.isArray(crsmaster)) {
          countalarm_LogSensor = crsmaster.length;
        }
        if (crsmaster && crsmaster.length > 0) {
          var createddate_logsMaim: any = format.timeConvertermas(
            format.convertTZ(crsmaster[0].createddate, process.env.tzString),
          );
          var now_time_cal_main: number = Number(
            format.diffMinutes(now_time_full, createddate_logsMaim),
          );
          // ตรวจสอบว่า now_time_cal_main เป็นตัวเลขที่ถูกต้อง
          if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();
            var crsmaster: any =
              await this.settingsService.checkDuplicateLogSensor(
                setdatachk_main,
              );
            var countalarm_LogSensor: number = 0;
            if (crsmaster && Array.isArray(crsmaster)) {
              countalarm_LogSensor = crsmaster.length;
            }
            if (countalarm_LogSensor == 0) {
              var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
                inputCreate,
              );
              if (!isDuplicate) {
                await this.settingsService.manageAlarmLogRecoveryTwo(
                  inputCreate,
                  fillterDataSENSOR,
                  validate_count,
                );
              }
            }

            if (countalarm_LogSensor >= validate_count) {
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.alarm_status = alarmStatusSet;
                await this.settingsService.delete_alarmprocesslogal(
                  fillter_device_control,
                );
                return { msg, alarmStatusSet };
              }
            }

            var devicecontroliot: any = [];
            //******************/
            if (device) {
              for (const [key, value] of Object.entries(device)) {
                var va: any = device[key];
                var device_id: any = va.device_id;
                var mqtt_id: any = va.mqtt_id;
                var setting_id: any = va.setting_id;
                var action_id: any = va.action_id;
                var status_alert_id: any = va.status_alert_id;
                var type_ids: any = va.type_id;
                var device_name: any = va.device_name;
                var work_status: any = va.work_status;
                var mqtt_data_value: any = va.mqtt_data_value;
                var mqtt_data_control: any = va.mqtt_data_control;
                var measurement: any = va.measurement;
                var mqtt_control_on: any = va.mqtt_control_on;
                var mqtt_control_off: any = va.mqtt_control_off;
                var bucket: any = va.bucket;
                var timestamp: any = va.timestamp;
                var mqtt_device_name: any = va.mqtt_device_name;
                var id: any = va.id;
                var alarm_action_ids: any = va.alarm_action_id;
                var device_id = rs.device_id;
                var mqtt_get_data: any = encodeURI(mqtt_data_value);
                var mqtt_data_control: any = encodeURI(mqtt_data_control);
                if (event == 1) {
                  var messageMqttControls: any = encodeURI(mqtt_control_on);
                  var eventSet: number = 1;
                } else {
                  var messageMqttControls: any = encodeURI(mqtt_control_off);
                  var eventSet: number = 0;
                }
                await this.mqtt_control_device(
                  mqtt_access_control,
                  messageMqttControls,
                );
                // await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                var arraydatarr: any = {
                  id,
                  device_id,
                  alarm_action_id,
                  mqtt_id,
                  setting_id,
                  status_alert_id,
                  device_name,
                  work_status,
                  mqtt_data_value,
                  mqtt_data_control,
                  bucket,
                };
                devicecontroliot.push(arraydatarr);
              }
            }
          }
        }
      }
    } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
      var rs: any = await this.device_access_control_check(dtos);
      var mqttconnect: any = [];
      var setdatachk_main: any = {};
      setdatachk_main.alarm_action_id = alarm_action_id;
      setdatachk_main.device_id = device_id_mas;
      setdatachk_main.alarm_status = alarmStatusSet;
      setdatachk_main.date = format.getCurrentDatenow();
      setdatachk_main.time = format.getCurrentTimenow();

      var crsmaster: any = await this.settingsService.checkDuplicateLogSensor(
        setdatachk_main,
      );

      // แก้ไขจุดที่ 4: ตรวจสอบ crsmaster อีกครั้ง
      var countalarm_LogSensor: number = 0;
      if (crsmaster && Array.isArray(crsmaster)) {
        countalarm_LogSensor = crsmaster.length;
      }

      if (countalarm_LogSensor == 0) {
        var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
          inputCreate,
        );
        if (!isDuplicate) {
          await this.settingsService.manageAlarmLogRecoveryTwo(
            inputCreate,
            fillterDataSENSOR,
            validate_count,
          );
        }

        var devicecontroliot: any = [];
        //******************/
        if (device) {
          for (const [key, value] of Object.entries(device)) {
            var va: any = device[key];
            var device_id: any = va.device_id;
            var mqtt_id: any = va.mqtt_id;
            var setting_id: any = va.setting_id;
            var action_id: any = va.action_id;
            var status_alert_id: any = va.status_alert_id;
            var type_ids: any = va.type_id;
            var device_name: any = va.device_name;
            var work_status: any = va.work_status;
            var mqtt_data_value: any = va.mqtt_data_value;
            var mqtt_data_control: any = va.mqtt_data_control;
            var measurement: any = va.measurement;
            var mqtt_control_on: any = va.mqtt_control_on;
            var mqtt_control_off: any = va.mqtt_control_off;
            var bucket: any = va.bucket;
            var timestamp: any = va.timestamp;
            var mqtt_device_name: any = va.mqtt_device_name;
            var id: any = va.id;
            var alarm_action_ids: any = va.alarm_action_id;
            var device_id = rs.device_id;

            var mqtt_get_data: any = encodeURI(mqtt_data_value);
            var mqtt_data_control: any = encodeURI(mqtt_data_control);

            if (event == 1) {
              var messageMqttControls: any = encodeURI(mqtt_control_on);
              var eventSet: number = 1;
            } else {
              var messageMqttControls: any = encodeURI(mqtt_control_off);
              var eventSet: number = 0;
            }

            await this.mqtt_control_device(
              mqtt_data_control,
              messageMqttControls,
            );

            var arraydatarr: any = {
              id,
              device_id,
              alarm_action_id,
              mqtt_id,
              setting_id,
              status_alert_id,
              device_name,
              work_status,
              mqtt_data_value,
              mqtt_data_control,
              bucket,
            };
            devicecontroliot.push(arraydatarr);
          }
        }
        //******************/
      }

      if (countalarm_LogSensor >= validate_count) {
        // if (alarmStatusSet == 999) {
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.alarm_status = alarmStatusSet;
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
        return alarmStatusSet;
        // }

        var devicecontroliot: any = [];
        //******************/
        if (device) {
          for (const [key, value] of Object.entries(device)) {
            var va: any = device[key];
            var device_id: any = va.device_id;
            var mqtt_id: any = va.mqtt_id;
            var setting_id: any = va.setting_id;
            var action_id: any = va.action_id;
            var status_alert_id: any = va.status_alert_id;
            var type_ids: any = va.type_id;
            var device_name: any = va.device_name;
            var work_status: any = va.work_status;
            var mqtt_data_value: any = va.mqtt_data_value;
            var mqtt_data_control: any = va.mqtt_data_control;
            var measurement: any = va.measurement;
            var mqtt_control_on: any = va.mqtt_control_on;
            var mqtt_control_off: any = va.mqtt_control_off;
            var bucket: any = va.bucket;
            var timestamp: any = va.timestamp;
            var mqtt_device_name: any = va.mqtt_device_name;
            var id: any = va.id;
            var alarm_action_ids: any = va.alarm_action_id;
            var device_id = rs.device_id;

            var mqtt_get_data: any = encodeURI(mqtt_data_value);
            var mqtt_data_control: any = encodeURI(mqtt_data_control);

            if (event == 1) {
              var messageMqttControls: any = encodeURI(mqtt_control_on);
              var eventSet: number = 1;
            } else {
              var messageMqttControls: any = encodeURI(mqtt_control_off);
              var eventSet: number = 0;
            }

            await this.mqtt_control_device(
              mqtt_data_control,
              messageMqttControls,
            );

            var arraydatarr: any = {
              id,
              device_id,
              alarm_action_id,
              mqtt_id,
              setting_id,
              status_alert_id,
              device_name,
              work_status,
              mqtt_data_value,
              mqtt_data_control,
              bucket,
            };
            devicecontroliot.push(arraydatarr);
          }
        }
        //******************/
      }
    } else if (alarmStatusSet == 999) {
      const fillter_device_control: any = {};
      fillter_device_control.alarm_action_id = alarm_action_id;
      var countAlarmDeviceControl: number = 0;
      try {
        const countResult: any =
          await this.settingsService.count_alarmprocesslog(
            fillter_device_control,
          );
        if (countResult !== null && countResult !== undefined) {
          const parsedCount = parseInt(countResult.toString(), 10);
          countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
        }
      } catch (error) {
        countAlarmDeviceControl = 0;
      }
      if (countAlarmDeviceControl >= validate_count) {
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
      }
      var setdatachk_main: any = {};
      setdatachk_main.alarm_action_id = alarm_action_id;
      setdatachk_main.device_id = device_id_mas;
      var crsmaster: any = await this.settingsService.chk_alarm_temp_log_desc(
        setdatachk_main,
      );
      if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
        var createddate_logs_control: any = format.timeConvertermas(
          format.convertTZ(crsmaster[0].createddate, process.env.tzString),
        );
      } else {
        // กำหนดค่า default หรือข้ามไป
        var createddate_logs_control: any = null;
      }
      var countalarmLogSensor: any = crsmaster.length;
      var parsedCount: number = parseInt(countalarmLogSensor);
      if (parsedCount >= validate_count) {
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
      }
    }
    /***************Alarm Status **************/
    var Rss: any = {
      alarmStatusSet,
      action_name,
      bucket,
      subject,
      content,
      status,
      dataAlarm,
      eventControl,
      messageMqttControl,
      sensor_data,
      count_alarm,
      deviceCount: device.length,
      mqtt_name: dto.mqtt_name,
      device_name: dto.device_name,
      mqtt_control_on: dto.mqtt_control_on,
      mqtt_control_off: dto.mqtt_control_off,
      mqtt_data_value: dto.mqtt_data_value,
      mqtt_data_control: dto.mqtt_data_control,
      location_id: dto.location_id,
      deviceFillter,
      filter: { dto, dtos, device },
    };
    return await Rss;
  }
  async alarm_to_control_rss1(dto: any) {
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน

    var timestamps: any = datePart + ' ' + timePart;
    var date_now: any = format.getCurrentDatenow();
    var time_now: any = format.getCurrentTimenow();
    //var UrlMqtt:any = process.env.MQTT_HOST;
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      var Mqttstatus: any = checkConnectionMqtt.status;
    } else {
      var Mqttstatus: any = false;
    }
    var setOption = dto.setOption;
    var cachetimeset = dto.cachetimeset;
    var cachetimeset1 = dto.cachetimeset1;
    var cachetimeset2 = dto.cachetimeset2;
    var cachetimeset3 = dto.cachetimeset3;
    var cachetimeset4 = dto.cachetimeset4;
    var deletecache = dto.deletecache;
    var kaycache_cache_a1 = dto.kaycache_cache_a1;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var device_id_mas: number = parseInt(dto.device_id_mas);
    if (!dto.device_id_mas) {
      var device_id_mas: number = parseInt(dto.device_id);
    }
    var crsmasterio = dto.crsmasterio;
    var countalarm_master_io = dto.countalarm_master_io;
    var device_control = dto.device_control;
    var device_control_map_count = dto.device_control_map_count;
    var event: number = parseInt(dto.event);
    var eventSet: number = parseInt(dto.event);
    var time_life: any = dto.time_life;
    var bucket: any = dto.bucket;
    var location_id: any = dto.location_id;
    var device_id: any = dto.device_id;
    var values: any = dto.values;
    var mqtt_data_value: any = dto.mqtt_data_value;
    var mqtt_data_control: any = dto.mqtt_data_control;
    var configdata: any = dto.configdata;
    var mqtt_status_data_name: any = dto.mqtt_status_data_name;
    ///////////
    var type_id: number = parseInt(dto.type_id);
    var alarmTypeId: any = type_id;
    var status_alert: any = dto.status_alert;
    var status_warning: any = dto.status_warning;
    var recovery_warning: any = dto.recovery_warning;
    var recovery_alert: any = dto.recovery_alert;
    ///////////
    var mqtt_name: any = dto.mqtt_name;
    var device_name: any = dto.device_name;
    var action_name: any = dto.action_name;
    var mqtt_control_on: any = dto.mqtt_control_on;
    var mqtt_control_off: any = dto.mqtt_control_off;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var subject: any = dto.subject;
    var content: any = dto.content;
    var status: any = dto.status;
    var alarmStatusSet: any = parseInt(dto.alarmStatusSet);
    var dataAlarm: any = dto.dataAlarm;
    var eventControl: any = dto.eventControl;
    var messageMqttControl: any = dto.messageMqttControl;
    var sensor_data: any = dto.sensor_data;
    var count_alarm = dto.count_alarm;
    var mqttconnect: any = [];
    var dtos: any = {};
    dtos.cachetimeset = cachetimeset;
    dtos.cachetimeset2 = cachetimeset2;
    dtos.deletecache = deletecache;
    dtos.kaycache_cache_a1 = kaycache_cache_a1;
    dtos.alarm_action_id = alarm_action_id;
    dtos.device_id_mas = device_id_mas;
    dtos.crsmasterio = crsmasterio;
    dtos.countalarm_master_io = countalarm_master_io;
    dtos.device_control = device_control;
    dtos.device_control_map_count = device_control_map_count;
    dtos.values = dto.values;
    dtos.configdata = dto.configdata;
    dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
    dtos.type_id = dto.type_id;
    dtos.status_alert = dto.status_alert;
    dtos.status_warning = dto.status_warning;
    dtos.status_alert = dto.status_alert;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_warning = dto.recovery_warning;
    dtos.recovery_alert = dto.recovery_alert;
    dtos.mqtt_name = dto.mqtt_name;
    dtos.device_name = dto.device_name;
    dtos.action_name = dto.action_name;
    dtos.mqtt_control_on = dto.mqtt_control_on;
    dtos.mqtt_control_off = dto.mqtt_control_off;
    dtos.mqtt_data_value = dto.mqtt_data_value;
    dtos.mqtt_data_control = dto.mqtt_data_control;
    dtos.location_id = dto.location_id;
    dtos.time_life = dto.time_life;
    dtos.device_id = dto.device_id;
    dtos.event = dto.event;
    dtos.bucket = dto.device_bucket;
    dtos.cachetimeset = dto.cachetimeset;
    dtos.deletecache = dto.deletecache;
    dtos.setOption = 1;
    if (alarmStatusSet == 1) {
      var validate_count: number = parseInt('2');
    } else if (alarmStatusSet == 2) {
      var validate_count: number = parseInt('2');
    } else if (alarmStatusSet == 3) {
      var validate_count: number = parseInt('1');
    } else {
      var validate_count: number = parseInt('1');
    }
    var fillterDataSENSOR: any = {};
    if (alarm_action_id) {
      fillterDataSENSOR.alarm_action_id = alarm_action_id;
    }
    if (eventSet) {
      fillterDataSENSOR.event = eventSet;
    }
    if (date_now) {
      fillterDataSENSOR.date = date_now;
    }
    if (time_now) {
      fillterDataSENSOR.time = time_now;
    }
    if (alarmStatusSet == 1) {
      fillterDataSENSOR.status_warning = status_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 2) {
      fillterDataSENSOR.status_alert = status_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 3) {
      fillterDataSENSOR.recovery_warning = recovery_warning;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    } else if (alarmStatusSet == 4) {
      fillterDataSENSOR.recovery_alert = recovery_alert;
      fillterDataSENSOR.alarm_status = alarmStatusSet;
    }

    var inputCreate: any = {
      alarm_action_id: alarm_action_id,
      device_id: device_id_mas,
      type_id: type_id,
      event: eventSet,
      status: 1,
      alarm_type: alarmTypeId,
      status_warning: status_warning,
      recovery_warning: recovery_warning,
      status_alert: status_alert,
      recovery_alert: recovery_alert,
      email_alarm: 0,
      line_alarm: 0,
      telegram_alarm: 0,
      sms_alarm: 0,
      nonc_alarm: 1,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: dataAlarm,
      createddate: new Date(),
      updateddate: new Date(),
      ata_alarm: dataAlarm,
      alarm_status: alarmStatusSet,
      subject: subject,
      content: content,
    };
    var deviceFillter: any = {
      alarm_action_id: alarm_action_id,
      device_id: dto.device_id,
      bucket: bucket,
    };
    /**************Cache*************/
    var kaycachecache: any =
      'alarm_device_id_event_rss' +
      md5(alarm_action_id + '-' + device_id + '-' + bucket);
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycachecache);
    }
    var device: any = await Cache.GetCacheData(kaycachecache);
    if (device) {
      var device: any = device;
    } else if (!device) {
      var device: any = await this.settingsService.alarm_device_id_event_rss(
        deviceFillter,
      );
      var rs: any = {
        keycache: `${kaycachecache}`,
        time: cachetimeset,
        data: device,
      };
      await Cache.SetCacheData(rs);
      var cache_data_alarmdevice: any = 'no cache';
    }
    /**************Cache*************/
    /*****************************/
    if (alarmStatusSet == 1 || alarmStatusSet == 2) {
      var mqtt_get_data: any = encodeURI(mqtt_data_value);
      var mqtt_access_control: any = encodeURI(mqtt_data_control);

      if (event == 1) {
        var messageMqttControls: any = mqtt_control_on;
        var eventSet: number = 1;
      } else {
        var messageMqttControls: any = mqtt_control_off;
        var eventSet: number = 0;
      }

      const fillter_device_control: any = {};
      fillter_device_control.alarm_action_id = alarm_action_id;

      // แก้ไขจุดที่ 1: ตรวจสอบค่า countResult ก่อนแปลง
      var countAlarmDeviceControl: number = 0;
      try {
        const countResult: any =
          await this.settingsService.count_alarmprocesslog(
            fillter_device_control,
          );
        // ตรวจสอบว่า countResult ไม่ใช่ null/undefined และสามารถแปลงเป็นตัวเลขได้
        if (countResult !== null && countResult !== undefined) {
          const parsedCount = parseInt(countResult.toString(), 10);
          countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
        }
      } catch (error) {
        console.error('Error counting alarm process log:', error);
        countAlarmDeviceControl = 0;
      }

      if (countAlarmDeviceControl >= 1) {
        if (alarmStatusSet == 999) {
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
        }
      }

      if (countAlarmDeviceControl == 0) {
        var Option: any = 1;
        var msg: any = 'device_access_control_new';
        var rs1: any = 0;
        var fillterData: any = {};

        if (alarm_action_id) {
          fillterData.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterData.event = eventSet;
        }
        if (type_id) {
          fillterData.type_id = type_id;
        }
        if (date_now) {
          fillterData.date = date_now;
        }
        if (time_now) {
          fillterData.time = time_now;
        }

        if (alarmStatusSet == 1) {
          fillterData.status_warning = status_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterData.status_alert = status_alert;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterData.recovery_warning = recovery_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterData.recovery_alert = recovery_alert;
          fillterData.alarm_status = alarmStatusSet;
        }

        var isDuplicate = await this.settingsService.checkDuplicateLogOne(
          inputCreate,
        );
        if (!isDuplicate) {
          await this.settingsService.manageAlarmLogRecoveryOne(
            inputCreate,
            fillterData,
            validate_count,
          );
        }

        await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
      } else {
        var inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: subject + ` SENEOR Alarm `,
          content: content + ` SENEOR Alarm `,
        };

        var now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id_mas;
        var crsmaster: any = await this.settingsService.chk_alarm_temp_log_desc(
          setdatachk_main,
        );
        if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
          var createddate_logs_control: any = format.timeConvertermas(
            format.convertTZ(crsmaster[0].createddate, process.env.tzString),
          );
        } else {
          // กำหนดค่า default หรือข้ามไป
          var createddate_logs_control: any = null;
        }
        // แก้ไขจุดที่ 2: ตรวจสอบ crsmaster ก่อนเข้าถึง length
        var countalarm_LogSensor: number = 0;
        if (crsmaster && Array.isArray(crsmaster)) {
          countalarm_LogSensor = crsmaster.length;
        }

        if (crsmaster && crsmaster.length > 0) {
          var createddate_logsMaim: any = format.timeConvertermas(
            format.convertTZ(crsmaster[0].createddate, process.env.tzString),
          );
          var now_time_cal_main: number = Number(
            format.diffMinutes(now_time_full, createddate_logsMaim),
          );

          // ตรวจสอบว่า now_time_cal_main เป็นตัวเลขที่ถูกต้อง
          if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();

            var crsmaster: any =
              await this.settingsService.checkDuplicateLogSensor(
                setdatachk_main,
              );

            // แก้ไขจุดที่ 3: ตรวจสอบ crsmaster อีกครั้ง
            var countalarm_LogSensor: number = 0;
            if (crsmaster && Array.isArray(crsmaster)) {
              countalarm_LogSensor = crsmaster.length;
            }

            if (countalarm_LogSensor == 0) {
              var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
                inputCreate,
              );
              if (!isDuplicate) {
                await this.settingsService.manageAlarmLogRecoveryTwo(
                  inputCreate,
                  fillterDataSENSOR,
                  validate_count,
                );
              }
            }

            if (countalarm_LogSensor >= validate_count) {
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.alarm_status = alarmStatusSet;
                await this.settingsService.delete_alarmprocesslogal(
                  fillter_device_control,
                );
                return { msg, alarmStatusSet };
              }
            }

            var devicecontroliot: any = [];
            //******************/
            if (device) {
              for (const [key, value] of Object.entries(device)) {
                var va: any = device[key];
                var device_id: any = va.device_id;
                var mqtt_id: any = va.mqtt_id;
                var setting_id: any = va.setting_id;
                var action_id: any = va.action_id;
                var status_alert_id: any = va.status_alert_id;
                var type_ids: any = va.type_id;
                var device_name: any = va.device_name;
                var work_status: any = va.work_status;
                var mqtt_data_value: any = va.mqtt_data_value;
                var mqtt_data_control: any = va.mqtt_data_control;
                var measurement: any = va.measurement;
                var mqtt_control_on: any = va.mqtt_control_on;
                var mqtt_control_off: any = va.mqtt_control_off;
                var bucket: any = va.bucket;
                var timestamp: any = va.timestamp;
                var mqtt_device_name: any = va.mqtt_device_name;
                var id: any = va.id;
                var alarm_action_ids: any = va.alarm_action_id;
                var device_id = rs.device_id;

                var mqtt_get_data: any = encodeURI(mqtt_data_value);
                var mqtt_data_control: any = encodeURI(mqtt_data_control);

                if (event == 1) {
                  var messageMqttControls: any = encodeURI(mqtt_control_on);
                  var eventSet: number = 1;
                } else {
                  var messageMqttControls: any = encodeURI(mqtt_control_off);
                  var eventSet: number = 0;
                }

                await this.mqtt_control_device(
                  mqtt_data_control,
                  messageMqttControls,
                );

                var arraydatarr: any = {
                  id,
                  device_id,
                  alarm_action_id,
                  mqtt_id,
                  setting_id,
                  status_alert_id,
                  device_name,
                  work_status,
                  mqtt_data_value,
                  mqtt_data_control,
                  bucket,
                };
                devicecontroliot.push(arraydatarr);
              }
            }
            //******************/
          }
        }
      }
    } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
      var mqtt_get_data: any = encodeURI(mqtt_data_value);
      var mqtt_access_control: any = encodeURI(mqtt_data_control);

      if (event == 1) {
        var messageMqttControls: any = mqtt_control_off;
        var eventSet: number = 0;
      } else {
        var messageMqttControls: any = mqtt_control_on;
        var eventSet: number = 1;
      }

      var rs: any = await this.device_access_control_check(dtos);

      var mqttconnect: any = [];
      var setdatachk_main: any = {};
      setdatachk_main.alarm_action_id = alarm_action_id;
      setdatachk_main.device_id = device_id_mas;
      setdatachk_main.alarm_status = alarmStatusSet;
      setdatachk_main.date = format.getCurrentDatenow();
      setdatachk_main.time = format.getCurrentTimenow();

      var crsmaster: any = await this.settingsService.checkDuplicateLogSensor(
        setdatachk_main,
      );

      // แก้ไขจุดที่ 4: ตรวจสอบ crsmaster อีกครั้ง
      var countalarm_LogSensor: number = 0;
      if (crsmaster && Array.isArray(crsmaster)) {
        countalarm_LogSensor = crsmaster.length;
      }

      if (countalarm_LogSensor == 0) {
        var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
          inputCreate,
        );
        if (!isDuplicate) {
          await this.settingsService.manageAlarmLogRecoveryTwo(
            inputCreate,
            fillterDataSENSOR,
            validate_count,
          );
        }

        var devicecontroliot: any = [];
        //******************/
        if (device) {
          for (const [key, value] of Object.entries(device)) {
            var va: any = device[key];
            var device_id: any = va.device_id;
            var mqtt_id: any = va.mqtt_id;
            var setting_id: any = va.setting_id;
            var action_id: any = va.action_id;
            var status_alert_id: any = va.status_alert_id;
            var type_ids: any = va.type_id;
            var device_name: any = va.device_name;
            var work_status: any = va.work_status;
            var mqtt_data_value: any = va.mqtt_data_value;
            var mqtt_data_control: any = va.mqtt_data_control;
            var measurement: any = va.measurement;
            var mqtt_control_on: any = va.mqtt_control_on;
            var mqtt_control_off: any = va.mqtt_control_off;
            var bucket: any = va.bucket;
            var timestamp: any = va.timestamp;
            var mqtt_device_name: any = va.mqtt_device_name;
            var id: any = va.id;
            var alarm_action_ids: any = va.alarm_action_id;
            var device_id = rs.device_id;

            var mqtt_get_data: any = encodeURI(mqtt_data_value);
            var mqtt_data_control: any = encodeURI(mqtt_data_control);

            if (event == 1) {
              var messageMqttControls: any = encodeURI(mqtt_control_on);
              var eventSet: number = 1;
            } else {
              var messageMqttControls: any = encodeURI(mqtt_control_off);
              var eventSet: number = 0;
            }

            await this.mqtt_control_device(
              mqtt_data_control,
              messageMqttControls,
            );

            var arraydatarr: any = {
              id,
              device_id,
              alarm_action_id,
              mqtt_id,
              setting_id,
              status_alert_id,
              device_name,
              work_status,
              mqtt_data_value,
              mqtt_data_control,
              bucket,
            };
            devicecontroliot.push(arraydatarr);
          }
        }
        //******************/
      }

      if (countalarm_LogSensor >= validate_count) {
        // if (alarmStatusSet == 999) {
        const fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        fillter_device_control.alarm_status = alarmStatusSet;
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
        return alarmStatusSet;
        // }

        var devicecontroliot: any = [];
        //******************/
        if (device) {
          for (const [key, value] of Object.entries(device)) {
            var va: any = device[key];
            var device_id: any = va.device_id;
            var mqtt_id: any = va.mqtt_id;
            var setting_id: any = va.setting_id;
            var action_id: any = va.action_id;
            var status_alert_id: any = va.status_alert_id;
            var type_ids: any = va.type_id;
            var device_name: any = va.device_name;
            var work_status: any = va.work_status;
            var mqtt_data_value: any = va.mqtt_data_value;
            var mqtt_data_control: any = va.mqtt_data_control;
            var measurement: any = va.measurement;
            var mqtt_control_on: any = va.mqtt_control_on;
            var mqtt_control_off: any = va.mqtt_control_off;
            var bucket: any = va.bucket;
            var timestamp: any = va.timestamp;
            var mqtt_device_name: any = va.mqtt_device_name;
            var id: any = va.id;
            var alarm_action_ids: any = va.alarm_action_id;
            var device_id = rs.device_id;

            var mqtt_get_data: any = encodeURI(mqtt_data_value);
            var mqtt_data_control: any = encodeURI(mqtt_data_control);

            if (event == 1) {
              var messageMqttControls: any = encodeURI(mqtt_control_on);
              var eventSet: number = 1;
            } else {
              var messageMqttControls: any = encodeURI(mqtt_control_off);
              var eventSet: number = 0;
            }

            await this.mqtt_control_device(
              mqtt_data_control,
              messageMqttControls,
            );

            var arraydatarr: any = {
              id,
              device_id,
              alarm_action_id,
              mqtt_id,
              setting_id,
              status_alert_id,
              device_name,
              work_status,
              mqtt_data_value,
              mqtt_data_control,
              bucket,
            };
            devicecontroliot.push(arraydatarr);
          }
        }
        //******************/
      }
    } else if (alarmStatusSet == 999) {
      const fillter_device_control: any = {};
      fillter_device_control.alarm_action_id = alarm_action_id;
      var countAlarmDeviceControl: number = 0;
      try {
        const countResult: any =
          await this.settingsService.count_alarmprocesslog(
            fillter_device_control,
          );
        if (countResult !== null && countResult !== undefined) {
          const parsedCount = parseInt(countResult.toString(), 10);
          countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
        }
      } catch (error) {
        countAlarmDeviceControl = 0;
      }
      if (countAlarmDeviceControl >= validate_count) {
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
      }

      var setdatachk_main: any = {};
      setdatachk_main.alarm_action_id = alarm_action_id;
      setdatachk_main.device_id = device_id_mas;
      var crsmaster: any = await this.settingsService.chk_alarm_temp_log_desc(
        setdatachk_main,
      );
      if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
        var createddate_logs_control: any = format.timeConvertermas(
          format.convertTZ(crsmaster[0].createddate, process.env.tzString),
        );
      } else {
        // กำหนดค่า default หรือข้ามไป
        var createddate_logs_control: any = null;
      }
      var countalarmLogSensor: any = crsmaster.length;
      var parsedCount: number = parseInt(countalarmLogSensor);
      if (parsedCount >= validate_count) {
        await this.settingsService.delete_alarmprocesslogal(
          fillter_device_control,
        );
      }
    }
    /*****************************/
    var Rss: any = {
      alarmStatusSet,
      action_name,
      bucket,
      subject,
      content,
      status,
      dataAlarm,
      eventControl,
      messageMqttControl,
      sensor_data,
      count_alarm,
      deviceFillter,
      deviceCount: device.length,
    };
    return await Rss;
  }
  async mqtt_control_device(mqtt_data_control: any, messageMqttControls: any) {
    try {
      var topic_sends: any = encodeURI(mqtt_data_control);
      var message_sends: any = encodeURI(messageMqttControls);
      var devicecontrol: any = await this.mqttService.devicecontrol(
        topic_sends,
        message_sends,
      );
      console.log(`2-devicecontrol=>`);
      console.info(devicecontrol);
      const device_status = devicecontrol['dataObject']?.device_status;
      return device_status;
    } catch (error) {
      console.error('mqtt_control_deviceerror:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
    }
  }
  async alarm_to_control(dto: any) {
    var alarm_action_id: any = dto.alarm_action_id;
    var device_id_mas: any = dto.device_id;
    var bucket: any = dto.bucket;
    var cachetimeset: any = dto.cachetimeset;
    var cachetimeset1: any = dto.cachetimeset1;
    var cachetimeset2: any = dto.cachetimeset2;
    var cachetimeset3: any = dto.cachetimeset3;
    var cachetimeset4: any = dto.cachetimeset4;
    var deletecache: any = dto.deletecache;
    var location_id: any = dto.location_id;
    var mqttconnect: any = [];
    try {
      ///////////---kaycache_cache_crsmasterio-///////////
      var setdatachk_main_io: any = {};
      setdatachk_main_io.alarm_action_id = alarm_action_id;
      var filter_key_md5: any = md5(setdatachk_main_io);
      var kaycache_cache_a1: any =
        'kaycache_cache_crsmasterio_' + alarm_action_id;
      var crsmasterio: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache_a1);
      }
      var crsmasterio: any = await Cache.GetCacheData(kaycache_cache_a1);
      if (crsmasterio) {
        var crsmasterio: any = crsmasterio['data'];
        var cache_data_crsmasterio: any = 'cache';
      } else if (!crsmasterio) {
        var crsmasterio: any = await this.settingsService.checkDuplicateLogIO(
          setdatachk_main_io,
        );
        var rs: any = {
          keycache: `${kaycache_cache_a1}`,
          time: cachetimeset,
          data: crsmasterio,
        };
        await Cache.SetCacheData(rs);
        var cache_data_crsmasterio: any = 'no cache';
      }
      //////////////////////
      if (crsmasterio) {
        var countalarm_master_io: number = Number(crsmasterio.length);
      } else {
        var countalarm_master_io: number = parseInt('0');
      }

      ///////////---kaycache_cache_ctl-///////////
      var cachetimeset_ctl: number = Number(cachetimeset);
      var fillter_device_control_map: any = {};
      fillter_device_control_map.alarm_action_id = alarm_action_id;
      fillter_device_control_map.bucket = dto.bucket;
      var setdatachk_main_io: any = {};
      setdatachk_main_io.alarm_action_id = alarm_action_id;
      var filter_key_md5: any = md5(setdatachk_main_io);
      var kaycache_cache_ctl: any = 'kaycache_cache_ctl_' + alarm_action_id;
      var device_control: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache_ctl);
      }
      var device_control: any = await Cache.GetCacheData(kaycache_cache_ctl);
      if (device_control) {
        var device_control: any = device_control;
        var cache_data_device_control: any = 'cache';
      } else if (!device_control) {
        var device_control: any = await this.settingsService.deviceeventmap(
          fillter_device_control_map,
        );
        var rs: any = {
          keycache: `${kaycache_cache_ctl}`,
          time: cachetimeset_ctl,
          data: device_control,
        };
        await Cache.SetCacheData(rs);
        var cache_data_device_control: any = 'no cache';
      }
      if (device_control) {
        var device_control_map_count: number = Number(device_control.length);
      } else {
        var device_control_map_count: number = parseInt('0');
      }
      //return {cache_data_device_control,device_control_map_count,device_control};

      var Option: any = 0;
      const fillter_device_control: any = {};
      fillter_device_control.alarm_action_id = alarm_action_id;
      //fillter_device_control.device_id = dto.device_id;
      var countAlarmDeviceDontrol: number = Number(
        await this.settingsService.count_alarmprocesslog(
          fillter_device_control,
        ),
      );
      // return {Option,msg,fillter_device_control,countAlarmDeviceDontrol}
      //     const  mqtt_id:any= values.mqtt_id;
      //     const  mqtt_name:any= values.mqtt_name;
      //     const  setting_id:any= values.setting_id;
      //     const  alarm_action_id:any= values.alarm_action_id;
      //     var  type_id:any= values.type_id;
      //     const  device_name:any= values.device_name;
      //     const  hardware_id:any= values.hardware_id;
      //     const  status_warning:any= values.status_warning;
      //     const  recovery_warning:any= values.recovery_warning;
      //     const  status_alert:any= values.status_alert;
      //     const  recovery_alert:any= values.recovery_alert;
      //     const  timelife:any= values.timelife;
      //     const  period:any= values.period;
      //     const  mqtt_data_value:any= values.mqtt_data_value;
      //     const  mqtt_data_control:any= values.mqtt_data_control;
      //     const  model:any= values.model;
      //     const  comparevalue:any= values.comparevalue;
      //     const  createddate:any= values.createddate;
      //     const  updateddate:any= values.updateddate;
      //     const  status:any= values.status;
      //     const  unit:any= values.unit;
      //     const  action_id:any= values.action_id;
      //     const  status_alert_id:any= values.status_alert_id;
      //     const  mqtt_control_on:any= values.mqtt_control_on;
      //     const  mqtt_control_off:any= values.mqtt_control_off;
      //     const  device_org:any= values.device_org;
      //     const  device_bucket:any= values.device_bucket;
      //     const  type_name:any= values.type_name;
      //     const  location_name:any= values.location_name;
      //     const  location_id:any= values.location_id;
      //     const  configdata:any= values.configdata;
      //     const  mqttname:any= values.mqtt_name;
      //     const  mqtt_org:any= values.mqtt_org;
      //     const  bucket:any= values.mqtt_bucket;
      //     const  mqtt_bucket:any= values.mqtt_bucket;
      //     const  mqtt_envavorment:any= values.mqtt_envavorment;
      //     const  mqtt_host:any= values.mqtt_host;
      //     const  mqtt_port:any= values.mqtt_port;
      //     const  mqtt_device_name:any= values.mqtt_device_name;
      //     const  mqtt_status_over_name:any= values.mqtt_status_over_name;
      //     const  mqtt_status_data_name:any= values.mqtt_status_data_name;
      //     const  mqtt_act_relay_name:any= values.mqtt_act_relay_name;
      //     const  mqtt_control_relay_name:any= values.mqtt_control_relay_name;
      //     const  action_name:any= values.action_name;
      //     const  email_alarm:any= values.email_alarm;
      //     const  line_alarm:any= values.line_alarm;
      //     const  telegram_alarm:any= values.telegram_alarm;
      //     const  sms_alarm:any= values.sms_alarm;
      //     const  nonc_alarm:any= values.nonc_alarm;
      //     const  time_life:any= values.time_life;
      //     const  event:any= values.event;

      var values: any = dto.values;
      if (countAlarmDeviceDontrol < 1) {
        var dtos: any = {};
        dtos.cachetimeset = cachetimeset;
        dtos.cachetimeset2 = cachetimeset2;
        dtos.deletecache = deletecache;
        dtos.kaycache_cache_a1 = kaycache_cache_a1;
        dtos.kaycache_cache_ctl = kaycache_cache_ctl;
        dtos.alarm_action_id = alarm_action_id;
        dtos.device_id_mas = device_id_mas;
        dtos.crsmasterio = crsmasterio;
        dtos.countalarm_master_io = countalarm_master_io;
        dtos.device_control = device_control;
        dtos.device_control_map_count = device_control_map_count;
        dtos.values = dto.values;
        dtos.configdata = dto.configdata;
        dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
        dtos.type_id = dto.type_id;
        dtos.status_alert = dto.status_alert;
        dtos.status_warning = dto.status_warning;
        dtos.status_alert = dto.status_alert;
        dtos.recovery_warning = dto.recovery_warning;
        dtos.recovery_warning = dto.recovery_warning;
        dtos.recovery_alert = dto.recovery_alert;
        dtos.mqtt_name = dto.mqtt_name;
        dtos.device_name = dto.device_name;
        dtos.action_name = dto.action_name;
        dtos.mqtt_control_on = dto.mqtt_control_on;
        dtos.mqtt_control_off = dto.mqtt_control_off;
        dtos.mqtt_data_value = dto.mqtt_data_value;
        dtos.mqtt_data_control = dto.mqtt_data_control;
        dtos.location_id = dto.location_id;
        dtos.time_life = dto.time_life;
        dtos.device_id = dto.device_id;
        dtos.event = dto.event;
        dtos.bucket = dto.device_bucket;
        dtos.cachetimeset = dto.cachetimeset;
        dtos.deletecache = dto.deletecache;
        dtos.setOption = 1;
        var Option: any = 1;
        var msg: any = 'device_access_control_new';
        var rs1: any = 0;
        var rs: any = await this.device_access_control_new(dtos);
        // return {Option,countAlarmDeviceDontrol,msg,rs}
        //  return {Option,countAlarmDeviceDontrol,msg,dtos,rs}
      } else if (countAlarmDeviceDontrol >= 1) {
        var dtos: any = {};
        dtos.cachetimeset = cachetimeset;
        dtos.cachetimeset2 = cachetimeset2;
        dtos.deletecache = deletecache;
        dtos.kaycache_cache_a1 = kaycache_cache_a1;
        dtos.kaycache_cache_ctl = kaycache_cache_ctl;
        dtos.alarm_action_id = alarm_action_id;
        dtos.device_id_mas = device_id_mas;
        dtos.crsmasterio = crsmasterio;
        dtos.countalarm_master_io = countalarm_master_io;
        dtos.device_control = device_control;
        dtos.device_control_map_count = device_control_map_count;
        dtos.values = dto.values;
        dtos.configdata = dto.configdata;
        dtos.mqtt_status_data_name = dto.mqtt_status_data_name;
        dtos.type_id = dto.type_id;
        dtos.status_alert = dto.status_alert;
        dtos.status_warning = dto.status_warning;
        dtos.status_alert = dto.status_alert;
        dtos.recovery_warning = dto.recovery_warning;
        dtos.recovery_warning = dto.recovery_warning;
        dtos.recovery_alert = dto.recovery_alert;
        dtos.mqtt_name = dto.mqtt_name;
        dtos.device_name = dto.device_name;
        dtos.action_name = dto.action_name;
        dtos.mqtt_control_on = dto.mqtt_control_on;
        dtos.mqtt_control_off = dto.mqtt_control_off;
        dtos.mqtt_data_value = dto.mqtt_data_value;
        dtos.mqtt_data_control = dto.mqtt_data_control;
        dtos.alarm_action_id = dto.alarm_action_id;
        dtos.time_life = dto.time_life;
        dtos.device_id = dto.device_id;
        dtos.event = dto.event;
        dtos.bucket = dto.device_bucket;
        dtos.cachetimeset = dto.cachetimeset;
        dtos.deletecache = dto.deletecache;
        dtos.setOption = 2;
        var Option: any = 2;
        var msg: any = 'device_access_control_check';
        var rs2: any = '--';
        // return {Option,msg,rs2}
        // return {Option,countalarm_master_io,dtos,rs2}
        var rs: any = await this.device_access_control_check(dtos);
        return { Option, countAlarmDeviceDontrol, msg, rs };
        // return {Option,countAlarmDeviceDontrol,msg,dtos,rs}
      }
    } catch (error) {
      console.error('mqtt connect error:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
      return error;
    }
    ////////////////////////////////////////////////////////////
  }
  async device_access_control_new(dto: any) {
    try {
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน

      var timestamps: any = datePart + ' ' + timePart;
      //var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var device_id_mas: number = Number(dto.device_id);
      var setOption = dto.setOption;
      var cachetimeset = dto.cachetimeset;
      var cachetimeset1 = dto.cachetimeset1;
      var cachetimeset2 = dto.cachetimeset2;
      var cachetimeset3 = dto.cachetimeset3;
      var cachetimeset4 = dto.cachetimeset4;
      var deletecache = dto.deletecache;
      var kaycache_cache_a1 = dto.kaycache_cache_a1;
      var alarm_action_id: number = Number(dto.alarm_action_id);
      var crsmasterio = dto.crsmasterio;
      var countalarm_master_io = dto.countalarm_master_io;
      var device_control = dto.device_control;
      var device_control_map_count = dto.device_control_map_count;
      ///////////////
      //  return dto;
      var values: any = dto.values;
      var mqtt_data_value: any = dto.mqtt_data_value;
      var mqtt_data_control: any = dto.mqtt_data_control;
      var configdata: any = dto.configdata;
      var mqtt_status_data_name: any = dto.mqtt_status_data_name;
      ///////////
      var type_id: number = Number(dto.type_id);
      ///////////
      var status_alert: any = dto.status_alert;
      var status_warning: any = dto.status_warning;
      var recovery_warning: any = dto.recovery_warning;
      var recovery_alert: any = dto.recovery_alert;
      ///////////
      var mqtt_name: any = dto.mqtt_name;
      var device_name: any = dto.device_name;
      var action_name: any = dto.action_name;
      var mqtt_control_on: any = dto.mqtt_control_on;
      var mqtt_control_off: any = dto.mqtt_control_off;
      var alarm_action_id: number = Number(dto.alarm_action_id);
      var event: number = Number(dto.event);
      var time_life: any = dto.time_life;
      var bucket: any = dto.bucket;
      var mqttconnect: any = [];
      if (!mqtt_data_value || mqtt_data_value == undefined) {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          mqtt_data_value,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can get mqtt_data_value..`,
          message_th: `Mqtt can not get mqtt_data_value...`,
        };
        return mqttconnect;
      }

      var mqttrs: any = await this.mqttService.getMqttTopicPA1(
        mqtt_data_value,
        deletecache,
      );
      var timestampMqtt: any = mqttrs.timestamp;
      if (timestampMqtt) {
        var timestamps: any = timestampMqtt;
      }
      var mqttstatus: any = mqttrs.status;
      var MQTTGETDATA: any = mqttrs.msg;
      if (MQTTGETDATA) {
        const mqttData: any = MQTTGETDATA;
        const mqttDataCount: number = Number(mqttData.length);
        const configObj = JSON.parse(configdata);
        const mqttConfigData = Object.values(configObj);
        const mqttCount: number = Number(mqttConfigData.length);
        const statusDataObj = JSON.parse(mqtt_status_data_name);
        const mqttStatusData = Object.values(statusDataObj);
        const merged = format.mapMqttDataToDeviceV2(
          [values],
          mqttDataCount < mqttCount
            ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
            : Object.fromEntries(
                mqttConfigData.map((k, i) => [k, mqttData[i]]),
              ),
        )[0];
        var sensorValueData = merged.value_data;
        var value_alarm: any = Number(merged.value_alarm);
        var value_relay: any = Number(merged.value_relay);
        var value_control_relay: any = Number(merged.value_control_relay);
        var sensorValue: any = sensorValueData;
        var date_now: any = format.getCurrentDatenow();
        var time_now: any = format.getCurrentTimenow();
        // กำหนดค่าสำหรับการตรวจสอบ alarm
        if (type_id == 1) {
          var dataAlarm: any = encodeURI(sensorValue);
          var alarmValue: any = encodeURI(value_alarm);
        } else {
          var dataAlarm: any = encodeURI(sensorValueData);
          var alarmValue: any = encodeURI(value_alarm);
        }
        var alarmTypeId: any = type_id;
        // ดึงรายละเอียด Alarm
        var filter: any = {};
        filter.alarmTypeId = type_id;
        if (type_id == 1) {
          filter.sensorValueData = encodeURI(sensorValue); //sensor
          filter.status_warning = encodeURI(status_warning);
          filter.status_alert = encodeURI(status_alert);
          filter.recovery_warning = encodeURI(recovery_warning);
          filter.recovery_alert = encodeURI(recovery_alert);
        } else {
          filter.sensorValueData = encodeURI(value_alarm); //IO
          filter.status_warning = parseInt('0');
          filter.status_alert = parseInt('0');
          filter.recovery_warning = parseInt('1');
          filter.recovery_alert = parseInt('1');
        }
        filter.mqtt_name = mqtt_name;
        filter.device_name = device_name;
        filter.action_name = action_name;
        filter.mqtt_control_on = encodeURI(mqtt_control_on);
        filter.mqtt_control_off = encodeURI(mqtt_control_off);
        filter.event = event;
        // master
        var setdatachk: any = {};
        setdatachk.alarm_action_id = alarm_action_id;
        setdatachk.device_id = device_id_mas;
        setdatachk.type_id = type_id;
        var count_alarm: number = Number(countalarm_master_io);
        filter.count_alarm = countalarm_master_io;
        var getAlarmDetails: any = await this.settingsService.getAlarmDetails(
          filter,
        );
        if (getAlarmDetails) {
          var alarmStatusSet: any = Number(getAlarmDetails.alarmStatusSet);
          var messageMqttControl: any = getAlarmDetails.messageMqttControl;
          var subject: any = getAlarmDetails.subject;
          var content: any = getAlarmDetails.content;
          var dataAlarmRs: any = getAlarmDetails.dataAlarm;
          var eventControl: any = getAlarmDetails.eventControl;
          var sensor_data: any = getAlarmDetails.sensor_data;
        } else {
          var getAlarmDetails: any = [];
          var alarmStatusSet: any = null;
          var messageMqttControl: any = null;
          var subject: any = null;
          var content: any = null;
          var dataAlarmRs: any = null;
          var eventControl: any = null;
          var sensor_data: any = null;
        }
        ///////////////
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          if (event == 1) {
            var eventSet: number = 1;
          } else {
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          if (event == 1) {
            var eventSet: number = 0;
          } else {
            var eventSet: number = 1;
          }
        }
        // ข้อมูลเวลา
        const now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var devicecontrol: any = {};
        var now_time_cal: number = 0;
        var createddate_logs: any = now_time_full;
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var log_time: any = 0;
        var cal_status: number = 0;
        var cal_status_msg: any = '---';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
        } else {
          var validate_count: number = parseInt('1');
        }
        if (alarmStatusSet == 999) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          fillter_device_control.date = format.getCurrentDatenow();
          fillter_device_control.alarm_status = alarmStatusSet;
          //  await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
          var msg = '1- delete_alarmprocesslogal -- device_access_control_new';
          // return {msg,alarmStatusSet,alarmStatusSet};
        }
        /////////////////////----------------Save LOG -------------------////////////////////////
        var fillterData: any = {};
        if (alarm_action_id) {
          fillterData.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterData.event = eventSet;
        }
        if (type_id) {
          fillterData.type_id = type_id;
        }
        if (date_now) {
          fillterData.date = date_now;
        }
        if (time_now) {
          fillterData.time = time_now;
        }
        if (alarmStatusSet == 1) {
          fillterData.status_warning = status_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterData.status_alert = status_alert;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterData.recovery_warning = recovery_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterData.recovery_alert = recovery_alert;
          fillterData.alarm_status = alarmStatusSet;
        }
        var tag: any = 1;
        const inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: subject + ' tag -' + tag,
          content: content,
        };
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          var isDuplicate = await this.settingsService.checkDuplicateLogOne(
            inputCreate,
          );
          if (!isDuplicate) {
            await this.settingsService.manageAlarmLogRecoveryOne(
              inputCreate,
              fillterData,
              validate_count,
            );
          }
        }
        if (alarmStatusSet == 999) {
          var device_control: any = [];
        } else {
          //-------------device_control-----------
          var device_control_map: any = [];
          var fillter_device_control_map: any = {};
          fillter_device_control_map.alarm_action_id = alarm_action_id;
          fillter_device_control_map.bucket = bucket;
          // var device_control:any = await this.settingsService.deviceeventmap(fillter_device_control_map);
          // const device_control_map_count:number = Number(device_control.length);
          if (device_control) {
            for (const [key, value] of Object.entries(device_control)) {
              const values: any = value;
              var alarm_action_id: number = Number(values.alarm_action_id);
              const device_id: number = Number(values.device_id);
              const mqtt_id: number = Number(values.mqtt_id);
              const type_id_control: number = Number(values.type_id);
              const mqtt_control_name: any = values.mqtt_name;
              const device_control_name: any = values.device_name;
              const type_control_name: any = values.type_name;
              const device_bucket: any = values.bucket;
              const status_warning: any = values.status_warning;
              const status_alert: any = values.status_alert;
              const recovery_warning: any = values.recovery_warning;
              const recovery_alert: any = values.recovery_alert;
              if (values.device_id == device_id_mas) {
              } else {
                // ไม่ใช่ device_id ตัวเอง
                const alarm_action_id: any = values.alarm_action_id;
                const device_id: any = values.device_id;
                const type_id_control: any = values.type_id;
                const mqtt_id: any = values.mqtt_id;
                //mqtt
                const mqtt_name: any = values.mqtt_name;
                const device_name: any = values.device_name;
                const type_name: any = values.type_name;
                ///////////////
                const device_bucket: any = values.bucket;
                const status_warning: any = values.status_warning;
                const status_alert: any = values.status_alert;
                const recovery_warning: any = values.recovery_warning;
                const recovery_alert: any = values.recovery_alert;
                const mqtt_control_on: any = values.mqtt_control_on;
                const mqtt_control_off: any = values.mqtt_control_off;
                const mqtt_data_value: any = encodeURI(values.mqtt_data_value);
                const mqtt_data_control: any = encodeURI(
                  values.mqtt_data_control,
                );
                ///////////////
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                  // alarm to recovery  to on /off
                  var mqtt_get_data: any = encodeURI(mqtt_data_value);
                  var mqtt_access_control: any = encodeURI(mqtt_data_control);
                  if (event == 1) {
                    var messageMqttControls: any = mqtt_control_on;
                    var eventSet: number = 1;
                  } else {
                    var messageMqttControls: any = mqtt_control_off;
                    var eventSet: number = 0;
                  }
                } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                  var mqtt_get_data: any = encodeURI(mqtt_data_value);
                  var mqtt_access_control: any = encodeURI(mqtt_data_control);
                  // alarm to recovery  to on /off
                  if (event == 1) {
                    var messageMqttControls: any = mqtt_control_off;
                    var eventSet: number = 0;
                  } else {
                    var messageMqttControls: any = mqtt_control_on;
                    var eventSet: number = 1;
                  }
                }
                // *****************mqtt_control_device***************************
                var message_sends: any = encodeURI(messageMqttControls);
                const device_status = await this.mqtt_control_device(
                  mqtt_data_control,
                  messageMqttControls,
                );
                var fillterData: any = {};
                if (alarm_action_id) {
                  fillterData.alarm_action_id = alarm_action_id;
                }
                if (eventSet) {
                  fillterData.event = eventSet;
                }
                if (type_id) {
                  fillterData.type_id = type_id;
                }
                if (date_now) {
                  fillterData.date = date_now;
                }
                if (time_now) {
                  fillterData.time = time_now;
                }
                if (alarmStatusSet == 1) {
                  fillterData.status_warning = status_warning;
                  fillterData.alarm_status = alarmStatusSet;
                } else if (alarmStatusSet == 2) {
                  fillterData.status_alert = status_alert;
                  fillterData.alarm_status = alarmStatusSet;
                } else if (alarmStatusSet == 3) {
                  fillterData.recovery_warning = recovery_warning;
                  fillterData.alarm_status = alarmStatusSet;
                } else if (alarmStatusSet == 4) {
                  fillterData.recovery_alert = recovery_alert;
                  fillterData.alarm_status = alarmStatusSet;
                }
                var tag: any = 2;
                const inputCreate: any = {
                  alarm_action_id: alarm_action_id,
                  //device_id: device_id,
                  device_id: device_id_mas,
                  type_id: type_id_control,
                  event: eventSet,
                  status: device_status || '',
                  alarm_type: alarmTypeId,
                  status_warning: status_warning,
                  recovery_warning: recovery_warning,
                  status_alert: status_alert,
                  recovery_alert: recovery_alert,
                  email_alarm: 0,
                  line_alarm: 0,
                  telegram_alarm: 0,
                  sms_alarm: 0,
                  nonc_alarm: 1,
                  date: format.getCurrentDatenow(),
                  time: format.getCurrentTimenow(),
                  data: dataAlarm,
                  createddate: new Date(),

                  ata_alarm: dataAlarm,
                  alarm_status: alarmStatusSet,
                  subject: subject,
                  content: content,
                };
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLog(inputCreate);
                  if (!isDuplicate) {
                    await this.settingsService.manageAlarmLogRecovery(
                      inputCreate,
                      fillterData,
                      1,
                    );
                  }
                }
                //count_alarm_log_all
                device_control_map.push({
                  getAlarmDetails,
                  alarm_action_id: alarm_action_id,
                  device_id: device_id,
                  type_id: type_id_control,
                  mqtt_name: mqtt_name,
                  mqtt_data_value: mqtt_data_value,
                  mqtt_data_control: mqtt_data_control,
                  device_name: device_name,
                  type_name: type_name,
                  event: event,
                  device_bucket: device_bucket,
                  alarmStatusSet: alarmStatusSet,
                  fillterData,
                  //inputCreate,
                  isDuplicate,
                });
              }
            }
          }
          // ------------device_control----------
        }
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          alarmStatusSet,
          payload: MQTTGETDATA,
          // device_control,
          status: 1,
          case: 2,
          date_now,
          time_now,
          sensorValueData,
          value_alarm,
          value_relay,
          value_control_relay,
          sensorValue,
          count_validate: validate_count,
          messageMqttControl,
          subject,
          content,
          dataAlarmRs,
          eventControl,
          sensor_data,
          time_life,
          mqtt_data_value,
          mqtt_data_control,
          mqtt_control_on,
          mqtt_control_off,
          //cal_status_msg,
          filter,
          //dto,
          //fillter_device_control_map,
          device_control_map: device_control_map,
          values,
          message: `new Mqtt connect..`,
          message_th: `new Mqtt connect..`,
        };
        return mqttconnect;
      } else {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          getAlarmDetails: [],
          MQTTGETDATA,
          values,
          status: 0,
          case: 1,
          message: `Mqtt can not connect..`,
          message_th: `Mqtt can not connect..`,
        };
        return mqttconnect;
      }
    } catch (error) {
      console.error('mqtt device_access_control_new error:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
    }
  }
  async device_access_control_check(dto: any) {
    try {
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน

      var timestamps: any = datePart + ' ' + timePart;
      //var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var setOption = dto.setOption;
      var cachetimeset = dto.cachetimeset;
      var cachetimeset1 = dto.cachetimeset1;
      var cachetimeset2 = dto.cachetimeset2;
      var cachetimeset3 = dto.cachetimeset3;
      var cachetimeset4 = dto.cachetimeset4;
      var deletecache = dto.deletecache;
      var kaycache_cache_a1 = dto.kaycache_cache_a1;
      var alarm_action_id: number = Number(dto.alarm_action_id);
      var device_id_mas: number = Number(dto.device_id_mas);
      var crsmasterio = dto.crsmasterio;
      var countalarm_master_io = dto.countalarm_master_io;
      var device_control = dto.device_control;
      var device_control_map_count = dto.device_control_map_count;
      // return dto;
      ///////////////
      var values: any = dto.values;
      var mqtt_data_value: any = dto.mqtt_data_value;
      var mqtt_data_control: any = dto.mqtt_data_control;
      var configdata: any = dto.configdata;
      var mqtt_status_data_name: any = dto.mqtt_status_data_name;
      ///////////
      var type_id: number = Number(dto.type_id);
      ///////////
      var status_alert: any = dto.status_alert;
      var status_warning: any = dto.status_warning;
      var recovery_warning: any = dto.recovery_warning;
      var recovery_alert: any = dto.recovery_alert;
      ///////////
      var mqtt_name: any = dto.mqtt_name;
      var device_name: any = dto.device_name;
      var action_name: any = dto.action_name;
      var mqtt_control_on: any = dto.mqtt_control_on;
      var mqtt_control_off: any = dto.mqtt_control_off;
      var alarm_action_id: number = Number(dto.alarm_action_id);

      var event: number = Number(dto.event);
      var time_life: any = dto.time_life;
      var bucket: any = dto.bucket;
      var mqttconnect: any = [];
      if (!mqtt_data_value || mqtt_data_value == undefined) {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          mqtt_data_value,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can get mqtt_data_value..`,
          message_th: `Mqtt can not get mqtt_data_value...`,
        };
        return mqttconnect;
      }
      var MQTTGETDATA: any = await this.mqttService.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqttService.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqttService.getdevicedataAll(
          mqtt_data_value,
        );
        const mqttData = mqttrs['data'];
        const mqttDataCount: number = Number(mqttData.length);
        const configObj = JSON.parse(configdata);
        const mqttConfigData = Object.values(configObj);
        const mqttCount: number = Number(mqttConfigData.length);
        const statusDataObj = JSON.parse(mqtt_status_data_name);
        const mqttStatusData = Object.values(statusDataObj);
        const merged = format.mapMqttDataToDeviceV2(
          [values],
          mqttDataCount < mqttCount
            ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
            : Object.fromEntries(
                mqttConfigData.map((k, i) => [k, mqttData[i]]),
              ),
        )[0];
        var sensorValueData = merged.value_data;
        var value_alarm: any = Number(merged.value_alarm);
        var value_relay: any = Number(merged.value_relay);
        var value_control_relay: any = Number(merged.value_control_relay);
        var sensorValue: any = sensorValueData;
        var date_now: any = format.getCurrentDatenow();
        var time_now: any = format.getCurrentTimenow();
        // กำหนดค่าสำหรับการตรวจสอบ alarm
        if (type_id == 1) {
          var dataAlarm: any = encodeURI(sensorValue);
          var alarmValue: any = encodeURI(value_alarm);
        } else {
          var dataAlarm: any = encodeURI(sensorValueData);
          var alarmValue: any = encodeURI(value_alarm);
        }
        var alarmTypeId: any = type_id;
        // ดึงรายละเอียด Alarm
        var filter: any = {};
        filter.alarmTypeId = type_id;
        if (type_id == 1) {
          filter.sensorValueData = encodeURI(sensorValue); //sensor
          filter.status_warning = encodeURI(status_warning);
          filter.status_alert = encodeURI(status_alert);
          filter.recovery_warning = encodeURI(recovery_warning);
          filter.recovery_alert = encodeURI(recovery_alert);
        } else {
          filter.sensorValueData = encodeURI(value_alarm); //IO
          filter.status_warning = parseInt('0');
          filter.status_alert = parseInt('0');
          filter.recovery_warning = parseInt('1');
          filter.recovery_alert = parseInt('1');
        }
        filter.mqtt_name = mqtt_name;
        filter.device_name = device_name;
        filter.action_name = action_name;
        filter.mqtt_control_on = encodeURI(mqtt_control_on);
        filter.mqtt_control_off = encodeURI(mqtt_control_off);
        filter.event = event;
        var count_alarm: number = Number(countalarm_master_io);
        filter.count_alarm = countalarm_master_io;
        var getAlarmDetails: any = await this.settingsService.getAlarmDetails(
          filter,
        );
        if (getAlarmDetails) {
          var alarmStatusSet: any = Number(getAlarmDetails.alarmStatusSet);
          var messageMqttControl: any = getAlarmDetails.messageMqttControl;
          var subject: any = getAlarmDetails.subject;
          var content: any = getAlarmDetails.content;
          var dataAlarmRs: any = getAlarmDetails.dataAlarm;
          var eventControl: any = getAlarmDetails.eventControl;
          var sensor_data: any = getAlarmDetails.sensor_data;
        } else {
          var getAlarmDetails: any = [];
          var alarmStatusSet: any = Number(999);
          var messageMqttControl: any = null;
          var subject: any = null;
          var content: any = null;
          var dataAlarmRs: any = null;
          var eventControl: any = null;
          var sensor_data: any = null;
        }
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          if (event == 1) {
            var eventSet: number = 1;
          } else {
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          if (event == 1) {
            var eventSet: number = 0;
          } else {
            var eventSet: number = 1;
          }
        }
        // ข้อมูลเวลา
        var cal_status_msg: any = {
          msg: ' -----------countalarm_master-1-----------',
          msg2: ' ----MQTT------',
          alarmStatusSet,
          setdatachk_main,
          MQTTGETDATA,
          // countalarm_rs_master,
        };
        const now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var devicecontrol: any = {};
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var inputCreate: any = {};
        var log_time: any = 0;
        var cal_status: number = 0;
        var msg2: any = '-----------------2222------------------------';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('2');
          var msg2: any =
            '-----------------alarmStatusSet 1------------------------';
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('2');
          var msg2: any =
            '-----------------alarmStatusSet 2------------------------';
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet 3------------------------';
        } else if (alarmStatusSet == 4) {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet 4------------------------';
        } else {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet ' +
            alarmStatusSet +
            '------------------------';
        }
        var cal_status_msg: any = {
          msg: ' -----------countalarm_master-1-----------',
          msg2: ' ----msg----' + msg2,
          alarmStatusSet,
          setdatachk_main,
          MQTTGETDATA,
          // countalarm_rs_master,
        };
        /************************************************************************************************************************************************** */
        ////////////////////////////////////////////////////////////////////////////////////
        var devicecontrol: any = {};
        var now_time_cal: number = 0;
        var createddate_logs: any = now_time_full;
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var inputCreate: any = {};
        var log_time: any = 0;
        var cal_status: number = 0;
        var cal_status_msg: any = '---';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
        } else {
          var validate_count: number = parseInt('1');
        }
        var fillter_device_control: any = {};
        fillter_device_control.alarm_action_id = alarm_action_id;
        //fillter_device_control.date =  format.getCurrentDatenow();
        //fillter_device_control.alarm_status=alarmStatusSet;
        if (alarmStatusSet == 999) {
          await this.settingsService.delete_alarmprocesslogal(
            fillter_device_control,
          );
          var msg =
            '2- delete_alarmprocesslogal -- device_access_control_check';
          return { msg, alarmStatusSet };
        }

        ////////////////
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          // alarm to  on /off
          var mqtt_get_data: any = encodeURI(mqtt_data_value);
          var mqtt_access_control: any = encodeURI(mqtt_data_control);
          if (event == 1) {
            var messageMqttControls: any = mqtt_control_on;
            var eventSet: number = 1;
          } else {
            var messageMqttControls: any = mqtt_control_off;
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          var mqtt_get_data: any = encodeURI(mqtt_data_value);
          var mqtt_access_control: any = encodeURI(mqtt_data_control);
          // alarm to recovery  to on /off
          if (event == 1) {
            var messageMqttControls: any = mqtt_control_off;
            var eventSet: number = 0;
          } else {
            var messageMqttControls: any = mqtt_control_on;
            var eventSet: number = 1;
          }
        }
        /////////////////////----------------Save LOG SENSOR-------------------////////////////////////
        var fillterDataSENSOR: any = {};
        if (alarm_action_id) {
          fillterDataSENSOR.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterDataSENSOR.event = eventSet;
        }
        if (date_now) {
          fillterDataSENSOR.date = date_now;
        }
        if (time_now) {
          fillterDataSENSOR.time = time_now;
        }
        if (alarmStatusSet == 1) {
          fillterDataSENSOR.status_warning = status_warning;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterDataSENSOR.status_alert = status_alert;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterDataSENSOR.recovery_warning = recovery_warning;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterDataSENSOR.recovery_alert = recovery_alert;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        var inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: subject + ` SENEOR Alarm `,
          content: content + ` SENEOR Alarm `,
        };

        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id_mas;
        var crsmaster: any = await this.settingsService.chk_alarm_temp_log_desc(
          setdatachk_main,
        );
        var countalarm_LogSensor: number = Number(crsmaster.length);

        ///////////////////////////
        if (crsmaster) {
          var createddate_logsMaim: any = format.timeConvertermas(
            format.convertTZ(crsmaster[0].createddate, process.env.tzString),
          );
          var now_time_cal_main: number = Number(
            format.diffMinutes(now_time_full, createddate_logsMaim),
          );
          if (now_time_cal_main > time_life) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();
            var crsmaster: any =
              await this.settingsService.checkDuplicateLogSensor(
                setdatachk_main,
              );
            if (crsmaster) {
              var countalarm_LogSensor: number = Number(crsmaster.length);
            } else {
              var countalarm_LogSensor: number = parseInt('0');
            }
            if (countalarm_LogSensor == 0) {
              var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
                inputCreate,
              );
              if (!isDuplicate) {
                await this.settingsService.manageAlarmLogRecoveryTwo(
                  inputCreate,
                  fillterDataSENSOR,
                  validate_count,
                );
                //continue  // ทำงาน ต่อไป
              }
            }
            if (countalarm_LogSensor >= validate_count) {
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                //fillter_device_control.date =  format.getCurrentDatenow();
                fillter_device_control.alarm_status = alarmStatusSet;
                await this.settingsService.delete_alarmprocesslogal(
                  fillter_device_control,
                );
                var msg =
                  '3- delete_alarmprocesslogal -- device_access_control_check';
                return { msg, alarmStatusSet };
              }
            }
          }
          if (alarmStatusSet == 3 || alarmStatusSet == 4) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();
            var crsmaster: any =
              await this.settingsService.checkDuplicateLogSensor(
                setdatachk_main,
              );
            if (crsmaster) {
              var countalarm_LogSensor: number = Number(crsmaster.length);
            } else {
              var countalarm_LogSensor: number = parseInt('0');
            }
            if (countalarm_LogSensor == 0) {
              var isDuplicate = await this.settingsService.checkDuplicateLogTwo(
                inputCreate,
              );
              if (!isDuplicate) {
                await this.settingsService.manageAlarmLogRecoveryTwo(
                  inputCreate,
                  fillterDataSENSOR,
                  validate_count,
                );
                //continue  // ทำงาน ต่อไป
              }
            }
            if (countalarm_LogSensor >= validate_count) {
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                //fillter_device_control.date =  format.getCurrentDatenow();
                fillter_device_control.alarm_status = alarmStatusSet;
                await this.settingsService.delete_alarmprocesslogal(
                  fillter_device_control,
                );
                var msg =
                  '4- delete_alarmprocesslogal -- device_access_control_check';
                return { msg, alarmStatusSet };
              }
            }
          }
        }
        var device_control_map: any = [];
        var fillter_device_control_map: any = {};
        fillter_device_control_map.alarm_action_id = alarm_action_id;
        fillter_device_control_map.bucket = bucket;
        //var device_control:any = await this.settingsService.deviceeventmap(fillter_device_control_map);
        //const device_control_map_count:number = Number(device_control.length);

        var rsss: any = {
          alarmStatusSet,
          device_control,
          device_control_map_count,
          countalarm_LogSensor,
          crsmaster,
          fillter_device_control,
        };
        // return rsss;

        if (device_control) {
          for (const [key, value] of Object.entries(device_control)) {
            const values: any = value;
            var alarm_action_id: number = Number(values.alarm_action_id);
            const device_id: number = Number(values.device_id);
            const mqtt_id: number = Number(values.mqtt_id);
            const type_id_control: number = Number(values.type_id);
            const mqtt_control_name: any = values.mqtt_name;
            const device_control_name: any = values.device_name;
            const type_control_name: any = values.type_name;
            const device_bucket: any = values.bucket;
            const status_warning: number = Number(values.status_warning);
            const status_alert: number = Number(values.status_alert);
            const recovery_warning: number = Number(values.recovery_warning);
            const recovery_alert: number = Number(values.recovery_alert);
            if (values.device_id == device_id_mas) {
            } else {
              // ไม่ใช่ device_id ตัวเอง
              const mqtt_control_on: any = values.mqtt_control_on;
              const mqtt_control_off: any = values.mqtt_control_off;
              const mqtt_data_value: any = encodeURI(values.mqtt_data_value);
              const mqtt_data_control: any = encodeURI(
                values.mqtt_data_control,
              );
              ///////////////
              if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                // alarm to recovery  to on /off
                var mqtt_get_data: any = encodeURI(mqtt_data_value);
                var mqtt_access_control: any = encodeURI(mqtt_data_control);
                if (event == 1) {
                  var messageMqttControls: any = mqtt_control_on;
                  var eventSet: number = 1;
                } else {
                  var messageMqttControls: any = mqtt_control_off;
                  var eventSet: number = 0;
                }
              } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                var mqtt_get_data: any = encodeURI(mqtt_data_value);
                var mqtt_access_control: any = encodeURI(mqtt_data_control);
                // alarm to recovery  to on /off
                if (event == 1) {
                  var messageMqttControls: any = mqtt_control_off;
                  var eventSet: number = 0;
                } else {
                  var messageMqttControls: any = mqtt_control_on;
                  var eventSet: number = 1;
                }
              }
              var datenow: any = format.getCurrentDatenow();
              var timenow: any = format.getCurrentTimenow();
              const fillter_device_control: any = {};
              fillter_device_control.alarm_action_id = alarm_action_id;
              fillter_device_control.device_id = device_id;
              const countAlarmDeviceDontrol: number = Number(
                await this.settingsService.count_alarmprocesslog(
                  fillter_device_control,
                ),
              );
              var RsIO: any = await this.settingsService.checkDuplicateLogIO(
                fillter_device_control,
              );
              var countalarm_LogIO: number = Number(RsIO.length);
              if (countalarm_LogIO == 0) {
                var createddate_logs: any = format.timeConvertermas(
                  format.convertTZ(datenow, process.env.tzString),
                );
              } else {
                var createddate_logs: any = format.timeConvertermas(
                  format.convertTZ(RsIO[0].createddate, process.env.tzString),
                );
              }
              const nowtimefull: any = format.timeConvertermas(
                format.convertTZ(
                  format.getCurrentFullDatenow(),
                  process.env.tzString,
                ),
              );
              var now_time_cal: number = Number(
                format.diffMinutes(nowtimefull, createddate_logs),
              );
              if (countAlarmDeviceDontrol > validate_count) {
                var validate_count_status: number = Number(1);
              } else {
                var validate_count_status: number = Number(2);
              }
              if (countAlarmDeviceDontrol <= validate_count) {
                var validate_count_status_do: number = Number(1);
              } else {
                var validate_count_status_do: number = Number(2);
              }
              if (now_time_cal > time_life) {
                var time_cal_status: number = Number(1);
              } else {
                var time_cal_status: number = Number(2);
              }
              if (validate_count_status_do == 1 && time_cal_status == 1) {
                var do_status: number = Number(1);
              } else {
                var do_status: number = Number(2);
              }
              if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                if (countAlarmDeviceDontrol >= 1) {
                  var do_status: number = Number(1);
                }
              }

              if (validate_count_status == 1 && time_cal_status == 1) {
                var not_do_status: number = Number(1);
              } else {
                var not_do_status: number = Number(2);
              }
              var fillterDel: any = {};
              fillterDel.alarm_action_id = alarm_action_id;
              fillterDel.device_id = device_id;
              //fillterDel.alarm_status = alarmStatusSet;
              if (validate_count_status == 1) {
                await this.settingsService.delete_alarm_process_log_fillter(
                  fillterDel,
                );
                continue; // ทำงาน ต่อไป
              }
              var devicecontrol: any = [];
              if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                if (do_status == 1) {
                  const topic_sends: any = encodeURI(mqtt_data_control);
                  const message_sends: any = encodeURI(messageMqttControls);
                  console.log(
                    `topic_sends=>` +
                      topic_sends +
                      ` message_sends=>` +
                      message_sends,
                  );
                  var devicecontrol: any = await this.mqttService.devicecontrol(
                    topic_sends,
                    message_sends,
                  );
                  if (devicecontrol) {
                    var device_status: any =
                      devicecontrol['dataObject']?.device_status;
                  } else {
                    var device_status: any = '--';
                  }
                  var inputCreate: any = {
                    alarm_action_id: alarm_action_id,
                    device_id: device_id,
                    type_id: type_id_control,
                    event: eventSet,
                    status: device_status,
                    alarm_type: alarmTypeId,
                    status_warning: status_warning,
                    recovery_warning: recovery_warning,
                    status_alert: status_alert,
                    recovery_alert: recovery_alert,
                    email_alarm: 0,
                    line_alarm: 0,
                    telegram_alarm: 0,
                    sms_alarm: 0,
                    nonc_alarm: 1,
                    date: format.getCurrentDatenow(),
                    time: format.getCurrentTimenow(),
                    data: dataAlarm,
                    createddate: new Date(),
                    updateddate: new Date(),
                    ata_alarm: dataAlarm,
                    alarm_status: alarmStatusSet,
                    subject:
                      subject +
                      ` 1-Control ` +
                      device_status +
                      ` device ` +
                      device_name,
                    content:
                      content +
                      ` 1-Control ` +
                      device_status +
                      `  device ` +
                      device_name +
                      ` Type ` +
                      type_control_name,
                  };
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLog(inputCreate);
                  if (!isDuplicate) {
                    await this.settingsService.manageAlarmLogRecovery(
                      inputCreate,
                      fillter_device_control,
                      validate_count,
                    );
                    continue; // ทำงาน ต่อไป
                  }
                }
              } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                if (do_status == 1) {
                  const topic_sends: any = encodeURI(mqtt_data_control);
                  const message_sends: any = encodeURI(messageMqttControls);
                  console.log(
                    `topic_sends=>` +
                      topic_sends +
                      ` message_sends=>` +
                      message_sends,
                  );
                  var devicecontrol: any = await this.mqttService.devicecontrol(
                    topic_sends,
                    message_sends,
                  );
                  if (devicecontrol) {
                    var device_status: any =
                      devicecontrol['dataObject']?.device_status;
                  } else {
                    var device_status: any = '--';
                  }
                  var inputCreate: any = {
                    alarm_action_id: alarm_action_id,
                    device_id: device_id,
                    type_id: type_id_control,
                    event: eventSet,
                    status: device_status,
                    alarm_type: alarmTypeId,
                    status_warning: status_warning,
                    recovery_warning: recovery_warning,
                    status_alert: status_alert,
                    recovery_alert: recovery_alert,
                    email_alarm: 0,
                    line_alarm: 0,
                    telegram_alarm: 0,
                    sms_alarm: 0,
                    nonc_alarm: 1,
                    date: format.getCurrentDatenow(),
                    time: format.getCurrentTimenow(),
                    data: dataAlarm,
                    createddate: new Date(),
                    updateddate: new Date(),
                    ata_alarm: dataAlarm,
                    alarm_status: alarmStatusSet,
                    subject:
                      subject +
                      ` 1-Control ` +
                      device_status +
                      ` device ` +
                      device_name,
                    content:
                      content +
                      ` 1-Control ` +
                      device_status +
                      `  device ` +
                      device_name +
                      ` Type ` +
                      type_control_name,
                  };
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLog(inputCreate);
                  if (!isDuplicate) {
                    await this.settingsService.manageAlarmLogRecovery(
                      inputCreate,
                      fillter_device_control,
                      validate_count,
                    );
                    continue; // ทำงาน ต่อไป
                  }
                }
              }
              device_control_map.push({
                count: {
                  time_cal_status,
                  do_status,
                  not_do_status,
                  validate_count_status_do,
                  validate_count_status,
                  now_time_cal,
                  time_life,
                  countalarm_LogIO,
                  createddate_logs,
                  countAlarmDeviceDontrol,
                  validate_count,
                  remark:
                    'validate_count_status=1 do validate_count_status=2 not do',
                  fillterDel: fillterDel,
                },
                control: {
                  event: event,
                  mqtt_data_control: mqtt_data_control,
                  messageMqttControls: messageMqttControls,
                  alarmStatusSet: alarmStatusSet,
                  fillter_device_control,
                  devicecontrol,
                  //inputCreate,
                },

                device: {
                  alarm_action_id: alarm_action_id,
                  mqtt_name: mqtt_name,
                  device_id_mas: device_id_mas,
                  device_name_mas: device_name,
                  device_id: device_id,
                  device_name: device_control_name,
                  type_id: type_id_control,
                  type_name: type_control_name,
                },
                mqtt: {
                  status_warning,
                  status_alert,
                  recovery_warning,
                  recovery_alert,
                  mqtt_control_on,
                  mqtt_control_off,
                  mqtt_name: mqtt_control_name,
                  mqtt_data_value: mqtt_data_value,
                  device_bucket: device_bucket,
                  eventSet: eventSet,
                },
                mqttgetAlarmDetails: {
                  alarmStatusSet,
                  messageMqttControl,
                  subject,
                  content,
                  dataAlarmRs,
                  eventControl,
                  sensor_data,
                },
              });
            }
          }
        }
        /////////////////////-------------device_control main-----------////////////////////
        /////////////////////-------------device_control main-----------////////////////////
        /////////////////////-------------device_control main-----------////////////////////
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          status: 1,
          payload: {
            MQTTGETDATA,
            filter,
            //getAlarmDetails,
            //cal_status_msg,
            alarmStatusSet,
          },
          device_control_map,
          message: `Mqtt connect..device_access_control_check`,
          message_th: `Mqtt connect..`,
        };
        return mqttconnect;
      } else {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: {},
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can not connect..device_access_control_check`,
          message_th: `Mqtt can not connect..`,
        };
        return mqttconnect;
      }
      ///////////////////--------------MQTT--------------/////////////////////////////////////////
    } catch (error) {
      console.error('mqtt device_access_control_check error:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
    }
  }
  async alarm_to_email(dto: any) {
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน

    var timestamps: any = datePart + ' ' + timePart;
    //var UrlMqtt:any = process.env.MQTT_HOST;
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      var Mqttstatus: any = checkConnectionMqtt.status;
    } else {
      var Mqttstatus: any = false;
    }
    var setOption = dto.setOption;
    var cachetimeset = dto.cachetimeset;
    var cachetimeset1 = dto.cachetimeset1;
    var cachetimeset2 = dto.cachetimeset2;
    var cachetimeset3 = dto.cachetimeset3;
    var cachetimeset4 = dto.cachetimeset4;
    var deletecache = dto.deletecache;
    var kaycache_cache_a1 = dto.kaycache_cache_a1;
    var alarm_action_id: number = parseInt(dto.alarm_action_id);
    var device_id: any = dto.device_id;
    var device_id_mas: number = parseInt(dto.device_id_mas);
    var crsmasterio = dto.crsmasterio;
    var countalarm_master_io = dto.countalarm_master_io;
    var device_control = dto.device_control;
    var device_control_map_count = dto.device_control_map_count;

    var event: number = parseInt(dto.event);
    var time_life: any = dto.time_life;
    var bucket: any = dto.bucket;
    var location_id: any = dto.location_id;
    var values: any = dto.values;
    var mqtt_data_value: any = dto.mqtt_data_value;
    var mqtt_data_control: any = dto.mqtt_data_control;
    var configdata: any = dto.configdata;
    var mqtt_status_data_name: any = dto.mqtt_status_data_name;
    ///////////
    var type_id: number = parseInt(dto.type_id);
    ///////////
    var status_alert: any = dto.status_alert;
    var status_warning: any = dto.status_warning;
    var recovery_warning: any = dto.recovery_warning;
    var recovery_alert: any = dto.recovery_alert;
    ///////////
    var mqtt_name: any = dto.mqtt_name;
    var device_name: any = dto.device_name;
    var action_name: any = dto.action_name;
    var mqtt_control_on: any = dto.mqtt_control_on;
    var mqtt_control_off: any = dto.mqtt_control_off;
    var subject: any = dto.subject;
    var content: any = dto.content;
    var status: any = dto.status;
    var alarmStatusSet: any = dto.alarmStatusSet;
    var dataAlarm: any = dto.dataAlarm;
    var eventControl: any = dto.eventControl;
    var messageMqttControl: any = dto.messageMqttControl;
    var sensor_data: any = dto.sensor_data;
    var count_alarm = dto.count_alarm;
    var mqttconnect: any = [];
    var chk_email: any = {};
    chk_email.alarm_action_id = alarm_action_id;
    chk_email.device_id = device_id;
    try {
      var crsmasterio: any =
        await this.settingsService.chk_alarmprocesslogemail(chk_email);
      var count_alarm_master_email: number = crsmasterio?.length || 0;
    } catch (error) {
      console.error('Error checking alarm process log:', error);
      var count_alarm_master_email: number = 0;
    }

    if (crsmasterio) {
      var count_alarm_master_email: number = count_alarm_master_email;
      var rssData: any = crsmasterio[0];
    } else {
      var count_alarm_master_email: number = parseInt('0');
      var rssData: any = '';
    }
    var now_time_full: any = format.timeConvertermas(
      format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString),
    );
    if (count_alarm_master_email > 0) {
      var createddate_logs_Email: any = format.timeConvertermas(
        format.convertTZ(rssData.createddate, process.env.tzString),
      );
      var now_time_cal_main: number = Number(
        format.diffMinutes(now_time_full, createddate_logs_Email),
      );
      var caseSet: number = 1;
      if (now_time_cal_main > time_life) {
        // return {now_time_cal_main,time_life,count_alarm_master_email,crsmasterio};
        var access_email: any = this.device_access_email_check(dto);
        if (count_alarm_master_email >= 3) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          await this.settingsService.delete_alarmp_emaillog(
            fillter_device_control,
          );
        }
        return access_email;
      }
      return {
        now_time_cal_main,
        time_life,
        count_alarm_master_email,
        rs: rssData,
      };
    } else {
      //return {now_time_cal_main,time_life,count_alarm_master_email,crsmasterio};
      var access_email: any = this.device_access_email_new(dto);
      return access_email;
    }
  }
  async device_access_email_new(dto: any) {
    try {
      var values: any = dto.values;
      var mqtt_data_value: any = dto.mqtt_data_value;
      var mqtt_data_control: any = dto.mqtt_data_control;
      var configdata: any = dto.configdata;
      var mqtt_status_data_name: any = dto.mqtt_status_data_name;
      ///////////
      var setOption = dto.setOption;
      var cachetimeset = dto.cachetimeset;
      var cachetimeset1 = dto.cachetimeset1;
      var cachetimeset2 = dto.cachetimeset2;
      var cachetimeset3 = dto.cachetimeset3;
      var cachetimeset4 = dto.cachetimeset4;
      var type_id: number = Number(dto.type_id);
      ///////////
      var status_alert: any = dto.status_alert;
      var status_warning: any = dto.status_warning;
      var recovery_warning: any = dto.recovery_warning;
      var recovery_alert: any = dto.recovery_alert;
      ///////////
      var mqtt_name: any = dto.mqtt_name;
      var device_name: any = dto.device_name;
      var action_name: any = dto.action_name;
      var mqtt_control_on: any = dto.mqtt_control_on;
      var mqtt_control_off: any = dto.mqtt_control_off;
      var alarm_action_id: number = parseInt(dto.alarm_action_id);
      var device_id_mas: number = parseInt(dto.device_id);
      var event: number = parseInt(dto.event);
      var time_life: any = dto.time_life;
      var bucket: any = dto.bucket;
      var mqttconnect: any = [];
      // var setdatachk_main:any={};
      //     setdatachk_main.alarm_action_id = alarm_action_id;
      //     setdatachk_main.device_id = device_id_mas;
      // var crsmaster:any= await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
      // if(crsmaster){
      //       var countalarm_master:number= Number(crsmaster.length);
      // }else{
      //     var countalarm_master:number=parseInt('0');
      // }
      ////IO
      var setdatachk_main_io: any = {};
      setdatachk_main_io.alarm_action_id = alarm_action_id;
      setdatachk_main_io.device_id = device_id_mas;
      var crsmasterio: any =
        await this.settingsService.chk_alarmprocesslogemail(setdatachk_main_io);
      if (crsmasterio) {
        var countalarm_master_io: number = parseInt(crsmasterio.length);
      } else {
        var countalarm_master_io: number = parseInt('0');
      }
      var keyword: any = dto.keyword;
      var mqtt_id: any = dto.mqtt_id;
      var filterAlarm: any = {};
      if (device_id_mas) {
        //filter.device_id=device_id_mas
      }
      if (keyword) {
        filterAlarm.keyword = keyword;
      }
      if (mqtt_id) {
        filterAlarm.mqtt_id = mqtt_id;
      }
      if (bucket) {
        filterAlarm.bucket = bucket;
      }
      if (type_id) {
        filterAlarm.type_id = type_id;
      }
      if (alarm_action_id) {
        filterAlarm.alarm_action_id = alarm_action_id;
      }
      var getdeviceactivemqttAlarmEmail: any =
        await this.getdeviceactivemqttAlarmEmail(filterAlarm);
      ///////////////////--------------MQTT--------------/////////////////////////////////////////
      if (!mqtt_data_value || mqtt_data_value == undefined) {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          mqtt_data_value,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can get mqtt_data_value..`,
          message_th: `Mqtt can not get mqtt_data_value...`,
        };
        return mqttconnect;
      }
      const MQTTGETDATA: any = await this.mqttService.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqttService.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqttService.getdevicedataAll(
          mqtt_data_value,
        );
        const mqttData = mqttrs['data'];
        const mqttDataCount: number = parseInt(mqttData.length);
        const configObj = JSON.parse(configdata);
        const mqttConfigData = Object.values(configObj);
        const mqttCount: number = Number(mqttConfigData.length);
        const statusDataObj = JSON.parse(mqtt_status_data_name);
        const mqttStatusData = Object.values(statusDataObj);
        const merged = format.mapMqttDataToDeviceV2(
          [values],
          mqttDataCount < mqttCount
            ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
            : Object.fromEntries(
                mqttConfigData.map((k, i) => [k, mqttData[i]]),
              ),
        )[0];
        var sensorValueData = merged.value_data;
        var value_alarm: any = Number(merged.value_alarm);
        var value_relay: any = Number(merged.value_relay);
        var value_control_relay: any = Number(merged.value_control_relay);
        var sensorValue: any = sensorValueData;
        var date_now: any = format.getCurrentDatenow();
        var time_now: any = format.getCurrentTimenow();
        // กำหนดค่าสำหรับการตรวจสอบ alarm
        if (type_id == 1) {
          var dataAlarm: any = encodeURI(sensorValue);
          var alarmValue: any = encodeURI(value_alarm);
        } else {
          var dataAlarm: any = encodeURI(sensorValueData);
          var alarmValue: any = encodeURI(value_alarm);
        }
        var alarmTypeId: any = type_id;
        // ดึงรายละเอียด Alarm
        var filter: any = {};
        filter.alarmTypeId = type_id;
        if (type_id == 1) {
          filter.sensorValueData = encodeURI(sensorValue); //sensor
          filter.status_warning = encodeURI(status_warning);
          filter.status_alert = encodeURI(status_alert);
          filter.recovery_warning = encodeURI(recovery_warning);
          filter.recovery_alert = encodeURI(recovery_alert);
        } else {
          filter.sensorValueData = encodeURI(value_alarm); //IO
          filter.status_warning = parseInt('0');
          filter.status_alert = parseInt('0');
          filter.recovery_warning = parseInt('1');
          filter.recovery_alert = parseInt('1');
        }
        filter.mqtt_name = mqtt_name;
        filter.device_name = device_name;
        filter.action_name = action_name;
        filter.mqtt_control_on = encodeURI(mqtt_control_on);
        filter.mqtt_control_off = encodeURI(mqtt_control_off);
        filter.event = event;
        // master
        var setdatachk: any = {};
        setdatachk.alarm_action_id = alarm_action_id;
        setdatachk.device_id = device_id_mas;
        setdatachk.type_id = type_id;
        var count_alarm: number = Number(countalarm_master_io);
        filter.count_alarm = countalarm_master_io;
        var getAlarmDetails: any = await this.settingsService.getAlarmDetails(
          filter,
        );
        if (getAlarmDetails) {
          var alarmStatusSet: any = Number(getAlarmDetails.alarmStatusSet);
          var messageMqttControl: any = getAlarmDetails.messageMqttControl;
          var subject: any = getAlarmDetails.subject;
          var content: any = getAlarmDetails.content;
          var dataAlarmRs: any = getAlarmDetails.dataAlarm;
          var eventControl: any = getAlarmDetails.eventControl;
          var sensor_data: any = getAlarmDetails.sensor_data;
        } else {
          var getAlarmDetails: any = [];
          var alarmStatusSet: any = null;
          var messageMqttControl: any = null;
          var subject: any = null;
          var content: any = null;
          var dataAlarmRs: any = null;
          var eventControl: any = null;
          var sensor_data: any = null;
        }
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          if (event == 1) {
            var eventSet: number = 1;
          } else {
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          if (event == 1) {
            var eventSet: number = 0;
          } else {
            var eventSet: number = 1;
          }
        }
        // ข้อมูลเวลา
        const now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var devicecontrol: any = {};
        var now_time_cal: number = 0;
        var createddate_logs: any = now_time_full;
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var log_time: any = 0;
        var cal_status: number = 0;
        var cal_status_msg: any = '---';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('2');
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
        } else {
          var validate_count: number = parseInt('1');
        }
        if (alarmStatusSet == 999) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          fillter_device_control.date = format.getCurrentDatenow();
          fillter_device_control.alarm_status = alarmStatusSet;
          await this.settingsService.delete_alarmp_emaillog(
            fillter_device_control,
          );
        }
        /////////////////////----------------Save LOG -------------------////////////////////////
        var fillterData: any = {};
        if (alarm_action_id) {
          fillterData.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterData.event = eventSet;
        }
        if (type_id) {
          fillterData.type_id = type_id;
        }
        if (date_now) {
          fillterData.date = date_now;
        }
        if (time_now) {
          fillterData.time = time_now;
        }
        if (alarmStatusSet == 1) {
          fillterData.status_warning = status_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterData.status_alert = status_alert;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterData.recovery_warning = recovery_warning;
          fillterData.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterData.recovery_alert = recovery_alert;
          fillterData.alarm_status = alarmStatusSet;
        }
        var tag: any = 1;
        const inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: 'Send email:' + subject,
          content: 'Send email:' + content,
        };
        var cal_status_msg: any = {
          msg: ' -----------countalarm_master-0------------',
          msg2: ' ----countalarm_master->0----1-case 1-2  mqtt connect---------',
          alarmStatusSet,
          inputCreate,
        };
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          if (alarmStatusSet != 999) {
            var isDuplicate =
              await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
            if (!isDuplicate) {
              await this.settingsService.getAlarmDetailsSendEmail(filter);
              await this.settingsService.manageAlarmLogEmail(
                inputCreate,
                fillterData,
                validate_count,
              );
            }
          }
        }
        if (alarmStatusSet == 999) {
          var device_control: any = [];
        } else {
        }
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          alarmStatusSet,
          payload: MQTTGETDATA,
          getdeviceactivemqttAlarmEmail,
          // device_control,
          status: 1,
          case: 2,
          date_now,
          time_now,
          sensorValueData,
          value_alarm,
          value_relay,
          value_control_relay,
          sensorValue,
          count_validate: validate_count,
          messageMqttControl,
          subject,
          content,
          dataAlarmRs,
          eventControl,
          sensor_data,
          time_life,
          mqtt_data_value,
          mqtt_data_control,
          mqtt_control_on,
          mqtt_control_off,
          //cal_status_msg,
          filter,
          message: `new Mqtt connect device_access_email_new..`,
          message_th: `new Mqtt connect device_access_email_new..`,
        };
        return mqttconnect;
      } else {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          getdeviceactivemqttAlarmEmail,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can not connect device_access_email_new..`,
          message_th: `Mqtt can not connect device_access_email_new..`,
        };
        return mqttconnect;
      }
    } catch (error) {
      console.error('mqtt device_access_email_new error:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
    }
  }
  async device_access_email_check(dto: any) {
    try {
      var keyword: any = dto.keyword;
      var values: any = dto.values;
      var mqtt_data_value: any = dto.mqtt_data_value;
      var mqtt_data_control: any = dto.mqtt_data_control;
      var configdata: any = dto.configdata;
      var mqtt_status_data_name: any = dto.mqtt_status_data_name;
      ///////////
      var setOption = dto.setOption;
      var cachetimeset = dto.cachetimeset;
      var cachetimeset1 = dto.cachetimeset1;
      var cachetimeset2 = dto.cachetimeset2;
      var cachetimeset3 = dto.cachetimeset3;
      var cachetimeset4 = dto.cachetimeset4;
      var type_id: number = Number(dto.type_id);
      ///////////
      var status_alert: any = dto.status_alert;
      var status_warning: any = dto.status_warning;
      var recovery_warning: any = dto.recovery_warning;
      var recovery_alert: any = dto.recovery_alert;
      ///////////
      var mqtt_id: any = dto.mqtt_id;
      var mqtt_name: any = dto.mqtt_name;
      var device_name: any = dto.device_name;
      var action_name: any = dto.action_name;
      var mqtt_control_on: any = dto.mqtt_control_on;
      var mqtt_control_off: any = dto.mqtt_control_off;
      var alarm_action_id: number = Number(dto.alarm_action_id);
      var device_id_mas: number = Number(dto.device_id);
      var event: number = Number(dto.event);
      var time_life: any = dto.time_life;
      var bucket: any = dto.bucket;
      var mqttconnect: any = [];
      var setdatachk_main_io: any = {};
      setdatachk_main_io.alarm_action_id = alarm_action_id;
      setdatachk_main_io.device_id = device_id_mas;
      var crsmasterio: any =
        await this.settingsService.chk_alarmprocesslogemail(setdatachk_main_io);
      if (crsmasterio) {
        var countalarm_master_io: number = Number(crsmasterio.length);
      } else {
        var countalarm_master_io: number = parseInt('0');
      }

      var keyword: any = dto.keyword;
      var mqtt_id: any = dto.mqtt_id;
      var filterAlarm: any = {};
      if (device_id_mas) {
        //filter.device_id=device_id_mas
      }
      if (keyword) {
        filterAlarm.keyword = keyword;
      }
      if (mqtt_id) {
        filterAlarm.mqtt_id = mqtt_id;
      }
      if (bucket) {
        filterAlarm.bucket = bucket;
      }
      if (type_id) {
        filterAlarm.type_id = type_id;
      }
      if (alarm_action_id) {
        filterAlarm.alarm_action_id = alarm_action_id;
      }
      var getdeviceactivemqttAlarmEmail: any =
        await this.getdeviceactivemqttAlarmEmail(filterAlarm);
      ///////////////////--------------MQTT--------------/////////////////////////////////////////
      if (!mqtt_data_value || mqtt_data_value == undefined) {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: null,
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          mqtt_data_value,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can get mqtt_data_value..`,
          message_th: `Mqtt can not get mqtt_data_value...`,
        };
        return mqttconnect;
      }
      const MQTTGETDATA: any = await this.mqttService.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqttService.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqttService.getdevicedataAll(
          mqtt_data_value,
        );
        const mqttData = mqttrs['data'];
        const mqttDataCount: number = Number(mqttData.length);
        const configObj = JSON.parse(configdata);
        const mqttConfigData = Object.values(configObj);
        const mqttCount: number = Number(mqttConfigData.length);
        const statusDataObj = JSON.parse(mqtt_status_data_name);
        const mqttStatusData = Object.values(statusDataObj);
        const merged = format.mapMqttDataToDeviceV2(
          [values],
          mqttDataCount < mqttCount
            ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
            : Object.fromEntries(
                mqttConfigData.map((k, i) => [k, mqttData[i]]),
              ),
        )[0];
        var sensorValueData = merged.value_data;
        var value_alarm: any = Number(merged.value_alarm);
        var value_relay: any = Number(merged.value_relay);
        var value_control_relay: any = Number(merged.value_control_relay);
        var sensorValue: any = sensorValueData;
        var date_now: any = format.getCurrentDatenow();
        var time_now: any = format.getCurrentTimenow();
        // กำหนดค่าสำหรับการตรวจสอบ alarm
        if (type_id == 1) {
          var dataAlarm: any = encodeURI(sensorValue);
          var alarmValue: any = encodeURI(value_alarm);
        } else {
          var dataAlarm: any = encodeURI(sensorValueData);
          var alarmValue: any = encodeURI(value_alarm);
        }
        var alarmTypeId: any = type_id;
        // ดึงรายละเอียด Alarm
        var filter: any = {};
        filter.alarmTypeId = type_id;
        if (type_id == 1) {
          filter.sensorValueData = encodeURI(sensorValue); //sensor
          filter.status_warning = encodeURI(status_warning);
          filter.status_alert = encodeURI(status_alert);
          filter.recovery_warning = encodeURI(recovery_warning);
          filter.recovery_alert = encodeURI(recovery_alert);
        } else {
          filter.sensorValueData = encodeURI(value_alarm); //IO
          filter.status_warning = parseInt('0');
          filter.status_alert = parseInt('0');
          filter.recovery_warning = parseInt('1');
          filter.recovery_alert = parseInt('1');
        }
        filter.mqtt_name = mqtt_name;
        filter.device_name = device_name;
        filter.action_name = action_name;
        filter.mqtt_control_on = encodeURI(mqtt_control_on);
        filter.mqtt_control_off = encodeURI(mqtt_control_off);
        filter.event = event;
        var count_alarm: number = Number(countalarm_master_io);
        filter.count_alarm = countalarm_master_io;
        var getAlarmDetails: any = await this.settingsService.getAlarmDetails(
          filter,
        );
        if (getAlarmDetails) {
          var alarmStatusSet: any = Number(getAlarmDetails.alarmStatusSet);
          var messageMqttControl: any = getAlarmDetails.messageMqttControl;
          var subject: any = getAlarmDetails.subject;
          var content: any = getAlarmDetails.content;
          var dataAlarmRs: any = getAlarmDetails.dataAlarm;
          var eventControl: any = getAlarmDetails.eventControl;
          var sensor_data: any = getAlarmDetails.sensor_data;
        } else {
          var getAlarmDetails: any = [];
          var alarmStatusSet: any = Number(999);
          var messageMqttControl: any = null;
          var subject: any = null;
          var content: any = null;
          var dataAlarmRs: any = null;
          var eventControl: any = null;
          var sensor_data: any = null;
        }
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          if (event == 1) {
            var eventSet: number = 1;
          } else {
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          if (event == 1) {
            var eventSet: number = 0;
          } else {
            var eventSet: number = 1;
          }
        }
        // ข้อมูลเวลา
        var cal_status_msg: any = {
          msg: ' -----------countalarm_master-1-----------',
          msg2: ' ----MQTT------',
          alarmStatusSet,
          setdatachk_main,
          MQTTGETDATA,
          // countalarm_rs_master,
        };
        const now_time_full: any = format.timeConvertermas(
          format.convertTZ(
            format.getCurrentFullDatenow(),
            process.env.tzString,
          ),
        );
        var devicecontrol: any = {};
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var inputCreate: any = {};
        var log_time: any = 0;
        var cal_status: number = 0;
        var msg2: any = '-----------------2222------------------------';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('2');
          var msg2: any =
            '-----------------alarmStatusSet 1------------------------';
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('2');
          var msg2: any =
            '-----------------alarmStatusSet 2------------------------';
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet 3------------------------';
        } else if (alarmStatusSet == 4) {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet 4------------------------';
        } else {
          var validate_count: number = parseInt('1');
          var msg2: any =
            '-----------------alarmStatusSet ' +
            alarmStatusSet +
            '------------------------';
        }
        var cal_status_msg: any = {
          msg: ' -----------countalarm_master-1-----------',
          msg2: ' ----msg----' + msg2,
          alarmStatusSet,
          setdatachk_main,
          MQTTGETDATA,
          // countalarm_rs_master,
        };
        /************************************************************************************************************************************************** */
        ////////////////////////////////////////////////////////////////////////////////////
        var devicecontrol: any = {};
        var now_time_cal: number = 0;
        var createddate_logs: any = now_time_full;
        // ประกาศตัวแปรที่ใช้ในหลายสาขา
        var setdata_chk2: any = {};
        var new_count_alarm2: number = 0;
        var inputCreate: any = {};
        var log_time: any = 0;
        var cal_status: number = 0;
        var cal_status_msg: any = '---';
        if (alarmStatusSet == 1) {
          var validate_count: number = parseInt('3');
        } else if (alarmStatusSet == 2) {
          var validate_count: number = parseInt('3');
        } else if (alarmStatusSet == 3) {
          var validate_count: number = parseInt('1');
        } else {
          var validate_count: number = parseInt('1');
        }
        if (alarmStatusSet == 999) {
          const fillter_device_control: any = {};
          fillter_device_control.alarm_action_id = alarm_action_id;
          // fillter_device_control.date =  format.getCurrentDatenow();
          // fillter_device_control.alarm_status=alarmStatusSet;
          await this.settingsService.delete_alarmp_emaillog(
            fillter_device_control,
          );
        }
        ////////////////
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
          // alarm to  on /off
          var mqtt_get_data: any = encodeURI(mqtt_data_value);
          var mqtt_access_control: any = encodeURI(mqtt_data_control);
          if (event == 1) {
            var messageMqttControls: any = mqtt_control_on;
            var eventSet: number = 1;
          } else {
            var messageMqttControls: any = mqtt_control_off;
            var eventSet: number = 0;
          }
        } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
          var mqtt_get_data: any = encodeURI(mqtt_data_value);
          var mqtt_access_control: any = encodeURI(mqtt_data_control);
          // alarm to recovery  to on /off
          if (event == 1) {
            var messageMqttControls: any = mqtt_control_off;
            var eventSet: number = 0;
          } else {
            var messageMqttControls: any = mqtt_control_on;
            var eventSet: number = 1;
          }
        }
        /////////////////////----------------Save LOG SENSOR-------------------////////////////////////
        var fillterDataSENSOR: any = {};
        if (alarm_action_id) {
          fillterDataSENSOR.alarm_action_id = alarm_action_id;
        }
        if (eventSet) {
          fillterDataSENSOR.event = eventSet;
        }
        if (date_now) {
          fillterDataSENSOR.date = date_now;
        }
        if (time_now) {
          fillterDataSENSOR.time = time_now;
        }
        if (alarmStatusSet == 1) {
          fillterDataSENSOR.status_warning = status_warning;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 2) {
          fillterDataSENSOR.status_alert = status_alert;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 3) {
          fillterDataSENSOR.recovery_warning = recovery_warning;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        } else if (alarmStatusSet == 4) {
          fillterDataSENSOR.recovery_alert = recovery_alert;
          fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        var inputCreate: any = {
          alarm_action_id: alarm_action_id,
          device_id: device_id_mas,
          type_id: type_id,
          event: eventSet,
          status: 1,
          alarm_type: alarmTypeId,
          status_warning: status_warning,
          recovery_warning: recovery_warning,
          status_alert: status_alert,
          recovery_alert: recovery_alert,
          email_alarm: 0,
          line_alarm: 0,
          telegram_alarm: 0,
          sms_alarm: 0,
          nonc_alarm: 1,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: dataAlarm,
          createddate: new Date(),
          updateddate: new Date(),
          ata_alarm: dataAlarm,
          alarm_status: alarmStatusSet,
          subject: 'Send email:' + subject,
          content: 'Send email:' + content,
        };

        var setdatachk_main: any = {};
        setdatachk_main.alarm_action_id = alarm_action_id;
        setdatachk_main.device_id = device_id_mas;
        var crsmaster: any =
          await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
        if (crsmaster) {
          var crsmaster_email: any =
            await this.settingsService.chk_alarmprocesslogemail(
              setdatachk_main,
            );
          var count_crsmaster_email: number =
            parseInt(crsmaster_email.length) || 0;
          if (count_crsmaster_email == 0) {
            let createddate: any = new Date();
            var createddate_logsMaim: any = format.timeConvertermas(
              format.convertTZ(createddate, process.env.tzString),
            );
          } else {
            var createddate_logsMaim: any = format.timeConvertermas(
              format.convertTZ(crsmaster[0].createddate, process.env.tzString),
            );
          }
          var now_time_cal_main: number = Number(
            format.diffMinutes(now_time_full, createddate_logsMaim),
          );
          if (now_time_cal_main > time_life) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();
            var crsmaster: any =
              await this.settingsService.chk_alarmprocesslogemail(
                setdatachk_main,
              );
            if (crsmaster) {
              var countalarm_LogSensor: number = Number(crsmaster.length);
            } else {
              var countalarm_LogSensor: number = parseInt('0');
            }
            if (countalarm_LogSensor == 0) {
              if (alarmStatusSet != 999) {
                var isDuplicate =
                  await this.settingsService.checkDuplicateLogEmailOne(
                    inputCreate,
                  );
                if (!isDuplicate) {
                  await this.settingsService.getAlarmDetailsSendEmail(filter);
                  await this.settingsService.manageAlarmLogEmail(
                    inputCreate,
                    fillterDataSENSOR,
                    validate_count,
                  );
                  //continue  // ทำงาน ต่อไป
                }
              }
            } else if (countalarm_LogSensor > validate_count) {
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id_mas;
                // fillter_device_control.date =  format.getCurrentDatenow();
                // fillter_device_control.alarm_status=alarmStatusSet;
                await this.settingsService.delete_alarmp_emaillog(
                  fillter_device_control,
                );
              }
            }
          }
          if (alarmStatusSet == 3 || alarmStatusSet == 4) {
            var mqttconnect: any = [];
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            setdatachk_main.alarm_status = alarmStatusSet;
            setdatachk_main.date = format.getCurrentDatenow();
            setdatachk_main.time = format.getCurrentTimenow();
            var crsmaster: any =
              await this.settingsService.chk_alarmprocesslogemail(
                setdatachk_main,
              );
            if (crsmaster) {
              var countalarm_LogSensor: number = Number(crsmaster.length);
            } else {
              var countalarm_LogSensor: number = parseInt('0');
            }
            if (countalarm_LogSensor == 0) {
              if (alarmStatusSet != 999) {
                var isDuplicate =
                  await this.settingsService.checkDuplicateLogEmailOne(
                    inputCreate,
                  );
                if (!isDuplicate) {
                  await this.settingsService.getAlarmDetailsSendEmail(filter);
                  await this.settingsService.manageAlarmLogEmail(
                    inputCreate,
                    fillterDataSENSOR,
                    validate_count,
                  );
                  //continue  // ทำงาน ต่อไป
                }
              }
            } else {
              var setdatachk_main: any = {};
              setdatachk_main.alarm_action_id = alarm_action_id;
              setdatachk_main.device_id = device_id_mas;
              // setdatachk_main.alarm_status = alarmStatusSet;
              // setdatachk_main.date = format.getCurrentDatenow();
              // setdatachk_main.time = format.getCurrentTimenow();
              var crsmaster: any =
                await this.settingsService.chk_alarmprocesslogemail(
                  setdatachk_main,
                );
              if (crsmaster) {
                var countalarm_LogSensor: number = parseInt(crsmaster.length);
              } else {
                var countalarm_LogSensor: number = parseInt('0');
              }

              if (countalarm_LogSensor >= 1) {
                if (alarmStatusSet != 999) {
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLogEmailOne(
                      inputCreate,
                    );
                  if (!isDuplicate) {
                    await this.settingsService.getAlarmDetailsSendEmail(filter);
                    await this.settingsService.manageAlarmLogEmail(
                      inputCreate,
                      fillterDataSENSOR,
                      validate_count,
                    );
                    //continue  // ทำงาน ต่อไป
                  }
                }
              }
            }

            if (alarmStatusSet == 999) {
              const fillter_device_control: any = {};
              fillter_device_control.alarm_action_id = alarm_action_id;
              //fillter_device_control.device_id = device_id_mas;
              // fillter_device_control.date =  format.getCurrentDatenow();
              // fillter_device_control.alarm_status=alarmStatusSet;
              await this.settingsService.delete_alarmp_emaillog(
                fillter_device_control,
              );
            }
          }
        }
        /////////////////////----------------Save LOG SENSOR-------------------////////////////////////
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          status: 1,
          payload: {
            MQTTGETDATA,
            getdeviceactivemqttAlarmEmail,
            filter,
            //getAlarmDetails,
            //cal_status_msg,
            alarmStatusSet,
          },
          message: `Mqtt connect..device_access_email_check`,
          message_th: `Mqtt connect..`,
        };
        return mqttconnect;
      } else {
        var mqttconnect: any = {
          statusCode: 200,
          code: 200,
          payload: {
            getdeviceactivemqttAlarmEmail,
          },
          date_now: null,
          time_now: null,
          sensorValueData: null,
          value_alarm: null,
          value_relay: null,
          value_control_relay: null,
          sensorValue: null,
          count_alarm: null,
          getAlarmDetails: [],
          status: 0,
          case: 1,
          message: `Mqtt can not connect..device_access_email_check`,
          message_th: `Mqtt can not connect..`,
        };
        return mqttconnect;
      }
      ///////////////////--------------MQTT--------------/////////////////////////////////////////
    } catch (error) {
      console.error('mqtt device_access_email_check error:', error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          message: error.message || 'An error occurred',
        },
      });
    }
  }
  async parseMqttData(dataString: any) {
    const parts = dataString.split(',');
    return {
      device: parts[0],
      name: parseFloat(parts[1]),
      data: parts,
    };
  }
  async devicemoniiterRS(query: any) {
    var option: number = query.option;
    if (!option) {
      var option: number = parseInt('2');
    }
    var filter: any = {};
    filter.sort = query.sort;
    filter.keyword = query.keyword || '';
    filter.location_id = query.location_id;
    filter.type_name = query.type_name || '';
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.status = status || 1;
    filter.option = option;
    console.log(`filter=`);
    console.info(filter);
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter);
    format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน
    var timestamps = datePart + ' ' + timePart;
    var tempData2: any = [];
    /*******************/
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_air(filter);
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );

      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
        var data: any = value_data + ' ' + unit;
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
        var data: any = Number(value_alarm);
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }

      var timestamp: any = timestamps;
      var sensor_data_name: any = subject;

      const DataRs: any = {
        device_id: rs.device_id,
        //configdata,
        // mqttdata_arr,
        //mqttdata,
        //mqttData_count,
        //mqttData,
        //merged_data,
        //merged,

        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        device_name: mqtt_device_name,
        data: data,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        subject,
        status,
        status_remart:
          '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        //updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        devicename: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        // main_max,
        // main_min,
        main_type_id,
        date,
        time,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      tempData.push(va);
      tempData2.push(DataRs);
    }
    return tempData2;
  }
  async devicemoniiterRSS(query: any) {
    var filter: any = {};
    filter.sort = query.sort;
    filter.keyword = query.keyword || '';
    //filter.location_id = location_id;
    filter.type_name = query.type_name || '';
    filter.device_id = query.device_id || '';
    filter.mqtt_id = query.mqtt_id || '';
    filter.type_id = query.type_id || '';
    filter.org = query.org || '';
    filter.bucket = query.bucket || '';
    filter.status = status || 1;
    filter.option = 1;
    console.log(`filter=`);
    console.info(filter);
    const deletecache: any = query.deletecache || 0;
    var cachekey = 'device_list_alarm_air' + md5(filter);
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    // รวมวันที่และเวลาเข้าด้วยกัน
    var timestamps = datePart + ' ' + timePart;
    var tempData2: any = [];
    let ResultData: any =
      await this.settingsService.device_list_ststus_alarm_airs(filter);
    let tempData = [];
    let tempDataoid = [];
    for (var [key, va] of Object.entries(ResultData)) {
      var rs: any = ResultData[key];
      var evice_id: any = rs.evice_id;
      var mqtt_id: any = rs.mqtt_id;
      var setting_id: any = rs.setting_id;
      var type_id: any = rs.type_id;
      var device_name: any = rs.device_name;
      var sn: any = rs.sn;
      var hardware_id: any = rs.hardware_id;
      var status_warning: any = rs.status_warning;
      var recovery_warning: any = rs.recovery_warning;
      var status_alert: any = rs.status_alert;
      var recovery_alert: any = rs.recovery_alert;
      var time_life: any = rs.time_life;
      var period: any = rs.period;
      var work_status: any = rs.work_status;
      var max: any = rs.max;
      var min: any = rs.min;
      var oid: any = rs.oid;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var comparevalue: any = rs.comparevalue;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var unit: any = rs.unit;
      var action_id: any = rs.action_id;
      var status_alert_id: any = rs.status_alert_id;
      var measurement: any = rs.measurement;
      var mqtt_control_on: any = rs.mqtt_control_on;
      var mqtt_control_off: any = rs.mqtt_control_off;
      var device_org: any = rs.device_org;
      var device_bucket: any = rs.device_bucket;
      var type_name: any = rs.type_name;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var mqtt_org: any = rs.mqtt_org;
      var mqtt_bucket: any = rs.mqtt_bucket;
      var mqtt_envavorment: any = rs.mqtt_envavorment;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var mqtt_device_name: any = rs.mqtt_device_name;
      var mqtt_status_over_name: any = rs.mqtt_status_over_name;
      var mqtt_status_data_name: any = rs.mqtt_status_data_name;
      var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
      var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
      var main_status_warning: any = rs.status_warning;
      var main_status_alert: any = rs.status_alert;
      var main_max: any = rs.max;
      var main_min: any = rs.min;
      var main_type_id: any = rs.type_id;
      var mqtt_data_value: any = rs.mqtt_data_value;
      var mqtt_data_control: any = rs.mqtt_data_control;
      var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var configdata = mqtt_status_data_name;
      let obj: any = [];
      try {
        obj = JSON.parse(configdata);
      } catch (e) {
        throw e;
      }
      var mqtt_objt_data = Object.values(obj);
      let obj2: any = [];
      try {
        obj2 = JSON.parse(mqtt_status_data_name);
      } catch (e) {
        throw e;
      }
      var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
      var mqttdata_arr: any = mqttdata_arrs['data'];
      var mqtt_obj2_data = Object.values(obj2);
      var mqttData_count: any = mqttdata_arr.length;
      var mqttData = Object.fromEntries(
        mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
      );
      var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
      var merged_data: any = merged_dataRs[0];
      var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
      var merged: any = merged2['0'];
      if (merged) {
        var value_data: any = merged.value_data;
        var value_alarm: any = merged.value_alarm;
        var value_relay: any = merged.value_relay;
        var value_control_relay: any = merged.value_control_relay;
      } else {
        var value_data: any = '';
        var value_alarm: any = '';
        var value_relay: any = '';
        var value_control_relay: any = '';
      }
      var createddated: any = merged_data.createddate;
      var createddate: any = format.timeConvertermas(
        format.convertTZ(createddated, process.env.tzString),
      );
      var updateddated: any = merged_data.updateddate;
      var updateddate: any = format.timeConvertermas(
        format.convertTZ(updateddated, process.env.tzString),
      );

      var filter: any = {};
      filter.alarmTypeId = main_type_id;
      if (main_type_id == 1) {
        filter.sensorValueData = encodeURI(value_data); //sensor
        filter.status_warning = encodeURI(status_warning);
        filter.status_alert = encodeURI(status_alert);
        filter.recovery_warning = encodeURI(recovery_warning);
        filter.recovery_alert = encodeURI(recovery_alert);
        var data: any = value_data + ' ' + unit;
      } else {
        filter.sensorValueData = encodeURI(value_alarm); //IO
        filter.status_warning = parseInt('0');
        filter.status_alert = parseInt('0');
        filter.recovery_warning = parseInt('1');
        filter.recovery_alert = parseInt('1');
        var data: any = Number(value_alarm);
      }
      filter.mqtt_name = mqtt_name;
      filter.device_name = mqtt_device_name;
      filter.action_name = mqtt_name;
      filter.mqtt_control_on = encodeURI(mqtt_control_on);
      filter.mqtt_control_off = encodeURI(mqtt_control_off);
      filter.event = 1;
      filter.unit = unit;
      var getAlarmDetails: any =
        await this.settingsService.getAlarmDetailsAlert(filter);
      if (getAlarmDetails) {
        var subject: any = getAlarmDetails.subject;
        var status: any = getAlarmDetails.status;
      } else {
        var subject: any = 'Normal';
        var status: any = getAlarmDetails.status;
      }

      var timestamp: any = timestamps;
      var sensor_data_name: any = subject;

      const DataRs: any = {
        device_id: rs.device_id,
        //configdata,
        // mqttdata_arr,
        //mqttdata,
        //mqttData_count,
        //mqttData,
        //merged_data,
        //merged,

        setting_id: rs.setting_id,
        mqtt_id: rs.mqtt_id,
        type_id: rs.type_id,
        device_name: mqtt_device_name,
        data: data,
        value_data,
        value_alarm,
        value_relay,
        value_control_relay,
        subject,
        status,
        status_remart:
          '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
        timestamp,
        sensor_data_name,
        //getAlarmDetails,
        createddate,
        //updateddate,
        location_id: rs.location_id,
        location_name: rs.location_name,
        devicename: rs.device_name,
        mqtt_name: rs.mqtt_name,
        type_name: rs.type_name,
        mqtt_bucket: rs.mqtt_bucket,
        main_status_warning,
        main_status_alert,
        // main_max,
        // main_min,
        main_type_id,
        date,
        time,
        // mqtt:{
        //         mqtt_device_name,
        //         mqtt_status_over_name,
        //         //mqtt_status_data_name,
        //         mqtt_act_relay_name,
        //         mqtt_control_relay_name,
        //         mqtt_data_value: mqtt_data_value,
        //         mqtt_data_control: mqtt_data_control,
        //         mqtt_control_on: rs.mqtt_control_on,
        //         mqtt_control_off: rs.mqtt_control_off,
        //         status_warning: rs.status_warning,
        //         recovery_warning: rs.recovery_warning,
        //         status_alert: rs.status_alert,
        //         recovery_alert: rs.recovery_alert,
        //         mqtt_org: rs.mqtt_org,
        //         unit: unit,
        //       },
      };
      tempData.push(va);
      tempData2.push(DataRs);
    }
    return tempData2;
  }
  async getdeviceactivemqttAlarm(query: any) {
    try {
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          // await this.mqttService.create_mqttlogRepository(inputCreate);
          return checkConnectionMqtt;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        // await this.mqttService.create_mqttlogRepository(inputCreate);
        return checkConnectionMqtt;
      }
      var alarm_action_id: any = query.alarm_action_id;
      var deletecache: any = query.deletecache;
      var cachetimeset: any = 300;
      var ResultDataRS: any = [];
      var filterdeviceactiveAl: any = {};
      if (deletecache) {
        filterdeviceactiveAl.deletecache = deletecache;
      }
      if (alarm_action_id) {
        filterdeviceactiveAl.alarm_action_id = alarm_action_id;
      }
      if (query.device_id) {
        // filterdeviceactiveAl.device_id=query.device_id;
      }
      if (query.keyword) {
        filterdeviceactiveAl.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterdeviceactiveAl.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterdeviceactiveAl.bucket = query.bucket;
      }
      if (query.type_id) {
        //filter.type_id=query.type_id;
      }
      var filter_md5: any = md5(
        query.device_id +
          query.keyword +
          query.mqtt_id +
          query.bucket +
          query.type_id,
      );
      var kaycache_cache: any = 'device_active_ALL_mqtt_key_' + filter_md5;
      var ResultData: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (ResultData) {
        var ResultData: any = ResultData;
        var cache_data_ResultData: any = 'cache';
      } else if (!ResultData) {
        var ResultData: any = await this.settingsService.deviceactiveAl(
          filterdeviceactiveAl,
        );
        var rs: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: ResultData,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var rs: any = ResultData[key];
          var va: any = rs;
          var device_id: any = rs.device_id;
          var mqtt_id: any = rs.mqtt_id;
          var setting_id: any = rs.setting_id;
          var type_id: any = rs.type_id;
          var device_name: any = rs.device_name;
          var sn: any = rs.sn;
          var hardware_id: any = rs.hardware_id;
          var status_warning: any = rs.status_warning;
          var recovery_warning: any = rs.recovery_warning;
          var status_alert: any = rs.status_alert;
          var recovery_alert: any = rs.recovery_alert;
          var time_life: any = rs.time_life;
          var period: any = rs.period;
          var work_status: any = rs.work_status;
          var max: any = rs.max;
          var min: any = rs.min;
          var oid: any = rs.oid;
          var mqtt_data_value: any = rs.mqtt_data_value;
          var mqtt_data_control: any = rs.mqtt_data_control;
          var model: any = rs.model;
          var vendor: any = rs.vendor;
          var comparevalue: any = rs.comparevalue;
          var createddate: any = rs.createddate;
          var updateddate: any = rs.updateddate;
          var status: any = rs.status;
          var unit: any = rs.unit;
          var action_id: any = rs.action_id;
          var status_alert_id: any = rs.status_alert_id;
          var measurement: any = rs.measurement;
          var mqtt_control_on: any = rs.mqtt_control_on;
          var mqtt_control_off: any = rs.mqtt_control_off;
          var device_org: any = rs.device_org;
          var device_bucket: any = rs.device_bucket;
          var timestamp: any = rs.timestamp;
          var mqtt_device_name: any = rs.mqtt_device_name;
          var devicemqtt_status_over_name_id: any = rs.mqtt_status_over_name;
          var mqtt_status_data_name: any = rs.mqtt_status_data_name;
          var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
          var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
          var mqtt_id: any = rs.mqtt_id;
          var setting_id: any = rs.setting_id;
          ///////////
          var type_name: any = rs.type_name;
          var location_name: any = rs.location_name;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          var latitude: any = rs.latitude;
          var longitude: any = rs.longitude;
          var mqtt_status_over_name: any = rs.mqtt_status_over_name;
          var mqtt_status_data_name: any = rs.mqtt_status_data_name;
          var main_status_warning: any = rs.status_warning;
          var main_status_alert: any = rs.status_alert;
          var main_max: any = rs.max;
          var main_min: any = rs.min;
          var main_type_id: any = rs.type_id;
          var configdata = mqtt_status_data_name;
          const topic: any = encodeURI(mqtt_data_value);
          //const mqttrs: any = await this.mqttService.getDataTopic(topic);
          const mqttrs: any = await this.mqttService.getDataTopicCacheData(
            topic,
          );
          var alarmStatusSet: any = 999;
          if (mqttrs) {
            var mqttstatus: any = mqttrs.status;
            var mqttdata: any = mqttrs.msg;
            if (mqttstatus == 0) {
              var inputCreate: any = {
                name: device_bucket,
                statusmqtt: mqttstatus || 0,
                msg: 'Error',
                device_id: device_id,
                type_id: type_id,
                device_name: device_name,
                date: format.getCurrentDatenow(),
                time: format.getCurrentTimenow(),
                data: mqttdata,
                status: 1,
                createddate: new Date(),
              };
            }
            let obj: any = [];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }
            var mqtt_objt_data = Object.values(obj);
            let obj2: any = [];
            try {
              obj2 = JSON.parse(mqtt_status_data_name);
            } catch (e) {
              throw e;
            }
            var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
            var mqttdata_arr: any = mqttdata_arrs['data'];
            var mqtt_obj2_data = Object.values(obj2);
            var mqttData_count: any = mqttdata_arr.length;
            var mqttData = Object.fromEntries(
              mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
            );
            var merged_dataRs: any = format.mapMqttDataToDevices(
              [va],
              mqttData,
            );
            var merged_data: any = merged_dataRs[0];
            var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
            var merged: any = merged2['0'];
            if (merged) {
              var value_data: any = merged.value_data;
              var value_alarm: any = merged.value_alarm;
              var value_relay: any = merged.value_relay;
              var value_control_relay: any = merged.value_control_relay;
            } else {
              var value_data: any = '';
              var value_alarm: any = '';
              var value_relay: any = '';
              var value_control_relay: any = '';
            }
            var createddated: any = merged_data.createddate;
            var createddate: any = format.timeConvertermas(
              format.convertTZ(createddated, process.env.tzString),
            );
            var updateddated: any = merged_data.updateddate;
            var updateddate: any = format.timeConvertermas(
              format.convertTZ(updateddated, process.env.tzString),
            );
            var filter: any = {};
            filter.alarmTypeId = main_type_id;
            if (main_type_id == 1) {
              filter.sensorValueData = encodeURI(value_data); //sensor
              filter.status_warning = encodeURI(status_warning);
              filter.status_alert = encodeURI(status_alert);
              filter.recovery_warning = encodeURI(recovery_warning);
              filter.recovery_alert = encodeURI(recovery_alert);
              var data: any = value_data + ' ' + unit;
            } else {
              filter.sensorValueData = encodeURI(value_alarm); //IO
              filter.status_warning = parseInt('0');
              filter.status_alert = parseInt('0');
              filter.recovery_warning = parseInt('1');
              filter.recovery_alert = parseInt('1');
              var data: any = Number(value_alarm);
            }
            filter.mqtt_name = mqtt_name;
            filter.device_name = mqtt_device_name;
            filter.action_name = mqtt_name;
            filter.mqtt_control_on = encodeURI(mqtt_control_on);
            filter.mqtt_control_off = encodeURI(mqtt_control_off);
            filter.event = 1;
            filter.unit = unit;
            var getAlarmDetails: any =
              await this.settingsService.getAlarmDetailsAlert(filter);
            if (getAlarmDetails) {
              var subject: any = getAlarmDetails.subject;
              var content: any = getAlarmDetails.content;
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
              var dataAlarm: any = getAlarmDetails.dataAlarm;
              var eventControl: any = getAlarmDetails.eventControl;
              var messageMqttControl: any = getAlarmDetails.messageMqttControl;
              var sensor_data: any = getAlarmDetails.sensor_data;
              var count_alarm: any = getAlarmDetails.count_alarm;
            } else {
              var subject: any = 'Normal';
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = 999;
            }
            var status_report: any = {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            };
            var timestamp: any = timestamps;
            var sensor_data_name: any = subject;
            if (type_id == 1) {
              var value_data_msg: any = value_data;
            } else {
              if (value_data == 1) {
                var value_data_msg: any = 'ON';
              } else {
                var value_data_msg: any = 'OFF';
              }
            }
            if (value_alarm == 1) {
              var value_alarm_msg: any = 'Normal';
            } else {
              var value_alarm_msg: any = 'Alarm!';
            }
            var datenow: any = format.getCurrentDatenow();
            var timenow: any = format.getCurrentTimenow();
            var fillter_device_control: any = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
            //fillter_device_control.device_id = device_id;
            const countAlarmDeviceDontrol: number = Number(
              await this.settingsService.count_alarmprocesslog(
                fillter_device_control,
              ),
            );
            var RsIO: any = await this.settingsService.checkDuplicateLogIO(
              fillter_device_control,
            );
            var EmailRs: any =
              await this.settingsService.chk_alarmprocesslogemail(
                fillter_device_control,
              );
            var countalarm_LogIO: number = Number(RsIO.length);
            if (countalarm_LogIO == 0) {
              var createddate_logs: any = format.timeConvertermas(
                format.convertTZ(datenow, process.env.tzString),
              );
            } else {
              var createddate_logs: any = format.timeConvertermas(
                format.convertTZ(RsIO[0].createddate, process.env.tzString),
              );
            }
            var countalarm_LogIEmail: number = Number(EmailRs.length);
            if (countalarm_LogIEmail == 0) {
              var createddate_logs_Email: any = format.timeConvertermas(
                format.convertTZ(datenow, process.env.tzString),
              );
            } else {
              var createddate_logs_Email: any = format.timeConvertermas(
                format.convertTZ(EmailRs[0].createddate, process.env.tzString),
              );
            }
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              device_org,
              device_bucket,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              content,
              status,
              status_report,
              mqttdata,
              dataAlarm,
              eventControl,
              sensor_data,
              value_data,
              value_data_msg,
              messageMqttControl,
              count_alarm,
              value_alarm,
              value_alarm_msg,
              alarmStatusSet,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              fillter_device_control,
              createddate_logs,
              countalarm_LogIO,
              createddate_logs_Email,
              countalarm_LogIEmail,
              // getAlarmDetails,
              mqttrs,
            };
          } else {
            const inputCreate: any = {
              name: device_bucket,
              statusmqtt: 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: 'Error',
              status: 0,
              createddate: new Date(),
            };
            // await this.mqttService.create_mqttlogRepository(inputCreate);
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              device_org,
              device_bucket,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              status,
              status_report,
              mqttdata,
              value_data,
              value_data_msg,
              value_alarm,
              value_alarm_msg,
              alarmStatusSet,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              fillter_device_control,
              createddate_logs,
              countalarm_LogIO,
              createddate_logs_Email,
              countalarm_LogIEmail,
              //getAlarmDetails,
              mqttrs: 'Error',
            };
          }
          if (alarmStatusSet != 999) {
            ResultDataRS.push(arraydata);
          } else {
            ResultDataRS.push(arraydata);
          }
        }
      }
      return ResultDataRS;
    } catch (error) {
      var rss: any = {
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      };
      return rss;
    }
  }
  async getdeviceactivemqttAlarmEmail(query: any) {
    try {
      var main_type_id: number = Number(query.type_id);
      var device_id: any = query.device_id;
      var device_id_mas: any = query.device_id
      var main_mqtt_name: any = query.mqtt_name;
      var main_event: any = query.event;
      var event: number = Number(query.event);
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var date_now: any = format.getCurrentDatenow();
      var time_now: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
        pad(now.getDate()),
      ].join('-');
      // จัดรูปแบบเวลา HH:MM:SS
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamps = datePart + ' ' + timePart;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          const inputCreate: any = {
            name: 'Mqtt Not connect',
            statusmqtt: +checkConnectionMqtt.status,
            msg: 'Error ' + checkConnectionMqtt.msg,
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error' + checkConnectionMqtt.msg,
            status: Mqttstatus,
            createddate: new Date(),
          };
          // await this.mqttService.create_mqttlogRepository(inputCreate);
          return checkConnectionMqtt;
        }
      } else {
        const inputCreate: any = {
          name: 'Mqtt Not connect',
          statusmqtt: +checkConnectionMqtt.status,
          msg: 'Error ' + checkConnectionMqtt.msg,
          device_id: 0,
          type_id: 0,
          device_name: 0,
          date: format.getCurrentDatenow(),
          time: format.getCurrentTimenow(),
          data: 'Error' + checkConnectionMqtt.msg,
          status: 0,
          createddate: new Date(),
        };
        // await this.mqttService.create_mqttlogRepository(inputCreate);
        return checkConnectionMqtt;
      }
      var alarm_action_id: any = query.alarm_action_id;
      var deletecache: any = query.deletecache;
      var cachetimeset: any = 300;
      var ResultDataRS: any = [];
      var filterdeviceactiveAl: any = {};
      if (deletecache) {
        filterdeviceactiveAl.deletecache = deletecache;
      }
      if (alarm_action_id) {
        filterdeviceactiveAl.alarm_action_id = alarm_action_id;
      }
      if (query.device_id) {
        // filterdeviceactiveAl.device_id=query.device_id;
      }
      if (query.keyword) {
        filterdeviceactiveAl.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterdeviceactiveAl.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterdeviceactiveAl.bucket = query.bucket;
      }
      if (query.type_id) {
        //filter.type_id=query.type_id;
      }
      // http://172.25.99.10:3003/v1/settings/alarmdevicestatus?deletecache=1
      var filter_md5: any = md5(
        query.device_id +
          query.keyword +
          query.mqtt_id +
          query.bucket +
          query.type_id,
      );
      var kaycache_cache: any = 'deviceactive_Al_Alarm_Email_' + filter_md5;
      var ResultData: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (ResultData) {
        var ResultData: any = ResultData;
        var cache_data_ResultData: any = 'cache';
      } else if (!ResultData) {
        var ResultData: any = await this.settingsService.deviceactiveAl(
          filterdeviceactiveAl,
        );
        var rs: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: ResultData,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      var devicesensor: any = [];
      var deviceio: any = [];
      var devicecontrol: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
          var mqtt_id: any = rs.mqtt_id;
          var setting_id: any = rs.setting_id;
          var sn: any = rs.sn;
          var hardware_id: any = rs.hardware_id;
          var status_warning2: any = rs.status_warning;
          var status_alert2: any = rs.status_alert;
          var recovery_warning2: any = rs.recovery_warning;
          var recovery_alert2: any = rs.recovery_alert;
          var time_life: any = rs.time_life;
          var period: any = rs.period;
          var work_status: any = rs.work_status;
          var max: any = rs.max;
          var min: any = rs.min;
          var oid: any = rs.oid;
          var comparevalue: any = rs.comparevalue;
          var createddate: any = rs.createddate;
          var status: any = rs.status;
          var unit: any = rs.unit;
          var action_id: any = rs.action_id;
          var status_alert_id: any = rs.status_alert_id;
          var measurement: any = rs.measurement;
          var type_name: any = rs.type_name;
          var location_name: any = rs.location_name;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          var latitude: any = rs.latitude;
          var longitude: any = rs.longitude;
          var mqtt_device_name: any = rs.mqtt_device_name;
          var mqtt_status_over_name: any = rs.mqtt_status_over_name;
          var mqtt_status_data_name: any = rs.mqtt_status_data_name;
          var mqtt_act_relay_name: any = rs.mqtt_act_relay_name;
          var mqtt_control_relay_name: any = rs.mqtt_control_relay_name;
          var main_status_warning: any = rs.status_warning;
          var main_status_alert: any = rs.status_alert;
          var main_max: any = rs.max;
          var main_min: any = rs.min;
          var configdata = mqtt_status_data_name;
          const topic: any = encodeURI(mqtt_data_value);
          if (type_id == 1) {
            var status_alert: any = query.status_alert;
            var status_warning: any = query.status_warning;
            var recovery_warning: any = query.recovery_warning;
            var recovery_alert: any = query.recovery_alert;
          } else {
            var status_alert: any = 0;
            var status_warning: any = 0;
            var recovery_warning: any = 1;
            var recovery_alert: any = 1;
          }
          //const mqttrs: any = await this.mqttService.getMqttTopicData(topic,deletecache);
          const mqttrs: any = await this.mqttService.getMqttTopicDataRS(
            topic,
            deletecache,
          );
          const mqttrs_rs: any = mqttrs.data;
          //////////////////////////////////////
          if (mqttrs) {
            var mqttstatus: any = mqttrs.status;
            var mqttdata: any = mqttrs.msg;
            var rss: any = mqttrs.rs;
            if (mqttstatus == 0) {
              var inputCreate: any = {
                name: device_bucket,
                statusmqtt: mqttstatus || 0,
                msg: 'Error',
                device_id: device_id,
                type_id: type_id,
                device_name: device_name,
                date: format.getCurrentDatenow(),
                time: format.getCurrentTimenow(),
                data: mqttdata,
                status: 1,
                createddate: new Date(),
              };
            }
            let obj: any = [];
            try {
              obj = JSON.parse(configdata);
            } catch (e) {
              throw e;
            }
            var mqtt_objt_data = Object.values(obj);
            let obj2: any = [];
            try {
              obj2 = JSON.parse(mqtt_status_data_name);
            } catch (e) {
              throw e;
            }
            var mqttdata_arrs: any = await this.parseMqttData(mqttdata);
            var mqttdata_arr: any = mqttdata_arrs['data'];
            var mqtt_obj2_data = Object.values(obj2);
            var mqttData_count: any = mqttdata_arr.length;
            var mqttData = Object.fromEntries(
              mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]),
            );
            var merged_dataRs: any = format.mapMqttDataToDevices(
              [va],
              mqttData,
            );
            var merged_data: any = merged_dataRs[0];
            var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
            var merged: any = merged2['0'];
            if (merged) {
              var value_data: any = merged.value_data;
              var value_alarm: any = merged.value_alarm;
              var value_relay: any = merged.value_relay;
              var value_control_relay: any = merged.value_control_relay;
            } else {
              var value_data: any = '';
              var value_alarm: any = '';
              var value_relay: any = '';
              var value_control_relay: any = '';
            }
            var createddated: any = merged_data.createddate;
            var createddate: any = format.timeConvertermas(
              format.convertTZ(createddated, process.env.tzString),
            );
            var updateddated: any = merged_data.updateddate;
            var updateddate: any = format.timeConvertermas(
              format.convertTZ(updateddated, process.env.tzString),
            );
            var filter: any = {};
            filter.alarmTypeId = main_type_id;
            if (main_type_id == 1) {
              filter.sensorValueData = encodeURI(value_data); //sensor
              filter.status_warning = encodeURI(status_warning);
              filter.status_alert = encodeURI(status_alert);
              filter.recovery_warning = encodeURI(recovery_warning);
              filter.recovery_alert = encodeURI(recovery_alert);
              var data: any = value_data + ' ' + unit;
            } else {
              filter.sensorValueData = encodeURI(value_alarm); //IO
              filter.status_warning = parseInt('0');
              filter.status_alert = parseInt('0');
              filter.recovery_warning = parseInt('1');
              filter.recovery_alert = parseInt('1');
              var data: any = Number(value_alarm);
            }
            filter.mqtt_name = mqtt_name;
            filter.device_name = mqtt_device_name;
            filter.action_name = mqtt_name;
            filter.mqtt_control_on = encodeURI(mqtt_control_on);
            filter.mqtt_control_off = encodeURI(mqtt_control_off);
            filter.event = 1;
            filter.unit = unit;
            var getAlarmDetails: any =
              await this.settingsService.getAlarmDetailsAlert(filter);
            if (getAlarmDetails) {
              var subject: any = getAlarmDetails.subject;
              var content: any = getAlarmDetails.content;
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = getAlarmDetails.alarmStatusSet;
              var dataAlarm: any = getAlarmDetails.dataAlarm;
              var eventControl: any = getAlarmDetails.eventControl;
              var messageMqttControl: any = getAlarmDetails.messageMqttControl;
              var sensor_data: any = getAlarmDetails.sensor_data;
              var count_alarm: any = getAlarmDetails.count_alarm;
            } else {
              var subject: any = 'Normal';
              var status: any = getAlarmDetails.status;
              var alarmStatusSet: any = 999;
            }
            var status_report: any = {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            };
            var timestamp: any = timestamps;
            var sensor_data_name: any = subject;
            if (type_id == 1) {
              var value_data_msg: any = value_data;
            } else {
              if (value_data == 1) {
                var value_data_msg: any = 'ON';
              } else {
                var value_data_msg: any = 'OFF';
              }
            }
            if (status == 5) {
              var value_alarm_msg: any = 'Normal';
            } else {
              var value_alarm_msg: any = 'Alarm!';
            }
            if (alarmStatusSet == 1) {
              var validate_count: number = parseInt('2');
            } else if (alarmStatusSet == 2) {
              var validate_count: number = parseInt('2');
            } else if (alarmStatusSet == 3) {
              var validate_count: number = parseInt('1');
            } else {
              var validate_count: number = parseInt('1');
            }
            /////////////////////////////
            var alarmTypeId: any = type_id;
            if (alarmStatusSet == 1 || alarmStatusSet == 2) {
              if (event == 1) {
                var eventSet: number = 1;
              } else {
                var eventSet: number = 0;
              }
            } else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
              if (event == 1) {
                var eventSet: number = 0;
              } else {
                var eventSet: number = 1;
              }
            }
            if (type_id == 1) {
              var dataAlarm: any = encodeURI(value_data);
              var alarmValue: any = encodeURI(value_alarm);
            } else {
              var dataAlarm: any = encodeURI(value_data);
              var alarmValue: any = encodeURI(value_alarm);
            }
            var datenow: any = format.getCurrentDatenow();
            var timenow: any = format.getCurrentTimenow();
            var fillter_device_control: any = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
            //fillter_device_control.device_id = device_id;
            const countAlarmDeviceDontrol: number = Number(
              await this.settingsService.count_alarmprocesslog(
                fillter_device_control,
              ),
            );
            var RsIO: any = await this.settingsService.checkDuplicateLogIO(
              fillter_device_control,
            );
            var EmailRs: any =
              await this.settingsService.chk_alarmprocesslogemail(
                fillter_device_control,
              );
            var countalarm_LogIO: number = Number(RsIO.length);
            if (countalarm_LogIO == 0) {
              var createddate_logs: any = format.timeConvertermas(
                format.convertTZ(datenow, process.env.tzString),
              );
            } else {
              var createddate_logs: any = format.timeConvertermas(
                format.convertTZ(RsIO[0].createddate, process.env.tzString),
              );
            }
            var countalarm_LogIEmail: number = Number(EmailRs.length);
            if (countalarm_LogIEmail == 0) {
              var createddate_logs_Email: any = format.timeConvertermas(
                format.convertTZ(datenow, process.env.tzString),
              );
            } else {
              var createddate_logs_Email: any = format.timeConvertermas(
                format.convertTZ(EmailRs[0].createddate, process.env.tzString),
              );
            }
            /////////////////////----------------Save LOG SENSOR-------------------////////////////////////
            var fillterDataSENSOR: any = {};
            if (alarm_action_id) {
              fillterDataSENSOR.alarm_action_id = alarm_action_id;
            }
            if (eventSet) {
              fillterDataSENSOR.event = eventSet;
            }
            if (date_now) {
              fillterDataSENSOR.date = date_now;
            }
            if (time_now) {
              fillterDataSENSOR.time = time_now;
            }
            if (alarmStatusSet == 1) {
              fillterDataSENSOR.status_warning = status_warning;
              fillterDataSENSOR.alarm_status = alarmStatusSet;
            } else if (alarmStatusSet == 2) {
              fillterDataSENSOR.status_alert = status_alert;
              fillterDataSENSOR.alarm_status = alarmStatusSet;
            } else if (alarmStatusSet == 3) {
              fillterDataSENSOR.recovery_warning = recovery_warning;
              fillterDataSENSOR.alarm_status = alarmStatusSet;
            } else if (alarmStatusSet == 4) {
              fillterDataSENSOR.recovery_alert = recovery_alert;
              fillterDataSENSOR.alarm_status = alarmStatusSet;
            }
            var inputCreateemail: any = {
              alarm_action_id: alarm_action_id,
              device_id: device_id,
              type_id: type_id,
              event: eventSet,
              status: 1,
              alarm_type: alarmTypeId,
              status_warning: status_warning,
              recovery_warning: recovery_warning,
              status_alert: status_alert,
              recovery_alert: recovery_alert,
              email_alarm: 0,
              line_alarm: 0,
              telegram_alarm: 0,
              sms_alarm: 0,
              nonc_alarm: 1,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: dataAlarm,
              createddate: new Date(),
              updateddate: new Date(),
              ata_alarm: dataAlarm,
              alarm_status: alarmStatusSet,
              subject: 'Send email:' + subject,
              content: 'Send email:' + content,
            };
            var isDuplicate = false;
            var setdatachk_main: any = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id;
            var countDataEmail = await this.settingsService.countDataEmail(
              setdatachk_main,
            );
            var crsmaster: any =
              await this.settingsService.chk_alarmprocesslogemail(
                setdatachk_main,
              );
            var crsmaster_main: any = [];
            var crsmasterCount: number = crsmaster.length;
            //createddate_logsMaim
            // createddate_logs
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var now_time_full: any = format.timeConvertermas(
              format.convertTZ(
                format.getCurrentFullDatenow(),
                process.env.tzString,
              ),
            );
            if (countDataEmail > 0) {
              var now_time_cal_main: number = Number(
                format.diffMinutes(now_time_full, createddate_logs_Email),
              );
              var caseSet: number = 1;
              if (now_time_cal_main > time_life) {
                if (countDataEmail == 0) {
                  if (alarmStatusSet != 999) {
                    var isDuplicate =
                      await this.settingsService.checkDuplicateLogEmailOne(
                        inputCreateemail,
                      );
                    if (!isDuplicate) {
                      await this.settingsService.getAlarmDetailsSendEmail(
                        filter,
                      );
                      await this.settingsService.manageAlarmLogEmail(
                        inputCreate,
                        fillterDataSENSOR,
                        validate_count,
                      );
                      //continue  // ทำงาน ต่อไป
                    }
                  }
                } else if (countDataEmail > validate_count) {
                  if (alarmStatusSet == 999) {
                    const fillter_device_control: any = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    fillter_device_control.device_id = device_id;
                    // fillter_device_control.date =  format.getCurrentDatenow();
                    // fillter_device_control.alarm_status=alarmStatusSet;
                    await this.settingsService.delete_alarmp_emaillog(
                      fillter_device_control,
                    );
                  }
                }
              }
              if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                if (alarmStatusSet != 999) {
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLogEmailOne(
                      inputCreateemail,
                    );
                  if (!isDuplicate) {
                    await this.settingsService.getAlarmDetailsSendEmail(filter);
                    await this.settingsService.manageAlarmLogEmail(
                      inputCreate,
                      fillterDataSENSOR,
                      validate_count,
                    );
                  }
                }
              }
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id;
                // fillter_device_control.date =  format.getCurrentDatenow();
                // fillter_device_control.alarm_status=alarmStatusSet;
                await this.settingsService.delete_alarmp_emaillog(
                  fillter_device_control,
                );
              }
            } else {
              var createddate_logsMaim: any = now_time_full;
              var now_time_cal_main: number = 0;
              ////////////////////////////////
              if (alarmStatusSet == 999) {
                const fillter_device_control: any = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.date = format.getCurrentDatenow();
                fillter_device_control.alarm_status = alarmStatusSet;
                await this.settingsService.delete_alarmp_emaillog(
                  fillter_device_control,
                );
              }
              /////////////////////----------------Save LOG -------------------////////////////////////
              var fillterData: any = {};
              if (alarm_action_id) {
                fillterData.alarm_action_id = alarm_action_id;
              }
              if (eventSet) {
                fillterData.event = eventSet;
              }
              if (type_id) {
                fillterData.type_id = type_id;
              }
              if (date_now) {
                fillterData.date = date_now;
              }
              if (time_now) {
                fillterData.time = time_now;
              }
              if (alarmStatusSet == 1) {
                fillterData.status_warning = status_warning;
                fillterData.alarm_status = alarmStatusSet;
              } else if (alarmStatusSet == 2) {
                fillterData.status_alert = status_alert;
                fillterData.alarm_status = alarmStatusSet;
              } else if (alarmStatusSet == 3) {
                fillterData.recovery_warning = recovery_warning;
                fillterData.alarm_status = alarmStatusSet;
              } else if (alarmStatusSet == 4) {
                fillterData.recovery_alert = recovery_alert;
                fillterData.alarm_status = alarmStatusSet;
              }
              var tag: any = 1;
              const inputCreate: any = {
                alarm_action_id: alarm_action_id,
                device_id: device_id,
                type_id: type_id,
                event: eventSet,
                status: 1,
                alarm_type: alarmTypeId,
                status_warning: status_warning,
                recovery_warning: recovery_warning,
                status_alert: status_alert,
                recovery_alert: recovery_alert,
                email_alarm: 0,
                line_alarm: 0,
                telegram_alarm: 0,
                sms_alarm: 0,
                nonc_alarm: 1,
                date: format.getCurrentDatenow(),
                time: format.getCurrentTimenow(),
                data: dataAlarm,
                createddate: new Date(),
                updateddate: new Date(),
                ata_alarm: dataAlarm,
                alarm_status: alarmStatusSet,
                subject: 'Send email:' + subject,
                content: 'Send email:' + content,
              };
              if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                if (alarmStatusSet != 999) {
                  var isDuplicate =
                    await this.settingsService.checkDuplicateLogEmailOne(
                      inputCreate,
                    );
                  if (!isDuplicate) {
                    await this.settingsService.getAlarmDetailsSendEmail(filter);
                    await this.settingsService.manageAlarmLogEmail(
                      inputCreate,
                      fillterData,
                      validate_count,
                    );
                  }
                }
              }
              ////////////////////////////////
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var arraydata: any = {
              device_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              // device_org ,
              // device_bucket,
              // data_status,
              // mqtt_id,
              // setting_id,
              // sn,
              // hardware_id,
              // period,
              // work_status,
              // max,
              // min,
              // oid,
              // comparevalue,
              // createddate,
              // unit,
              // action_id,
              // status_alert_id,
              // measurement,
              type_name,
              // location_name,
              // mqtt_name,
              // mqtt_org,
              // mqtt_bucket,
              // mqtt_envavorment,
              // latitude,
              // longitude,
              // mqtt_device_name,
              // mqtt_act_relay_name,
              // mqtt_control_relay_name,
              // main_max,
              // main_min,
              // main_type_id,
              mqtt_status_over_name,
              sensor_data_name,
              status_warning,
              recovery_warning,
              status_alert,
              recovery_alert,
              type_id,
              timestamp,
              sensor_data,
              value_data,
              value_data_msg,
              //messageMqttControl,
              count_alarm,
              value_alarm,
              value_alarm_msg,
              eventSet,
              topic,
              subject,
              content,
              dataAlarm,
              alarmValue,
              //eventControl,
              email: {
                time: {
                  now_time_full,
                  createddate_logs_Email,
                  now_time_cal_main,
                  time_life,
                },
                isDuplicate,
                alarmStatusSet,
                countDataEmail,
                //inputCreateemail,
                createddate_logs,
                countalarm_LogIO,
                countalarm_LogIEmail,
                crsmasterCount,
                //crsmaster,
                //crsmaster_main,
                //RsIO,
                //EmailRs,
              },
              alarmconfig: {
                status_warning,
                recovery_warning,
                status_alert,
                recovery_alert,
                type_id,
                timestamp,
                sensor_data,
                value_data,
                value_data_msg,
                messageMqttControl,
                count_alarm,
                value_alarm,
                value_alarm_msg,
                eventSet,
              },
              //query,
              cache: cache_data_ResultData,
              alarmStatusSet,
              // getAlarmDetails,
              //mqttrs,
              mqttdata,
              mqtt_status_data_name,
              configdata,
              status,
              status_report,
              mqttrs_rs,
            };
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
          } else {
            const inputCreate: any = {
              name: device_bucket,
              statusmqtt: 0,
              msg: 'Error',
              device_id: device_id,
              type_id: type_id,
              device_name: device_name,
              date: format.getCurrentDatenow(),
              time: format.getCurrentTimenow(),
              data: 'Error',
              status: 0,
              createddate: new Date(),
            };
            // await this.mqttService.create_mqttlogRepository(inputCreate);
            var arraydata: any = {
              device_id,
              type_id,
              device_name,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
              device_org,
              device_bucket,
              data_status,
              mqtt_id,
              setting_id,
              sn,
              hardware_id,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              time_life,
              period,
              work_status,
              max,
              min,
              oid,
              comparevalue,
              createddate,
              status,
              unit,
              action_id,
              status_alert_id,
              measurement,
              type_name,
              location_name,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
              latitude,
              longitude,
              mqtt_device_name,
              mqtt_status_over_name,
              mqtt_status_data_name,
              mqtt_act_relay_name,
              mqtt_control_relay_name,
              main_status_warning,
              main_status_alert,
              main_max,
              main_min,
              main_type_id,
              configdata,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              content,
              status_report,
              dataAlarm,
              eventControl,
              sensor_data,
              value_data,
              value_data_msg,
              messageMqttControl,
              count_alarm,
              value_alarm,
              value_alarm_msg,
              alarmStatusSet,
              // getAlarmDetails,
              mqttrs: 'Error',
              mqttdata,
              mqttrs_rs: null,
            };
          }
          if (device_id_mas == device_id) {
            devicecontrol.push(arraydata);
          }
        }
      }
      return devicecontrol;
    } catch (error) {
      var rss: any = {
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      };
      return rss;
    }
  }
  @HttpCode(200)
  @ApiOperation({ summary: 'Save new dashboard positions' })
  @Post('dashboardconfig')
  createdashboardconfig(@Body() createDto: CreateDashboardConfigDto) {
    var location_id: any = createDto.location_id;
    return this.settingsService.createDashboardConfig(createDto);
  }

  @Get('dashboardconfig_1')
  async dashboardconfig_1(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      // Validate required parameter
      if (!query.location_id) {
        return res.status(404).json({
          statusCode: 404,
          payload: null,
          message: 'location_id is required',
          message_th: 'จำเป็นต้องมี location_id',
        });
      }
      // Prepare filter object
      const filter: any = {};
      if (query.location_id) {
        filter.location_id = query.location_id;
      }
      if (query.name) {
        filter.name = query.name;
      }
      // Call service
      const ResultData = await this.settingsService.findDashboardConfig(filter);
      // If no data found
      if (!ResultData || ResultData.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          payload: [],
          message: 'No configuration found',
          message_th: 'ไม่พบการตั้งค่า',
        });
      }
      // Transform data
      let rtss = [];
      if (ResultData) {
        for (const [key, va] of Object.entries(ResultData)) {
          const ConfigRs: any = {
            id: ResultData[key].id,
            location_id: ResultData[key].location_id,
            name: ResultData[key].name,
            config: ResultData[key].config,
            location_detail: ResultData[key].location_detail,
            status: ResultData[key].status,
            createddate: format.timeConvertermas(
              format.convertTZ(
                ResultData[key].createddate,
                process.env.tzString,
              ),
            ),
            updateddate: format.timeConvertermas(
              format.convertTZ(
                ResultData[key].updateddate,
                process.env.tzString,
              ),
            ),
          };
          rtss.push(ConfigRs);
        }
      }
      if (ResultData) {
        return rtss[0];
      } else {
        return [];
      }

      // Return first item or array based on your needs
      return res.status(200).json({
        statusCode: 200,
        payload: rtss[0],
        message: 'Success',
        message_th: 'สำเร็จ',
      });
    } catch (error) {
      console.error('Error in dashboardconfig:', error);
      return res.status(500).json({
        statusCode: 500,
        payload: null,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @Get('dashboardconfig')
  async dashboardconfig(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      // Validate required parameter
      if (!query.location_id) {
        return res.status(404).json({
          statusCode: 404,
          payload: null,
          message: 'location_id is required',
          message_th: 'จำเป็นต้องมี location_id',
        });
      }

      // Prepare filter object
      const filter: any = {};
      if (query.location_id) {
        filter.location_id = query.location_id;
      }
      if (query.name) {
        filter.name = query.name;
      }

      // Call service
      const ResultData = await this.settingsService.findDashboardConfig(filter);

      // If no data found
      if (!ResultData || ResultData.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          payload: [],
          message: 'No configuration found',
          message_th: 'ไม่พบการตั้งค่า',
        });
      }
      // Transform data
      const rtss = [];
      if (ResultData) {
        for (const [key, item] of Object.entries(ResultData)) {
          const ConfigRs: any = {
            id: item.id,
            location_id: item.location_id,
            name: item.name,
            config: item.config_data,
            status: item.status,
            // createddate: format.timeConvertermas(
            //   format.convertTZ(item.created_date, process.env.tzString),
            // ),
            updateddate: format.timeConvertermas(
              format.convertTZ(
                item.config_data.updated_at,
                process.env.tzString,
              ),
            ),
          };
          rtss.push(ConfigRs);
        }
      }
      // Check if we have results
      if (rtss.length > 0) {
        return res.status(200).json({
          statusCode: 200,
          payload: rtss[0], // or rtss if you want to return all items
          message: 'Success',
          message_th: 'สำเร็จ',
        });
      } else {
        return res.status(404).json({
          statusCode: 404,
          payload: [],
          message: 'No configuration found',
          message_th: 'ไม่พบการตั้งค่า',
        });
      }
    } catch (error) {
      console.error('Error in dashboardconfig:', error);
      return res.status(500).json({
        statusCode: 500,
        payload: null,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  // เพิ่ม / ระหว่างชื่อ path กับ parameter :id
  @Get('dashboardconfig/:id')
  @ApiOperation({ summary: 'Get dashboard config by ID' })
  findOnedashboardconfig(@Param('id') id: string) {
    return this.settingsService.findOneDashboardConfig(id);
  }

  @Get('dashboardconfig/search') // เปลี่ยนจาก :id เป็น search
  async findByCriteria(
    @Query('name') name: string,
    @Query('location_id') locationId: string, // รับมาเป็น string ก่อนแปลงเป็น number
  ) {
    return await this.settingsService.findOrCreateConfig(
      name,
      parseInt(locationId),
    );
  }

  // เพิ่ม / ระหว่างชื่อ path กับ parameter :id
  @Patch('dashboardconfig/:id')
  @ApiOperation({ summary: 'Update dashboard config positions' })
  updatedashboardconfig(
    @Param('id') id: string,
    @Body() updateDto: UpdateDashboardConfigDto,
  ) {
    return this.settingsService.updateDashboardConfig(id, updateDto);
  }

  // เพิ่ม / ระหว่างชื่อ path กับ parameter :id
  @Delete('dashboardconfig/:id')
  @ApiOperation({ summary: 'Delete dashboard config' })
  remove(@Param('id') id: string) {
    return this.settingsService.removeDashboardConfig(id);
  }
}