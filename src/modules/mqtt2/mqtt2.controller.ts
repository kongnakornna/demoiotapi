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
  Inject,
  Logger,
} from '@nestjs/common';
// import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
// import { Gpio } from 'onoff';
var isOn: any = false;
var intervalId;
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response, NextFunction } from 'express';
import { Public } from '@src/modules/auth/auth.decorator';
var moment = require('moment');
import 'dotenv/config';
var tzString = process.env.tzString;
var connectUrl_mqtt: any =
  process.env.MQTT_HOST2;
if (!connectUrl_mqtt) {
  var connectUrl_mqtt: any = process.env.MQTT_HOST || 'mqtt://localhost:1883';
}
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
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import { Mqtt2Service } from '@src/modules/mqtt2/mqtt2.service';
import { Mqtt3Service } from '@src/modules/mqtt3/mqtt3.service';
import { CreateMqtt2Dto } from '@src/modules/mqtt2/dto/create-mqtt2.dto';
import { UpdateMqtt2Dto } from '@src/modules/mqtt2/dto/update-mqtt2.dto';
import { IotService } from '@src/modules/iot/iot.service';
import { SettingsService } from '@src/modules/settings/settings.service';
import { UsersService } from '@src/modules/users/users.service';
// import * as cache from '@src/utils/cache/redis.cache';
import * as rediscluster from '@src/utils/cache/rediscluster.cache';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
const cache = new CacheDataOne();
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
//console.log('SECRET_KEY: '+process.env.SECRET_KEY)
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper';
import { redisHelper, cacheDataOne } from '@src/helpers/redis.helper';
import * as iothelper from '@src/helpers/iot.helper';
// วิธีที่ 1: ใช้ Singleton instance
const redis = redisHelper;
var md5 = require('md5');
import 'dotenv/config';
var tzString = process.env.tzString;
// formatInTimeZone(date, tzString, 'yyyy-MM-dd HH:mm:ssXXX')
require('dotenv').config();
var Url_api: any = process.env.API_URL;
import {
  Ctx,
  MessagePattern,
  Payload,
  MqttContext,
} from '@nestjs/microservices';
// DTO for request body validation
class PublishDto {
  topic: string = 'AIR1/CONTROL';
  message: string = '1';
}
@Controller('mqtt2')
export class Mqtt2Controller {
  private readonly logger = new Logger(Mqtt2Controller.name);
  constructor(
    private readonly mqttService: MqttService,
    private readonly mqtt2Service: Mqtt2Service,
    private readonly mqtt3Service: Mqtt3Service,
    private readonly IotService: IotService,
    private UsersService: UsersService,
    private settingsService: SettingsService,
  ) { }
  @MessagePattern('devices/+/status')
  handleDeviceStatus(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.log(`สถานะอุปกรณ์จาก Topic: ${context.getTopic()}`);
    this.logger.log(`ข้อมูลสถานะ: ${JSON.stringify(data)}`);
  }
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get()
  async checkConnectionIndex(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var checkConnectionMqtt: any =
        await this.mqtt2Service.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt2',
            message_th: 'check Connection Status Mqtt2',
          });
          return;
        }
      } else {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt2',
          message_th: 'check Connection Status Mqtt2',
        });
        return;
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: checkConnectionMqtt,
        message: 'check Connection Status Mqtt2',
        message_th: 'check Connection Status Mqtt2',
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
        await this.mqtt2Service.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt2',
            message_th: 'check Connection Status Mqtt2',
          });
          return;
        }
      } else {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt2',
          message_th: 'check Connection Status Mqtt2',
        });
        return;
      }
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        payload: checkConnectionMqtt,
        message: 'check Connection Status Mqtt2',
        message_th: 'check Connection Status Mqtt2',
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
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Get('topic')
  async topic(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Req() req: any,
  ) {
    try {
      var topic: any = query.topic;
      if (!topic) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: null,
          topic,
          message: 'topic is null',
          message_th: 'topic is null',
        });
      }
      var checkConnectionMqtt: any =
        await this.mqtt2Service.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        var Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          res.status(200).json({
            statuscode: 200,
            code: 200,
            Mqttstatus,
            topic,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt2',
            message_th: 'check Connection Status Mqtt2',
          });
          return;
        }
      } else {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'check Connection Status Mqtt2',
          message_th: 'check Connection Status Mqtt2',
        });
        return;
      }
      // http://172.25.99.10:3003/v1/mqtt2/topic?topic=MRMONI05122025V5001/DATA
      // http://172.25.99.10:3003/v1/mqtt2/topic?topic=MRTH15052025I2O1V2001/DATA
      var mqttdata = await this.mqtt2Service.getdMqttdataTopics(topic);
      res.status(200).json({
        statuscode: 200,
        code: 200,
        Mqttstatus,
        topic,
        payload: { checkConnectionMqtt, mqttdata },
        message: 'check Connection Status Mqtt2',
        message_th: 'check Connection Status Mqtt2',
      });
    } catch (error) {
      //console.error('scheduleprocess error:', error);
      return res.status(500).json({
        statusCode: 500,
        code: 500,
        payload: null,
        topic,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      });
    }
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
    if (topic == '') {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'topic  is null',
        message_th: 'topic  is null',
        status: 0,
        payload: {},
      });
      return;
    }
    if (message == '') {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'message  is null',
        message_th: 'message  is null',
        status: 0,
        payload: {},
      });
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
    var data = await this.mqtt2Service.devicecontrol(topic_send, message_send);
    res.status(200).json(data);
    return;
  }
  // http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=CMONBUGKET&hardware_id=&measurement=temperature1
  // http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=CMONBUGKET&hardware_id=1&type_id=8
  // http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=CMONBUGKET&hardware_id=1&type_id=9
  // http://172.25.99.10:3003/v1/mqtt2/devicebucketsgroup?bucket=CMONBUGKET&hardware_id=1&type_id=8
  /****device all *****/
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  // @AuthUserRequired()
  @Get('devicebuckets')
  async devicebuckets(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    const bucket: any = query.bucket;
    const type_id: any = query.type_id;
    const hardware_ids: any = query.hardware_id;
    // const hardware_id: any = 2;
    // 1 = mqtt://b172.25.99.10:1883
    // 2 = mqtt://broker.hivemq.com:1883
    if (!bucket) {
      return res.status(200).json({
        statuscode: 200,
        message: 'bucket is null',
        message_th: 'bucket is null',
        payload: {},
      });
    }
    const date: any = format.getCurrentDatenow();
    const time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num: any) => String(num).padStart(2, '0');
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
    const timestamps: any = datePart + ' ' + timePart;
    try {
      const checkConnectionMqtt: any =
        await this.mqtt2Service.checkConnectionStatusMqtt();
      if (checkConnectionMqtt) {
        const Mqttstatus: any = checkConnectionMqtt.status;
        if (Mqttstatus == 0) {
          return res.status(200).json({
            statuscode: 200,
            Mqttstatus,
            payload: checkConnectionMqtt,
            message: 'check Connection Status Mqtt2',
            message_th: 'check Connection Status Mqtt2',
          });
        }
      }
      const filter: any = {};
      filter.bucket = bucket;
      filter.type_id = type_id;
      filter.hardware_id = hardware_ids;
      const device: any = await this.settingsService.device_lists_id(filter);
      const device_count: any = device.length;
      if (device && device_count > 0) {
        const deviceDataMain1: any = device[0];
        const deviceDataMain: any = deviceDataMain1;
        const topic: any = deviceDataMain1.mqtt_data_value;
        const mqtt_data_control: any = deviceDataMain1.mqtt_data_control;
        const configdata: any = deviceDataMain1.mqtt_status_data_name;
        const device_name: any = deviceDataMain1.device_name;
        const mqttdata: any = await this.mqtt2Service.getdMqttdataTopics(topic);
        let mqttdata_arrs: any;
        let mqttdata_arrs_data: any;
        if (mqttdata) {
          mqttdata_arrs = mqttdata;
          mqttdata_arrs_data = mqttdata.data;
        } else {
          mqttdata_arrs = [];
          mqttdata_arrs_data = [];
        }
        const deviceData: any = [];
        for (const [key, va] of Object.entries(device)) {
          const RSdata: any = {};
          let obj: any = [];
          try {
            obj = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }
          const mqtt_objt_data = Object.values(obj);
          let obj2: any = [];
          try {
            obj2 = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }

          const mqttdata_arr: any = mqttdata_arrs_data;
          const mqtt_obj2_data = Object.values(obj2);
          const mqttData_count: any = mqttdata_arr.length;
          const mqttData = Object.fromEntries(
            mqtt_obj2_data.map((k: any, i: number) => [k, mqttdata_arr[i]]),
          );

          const merged_dataRs: any = format.mapMqttDataToDevices(
            [va],
            mqttData,
          );
          const merged_data: any = merged_dataRs[0];

          const merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          const merged: any = merged2['0'];

          const currentTypeId: any = device[key].type_id;
          const currentHardwareId: any = parseFloat(device[key].hardware_id);

          let value_data: any;
          let value_alarm: any;
          let value_relay: any;
          let value_control_relay: any;
          let status_alert: any;
          let status_warning: any;
          let recovery_warning: any;
          let recovery_alert: any;

          if (merged) {
            if (currentHardwareId > 1) {
              // IO
              value_data = parseFloat(merged.value_data) ?? parseFloat('0');
              value_alarm = parseFloat(merged.value_alarm) ?? parseFloat('0');
              value_relay = parseFloat(merged.value_relay) ?? parseFloat('0');
              value_control_relay =
                parseFloat(merged.value_control_relay) ?? parseFloat('0');
              status_alert =
                parseFloat(device[key].status_alert) ?? parseFloat('0');
              status_warning =
                parseFloat(device[key].status_warning) ?? parseFloat('0');
              recovery_warning =
                parseFloat(device[key].recovery_warning) ?? parseFloat('1');
              recovery_alert =
                parseFloat(device[key].recovery_alert) ?? parseFloat('1');
            } else {
              // Sensor
              value_data = merged.value_data;
              value_alarm = merged.value_alarm;
              value_relay = merged.value_relay;
              value_control_relay = merged.value_control_relay || 0;
              status_alert = device[key].status_alert;
              status_warning = device[key].status_warning;
              recovery_warning = device[key].recovery_warning;
              recovery_alert = device[key].recovery_alert;
            }
          } else {
            if (currentTypeId > 1) {
              // IO
              value_data = parseFloat('0');
              value_alarm = parseFloat('0');
              value_relay = parseFloat('0');
              value_control_relay = parseFloat('0');
              status_alert = parseFloat('0');
              status_warning = parseFloat('0');
              recovery_warning = parseFloat('1');
              recovery_alert = parseFloat('1');
            } else {
              // Sensor
              value_data = parseFloat('0.00');
              value_alarm = parseFloat('0.00');
              value_relay = parseFloat('0.00');
              value_control_relay = parseFloat('0.00');
              status_alert = parseFloat('0');
              status_warning = parseFloat('0');
              recovery_warning = parseFloat('1.00');
              recovery_alert = parseFloat('1.00');
            }
          }
          var unit: any = device[key].unit;
          var topicData: any = device[key].mqtt_data_value;
          var topicControl: any = device[key].mqtt_data_control;
          var control: any = device[key].mqtt_data_control;
          var mqtt_control_on: any = encodeURI(device[key].mqtt_control_on);
          var mqtt_control_off: any = encodeURI(device[key].mqtt_control_off);
          var mqtt_name: any = device[key].mqtt_name;
          var measurement: any = device[key].measurement;
          const filterAlarmValidate: any = {};
          filterAlarmValidate.type_id = currentTypeId;
          filterAlarmValidate.value_data = value_data;
          filterAlarmValidate.unit = unit;
          filterAlarmValidate.value_alarm = value_alarm;
          filterAlarmValidate.value_relay = value_relay;
          filterAlarmValidate.value_control_relay = value_control_relay;
          filterAlarmValidate.sensorValueData = encodeURI(value_data); //sensor
          filterAlarmValidate.status_warning = status_warning;
          filterAlarmValidate.status_alert = status_alert;
          filterAlarmValidate.recovery_warning = recovery_warning;
          filterAlarmValidate.recovery_alert = recovery_alert;
          filterAlarmValidate.device_name = device[key].device_name;
          filterAlarmValidate.mqtt_name = device[key].mqtt_name;
          filterAlarmValidate.action_name = device[key].mqtt_name;
          filterAlarmValidate.mqtt_control_on = mqtt_control_on;
          filterAlarmValidate.mqtt_control_off = mqtt_control_off;
          filterAlarmValidate.event = 1;
          const lang: any = query.lang;
          if (lang == 'th') {
            var getAlarmDetails: any = await iothelper.AlarmDetailValidateTh(
              filterAlarmValidate,
            );
          } else {
            var getAlarmDetails: any = await iothelper.AlarmDetailValidate(
              filterAlarmValidate,
            );
          }
          RSdata.device_id = device[key].device_id;

          if (currentHardwareId == 1) {
            RSdata.device_type = 'Sensor';
          } else {
            RSdata.device_type = 'IO';
          }

          RSdata.hardware_id = currentHardwareId;
          RSdata.type_id = currentTypeId;
          RSdata.type_name = device[key].type_name;
          RSdata.device_name = device[key].device_name;
          // RSdata.value_data = value_data;
          // RSdata.data = value_data;
          // RSdata.fulldata = value_data + ' ' + unit;
          RSdata.mqtt_control_on = mqtt_control_on;
          RSdata.mqtt_control_off = mqtt_control_off;
          RSdata.unit = unit;
          const datasensor = value_data;
          if (currentHardwareId > 1) {
            if (datasensor < 1) {
              RSdata.devicedata = 'OFF';
              RSdata.control =
                Url_api +
                '/v1/mqtt2/control?topic=' +
                topicControl +
                '&message=' +
                mqtt_control_off;
            } else {
              RSdata.devicedata = 'ON';
              RSdata.control =
                Url_api +
                '/v1/mqtt2/control?topic=' +
                topicControl +
                '&message=' +
                mqtt_control_on;
            }
          } else {
            RSdata.control = null;
            RSdata.devicedata = value_data + ' ' + unit;
          }
          RSdata.value_alarm = value_alarm;
          RSdata.value_relay = value_relay;
          RSdata.value_control_relay = value_control_relay;
          RSdata.bucket = device[key].mqtt_bucket;
          RSdata.measurement = device[key].measurement;
          RSdata.org = device[key].mqtt_org;
          RSdata.mqtt_port = device[key].mqtt_port;
          RSdata.alarm_configuration = {
            warning: device[key].status_warning,
            alert: device[key].status_alert,
            recovery_warning: device[key].recovery_warning,
            recovery_alert: device[key].recovery_alert,
          };
          RSdata.alarm_title = getAlarmDetails.title;
          RSdata.alarm_subject = getAlarmDetails.subject;
          RSdata.alarm_alarm_status_set = getAlarmDetails.alarmStatusSet;
          RSdata.alarm_event = getAlarmDetails.event;
          RSdata.alarm_status = getAlarmDetails.status;
          RSdata.sensercharts =
            Url_api +
            '/v1/mqtt2/sensercharts?bucket=' +
            device[key].mqtt_bucket +
            '&measurement=' +
            device[key].measurement;

          deviceData.push(RSdata);
        }
        return res.status(200).json({
          statuscode: 200,
          message: 'Get data Successful..',
          message_th: 'รับข้อมูลสำเร็จ...',
          payload: {
            filter,
            mqtt: checkConnectionMqtt,
            mqttdata,
            bucket,
            device_count,
            device_data: deviceData,
            timestamps,
            //device,
          },
        });
      } else {
        return res.status(200).json({
          statuscode: 200,
          message: 'No devices found',
          message_th: 'ไม่พบอุปกรณ์',
          payload: {
            mqtt: checkConnectionMqtt,
            mqttdata: null,
            bucket,
            device_count: 0,
            device_data: [],
            timestamps,
          },
        });
      }
    } catch (error: any) {
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
  /****device all *****/
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
    const bucket: any = query.bucket; // CMONBUGKET
    const measurement: any = query.measurement; //'temperature1';
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
    if (!measurement) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'measurement  is null',
        message_th: 'measurement  is null',
        status: 0,
        payload: {},
      });
      return;
    }

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
      'mqtt2_get_start_to_end_v1_' +
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
      'mqtt2_get_start_to_end_v2_' +
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
      'mqtt2_get_start_to_end_v3_' +
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
        await this.mqtt2Service.checkConnectionStatusMqtt();
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
      var kaycache_cache: any = 's2_alarmdevicestatus_row_' + filter_md5;
      var row: any = {};
      if (deletecache == 1) {
        await Cache.DeleteCacheData(kaycache_cache);
      }
      var rowResultData: any = await Cache.GetCacheData(kaycache_cache);
      if (rowResultData) {
        var row: any = rowResultData;
      } else if (!rowResultData) {
        var rowResultData: any =
          await this.mqtt2Service.alarm_device_paginate_status(filter);
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
      var kaycache_cache: any = 's2_alarmdevicestatus_rs_' + filter2_md5;
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
          await this.mqtt2Service.alarm_device_paginate_status(filter2);
        var rs: any = {
          keycache: `${kaycache_cache}`,
          time: cachetimeset,
          data: ResultData,
        };
        await Cache.SetCacheData(rs);
        var cache_data_ResultData: any = 'no cache';
      }
      //////////////////////
      //res.status(200).json({ResultData:ResultData});
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
        var kaycachecache: any = 's2_alarmdevice_rs_' + alarm_action_id_master;
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
          //var count_device:number= parseInt(alarmdevice.length);
          var count_device: number = 0;
          if (alarmdevice && Array.isArray(alarmdevice)) {
            count_device = alarmdevice.length;
          }
        } else {
          var count_device: number = parseInt('0');
        }
        alarm_config.count_device = count_device;
        /***************************/
        // return res.status(200).json({message: 'Data  alarmdevice',message_th: 'พบข้อมูล alarmdevice',payload: alarmdevice,});
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
            var mqttrs: any = await this.mqtt2Service.getMqttTopicPA1(
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
            const lang: any = query.lang;
            if (lang == 'th') {
              var getAlarmDetails: any =
                await iothelper.AlarmDetailValidateTh(
                  filterAlarmValidate,
                );
            } else {
              var getAlarmDetails: any =
                await iothelper.AlarmDetailValidate(
                  filterAlarmValidate,
                );
            }
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
  /***************/
  //http://172.25.99.10:3003/v1/mqtt2/monitordevicegroup?bucket=CMONBUGKET
  //http://172.25.99.10:3003/v1/mqtt2/monitordevicegroup?bucket=CMONBUGKET&layout=1&deletecache=1
  @HttpCode(200)
  @ApiOperation({ summary: 'monitordevicegroup' })
  @Get('monitordevicegroup')
  async monitordevicegroup(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    console.log(`query=`);
    console.info(query);
    if (query.bucket == '') {
      return res.status(200).json({
        statuscode: 200,
        payload: [],
        message: 'bucket is null',
        message_th: 'โปรดระบุ bucket',
      });
    }
    // เชื่อมต่ออัตโนมัติ
    await redisHelper.connect();
    // เช็คสถานะการเชื่อมต่อ
    var isConnectedCache = await redisHelper.healthCheck();
    console.log('Redis connected:', isConnectedCache);
    var deletecache: any = query.deletecache;
    const isReady = redisHelper.isReady();
    var option: any = encodeURI(query.option) || 0;
    var bucket: any = encodeURI(query.bucket);
    var hardware_id: any = encodeURI(query.hardware_id) || '';
    var type_id: any = encodeURI(query.type_id) || '';
    var layout: any = query.layout || '';
    var filterMain: any = {};
    filterMain.bucket = bucket;
    var cache_key: any =
      'device_count_monitordevicegroup_' +
      md5(bucket + hardware_id + type_id + layout + query.lang);
    /*****redisHelper cache****/
    var device_count: any = await redisHelper.GetCacheData(cache_key);
    var datacahe_status = 1;
    if (!device_count) {
      var datacahe_status = 0;
      var deviceMain: any = await this.settingsService.device_lists_id(
        filterMain,
      );
      var device_count: any = deviceMain.length;
    }
    if (deletecache == 1) {
      await redisHelper.DeleteCacheData(cache_key);
    }
    var filterSetCacheData: any = {};
    filterSetCacheData.keycache = cache_key;
    filterSetCacheData.time = 60 * 60 * 1;
    filterSetCacheData.data = device_count;
    await redisHelper.SetCacheData(filterSetCacheData);
    /*****redisHelper cache****/

    const checkConnectionMqtt: any =
      await this.mqtt2Service.checkConnectionStatusMqtt();
    if (checkConnectionMqtt) {
      const Mqttstatus: any = checkConnectionMqtt.status;
      if (Mqttstatus == 0) {
        return res.status(200).json({
          statuscode: 200,
          Mqttstatus,
          payload: checkConnectionMqtt,
          message: 'Mqtt Connection Has issue error',
          message_th: 'การเชื่อมต่อ MQTT มีข้อผิดพลาด',
        });
      }
    } else {
      return res.status(200).json({
        statuscode: 200,
        Mqttstatus: 0,
        payload: [],
        message: 'Mqtt Connection lost',
        message_th: 'เชื่อมต่อ MQTT ไม่ได้',
      });
    }
    var monitordevicegroup: any = [];
    var monitordevicegroup_data: any = [];
    var monitordevicegroup_data1: any = [];
    var cache_key: any =
      'devicetype_monitordevicegroup_' +
      md5(bucket + hardware_id + type_id + layout + query.lang);
    /*****redisHelper cache****/
    var ResultData: any = await redisHelper.GetCacheData(cache_key);
    var datacahe_status = 1;
    if (!ResultData) {
      var datacahe_status = 0;
      var ResultData: any = await this.mqtt2Service.devicetype(query);
      var filterSetCacheData: any = {};
      filterSetCacheData.keycache = cache_key;
      filterSetCacheData.time = 60 * 60 * 1;
      filterSetCacheData.data = ResultData;
      await redisHelper.SetCacheData(filterSetCacheData);
    } else {
      if (deletecache == 1) {
        await redisHelper.DeleteCacheData(cache_key);
      }
    }
    /*****redisHelper cache****/
    if (ResultData) {
      for (const [key, value] of Object.entries(ResultData)) {
        var group: any = ResultData[key];
        var type_name: any = group.type_name;
        var type_id: any = group.type_id;
        var hardware_id: any = group.hardware_id;
        var filter: any = {};
        filter.hardware_id = group.hardware_id;
        filter.type_id = group.type_id;
        filter.bucket = query.bucket;
        filter.type_name = group.type_name;
        filter.deletecache = group.deletecache;
        filter.layout = layout;
        filter.lang = query.lang;
        var device: any = await this.getmonitordevicegroup(filter);
        var arraydatarr: any = {
          type_id,
          hardware_id,
          type_name,
          device,
          filter,
        };
        monitordevicegroup_data1.push(arraydatarr);
        monitordevicegroup_data.push(device);
      }
    }
    const cachestats = await redisHelper.getCacheStats();
    if (option == 1) {
      var info: any = monitordevicegroup_data1;
    } else {
      var info: any = [];
    }
    res.status(200).json({
      statusCode: 200,
      //isConnectedCache,
      cachestats,
      datacahe_status,
      mqtt: checkConnectionMqtt,
      device_count,
      payload: monitordevicegroup_data,
      info: info,
      message: 'Success.',
      message_th: 'สำเร็จ.',
    });
  }
  async getmonitordevicegroup(query) {
    const layout: any = query.layout;
    const bucket: any = query.bucket;
    const type_id: any = query.type_id;
    const hardware_ids: any = query.hardware_id;
    const deletecache: any = query.deletecache;
    const date: any = format.getCurrentDatenow();
    const time: any = format.getCurrentTimenow();
    const now = new Date();
    const pad = (num: any) => String(num).padStart(2, '0');

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
    const timestamps: any = datePart + ' ' + timePart;
    try {
      const checkConnectionMqtt: any =
        await this.mqtt2Service.checkConnectionStatusMqtt();
      const filter: any = {};
      filter.bucket = bucket;
      filter.type_id = type_id;
      filter.layout = layout;
      filter.hardware_id = hardware_ids;
      var cache_key: any =
        'get_monitor_device_group_alert_' +
        md5(bucket + hardware_ids + type_id + query.lang);
      /*****redisHelper cache****/
      var device: any = await redisHelper.GetCacheData(cache_key);
      var datacahe_status = 1;
      if (!device) {
        var datacahe_status = 0;
        const device: any = await this.settingsService.device_lists_id(filter);
        var filterSetCacheData: any = {};
        filterSetCacheData.keycache = cache_key;
        filterSetCacheData.time = 60 * 60 * 1;
        filterSetCacheData.data = device;
        await redisHelper.SetCacheData(filterSetCacheData);
      } else {
        if (deletecache == 1) {
          await redisHelper.DeleteCacheData(cache_key);
        }
      }
      /*****redisHelper cache****/
      const device_count: any = device.length;
      if (device && device_count > 0) {
        const deviceDataMain1: any = device[0];
        const deviceDataMain: any = deviceDataMain1;
        const topic: any = deviceDataMain1.mqtt_data_value;
        const mqtt_data_control: any = deviceDataMain1.mqtt_data_control;
        const configdata: any = deviceDataMain1.mqtt_status_data_name;
        const device_name: any = deviceDataMain1.device_name;
        const mqttdata: any = await this.mqtt2Service.getdMqttdataTopics(topic);
        var timestamp: any = mqttdata.timestamp;
        let mqttdata_arrs: any;
        let mqttdata_arrs_data: any;
        if (mqttdata) {
          mqttdata_arrs = mqttdata;
          mqttdata_arrs_data = mqttdata.data;
        } else {
          mqttdata_arrs = [];
          mqttdata_arrs_data = [];
        }
        const deviceData: any = [];
        for (const [key, va] of Object.entries(device)) {
          const RSdata: any = {};
          let obj: any = [];
          try {
            obj = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }
          const mqtt_objt_data = Object.values(obj);
          let obj2: any = [];
          try {
            obj2 = JSON.parse(configdata);
          } catch (e) {
            throw e;
          }

          var mqttdata_arr: any = mqttdata_arrs_data;
          var mqtt_obj2_data = Object.values(obj2);
          var mqttData_count: any = mqttdata_arr.length;
          var mqttData = Object.fromEntries(
            mqtt_obj2_data.map((k: any, i: number) => [k, mqttdata_arr[i]]),
          );
          var merged_dataRs: any = format.mapMqttDataToDevices([va], mqttData);
          var merged_data: any = merged_dataRs[0];
          const merged2: any = format.mapMqttDataToDeviceV2([va], mqttData);
          const merged: any = merged2['0'];
          const currentTypeId: any = device[key].type_id;
          const currentHardwareId: any = parseFloat(device[key].hardware_id);
          let value_data: any;
          let value_alarm: any;
          let value_relay: any;
          let value_control_relay: any;
          let status_alert: any;
          let status_warning: any;
          let recovery_warning: any;
          let recovery_alert: any;
          if (merged) {
            if (currentHardwareId > 1) {
              // IO
              value_data = parseFloat(merged.value_data) ?? parseFloat('0');
              value_alarm = parseFloat(merged.value_alarm) ?? parseFloat('0');
              value_relay = parseFloat(merged.value_relay) ?? parseFloat('0');
              value_control_relay =
                parseFloat(merged.value_control_relay) ?? parseFloat('0');
              status_alert =
                parseFloat(device[key].status_alert) ?? parseFloat('0');
              status_warning =
                parseFloat(device[key].status_warning) ?? parseFloat('0');
              recovery_warning =
                parseFloat(device[key].recovery_warning) ?? parseFloat('1');
              recovery_alert =
                parseFloat(device[key].recovery_alert) ?? parseFloat('1');
            } else {
              // Sensor
              value_data = merged.value_data;
              value_alarm = merged.value_alarm;
              value_relay = merged.value_relay;
              value_control_relay = merged.value_control_relay || 0;
              status_alert = device[key].status_alert;
              status_warning = device[key].status_warning;
              recovery_warning = device[key].recovery_warning;
              recovery_alert = device[key].recovery_alert;
            }
          } else {
            if (currentTypeId > 1) {
              // IO
              value_data = parseFloat('0');
              value_alarm = parseFloat('0');
              value_relay = parseFloat('0');
              value_control_relay = parseFloat('0');
              status_alert = parseFloat('0');
              status_warning = parseFloat('0');
              recovery_warning = parseFloat('1');
              recovery_alert = parseFloat('1');
            } else {
              // Sensor
              value_data = parseFloat('0.00');
              value_alarm = parseFloat('0.00');
              value_relay = parseFloat('0.00');
              value_control_relay = parseFloat('0.00');
              status_alert = parseFloat('0');
              status_warning = parseFloat('0');
              recovery_warning = parseFloat('1.00');
              recovery_alert = parseFloat('1.00');
            }
          }
          var unit: any = device[key].unit;
          var topicData: any = device[key].mqtt_data_value;
          var topicControl: any = device[key].mqtt_data_control;
          var control: any = device[key].mqtt_data_control;
          var mqtt_control_on: any = encodeURI(device[key].mqtt_control_on);
          var mqtt_control_off: any = encodeURI(device[key].mqtt_control_off);
          var mqtt_name: any = device[key].mqtt_name;
          var measurement: any = device[key].measurement;
          var filterAlarmValidate: any = {};
          filterAlarmValidate.type_id = currentTypeId;
          filterAlarmValidate.value_data = value_data;
          filterAlarmValidate.max = device[key].max ?? '';
          filterAlarmValidate.min = device[key].min ?? '';
          filterAlarmValidate.unit = unit;
          filterAlarmValidate.value_alarm = value_alarm;
          filterAlarmValidate.value_relay = value_relay;
          filterAlarmValidate.value_control_relay = value_control_relay;
          filterAlarmValidate.sensorValueData = encodeURI(value_data); //sensor
          filterAlarmValidate.status_warning = status_warning;
          filterAlarmValidate.status_alert = status_alert;
          filterAlarmValidate.recovery_warning = recovery_warning;
          filterAlarmValidate.recovery_alert = recovery_alert;
          filterAlarmValidate.device_name = device[key].device_name;
          filterAlarmValidate.mqtt_name = device[key].mqtt_name;
          filterAlarmValidate.action_name = device[key].mqtt_name;
          filterAlarmValidate.mqtt_control_on = mqtt_control_on;
          filterAlarmValidate.mqtt_control_off = mqtt_control_off;
          filterAlarmValidate.event = 1;
          const lang: any = query.lang;
          if (lang == 'th') {
            var getAlarmDetails: any = await iothelper.AlarmDetailValidateTh(
              filterAlarmValidate,
            );
          } else {
            var getAlarmDetails: any = await iothelper.AlarmDetailValidate(
              filterAlarmValidate,
            );
          }
          RSdata.device_id = device[key].device_id;
          if (currentHardwareId == 1) {
            RSdata.device_type = 'Sensor';
          } else {
            RSdata.device_type = 'IO';
          }
          RSdata.hardware_id = device[key].hardware_id;
          RSdata.topicToControl = device[key].topicControl;
          RSdata.topicData = device[key].mqtt_data_value;
          RSdata.topicControl = device[key].mqtt_data_control;
          RSdata.control = device[key].control;
          RSdata.type_id = currentTypeId;
          RSdata.type_name = device[key].type_name;
          RSdata.device_name = device[key].device_name;
          // RSdata.value_data = value_data;
          // RSdata.data = value_data;
          // RSdata.fulldata = value_data + ' ' + unit;
          RSdata.mqtt_control_on = mqtt_control_on;
          RSdata.mqtt_control_off = mqtt_control_off;
          RSdata.unit = unit;
          const datasensor = value_data;
          RSdata.value_alarm = value_alarm;
          RSdata.value_relay = value_relay;
          RSdata.value_control_relay = value_control_relay;
          RSdata.max = device[key].max;
          RSdata.min = device[key].min;
          RSdata.bucket = device[key].mqtt_bucket;
          RSdata.measurement = device[key].measurement;
          RSdata.org = device[key].mqtt_org;
          RSdata.mqtt_port = device[key].mqtt_port;
          RSdata.alarm_configuration = {
            warning: device[key].status_warning,
            alert: device[key].status_alert,
            recovery_warning: device[key].recovery_warning,
            recovery_alert: device[key].recovery_alert,
          };
          RSdata.alarm_title = getAlarmDetails.title;
          RSdata.alarm_subject = getAlarmDetails.subject;
          RSdata.alarm_alarm_status_set = getAlarmDetails.alarmStatusSet;
          RSdata.alarm_event = getAlarmDetails.event;
          RSdata.alarm_status = getAlarmDetails.status;
          RSdata.layout = device[key].layout;
          RSdata.alert_set = device[key].alert_set;
          RSdata.alert_set = device[key].alert_set;
          RSdata.icon_normal = device[key].icon_normal;
          RSdata.icon_warning = device[key].icon_warning;
          RSdata.icon_alert = device[key].icon_alert;
          RSdata.icon = device[key].icon;
          RSdata.icon_on = device[key].icon_on;
          RSdata.icon_off = device[key].icon_off;
          RSdata.color_normal = device[key].color_normal;
          RSdata.color_warning = device[key].color_warning;
          RSdata.color_alert = device[key].color_alert;
          RSdata.code = device[key].code;
          RSdata.datatime = timestamp;
          RSdata.icon_access = device[key].icon;
          if (currentHardwareId > 1) {
            if (datasensor < 1) {
              RSdata.icon_access = device[key].icon_off;
              RSdata.devicedata = 'OFF';
              RSdata.control =
                Url_api +
                '/v1/mqtt2/control?topic=' +
                topicControl +
                '&message=' +
                mqtt_control_off;
            } else {
              RSdata.icon_access = device[key].icon_on;
              RSdata.devicedata = 'ON';
              RSdata.control =
                Url_api +
                '/v1/mqtt2/control?topic=' +
                topicControl +
                '&message=' +
                mqtt_control_on;
            }
          } else {
            RSdata.control = [];
            RSdata.devicedata = value_data + ' ' + unit;
          }

          // RSdata.filterAlarmValidate = filterAlarmValidate;
          RSdata.getAlarmDetails = getAlarmDetails;
          RSdata.sensercharts =
            Url_api +
            '/v1/mqtt2/sensercharts?bucket=' +
            device[key].mqtt_bucket +
            '&measurement=' +
            device[key].measurement;
          deviceData.push(RSdata);
        }
        var layout_name_conf: any = deviceData['0'].layout;
        if (layout_name_conf == 1) {
          var layout_name: any = 'menu';
        } else {
          var layout_name: any = 'card';
        }
        var payload: any = {
          //filter,
          //mqtt: checkConnectionMqtt,
          //mqttdata,
          bucket,
          timestamps,
          device_count,
          layout: deviceData['0'].layout,
          layout_name: layout_name,
          group_name: deviceData['0'].type_name,
          device_type: deviceData['0'].device_type,
          alarm_configuration: deviceData['0'].alarm_configuration,
          data: deviceData,
          //mqttdatars: merged_data, 
        };
        return payload;
      } else {
        var payload: any = {
          //filter,
          //mqtt: checkConnectionMqtt,
          //mqttdata: [],
          bucket,
          timestamps,
          device_count: 0,
          group_name: [],
          device_type: [],
          alarm_configuration: [],
          data: [],
          //mqttdatars:[],
          filterAlarmValidate,
        };
        return payload;
      }
    } catch (error: any) {
      var payload: any = {
        statusCode: 500,
        payload: null,
        message: 'Mqtt Internal server error 500',
        message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
        error: error.message || error,
      };
      return payload;
    }
  }
  /**********************************************/
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
  async parseMqttData(dataString: any) {
    const parts = dataString.split(',');
    return {
      device: parts[0],
      name: parseFloat(parts[1]),
      data: parts,
    };
  }
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
      await this.mqtt2Service.checkConnectionStatusMqtt();
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
      await this.mqtt2Service.checkConnectionStatusMqtt();
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
  async mqtt_control_device(mqtt_data_control: any, messageMqttControls: any) {
    try {
      var topic_sends: any = encodeURI(mqtt_data_control);
      var message_sends: any = encodeURI(messageMqttControls);
      var devicecontrol: any = await this.mqtt2Service.devicecontrol(
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
        await this.mqtt2Service.checkConnectionStatusMqtt();
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

      var mqttrs: any = await this.mqtt2Service.getMqttTopicPA1(
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
        await this.mqtt2Service.checkConnectionStatusMqtt();
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
      var MQTTGETDATA: any = await this.mqtt2Service.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqtt2Service.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqtt2Service.getdevicedataAll(
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
                  var devicecontrol: any =
                    await this.mqtt2Service.devicecontrol(
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
                  var devicecontrol: any =
                    await this.mqtt2Service.devicecontrol(
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
      await this.mqtt2Service.checkConnectionStatusMqtt();
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
      const MQTTGETDATA: any = await this.mqtt2Service.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqtt2Service.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqtt2Service.getdevicedataAll(
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
      const MQTTGETDATA: any = await this.mqtt2Service.getdevicedataDirec(
        mqtt_data_value,
      );
      // const MQTTGETDATA :any= await this.mqtt2Service.getdevicedataDirecOperator(mqtt_data_value);
      if (MQTTGETDATA) {
        const mqttrs: any = await this.mqtt2Service.getdevicedataAll(
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
  async getdeviceactivemqttAlarmEmail(query: any) {
    try {
      var main_type_id: number = Number(query.type_id);
      var device_id: any = query.device_id;
      var device_id_mas: any = query.device_id;
      // if(main_type_id==1){
      //     var main_status_alert:any= query.status_alert;
      //     var main_status_warning:any= query.status_warning;
      //     var main_recovery_warning:any= query.recovery_warning;
      //     var main_recovery_alert:any= query.recovery_alert;
      // }else{
      //     var main_status_alert:any= 0;
      //     var main_status_warning:any= 0;
      //     var main_recovery_warning:any= 1;
      //     var main_recovery_alert:any= 1;
      // }
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
        await this.mqtt2Service.checkConnectionStatusMqtt();
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
          // await this.mqtt2Service.create_mqttlogRepository(inputCreate);
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
        // await this.mqtt2Service.create_mqttlogRepository(inputCreate);
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
          //const mqttrs: any = await this.mqtt2Service.getMqttTopicData(topic,deletecache);
          const mqttrs: any = await this.mqtt2Service.getMqttTopicDataRS(
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
            // await this.mqtt2Service.create_mqttlogRepository(inputCreate);
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
      var rowResultData: any = await this.mqtt2Service.scheduleprocess(filter);
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
      var ResultData: any = await this.mqtt2Service.scheduleprocess(filter2);
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
          '/v1/mqtt2/control?topic=' +
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
              await this.mqtt2Service.scheduleprocesslog_count(dataset);
            if (log_count >= 1) {
              var log_count2: any =
                await this.mqtt2Service.scheduleprocesslog_count_status(
                  dataset,
                );

              if (log_count2 == 0) {
                var deviceData: any = await this.mqtt2Service.getdevicedata(
                  mqtt_data_value,
                );
                if (deviceData) {
                  var devicecontrol: any =
                    await this.mqtt2Service.devicecontrol(
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
                  await this.mqtt2Service.update_scheduleprocesslog_v2(
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
                var devicecontrol: any = await this.mqtt2Service.devicecontrols(
                  mqtt_data_control,
                  message_mqtt_control,
                  message_control,
                );
              }
              var now_time_s: any = timestamp;

              var deviceData: any = await this.mqtt2Service.getdevicedata(
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
}


// http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=CMONBUGKET
// http://172.25.99.10:3003/v1/mqtt2/sensercharts?bucket=CMONBUGKET&measurement=temperature1

// http://172.25.99.10:3003/v1/mqtt2/control?topic=MRTH15052025I2O1V2001/CONTROL&message=ON
// http://172.25.99.10:3003/v1/mqtt2/control?topic=MRTH15052025I2O1V2001/CONTROL&message=OFF

// http://172.25.99.10:3003/v1/mqtt2/topic?topic=MRMONI05122025V5001/DATA
// http://172.25.99.10:3003/v1/mqtt2/topic?topic=MRTH15052025I2O1V2001/DATA

// http://172.25.99.10:3003/v1/mqtt2/topic?topic=MRMONI05122025V5001/DATA
// http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=LDRBUGKET&type_id=

// http://172.25.99.10:3003/v1/mqtt2/devicebuckets?bucket=CMONBUGKET&type_id=&hardware_id=1
// http://172.25.99.10:3003/v1/mqtt2/sensercharts?bucket=CMONBUGKET&measurement=temperature1
