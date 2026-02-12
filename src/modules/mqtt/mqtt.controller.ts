import {
  Header,
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
 Inject, Logger } from '@nestjs/common';
// import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
// import { Gpio } from 'onoff';
let isOn = false;
let intervalId;

import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response, NextFunction } from 'express';
import { Public } from '@src/modules/auth/auth.decorator';
var moment = require('moment');

import {
  AuthUserRequired,
  auth,
  AuthTokenRequired,
} from '@src/modules/auth/auth.decorator';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SettingsService } from '@src/modules/settings/settings.service';
// import * as cache from '@src/utils/cache/redis.cache';
import * as rediscluster from '@src/utils/cache/rediscluster.cache';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper'; 
import * as iothelper from '@src/helpers/iot.helper';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { AuthGuardUser } from '@src/modules/auth/auth.guarduser';
import { passwordtDto } from '@src/modules/users/dto/Resetpassword.dto';
import { fileDto } from '@src/modules/users/dto/file.dto';
import { FogotPassword } from '@src/modules/users/dto/forgeot-password.dto';
const { passwordStrength } = require('check-password-strength');
import { Pagination } from 'nestjs-typeorm-paginate';
import { mqttlog } from '@src/modules/iot/entities/mqttlog.entity';
/******** entity *****************/
import { UsersService } from '@src/modules/users/users.service';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { RolesService } from '@src/modules/roles/roles.service';
// import * as cache from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
var md5 = require('md5');
import 'dotenv/config';
var tzString = process.env.tzString;
// formatInTimeZone(date, tzString, 'yyyy-MM-dd HH:mm:ssXXX') 
require('dotenv').config();
var connectUrl_mqtt: any =
  process.env.MQTT_HOST || 'mqtt://127.0.0.1:1883';
if (!connectUrl_mqtt) {
  var connectUrl_mqtt: any = process.env.MQTT_HOST || 'mqtt://localhost:1883';
}
import { IotService } from '@src/modules/iot/iot.service';
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import { CreateMqttDto } from '@src/modules/mqtt/dto/create-mqtt.dto';
import { UpdateMqttDto } from '@src/modules/mqtt/dto/update-mqtt.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  MqttContext,
} from '@nestjs/microservices';
// DTO for request body validation
class PublishDto {
  topic: string='AIR1/CONTROL';
  message: string='1'; 
}
@Controller('mqtt')
export class MqttController {
  private readonly logger = new Logger(MqttController.name);
  constructor(
    private settingsService: SettingsService,
    private readonly mqttService: MqttService, 
    private UsersService: UsersService,
    private readonly rolesService: RolesService,
    private usersService: UsersService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly IotService: IotService,
  ) {}
  /////////////////////////////////////
  @MessagePattern('devices/+/status')
  handleDeviceStatus(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.log(`สถานะอุปกรณ์จาก Topic: ${context.getTopic()}`);
    this.logger.log(`ข้อมูลสถานะ: ${JSON.stringify(data)}`);
  }
  // Helper function to create MQTT error log
  private async createMqttErrorLog(
    checkConnectionMqtt: any,
    isConnected: boolean = false,
  ) {
    const inputCreate = {
      name: isConnected ? 'MQTT Connected' : 'MQTT Not Connected',
      statusmqtt: +checkConnectionMqtt?.status || 0,
      msg: 'Error ' + (checkConnectionMqtt?.msg || 'Unknown error'),
      device_id: 0,
      type_id: 0,
      device_name: 0,
      date: format.getCurrentDatenow(),
      time: format.getCurrentTimenow(),
      data: 'Error ' + (checkConnectionMqtt?.msg || 'Unknown error'),
      status: checkConnectionMqtt?.status || 0,
      createddate: new Date(),
    };
    await this.mqttService.create_mqttlogRepository(inputCreate);
    return inputCreate;
  }

  // Helper function for response formatting
  private createErrorResponse(
    messageEn: string,
    messageTh: string,
    code: number = 200,
    payload: any = null,
  ) {
    return {
      statusCode: 200,
      code: code,
      payload: payload,
      message: messageEn,
      message_th: messageTh,
    };
  }

  // Helper function to check MQTT connection with error handling
  private async checkMqttConnection(res: Response): Promise<boolean> {
    try {
      const checkConnectionMqtt =
        await this.mqttService.checkConnectionStatusMqtt();

      if (!checkConnectionMqtt) {
        await this.createMqttErrorLog(
          { status: 0, msg: 'Connection check failed' },
          false,
        );
        res
          .status(200)
          .json(
            this.createErrorResponse(
              'MQTT connection check failed',
              'ตรวจสอบการเชื่อมต่อ MQTT ล้มเหลว',
              200,
              { Mqttstatus: 0, payload: checkConnectionMqtt },
            ),
          );
        return false;
      }

      const Mqttstatus = checkConnectionMqtt.status;
      if (Mqttstatus === 0) {
        await this.createMqttErrorLog(checkConnectionMqtt, false);
        res
          .status(200)
          .json(
            this.createErrorResponse(
              'MQTT is not connected',
              'MQTT ไม่ได้เชื่อมต่อ',
              200,
              { Mqttstatus, payload: checkConnectionMqtt },
            ),
          );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`MQTT connection check error: ${error.message}`);
      return false;
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get()
  @ApiOperation({ summary: 'list device page' })
  async mqttdevicepage(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    // Check MQTT connection first
    const connectionResult = await this.mqttService.checkConnectionStatusMqtt();
    if (!connectionResult.isConnected) {
      // Only send response if connection failed
      return res.status(200).json(
        this.createErrorResponse(
          'MQTT is not connected',
          'MQTT ไม่ได้เชื่อมต่อ',
          200,
          {
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
          },
        ),
      );
    }
    var date: any = format.getCurrentDatenow();
    var time: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ].join('-');
    const timePart = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    var timestamps: any = datePart + ' ' + timePart;
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
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000;
    var sort = query.sort;
    var keyword = query.keyword || '';
    var buckets: any = query.bucket;
    var bucket: string = buckets;
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
    var kaycache: any = 'Index_listdevicepage_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
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
    var filter2keymd5: any = 'Index_listdevicepagemd5_' + md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 3600,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////
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
        var mqttrs: any = await this.mqttService.getDataTopicPage(
          topic,
          deletecache,
        );
        var timestampMqtt: any = mqttrs.timestamp;
        if (timestampMqtt) {
          var timestamps: any = timestampMqtt;
        }
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          // var rss: any = mqttrs.rs;
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
          var filters: any = {};
          filters.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filters.sensorValueData = encodeURI(value_data); //sensor
            filters.status_warning = encodeURI(status_warning);
            filters.status_alert = encodeURI(status_alert);
            filters.recovery_warning = encodeURI(recovery_warning);
            filters.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filters.sensorValueData = encodeURI(value_alarm); //IO
            filters.status_warning = Number(0);
            filters.status_alert = Number(0);
            filters.recovery_warning = Number(1);
            filters.recovery_alert = Number(1);
            var data: any = Number(value_alarm);
          }
          filters.mqtt_name = mqtt_name;
          filters.device_name = mqtt_device_name;
          filters.action_name = mqtt_name;
          filters.mqtt_control_on = encodeURI(mqtt_control_on);
          filters.mqtt_control_off = encodeURI(mqtt_control_off);
          filters.event = 1;
          filters.unit = unit;
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            getAlarmDetails,
            mqttrs,
            mqtt_status_data_name,
            configdata,
            merged,
          };
          if (type_id == 1) {
            devicesensor.push(arraydata);
          } else if (type_id > 1) {
            deviceio.push(arraydata);
          }
        }
        const arraydatarr: any = {
          mqtt_id: mqtt_id,
          mqtt_name: mqtt_name,
          timestamp,
          org: device_org,
          bucket: mqtt_bucket,
          status: status,
          mqtt: mqttdata,
          device: arraydata,
        };
        devicecontrol.push(arraydatarr);
      }
    }
    ///////////////////////////////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      page,
      currentPage: page,
      pageSize,
      totalPages,
      total: rowData,
      connectionMqtt: checkConnectionMqtt,
      cache: cache_data,
      payload: devicecontrol,
      message: 'Device cache success.',
      message_th: 'Device cache success.',
    });
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('mq')
  async getDeviceDataIndexmq(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    /////////////////////
    try {
      let filter: any = {};
      // filter.sort = query.sort || 'ASC';
      // filter.bucket = query.bucket || '';
      // filter.mqtt_type_id = query.mqtt_type_id || '';
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          payload: bucket,
          message: 'bucket inull',
          message_th: 'check bucket inull',
        });
      }
      var status: any = query.status;
      if (!status) {
        var status: any = 1;
      }
      var deletecache: any = query.deletecache;
      filter.status = status;
      filter.bucket = bucket;
      var kaycache: any = md5('mqtt_status_m_' + status + '_bucket_' + bucket);
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var Resultate: any = await Cache.GetCacheData(kaycache);
      if (!Resultate) {
        var Resultate: any = await this.mqttService.mqtt_list_paginate_active(
          filter,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache}`,
          time: 120,
          data: Resultate,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      let ArrayData = [];
      for (const [key, va] of Object.entries(Resultate)) {
        /****************************/
        let filter2: any = {};
        filter2.bucket = Resultate[key].bucket;
        console.log(`filter2 =>` + filter2);
        console.info(filter2);
        var kaycache_cache: any = md5('mqtt_bucket_' + Resultate[key].bucket);
        if (deletecache == 1) {
          await Cache.DeleteCacheData(kaycache_cache);
        }
        var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
        if (!ResultDatadevice) {
          var ResultDatadevice: any = await this.settingsService.device_lists(
            filter2,
          );
          var InpuDatacache: any = {
            keycache: `${kaycache_cache}`,
            time: 120,
            data: ResultDatadevice,
          };
          await Cache.SetCacheData(InpuDatacache);
          var cache_data_2: any = 'no cache';
        } else {
          var cache_data_2: any = 'cache';
        }
        /***************/
        var deviceData = [];
        for (const [key2, va] of Object.entries(ResultDatadevice)) {
          var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
          var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
          var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
          //////////////////
          // var rss = await this.mqttService.getdevicedataDirec(mqtt_data_value);
          // if(!rss){
          //         res.status(500).json({
          //             statusCode: 500,
          //             code: 500,
          //             payload: null,
          //             status: 0,
          //             message: `Mqtt..`,
          //             message_th: `Mqtt..`,
          //         });
          //       return;
          // }
          ///////////////////////
          const arraydata: any = {
            device_id: ResultDatadevice[key2].device_id,
            type_id: ResultDatadevice[key2].type_id,
            device_name: ResultDatadevice[key2].device_name,
            type_name: ResultDatadevice[key2].type_name,
            timestamp: mqttdata['payload']['timestamp'],
            temperature_value: mqttdata['payload']['temperature'],
            status_warning: ResultDatadevice[key2].status_warning,
            recovery_warning: ResultDatadevice[key2].recovery_warning,
            status_alert: ResultDatadevice[key2].status_alert,
            recovery_alert: ResultDatadevice[key2].recovery_alert,
            time_life: ResultDatadevice[key2].time_life,
            mqtt_data_value: mqtt_data_value,
            mqtt_data_control: mqtt_data_control,
            mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
            control_on:
              'mqtt/control?topic=' +
              ResultDatadevice[key2].mqtt_data_control +
              '&message=' +
              ResultDatadevice[key2].mqtt_control_on,
            mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
            control_off:
              'mqtt/control?topic=' +
              ResultDatadevice[key2].mqtt_data_control +
              '&message=' +
              ResultDatadevice[key2].mqtt_control_off,
            //measurement: ResultDatadevice[key2].measurement,
            location_name: ResultDatadevice[key2].location_name,
            mqtt_name: ResultDatadevice[key2].mqtt_name,
            //mqtt_org: ResultDatadevice[key2].mqtt_org,
            mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
            // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
            mqtt_dada: mqttdata['payload']['mqtt_dada'],
            contRelay1: mqttdata['payload']['contRelay1'],
            actRelay1: mqttdata['payload']['actRelay1'],
            contRelay2: mqttdata['payload']['contRelay2'],
            actRelay2: mqttdata['payload']['actRelay2'],
            /****************************/
            fan1: mqttdata['payload']['fan1'],
            overFan1: mqttdata['payload']['overFan1'],
            fan2: mqttdata['payload']['fan2'],
            overFan2: mqttdata['payload']['overFan2'],
            // filter2:filter2,
            // mqttdata: mqttdata['payload'],
          };
          deviceData.push(arraydata);
        }
        /*************************/
        const arraydata: any = {
          mqtt_id: Resultate[key].mqtt_id,
          mqtt_name: Resultate[key].mqtt_name,
          cache: cache_data,
          cache2: cache_data_2,
          device: deviceData,
          mqtt: mqttdata['payload'],
          // mqtt_type_id: Resultate[key].mqtt_type_id,
          // type_name: Resultate[key].type_name,
          org: Resultate[key].org,
          bucket: Resultate[key].bucket,
          // envavorment: Resultate[key].envavorment,
          // sort: Resultate[key].sort,
          status: Resultate[key].status,
        };
        if (ResultDatadevice) {
          ArrayData.push(arraydata);
        }
      }
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: ArrayData,
        status: 0,
        message: `Mqtt..`,
        message_th: `Mqtt..`,
      });
      return;
      ////////////////
    } catch (error) {
      ////////////////
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: [],
        message: 'Internal server error 500',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
    /////////////////////
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('deviceair')
  async getDeviceAir(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    /////////////////////
    try {
      let filter: any = {};
      // filter.sort = query.sort || 'ASC';
      // filter.bucket = query.bucket || '';
      // filter.mqtt_type_id = query.mqtt_type_id || '';
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          payload: bucket,
          message: 'bucket inull',
          message_th: 'check bucket inull',
        });
      }
      var status: any = query.status;
      if (!status) {
        var status: any = 1;
      }
      var deletecache: any = query.deletecache;
      filter.status = status;
      filter.bucket = bucket;
      var kaycache: any = md5('mqtt_status_m_' + status + '_bucket_' + bucket);
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var Resultate: any = await Cache.GetCacheData(kaycache);
      if (!Resultate) {
        var Resultate: any = await this.mqttService.mqtt_list_paginate_active(
          filter,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache}`,
          time: 120,
          data: Resultate,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      let ArrayData = [];
      for (const [key, va] of Object.entries(Resultate)) {
        /****************************/
        let filter2: any = {};
        filter2.bucket = Resultate[key].bucket;
        console.log(`filter2 =>` + filter2);
        console.info(filter2);
        var kaycache_cache: any = md5('mqtt_bucket_' + Resultate[key].bucket);
        if (deletecache == 1) {
          await Cache.DeleteCacheData(kaycache_cache);
        }
        var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
        if (!ResultDatadevice) {
          var ResultDatadevice: any = await this.settingsService.device_lists(
            filter2,
          );
          var InpuDatacache: any = {
            keycache: `${kaycache_cache}`,
            time: 120,
            data: ResultDatadevice,
          };
          await Cache.SetCacheData(InpuDatacache);
          var cache_data_2: any = 'no cache';
        } else {
          var cache_data_2: any = 'cache';
        }
        /***************/
        var deviceData = [];
        for (const [key2, va] of Object.entries(ResultDatadevice)) {
          var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
          var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
          var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
          //////////////////
          // var rss = await this.mqttService.getdevicedataDirec(mqtt_data_value);
          // if(!rss){
          //         res.status(500).json({
          //             statusCode: 500,
          //             code: 500,
          //             payload: null,
          //             status: 0,
          //             message: `Mqtt..`,
          //             message_th: `Mqtt..`,
          //         });
          //       return;
          // }
          ///////////////////////
          const arraydata: any = {
            device_id: ResultDatadevice[key2].device_id,
            type_id: ResultDatadevice[key2].type_id,
            device_name: ResultDatadevice[key2].device_name,
            type_name: ResultDatadevice[key2].type_name,
            timestamp: mqttdata['payload']['timestamp'],
            temperature_value: mqttdata['payload']['temperature'],
            status_warning: ResultDatadevice[key2].status_warning,
            recovery_warning: ResultDatadevice[key2].recovery_warning,
            status_alert: ResultDatadevice[key2].status_alert,
            recovery_alert: ResultDatadevice[key2].recovery_alert,
            time_life: ResultDatadevice[key2].time_life,
            mqtt_data_value: mqtt_data_value,
            mqtt_data_control: mqtt_data_control,
            mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
            control_on:
              'mqtt/control?topic=' +
              ResultDatadevice[key2].mqtt_data_control +
              '&message=' +
              ResultDatadevice[key2].mqtt_control_on,
            mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
            control_off:
              'mqtt/control?topic=' +
              ResultDatadevice[key2].mqtt_data_control +
              '&message=' +
              ResultDatadevice[key2].mqtt_control_off,
            //measurement: ResultDatadevice[key2].measurement,
            location_name: ResultDatadevice[key2].location_name,
            mqtt_name: ResultDatadevice[key2].mqtt_name,
            //mqtt_org: ResultDatadevice[key2].mqtt_org,
            mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
            // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
            mqtt_dada: mqttdata['payload']['mqtt_dada'],
            contRelay1: mqttdata['payload']['contRelay1'],
            actRelay1: mqttdata['payload']['actRelay1'],
            contRelay2: mqttdata['payload']['contRelay2'],
            actRelay2: mqttdata['payload']['actRelay2'],
            /****************************/
            fan1: mqttdata['payload']['fan1'],
            overFan1: mqttdata['payload']['overFan1'],
            fan2: mqttdata['payload']['fan2'],
            overFan2: mqttdata['payload']['overFan2'],
            // filter2:filter2,
            // mqttdata: mqttdata['payload'],
          };
          deviceData.push(arraydata);
        }
        /*************************/
        const arraydata: any = {
          mqtt_id: Resultate[key].mqtt_id,
          mqtt_name: Resultate[key].mqtt_name,
          cache: cache_data,
          cache2: cache_data_2,
          device: deviceData,
          mqtt: mqttdata['payload'],
          // mqtt_type_id: Resultate[key].mqtt_type_id,
          // type_name: Resultate[key].type_name,
          org: Resultate[key].org,
          bucket: Resultate[key].bucket,
          // envavorment: Resultate[key].envavorment,
          // sort: Resultate[key].sort,
          status: Resultate[key].status,
        };
        if (ResultDatadevice) {
          ArrayData.push(arraydata);
        }
      }
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: ArrayData,
        status: 0,
        message: `Mqtt..`,
        message_th: `Mqtt..`,
      });
      return;
      ////////////////
    } catch (error) {
      ////////////////
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: [],
        message: 'Internal server error 500',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('checkconnection')
  async checkConnection(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
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
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: checkConnectionMqtt,
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
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqtt')
  async deviceactivemqtt(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
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
      var cachetimeset: any = 3600;
      var filter: any = {};
      if (query.device_id) {
        filter.device_id = query.device_id;
      }
      if (query.keyword) {
        filter.keyword = query.keyword;
      }
      if (query.type_id) {
        filter.keyword = query.type_id;
      }
      //////////////////////
      var filter_md5: any = md5(filter);
      var kaycache_cache: any = 'deviceactive_mqtt_key_' + filter_md5;
      var ResultData: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (ResultData) {
        var ResultData: any = ResultData;
        var cache_data_ResultData: any = 'cache';
      } else if (!ResultData) {
        var ResultData: any = await this.settingsService.deviceactive(filter);
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
          const va: any = ResultData[key];
          const device_id = va.device_id;
          const type_id = va.type_id;
          const device_name = va.device_name;
          const mqtt_data_value = va.mqtt_data_value;
          const mqtt_data_control = va.mqtt_data_control;
          const mqtt_control_on = va.mqtt_control_on;
          const mqtt_control_off = va.mqtt_control_off;
          const device_org = va.device_org;
          const device_bucket = va.device_bucket;
          const topic: any = encodeURI(mqtt_data_value);
          //const mqttrs: any = await this.mqttService.getDataTopic(topic);
          const mqttrs: any = await this.mqttService.getDataTopicCacheData(
            topic,
          );
          if (mqttrs) {
            var mqttstatus: any = mqttrs.status;
            var mqttmsg: any = mqttrs.msg;
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
                data: mqttmsg,
                status: 1,
                createddate: new Date(),
              };
              await this.mqttService.create_mqttlogRepository(inputCreate);
            }
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
              topic,
              mqttrs,
              inputCreate,
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
            await this.mqttService.create_mqttlogRepository(inputCreate);
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
              topic,
              inputCreate,
              mqttrs: 'Error',
            };
          }
          ResultDataRS.push(arraydata);
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
  /////////////////////////////////////
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
      var cachetimeset: any = 3600;
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
  //http://localhost:3003/v1/mqtt/air
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('airV1')
  async getDeviceairV1(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    //////////////////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    var location_id: any = query.location_id;
    if (!location_id) {
      var location_id: any = 5;
    }
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    filter.location_id = location_id;
    var kaycache: any = md5(
      'air_mqtt_status_air_' +
        status +
        '_bucket_' +
        bucket +
        '_location_id_' +
        location_id,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (!Resultate) {
      /////////////////
      res.status(200).json({
        statusCode: 200,
        code: 200,
        cache_data,
        filter: filter,
        payload: Resultate,
        status: 0,
        message: `data is null Mqtt air device..`,
        message_th: `data is null Mqtt air device..`,
      });
      return;
    }
    //////////////--------------------/////////////
    let ArrayDataAir = [];
    for (const [key, va] of Object.entries(Resultate)) {
      var rs: any = Resultate[key];
      var mqtt_id: any = rs.mqtt_id;
      var mqtt_type_id: any = rs.mqtt_type_id;
      var sort: any = rs.sort;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var org: any = rs.org;
      var bucket: any = rs.bucket;
      var envavorment: any = rs.envavorment;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var location_id: any = rs.location_id;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var type_name: any = rs.type_name;
      var filterdevice: any = {};
      filterdevice.type_name = type_name;
      filterdevice.mqtt_id = mqtt_id || '';
      filterdevice.org = org;
      filterdevice.bucket = bucket;
      filterdevice.deletecache = deletecache;
      var device: any = await this.devicemoniiterRSS(filterdevice);
      if (!device) {
        var device: any = [];
      }
      const DataRs: any = {
        mqtt_id,
        mqtt_type_id,
        sort,
        location_name,
        mqtt_name,
        org,
        bucket,
        type_name,
        device,
      };
      ArrayDataAir.push(DataRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      checkConnectionMqtt,
      payload: ArrayDataAir,
      status: 0,
      message: `Mqtt ArrayDataAir..`,
      message_th: `Mqtt ArrayDataAir..`,
    });
    return;
  }
  //http://localhost:3003/v1/mqtt/air
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('air')
  async getDeviceair(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    //////////////////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    var location_id: any = query.location_id;
    if (!location_id) {
      var location_id: any = 5;
    }
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    filter.location_id = location_id;
    var kaycache: any = md5(
      'air_mqtt_status_air_' +
        status +
        '_bucket_' +
        bucket +
        '_location_id_' +
        location_id,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (!Resultate) {
      /////////////////
      res.status(200).json({
        statusCode: 200,
        code: 200,
        cache_data,
        filter: filter,
        payload: Resultate,
        status: 0,
        message: `data is null Mqtt air device..`,
        message_th: `data is null Mqtt air device..`,
      });
      return;
    }
    //////////////--------------------/////////////
    let ArrayDataAir = [];
    for (const [key, va] of Object.entries(Resultate)) {
      var rs: any = Resultate[key];
      var mqtt_id: any = rs.mqtt_id;
      var mqtt_type_id: any = rs.mqtt_type_id;
      var sort: any = rs.sort;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var org: any = rs.org;
      var bucket: any = rs.bucket;
      var envavorment: any = rs.envavorment;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var location_id: any = rs.location_id;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var type_name: any = rs.type_name;
      const DataRs: any = {
        mqtt_id,
        mqtt_type_id,
        sort,
        location_name,
        mqtt_name,
        org,
        bucket,
        type_name,
      };
      ArrayDataAir.push(DataRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      checkConnectionMqtt,
      payload: ArrayDataAir,
      status: 0,
      message: `Mqtt ArrayDataAir..`,
      message_th: `Mqtt ArrayDataAir..`,
    });
    return;
  }
  //http://localhost:3003/v1/mqtt/air
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('fan')
  async getDevicefanapp(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    //////////////////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    var location_id: any = query.location_id;
    if (!location_id) {
      var location_id: any = 1;
    }
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    filter.location_id = location_id;
    var kaycache: any = md5(
      'fan_mqtt_status_fanapp_' +
        status +
        '_bucket_' +
        bucket +
        '_location_id_' +
        location_id,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (!Resultate) {
      /////////////////
      res.status(200).json({
        statusCode: 200,
        code: 200,
        cache_data,
        filter: filter,
        payload: Resultate,
        status: 0,
        message: `data is null Mqtt fan device..`,
        message_th: `data is null Mqtt fan device..`,
      });
      return;
    }
    //////////////--------------------/////////////
    let ArrayDataAir = [];
    for (const [key, va] of Object.entries(Resultate)) {
      var rs: any = Resultate[key];
      var mqtt_id: any = rs.mqtt_id;
      var mqtt_type_id: any = rs.mqtt_type_id;
      var sort: any = rs.sort;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var org: any = rs.org;
      var bucket: any = rs.bucket;
      var envavorment: any = rs.envavorment;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var location_id: any = rs.location_id;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var type_name: any = rs.type_name;
      const DataRs: any = {
        mqtt_id,
        mqtt_type_id,
        sort,
        location_name,
        mqtt_name,
        org,
        bucket,
        type_name,
      };
      ArrayDataAir.push(DataRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      checkConnectionMqtt,
      payload: ArrayDataAir,
      status: 0,
      message: `Mqtt ArrayData Fan..`,
      message_th: `Mqtt ArrayData Gan..`,
    });
    return;
  }
  //http://localhost:3003/v1/mqtt/air
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('fanlist')
  async fanlist(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    var checkConnectionMqtt: any =
      await this.mqttService.checkConnectionStatusMqtt();
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    var location_id: any = query.location_id;
    if (!location_id) {
      var location_id: any = 1;
    }
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    filter.location_id = location_id;
    var kaycache: any = md5(
      'fan_mqtt_status_fan_' +
        status +
        '_bucket_' +
        bucket +
        '_location_id_' +
        location_id,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any =
        await this.mqttService.mqtt_list_paginate_active_fan_app(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data_fan: any = 'no cache fan';
    } else {
      var cache_data_fan: any = 'cache fan';
    }
    if (!Resultate) {
      /////////////////
      res.status(200).json({
        statusCode: 200,
        code: 200,
        cache_data_fan,
        filter: filter,
        payload: Resultate,
        status: 0,
        message: `data is null Mqtt air device..`,
        message_th: `data is null Mqtt air device..`,
      });
      return;
    }
    //////////////--------------------/////////////
    let ArrayDataAir = [];
    for (const [key, va] of Object.entries(Resultate)) {
      var rs: any = Resultate[key];
      var mqtt_id: any = rs.mqtt_id;
      var mqtt_type_id: any = rs.mqtt_type_id;
      var sort: any = rs.sort;
      var location_name: any = rs.location_name;
      var mqtt_name: any = rs.mqtt_name;
      var org: any = rs.org;
      var bucket: any = rs.bucket;
      var envavorment: any = rs.envavorment;
      var createddate: any = rs.createddate;
      var status: any = rs.status;
      var location_id: any = rs.location_id;
      var latitude: any = rs.latitude;
      var longitude: any = rs.longitude;
      var type_name: any = rs.type_name;
      var filterdevice: any = {};
      filterdevice.type_name = type_name;
      filterdevice.mqtt_id = mqtt_id || '';
      filterdevice.org = org;
      filterdevice.bucket = bucket;
      filterdevice.deletecache = deletecache;
      var device: any = await this.devicemoniiterRSSFan(filterdevice);
      if (!device) {
        var device: any = [];
      }
      const DataRs: any = {
        mqtt_id,
        mqtt_type_id,
        sort,
        location_name,
        mqtt_name,
        org,
        bucket,
        type_name,
        device,
      };
      ArrayDataAir.push(DataRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      checkConnectionMqtt,
      payload: ArrayDataAir,
      status: 0,
      message: `Mqtt ArrayDataAir..`,
      message_th: `Mqtt ArrayDataAir..`,
    });
    return;
  }
  /////////////////////////////////////
  //http://localhost:3003/v1/mqtt/fan
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('fanss')
  async getDeviceDatafan(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any = md5(
      'fan_mqtt_status_m_' + status + '_bucket_' + bucket,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_fan(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any = md5('mqtt_bucket_' + Resultate[key].bucket);
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      var deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        device: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ArrayData,
      status: 0,
      message: `Mqtt..`,
      message_th: `Mqtt..`,
    });
    return;
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('listtitle')
  async getMqttlist(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any = md5(
      'mqtt_status_listtitle_' + status + '_bucket_' + bucket,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any =
        'mqtt_listtitle_bucket_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      // let deviceData = [];
      //     for (const [key2, va] of Object.entries(ResultDatadevice)) {
      //       var mqtt_data_value:any=ResultDatadevice[key2].mqtt_data_value;
      //       var mqtt_data_control:any=ResultDatadevice[key2].mqtt_data_control;
      //       var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
      //       const arraydata: any = {
      //               device_id: ResultDatadevice[key2].device_id,
      //               type_id: ResultDatadevice[key2].type_id,
      //               device_name: ResultDatadevice[key2].device_name,
      //               type_name: ResultDatadevice[key2].type_name,
      //               timestamp: mqttdata['payload']['timestamp'],
      //               temperature_value: mqttdata['payload']['temperature'],
      //               status_warning: ResultDatadevice[key2].status_warning,
      //               recovery_warning: ResultDatadevice[key2].recovery_warning,
      //               status_alert: ResultDatadevice[key2].status_alert,
      //               recovery_alert: ResultDatadevice[key2].recovery_alert,
      //               time_life: ResultDatadevice[key2].time_life,
      //               mqtt_data_value: mqtt_data_value,
      //               mqtt_data_control: mqtt_data_control,
      //               mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
      //               control_on:'mqtt/control?topic='+ResultDatadevice[key2].mqtt_data_control+'&message='+ResultDatadevice[key2].mqtt_control_on,
      //               mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
      //               control_off:'mqtt/control?topic='+ResultDatadevice[key2].mqtt_data_control+'&message='+ResultDatadevice[key2].mqtt_control_off,
      //               //measurement: ResultDatadevice[key2].measurement,
      //               location_name: ResultDatadevice[key2].location_name,
      //               mqtt_name: ResultDatadevice[key2].mqtt_name,
      //               //mqtt_org: ResultDatadevice[key2].mqtt_org,
      //               mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
      //               // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
      //               mqtt_dada: mqttdata['payload']['mqtt_dada'],
      //               contRelay1: mqttdata['payload']['contRelay1'],
      //               actRelay1: mqttdata['payload']['actRelay1'],
      //               contRelay2: mqttdata['payload']['contRelay2'],
      //               actRelay2: mqttdata['payload']['actRelay2'],
      //               /****************************/
      //               fan1: mqttdata['payload']['fan1'],
      //               overFan1: mqttdata['payload']['overFan1'],
      //               fan2: mqttdata['payload']['fan2'],
      //               overFan2: mqttdata['payload']['overFan2'],
      //               // filter2:filter2,
      //               // mqttdata: mqttdata['payload'],
      //       };
      //     deviceData.push(arraydata);
      // }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        // cache: cache_data,
        // cache2:cache_data_2,
        //device: deviceData,
        //mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        sort: Resultate[key].sort,
        // status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ArrayData,
      status: 0,
      message: `Mqtt listtitle..`,
      message_th: `Mqtt listtitle..`,
    });
    return;
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  // @UseGuards(AuthGuardUser)
  @Get('listtitleall')
  async getMqttlistall(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    let filter: any = {};
    // filter.sort = query.sort || 'ASC';
    // filter.bucket = query.bucket || '';
    // filter.mqtt_type_id = query.mqtt_type_id || '';
    var bucket: any = query.bucket;
    var status: any = query.status;
    if (!status) {
      // var status:any=1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any = md5(
      'mqtt_status_listtitle_all_' + status + '_bucket_' + bucket,
    );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_all_data(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any =
        'mqtt_listtitle_all_bucket_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        // cache: cache_data,
        // cache2:cache_data_2,
        //device: deviceData,
        //mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        sort: Resultate[key].sort,
        // status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ArrayData,
      status: 0,
      message: `Mqtt listtitle..`,
      message_th: `Mqtt listtitle..`,
    });
    return;
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('getdevice')
  async DeviceDataGet(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    if (!query.topic) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'topic is null.',
        message_th: 'ไม่พบข้อมูล topic ',
      });
      return;
    }
    var deletecache: any = query.deletecache;
    let filter: any = {};
    filter.mqtt_data_value = query.topic;
    console.log(`filter =>` + filter);
    console.info(filter);
    var mqttdata = await this.mqttService.getdevicedata(query.topic);

    var kaycache_cache: any = 'mqtt_getdevice_topic_' + query.topic;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache_cache);
    }
    var ResultData: any = await Cache.GetCacheData(kaycache_cache);
    if (!ResultData) {
      var ResultData: any = await this.settingsService.device_lists(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache_cache}`,
        time: 120,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data_2: any = 'no cache';
    } else {
      var cache_data_2: any = 'cache';
    }

    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const arraydata: any = {
        device_id: ResultData[key].device_id,
        type_id: ResultData[key].type_id,
        device_name: ResultData[key].device_name,
        timestamp: mqttdata['payload']['timestamp'],
        temperature_value: mqttdata['payload']['temperature'],
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        time_life: ResultData[key].time_life,
        mqtt_data_value: ResultData[key].mqtt_data_value,
        mqtt_data_control: ResultData[key].mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        control_on:
          'mqtt/control?topic=' +
          ResultData[key].mqtt_data_control +
          '&message=' +
          ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        control_off:
          'mqtt/control?topic=' +
          ResultData[key].mqtt_data_control +
          '&message=' +
          ResultData[key].mqtt_control_off,
        measurement: ResultData[key].measurement,
        type_name: ResultData[key].type_name,
        location_name: ResultData[key].location_name,
        mqtt_name: ResultData[key].mqtt_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_envavorment: ResultData[key].mqtt_envavorment,
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
      tempData2.push(arraydata);
    }
    var Rsdata: any = {
      statusCode: mqttdata['statusCode'],
      code: mqttdata['code'],
      topic: mqttdata['topic'],
      timestamp: mqttdata['payload']['timestamp'],
      data: mqttdata['payload'],
      dataFrom: mqttdata['getdataFrom'],
      type_name: tempData2['0']['type_name'],
      type_id: tempData2['0']['type_id'],
      payload: tempData2,
      cache2: cache_data_2,
      //"mqtt":mqttdata,
    };
    res.status(200).json(Rsdata);
    return;
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('devicecontrol1')
  async device_control1(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var topic_mqtt: any = query.topic;
    var message_mqtt: any = query.message;
    try {
      var Rt: any = await this.mqttService.publish(topic_mqtt, message_mqtt);
      var InpuDatacache: any = {
        keycache: `${topic_mqtt}`,
        data: message_mqtt,
      };
      await Cache.SetCacheKey(InpuDatacache);
      var today: any = format.getDayname();
      var getDaynameall: any = format.getDaynameall();
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      // จัดรูปแบบวันที่ YYYY-MM-DD
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
      var timestamp = datePart + ' ' + timePart;
      const originalTopic = topic_mqtt;
      // แทนที่ 'CONTROL' ด้วย 'DATA'
      const newTopic = originalTopic.replace('CONTROL', 'DATA');
      var topicrs: any = 'topic_mqtt_' + newTopic;
      var GetCacheData = await Cache.GetCacheData(newTopic);
      if (GetCacheData) {
        Cache.DeleteCacheData(newTopic);
      }
      console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA'
      if (message_mqtt == 0) {
        var dataObject: any = {
          timestamp: timestamp,
          device_1: 0,
          device_status: 'off',
        };
      } else if (message_mqtt == 1) {
        var dataObject: any = {
          timestamp: timestamp,
          device_1: 1,
          device_status: 'on',
        };
      } else if (message_mqtt == 2) {
        var dataObject: any = {
          timestamp: timestamp,
          device_2: 0,
          device_status: 'off',
        };
      } else if (message_mqtt == 3) {
        var dataObject: any = {
          timestamp: timestamp,
          device_2: 1,
          device_status: 'on',
        };
      }

      var dataRs = await this.mqttService.getDataFromTopic(newTopic);
      var InpuDatacache: any = {
        keycache: `${newTopic}`,
        time: 10,
        data: dataRs,
      };
      await Cache.SetCacheData(InpuDatacache);
      var mqttdata = await Cache.GetCacheData(newTopic);
      const parts = mqttdata.split(',');
      const getDataObject: any = {
        mqtt_control: topic_mqtt,
        mqtt_dada: newTopic,
        timestamp: timestamp,
        temperature: parseFloat(parts[0]),
        contRelay1: parseInt(parts[1]),
        actRelay1: parseInt(parts[2]),
        fan1: parseInt(parts[3]),
        overFan1: parseInt(parts[4]),
        contRelay2: parseInt(parts[5]),
        actRelay2: parseInt(parts[6]),
        fan2: parseInt(parts[7]),
        overFan2: parseInt(parts[8]),
        data: dataObject,
        Rt: Rt,
      };
      res.status(200).json({
        statusCode: 200,
        code: 200,
        query: query,
        payload: getDataObject,
        mqttdata: mqttdata,
        today: today,
        daynameall: getDaynameall,
        status: 1,
        message: `Topic: ${query.topic} value: ${query.message}`,
        message_th: `Topic: ${query.topic} value: ${query.message}`,
      });
      return;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('devicecontrol')
  async device_control(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var topic_mqtt: any = query.topic;
    var message_mqtt: any = query.message;
    try {
      var Rt: any = await this.mqttService.publish(topic_mqtt, message_mqtt);
      var InpuDatacache: any = {
        keycache: `${topic_mqtt}`,
        data: message_mqtt,
      };
      await Cache.SetCacheKey(InpuDatacache);
      var today: any = format.getDayname();
      var getDaynameall: any = format.getDaynameall();
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      // จัดรูปแบบวันที่ YYYY-MM-DD
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
      var timestamp = datePart + ' ' + timePart;
      const originalTopic = topic_mqtt;
      // แทนที่ 'CONTROL' ด้วย 'DATA'
      const newTopic = originalTopic.replace('CONTROL', 'DATA');
      //var topicrs:any='topic_mqtt_'+newTopic;
      Cache.DeleteCacheData(newTopic);
      var GetCacheData = await Cache.GetCacheData(newTopic);
      if (GetCacheData) {
        Cache.DeleteCacheData(newTopic);
      }
      var mqttdata = await Cache.GetCacheData(newTopic);
      console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA'
      if (message_mqtt == 0) {
        var dataObject: any = {
          timestamp: timestamp,
          device_1: 0,
          device_status: 'off',
        };
      } else if (message_mqtt == 1) {
        var dataObject: any = {
          timestamp: timestamp,
          device_1: 1,
          device_status: 'on',
        };
      } else if (message_mqtt == 2) {
        var dataObject: any = {
          timestamp: timestamp,
          device_2: 0,
          device_status: 'off',
        };
      } else if (message_mqtt == 3) {
        var dataObject: any = {
          timestamp: timestamp,
          device_2: 1,
          device_status: 'on',
        };
      }
      var dataRs = await this.mqttService.getDataFromTopic(newTopic);
      const parts = dataRs.split(',');
      const getDataObject = {
        mqtt_dada: newTopic,
        timestamp: timestamp,
        temperature: parseFloat(parts[0]),
        contRelay1: parseInt(parts[1]),
        actRelay1: parseInt(parts[2]),
        fan1: parseInt(parts[3]),
        overFan1: parseInt(parts[4]),
        contRelay2: parseInt(parts[5]),
        actRelay2: parseInt(parts[6]),
        fan2: parseInt(parts[7]),
        overFan2: parseInt(parts[8]),
      };
      var InpuDatacache: any = {
        keycache: `${newTopic}`,
        time: 10,
        data: getDataObject,
      };
      await Cache.SetCacheData(InpuDatacache);
      res.status(200).json({
        statusCode: 200,
        code: 200,
        query: query,
        Rt: Rt,
        dataRs: dataRs,
        dataObject: dataObject,
        mqttdata: mqttdata,
        today: today,
        payload: getDataObject,
        daynameall: getDaynameall,
        mqtt_data_control: topic_mqtt,
        mqtt_dada_get: newTopic,
        status: message_mqtt,
        status_msg: dataObject['device_status'],
        message: `Topic: ${query.topic} value: ${query.message}`,
        message_th: `Topic: ${query.topic} value: ${query.message}`,
      });
      return;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicelistcontrolsV2')
  async devicelistcontrolsV2(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      if (!query.bucket) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'bucket is null.',
          message_th: 'ไม่พบ bucket..',
        });
        return;
      }
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-'); // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':'); // รวมวันที่และเวลาเข้าด้วยกัน
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
      var cachetimeset: any = 3600;
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
      ////////////////////// api_url
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
              mqtt_act_relay_name,
              mqtt_control_relay_name,
              main_status_warning,
              main_status_alert,
              main_max,
              main_min,
              main_type_id,
              mqtt_status_over_name,
              timestamp,
              sensor_data_name,
              topic,
              inputCreate,
              subject,
              content,
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
              //mqttrs,
              mqttdata,
              mqtt_status_data_name,
              configdata,
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
          devicecontrol.push(arraydata);
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          connectionMqtt: checkConnectionMqtt,
          location: devicesensor['0'].location_name,
          mqtt_name: devicesensor['0'].mqtt_name,
          type_name: devicesensor['0'].type_name,
          device_name: devicesensor['0'].device_name,
          bucket: devicesensor['0'].device_bucket,
          mqtt_org: devicesensor['0'].mqtt_org,
          subject: devicesensor['0'].subject,
          value_alarm_msg: devicesensor['0'].value_alarm_msg,
          value_data: devicesensor['0'].value_data,
          count_alarm: devicesensor['0'].count_alarm,
          value_alarm: devicesensor['0'].value_alarm,
          alarmStatusSet: devicesensor['0'].alarmStatusSet,
          dataAlarm: devicesensor['0'].dataAlarm,
          mqtt_act_relay_name: devicesensor['0'].mqtt_act_relay_name,
          topic: devicesensor['0'].topic,
          cache: cache_data_ResultData,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
        },
        message: 'device list controls Connection Status Mqtt',
        message_th: 'device list controls Connection Status Mqtt',
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
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepageactive')
  @ApiOperation({ summary: 'list device page active' })
  async listdevicepageactive(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
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
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000;
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
    var kaycache: any = 'mqttListDevicePageActives_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
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
      // var ResultData:any=await this.settingsService.device_list_paginate_active(filter2);
      var ResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 3600,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////
    ///////////////////////////////////////

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
        // const mqttrsV2: any = await this.mqttService.getMqttTopicData(topic,deletecache);
        const mqttrs: any = await this.mqttService.getMqttTopicDataRS(
          topic,
          deletecache,
        );
        //////////////////////////////////////
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          // var rss: any = mqttrs.rs;
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
          var filters: any = {};
          filters.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filters.sensorValueData = encodeURI(value_data); //sensor
            filters.status_warning = encodeURI(status_warning);
            filters.status_alert = encodeURI(status_alert);
            filters.recovery_warning = encodeURI(recovery_warning);
            filters.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filters.sensorValueData = encodeURI(value_alarm); //IO
            filters.status_warning = Number(0);
            filters.status_alert = Number(0);
            filters.recovery_warning = Number(1);
            filters.recovery_alert = Number(1);
            var data: any = Number(value_alarm);
          }
          filters.mqtt_name = mqtt_name;
          filters.device_name = mqtt_device_name;
          filters.action_name = mqtt_name;
          filters.mqtt_control_on = encodeURI(mqtt_control_on);
          filters.mqtt_control_off = encodeURI(mqtt_control_off);
          filters.event = 1;
          filters.unit = unit;
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            // getAlarmDetails,
            mqttrs,
            mqtt_status_data_name,
            configdata,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            alarmStatusSet,
            // getAlarmDetails,
            mqttrs: 'Error',
            mqtt_status_data_name,
            configdata,
          };
        }
        devicecontrol.push(arraydata);
      }
    }
    ///////////////////////////////////////
    ///////////////////////////////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        connectionMqtt: checkConnectionMqtt,
        cache: cache_data,
        data: devicecontrol,
      },
      message: 'Device cache success.',
      message_th: 'Device cache success.',
    });
  }
  /////////////////////////////////////
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepageair')
  @ApiOperation({ summary: 'list device page' })
  async listdevicepageair(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
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
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000;
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
    var kaycache: any = 'listdevicepage_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
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
    var filter2keymd5: any = 'listdevicepagemd5_' + md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 3600,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////
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
        var mqttrs: any = await this.mqttService.getMqttTopicPA1(
          topic,
          deletecache,
        );
        //var mqttrs: any = await this.mqttService.getDataTopicPage(topic,deletecache);
        var timestampMqtt: any = mqttrs.timestamp;
        if (timestampMqtt) {
          var timestamps: any = timestampMqtt;
        }
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          // var rss: any = mqttrs.rs;
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
          var merged2Mode: any = format.mapMqttDataToDeviceALLMode(
            [va],
            mqttData,
          );
          var active: any = 1;
          var airmod: any = await this.IotService.get_airmod_active(active);
          if (airmod) {
            var airmodName: any = airmod.name;
            var airsmod: any = airmod.data;
          } else {
            var airmodName: any = 'auto';
            var airsmod: any = 's';
          }
          var airwarning: any = await this.IotService.get_warning_active(
            active,
          );
          var airperiod: any = await this.IotService.get_airperiod_active(
            active,
          );
          var mergedMode: any = merged2Mode;
          if (mergedMode) {
            var warning: any = merged2Mode.warning;
            var airperiod: any = merged2Mode.period;
            var mode: any = merged2Mode.mode;
            var stateair1: any = merged2Mode.stateair1;
            var stateair2: any = merged2Mode.stateair2;
            var air1alarm: any = merged2Mode.air1alarm;
            var air2alarm: any = merged2Mode.stateair2;
          } else {
            var mergedMode: any = 35;
            var airperiod: any = 6;
            var mode: any = 1;
            var stateair1: any = 1;
            var stateair2: any = 1;
            var air1alarm: any = 1;
            var air2alarm: any = 1;
          }
          var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
          var merged_data: any = merged_dataRs[0];
          var merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          var merged2Alls: any = format.mapMqttDataToDeviceALL([va], mqttData);
          var merged2All: any = merged2Alls.mqttData;
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
          var filters: any = {};
          filters.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filters.sensorValueData = encodeURI(value_data); //sensor
            filters.status_warning = encodeURI(status_warning);
            filters.status_alert = encodeURI(status_alert);
            filters.recovery_warning = encodeURI(recovery_warning);
            filters.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filters.sensorValueData = encodeURI(value_alarm); //IO
            filters.status_warning = Number(0);
            filters.status_alert = Number(0);
            filters.recovery_warning = Number(1);
            filters.recovery_alert = Number(1);
            var data: any = Number(value_alarm);
          }
          filters.mqtt_name = mqtt_name;
          filters.device_name = mqtt_device_name;
          filters.action_name = mqtt_name;
          filters.mqtt_control_on = encodeURI(mqtt_control_on);
          filters.mqtt_control_off = encodeURI(mqtt_control_off);
          filters.event = 1;
          filters.unit = unit;
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
          var arraydata: any = {
            device_id,
            airmod,
            airmodName,
            airsmod,
            mqttio: merged2All,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            // getAlarmDetails,
            mqttrs,
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
            warning,
            airperiod,
            mode,
            stateair1,
            stateair2,
            air1alarm,
            air2alarm,
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
            airmod,
            airmodName,
            airsmod,
            mqttio: merged2All,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            alarmStatusSet,
            // getAlarmDetails,
            mqttrs: 'Error',
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
            mode,
            stateair1,
            stateair2,
            air1alarm,
            air2alarm,
          };
        }
        devicecontrol.push(arraydata);
      }
    }
    ///////////////////////////////////////
    ///////////////////////////////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        connectionMqtt: checkConnectionMqtt,
        cache: cache_data,
        data: devicecontrol,
      },
      message: 'Device cache success.',
      message_th: 'Device cache success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepage')
  @ApiOperation({ summary: 'list device page' })
  async listdevicepage(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
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
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000;
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
    var kaycache: any = 'listdevicepage_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
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
    var filter2keymd5: any = 'listdevicepagemd5_' + md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 3600,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////
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
        var host_id = rs.host_id;
        var host_name = rs.host_name;
        var hardware_type_name = rs.hardware_type_name;
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
        // const mqttrsV2: any = await this.mqttService.getMqttTopicData(topic,deletecache);
        // var mqttrs: any = await this.mqttService.getMqttTopicDataRS(topic,deletecache);
        //////////////////////////////////////
        var mqttrs: any = await this.mqttService.getDataTopicPage(
          topic,
          deletecache,
        );
        var timestampMqtt: any = mqttrs.timestamp;
        if (timestampMqtt) {
          var timestamps: any = timestampMqtt;
        }
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          // var rss: any = mqttrs.rs;
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
          var merged2Alls: any = format.mapMqttDataToDeviceALL([va], mqttData);
          var merged2All: any = merged2Alls.mqttData;
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
          var filters: any = {};
          filters.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filters.sensorValueData = encodeURI(value_data); //sensor
            filters.status_warning = encodeURI(status_warning);
            filters.status_alert = encodeURI(status_alert);
            filters.recovery_warning = encodeURI(recovery_warning);
            filters.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filters.sensorValueData = encodeURI(value_alarm); //IO
            filters.status_warning = Number(0);
            filters.status_alert = Number(0);
            filters.recovery_warning = Number(1);
            filters.recovery_alert = Number(1);
            var data: any = Number(value_alarm);
          }
          filters.mqtt_name = mqtt_name;
          filters.device_name = mqtt_device_name;
          filters.action_name = mqtt_name;
          filters.mqtt_control_on = encodeURI(mqtt_control_on);
          filters.mqtt_control_off = encodeURI(mqtt_control_off);
          filters.event = 1;
          filters.unit = unit;
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
          var arraydata: any = {
            device_id,
            mqttio: merged2All,
            type_id,
            device_name,
            host_id,
            host_name,
            hardware_type_name,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            // getAlarmDetails,
            mqttrs,
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
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
            mqttio: merged2All,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            alarmStatusSet,
            // getAlarmDetails,
            mqttrs: 'Error',
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
          };
        }
        devicecontrol.push(arraydata);
      }
    }
    ///////////////////////////////////////
    ///////////////////////////////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        connectionMqtt: checkConnectionMqtt,
        cache: cache_data,
        data: devicecontrol,
      },
      message: 'Device cache success.',
      message_th: 'Device cache success.',
    });
  }
  @HttpCode(200)
  //@AuthUserRequired()
  @Get('listdevicepageV1')
  @ApiOperation({ summary: 'list device page' })
  async listdevicepageV1(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
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
    var device_id = query.device_id || '';
    var page = Number(query.page) || 1;
    var pageSize = Number(query.pageSize) || 100000;
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
    var kaycache: any = 'listdevicepage_' + filterkeymd5;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var rowResultData: any = await Cache.GetCacheData(kaycache);
    if (!rowResultData) {
      var rowResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 3600,
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
    var filter2keymd5: any = 'listdevicepagemd5_' + md5(filter2cache);
    var ResultData: any = await Cache.GetCacheData(filter2keymd5);
    if (!ResultData) {
      var ResultData: any =
        await this.settingsService.device_list_paginate_active_al(filter2);
      var InpuDatacache: any = {
        keycache: `${filter2keymd5}`,
        time: 3600,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////
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
        // const mqttrsV2: any = await this.mqttService.getMqttTopicData(topic,deletecache);
        // var mqttrs: any = await this.mqttService.getMqttTopicDataRS(topic,deletecache);
        //////////////////////////////////////
        var mqttrs: any = await this.mqttService.getDataTopicPage(
          topic,
          deletecache,
        );
        var timestampMqtt: any = mqttrs.timestamp;
        if (timestampMqtt) {
          var timestamps: any = timestampMqtt;
        }
        if (mqttrs) {
          var mqttstatus: any = mqttrs.status;
          var mqttdata: any = mqttrs.msg;
          // var rss: any = mqttrs.rs;
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
          var filters: any = {};
          filters.alarmTypeId = main_type_id;
          if (main_type_id == 1) {
            filters.sensorValueData = encodeURI(value_data); //sensor
            filters.status_warning = encodeURI(status_warning);
            filters.status_alert = encodeURI(status_alert);
            filters.recovery_warning = encodeURI(recovery_warning);
            filters.recovery_alert = encodeURI(recovery_alert);
            var data: any = value_data + ' ' + unit;
          } else {
            filters.sensorValueData = encodeURI(value_alarm); //IO
            filters.status_warning = Number(0);
            filters.status_alert = Number(0);
            filters.recovery_warning = Number(1);
            filters.recovery_alert = Number(1);
            var data: any = Number(value_alarm);
          }
          filters.mqtt_name = mqtt_name;
          filters.device_name = mqtt_device_name;
          filters.action_name = mqtt_name;
          filters.mqtt_control_on = encodeURI(mqtt_control_on);
          filters.mqtt_control_off = encodeURI(mqtt_control_off);
          filters.event = 1;
          filters.unit = unit;
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            // getAlarmDetails,
            mqttrs,
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
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
            mqtt_act_relay_name,
            mqtt_control_relay_name,
            main_status_warning,
            main_status_alert,
            main_max,
            main_min,
            main_type_id,
            timestamp,
            sensor_data_name,
            topic,
            inputCreate,
            subject,
            content,
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
            status_report,
            alarmStatusSet,
            // getAlarmDetails,
            mqttrs: 'Error',
            mqtt_status_data_name,
            configdata,
            merged,
            mqttdata_arr,
            mqtt_obj2_data,
          };
        }
        devicecontrol.push(arraydata);
      }
    }
    ///////////////////////////////////////
    ///////////////////////////////////////
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page,
        currentPage: page,
        pageSize,
        totalPages,
        total: rowData,
        connectionMqtt: checkConnectionMqtt,
        cache: cache_data,
        data: devicecontrol,
      },
      message: 'Device cache success.',
      message_th: 'Device cache success.',
    });
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('getdevice')
  async getDeviceData(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    const topic: any = query.topic;
    const deletecache: any = query.deletecache;
    if (!topic) {
            res.status(200).json(this.createErrorResponse(
                'Topic is required',
                'กรุณาระบุ topic',
                400
            ));
            return;
    }
    // if (!topic) {
    //   throw new HttpException('Topic is required', HttpStatus.BAD_REQUEST);
    // }
    try {
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      // จัดรูปแบบวันที่ YYYY-MM-DD
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
      var timestamp = datePart + ' ' + timePart;
      // var tzString = process.env.tzString;
      // formatInTimeZone(date, tzString, 'yyyy-MM-dd HH:mm:ssXXX')
      console.log(`Requesting data from topic: ${topic}`);
      if (deletecache == 1) {
        await Cache.DeleteCacheData(topic);
      }
      var data: any = await Cache.GetCacheData(topic);
      if (data) {
        var dataObject: any = data;
        var getdataFrom = 'Cache';
      } else if (!data) {
        var data = await this.mqttService.getDataFromTopic(topic);
        if (!data) {
          var dataObjects: any = {
            // เพิ่ม timestamp เป็น field แรก
            timestamp: timestamp,
            temperature: [],
            contRelay1: [],
            actRelay1: [],
            fan1: [],
            overFan1: [],
            contRelay2: [],
            actRelay2: [],
            fan2: [],
            overFan2: [],
          };
          res.status(200).json({
            statusCode: 200,
            code: 200,
            query: query,
            payload: dataObjects,
            mqttdata: {},
            status: 0,
            message: `Please specify topic..`,
            message_th: `กรุณาระบุ topic..`,
          });
          return;
        }
        //  var InpuDatacache: any = {keycache: `${topic}`,time: 10,data: data};
        //  await Cache.SetCacheData(InpuDatacache);
        var getdataFrom = 'MQTT';
        var mqttdata = await this.mqttService.getDataFromTopic(topic);
        const parts = mqttdata.split(',');
        const dataObject = {
          // เพิ่ม timestamp เป็น field แรก
          mqtt_dada: topic,
          timestamp: timestamp,
          temperature: parseFloat(parts[0]),
          contRelay1: parseInt(parts[1]),
          actRelay1: parseInt(parts[2]),
          fan1: parseInt(parts[3]),
          overFan1: parseInt(parts[4]),
          contRelay2: parseInt(parts[5]),
          actRelay2: parseInt(parts[6]),
          fan2: parseInt(parts[7]),
          overFan2: parseInt(parts[8]),
        };
        var InpuDatacache: any = {
          keycache: `${topic}`,
          time: 5,
          data: dataObject,
        };
        await Cache.SetCacheData(InpuDatacache);
      }
      res.status(200).json({
        statusCode: 200,
        code: 200,
        query: query,
        topic: topic,
        payload: dataObject,
        mqttdata: mqttdata,
        getdataFrom: getdataFrom,
        status: 1,
        message: `Message successfully Get to topic: ${query.topic}`,
        message_th: `Message successfully Get to topic: ${query.topic}`,
      });
      return;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('device')
  async DeviceData(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    if (!query.topic) {
      res.status(200).json({
        statuscode: 200,
        code: 400,
        payload: null,
        message: 'topic is null.',
        message_th: 'ไม่พบข้อมูล topic ',
      });
      return;
    }
    const deletecache: any = query.deletecache;
    let filter: any = {};
    filter.mqtt_data_value = query.topic;
    console.log(`filter =>` + filter);
    console.info(filter);
    var mqttdata = await this.mqttService.getdevicedata(query.topic);
    // var ResultData: any = await this.settingsService.device_lists(filter);

    /***************************************/
    var kaycache1: any = 'get_device_' + md5(query.topic);
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var ResultData: any = await Cache.GetCacheData(kaycache1);
    if (!ResultData) {
      var ResultData: any = await this.settingsService.device_lists(filter);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 5,
        data: ResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/

    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      const arraydata: any = {
        device_id: ResultData[key].device_id,
        type_id: ResultData[key].type_id,
        device_name: ResultData[key].device_name,
        type_name: ResultData[key].type_name,
        location_name: ResultData[key].location_name,
        timestamp: mqttdata['payload']['timestamp'],
        temperature_value: mqttdata['payload']['temperature'],
        status_warning: ResultData[key].status_warning,
        recovery_warning: ResultData[key].recovery_warning,
        status_alert: ResultData[key].status_alert,
        recovery_alert: ResultData[key].recovery_alert,
        time_life: ResultData[key].time_life,
        mqtt_data_value: ResultData[key].mqtt_data_value,
        mqtt_data_control: ResultData[key].mqtt_data_control,
        mqtt_control_on: ResultData[key].mqtt_control_on,
        control_on:
          'mqtt/control?topic=' +
          ResultData[key].mqtt_data_control +
          '&message=' +
          ResultData[key].mqtt_control_on,
        mqtt_control_off: ResultData[key].mqtt_control_off,
        control_off:
          'mqtt/control?topic=' +
          ResultData[key].mqtt_data_control +
          '&message=' +
          ResultData[key].mqtt_control_off,
        measurement: ResultData[key].measurement,
        mqtt_name: ResultData[key].mqtt_name,
        mqtt_org: ResultData[key].mqtt_org,
        mqtt_bucket: ResultData[key].mqtt_bucket,
        mqtt_envavorment: ResultData[key].mqtt_envavorment,
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
      tempData2.push(arraydata);
    }
    //http://localhost:3003/v1/mqtt/control?topic=BAACTW02/CONTROL&message=1

    var Rsdata: any = {
      statusCode: mqttdata['statusCode'],
      code: mqttdata['code'],
      topic: mqttdata['topic'],
      timestamp: mqttdata['payload']['timestamp'],
      data: mqttdata['payload'],
      dataFrom: mqttdata['getdataFrom'],
      payload: tempData2,
      //"mqtt":mqttdata,
    };
    res.status(200).json(Rsdata);
    return;
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('control')
  async device_control_data(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var topic: any = query.topic;
    var message: any = query.message;
    if (!topic) {
      res
        .status(200)
        .json(
          this.createErrorResponse('Topic is required', 'กรุณาระบุ topic', 400),
        );
      return;
    }

    if (!message) {
      res
        .status(200)
        .json(
          this.createErrorResponse('Message is required', 'กรุณาระบุ message', 400),
        );
      return;
    }
    var topic_send: any = encodeURI(topic);
    var message_send: any = encodeURI(message);
    if (
      message_send == 1 ||
      message_send == 'on' ||
      message_send == 'ON' ||
      message_send == 'a1' ||
      message_send == 'a1' ||
      message_send == 'b1' ||
      message_send == 'c1' ||
      message_send == 'd1' ||
      message_send == 'e1' ||
      message_send == 'f1' ||
      message_send == 'g1'
    ) {
      var message_control: any = 'ON';
    } else {
      var message_control: any = 'OFF';
    }
    var data = await this.mqttService.devicecontrol(topic_send, message_send);
    //var data: any = await this.mqttService.devicecontrols(topic_send, message_send,message_control);
    res.status(200).json(data);
    return;
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('_getdata2')
  async _device_get_data2(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    var topic: any = query.topic;
    var message: any = query.message;
    if (!topic) {
            res.status(200).json(this.createErrorResponse(
                'Topic is required',
                'กรุณาระบุ topic',
                400
            ));
            return;
    }
    var data = await this.mqttService.getDataFromTopic(topic);
    var parts: any = data.split(',');
    res.status(200).json({
      statuscode: 200,
      code: 200,
      message: 'mqtt topic ' + topic,
      message_th: 'mqtt topic ' + topic,
      payload: { data: data, parts: parts },
    });
    return;
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('getdata')
  async device_get_data(
        @Res() res: Response,
        @Body() dto: any,
        @Query() query: any,
        @Headers() headers: any,
        @Param() params: any,
        @Req() req: any,
    ) {
        const topic = query.topic;
        
        if (!topic) {
            res.status(200).json(this.createErrorResponse(
                'Topic is required',
                'กรุณาระบุ topic',
                400
            ));
            return;
        }
        
        try {
            const data = await this.mqttService.getDataFromTopic(topic);
            const parts = data ? data.split(',') : [];
            
            res.status(200).json({
                statusCode: 200,
                code: 200,
                message: `MQTT data from topic: ${topic}`,
                message_th: `ข้อมูล MQTT จาก topic: ${topic}`,
                payload: { data: data, parts: parts },
            });
        } catch (error) {
            this.logger.error(`Get data error: ${error.message}`);
            res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: null,
                message: 'Failed to get data from topic',
                message_th: 'ไม่สามารถดึงข้อมูลจาก topic ได้',
                error: error.message,
            });
        }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('sensercharts')
  async sensercharts(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-8m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '8m'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '8m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_start_to_end_v1_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 120,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/

    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_start_to_end_v2_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_start_to_end_v3_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
      });
      return;
    }
  }

  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('airsenserchartsV1')
  async airsenserchartsV1(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    ///////////////////////////
    var datenow: any = format.getCurrentDatenow();
    var timenow: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    ///////////////////////////
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    var timePart = [
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
        var inputCreate: any = {
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
      var inputCreate: any = {
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
    ///////////////////////////
    var start: any = query.start || '-8m';
    var stop: any = query.stop || 'now()';
    var windowPeriod: any = query.windowPeriod || '8m'; // Example: 1h, 5m, 24h
    var tzString: any = query.tzString || 'Asia/Bangkok';
    var bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    var measurement: any = query.measurement;
    if (!measurement) {
      var measurement: any = 'temperature';
    }
    var field: any = query.field || 'value';
    var time: any = query.time || '8m';
    var limit: any = query.limit || 120;
    var offset: any = query.offset || 0;
    var mean: any = query.mean || 'last'; //  mean median  last  now
    var Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_start_to_end_v1_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 120,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_start_to_end_v2_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_start_to_end_v3_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any =
      'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'AIR Bucket data is null',
        message_th: 'AIR Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        var temperature: any = mqttdata['payload']['temperature'];
        if (!temperature) {
          var temperature: any = '25.10';
        }
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: temperature, //mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          data, // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        data: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        device: ArrayData,
      });
      return;
    }
  }
  /////////////////////////////////////
  /////////////////////////////////////
  // http://172.25.99.10:3003/v1/mqtt/airsensercharts?bucket=AIR4
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('airsensercharts')
  async airsensercharts(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    ///////////////////////////
    var datenow: any = format.getCurrentDatenow();
    var timenow: any = format.getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    ///////////////////////////
    var datePart = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ].join('-');
    // จัดรูปแบบเวลา HH:MM:SS
    var timePart = [
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
        var inputCreate: any = {
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
      var inputCreate: any = {
        name: 'Mqtt Not connect',
        statusmqtt: +checkConnectionMqtt?.status,
        msg: 'Error ' + checkConnectionMqtt?.msg,
        device_id: 0,
        type_id: 0,
        device_name: 0,
        date: format.getCurrentDatenow(),
        time: format.getCurrentTimenow(),
        data: 'Error' + checkConnectionMqtt?.msg,
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
    ///////////////////////////
    var start: any = query.start || '-8m';
    var stop: any = query.stop || 'now()';
    var windowPeriod: any = query.windowPeriod || '8m'; // Example: 1h, 5m, 24h
    var tzString: any = query.tzString || 'Asia/Bangkok';
    var bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    var measurement: any = query.measurement;
    if (!measurement) {
      var measurement: any = 'temperature';
    }
    if (!measurement) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'temperature  is null',
        message_th: 'temperature  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    var field: any = query.field || 'value';
    var time: any = query.time || '8m';
    var limit: any = query.limit || 120;
    var offset: any = query.offset || 0;
    var mean: any = query.mean || 'last'; //  mean median  last  now
    var Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_start_to_end_v1_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 120,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    // JSON.payload[0].measurement
    if (data[0].measurement) {
      var temperature: any = data[0].measurement;
    }
    ///////////////////////////////////////
    if (!temperature) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'temperature  is null',
        message_th: 'temperature  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    ///////////////////////////////////////
    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_start_to_end_v2_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_start_to_end_v3_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any =
      'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'AIR Bucket data is null',
        message_th: 'AIR Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata: any = await this.mqttService.getdevicedata(
          mqtt_data_value,
        );
        // ใช้ optional chaining เช็คค่า temperature และตั้ง default '25.10' หากไม่มีค่า
        var temperature: any = mqttdata?.payload.temperature || '25.10';
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata?.payload?.timestamp || null,
          temperature_value: temperature,
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata?.payload?.mqtt_dada || null,
          contRelay1: mqttdata?.payload?.contRelay1 || null,
          actRelay1: mqttdata?.payload?.actRelay1 || null,
          contRelay2: mqttdata?.payload?.contRelay2 || null,
          actRelay2: mqttdata?.payload?.actRelay2 || null,
          /****************************/
          fan1: mqttdata?.payload?.fan1 || null,
          overFan1: mqttdata?.payload?.overFan1 || null,
          fan2: mqttdata?.payload?.fan2 || null,
          overFan2: mqttdata?.payload?.overFan2 || null,
          data, // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        data: deviceData,
        mqtt: mqttdata?.payload || {},
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        device: ArrayData,
      });
      return;
    }
  }
  /////////////////////////////////////
  /////////////////////////////////////
  // http://172.25.99.10:3003/v1/mqtt/mqttsensercharts?bucket=AIR1
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('mqttsenserchartsv1')
  async mqttsenserchartsv1(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-2m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any =
      'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'AIR Bucket data is null',
        message_th: 'AIR Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        var temperature: any = mqttdata['payload']['temperature'];
        if (!temperature) {
          var temperature: any = '25.10';
        }
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: temperature, //mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        device: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '2m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_air_mqtt_senser_chart_v1_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 300,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    var kaycache2: any =
      'get_air_mqtt_senser_chart_v2_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    var kaycache3: any =
      'get_air_mqtt_senser_chart_v3_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'get air mqtt senser chart',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        datamqtt: ArrayData,
        //mqtt_name
        mqtt_name: ArrayData['0']['mqtt_name'],
        org: ArrayData['0']['org'],
        mqtt: ArrayData['0']['mqtt'],
      });
      return;
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('senserchart')
  async senserchart(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    try {
      ////////////////
      const start: any = query.start || '-1m';
      const stop: any = query.stop || 'now()';
      const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
      const tzString: any = query.tzString || 'Asia/Bangkok';
      const bucket: any = query.bucket; // BAACTW02
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          message: 'Bucket  is null',
          message_th: 'Bucket  is null',
          status: 0,
          payload: {},
        });
        return;
      }
      const measurement: any = query.measurement || 'temperature';
      const field: any = query.field || 'value';
      const time: any = query.time || '1m';
      const limit: any = query.limit || 20;
      const offset: any = query.offset || 0;
      const mean: any = query.mean || 'last'; //  mean median  last  now
      const Dtos: any = {
        start: start,
        stop: stop,
        windowPeriod: windowPeriod,
        tzString: tzString,
        bucket: bucket,
        measurement: measurement,
        field: field,
        time: time,
        limit: limit,
        offset: offset,
        mean: mean,
      };
      // console.log('Dtos=>');
      console.info(Dtos);
      // var data: any = await this.IotService.influxdbFilterData(Dtos);
      var deletecache: any = query.deletecache;
      /***************************************/
      var kaycache1: any =
        'get_startend_v1_' +
        md5(
          start +
            stop +
            windowPeriod +
            tzString +
            bucket +
            measurement +
            field +
            time +
            limit +
            offset +
            mean,
        );
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache1);
      }
      var data: any = await Cache.GetCacheData(kaycache1);
      if (!data) {
        var data: any = await this.IotService.influxdbFilterData(Dtos);
        var InpuDatacache: any = {
          keycache: `${kaycache1}`,
          time: 120,
          data: data,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      /***************************************/
      //let data: any =await this.IotService.getSenser(Dtos);
      const Dtos2: any = {
        start: start,
        stop: stop,
        windowPeriod: windowPeriod,
        tzString: tzString,
        bucket: bucket,
        measurement: measurement,
        field: field,
        time: time,
        limit: limit,
        offset: offset,
        mean: mean,
      };
      // console.log('Dtos=>');
      console.info(Dtos2);
      // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      /***************************************/
      var kaycache2: any =
        'get_startend_v2_' +
        md5(
          start +
            stop +
            windowPeriod +
            tzString +
            bucket +
            measurement +
            field +
            time +
            limit +
            offset +
            mean,
        );
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache2);
      }
      var data1: any = await Cache.GetCacheData(kaycache2);
      if (!data1) {
        var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
        var InpuDatacache: any = {
          keycache: `${kaycache2}`,
          time: 120,
          data: data1,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      // if(!data1){
      //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      // }
      /***************************************/

      //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
      /***************************************/
      var kaycache3: any =
        'get_startend_v3_' +
        md5(
          start +
            stop +
            windowPeriod +
            tzString +
            bucket +
            measurement +
            field +
            time +
            limit +
            offset +
            mean,
        );
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache3);
      }
      var data2: any = await Cache.GetCacheData(kaycache3);
      if (!data2) {
        var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
        var InpuDatacache: any = {
          keycache: `${kaycache3}`,
          time: 120,
          data: data2,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      /***************************************/
      if (!data) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          message: 'OK',
          status: 0,
          //, query:query
          field: field,
          payload: {
            // "bucket": bucket,
            // "result": "now",
            // "table": 0,
            // "start": "2025-01-00:00:00:00",
            // "stop": "2025-01-00:00:00:00",
            time: '2025-01-00:00:00:00',
            value: 0,
            field: field,
            // "measurement": measurement
          },
        });
        return;
      } else {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          message: 'OK',
          status: 1,
          //, query:query
          bucket: data[0].bucket,
          field: data[0].field,
          payload: data[0],
          chart: { data: data1, date: data2 },
          name: data[0].field,
          cache: cache_data,
        });
        return;
      }
      ////////////////
    } catch (error) {
      ////////////////
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: {},
        message: 'Internal server error 500',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
    ////////////////
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('mqttsenserchart22')
  async mqttsenserchart22(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-2m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'Bucket data is null',
        message_th: 'Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var Resultate: any = await this.mqttService.mqtt_list_paginate_active(
      filter,
    );
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var ResultDatadevice: any = await this.settingsService.device_lists(
        filter2,
      );
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        device: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }

    /******************/
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '2m';
    const limit: any = query.limit || 50;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    var data: any = await this.IotService.influxdbFilterData(Dtos);
    /***************************************/

    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_mqtt_senser_chart_v2_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_mqtt_senser_chart_v3_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        datamqtt: ArrayData,
        //mqtt_name
        mqtt_name: ArrayData['0']['mqtt_name'],
        org: ArrayData['0']['org'],
        mqtt: ArrayData['0']['mqtt'],
      });
      return;
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('mqttsenserchart')
  async mqttsenserchartcache(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-2m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any =
      'mqtt_senser_chart_status_fan_' + status + '_bucket_' + bucket;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_fan(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'Bucket data is null',
        message_th: 'Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any = 'mqtt_bucket_fan_' + Resultate[key].bucket;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        var temperature: any = mqttdata['payload']['temperature'];
        if (!temperature) {
          var temperature: any = '25.10';
        }
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: temperature, //mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        device: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }

    /******************/
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '2m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_mqtt_senser_chart_v1_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 300,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/

    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_mqtt_senser_chart_v2_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_mqtt_senser_chart_v3_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        datamqtt: ArrayData,
        //mqtt_name
        mqtt_name: ArrayData['0']['mqtt_name'],
        org: ArrayData['0']['org'],
        mqtt: ArrayData['0']['mqtt'],
      });
      return;
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('mqttsenserchartair')
  async mqttsenserchartaircache(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-2m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    var location_id: any = query.location_id; // BAACTW02
    if (!location_id) {
      var location_id: any = 5;
    }
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    bucket;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    filter.location_id = location_id;
    var kaycache: any =
      'mqtt_senser_chart_status_air_' +
      status +
      '_bucket_' +
      bucket +
      '_location_id_' +
      location_id;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active_air(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'Bucket data is null',
        message_th: 'Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    let ArrayData = [];
    for (const [key, va] of Object.entries(Resultate)) {
      /****************************/
      let filter2: any = {};
      filter2.bucket = Resultate[key].bucket;
      filter2.location_id = location_id;
      console.log(`filter2 =>` + filter2);
      console.info(filter2);
      var kaycache_cache: any =
        'mqtt_bucket_air_' +
        Resultate[key].bucket +
        '_location_id_' +
        location_id;
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
      if (!ResultDatadevice) {
        var ResultDatadevice: any = await this.settingsService.device_air_lists(
          filter2,
        );
        var InpuDatacache: any = {
          keycache: `${kaycache_cache}`,
          time: 300,
          data: ResultDatadevice,
        };
        await Cache.SetCacheData(InpuDatacache);
        var cache_data_2: any = 'no cache';
      } else {
        var cache_data_2: any = 'cache';
      }
      console.log(
        '------------------------ResultDatadevice-----api---------------------',
      );
      console.info(ResultDatadevice);
      console.log(
        '------------------------ResultDatadevice-----Start---------------------',
      );
      console.info(ResultDatadevice);
      console.log(
        '------------------------ResultDatadevice-----End---------------------',
      );
      /***************/
      let deviceData = [];
      for (const [key2, va] of Object.entries(ResultDatadevice)) {
        var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
        var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
        var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
        var temperature: any = mqttdata['payload']['temperature'];
        if (!temperature) {
          var temperature: any = '25.10';
        }
        const arraydata: any = {
          device_id: ResultDatadevice[key2].device_id,
          type_id: ResultDatadevice[key2].type_id,
          device_name: ResultDatadevice[key2].device_name,
          type_name: ResultDatadevice[key2].type_name,
          timestamp: mqttdata['payload']['timestamp'],
          temperature_value: temperature, //mqttdata['payload']['temperature'],
          status_warning: ResultDatadevice[key2].status_warning,
          recovery_warning: ResultDatadevice[key2].recovery_warning,
          status_alert: ResultDatadevice[key2].status_alert,
          recovery_alert: ResultDatadevice[key2].recovery_alert,
          time_life: ResultDatadevice[key2].time_life,
          mqtt_data_value: mqtt_data_value,
          mqtt_data_control: mqtt_data_control,
          mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
          control_on:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_on,
          mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
          control_off:
            'mqtt/control?topic=' +
            ResultDatadevice[key2].mqtt_data_control +
            '&message=' +
            ResultDatadevice[key2].mqtt_control_off,
          //measurement: ResultDatadevice[key2].measurement,
          location_name: ResultDatadevice[key2].location_name,
          mqtt_name: ResultDatadevice[key2].mqtt_name,
          //mqtt_org: ResultDatadevice[key2].mqtt_org,
          mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
          // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
          mqtt_dada: mqttdata['payload']['mqtt_dada'],
          contRelay1: mqttdata['payload']['contRelay1'],
          actRelay1: mqttdata['payload']['actRelay1'],
          contRelay2: mqttdata['payload']['contRelay2'],
          actRelay2: mqttdata['payload']['actRelay2'],
          /****************************/
          fan1: mqttdata['payload']['fan1'],
          overFan1: mqttdata['payload']['overFan1'],
          fan2: mqttdata['payload']['fan2'],
          overFan2: mqttdata['payload']['overFan2'],
          // filter2:filter2,
          // mqttdata: mqttdata['payload'],
        };
        deviceData.push(arraydata);
      }
      /*************************/
      const arraydata: any = {
        mqtt_id: Resultate[key].mqtt_id,
        mqtt_name: Resultate[key].mqtt_name,
        cache: cache_data,
        cache2: cache_data_2,
        device: deviceData,
        mqtt: mqttdata['payload'],
        // mqtt_type_id: Resultate[key].mqtt_type_id,
        // type_name: Resultate[key].type_name,
        org: Resultate[key].org,
        bucket: Resultate[key].bucket,
        // envavorment: Resultate[key].envavorment,
        // sort: Resultate[key].sort,
        status: Resultate[key].status,
      };
      ArrayData.push(arraydata);
    }

    /******************/
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '2m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_mqtt_senser_chart_air_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 300,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/

    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_mqtt_senser_chart_air_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_mqtt_senser_chart_v3_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 0,
        //, query:query
        field: field,
        payload: {
          // "bucket": bucket,
          // "result": "now",
          // "table": 0,
          // "start": "2025-01-00:00:00:00",
          // "stop": "2025-01-00:00:00:00",
          time: '2025-01-00:00:00:00',
          value: 0,
          field: field,
          // "measurement": measurement
        },
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'OK',
        status: 1,
        //, query:query
        bucket: data[0].bucket,
        field: data[0].field,
        payload: data[0],
        chart: { data: data1, date: data2 },
        name: data[0].field,
        cache: cache_data,
        datamqtt: ArrayData,
        //mqtt_name
        mqtt_name: ArrayData['0']['mqtt_name'],
        org: ArrayData['0']['org'],
        mqtt: ArrayData['0']['mqtt'],
      });
      return;
    }
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('mqttsenserchartv2')
  async mqttsenserchartcachev2(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const start: any = query.start || '-2m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '15s'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Bucket  is null',
        message_th: 'Bucket  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    /*******************/
    let filter: any = {};
    var status: any = query.status;
    if (!status) {
      var status: any = 1;
    }
    var deletecache: any = query.deletecache;
    filter.status = status;
    filter.bucket = bucket;
    var kaycache: any =
      'mqtt_sensers_chartv2_status_' + status + '_bucket_' + bucket;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache);
    }
    var Resultate: any = await Cache.GetCacheData(kaycache);
    if (!Resultate) {
      var Resultate: any = await this.mqttService.mqtt_list_paginate_active(
        filter,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache}`,
        time: 300,
        data: Resultate,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    console.log('Resultate=>');
    console.info(Resultate);
    if (Resultate == '') {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        message: 'Bucket data is null',
        message_th: 'Bucket data is null',
        status: 0,
        payload: {},
      });
      return;
    }
    var buckets: any = Resultate['0']['bucket'];
    /****************************/
    let filters: any = {};
    filters.bucket = buckets;
    console.log(`filter2 =>` + filters);
    console.info(filters);
    var kaycache_cache: any = 'mqtt_sensers_v2_bucket_' + buckets;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache_cache);
    }
    var ResultDatadevice: any = await Cache.GetCacheData(kaycache_cache);
    if (!ResultDatadevice) {
      var ResultDatadevice: any = await this.settingsService.device_lists(
        filters,
      );
      var InpuDatacache: any = {
        keycache: `${kaycache_cache}`,
        time: 300,
        data: ResultDatadevice,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data_2: any = 'no cache';
    } else {
      var cache_data_2: any = 'cache';
    }
    /****************************/
    var mqtt_data_value: any = ResultDatadevice['0'].mqtt_data_value;
    var mqtt_data_control: any = ResultDatadevice['0'].mqtt_data_control;
    var location_id: any = ResultDatadevice['0'].location_id;
    var location_name: any = ResultDatadevice['0'].location_name;
    /****************************/
    var mqttrs: any = await this.mqttService.getdevicedataAll(mqtt_data_value);
    var mqtt_data: any = mqttrs['data'];
    var mqtt_timestamp: any = mqttrs['timestamp'];
    var mqtt_topic: any = mqttrs['topic'];
    /****************************/
    var configdata: any = ResultDatadevice['0'].configdata;
    var obj: any = [];
    try {
      var obj: any = JSON.parse(configdata);
    } catch (e) {
      //console.error("Failed to parse JSON:", configdata);
      throw e;
    }
    var mqtt_objt_data = Object.values(obj);
    /***********************/
    const result_mqtt = Object.fromEntries(
      mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]),
    );
    console.log(result_mqtt);
    /********************/

    /******************/
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '2m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'get_mqttData_chart_v1_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 120,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/

    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'get_mqttData_chart_v2_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    // if(!data1){
    //         var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    // }
    /***************************************/

    //var -0-p: any = await this.IotService.influxdbFilterchart2(Dtos2);
    /***************************************/
    var kaycache3: any =
      'get_mqttData_chart_v3_' +
      start +
      stop +
      windowPeriod +
      tzString +
      bucket +
      measurement +
      field +
      time +
      limit +
      offset +
      mean;
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }

    var deviceData = [];
    /////////////////////////////////////////////////
    for (const [key2, va] of Object.entries(ResultDatadevice)) {
      var mqtt_data_value: any = ResultDatadevice[key2].mqtt_data_value;
      var mqtt_data_control: any = ResultDatadevice[key2].mqtt_data_control;
      const arraydata: any = {
        /*  
                                        sn 
                                        period
                                        work_status 
                                        model
                                        vendor
                                        comparevalue
                                        unit
                                        mqtt_id
                                        oid
                                        action_id
                                        status_alert_id 
                                        org
                                        bucket 
                              */
        device_id: ResultDatadevice[key2].device_id,
        location_id: ResultDatadevice[key2].location_id,
        setting_id: ResultDatadevice[key2].setting_id,
        type_id: ResultDatadevice[key2].type_id,
        device_name: ResultDatadevice[key2].device_name,
        type_name: ResultDatadevice[key2].type_name,
        status_warning: ResultDatadevice[key2].status_warning,
        recovery_warning: ResultDatadevice[key2].recovery_warning,
        status_alert: ResultDatadevice[key2].status_alert,
        recovery_alert: ResultDatadevice[key2].recovery_alert,
        status: ResultDatadevice[key2].status,
        max: ResultDatadevice[key2].max,
        min: ResultDatadevice[key2].min,
        hardware_id: ResultDatadevice[key2].hardware_id,
        comparevalue: ResultDatadevice[key2].comparevalue,
        unit: ResultDatadevice[key2].unit,
        measurement: ResultDatadevice[key2].measurement,
        time_life: ResultDatadevice[key2].time_life,
        mqtt_data_value: mqtt_data_value,
        mqtt_data_control: mqtt_data_control,
        mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
        control_on:
          'mqtt/control?topic=' +
          ResultDatadevice[key2].mqtt_data_control +
          '&message=' +
          ResultDatadevice[key2].mqtt_control_on,
        mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
        control_off:
          'mqtt/control?topic=' +
          ResultDatadevice[key2].mqtt_data_control +
          '&message=' +
          ResultDatadevice[key2].mqtt_control_off,
        location_name: ResultDatadevice[key2].location_name,
        mqtt_name: ResultDatadevice[key2].mqtt_name,
        //mqtt_org: ResultDatadevice[key2].mqtt_org,
        mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
        // mqtt_envavorment: ResultDatadevice[key2].mqtt_envavorment,
        timestamp: mqtt_timestamp,
        mqtt_device_name: ResultDatadevice[key2].mqtt_device_name,
        mqtt_status_over_name: ResultDatadevice[key2].mqtt_status_over_name,
        mqtt_status_data_name: ResultDatadevice[key2].mqtt_status_data_name,
        mqtt_act_relay_name: ResultDatadevice[key2].mqtt_act_relay_name,
        mqtt_control_relay_name: ResultDatadevice[key2].mqtt_control_relay_name,
        value_data: ResultDatadevice[key2].mqtt_device_name,
        value_alarm: ResultDatadevice[key2].mqtt_status_over_name,
        value_relay: ResultDatadevice[key2].mqtt_act_relay_name,
        value_control_relay: ResultDatadevice[key2].mqtt_control_relay_name,
      };
      deviceData.push(arraydata);
    }
    /////////////////////////////////////////////////
    const mergedData = format.mapMqttDataToDevices(deviceData, result_mqtt);
    // รวมข้อมูลแต่ละ index เข้าด้วยกัน
    const combinedArray = mergedData.map((data, index) => ({
      ...deviceData[index],
      ...data,
    }));
    res.status(200).json({
      code: 200,
      location_id: location_id,
      location_name: location_name,
      // configdata:configdata,
      // mqtt_data:mqtt_data,
      // mqtt_objt_data:mqtt_objt_data,
      // devices:ResultDatadevice,
      // mergedData:mergedData,
      bucket: buckets,
      mqtt_topic: mqtt_topic,
      timestamp: mqtt_timestamp,
      mqtt: result_mqtt,
      device: combinedArray,
      mqtt_name: Resultate[0]['mqtt_name'],
      org: Resultate[0]['org'],
      Resultate: Resultate,
      mqtt_data_value: mqtt_data_value,
      mqtt_data_control: mqtt_data_control,
      field: data[0].field,
      payload: data[0],
      chart: { data: data1, date: data2 },
    });
    return;
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqtttest')
  async deviceactivemqtttest(
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
      var cachetimeset: any = 3600;
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
          ResultDataRS.push(arraydata);
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
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqttappv1')
  async deviceactivemqttappv1(
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
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var arraydataMain: any = [];
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
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: { topic },
            message: 'check  Mqtt topic ' + topic,
            message_th: 'check Mqtt topic',
          });
          return;
          ////////////////////////////////////////////////
          const mqttrs: any = await this.mqttService.getDataTopicCacheData(
            topic,
          );
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: { topic, mqttrs },
            message: 'check  Mqtt topic',
            message_th: 'check Mqtt topic',
          });
          return;
          ////////////////////////////////////////////////
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
        }
      }
      // devicesensor// deviceio
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          cache: cache_data_ResultData,
          checkConnectionMqtt,
          devicesensor: devicesensor,
          deviceio: deviceio,
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
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicelistcontrols')
  async devicelistcontrols(
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
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var arraydataMain: any = [];
      var devicecontrol: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_name = rs.mqtt_name;
          var mqtt_org = rs.mqtt_org;
          var mqtt_bucket = rs.mqtt_bucket;
          var mqtt_envavorment = rs.mqtt_envavorment;
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              device_name,
              mqtt_name,
              mqtt_bucket,
              mqtt_org,
              mqtt_envavorment,
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
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            devicecontrol.push(arraydata);
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
        }
      }
      // devicesensor// deviceio
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          cache: cache_data_ResultData,
          checkConnectionMqtt,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
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
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqttapp')
  async deviceactivemqttapp(
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
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var device_id = rs.device_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            devicecontrol.push(arraydata);
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
        }
      }
      // devicesensor// deviceio
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          cache: cache_data_ResultData,
          checkConnectionMqtt,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
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
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqttt')
  async deviceactivemqttt(
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
      //////////////////////
      var cachetimeset: any = 3600;
      var deletecache: any = query.deletecache;
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          payload: bucket,
          message: 'bucket inull',
          message_th: 'check bucket inull',
        });
      }
      //////////////////////
      var status: any = query.status;
      if (!status) {
        var status: any = 1;
      }
      var filterMain: any = {};
      var deletecache: any = query.deletecache;
      filterMain.status = status;
      filterMain.bucket = bucket;
      var kaycache: any = md5(
        'mqtt_status_device_actives_' + status + '_bucket_' + bucket,
      );
      console.log(`filterMain=`);
      console.info(filterMain);
      ////////////////////
      var ResultDataMainArr: any = [];
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache);
      }
      var ResultDataMainArr: any = await Cache.GetCacheData(kaycache);
      if (ResultDataMainArr) {
        var cache_data_ResultData: any = 'cache';
        var ResultDataMainArr: any = ResultDataMainArr;
      } else {
        var rs: any = await this.settingsService.mqtt_filter(filterMain);
        var ResultDataMainArr: any = rs['0'];
        var rs: any = {
          keycache: `${kaycache}`,
          time: cachetimeset,
          data: ResultDataMainArr,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      if (ResultDataMainArr) {
        var ResultDataMainArrRS: any = {
          mqtt_id: ResultDataMainArr.mqtt_id,
          location_id: ResultDataMainArr.location_id,
          mqtt_type_id: ResultDataMainArr.mqtt_type_id,
          mqtt_name: ResultDataMainArr.mqtt_name,
          location_name: ResultDataMainArr.location_name,
          bucket: ResultDataMainArr.bucket,
          org: ResultDataMainArr.org,
        };
      } else {
        var ResultDataMainArrRS: any = [];
      }
      //////////////////////
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
      var ResultDataRSMain: any = [];
      var ResultDataRS: any = [];
      var arraydataMain: any = [];
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
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
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
          const mqttrs: any = await this.mqttService.getDataFromTopic(topic);
          // const mqttrs: any = await this.mqttService.getDataTopic(topic);
          // const mqttrs: any = await this.mqttService.getDataTopicMqtt(topic);
          // const mqttrs: any = await this.mqttService.getDataTopicCacheData(topic);
          // res.status(200).json({
          //         statuscode: 200,
          //         code: 200,
          //         Mqttstatus,
          //         payload: mqttrs,
          //         message: 'mqttrs',
          //         message_th: 'mqttrs',
          //       });
          // return
          if (mqttrs) {
            // var mqttstatus: any = mqttrs.status;
            // var mqttdata: any = mqttrs.msg;
            var mqttstatus: any = mqttrs;
            var mqttdata: any = mqttrs;
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            if (main_type_id == 1) {
              var arraydataMain: any = {
                device_id,
                type_id,
                mqtt_name,
                mqtt_org,
                mqtt_bucket,
                mqtt_envavorment,
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
              ResultDataRSMain.push(arraydataMain);
            } else {
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
              ResultDataRS.push(arraydata);
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
            var arraydataMain: any = [];
            var arraydata: any = [];
          }
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          maindata: ResultDataMainArrRS,
          devicesensor: ResultDataRSMain,
          deviceio: ResultDataRS,
        },
        message: 'check Connection Status deviceactivemqttt',
        message_th: 'check Connection Status deviceactivemqttt',
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
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('deviceactivemqtttalarm')
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
      var tempData2: any = [];
      var cachekey = 'device_list_alarm_air' + md5(filter2alarm);
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
      var kaycache: any = 'devicealarmallss_' + filterkeymd5;
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
            filter.status_warning = Number(0);
            filter.status_alert = Number(0);
            filter.recovery_warning = Number(1);
            filter.recovery_alert = Number(1);
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
  @HttpCode(200)
  // @AuthUserRequired()
  @Get('listdevicepageactivess')
  @ApiOperation({ summary: 'list device page active' })
  async device_list_paginate_actives_sss(
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
        time: 300,
        data: rowResultData,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    if (
      rowResultData === '' ||
      !rowResultData ||
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
        keycache: `${kaycache}`,
        time: 300,
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
      var mqtt_count: any = mqtt_obj2_data.length;
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
  // Helper method for parsing MQTT data
  private async parseMqttData(mqttdata: string): Promise<any> {
        try {
            // Implement your MQTT data parsing logic here
            const data = mqttdata.split(',').map(item => parseFloat(item.trim()) || 0);
            return { data: data };
        } catch (error) {
            this.logger.error(`Parse MQTT data error: ${error.message}`);
            return { data: [] };
        }
  }
    
  async parseData2(dataString: any) {
    const parts = dataString.split(',');
    return {
      device: parts[0],
      name: parseFloat(parts[1]),
      data: parts,
    };
  }

  private async devicemoniiterRSS(query: any): Promise<any> {
    try {
      var sort: any = query.sort;
      var keyword: any = query.keyword || '';
      var location_id: any = query.location_id;
      var type_name: any = query.type_name || '';
      var device_id: any = query.device_id || '';
      var mqtt_id: any = query.mqtt_id || '';
      var type_id: any = query.type_id || '';
      var org: any = query.org || '';
      var bucket: any = query.bucket || '';
      var status: any = query.status;
      var option: any = 1;
      var filter: any = {};
      filter.sort = sort;
      filter.keyword = keyword || '';
      filter.location_id = location_id;
      filter.type_name = type_name || '';
      filter.device_id = device_id || '';
      filter.mqtt_id = mqtt_id || '';
      filter.type_id = type_id || '';
      filter.org = org || '';
      filter.bucket = bucket || '';
      filter.status = status || 1;
      filter.option = option;
      console.log(`filter=`);
      console.info(filter);
      //return filter;
      const deletecache: any = query.deletecache || 0;
      var cachekey =
        'device_moniiter_RSS_air_' +
        md5(
          sort +
            keyword +
            location_id +
            type_name +
            device_id +
            mqtt_id +
            type_id +
            org +
            bucket +
            status +
            option,
        );
      //  return {filter,cachekey};
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
      /////////////////////////////////////////
      if (deletecache == 1) {
        await Cache.DeleteCacheData(cachekey);
      }
      var ResultData: any = await Cache.GetCacheData(cachekey);
      if (!ResultData) {
        var ResultData: any =
          await this.settingsService.device_list_ststus_alarm_airss(filter);
        var rss: any = { keycache: `${cachekey}`, time: 3600, data: ResultData };
        await Cache.SetCacheData(rss);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      if (ResultData) {
        var mqtt_data_value: any = ResultData['0'].mqtt_data_value; /////////
        var mqtt_data_control: any = ResultData['0'].mqtt_data_control; /////////
      } else {
        return { status: 0, msg: 'Errior' };
      }
      // var mqttdatas = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var mqttdata:any = await this.mqttService.getdMqttdataTopics(mqtt_data_value);
      // return {mqtt_data_value,mqtt_data_control,mqttdata};
      /////////////////////////////////////////
      let tempData = [];
      for (var [key, va] of Object.entries(ResultData)) {
        var rs: any = ResultData[key];
        var evice_id: any = rs.evice_id;
        var data_status: any = rs.data_status;
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
        var mqtt_data_value: any = rs.mqtt_data_value; /////////
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
          filter.status_warning = Number(0);
          filter.status_alert = Number(0);
          filter.recovery_warning = Number(1);
          filter.recovery_alert = Number(1);
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

        if (data_status == 1) {
          var DataRs: any = {
            cachekey,
            cache_data,
            device_id: rs.device_id,
            //configdata,
            //mqttdata_arr,
            //mqttData_count,
            //mqttData,
            //merged_data,
            //merged,
            //setting_id: rs.setting_id,
            mqtt_id: rs.mqtt_id,
            mqtt_name: rs.mqtt_name,
            type_id: rs.type_id,
            type_name: rs.type_name,
            location_name: rs.location_name,
            devicename: rs.device_name,
            value_data,
            value_data_msg: value_data_msg,
            value_alarm,
            value_alarm_msg,
            value_relay,
            value_control_relay,
            subject,
            data_status,
            status,
            status_report: {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            },
            timestamp,
            date,
            time,
            createddate,
            location_id: rs.location_id,
            main_type_id,
            mqtt: {
              mqttdata,
              bucket: rs.mqtt_bucket,
              sensor_data_name,
              mqtt_org: rs.mqtt_org,
              data: data,
              mqtt_device_name: mqtt_device_name,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
            },
            control_on:
              'mqtt/control?topic=' +
              mqtt_data_control +
              '&message=' +
              mqtt_control_on,
            control_off:
              'mqtt/control?topic=' +
              mqtt_data_control +
              '&message=' +
              mqtt_control_off,
            //updateddate,
            //getAlarmDetails,
            // main_max,
            // main_min,
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
      }
      return tempData2;
    } catch (error) {
              this.logger.error(`Device monitor error: ${error.message}`);
              return [];
    }
  } 
  

  private async devicemoniiterRSSFan(query: any): Promise<any> {
    try {
      var sort: any = query.sort;
      var keyword: any = query.keyword || '';
      var location_id: any = query.location_id;
      var type_name: any = query.type_name || '';
      var device_id: any = query.device_id || '';
      var mqtt_id: any = query.mqtt_id || '';
      var type_id: any = query.type_id || '';
      var org: any = query.org || '';
      var bucket: any = query.bucket || '';
      var status: any = query.status;
      var option: any = 1;
      var filter: any = {};
      filter.sort = sort;
      filter.keyword = keyword || '';
      filter.location_id = location_id;
      filter.type_name = type_name || '';
      filter.device_id = device_id || '';
      filter.mqtt_id = mqtt_id || '';
      filter.type_id = type_id || '';
      filter.org = org || '';
      filter.bucket = bucket || '';
      filter.status = status || 1;
      filter.option = option;
      console.log(`filter=`);
      console.info(filter);
      //return filter;
      const deletecache: any = query.deletecache || 0;
      var cachekey =
        'device_moniiter_RSS_FAN_' +
        md5(
          sort +
            keyword +
            location_id +
            type_name +
            device_id +
            mqtt_id +
            type_id +
            org +
            bucket +
            status +
            option,
        );
      //  return {filter,cachekey};
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
      /////////////////////////////////////////
      if (deletecache == 1) {
        await Cache.DeleteCacheData(cachekey);
      }
      var ResultData: any = await Cache.GetCacheData(cachekey);
      if (!ResultData) {
        var ResultData: any =
          await this.settingsService.device_list_ststus_alarm_fanss(filter);
        var rss: any = {
          keycache: `${cachekey}`,
          time: 3600,
          data: ResultData,
        };
        await Cache.SetCacheData(rss);
        var cache_data: any = 'no cache';
      } else {
        var cache_data: any = 'cache';
      }
      //return {deletecache,cachekey,ResultData};
      /////////////////////////////////////////
      if (ResultData) {
        var mqtt_data_value: any = ResultData['0'].mqtt_data_value; /////////
        var mqtt_data_control: any = ResultData['0'].mqtt_data_control; /////////
      } else {
        return { status: 0, msg: 'Errior' };
      }
      // var mqttdatas :any = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
      var mqttdata: any = await this.mqttService.getdMqttdataTopics(
        mqtt_data_value,
      );
      // return {mqtt_data_value,mqtt_data_control,mqttdata};
      /////////////////////////////////////////
      let tempData = [];
      for (var [key, va] of Object.entries(ResultData)) {
        var rs: any = ResultData[key];
        var evice_id: any = rs.evice_id;
        var data_status: any = rs.data_status;
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
        //var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
        //var mqttdata = await this.mqttService.getdMqttdataTopics(mqtt_data_value);
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
          filter.status_warning = Number(0);
          filter.status_alert = Number(0);
          filter.recovery_warning = Number(1);
          filter.recovery_alert = Number(1);
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

        if (data_status == 1) {
          var DataRs: any = {
            cachekey,
            cache_data,
            device_id: rs.device_id,
            //configdata,
            //mqttdata_arr,
            //mqttData_count,
            //mqttData,
            //merged_data,
            //merged,
            //setting_id: rs.setting_id,
            mqtt_id: rs.mqtt_id,
            mqtt_name: rs.mqtt_name,
            type_id: rs.type_id,
            type_name: rs.type_name,
            location_name: rs.location_name,
            devicename: rs.device_name,
            value_data,
            value_data_msg: value_data_msg,
            value_alarm,
            value_alarm_msg,
            value_relay,
            value_control_relay,
            subject,
            data_status,
            status,
            status_report: {
              1: 'Warning',
              2: 'Alarm',
              3: 'Recovery Warning',
              4: 'Recovery Alarm',
              5: 'Normal',
            },
            timestamp,
            date,
            time,
            createddate,
            location_id: rs.location_id,
            main_type_id,
            mqtt: {
              mqttdata,
              bucket: rs.mqtt_bucket,
              sensor_data_name,
              mqtt_org: rs.mqtt_org,
              data: data,
              mqtt_device_name: mqtt_device_name,
              status_warning,
              status_alert,
              recovery_warning,
              recovery_alert,
              mqtt_data_value,
              mqtt_data_control,
              mqtt_control_on,
              mqtt_control_off,
            },
            control_on:
              'mqtt/control?topic=' +
              mqtt_data_control +
              '&message=' +
              mqtt_control_on,
            control_off:
              'mqtt/control?topic=' +
              mqtt_data_control +
              '&message=' +
              mqtt_control_off,
            //updateddate,
            //getAlarmDetails,
            // main_max,
            // main_min,
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
      }
      return tempData2;
    } catch (error) {
            this.logger.error(`Fan device monitor error: ${error.message}`);
            return [];
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicemqttappcharttest')
  async devicemqttappcharttest(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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
      // var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);

          ////////////////////////////////////////////////////////////////////////
          // fast
          //var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(topic);
          // slow
          var mqttrs: any = await this.mqttService.getMqttTopicPA(
            topic,
            deletecache,
          );
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }
          /*
                        {
                            "case": 1,
                            "status": 1,
                            "msg": "AIR1,32.87,1,1,1,1,0,1,0,1,1,0,0,1",
                            "fromCache": true,
                            "time": 30,
                            "timestamp": "2025-09-30 10:33:41"
                        }
                      */
          // return res.status(200).json({
          //         statusCode: 200,
          //         code: 200,
          //         payload: mqttrs,
          //         message: 'subscribeToTopicWithResponse topic '+topic,
          //         message_th: 'rss',
          //   });
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
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
              mqtt_id,
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
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
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
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Throttle(
    { default: { ttl: 20000, limit: 100 } },
    //{ default: { ttl: 60000, limit: 10 } }, // สั้น
    //{ long: { ttl: 60000, limit: 100 } }    // ยาว
  )
  @Get('devicemqttappchartair')
  async devicemqttappchartair(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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
      //var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];

      // res.status(200).json({ statuscode: 200,payload: {msg:'arraydataMain',checkConnectionMqtt,Mqttstatus,cache_data_ResultData,ResultData} });

      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);
          ////////////////////////////////////////////////////////////////////////
          // fast
          //var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(topic);
          // cache
          // var mqttrs: any = await this.mqttService.getMqttTopic(topic,deletecache);
          // slow
          var mqttrs: any = await this.mqttService.getMqttTopicPA1(
            topic,
            deletecache,
          );
          // slow
          //var mqttrs: any = await this.mqttService.getDataTopic(topic,deletecache);
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }

          //  res.status(200).json({  statuscode: 200,payload: {msg:'mqttrs',checkConnectionMqtt,Mqttstatus,mqttrs,ResultData}});

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
            var merged2Mode: any = format.mapMqttDataToDeviceALLMode(
              [va],
              mqttData,
            );
            var active: any = 1;
            var cachetimeset: any = 300;
            /****************************/
            //  res.status(200).json({  statuscode: 200,payload: {msg:'mqttdata_arrs',mqttdata_arrs}});
            // var airmod: any = await this.IotService.get_airmod_active(active);
            var kaycache_cache: any = 'airmod_active_keys_' + active;
            var airmod: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airmod: any = await Cache.GetCacheData(kaycache_cache);
            if (airmod) {
              var airmod: any = airmod;
              var cache_data_msg: any = 'cache';
            } else if (!airmod) {
              var airmod: any = await this.IotService.get_airmod_active(active);
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airmod,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            if (airmod) {
              var airmodName: any = airmod.name;
              var airModdata: any = airmod.data;
            } else {
              var airmodName: any = 'auto';
              var airModdata: any = 's';
            }

            /****************************/
            var kaycache_cache: any = 'airwarning_active_keys_' + active;
            var airwarning: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airwarning: any = await Cache.GetCacheData(kaycache_cache);
            if (airwarning) {
              var airwarning: any = airwarning;
              var cache_data_msg: any = 'cache';
            } else if (!airwarning) {
              var airwarning: any = await this.IotService.get_warning_active(
                active,
              );
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airwarning,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            var kaycache_cache: any = 'airperiod_active_keys_' + active;
            var airperiod: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airperiod: any = await Cache.GetCacheData(kaycache_cache);
            if (airperiod) {
              var airperiod: any = airperiod;
              var cache_data_msg: any = 'cache';
            } else if (!airperiod) {
              var airperiod: any = await this.IotService.get_airperiod_active(
                active,
              );
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airperiod,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            var mergedMode: any = merged2Mode;
            if (mergedMode) {
              var warning: any = merged2Mode.warning;
              var period: any = merged2Mode.period;
              var mode: any = merged2Mode.mode;
              var stateair1: any = merged2Mode.stateair1;
              var stateair2: any = merged2Mode.stateair2;
              var air1alarm: any = merged2Mode.air1alarm;
              var air2alarm: any = merged2Mode.stateair2;
            } else {
              var mergedMode: any = 35;
              var period: any = 6;
              var mode: any = 1;
              var stateair1: any = 1;
              var stateair2: any = 1;
              var air1alarm: any = 1;
              var air2alarm: any = 1;
            }
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
              var data: any = Number(value_alarm);
            }
            filter.mqtt_name = mqtt_name;
            filter.device_name = mqtt_device_name;
            filter.action_name = mqtt_name;
            filter.mqtt_control_on = encodeURI(mqtt_control_on);
            filter.mqtt_control_off = encodeURI(mqtt_control_off);
            filter.event = 1;
            filter.unit = unit;

            /****************************/
            var kaycache_cache: any =
              'getAlarmDetailsAlert_keys_' +
              md5(
                main_type_id +
                  value_data +
                  status_warning +
                  status_alert +
                  recovery_warning +
                  recovery_alert +
                  value_alarm +
                  mqtt_name +
                  mqtt_device_name +
                  mqtt_control_on +
                  mqtt_control_off +
                  1 +
                  unit,
              );
            var getAlarmDetails: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var getAlarmDetails: any = await Cache.GetCacheData(kaycache_cache);
            if (getAlarmDetails) {
              var getAlarmDetails: any = getAlarmDetails;
              var cache_data_msg: any = 'cache';
            } else if (!getAlarmDetails) {
              var getAlarmDetails: any =
                await this.settingsService.getAlarmDetailsAlert(filter);
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: getAlarmDetails,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/

            // res.status(200).json({  statuscode: 200,payload: {msg:'mqtt data',airmod,airperiod,mqttdata_arrs,getAlarmDetails}});

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
            const topicss: any = encodeURI(device_bucket + '/CONTROL');
            const msg: any = encodeURI(airModdata);

            // res.status(200).json({
            //           statuscode: 200,
            //           payload: {
            //                 msg:'mqtt data',
            //                 airmod,
            //                 airperiod,
            //                 mqttdata_arrs,
            //                 status,
            //                 sensor_data_name,
            //                 timestamp,
            //                 value_alarm_msg,
            //                 value_data_msg,
            //                 getAlarmDetails
            //           }
            // });

            var arraydata: any = {
              device_id,
              airmod,
              airwarning,
              airperiod,
              mergedMode,
              airmodName,
              airModdata,
              topicss,
              msg,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
              getAlarmDetails,
              mqttrs,
              warning,
              period,
              mode,
              stateair1,
              stateair2,
              air1alarm,
              air2alarm,
            };
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };

            // res.status(200).json({arraydata,arraydatainfo});

            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
            // res.status(200).json({deviceioinfo,devicecontrol})
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
              airmods: '',
              airModdata,
              airwarning: '',
              airperiod: '',
              mergedMode,
              airmodName,
              mqtt_id,
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
              getAlarmDetails,
              mqttrs: 'Error',
              warning,
              period,
              mode,
              stateair1,
              stateair2,
              air1alarm,
              air2alarm,
            };
          }
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
        },
        message: 'check Connection Status Mqtt',
        message_th: 'check Connection Status Mqtt',
      });
      return;
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
      //return
    } finally {
      // Code that always runs
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: null,
        message: 'Mqtt Internal server Cleanup complete',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ Cleanup complete',
      });
      console.log('Cleanup complete');
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicemqttappchartairv1')
  async devicemqttappchartairv1(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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
      //var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];

      // res.status(200).json({ statuscode: 200,payload: {msg:'arraydataMain',checkConnectionMqtt,Mqttstatus,cache_data_ResultData,ResultData} });

      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);
          ////////////////////////////////////////////////////////////////////////
          // fast
          //var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(topic);
          // cache
          // var mqttrs: any = await this.mqttService.getMqttTopic(topic,deletecache);
          // slow
          var mqttrs: any = await this.mqttService.getMqttTopicPA1(
            topic,
            deletecache,
          );
          // slow
          //var mqttrs: any = await this.mqttService.getDataTopic(topic,deletecache);
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }

          //  res.status(200).json({  statuscode: 200,payload: {msg:'mqttrs',checkConnectionMqtt,Mqttstatus,mqttrs,ResultData}});

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
            var merged2Mode: any = format.mapMqttDataToDeviceALLMode(
              [va],
              mqttData,
            );
            var active: any = 1;
            var cachetimeset: any = 300;
            /****************************/
            //  res.status(200).json({  statuscode: 200,payload: {msg:'mqttdata_arrs',mqttdata_arrs}});
            // var airmod: any = await this.IotService.get_airmod_active(active);
            var kaycache_cache: any = 'airmod_active_keys_' + active;
            var airmod: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airmod: any = await Cache.GetCacheData(kaycache_cache);
            if (airmod) {
              var airmod: any = airmod;
              var cache_data_msg: any = 'cache';
            } else if (!airmod) {
              var airmod: any = await this.IotService.get_airmod_active(active);
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airmod,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            if (airmod) {
              var airmodName: any = airmod.name;
              var airModdata: any = airmod.data;
            } else {
              var airmodName: any = 'auto';
              var airModdata: any = 's';
            }

            /****************************/
            var kaycache_cache: any = 'airwarning_active_keys_' + active;
            var airwarning: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airwarning: any = await Cache.GetCacheData(kaycache_cache);
            if (airwarning) {
              var airwarning: any = airwarning;
              var cache_data_msg: any = 'cache';
            } else if (!airwarning) {
              var airwarning: any = await this.IotService.get_warning_active(
                active,
              );
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airwarning,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            var kaycache_cache: any = 'airperiod_active_keys_' + active;
            var airperiod: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var airperiod: any = await Cache.GetCacheData(kaycache_cache);
            if (airperiod) {
              var airperiod: any = airperiod;
              var cache_data_msg: any = 'cache';
            } else if (!airperiod) {
              var airperiod: any = await this.IotService.get_airperiod_active(
                active,
              );
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: airperiod,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/
            var mergedMode: any = merged2Mode;
            if (mergedMode) {
              var warning: any = merged2Mode.warning;
              var period: any = merged2Mode.period;
              var mode: any = merged2Mode.mode;
              var stateair1: any = merged2Mode.stateair1;
              var stateair2: any = merged2Mode.stateair2;
              var air1alarm: any = merged2Mode.air1alarm;
              var air2alarm: any = merged2Mode.stateair2;
            } else {
              var mergedMode: any = 35;
              var period: any = 6;
              var mode: any = 1;
              var stateair1: any = 1;
              var stateair2: any = 1;
              var air1alarm: any = 1;
              var air2alarm: any = 1;
            }
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
              var data: any = Number(value_alarm);
            }
            filter.mqtt_name = mqtt_name;
            filter.device_name = mqtt_device_name;
            filter.action_name = mqtt_name;
            filter.mqtt_control_on = encodeURI(mqtt_control_on);
            filter.mqtt_control_off = encodeURI(mqtt_control_off);
            filter.event = 1;
            filter.unit = unit;

            /****************************/
            var kaycache_cache: any =
              'getAlarmDetailsAlert_keys_' +
              md5(
                main_type_id +
                  value_data +
                  status_warning +
                  status_alert +
                  recovery_warning +
                  recovery_alert +
                  value_alarm +
                  mqtt_name +
                  mqtt_device_name +
                  mqtt_control_on +
                  mqtt_control_off +
                  1 +
                  unit,
              );
            var getAlarmDetails: any = {};
            if (deletecache == 1) {
              await Cache.DeleteCacheData(kaycache_cache);
            }
            var getAlarmDetails: any = await Cache.GetCacheData(kaycache_cache);
            if (getAlarmDetails) {
              var getAlarmDetails: any = getAlarmDetails;
              var cache_data_msg: any = 'cache';
            } else if (!getAlarmDetails) {
              var getAlarmDetails: any =
                await this.settingsService.getAlarmDetailsAlert(filter);
              var rs: any = {
                keycache: `${kaycache_cache}`,
                time: cachetimeset,
                data: getAlarmDetails,
              };
              await Cache.SetCacheData(rs);
              var cache_data_msg: any = 'no cache';
            }
            /****************************/

            // res.status(200).json({  statuscode: 200,payload: {msg:'mqtt data',airmod,airperiod,mqttdata_arrs,getAlarmDetails}});

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
            const topicss: any = encodeURI(device_bucket + '/CONTROL');
            const msg: any = encodeURI(airModdata);

            // res.status(200).json({
            //           statuscode: 200,
            //           payload: {
            //                 msg:'mqtt data',
            //                 airmod,
            //                 airperiod,
            //                 mqttdata_arrs,
            //                 status,
            //                 sensor_data_name,
            //                 timestamp,
            //                 value_alarm_msg,
            //                 value_data_msg,
            //                 getAlarmDetails
            //           }
            // });

            var arraydata: any = {
              device_id,
              airmod,
              airwarning,
              airperiod,
              mergedMode,
              airmodName,
              airModdata,
              topicss,
              msg,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
              getAlarmDetails,
              mqttrs,
              warning,
              period,
              mode,
              stateair1,
              stateair2,
              air1alarm,
              air2alarm,
            };
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };

            // res.status(200).json({arraydata,arraydatainfo});

            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
            // res.status(200).json({deviceioinfo,devicecontrol})
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
              airmods: '',
              airModdata,
              airwarning: '',
              airperiod: '',
              mergedMode,
              airmodName,
              mqtt_id,
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
              getAlarmDetails,
              mqttrs: 'Error',
              warning,
              period,
              mode,
              stateair1,
              stateair2,
              air1alarm,
              air2alarm,
            };
          }
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
        },
        message: 'check Connection Status Mqtt',
        message_th: 'check Connection Status Mqtt',
      });
      return;
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
      //return
    } finally {
      // Code that always runs
      res.status(200).json({
        statusCode: 200,
        code: 200,
        payload: null,
        message: 'Mqtt Internal server Cleanup complete',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ Cleanup complete',
      });
      console.log('Cleanup complete');
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicemqttappchart')
  async devicemqttappchart(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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
      //var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];

      // res.status(200).json({ statuscode: 200,payload: {checkConnectionMqtt,Mqttstatus,cache_data_ResultData,ResultData} });

      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);

          ////////////////////////////////////////////////////////////////////////
          // fast
          //var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(topic);
          // cache
          // var mqttrs: any = await this.mqttService.getMqttTopic(topic,deletecache);
          // slow
          var mqttrs: any = await this.mqttService.getMqttTopicPA1(
            topic,
            deletecache,
          );
          // slow
          //res.status(200).json({ statuscode: 200,payload: {checkConnectionMqtt,timestamps,topic,deletecache,Mqttstatus,mqttrs,cache_data_ResultData,ResultData} });
          //var mqttrs: any = await this.mqttService.getDataTopic(topic,deletecache);
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }

          /*
                        {
                            "case": 1,
                            "status": 1,
                            "msg": "AIR1,32.87,1,1,1,1,0,1,0,1,1,0,0,1",
                            "fromCache": true,
                            "time": 30,
                            "timestamp": "2025-09-30 10:33:41"
                        }
                      */
          // return res.status(200).json({
          //         statusCode: 200,
          //         code: 200,
          //         payload: mqttrs,
          //         message: 'subscribeToTopicWithResponse topic '+topic,
          //         message_th: 'rss',
          //   });
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
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
              mqtt_id,
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
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
        },
        message: 'check Connection Status Mqtt',
        message_th: 'check Connection Status Mqtt',
      });
      return;
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
      return;
    }
  }
  /////////////////////////////////////
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicemqttappcharts')
  async devicemqttappcharts(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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
      // var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);

          ////////////////////////////////////////////////////////////////////////
          // fast
          //var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(topic);
          // cache
          // var mqttrs: any = await this.mqttService.getMqttTopic(topic,deletecache);
          // slow
          // var mqttrs: any = await this.mqttService.getMqttTopicPA1(topic,deletecache);
          // slow
          var mqttrs: any = await this.mqttService.getDataTopicdevicemqtt(
            topic,
            deletecache,
          );
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }
          /*
                        {
                            "case": 1,
                            "status": 1,
                            "msg": "AIR1,32.87,1,1,1,1,0,1,0,1,1,0,0,1",
                            "fromCache": true,
                            "time": 30,
                            "timestamp": "2025-09-30 10:33:41"
                        }
                      */
          // return res.status(200).json({
          //         statusCode: 200,
          //         code: 200,
          //         payload: mqttrs,
          //         message: 'subscribeToTopicWithResponse topic '+topic,
          //         message_th: 'rss',
          //   });
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
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
              mqtt_id,
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
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
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
  ///////////////////////////////////// 
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicemqttappchartV2')
  async devicemqttappchartV2(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
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

      // var UrlMqtts:any = 'mqtt://broker.mmm.com:1883';//process.env.MQTT_HOSTs;
      // var checkConnectionMqtts:any = await this.mqttService.initializeMqttClient(UrlMqtts);
      // res.status(200).json({
      //             statuscode: 200,
      //             code: 200,
      //             UrlMqtts: UrlMqtts,
      //             playload:checkConnectionMqtts,
      //           });

      var timestamps: any = datePart + ' ' + timePart;
      // var UrlMqtt:any = process.env.MQTT_HOST;
      var checkConnectionMqtt: any =
        await this.mqttService.checkConnectionStatusMqtt();
      //var checkConnectionMqtt:any = await this.mqttService.initializeMqttClient(UrlMqtt);
      //var publishMessage:any = await this.mqttService.publishMessage('test/topic', { message: 'Hello MQTT' });
      // ตรวจสอบสถานะ
      //const Mqttstatus:any = await this.mqttService.getDetailedConnectionStatus();
      //console.log('Connection Mqtt:status:', Mqttstatus);
      // เมื่อไม่ต้องการใช้งานแล้ว
      // return res.status(200).json({
      //   statusCode: 200,
      //   payload: {publishMessage,checkConnectionMqtt},
      // });
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
      } else {
        var Mqttstatus: any = false;
      }
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }
      if (query.keyword) {
        filterchart.keyword = query.keyword;
      }
      if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }
      if (query.bucket) {
        filterchart.bucket = query.bucket;
      }
      if (query.type_id) {
        filterchart.type_id = query.type_id;
      }
      filterchart.deletecache = query.deletecache;
      filterchart.bucket = query.bucket;
      var senser_chart: any = await this.senser_chart(filterchart);
      var cachetimeset: any = 3600;
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
      //////////////////////   api_url
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
      var devicesensor: any = [];
      var deviceio: any = [];
      var deviceioinfo: any = [];
      var devicecontrol: any = [];
      var arraydataMain: any = [];
      if (ResultData) {
        for (const [key, value] of Object.entries(ResultData)) {
          var va: any = ResultData[key];
          var rs: any = ResultData[key];
          var mqtt_id = rs.mqtt_id;
          var setting_id = rs.setting_id;
          var device_name = rs.device_name;
          var device_id = rs.device_id;
          var type_id = rs.type_id;
          var hardware_id = rs.hardware_id;
          var mqtt_name: any = rs.mqtt_name;
          var mqtt_org: any = rs.mqtt_org;
          var mqtt_bucket: any = rs.mqtt_bucket;
          var mqtt_envavorment: any = rs.mqtt_envavorment;
          //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment,
          var device_name = rs.device_name;
          var mqtt_data_value = rs.mqtt_data_value;
          var mqtt_data_control = rs.mqtt_data_control;
          var mqtt_control_on = rs.mqtt_control_on;
          var mqtt_control_off = rs.mqtt_control_off;
          var device_org = rs.device_org;
          var device_bucket = rs.device_bucket;
          var evice_id: any = rs.evice_id;
          var data_status: any = rs.data_status;
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
          var topic: any = encodeURI(mqtt_data_value);

          ////////////////////////////////////////////////////////////////////////
          /* 
                      var mqttrs: any = await this.mqttService.subscribeToTopicWithResponse(topic); 
                      var mqttrs: any = await this.mqttService.getDataTopics(topic);  
                      var mqttrs: any = await this.mqttService.getDataFromTopic(topic); 
                      var mqttrs: any = await this.mqttService.getDataTopicCacheData(topic); 
                      var mqttrs: any = await this.mqttService.getMqttTopicData(topic); 
                      var mqttrs: any = await this.mqttService.getDataTopicCache(topic);  
                      */
          ////////////////////////////////////////////////////////////////////////
          // fast
          var mqttrs: any = await this.mqttService.getDataTopicCacheDataMqtt(
            topic,
          );
          // slow
          //var mqttrs: any = await this.mqttService.getMqttTopic(topic,deletecache);
          var timestampMqtt: any = mqttrs.timestamp;
          if (timestampMqtt) {
            var timestamps: any = timestampMqtt;
          }
          /*
                        {
                            "case": 1,
                            "status": 1,
                            "msg": "AIR1,32.87,1,1,1,1,0,1,0,1,1,0,0,1",
                            "fromCache": true,
                            "time": 30,
                            "timestamp": "2025-09-30 10:33:41"
                        }
                      */
          // return res.status(200).json({
          //         statusCode: 200,
          //         code: 200,
          //         payload: mqttrs,
          //         message: 'subscribeToTopicWithResponse topic '+topic,
          //         message_th: 'rss',
          //   });
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
              filter.status_warning = Number(0);
              filter.status_alert = Number(0);
              filter.recovery_warning = Number(1);
              filter.recovery_alert = Number(1);
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
            var arraydata: any = {
              device_id,
              type_id,
              mqtt_id,
              main_type_id,
              mqtt_name,
              mqtt_org,
              mqtt_bucket,
              mqtt_envavorment,
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
            var arraydatainfo: any = {
              device_id,
              type_id,
              status,
              device_name,
              timestamp,
              subject,
              value_data,
              dataAlarm,
              eventControl,
              value_data_msg,
            };
            if (type_id == 1) {
              devicesensor.push(arraydata);
            } else if (type_id > 1) {
              deviceio.push(arraydata);
            }
            deviceioinfo.push(arraydatainfo);
            devicecontrol.push(arraydata);
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
              mqtt_id,
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
        }
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: {
          checkConnectionMqtt,
          mqttrs,
          mqttname: mqtt_name,
          bucket: mqtt_bucket,
          time: timestamp,
          mqttdata,
          deviceioinfo: deviceioinfo,
          devicesensor: devicesensor,
          deviceio: deviceio,
          devicecontrol: devicecontrol,
          cache: cache_data_ResultData,
          chart: senser_chart,
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
  // http://172.25.99.60:3003/v1/mqtt/devicechart?bucket=BAACTW01&measurement=&limit=500&start=2026-01-29:18:59:18&stop=2026-01-31:18:59:18
  // http://172.25.99.60:3003/v1/mqtt/devicechart?bucket=BAACTW01&measurement=&limit=500&start=2026-01-29T10:00:00Z&stop=2026-01-30T10:00:00Z
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('devicechart')
  async devicechart(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var bucket: any = query.bucket;
      if (!bucket) {
        res.status(200).json({
          statuscode: 200,
          code: 200, 
          payload: {},
          message: 'bucket is null',
          message_th: 'bucket is null',
        });
        return;
      }
      var date: any = format.getCurrentDatenow();
      var time: any = format.getCurrentTimenow();
      var now = new Date();
      var pad = (num) => String(num).padStart(2, '0');
      var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),  
        pad(now.getDate()),
      ].join('-'); 
      const timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join(':'); 

      var timestamps: any = datePart + ' ' + timePart;  
      var deletecache: any = query.deletecache;
      var filterchart: any = {};
      if (filterchart.device_id) {
        filterchart.device_id = query.device_id;
      }if (query.keyword) {
        filterchart.keyword = query.keyword;
      }if (query.mqtt_id) {
        filterchart.mqtt_id = query.mqtt_id;
      }if (query.type_id) {
        filterchart.type_id = query.type_id;
      } 
      filterchart.deletecache = query.deletecache;
      if (query.bucket) {
        filterchart.bucket = query.bucket || 'BAACTW01';
      }if (query.measurement) {
        filterchart.measurement = query.measurement || 'temperature';
      }if (query.start) {
        filterchart.start = query.start;
      }if (query.stop) {
        filterchart.stop = query.stop;
      }if (query.time) {
        filterchart.time = query.time;
      }if (query.limit) {
        filterchart.limit = query.limit;
      }if (query.offset) {
        filterchart.offset = query.offset;
      }if (query.mean) {
        filterchart.mean = query.mean;
      } 
      var senser_chart: any = await this.senser_chart_filter(filterchart); 
      res.status(200).json({
            statuscode: 200,
            code: 200, 
            payload: senser_chart, 
            message: 'senser_chart',
            message_th: 'senser_chart',
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
  async senser_chart(query: any) {
    const start: any = query.start || '-8m';
    const stop: any = query.stop || 'now()';
    const windowPeriod: any = query.windowPeriod || '8m'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      var DataRs: any = 'Bucket  is null';
      return DataRs;
    }
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '8m';
    const limit: any = query.limit || 120;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos);
    // var data: any = await this.IotService.influxdbFilterData(Dtos);
    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'senser_chart_start_to_end_v1_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 120,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    //let data: any =await this.IotService.getSenser(Dtos);
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos2);
    // let data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
    /***************************************/
    var kaycache2: any =
      'senser_chart_start_to_end_v2_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    var kaycache3: any =
      'senser_chart_start_to_end_v3_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      var rss: any = {
        bucket: bucket,
        result: 'now',
        table: 0,
        start: '2025-01-00:00:00:00',
        stop: '2025-01-00:00:00:00',
        time: '2025-01-00:00:00:00',
        value: 0,
        field: field,
      };
      return rss;
    } else {
      var rss: any = {
        bucket: data[0].bucket,
        field: data[0].field,
        info: data[0],
        data: data1,
        date: data2,
        name: data[0].field,
        cache: cache_data,
      };
      return rss;
    }
  }
  async senser_chart_filter(query: any) {
    var start: any = query.start;
    var stop: any = query.stop;
    if(!start){
      var start: any = '-30d';
    } if(!stop){
      var stop: any = 'now()';
    } 
    
    var starts: any = format.parseCustomFormat(start);
    var start: any = starts.toISOString();
    var stops: any = format.parseCustomFormat(stop);
    var stop: any = stops.toISOString();
    const windowPeriod: any = query.windowPeriod || '30d'; // Example: 1h, 5m, 24h
    const tzString: any = query.tzString || 'Asia/Bangkok';
    const bucket: any = query.bucket; // BAACTW02
    if (!bucket) {
      var DataRs: any = 'Bucket  is null';
      return DataRs;
    }
    const measurement: any = query.measurement || 'temperature';
    const field: any = query.field || 'value';
    const time: any = query.time || '30d';
    const limit: any = query.limit || 3600;
    const offset: any = query.offset || 0;
    const mean: any = query.mean || 'last'; //  mean median  last  now
    const Dtos: any = {
      query,
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    // console.log('Dtos=>');
    console.info(Dtos); 
    return Dtos;

    var deletecache: any = query.deletecache;
    /***************************************/
    var kaycache1: any =
      'senser_chart_filter_start_to_end_1_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache1);
    }
    var data: any = await Cache.GetCacheData(kaycache1);
    if (!data) {
      var data: any = await this.IotService.influxdbFilterData(Dtos);
      var InpuDatacache: any = {
        keycache: `${kaycache1}`,
        time: 60,
        data: data,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/ 
    const Dtos2: any = {
      start: start,
      stop: stop,
      windowPeriod: windowPeriod,
      tzString: tzString,
      bucket: bucket,
      measurement: measurement,
      field: field,
      time: time,
      limit: limit,
      offset: offset,
      mean: mean,
    };
    console.log('Dtos=>');
    console.info(Dtos2); 
    /***************************************/
    var kaycache2: any =
      'senser_chart_filter_start_to_end_2_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache2);
    }
    var data1: any = await Cache.GetCacheData(kaycache2);
    if (!data1) {
      var data1: any = await this.IotService.influxdbFilterchart1(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache2}`,
        time: 120,
        data: data1,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    var kaycache3: any =
      'senser_chart_filter_start_to_end_3_' +
      md5(
        start +
          stop +
          windowPeriod +
          tzString +
          bucket +
          measurement +
          field +
          time +
          limit +
          offset +
          mean,
      );
    if (deletecache == 1) {
      await Cache.DeleteCacheData(kaycache3);
    }
    var data2: any = await Cache.GetCacheData(kaycache3);
    if (!data2) {
      var data2: any = await this.IotService.influxdbFilterchart2(Dtos2);
      var InpuDatacache: any = {
        keycache: `${kaycache3}`,
        time: 120,
        data: data2,
      };
      await Cache.SetCacheData(InpuDatacache);
      var cache_data: any = 'no cache';
    } else {
      var cache_data: any = 'cache';
    }
    /***************************************/
    if (!data) {
      var rss: any = {
        bucket: bucket,
        result: 'now',
        table: 0,
        start: '2025-01-00:00:00:00',
        stop: '2025-01-00:00:00:00',
        time: '2025-01-00:00:00:00',
        value: 0,
        field: field,
      };
      return rss;
    } else {
      var rss: any = {
        bucket: data[0].bucket,
        field: data[0].field,
        info: data[0],
        data: data1,
        date: data2,
        name: data[0].field,
        cache: cache_data,
      };
      return rss;
    }
  }
  /////////////////////////////////////
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
      var filter: any = [];
      filter.host_name = host_name;
      filter.sort = sort;
      filter.device_id = device_id;
      filter.schedule_id = schedule_id;
      filter.page = page;
      filter.pageSize = pageSize;
      filter.sort = sort;
      filter.keyword = keyword;
      filter.devicecontrol = devicecontrol;
      filter.type_id = query.type_id;
      filter.org = query.org;
      filter.bucket = query.org;
      filter.type_name = query.type_name;
      filter.host = query.host;
      filter.port = query.port;
      filter.password = query.query;
      filter.createddate = query.createddate;
      filter.updateddate = query.updateddate;
      filter.status = query.status || 1;
      filter.ipaddress = query.ipaddress;
      filter.location_id = query.location_id;
      filter.isCount = 1;
      var rowResultData: any = await this.settingsService.scheduleprocess(filter);
      if (!rowResultData) {
        return res.status(200).json({
                        statuscode: 200,
                        host_name,
                        payload: filter,
                        message: 'Data schedule proces is null.',
                        message_th: 'ไม่พบข้อมูล schedule proces.',
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
          '/v1/mqtt/control?topic=' +
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
        var event_control = 'OFF';
        if (event == 1) {
          var event_control = 'ON';
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
        filter: filter2,
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
  ///////
} 
// var mqttrs: any = await this.mqttService.
// http://172.25.99.60:3003/v1/mqtt/devicemqttappchart?bucket=AIR1
// var mqtt_name:any=rs.mqtt_name;
// var mqtt_org:any=rs.mqtt_org;
// var mqtt_bucket:any=rs.mqtt_bucket; 
// var mqtt_envavorment:any=rs.mqtt_envavorment;
// //mqtt_name,mqtt_org,mqtt_bucket,mqtt_envavorment, 