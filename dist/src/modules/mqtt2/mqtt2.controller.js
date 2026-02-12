"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Mqtt2Controller_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mqtt2Controller = void 0;
const common_1 = require("@nestjs/common");
var isOn = false;
var intervalId;
var moment = require('moment');
require("dotenv/config");
var tzString = process.env.tzString;
var connectUrl_mqtt = process.env.MQTT_HOST2 || 'mqtt://broker.hivemq.com:1883';
if (!connectUrl_mqtt) {
    var connectUrl_mqtt = process.env.MQTT_HOST || 'mqtt://localhost:1883';
}
const swagger_1 = require("@nestjs/swagger");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const mqtt2_service_1 = require("./mqtt2.service");
const mqtt3_service_1 = require("../mqtt3/mqtt3.service");
const iot_service_1 = require("../iot/iot.service");
const settings_service_1 = require("../settings/settings.service");
const users_service_1 = require("../users/users.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
const cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const format = __importStar(require("../../helpers/format.helper"));
const redis_helper_1 = require("../../helpers/redis.helper");
const iothelper = __importStar(require("../../helpers/iot.helper"));
const redis = redis_helper_1.redisHelper;
var md5 = require('md5');
require("dotenv/config");
var tzString = process.env.tzString;
require('dotenv').config();
var Url_api = process.env.API_URL;
const microservices_1 = require("@nestjs/microservices");
class PublishDto {
    constructor() {
        this.topic = 'AIR1/CONTROL';
        this.message = '1';
    }
}
let Mqtt2Controller = Mqtt2Controller_1 = class Mqtt2Controller {
    constructor(mqttService, mqtt2Service, mqtt3Service, IotService, UsersService, settingsService) {
        this.mqttService = mqttService;
        this.mqtt2Service = mqtt2Service;
        this.mqtt3Service = mqtt3Service;
        this.IotService = IotService;
        this.UsersService = UsersService;
        this.settingsService = settingsService;
        this.logger = new common_1.Logger(Mqtt2Controller_1.name);
    }
    handleDeviceStatus(data, context) {
        this.logger.log(`สถานะอุปกรณ์จาก Topic: ${context.getTopic()}`);
        this.logger.log(`ข้อมูลสถานะ: ${JSON.stringify(data)}`);
    }
    async checkConnectionIndex(res, dto, query, headers, req) {
        try {
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
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
            }
            else {
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
        }
        catch (error) {
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
    async checkConnection(res, dto, query, headers, req) {
        try {
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
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
            }
            else {
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
        }
        catch (error) {
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
    async topic(res, dto, query, headers, req) {
        try {
            var topic = query.topic;
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
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
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
            }
            else {
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
        }
        catch (error) {
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
    async device_control_data(res, dto, query, headers, params, req) {
        var topic = query.topic;
        var message = query.message;
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
        var topic_send = encodeURI(topic);
        var message_send = encodeURI(message);
        if (message_send == 1 ||
            message_send == 'on' ||
            message_send == 'ON' ||
            message_send == 'a1' ||
            message_send == 'a1' ||
            message_send == 'b1' ||
            message_send == 'c1' ||
            message_send == 'd1' ||
            message_send == 'e1' ||
            message_send == 'f1' ||
            message_send == 'g1') {
            var message_control = 'ON';
        }
        else {
            var message_control = 'OFF';
        }
        var data = await this.mqtt2Service.devicecontrol(topic_send, message_send);
        res.status(200).json(data);
        return;
    }
    async devicebuckets(res, dto, query, headers, params, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const bucket = query.bucket;
        const type_id = query.type_id;
        const hardware_ids = query.hardware_id;
        if (!bucket) {
            return res.status(200).json({
                statuscode: 200,
                message: 'bucket is null',
                message_th: 'bucket is null',
                payload: {},
            });
        }
        const date = format.getCurrentDatenow();
        const time = format.getCurrentTimenow();
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
        const timestamps = datePart + ' ' + timePart;
        try {
            const checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                const Mqttstatus = checkConnectionMqtt.status;
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
            const filter = {};
            filter.bucket = bucket;
            filter.type_id = type_id;
            filter.hardware_id = hardware_ids;
            const device = await this.settingsService.device_lists_id(filter);
            const device_count = device.length;
            if (device && device_count > 0) {
                const deviceDataMain1 = device[0];
                const deviceDataMain = deviceDataMain1;
                const topic = deviceDataMain1.mqtt_data_value;
                const mqtt_data_control = deviceDataMain1.mqtt_data_control;
                const configdata = deviceDataMain1.mqtt_status_data_name;
                const device_name = deviceDataMain1.device_name;
                const mqttdata = await this.mqtt2Service.getdMqttdataTopics(topic);
                let mqttdata_arrs;
                let mqttdata_arrs_data;
                if (mqttdata) {
                    mqttdata_arrs = mqttdata;
                    mqttdata_arrs_data = mqttdata.data;
                }
                else {
                    mqttdata_arrs = [];
                    mqttdata_arrs_data = [];
                }
                const deviceData = [];
                for (const [key, va] of Object.entries(device)) {
                    const RSdata = {};
                    let obj = [];
                    try {
                        obj = JSON.parse(configdata);
                    }
                    catch (e) {
                        throw e;
                    }
                    const mqtt_objt_data = Object.values(obj);
                    let obj2 = [];
                    try {
                        obj2 = JSON.parse(configdata);
                    }
                    catch (e) {
                        throw e;
                    }
                    const mqttdata_arr = mqttdata_arrs_data;
                    const mqtt_obj2_data = Object.values(obj2);
                    const mqttData_count = mqttdata_arr.length;
                    const mqttData = Object.fromEntries(mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]));
                    const merged_dataRs = format.mapMqttDataToDevices([va], mqttData);
                    const merged_data = merged_dataRs[0];
                    const merged2 = format.mapMqttDataToDeviceV2([va], mqttData);
                    const merged = merged2['0'];
                    const currentTypeId = device[key].type_id;
                    const currentHardwareId = parseFloat(device[key].hardware_id);
                    let value_data;
                    let value_alarm;
                    let value_relay;
                    let value_control_relay;
                    let status_alert;
                    let status_warning;
                    let recovery_warning;
                    let recovery_alert;
                    if (merged) {
                        if (currentHardwareId > 1) {
                            value_data = (_a = parseFloat(merged.value_data)) !== null && _a !== void 0 ? _a : parseFloat('0');
                            value_alarm = (_b = parseFloat(merged.value_alarm)) !== null && _b !== void 0 ? _b : parseFloat('0');
                            value_relay = (_c = parseFloat(merged.value_relay)) !== null && _c !== void 0 ? _c : parseFloat('0');
                            value_control_relay =
                                (_d = parseFloat(merged.value_control_relay)) !== null && _d !== void 0 ? _d : parseFloat('0');
                            status_alert =
                                (_e = parseFloat(device[key].status_alert)) !== null && _e !== void 0 ? _e : parseFloat('0');
                            status_warning =
                                (_f = parseFloat(device[key].status_warning)) !== null && _f !== void 0 ? _f : parseFloat('0');
                            recovery_warning =
                                (_g = parseFloat(device[key].recovery_warning)) !== null && _g !== void 0 ? _g : parseFloat('1');
                            recovery_alert =
                                (_h = parseFloat(device[key].recovery_alert)) !== null && _h !== void 0 ? _h : parseFloat('1');
                        }
                        else {
                            value_data = merged.value_data;
                            value_alarm = merged.value_alarm;
                            value_relay = merged.value_relay;
                            value_control_relay = merged.value_control_relay || 0;
                            status_alert = device[key].status_alert;
                            status_warning = device[key].status_warning;
                            recovery_warning = device[key].recovery_warning;
                            recovery_alert = device[key].recovery_alert;
                        }
                    }
                    else {
                        if (currentTypeId > 1) {
                            value_data = parseFloat('0');
                            value_alarm = parseFloat('0');
                            value_relay = parseFloat('0');
                            value_control_relay = parseFloat('0');
                            status_alert = parseFloat('0');
                            status_warning = parseFloat('0');
                            recovery_warning = parseFloat('1');
                            recovery_alert = parseFloat('1');
                        }
                        else {
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
                    var unit = device[key].unit;
                    var topicData = device[key].mqtt_data_value;
                    var topicControl = device[key].mqtt_data_control;
                    var control = device[key].mqtt_data_control;
                    var mqtt_control_on = encodeURI(device[key].mqtt_control_on);
                    var mqtt_control_off = encodeURI(device[key].mqtt_control_off);
                    var mqtt_name = device[key].mqtt_name;
                    var measurement = device[key].measurement;
                    const filterAlarmValidate = {};
                    filterAlarmValidate.type_id = currentTypeId;
                    filterAlarmValidate.value_data = value_data;
                    filterAlarmValidate.unit = unit;
                    filterAlarmValidate.value_alarm = value_alarm;
                    filterAlarmValidate.value_relay = value_relay;
                    filterAlarmValidate.value_control_relay = value_control_relay;
                    filterAlarmValidate.sensorValueData = encodeURI(value_data);
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
                    const lang = query.lang;
                    if (lang == 'th') {
                        var getAlarmDetails = await iothelper.AlarmDetailValidateTh(filterAlarmValidate);
                    }
                    else {
                        var getAlarmDetails = await iothelper.AlarmDetailValidate(filterAlarmValidate);
                    }
                    RSdata.device_id = device[key].device_id;
                    if (currentHardwareId == 1) {
                        RSdata.device_type = 'Sensor';
                    }
                    else {
                        RSdata.device_type = 'IO';
                    }
                    RSdata.hardware_id = currentHardwareId;
                    RSdata.type_id = currentTypeId;
                    RSdata.type_name = device[key].type_name;
                    RSdata.device_name = device[key].device_name;
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
                        }
                        else {
                            RSdata.devicedata = 'ON';
                            RSdata.control =
                                Url_api +
                                    '/v1/mqtt2/control?topic=' +
                                    topicControl +
                                    '&message=' +
                                    mqtt_control_on;
                        }
                    }
                    else {
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
                    },
                });
            }
            else {
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
        }
        catch (error) {
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
    async sensercharts(res, query, headers, params, req) {
        const start = query.start || '-8m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '8m';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
        const measurement = query.measurement;
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
        const field = query.field || 'value';
        const time = query.time || '8m';
        const limit = query.limit || 120;
        const offset = query.offset || 0;
        const mean = query.mean || 'last';
        const Dtos = {
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
        console.info(Dtos);
        var deletecache = query.deletecache;
        var kaycache1 = 'mqtt2_get_start_to_end_v1_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache1);
        }
        var data = await Cache.GetCacheData(kaycache1);
        if (!data) {
            var data = await this.IotService.influxdbFilterData(Dtos);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 120,
                data: data,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        const Dtos2 = {
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
        console.info(Dtos2);
        var kaycache2 = 'mqtt2_get_start_to_end_v2_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache2);
        }
        var data1 = await Cache.GetCacheData(kaycache2);
        if (!data1) {
            var data1 = await this.IotService.influxdbFilterchart1(Dtos2);
            var InpuDatacache = {
                keycache: `${kaycache2}`,
                time: 120,
                data: data1,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        var kaycache3 = 'mqtt2_get_start_to_end_v3_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache3);
        }
        var data2 = await Cache.GetCacheData(kaycache3);
        if (!data2) {
            var data2 = await this.IotService.influxdbFilterchart2(Dtos2);
            var InpuDatacache = {
                keycache: `${kaycache3}`,
                time: 120,
                data: data2,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                status: 0,
                field: field,
                payload: {
                    time: '2025-01-00:00:00:00',
                    value: 0,
                    field: field,
                },
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                status: 1,
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
    async alarmdevicestatus(res, query, headers, params, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            var alarm_to_control = [];
            var alarm_to_email = [];
            var alarm_to_line = [];
            var alarm_to_sms = [];
            var alarm_to_telegram = [];
            var device_event_control_ar = [];
            var get_alarm_to_email = [];
            var get_alarm_to_line = [];
            var get_alarm_to_sms = [];
            var get_alarm_to_telegram = [];
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var date_now = format.getCurrentDatenow();
            var time_now = format.getCurrentTimenow();
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
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
            }
            else {
                return res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    Mqttstatus,
                    payload: checkConnectionMqtt,
                    message: 'check Connection Status Mqtt',
                    message_th: 'check Connection Status Mqtt',
                });
            }
            var cachetimeset = parseInt('60');
            var cachetimeset1 = parseInt('30');
            var cachetimeset2 = parseInt('180');
            var cachetimeset3 = parseInt('300');
            var cachetimeset4 = parseInt('120');
            var device_status = 0;
            var ResultDatasendEmail = [];
            var useractive_arr = [];
            var kaycache_cache_user = 'useractiveemail_status_1';
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache_user);
            }
            var useractive = await Cache.GetCacheData(kaycache_cache_user);
            if (useractive) {
                var useractive = useractive;
                var cache_data_useractive = 'cache';
            }
            else if (!useractive) {
                var filter_useractive = { status: 1 };
                var useractive = await this.UsersService.useractiveemail(filter_useractive);
                var useractiveRs = {
                    keycache: `${kaycache_cache_user}`,
                    time: cachetimeset,
                    data: useractive,
                };
                await Cache.SetCacheData(useractiveRs);
                var cache_data_useractive = 'no cache';
            }
            const page = parseInt(query.page) || 1;
            const pageSize = parseInt(query.pageSize) || 100000000;
            var alarm_action_id_mas = query.alarm_action_id || '';
            var status = query.status || '';
            var sort = query.sort || 'createddate-ASC';
            var keyword = query.keyword || '';
            var deletecache = query.deletecache;
            var filter = {};
            filter.sort = query.sort;
            filter.keyword = keyword || '';
            filter.alarm_action_id = alarm_action_id_mas || '';
            filter.event = query.event || '';
            filter.isCount = 1;
            var filter_md5 = md5(filter);
            var kaycache_cache = 's2_alarmdevicestatus_row_' + filter_md5;
            var row = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var rowResultData = await Cache.GetCacheData(kaycache_cache);
            if (rowResultData) {
                var row = rowResultData;
            }
            else if (!rowResultData) {
                var rowResultData = await this.mqtt2Service.alarm_device_paginate_status(filter);
                var row = rowResultData;
                var rowResultData = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: rowResultData,
                };
                await Cache.SetCacheData(rowResultData);
                var cache_data_rowResultData = 'no cache';
            }
            else if (rowResultData) {
                var rowResultData = rowResultData;
                var row = rowResultData['data'];
                var cache_data_rowResultData = 'cache';
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
            var device_status = 0;
            const rowData = parseInt(row);
            const totalPages = Math.round(rowData / pageSize) || 1;
            let filter2 = {};
            filter2.sort = query.sort;
            filter2.keyword = keyword || '';
            filter2.alarm_action_id = alarm_action_id_mas || '';
            filter2.event = query.event || '';
            filter2.isCount = 0;
            filter2.page = page;
            filter2.pageSize = pageSize;
            console.log(`filter2=`);
            console.info(filter2);
            var filter2_md5 = md5(filter2);
            var kaycache_cache = 's2_alarmdevicestatus_rs_' + filter2_md5;
            var ResultData = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultData = await Cache.GetCacheData(kaycache_cache);
            if (ResultData) {
                var ResultData = ResultData;
                var cache_data_ResultData = 'cache';
            }
            else if (!ResultData) {
                var ResultData = await this.mqtt2Service.alarm_device_paginate_status(filter2);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var tempDataoid = [];
            for (const [key, va] of Object.entries(ResultData)) {
                var alarm_action_id_master = parseInt(ResultData[key].alarm_action_id);
                var action_name = ResultData[key].action_name;
                var status_warning = ResultData[key].status_warning;
                var status_alert = ResultData[key].status_alert;
                var recovery_warning = ResultData[key].recovery_warning;
                var recovery_alert = ResultData[key].recovery_alert;
                var email_alarm = ResultData[key].email_alarm;
                if (!email_alarm) {
                    var email_alarm = 0;
                }
                var line_alarm = ResultData[key].line_alarm;
                if (!line_alarm) {
                    var line_alarm = 0;
                }
                var telegram_alarm = ResultData[key].telegram_alarm;
                if (!telegram_alarm) {
                    var telegram_alarm = 0;
                }
                var sms_alarm = ResultData[key].sms_alarm;
                if (!sms_alarm) {
                    var sms_alarm = 0;
                }
                var nonc_alarm = ResultData[key].nonc_alarm;
                if (!nonc_alarm) {
                    var nonc_alarm = 0;
                }
                var time_life = parseInt(ResultData[key].time_life);
                var event = parseInt(ResultData[key].event);
                if (event == 0) {
                    var event_name = 'OFF';
                }
                if (event == 1) {
                    var event_name = 'ON';
                }
                var status = ResultData[key].status;
                if (status == 1) {
                    var status_name = 'enable';
                }
                if (status == 0) {
                    var status_name = 'disable';
                }
                var device = {};
                var alarm_config_mas = {};
                alarm_config_mas.alarm_action_id = alarm_action_id_master;
                alarm_config_mas.action_name = action_name;
                alarm_config_mas.event_name = event_name;
                alarm_config_mas.status_name = status_name;
                alarm_config_mas.timelife = time_life + ' Minute';
                var alarm_config = {};
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
                var filter_alarm = {};
                filter_alarm.alarm_action_id = alarm_action_id_master;
                var filter_md5 = md5(filter_alarm);
                var kaycachecache = 's2_alarmdevice_rs_' + alarm_action_id_master;
                if (deletecache == 1) {
                    await Cache.DeleteCacheData(kaycachecache);
                }
                var alarmdevice = await Cache.GetCacheData(kaycachecache);
                if (alarmdevice) {
                    var alarmdevice = alarmdevice;
                }
                else if (!alarmdevice) {
                    try {
                        var alarmdevice = await this.settingsService.sd_iot_alarm_device_list_map(filter_alarm);
                        var rs = {
                            keycache: `${kaycachecache}`,
                            time: cachetimeset,
                            data: alarmdevice,
                        };
                        await Cache.SetCacheData(rs);
                        var cache_data_alarmdevice = 'no cache';
                    }
                    catch (error) {
                        console.error('Error fetching alarm device:', error);
                        alarmdevice = [];
                    }
                    var rs = {
                        keycache: `${kaycachecache}`,
                        time: cachetimeset,
                        data: alarmdevice,
                    };
                    await Cache.SetCacheData(rs);
                    var cache_data_alarmdevice = 'no cache';
                }
                if (alarmdevice) {
                    var count_device = 0;
                    if (alarmdevice && Array.isArray(alarmdevice)) {
                        count_device = alarmdevice.length;
                    }
                }
                else {
                    var count_device = parseInt('0');
                }
                alarm_config.count_device = count_device;
                var alarm_device_arr = [];
                if (alarmdevice) {
                    for (const [key, value] of Object.entries(alarmdevice)) {
                        var values = value;
                        var valuesMain = value;
                        const alarm_action_id = values.alarm_action_id;
                        const device_id = values.device_id;
                        const type_id = values.type_id;
                        const mqtt_id = values.mqtt_id;
                        const event = values.event;
                        const mqtt_name = values.mqtt_name;
                        const device_name = values.device_name;
                        const type_name = values.type_name;
                        const time_life = values.time_life;
                        var status_warning = values.status_warning;
                        var status_alert = values.status_alert;
                        var recovery_warning = values.recovery_warning;
                        var recovery_alert = values.recovery_alert;
                        const mqtt_control_on = values.mqtt_control_on;
                        const mqtt_control_off = values.mqtt_control_off;
                        const mqtt_data_value = encodeURI(values.mqtt_data_value);
                        const mqtt_data_control = encodeURI(values.mqtt_data_control);
                        const mqtt_data_set = {
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
                        const setting_id = values.setting_id;
                        const hardware_id = values.hardware_id;
                        const period = values.period;
                        const comparevalue = values.comparevalue;
                        const status = values.status;
                        const action_id = values.action_id;
                        const status_alert_id = values.status_alert_id;
                        const device_bucket = values.device_bucket;
                        const location_name = values.location_name;
                        const configdata = values.configdata;
                        const mqtt_org = values.mqtt_org;
                        const mqtt_bucket = values.mqtt_bucket;
                        const mqtt_device_name = values.mqtt_device_name;
                        const mqtt_status_over_name = values.mqtt_status_over_name;
                        const mqtt_status_data_name = values.mqtt_status_data_name;
                        const mqtt_act_relay_name = values.mqtt_act_relay_name;
                        const mqtt_control_relay_name = values.mqtt_control_relay_name;
                        const location_id = values.location_id;
                        const mqtt_data = {
                            type_id,
                            mqtt_org,
                            mqtt_bucket,
                            mqtt_device_name,
                            mqtt_status_over_name,
                            mqtt_status_data_name,
                            mqtt_act_relay_name,
                            mqtt_control_relay_name,
                        };
                        var fillterAlarm = {};
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
                        const nonc_alarm = values.nonc_alarm;
                        const email_alarm = values.email_alarm;
                        const line_alarm = values.line_alarm;
                        const telegram_alarm = values.telegram_alarm;
                        const sms_alarm = values.sms_alarm;
                        const config_alert = {
                            nonc_alarm,
                            email_alarm,
                            line_alarm,
                            telegram_alarm,
                            sms_alarm,
                        };
                        var mqttrs = await this.mqtt2Service.getMqttTopicPA1(mqtt_data_value, deletecache);
                        var timestampMqtt = mqttrs.timestamp;
                        if (timestampMqtt) {
                            var timestamps = timestampMqtt;
                        }
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
                        let obj = [];
                        try {
                            obj = JSON.parse(configdata);
                        }
                        catch (e) {
                            throw e;
                        }
                        var mqtt_objt_data = Object.values(obj);
                        let obj2 = [];
                        try {
                            obj2 = JSON.parse(mqtt_status_data_name);
                        }
                        catch (e) {
                            throw e;
                        }
                        var mqttdata_arrs = await this.parseMqttData(mqttdata);
                        var mqttdata_arr = mqttdata_arrs['data'];
                        var mqtt_obj2_data = Object.values(obj2);
                        var mqttData_count = mqttdata_arr.length;
                        var mqttData = Object.fromEntries(mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]));
                        var merged_dataRs = format.mapMqttDataToDevices([values], mqttData);
                        var merged_data = merged_dataRs[0];
                        var merged2 = format.mapMqttDataToDeviceV2([values], mqttData);
                        var merged2Mode = format.mapMqttDataToDeviceALLMode([va], mqttData);
                        var merged = merged2['0'];
                        if (merged) {
                            if (type_id > 1) {
                                var value_data = (_a = parseInt(merged.value_data)) !== null && _a !== void 0 ? _a : parseInt('0');
                                var value_alarm = (_b = parseInt(merged.value_alarm)) !== null && _b !== void 0 ? _b : parseInt('0');
                                var value_relay = (_c = parseInt(merged.value_relay)) !== null && _c !== void 0 ? _c : parseInt('0');
                                var value_control_relay = (_d = parseInt(merged.value_control_relay)) !== null && _d !== void 0 ? _d : parseInt('0');
                                var status_alert = (_e = parseInt(status_alert)) !== null && _e !== void 0 ? _e : parseInt('0');
                                var status_warning = (_f = parseInt(status_warning)) !== null && _f !== void 0 ? _f : parseInt('0');
                                var recovery_warning = (_g = parseInt(recovery_warning)) !== null && _g !== void 0 ? _g : parseInt('1');
                                var recovery_alert = (_h = parseInt(recovery_alert)) !== null && _h !== void 0 ? _h : parseInt('1');
                            }
                            else {
                                var value_data = merged.value_data;
                                var value_data_merged = merged.value_data;
                                var value_alarm = merged.value_alarm;
                                var value_relay = merged.value_relay;
                                var value_control_relay = merged.value_control_relay || 0;
                                var status_alert = status_alert;
                                var status_warning = status_warning;
                                var recovery_warning = recovery_warning;
                                var recovery_alert = recovery_alert;
                            }
                        }
                        else {
                            if (type_id > 1) {
                                var value_data = parseInt('0');
                                var value_alarm = parseInt('0');
                                var value_relay = parseInt('0');
                                var value_control_relay = parseInt('0');
                                var status_alert = parseInt('0');
                                var status_warning = parseInt('0');
                                var recovery_warning = parseInt('1');
                                var recovery_alert = parseInt('1');
                            }
                            else {
                                var value_data = parseFloat('0.00');
                                var value_data_merged = parseFloat('0.00');
                                var value_alarm = parseFloat('0.00');
                                var value_relay = parseFloat('0.00');
                                var value_control_relay = parseFloat('0.00');
                                var status_alert = parseFloat('0');
                                var status_warning = parseFloat('0');
                                var recovery_warning = parseFloat('1.00');
                                var recovery_alert = parseFloat('01.00');
                            }
                        }
                        var createddated = merged_data.createddate;
                        var createddate = format.timeConvertermas(format.convertTZ(createddated, process.env.tzString));
                        var updateddated = merged_data.updateddate;
                        var updateddate = format.timeConvertermas(format.convertTZ(updateddated, process.env.tzString));
                        var filterAlarmValidate = {};
                        filterAlarmValidate.type_id = type_id;
                        if (type_id == 1) {
                            filterAlarmValidate.value_data = parseFloat(value_data);
                            filterAlarmValidate.value_alarm = parseInt(value_alarm);
                            filterAlarmValidate.value_relay = parseInt(value_relay);
                            filterAlarmValidate.value_control_relay = value_control_relay;
                            filterAlarmValidate.sensorValueData = encodeURI(value_data);
                            filterAlarmValidate.status_warning = status_warning;
                            filterAlarmValidate.status_alert = status_alert;
                            filterAlarmValidate.recovery_warning = recovery_warning;
                            filterAlarmValidate.recovery_alert = recovery_alert;
                        }
                        else {
                            filterAlarmValidate.value_data = parseFloat(value_data);
                            filterAlarmValidate.value_alarm = parseInt(value_alarm);
                            filterAlarmValidate.value_relay = parseInt(value_relay);
                            filterAlarmValidate.value_control_relay = value_control_relay;
                            filterAlarmValidate.sensorValueData = encodeURI(value_alarm);
                            filterAlarmValidate.status_warning = parseInt('0');
                            filterAlarmValidate.status_alert = parseInt('0');
                            filterAlarmValidate.recovery_warning = parseInt('1');
                            filterAlarmValidate.recovery_alert = parseInt('1');
                            var data = parseFloat(value_alarm);
                        }
                        filterAlarmValidate.mqtt_name = mqtt_name;
                        filterAlarmValidate.device_name = mqtt_device_name;
                        filterAlarmValidate.action_name = mqtt_name;
                        filterAlarmValidate.mqtt_control_on = encodeURI(mqtt_control_on);
                        filterAlarmValidate.mqtt_control_off = encodeURI(mqtt_control_off);
                        filterAlarmValidate.event = 1;
                        const lang = query.lang;
                        if (lang == 'th') {
                            var getAlarmDetails = await iothelper.AlarmDetailValidateTh(filterAlarmValidate);
                        }
                        else {
                            var getAlarmDetails = await iothelper.AlarmDetailValidate(filterAlarmValidate);
                        }
                        var alarmStatusSet = parseInt('999');
                        if (getAlarmDetails) {
                            var subject = getAlarmDetails.subject;
                            var content = getAlarmDetails.content;
                            var statusAlert = getAlarmDetails.status;
                            var alarmStatusSet = parseInt(getAlarmDetails.alarmStatusSet);
                            var dataAlarm = getAlarmDetails.dataAlarm;
                            var eventControl = getAlarmDetails.eventControl;
                            var messageMqttControl = getAlarmDetails.messageMqttControl;
                            var sensor_data = getAlarmDetails.sensor_data;
                            var count_alarm = getAlarmDetails.count_alarm;
                        }
                        else {
                            var subject = 'Normal';
                            var messageMqttControl = '';
                            var statusAlert = getAlarmDetails.status;
                            var alarmStatusSet = parseInt('999');
                        }
                        fillterAlarm.alarmStatusSet = alarmStatusSet;
                        var data_alarm = getAlarmDetails.data_alarm;
                        var status_report = {
                            1: 'Warning',
                            2: 'Alarm',
                            3: 'Recovery Warning',
                            4: 'Recovery Alarm',
                            5: 'Normal',
                        };
                        var timestamp = timestamps;
                        var sensor_data_name = subject;
                        if (type_id == 1) {
                            var value_data_msg = value_data;
                        }
                        else {
                            if (value_data == 1) {
                                var value_data_msg = 'ON';
                            }
                            else {
                                var value_data_msg = 'OFF';
                            }
                        }
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var mqtt_on = encodeURI(mqtt_control_on);
                        var mqtt_off = encodeURI(mqtt_control_off);
                        var statusControl = getAlarmDetails.statusControl;
                        if (statusControl == 1 || statusControl == 2) {
                            var msgControl = mqtt_on;
                        }
                        else if (statusControl == 3 || statusControl == 4) {
                            var msgControl = mqtt_off;
                        }
                        else {
                            var msgControl = mqtt_off;
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
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id;
                        var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
                        if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
                            var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                        }
                        else {
                            var crsmaster = null;
                            var createddate_logs_control = null;
                        }
                        var filter = {};
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
                        const device_id_val = parseInt(device_id);
                        var alarmdevice_arr_rs = [];
                        var filter_alarm_ctl = {};
                        filter_alarm_ctl.alarm_action_id = alarm_action_id_master;
                        var filter_md5_ctl = md5(filter_alarm_ctl);
                        var kaycachecache_ctl = 'alarmdevice_rs__ctl' + alarm_action_id_master;
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycachecache_ctl);
                        }
                        var alarmdevice_ctl = await Cache.GetCacheData(kaycachecache_ctl);
                        if (alarmdevice_ctl) {
                            var alarmdevice = alarmdevice_ctl;
                        }
                        else if (!alarmdevice_ctl) {
                            var filter3 = {};
                            filter3.alarm_action_id = alarm_action_id;
                            var alarmdevice_ctl = await this.settingsService.deviceeventmap(filter3);
                            var rs = {
                                keycache: `${kaycachecache_ctl}`,
                                time: cachetimeset,
                                data: alarmdevice_ctl,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_alarmdevice = 'no cache';
                        }
                        if (alarmStatusSet == 1) {
                            var validate_count = parseInt('3');
                        }
                        else if (alarmStatusSet == 2) {
                            var validate_count = parseInt('3');
                        }
                        else if (alarmStatusSet == 3) {
                            var validate_count = parseInt('1');
                        }
                        else {
                            var validate_count = parseInt('1');
                        }
                        if (alarmdevice_ctl) {
                            for (const [key2, value2] of Object.entries(alarmdevice_ctl)) {
                                var values2 = value2;
                                const alarm_action_id2 = values.alarm_action_id;
                                var device_id2 = parseInt(values2.device_id);
                                const type_id2 = values2.type_id;
                                const mqtt_id = values2.mqtt_id;
                                const event = values.event;
                                const mqtt_name = values.mqtt_name;
                                const device_name = values2.device_name;
                                const type_name = values2.type_name;
                                const time_life = parseInt(values.time_life);
                                const bucket_main = values2.bucket;
                                var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                                var date_now2 = format.getCurrentDatenow();
                                const setdatachk_alarm_process_logs = {
                                    alarm_action_id: alarm_action_id2,
                                    device_id: device_id_val,
                                    type_id: type_id2,
                                    date: date_now2,
                                };
                                var now_time_cal_main = parseInt('0');
                                var count_alarm_process_log = await this.settingsService.count_alarmprocesslogmqtt(setdatachk_alarm_process_logs);
                                var count_alarm_process_logs = parseInt(count_alarm_process_log) || 0;
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id2;
                                var countAlarmDeviceControl = 0;
                                try {
                                    var countResult = await this.settingsService.count_alarmprocesslog(fillter_device_control);
                                    if (countResult !== null && countResult !== undefined) {
                                        var countAlarmDeviceControl = parseInt(countResult) || 0;
                                    }
                                }
                                catch (error) {
                                    console.error('Error counting alarm process log:', error);
                                    countAlarmDeviceControl = 0;
                                    console.error(`Error processing main record ${key}:`, error);
                                    continue;
                                }
                                var setdatachk_main_control_logs = {};
                                setdatachk_main_control_logs.alarm_action_id = alarm_action_id2;
                                setdatachk_main_control_logs.device_id = device_id;
                                var crsmaster_control_logsm = await this.settingsService.chk_alarmprocesslog(setdatachk_main_control_logs);
                                var crsmaster_control_logs_count = crsmaster_control_logsm.length;
                                if (crsmaster_control_logs_count >= 1) {
                                    var crsmaster_control_logs_v1 = crsmaster_control_logsm['0'];
                                    var createddate_logs_control_v1 = format.timeConvertermas(format.convertTZ(crsmaster_control_logs_v1.createddate, process.env.tzString));
                                    var now_time_cal_control_log = format.diffMinutes(now_time_full, createddate_logs_control_v1);
                                    var now_time_cal_control_v1 = parseInt(now_time_cal_control_log);
                                    if (now_time_cal_control_log > time_life) {
                                        if (crsmaster_control_logs_count >= validate_count) {
                                            const fillter_device_control = {};
                                            fillter_device_control.alarm_action_id = alarm_action_id;
                                            fillter_device_control.device_id = device_id;
                                            await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                                        }
                                    }
                                }
                                else {
                                    var crsmaster_control_logs = [];
                                    var createddate_logs_control = '';
                                    var now_time_cal_control_v1 = 0;
                                }
                                let mqtt_control_on = values2.mqtt_control_on;
                                let mqtt_control_off = values2.mqtt_control_off;
                                let mqtt_data_value = encodeURI(values2.mqtt_data_value);
                                let mqtt_data_control = encodeURI(values2.mqtt_data_control);
                                let fillterAlarmCtl = {};
                                fillterAlarmCtl.value_data = value_data;
                                fillterAlarmCtl.sensor_data = value_data;
                                fillterAlarmCtl.value = value;
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
                                        var type_ctl = 1;
                                        var crsmaster_control = 0;
                                        var setdatachk_main_control = {};
                                        setdatachk_main_control.alarm_action_id = alarm_action_id2;
                                        setdatachk_main_control.device_id = device_id;
                                        var crsmaster_control = await this.settingsService.chk_alarmprocesslog(setdatachk_main_control);
                                        var crsmaster_control_logs_count = crsmaster_control.length;
                                        if (crsmaster_control_logs_count < 1) {
                                            if (type_id2 > 1) {
                                                var alarm_to_control = await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                                            }
                                        }
                                        else {
                                            var createddate = format.timeConvertermas(format.convertTZ(crsmaster_control[0].createddate, process.env.tzString));
                                            var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster_control[0].createddate, process.env.tzString));
                                            var now_time_cal_control_log = format.diffMinutes(now_time_full, createddate_logs_control);
                                            var now_time_cal_control = parseInt(now_time_cal_control_log);
                                            fillterAlarmCtl.createddate = createddate;
                                            fillterAlarmCtl.createddate_logs_control =
                                                createddate_logs_control;
                                            fillterAlarmCtl.now_time_cal_control =
                                                now_time_cal_control;
                                            if (now_time_cal_control > time_life) {
                                                if (type_id2 > 1) {
                                                    var alarm_to_control = await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        fillterAlarm;
                                        var type_ctl = 2;
                                        var crsmaster_control = {};
                                        if (type_id2 > 1) {
                                            var alarm_to_control = await this.alarm_device_arr_to_event_control(fillterAlarmCtl);
                                        }
                                    }
                                    let fillterAlarmToCtl = {};
                                    fillterAlarmToCtl.mqttData = mqttData;
                                    fillterAlarmToCtl.merged = merged;
                                    fillterAlarmToCtl.value_data = fillterAlarmCtl.value_data;
                                    fillterAlarmToCtl.sensor_data = fillterAlarmCtl.sensor_data;
                                    fillterAlarmToCtl.data_alarm = fillterAlarmCtl.data_alarm;
                                    fillterAlarmToCtl.type_id = fillterAlarmCtl.type_id;
                                    fillterAlarmToCtl.alarmTypeId = fillterAlarmCtl.alarmTypeId;
                                    fillterAlarmToCtl.subject = fillterAlarmCtl.subject;
                                    fillterAlarmToCtl.content = fillterAlarmCtl.content;
                                    fillterAlarmToCtl.device_id_mas =
                                        fillterAlarmCtl.device_id_mas;
                                    fillterAlarmToCtl.device_id = fillterAlarmCtl.device_id;
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
                                            control: alarm_to_control,
                                        });
                                    }
                                }
                            }
                        }
                        var fillterAlarmMain = {};
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
                        var crsmaster_email = await this.settingsService.chk_alarmprocesslogemail(fillterAlarmMain);
                        var count_crsmaster_email = parseInt(crsmaster_email.length) || 0;
                        if (count_crsmaster_email >= 1) {
                            var createddate_logsMaim = format.timeConvertermas(format.convertTZ(crsmaster_email[0].createddate, process.env.tzString));
                            var now_time_cal_mains = format.diffMinutes(now_time_full, createddate_logsMaim);
                            var now_time_cal_main = parseInt(now_time_cal_mains);
                            if (now_time_cal_main > time_life) {
                                if (email_alarm == '1') {
                                    var alarm_to_email = await this.alarm_to_email(fillterAlarmMain);
                                }
                            }
                        }
                        else {
                            if (email_alarm == '1') {
                                var alarm_to_email = await this.alarm_to_email(fillterAlarmMain);
                            }
                        }
                        if (line_alarm == '1') {
                            var alarm_to_line = fillterAlarmMain['type_name'];
                        }
                        if (sms_alarm == '1') {
                            var alarm_to_sms = fillterAlarmMain['type_name'];
                        }
                        if (telegram_alarm == '1') {
                            var alarm_to_telegram = fillterAlarmMain['type_name'];
                        }
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
                            last_subject_log_control: crsmaster[0].subject,
                            last_create_log_control: createddate_logs_control,
                            config_alert,
                            control_device: alarmdevice_arr_rs,
                            count_crsmaster_email,
                            alarm_to_email,
                            alarm_to_line,
                            alarm_to_sms,
                            alarm_to_telegram,
                        });
                    }
                }
                else {
                    alarm_device_arr = [];
                }
                const DataRs = {
                    masterdata: alarm_config_mas,
                    alarmdevice: alarm_device_arr,
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
                    data: tempDataoid,
                },
                message: 'get alarmdevicestatus success.',
                message_th: 'get alarmdevicestatus success.',
            });
        }
        catch (error) {
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
    async monitordevicegroup(res, query, headers, params, req) {
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
        await redis_helper_1.redisHelper.connect();
        var isConnectedCache = await redis_helper_1.redisHelper.healthCheck();
        console.log('Redis connected:', isConnectedCache);
        var deletecache = query.deletecache;
        const isReady = redis_helper_1.redisHelper.isReady();
        var option = encodeURI(query.option) || 0;
        var bucket = encodeURI(query.bucket);
        var hardware_id = encodeURI(query.hardware_id) || '';
        var type_id = encodeURI(query.type_id) || '';
        var layout = query.layout || '';
        var filterMain = {};
        filterMain.bucket = bucket;
        var cache_key = 'device_count_monitordevicegroup_' +
            md5(bucket + hardware_id + type_id + layout + query.lang);
        var device_count = await redis_helper_1.redisHelper.GetCacheData(cache_key);
        var datacahe_status = 1;
        if (!device_count) {
            var datacahe_status = 0;
            var deviceMain = await this.settingsService.device_lists_id(filterMain);
            var device_count = deviceMain.length;
        }
        if (deletecache == 1) {
            await redis_helper_1.redisHelper.DeleteCacheData(cache_key);
        }
        var filterSetCacheData = {};
        filterSetCacheData.keycache = cache_key;
        filterSetCacheData.time = 60 * 60 * 1;
        filterSetCacheData.data = device_count;
        await redis_helper_1.redisHelper.SetCacheData(filterSetCacheData);
        const checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            const Mqttstatus = checkConnectionMqtt.status;
            if (Mqttstatus == 0) {
                return res.status(200).json({
                    statuscode: 200,
                    Mqttstatus,
                    payload: checkConnectionMqtt,
                    message: 'Mqtt Connection Has issue error',
                    message_th: 'การเชื่อมต่อ MQTT มีข้อผิดพลาด',
                });
            }
        }
        else {
            return res.status(200).json({
                statuscode: 200,
                Mqttstatus: 0,
                payload: [],
                message: 'Mqtt Connection lost',
                message_th: 'เชื่อมต่อ MQTT ไม่ได้',
            });
        }
        var monitordevicegroup = [];
        var monitordevicegroup_data = [];
        var monitordevicegroup_data1 = [];
        var cache_key = 'devicetype_monitordevicegroup_' +
            md5(bucket + hardware_id + type_id + layout + query.lang);
        var ResultData = await redis_helper_1.redisHelper.GetCacheData(cache_key);
        var datacahe_status = 1;
        if (!ResultData) {
            var datacahe_status = 0;
            var ResultData = await this.mqtt2Service.devicetype(query);
            var filterSetCacheData = {};
            filterSetCacheData.keycache = cache_key;
            filterSetCacheData.time = 60 * 60 * 1;
            filterSetCacheData.data = ResultData;
            await redis_helper_1.redisHelper.SetCacheData(filterSetCacheData);
        }
        else {
            if (deletecache == 1) {
                await redis_helper_1.redisHelper.DeleteCacheData(cache_key);
            }
        }
        if (ResultData) {
            for (const [key, value] of Object.entries(ResultData)) {
                var group = ResultData[key];
                var type_name = group.type_name;
                var type_id = group.type_id;
                var hardware_id = group.hardware_id;
                var filter = {};
                filter.hardware_id = group.hardware_id;
                filter.type_id = group.type_id;
                filter.bucket = query.bucket;
                filter.type_name = group.type_name;
                filter.deletecache = group.deletecache;
                filter.layout = layout;
                filter.lang = query.lang;
                var device = await this.getmonitordevicegroup(filter);
                var arraydatarr = {
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
        const cachestats = await redis_helper_1.redisHelper.getCacheStats();
        if (option == 1) {
            var info = monitordevicegroup_data1;
        }
        else {
            var info = [];
        }
        res.status(200).json({
            statusCode: 200,
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const layout = query.layout;
        const bucket = query.bucket;
        const type_id = query.type_id;
        const hardware_ids = query.hardware_id;
        const deletecache = query.deletecache;
        const date = format.getCurrentDatenow();
        const time = format.getCurrentTimenow();
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
        const timestamps = datePart + ' ' + timePart;
        try {
            const checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            const filter = {};
            filter.bucket = bucket;
            filter.type_id = type_id;
            filter.layout = layout;
            filter.hardware_id = hardware_ids;
            var cache_key = 'get_monitor_device_group_alert_' +
                md5(bucket + hardware_ids + type_id + query.lang);
            var device = await redis_helper_1.redisHelper.GetCacheData(cache_key);
            var datacahe_status = 1;
            if (!device) {
                var datacahe_status = 0;
                const device = await this.settingsService.device_lists_id(filter);
                var filterSetCacheData = {};
                filterSetCacheData.keycache = cache_key;
                filterSetCacheData.time = 60 * 60 * 1;
                filterSetCacheData.data = device;
                await redis_helper_1.redisHelper.SetCacheData(filterSetCacheData);
            }
            else {
                if (deletecache == 1) {
                    await redis_helper_1.redisHelper.DeleteCacheData(cache_key);
                }
            }
            const device_count = device.length;
            if (device && device_count > 0) {
                const deviceDataMain1 = device[0];
                const deviceDataMain = deviceDataMain1;
                const topic = deviceDataMain1.mqtt_data_value;
                const mqtt_data_control = deviceDataMain1.mqtt_data_control;
                const configdata = deviceDataMain1.mqtt_status_data_name;
                const device_name = deviceDataMain1.device_name;
                const mqttdata = await this.mqtt2Service.getdMqttdataTopics(topic);
                var timestamp = mqttdata.timestamp;
                let mqttdata_arrs;
                let mqttdata_arrs_data;
                if (mqttdata) {
                    mqttdata_arrs = mqttdata;
                    mqttdata_arrs_data = mqttdata.data;
                }
                else {
                    mqttdata_arrs = [];
                    mqttdata_arrs_data = [];
                }
                const deviceData = [];
                for (const [key, va] of Object.entries(device)) {
                    const RSdata = {};
                    let obj = [];
                    try {
                        obj = JSON.parse(configdata);
                    }
                    catch (e) {
                        throw e;
                    }
                    const mqtt_objt_data = Object.values(obj);
                    let obj2 = [];
                    try {
                        obj2 = JSON.parse(configdata);
                    }
                    catch (e) {
                        throw e;
                    }
                    var mqttdata_arr = mqttdata_arrs_data;
                    var mqtt_obj2_data = Object.values(obj2);
                    var mqttData_count = mqttdata_arr.length;
                    var mqttData = Object.fromEntries(mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]));
                    var merged_dataRs = format.mapMqttDataToDevices([va], mqttData);
                    var merged_data = merged_dataRs[0];
                    const merged2 = format.mapMqttDataToDeviceV2([va], mqttData);
                    const merged = merged2['0'];
                    const currentTypeId = device[key].type_id;
                    const currentHardwareId = parseFloat(device[key].hardware_id);
                    let value_data;
                    let value_alarm;
                    let value_relay;
                    let value_control_relay;
                    let status_alert;
                    let status_warning;
                    let recovery_warning;
                    let recovery_alert;
                    if (merged) {
                        if (currentHardwareId > 1) {
                            value_data = (_a = parseFloat(merged.value_data)) !== null && _a !== void 0 ? _a : parseFloat('0');
                            value_alarm = (_b = parseFloat(merged.value_alarm)) !== null && _b !== void 0 ? _b : parseFloat('0');
                            value_relay = (_c = parseFloat(merged.value_relay)) !== null && _c !== void 0 ? _c : parseFloat('0');
                            value_control_relay =
                                (_d = parseFloat(merged.value_control_relay)) !== null && _d !== void 0 ? _d : parseFloat('0');
                            status_alert =
                                (_e = parseFloat(device[key].status_alert)) !== null && _e !== void 0 ? _e : parseFloat('0');
                            status_warning =
                                (_f = parseFloat(device[key].status_warning)) !== null && _f !== void 0 ? _f : parseFloat('0');
                            recovery_warning =
                                (_g = parseFloat(device[key].recovery_warning)) !== null && _g !== void 0 ? _g : parseFloat('1');
                            recovery_alert =
                                (_h = parseFloat(device[key].recovery_alert)) !== null && _h !== void 0 ? _h : parseFloat('1');
                        }
                        else {
                            value_data = merged.value_data;
                            value_alarm = merged.value_alarm;
                            value_relay = merged.value_relay;
                            value_control_relay = merged.value_control_relay || 0;
                            status_alert = device[key].status_alert;
                            status_warning = device[key].status_warning;
                            recovery_warning = device[key].recovery_warning;
                            recovery_alert = device[key].recovery_alert;
                        }
                    }
                    else {
                        if (currentTypeId > 1) {
                            value_data = parseFloat('0');
                            value_alarm = parseFloat('0');
                            value_relay = parseFloat('0');
                            value_control_relay = parseFloat('0');
                            status_alert = parseFloat('0');
                            status_warning = parseFloat('0');
                            recovery_warning = parseFloat('1');
                            recovery_alert = parseFloat('1');
                        }
                        else {
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
                    var unit = device[key].unit;
                    var topicData = device[key].mqtt_data_value;
                    var topicControl = device[key].mqtt_data_control;
                    var control = device[key].mqtt_data_control;
                    var mqtt_control_on = encodeURI(device[key].mqtt_control_on);
                    var mqtt_control_off = encodeURI(device[key].mqtt_control_off);
                    var mqtt_name = device[key].mqtt_name;
                    var measurement = device[key].measurement;
                    var filterAlarmValidate = {};
                    filterAlarmValidate.type_id = currentTypeId;
                    filterAlarmValidate.value_data = value_data;
                    filterAlarmValidate.max = (_j = device[key].max) !== null && _j !== void 0 ? _j : '';
                    filterAlarmValidate.min = (_k = device[key].min) !== null && _k !== void 0 ? _k : '';
                    filterAlarmValidate.unit = unit;
                    filterAlarmValidate.value_alarm = value_alarm;
                    filterAlarmValidate.value_relay = value_relay;
                    filterAlarmValidate.value_control_relay = value_control_relay;
                    filterAlarmValidate.sensorValueData = encodeURI(value_data);
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
                    const lang = query.lang;
                    if (lang == 'th') {
                        var getAlarmDetails = await iothelper.AlarmDetailValidateTh(filterAlarmValidate);
                    }
                    else {
                        var getAlarmDetails = await iothelper.AlarmDetailValidate(filterAlarmValidate);
                    }
                    RSdata.device_id = device[key].device_id;
                    if (currentHardwareId == 1) {
                        RSdata.device_type = 'Sensor';
                    }
                    else {
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
                        }
                        else {
                            RSdata.icon_access = device[key].icon_on;
                            RSdata.devicedata = 'ON';
                            RSdata.control =
                                Url_api +
                                    '/v1/mqtt2/control?topic=' +
                                    topicControl +
                                    '&message=' +
                                    mqtt_control_on;
                        }
                    }
                    else {
                        RSdata.control = [];
                        RSdata.devicedata = value_data + ' ' + unit;
                    }
                    RSdata.getAlarmDetails = getAlarmDetails;
                    RSdata.sensercharts =
                        Url_api +
                            '/v1/mqtt2/sensercharts?bucket=' +
                            device[key].mqtt_bucket +
                            '&measurement=' +
                            device[key].measurement;
                    deviceData.push(RSdata);
                }
                var layout_name_conf = deviceData['0'].layout;
                if (layout_name_conf == 1) {
                    var layout_name = 'menu';
                }
                else {
                    var layout_name = 'card';
                }
                var payload = {
                    bucket,
                    timestamps,
                    device_count,
                    layout: deviceData['0'].layout,
                    layout_name: layout_name,
                    group_name: deviceData['0'].type_name,
                    device_type: deviceData['0'].device_type,
                    alarm_configuration: deviceData['0'].alarm_configuration,
                    data: deviceData,
                };
                return payload;
            }
            else {
                var payload = {
                    bucket,
                    timestamps,
                    device_count: 0,
                    group_name: [],
                    device_type: [],
                    alarm_configuration: [],
                    data: [],
                    filterAlarmValidate,
                };
                return payload;
            }
        }
        catch (error) {
            var payload = {
                statusCode: 500,
                payload: null,
                message: 'Mqtt Internal server error 500',
                message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
                error: error.message || error,
            };
            return payload;
        }
    }
    async senser_chart(query) {
        const start = query.start || '-8m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '8m';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
        if (!bucket) {
            var DataRs = 'Bucket  is null';
            return DataRs;
        }
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '8m';
        const limit = query.limit || 120;
        const offset = query.offset || 0;
        const mean = query.mean || 'last';
        const Dtos = {
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
        console.info(Dtos);
        var deletecache = query.deletecache;
        var kaycache1 = 'senser_chart_start_to_end_v1_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache1);
        }
        var data = await Cache.GetCacheData(kaycache1);
        if (!data) {
            var data = await this.IotService.influxdbFilterData(Dtos);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 120,
                data: data,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        const Dtos2 = {
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
        console.info(Dtos2);
        var kaycache2 = 'senser_chart_start_to_end_v2_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache2);
        }
        var data1 = await Cache.GetCacheData(kaycache2);
        if (!data1) {
            var data1 = await this.IotService.influxdbFilterchart1(Dtos2);
            var InpuDatacache = {
                keycache: `${kaycache2}`,
                time: 120,
                data: data1,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        var kaycache3 = 'senser_chart_start_to_end_v3_' +
            md5(start +
                stop +
                windowPeriod +
                tzString +
                bucket +
                measurement +
                field +
                time +
                limit +
                offset +
                mean);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache3);
        }
        var data2 = await Cache.GetCacheData(kaycache3);
        if (!data2) {
            var data2 = await this.IotService.influxdbFilterchart2(Dtos2);
            var InpuDatacache = {
                keycache: `${kaycache3}`,
                time: 120,
                data: data2,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (!data) {
            var rss = {
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
        }
        else {
            var rss = {
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
    async parseMqttData(dataString) {
        const parts = dataString.split(',');
        return {
            device: parts[0],
            name: parseFloat(parts[1]),
            data: parts,
        };
    }
    async alarm_device_arr_to_event_control(dto) {
        var status_del = 0;
        var parsedCounts = 0;
        var countAlarmDeviceControl = 0;
        var validate_count = 0;
        if (!dto) {
            throw new Error('DTO is required');
        }
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
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
        var timestamps = datePart + ' ' + timePart;
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            var Mqttstatus = checkConnectionMqtt.status;
        }
        else {
            var Mqttstatus = false;
        }
        var setOption = dto.setOption;
        var cachetimeset = dto.cachetimeset;
        var cachetimeset1 = dto.cachetimeset1;
        var cachetimeset2 = dto.cachetimeset2;
        var cachetimeset3 = dto.cachetimeset3;
        var cachetimeset4 = dto.cachetimeset4;
        var deletecache = dto.deletecache;
        var kaycache_cache_a1 = dto.kaycache_cache_a1;
        var device_id2 = parseInt(dto.device_id2);
        var alarm_action_id = parseInt(dto.alarm_action_id);
        var device_id_mas = parseInt(dto.device_id_mas);
        if (!dto.device_id_mas) {
            var device_id_mas = parseInt(dto.device_id);
        }
        var crsmasterio = dto.crsmasterio;
        var countalarm_master_io = dto.countalarm_master_io;
        var device_control = dto.device_control;
        var device_control_map_count = dto.device_control_map_count;
        var event = parseInt(dto.event);
        var eventSet = parseInt(dto.event);
        var time_life = dto.time_life;
        var bucket = dto.bucket;
        var location_id = dto.location_id;
        var device_id = dto.device_id;
        var values = dto.values;
        var mqtt_data_value = dto.mqtt_data_value;
        var mqtt_data_control = dto.mqtt_data_control;
        var configdata = dto.configdata;
        var mqtt_status_data_name = dto.mqtt_status_data_name;
        var type_id = parseInt(dto.type_id);
        var alarmTypeId = type_id;
        var status_alert = dto.status_alert;
        var status_warning = dto.status_warning;
        var recovery_warning = dto.recovery_warning;
        var recovery_alert = dto.recovery_alert;
        var mqtt_name = dto.mqtt_name;
        var device_name = dto.device_name;
        var action_name = dto.action_name;
        var mqtt_control_on = dto.mqtt_control_on;
        var mqtt_control_off = dto.mqtt_control_off;
        var alarm_action_id = parseInt(dto.alarm_action_id);
        var subject = dto.subject;
        var content = dto.content;
        var status = dto.status;
        var alarmStatusSet = parseInt(dto.alarmStatusSet);
        var dataAlarm = dto.dataAlarm;
        var eventControl = dto.eventControl;
        var messageMqttControl = dto.messageMqttControl;
        var sensor_data = dto.sensor_data;
        var count_alarm = dto.count_alarm;
        var mqttconnect = [];
        var dtos = {};
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
            var validate_count = parseInt('3');
        }
        else if (alarmStatusSet == 2) {
            var validate_count = parseInt('3');
        }
        else if (alarmStatusSet == 3) {
            var validate_count = parseInt('1');
        }
        else {
            var validate_count = parseInt('1');
        }
        var fillterDataSENSOR = {};
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
        }
        else if (alarmStatusSet == 2) {
            fillterDataSENSOR.status_alert = dto.status_alert;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        else if (alarmStatusSet == 3) {
            fillterDataSENSOR.recovery_warning = dto.recovery_warning;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        else if (alarmStatusSet == 4) {
            fillterDataSENSOR.recovery_alert = dto.recovery_alert;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        var inputCreate = {
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
        var deviceFillter = {
            alarm_action_id: alarm_action_id,
            device_id: dto.device_id2,
            device_id_mas: device_id_mas,
            bucket: bucket,
        };
        var kaycachecache = 'alarm_device_id_event_rss_iot_crt' +
            md5(alarm_action_id + '-' + device_id + '-' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycachecache);
        }
        var device = await Cache.GetCacheData(kaycachecache);
        if (device) {
            var device = device;
        }
        else if (!device) {
            var device = await this.settingsService.alarm_device_id_event_crt(deviceFillter);
            var rs = {
                keycache: `${kaycachecache}`,
                time: cachetimeset,
                data: device,
            };
            await Cache.SetCacheData(rs);
            var cache_data_alarmdevice = 'no cache';
        }
        try {
            if (alarmStatusSet === 1 || alarmStatusSet === 2) {
                var mqtt_get_data = encodeURI(mqtt_data_value);
                var mqtt_access_control = encodeURI(mqtt_data_control);
                if (event == 1) {
                    var messageMqttControls = mqtt_control_on;
                    var eventSet = parseInt('1');
                }
                else {
                    var messageMqttControls = mqtt_control_off;
                    var eventSet = parseInt('0');
                }
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id2;
                var countAlarmDeviceControl = parseInt('0');
                try {
                    const countResult = await this.settingsService.count_alarmprocesslog(fillter_device_control);
                    if (countResult !== null && countResult !== undefined) {
                        const parsedCount = parseInt(countResult.toString(), 10);
                        countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
                    }
                }
                catch (error) {
                    console.error('Error counting alarm process log:', error);
                    countAlarmDeviceControl = 0;
                }
                if (countAlarmDeviceControl >= 1) {
                    if (alarmStatusSet == 999) {
                        var status_del = 1;
                        await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                    }
                }
                if (countAlarmDeviceControl == 0) {
                    var Option = 1;
                    var msg = 'device_access_control_new';
                    var rs1 = 0;
                    var fillterData = {};
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
                    }
                    else if (alarmStatusSet == 2) {
                        fillterData.status_alert = dto.status_alert;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    else if (alarmStatusSet == 3) {
                        fillterData.recovery_warning = dto.recovery_warning;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    else if (alarmStatusSet == 4) {
                        fillterData.recovery_alert = dto.recovery_alert;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    var isDuplicate = await this.settingsService.checkDuplicateLogOne(inputCreate);
                    if (!isDuplicate) {
                        await this.settingsService.manageAlarmLogRecovery(inputCreate, fillterData, validate_count);
                    }
                    await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
                }
                else {
                    var inputCreate = {
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
                    var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                    var setdatachk_main = {};
                    setdatachk_main.alarm_action_id = alarm_action_id;
                    setdatachk_main.device_id = device_id2;
                    var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
                    if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
                        var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                    }
                    else {
                        var createddate_logs_control = null;
                    }
                    var countalarm_LogSensor = 0;
                    if (crsmaster && Array.isArray(crsmaster)) {
                        countalarm_LogSensor = crsmaster.length;
                    }
                    if (crsmaster && crsmaster.length > 0) {
                        var createddate_logsMaim = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                        var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logsMaim));
                        if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
                            var mqttconnect = [];
                            var setdatachk_main = {};
                            setdatachk_main.alarm_action_id = alarm_action_id;
                            setdatachk_main.device_id = device_id2;
                            setdatachk_main.alarm_status = alarmStatusSet;
                            setdatachk_main.date = format.getCurrentDatenow();
                            setdatachk_main.time = format.getCurrentTimenow();
                            var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                            var countalarm_LogSensor = 0;
                            if (crsmaster && Array.isArray(crsmaster)) {
                                countalarm_LogSensor = crsmaster.length;
                            }
                            if (countalarm_LogSensor == 0) {
                                var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                                if (!isDuplicate) {
                                    await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                                }
                            }
                            if (countalarm_LogSensor >= validate_count) {
                                if (alarmStatusSet == 999) {
                                    const fillter_device_control = {};
                                    fillter_device_control.alarm_action_id = alarm_action_id;
                                    fillter_device_control.alarm_status = alarmStatusSet;
                                    var status_del = 2;
                                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                                    return { msg, alarmStatusSet };
                                }
                            }
                            var devicecontroliot = [];
                            if (device) {
                                for (const [key, value] of Object.entries(device)) {
                                    var va = device[key];
                                    var device_id = va.device_id;
                                    var mqtt_id = va.mqtt_id;
                                    var setting_id = va.setting_id;
                                    var action_id = va.action_id;
                                    var status_alert_id = va.status_alert_id;
                                    var type_ids = va.type_id;
                                    var device_name = va.device_name;
                                    var work_status = va.work_status;
                                    var mqtt_data_value = va.mqtt_data_value;
                                    var mqtt_data_control = va.mqtt_data_control;
                                    var measurement = va.measurement;
                                    var mqtt_control_on = va.mqtt_control_on;
                                    var mqtt_control_off = va.mqtt_control_off;
                                    var bucket = va.bucket;
                                    var timestamp = va.timestamp;
                                    var mqtt_device_name = va.mqtt_device_name;
                                    var id = va.id;
                                    var alarm_action_ids = va.alarm_action_id;
                                    var mqtt_get_data = encodeURI(mqtt_data_value);
                                    var mqtt_data_control = encodeURI(mqtt_data_control);
                                    if (event == 1) {
                                        var messageMqttControls = encodeURI(mqtt_control_on);
                                        var eventSet = 1;
                                    }
                                    else {
                                        var messageMqttControls = encodeURI(mqtt_control_off);
                                        var eventSet = 0;
                                    }
                                    await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
                                    var arraydatarr = {
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
            }
            else if (alarmStatusSet === 3 || alarmStatusSet === 4) {
                var rs = await this.device_access_control_check(dtos);
                var mqttconnect = [];
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id;
                setdatachk_main.alarm_status = alarmStatusSet;
                setdatachk_main.date = format.getCurrentDatenow();
                setdatachk_main.time = format.getCurrentTimenow();
                var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                var countalarm_LogSensor = 0;
                if (crsmaster && Array.isArray(crsmaster)) {
                    countalarm_LogSensor = crsmaster.length;
                }
                if (countalarm_LogSensor == 0) {
                    var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                    if (!isDuplicate) {
                        await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                    }
                    var devicecontroliot = [];
                    if (device) {
                        for (const [key, value] of Object.entries(device)) {
                            var va = device[key];
                            var device_id = va.device_id;
                            var mqtt_id = va.mqtt_id;
                            var setting_id = va.setting_id;
                            var action_id = va.action_id;
                            var status_alert_id = va.status_alert_id;
                            var type_ids = va.type_id;
                            var device_name = va.device_name;
                            var work_status = va.work_status;
                            var mqtt_data_value = va.mqtt_data_value;
                            var mqtt_data_controls = va.mqtt_data_control;
                            var measurement = va.measurement;
                            var mqtt_control_on = va.mqtt_control_on;
                            var mqtt_control_off = va.mqtt_control_off;
                            var bucket = va.bucket;
                            var timestamp = va.timestamp;
                            var mqtt_device_name = va.mqtt_device_name;
                            var id = va.id;
                            var alarm_action_ids = va.alarm_action_id;
                            var mqtt_get_data = encodeURI(mqtt_data_value);
                            var mqtt_data_control = encodeURI(mqtt_data_controls);
                            if (event == 1) {
                                var messageMqttControls = encodeURI(mqtt_control_on);
                                var eventSet = 1;
                            }
                            else {
                                var messageMqttControls = encodeURI(mqtt_control_off);
                                var eventSet = 0;
                            }
                            await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                            var arraydatarr = {
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
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    fillter_device_control.alarm_status = alarmStatusSet;
                    var status_del = 3;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                    return alarmStatusSet;
                    var devicecontroliot = [];
                    if (device) {
                        for (const [key, value] of Object.entries(device)) {
                            var va = device[key];
                            var device_id = va.device_id;
                            var mqtt_id = va.mqtt_id;
                            var setting_id = va.setting_id;
                            var action_id = va.action_id;
                            var status_alert_id = va.status_alert_id;
                            var type_ids = va.type_id;
                            var device_name = va.device_name;
                            var work_status = va.work_status;
                            var mqtt_data_value = va.mqtt_data_value;
                            var mqtt_data_control = va.mqtt_data_control;
                            var measurement = va.measurement;
                            var mqtt_control_on = va.mqtt_control_on;
                            var mqtt_control_off = va.mqtt_control_off;
                            var bucket = va.bucket;
                            var timestamp = va.timestamp;
                            var mqtt_device_name = va.mqtt_device_name;
                            var id = va.id;
                            var alarm_action_ids = va.alarm_action_id;
                            var mqtt_get_data = encodeURI(mqtt_data_value);
                            var mqtt_data_control = encodeURI(mqtt_data_control);
                            if (event == 1) {
                                var messageMqttControls = encodeURI(mqtt_control_on);
                                var eventSet = 1;
                            }
                            else {
                                var messageMqttControls = encodeURI(mqtt_control_off);
                                var eventSet = 0;
                            }
                            await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                            var arraydatarr = {
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
            else if (alarmStatusSet === 999) {
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id;
                var countAlarmDeviceControl = 0;
                try {
                    const countResult = await this.settingsService.count_alarmprocesslog(fillter_device_control);
                    if (countResult !== null && countResult !== undefined) {
                        const parsedCount = parseInt(countResult.toString(), 10);
                        countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
                    }
                }
                catch (error) {
                    countAlarmDeviceControl = 0;
                    console.error(`Error processing :`, error);
                }
                if (countAlarmDeviceControl >= validate_count) {
                    var status_del = 4;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                }
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id;
                var parsedCount = await this.settingsService.count_alarmprocesslog(setdatachk_main);
                if (parsedCount >= validate_count) {
                    var status_del = 5;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                }
            }
        }
        catch (error) {
            console.error('Error in alarm processing:', error);
            throw new Error(`Alarm processing failed: ${error.message}`);
        }
        var Rss = {
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
    async alarm_device_arr_to_event_email(dto) {
        var status_del = 0;
        var parsedCounts = 0;
        var countAlarmDeviceControl = 0;
        var validate_count = 0;
        if (!dto) {
            throw new Error('DTO is required');
        }
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
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
        var timestamps = datePart + ' ' + timePart;
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            var Mqttstatus = checkConnectionMqtt.status;
        }
        else {
            var Mqttstatus = false;
        }
        var setOption = dto.setOption;
        var cachetimeset = dto.cachetimeset;
        var cachetimeset1 = dto.cachetimeset1;
        var cachetimeset2 = dto.cachetimeset2;
        var cachetimeset3 = dto.cachetimeset3;
        var cachetimeset4 = dto.cachetimeset4;
        var deletecache = dto.deletecache;
        var kaycache_cache_a1 = dto.kaycache_cache_a1;
        var device_id2 = parseInt(dto.device_id2);
        var alarm_action_id = parseInt(dto.alarm_action_id);
        var device_id_mas = parseInt(dto.device_id_mas);
        if (!dto.device_id_mas) {
            var device_id_mas = parseInt(dto.device_id);
        }
        var crsmasterio = dto.crsmasterio;
        var countalarm_master_io = dto.countalarm_master_io;
        var device_control = dto.device_control;
        var device_control_map_count = dto.device_control_map_count;
        var event = parseInt(dto.event);
        var eventSet = parseInt(dto.event);
        var time_life = dto.time_life;
        var bucket = dto.bucket;
        var location_id = dto.location_id;
        var device_id = dto.device_id;
        var values = dto.values;
        var mqtt_data_value = dto.mqtt_data_value;
        var mqtt_data_control = dto.mqtt_data_control;
        var configdata = dto.configdata;
        var mqtt_status_data_name = dto.mqtt_status_data_name;
        var type_id = parseInt(dto.type_id);
        var alarmTypeId = type_id;
        var status_alert = dto.status_alert;
        var status_warning = dto.status_warning;
        var recovery_warning = dto.recovery_warning;
        var recovery_alert = dto.recovery_alert;
        var mqtt_name = dto.mqtt_name;
        var device_name = dto.device_name;
        var action_name = dto.action_name;
        var mqtt_control_on = dto.mqtt_control_on;
        var mqtt_control_off = dto.mqtt_control_off;
        var alarm_action_id = parseInt(dto.alarm_action_id);
        var subject = dto.subject;
        var content = dto.content;
        var status = dto.status;
        var alarmStatusSet = parseInt(dto.alarmStatusSet);
        var dataAlarm = dto.dataAlarm;
        var eventControl = dto.eventControl;
        var messageMqttControl = dto.messageMqttControl;
        var sensor_data = dto.sensor_data;
        var count_alarm = dto.count_alarm;
        var mqttconnect = [];
        var dtos = {};
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
            var validate_count = parseInt('3');
        }
        else if (alarmStatusSet == 2) {
            var validate_count = parseInt('3');
        }
        else if (alarmStatusSet == 3) {
            var validate_count = parseInt('1');
        }
        else {
            var validate_count = parseInt('1');
        }
        var fillterDataSENSOR = {};
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
        }
        else if (alarmStatusSet == 2) {
            fillterDataSENSOR.status_alert = dto.status_alert;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        else if (alarmStatusSet == 3) {
            fillterDataSENSOR.recovery_warning = dto.recovery_warning;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        else if (alarmStatusSet == 4) {
            fillterDataSENSOR.recovery_alert = dto.recovery_alert;
            fillterDataSENSOR.alarm_status = alarmStatusSet;
        }
        var inputCreate = {
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
        var deviceFillter = {
            alarm_action_id: alarm_action_id,
            device_id: dto.device_id2,
            device_id_mas: device_id_mas,
            bucket: bucket,
        };
        var kaycachecache = 'alarm_device_id_event_rss_iot_crt' +
            md5(alarm_action_id + '-' + device_id + '-' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycachecache);
        }
        var device = await Cache.GetCacheData(kaycachecache);
        if (device) {
            var device = device;
        }
        else if (!device) {
            var device = await this.settingsService.alarm_device_id_event_crt(deviceFillter);
            var rs = {
                keycache: `${kaycachecache}`,
                time: cachetimeset,
                data: device,
            };
            await Cache.SetCacheData(rs);
            var cache_data_alarmdevice = 'no cache';
        }
        try {
            if (alarmStatusSet === 1 || alarmStatusSet === 2) {
                var mqtt_get_data = encodeURI(mqtt_data_value);
                var mqtt_access_control = encodeURI(mqtt_data_control);
                if (event == 1) {
                    var messageMqttControls = mqtt_control_on;
                    var eventSet = parseInt('1');
                }
                else {
                    var messageMqttControls = mqtt_control_off;
                    var eventSet = parseInt('0');
                }
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id2;
                var countAlarmDeviceControl = parseInt('0');
                try {
                    const countResult = await this.settingsService.count_alarmprocesslog(fillter_device_control);
                    if (countResult !== null && countResult !== undefined) {
                        const parsedCount = parseInt(countResult.toString(), 10);
                        countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
                    }
                }
                catch (error) {
                    console.error('Error counting alarm process log:', error);
                    countAlarmDeviceControl = 0;
                }
                if (countAlarmDeviceControl >= 1) {
                    if (alarmStatusSet == 999) {
                        var status_del = 1;
                        await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                    }
                }
                if (countAlarmDeviceControl == 0) {
                    var Option = 1;
                    var msg = 'device_access_control_new';
                    var rs1 = 0;
                    var fillterData = {};
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
                    }
                    else if (alarmStatusSet == 2) {
                        fillterData.status_alert = dto.status_alert;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    else if (alarmStatusSet == 3) {
                        fillterData.recovery_warning = dto.recovery_warning;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    else if (alarmStatusSet == 4) {
                        fillterData.recovery_alert = dto.recovery_alert;
                        fillterData.alarm_status = alarmStatusSet;
                    }
                    var isDuplicate = await this.settingsService.checkDuplicateLogOne(inputCreate);
                    if (!isDuplicate) {
                        await this.settingsService.manageAlarmLogRecovery(inputCreate, fillterData, validate_count);
                    }
                    await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
                }
                else {
                    var inputCreate = {
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
                    var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                    var setdatachk_main = {};
                    setdatachk_main.alarm_action_id = alarm_action_id;
                    setdatachk_main.device_id = device_id2;
                    var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
                    if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
                        var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                    }
                    else {
                        var createddate_logs_control = null;
                    }
                    var countalarm_LogSensor = 0;
                    if (crsmaster && Array.isArray(crsmaster)) {
                        countalarm_LogSensor = crsmaster.length;
                    }
                    if (crsmaster && crsmaster.length > 0) {
                        var createddate_logsMaim = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                        var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logsMaim));
                        if (!isNaN(now_time_cal_main) && now_time_cal_main > time_life) {
                            var mqttconnect = [];
                            var setdatachk_main = {};
                            setdatachk_main.alarm_action_id = alarm_action_id;
                            setdatachk_main.device_id = device_id2;
                            setdatachk_main.alarm_status = alarmStatusSet;
                            setdatachk_main.date = format.getCurrentDatenow();
                            setdatachk_main.time = format.getCurrentTimenow();
                            var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                            var countalarm_LogSensor = 0;
                            if (crsmaster && Array.isArray(crsmaster)) {
                                countalarm_LogSensor = crsmaster.length;
                            }
                            if (countalarm_LogSensor == 0) {
                                var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                                if (!isDuplicate) {
                                    await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                                }
                            }
                            if (countalarm_LogSensor >= validate_count) {
                                if (alarmStatusSet == 999) {
                                    const fillter_device_control = {};
                                    fillter_device_control.alarm_action_id = alarm_action_id;
                                    fillter_device_control.alarm_status = alarmStatusSet;
                                    var status_del = 2;
                                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                                    return { msg, alarmStatusSet };
                                }
                            }
                            var devicecontroliot = [];
                            if (device) {
                                for (const [key, value] of Object.entries(device)) {
                                    var va = device[key];
                                    var device_id = va.device_id;
                                    var mqtt_id = va.mqtt_id;
                                    var setting_id = va.setting_id;
                                    var action_id = va.action_id;
                                    var status_alert_id = va.status_alert_id;
                                    var type_ids = va.type_id;
                                    var device_name = va.device_name;
                                    var work_status = va.work_status;
                                    var mqtt_data_value = va.mqtt_data_value;
                                    var mqtt_data_control = va.mqtt_data_control;
                                    var measurement = va.measurement;
                                    var mqtt_control_on = va.mqtt_control_on;
                                    var mqtt_control_off = va.mqtt_control_off;
                                    var bucket = va.bucket;
                                    var timestamp = va.timestamp;
                                    var mqtt_device_name = va.mqtt_device_name;
                                    var id = va.id;
                                    var alarm_action_ids = va.alarm_action_id;
                                    var mqtt_get_data = encodeURI(mqtt_data_value);
                                    var mqtt_data_control = encodeURI(mqtt_data_control);
                                    if (event == 1) {
                                        var messageMqttControls = encodeURI(mqtt_control_on);
                                        var eventSet = 1;
                                    }
                                    else {
                                        var messageMqttControls = encodeURI(mqtt_control_off);
                                        var eventSet = 0;
                                    }
                                    await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
                                    var arraydatarr = {
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
            }
            else if (alarmStatusSet === 3 || alarmStatusSet === 4) {
                var rs = await this.device_access_control_check(dtos);
                var mqttconnect = [];
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id;
                setdatachk_main.alarm_status = alarmStatusSet;
                setdatachk_main.date = format.getCurrentDatenow();
                setdatachk_main.time = format.getCurrentTimenow();
                var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                var countalarm_LogSensor = 0;
                if (crsmaster && Array.isArray(crsmaster)) {
                    countalarm_LogSensor = crsmaster.length;
                }
                if (countalarm_LogSensor == 0) {
                    var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                    if (!isDuplicate) {
                        await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                    }
                    var devicecontroliot = [];
                    if (device) {
                        for (const [key, value] of Object.entries(device)) {
                            var va = device[key];
                            var device_id = va.device_id;
                            var mqtt_id = va.mqtt_id;
                            var setting_id = va.setting_id;
                            var action_id = va.action_id;
                            var status_alert_id = va.status_alert_id;
                            var type_ids = va.type_id;
                            var device_name = va.device_name;
                            var work_status = va.work_status;
                            var mqtt_data_value = va.mqtt_data_value;
                            var mqtt_data_controls = va.mqtt_data_control;
                            var measurement = va.measurement;
                            var mqtt_control_on = va.mqtt_control_on;
                            var mqtt_control_off = va.mqtt_control_off;
                            var bucket = va.bucket;
                            var timestamp = va.timestamp;
                            var mqtt_device_name = va.mqtt_device_name;
                            var id = va.id;
                            var alarm_action_ids = va.alarm_action_id;
                            var mqtt_get_data = encodeURI(mqtt_data_value);
                            var mqtt_data_control = encodeURI(mqtt_data_controls);
                            if (event == 1) {
                                var messageMqttControls = encodeURI(mqtt_control_on);
                                var eventSet = 1;
                            }
                            else {
                                var messageMqttControls = encodeURI(mqtt_control_off);
                                var eventSet = 0;
                            }
                            await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                            var arraydatarr = {
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
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    fillter_device_control.alarm_status = alarmStatusSet;
                    var status_del = 3;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                    return alarmStatusSet;
                    var devicecontroliot = [];
                    if (device) {
                        for (const [key, value] of Object.entries(device)) {
                            var va = device[key];
                            var device_id = va.device_id;
                            var mqtt_id = va.mqtt_id;
                            var setting_id = va.setting_id;
                            var action_id = va.action_id;
                            var status_alert_id = va.status_alert_id;
                            var type_ids = va.type_id;
                            var device_name = va.device_name;
                            var work_status = va.work_status;
                            var mqtt_data_value = va.mqtt_data_value;
                            var mqtt_data_control = va.mqtt_data_control;
                            var measurement = va.measurement;
                            var mqtt_control_on = va.mqtt_control_on;
                            var mqtt_control_off = va.mqtt_control_off;
                            var bucket = va.bucket;
                            var timestamp = va.timestamp;
                            var mqtt_device_name = va.mqtt_device_name;
                            var id = va.id;
                            var alarm_action_ids = va.alarm_action_id;
                            var mqtt_get_data = encodeURI(mqtt_data_value);
                            var mqtt_data_control = encodeURI(mqtt_data_control);
                            if (event == 1) {
                                var messageMqttControls = encodeURI(mqtt_control_on);
                                var eventSet = 1;
                            }
                            else {
                                var messageMqttControls = encodeURI(mqtt_control_off);
                                var eventSet = 0;
                            }
                            await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                            var arraydatarr = {
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
            else if (alarmStatusSet === 999) {
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.device_id = device_id;
                var countAlarmDeviceControl = 0;
                try {
                    const countResult = await this.settingsService.count_alarmprocesslog(fillter_device_control);
                    if (countResult !== null && countResult !== undefined) {
                        const parsedCount = parseInt(countResult.toString(), 10);
                        countAlarmDeviceControl = isNaN(parsedCount) ? 0 : parsedCount;
                    }
                }
                catch (error) {
                    countAlarmDeviceControl = 0;
                    console.error(`Error processing :`, error);
                }
                if (countAlarmDeviceControl >= validate_count) {
                    var status_del = 4;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                }
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id;
                var parsedCount = await this.settingsService.count_alarmprocesslog(setdatachk_main);
                if (parsedCount >= validate_count) {
                    var status_del = 5;
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                }
            }
        }
        catch (error) {
            console.error('Error in alarm processing:', error);
            throw new Error(`Alarm processing failed: ${error.message}`);
        }
        var Rss = {
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
    async mqtt_control_device(mqtt_data_control, messageMqttControls) {
        var _a;
        try {
            var topic_sends = encodeURI(mqtt_data_control);
            var message_sends = encodeURI(messageMqttControls);
            var devicecontrol = await this.mqtt2Service.devicecontrol(topic_sends, message_sends);
            console.log(`2-devicecontrol=>`);
            console.info(devicecontrol);
            const device_status = (_a = devicecontrol['dataObject']) === null || _a === void 0 ? void 0 : _a.device_status;
            return device_status;
        }
        catch (error) {
            console.error('mqtt_control_deviceerror:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
        }
    }
    async alarm_to_control(dto) {
        var alarm_action_id = dto.alarm_action_id;
        var device_id_mas = dto.device_id;
        var bucket = dto.bucket;
        var cachetimeset = dto.cachetimeset;
        var cachetimeset1 = dto.cachetimeset1;
        var cachetimeset2 = dto.cachetimeset2;
        var cachetimeset3 = dto.cachetimeset3;
        var cachetimeset4 = dto.cachetimeset4;
        var deletecache = dto.deletecache;
        var location_id = dto.location_id;
        var mqttconnect = [];
        try {
            var setdatachk_main_io = {};
            setdatachk_main_io.alarm_action_id = alarm_action_id;
            var filter_key_md5 = md5(setdatachk_main_io);
            var kaycache_cache_a1 = 'kaycache_cache_crsmasterio_' + alarm_action_id;
            var crsmasterio = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache_a1);
            }
            var crsmasterio = await Cache.GetCacheData(kaycache_cache_a1);
            if (crsmasterio) {
                var crsmasterio = crsmasterio['data'];
                var cache_data_crsmasterio = 'cache';
            }
            else if (!crsmasterio) {
                var crsmasterio = await this.settingsService.checkDuplicateLogIO(setdatachk_main_io);
                var rs = {
                    keycache: `${kaycache_cache_a1}`,
                    time: cachetimeset,
                    data: crsmasterio,
                };
                await Cache.SetCacheData(rs);
                var cache_data_crsmasterio = 'no cache';
            }
            if (crsmasterio) {
                var countalarm_master_io = Number(crsmasterio.length);
            }
            else {
                var countalarm_master_io = parseInt('0');
            }
            var cachetimeset_ctl = Number(cachetimeset);
            var fillter_device_control_map = {};
            fillter_device_control_map.alarm_action_id = alarm_action_id;
            fillter_device_control_map.bucket = dto.bucket;
            var setdatachk_main_io = {};
            setdatachk_main_io.alarm_action_id = alarm_action_id;
            var filter_key_md5 = md5(setdatachk_main_io);
            var kaycache_cache_ctl = 'kaycache_cache_ctl_' + alarm_action_id;
            var device_control = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache_ctl);
            }
            var device_control = await Cache.GetCacheData(kaycache_cache_ctl);
            if (device_control) {
                var device_control = device_control;
                var cache_data_device_control = 'cache';
            }
            else if (!device_control) {
                var device_control = await this.settingsService.deviceeventmap(fillter_device_control_map);
                var rs = {
                    keycache: `${kaycache_cache_ctl}`,
                    time: cachetimeset_ctl,
                    data: device_control,
                };
                await Cache.SetCacheData(rs);
                var cache_data_device_control = 'no cache';
            }
            if (device_control) {
                var device_control_map_count = Number(device_control.length);
            }
            else {
                var device_control_map_count = parseInt('0');
            }
            var Option = 0;
            const fillter_device_control = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
            var countAlarmDeviceDontrol = Number(await this.settingsService.count_alarmprocesslog(fillter_device_control));
            var values = dto.values;
            if (countAlarmDeviceDontrol < 1) {
                var dtos = {};
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
                var Option = 1;
                var msg = 'device_access_control_new';
                var rs1 = 0;
                var rs = await this.device_access_control_new(dtos);
            }
            else if (countAlarmDeviceDontrol >= 1) {
                var dtos = {};
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
                var Option = 2;
                var msg = 'device_access_control_check';
                var rs2 = '--';
                var rs = await this.device_access_control_check(dtos);
                return { Option, countAlarmDeviceDontrol, msg, rs };
            }
        }
        catch (error) {
            console.error('mqtt connect error:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
            return error;
        }
    }
    async device_access_control_new(dto) {
        try {
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var device_id_mas = Number(dto.device_id);
            var setOption = dto.setOption;
            var cachetimeset = dto.cachetimeset;
            var cachetimeset1 = dto.cachetimeset1;
            var cachetimeset2 = dto.cachetimeset2;
            var cachetimeset3 = dto.cachetimeset3;
            var cachetimeset4 = dto.cachetimeset4;
            var deletecache = dto.deletecache;
            var kaycache_cache_a1 = dto.kaycache_cache_a1;
            var alarm_action_id = Number(dto.alarm_action_id);
            var crsmasterio = dto.crsmasterio;
            var countalarm_master_io = dto.countalarm_master_io;
            var device_control = dto.device_control;
            var device_control_map_count = dto.device_control_map_count;
            var values = dto.values;
            var mqtt_data_value = dto.mqtt_data_value;
            var mqtt_data_control = dto.mqtt_data_control;
            var configdata = dto.configdata;
            var mqtt_status_data_name = dto.mqtt_status_data_name;
            var type_id = Number(dto.type_id);
            var status_alert = dto.status_alert;
            var status_warning = dto.status_warning;
            var recovery_warning = dto.recovery_warning;
            var recovery_alert = dto.recovery_alert;
            var mqtt_name = dto.mqtt_name;
            var device_name = dto.device_name;
            var action_name = dto.action_name;
            var mqtt_control_on = dto.mqtt_control_on;
            var mqtt_control_off = dto.mqtt_control_off;
            var alarm_action_id = Number(dto.alarm_action_id);
            var event = Number(dto.event);
            var time_life = dto.time_life;
            var bucket = dto.bucket;
            var mqttconnect = [];
            if (!mqtt_data_value || mqtt_data_value == undefined) {
                var mqttconnect = {
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
            var mqttrs = await this.mqtt2Service.getMqttTopicPA1(mqtt_data_value, deletecache);
            var timestampMqtt = mqttrs.timestamp;
            if (timestampMqtt) {
                var timestamps = timestampMqtt;
            }
            var mqttstatus = mqttrs.status;
            var MQTTGETDATA = mqttrs.msg;
            if (MQTTGETDATA) {
                const mqttData = MQTTGETDATA;
                const mqttDataCount = Number(mqttData.length);
                const configObj = JSON.parse(configdata);
                const mqttConfigData = Object.values(configObj);
                const mqttCount = Number(mqttConfigData.length);
                const statusDataObj = JSON.parse(mqtt_status_data_name);
                const mqttStatusData = Object.values(statusDataObj);
                const merged = format.mapMqttDataToDeviceV2([values], mqttDataCount < mqttCount
                    ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
                    : Object.fromEntries(mqttConfigData.map((k, i) => [k, mqttData[i]])))[0];
                var sensorValueData = merged.value_data;
                var value_alarm = Number(merged.value_alarm);
                var value_relay = Number(merged.value_relay);
                var value_control_relay = Number(merged.value_control_relay);
                var sensorValue = sensorValueData;
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if (type_id == 1) {
                    var dataAlarm = encodeURI(sensorValue);
                    var alarmValue = encodeURI(value_alarm);
                }
                else {
                    var dataAlarm = encodeURI(sensorValueData);
                    var alarmValue = encodeURI(value_alarm);
                }
                var alarmTypeId = type_id;
                var filter = {};
                filter.alarmTypeId = type_id;
                if (type_id == 1) {
                    filter.sensorValueData = encodeURI(sensorValue);
                    filter.status_warning = encodeURI(status_warning);
                    filter.status_alert = encodeURI(status_alert);
                    filter.recovery_warning = encodeURI(recovery_warning);
                    filter.recovery_alert = encodeURI(recovery_alert);
                }
                else {
                    filter.sensorValueData = encodeURI(value_alarm);
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
                var setdatachk = {};
                setdatachk.alarm_action_id = alarm_action_id;
                setdatachk.device_id = device_id_mas;
                setdatachk.type_id = type_id;
                var count_alarm = Number(countalarm_master_io);
                filter.count_alarm = countalarm_master_io;
                var getAlarmDetails = await this.settingsService.getAlarmDetails(filter);
                if (getAlarmDetails) {
                    var alarmStatusSet = Number(getAlarmDetails.alarmStatusSet);
                    var messageMqttControl = getAlarmDetails.messageMqttControl;
                    var subject = getAlarmDetails.subject;
                    var content = getAlarmDetails.content;
                    var dataAlarmRs = getAlarmDetails.dataAlarm;
                    var eventControl = getAlarmDetails.eventControl;
                    var sensor_data = getAlarmDetails.sensor_data;
                }
                else {
                    var getAlarmDetails = [];
                    var alarmStatusSet = null;
                    var messageMqttControl = null;
                    var subject = null;
                    var content = null;
                    var dataAlarmRs = null;
                    var eventControl = null;
                    var sensor_data = null;
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    if (event == 1) {
                        var eventSet = 1;
                    }
                    else {
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    if (event == 1) {
                        var eventSet = 0;
                    }
                    else {
                        var eventSet = 1;
                    }
                }
                const now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var devicecontrol = {};
                var now_time_cal = 0;
                var createddate_logs = now_time_full;
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var log_time = 0;
                var cal_status = 0;
                var cal_status_msg = '---';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                }
                else {
                    var validate_count = parseInt('1');
                }
                if (alarmStatusSet == 999) {
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    fillter_device_control.date = format.getCurrentDatenow();
                    fillter_device_control.alarm_status = alarmStatusSet;
                    var msg = '1- delete_alarmprocesslogal -- device_access_control_new';
                }
                var fillterData = {};
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
                }
                else if (alarmStatusSet == 2) {
                    fillterData.status_alert = status_alert;
                    fillterData.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 3) {
                    fillterData.recovery_warning = recovery_warning;
                    fillterData.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 4) {
                    fillterData.recovery_alert = recovery_alert;
                    fillterData.alarm_status = alarmStatusSet;
                }
                var tag = 1;
                const inputCreate = {
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
                    var isDuplicate = await this.settingsService.checkDuplicateLogOne(inputCreate);
                    if (!isDuplicate) {
                        await this.settingsService.manageAlarmLogRecoveryOne(inputCreate, fillterData, validate_count);
                    }
                }
                if (alarmStatusSet == 999) {
                    var device_control = [];
                }
                else {
                    var device_control_map = [];
                    var fillter_device_control_map = {};
                    fillter_device_control_map.alarm_action_id = alarm_action_id;
                    fillter_device_control_map.bucket = bucket;
                    if (device_control) {
                        for (const [key, value] of Object.entries(device_control)) {
                            const values = value;
                            var alarm_action_id = Number(values.alarm_action_id);
                            const device_id = Number(values.device_id);
                            const mqtt_id = Number(values.mqtt_id);
                            const type_id_control = Number(values.type_id);
                            const mqtt_control_name = values.mqtt_name;
                            const device_control_name = values.device_name;
                            const type_control_name = values.type_name;
                            const device_bucket = values.bucket;
                            const status_warning = values.status_warning;
                            const status_alert = values.status_alert;
                            const recovery_warning = values.recovery_warning;
                            const recovery_alert = values.recovery_alert;
                            if (values.device_id == device_id_mas) {
                            }
                            else {
                                const alarm_action_id = values.alarm_action_id;
                                const device_id = values.device_id;
                                const type_id_control = values.type_id;
                                const mqtt_id = values.mqtt_id;
                                const mqtt_name = values.mqtt_name;
                                const device_name = values.device_name;
                                const type_name = values.type_name;
                                const device_bucket = values.bucket;
                                const status_warning = values.status_warning;
                                const status_alert = values.status_alert;
                                const recovery_warning = values.recovery_warning;
                                const recovery_alert = values.recovery_alert;
                                const mqtt_control_on = values.mqtt_control_on;
                                const mqtt_control_off = values.mqtt_control_off;
                                const mqtt_data_value = encodeURI(values.mqtt_data_value);
                                const mqtt_data_control = encodeURI(values.mqtt_data_control);
                                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                                    var mqtt_get_data = encodeURI(mqtt_data_value);
                                    var mqtt_access_control = encodeURI(mqtt_data_control);
                                    if (event == 1) {
                                        var messageMqttControls = mqtt_control_on;
                                        var eventSet = 1;
                                    }
                                    else {
                                        var messageMqttControls = mqtt_control_off;
                                        var eventSet = 0;
                                    }
                                }
                                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                                    var mqtt_get_data = encodeURI(mqtt_data_value);
                                    var mqtt_access_control = encodeURI(mqtt_data_control);
                                    if (event == 1) {
                                        var messageMqttControls = mqtt_control_off;
                                        var eventSet = 0;
                                    }
                                    else {
                                        var messageMqttControls = mqtt_control_on;
                                        var eventSet = 1;
                                    }
                                }
                                var message_sends = encodeURI(messageMqttControls);
                                const device_status = await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
                                var fillterData = {};
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
                                }
                                else if (alarmStatusSet == 2) {
                                    fillterData.status_alert = status_alert;
                                    fillterData.alarm_status = alarmStatusSet;
                                }
                                else if (alarmStatusSet == 3) {
                                    fillterData.recovery_warning = recovery_warning;
                                    fillterData.alarm_status = alarmStatusSet;
                                }
                                else if (alarmStatusSet == 4) {
                                    fillterData.recovery_alert = recovery_alert;
                                    fillterData.alarm_status = alarmStatusSet;
                                }
                                var tag = 2;
                                const inputCreate = {
                                    alarm_action_id: alarm_action_id,
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
                                    var isDuplicate = await this.settingsService.checkDuplicateLog(inputCreate);
                                    if (!isDuplicate) {
                                        await this.settingsService.manageAlarmLogRecovery(inputCreate, fillterData, 1);
                                    }
                                }
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
                                    isDuplicate,
                                });
                            }
                        }
                    }
                }
                var mqttconnect = {
                    statusCode: 200,
                    code: 200,
                    alarmStatusSet,
                    payload: MQTTGETDATA,
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
                    filter,
                    device_control_map: device_control_map,
                    values,
                    message: `new Mqtt connect..`,
                    message_th: `new Mqtt connect..`,
                };
                return mqttconnect;
            }
            else {
                var mqttconnect = {
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
        }
        catch (error) {
            console.error('mqtt device_access_control_new error:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
        }
    }
    async device_access_control_check(dto) {
        var _a, _b;
        try {
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var setOption = dto.setOption;
            var cachetimeset = dto.cachetimeset;
            var cachetimeset1 = dto.cachetimeset1;
            var cachetimeset2 = dto.cachetimeset2;
            var cachetimeset3 = dto.cachetimeset3;
            var cachetimeset4 = dto.cachetimeset4;
            var deletecache = dto.deletecache;
            var kaycache_cache_a1 = dto.kaycache_cache_a1;
            var alarm_action_id = Number(dto.alarm_action_id);
            var device_id_mas = Number(dto.device_id_mas);
            var crsmasterio = dto.crsmasterio;
            var countalarm_master_io = dto.countalarm_master_io;
            var device_control = dto.device_control;
            var device_control_map_count = dto.device_control_map_count;
            var values = dto.values;
            var mqtt_data_value = dto.mqtt_data_value;
            var mqtt_data_control = dto.mqtt_data_control;
            var configdata = dto.configdata;
            var mqtt_status_data_name = dto.mqtt_status_data_name;
            var type_id = Number(dto.type_id);
            var status_alert = dto.status_alert;
            var status_warning = dto.status_warning;
            var recovery_warning = dto.recovery_warning;
            var recovery_alert = dto.recovery_alert;
            var mqtt_name = dto.mqtt_name;
            var device_name = dto.device_name;
            var action_name = dto.action_name;
            var mqtt_control_on = dto.mqtt_control_on;
            var mqtt_control_off = dto.mqtt_control_off;
            var alarm_action_id = Number(dto.alarm_action_id);
            var event = Number(dto.event);
            var time_life = dto.time_life;
            var bucket = dto.bucket;
            var mqttconnect = [];
            if (!mqtt_data_value || mqtt_data_value == undefined) {
                var mqttconnect = {
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
            var MQTTGETDATA = await this.mqtt2Service.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqtt2Service.getdevicedataAll(mqtt_data_value);
                const mqttData = mqttrs['data'];
                const mqttDataCount = Number(mqttData.length);
                const configObj = JSON.parse(configdata);
                const mqttConfigData = Object.values(configObj);
                const mqttCount = Number(mqttConfigData.length);
                const statusDataObj = JSON.parse(mqtt_status_data_name);
                const mqttStatusData = Object.values(statusDataObj);
                const merged = format.mapMqttDataToDeviceV2([values], mqttDataCount < mqttCount
                    ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
                    : Object.fromEntries(mqttConfigData.map((k, i) => [k, mqttData[i]])))[0];
                var sensorValueData = merged.value_data;
                var value_alarm = Number(merged.value_alarm);
                var value_relay = Number(merged.value_relay);
                var value_control_relay = Number(merged.value_control_relay);
                var sensorValue = sensorValueData;
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if (type_id == 1) {
                    var dataAlarm = encodeURI(sensorValue);
                    var alarmValue = encodeURI(value_alarm);
                }
                else {
                    var dataAlarm = encodeURI(sensorValueData);
                    var alarmValue = encodeURI(value_alarm);
                }
                var alarmTypeId = type_id;
                var filter = {};
                filter.alarmTypeId = type_id;
                if (type_id == 1) {
                    filter.sensorValueData = encodeURI(sensorValue);
                    filter.status_warning = encodeURI(status_warning);
                    filter.status_alert = encodeURI(status_alert);
                    filter.recovery_warning = encodeURI(recovery_warning);
                    filter.recovery_alert = encodeURI(recovery_alert);
                }
                else {
                    filter.sensorValueData = encodeURI(value_alarm);
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
                var count_alarm = Number(countalarm_master_io);
                filter.count_alarm = countalarm_master_io;
                var getAlarmDetails = await this.settingsService.getAlarmDetails(filter);
                if (getAlarmDetails) {
                    var alarmStatusSet = Number(getAlarmDetails.alarmStatusSet);
                    var messageMqttControl = getAlarmDetails.messageMqttControl;
                    var subject = getAlarmDetails.subject;
                    var content = getAlarmDetails.content;
                    var dataAlarmRs = getAlarmDetails.dataAlarm;
                    var eventControl = getAlarmDetails.eventControl;
                    var sensor_data = getAlarmDetails.sensor_data;
                }
                else {
                    var getAlarmDetails = [];
                    var alarmStatusSet = Number(999);
                    var messageMqttControl = null;
                    var subject = null;
                    var content = null;
                    var dataAlarmRs = null;
                    var eventControl = null;
                    var sensor_data = null;
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    if (event == 1) {
                        var eventSet = 1;
                    }
                    else {
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    if (event == 1) {
                        var eventSet = 0;
                    }
                    else {
                        var eventSet = 1;
                    }
                }
                var cal_status_msg = {
                    msg: ' -----------countalarm_master-1-----------',
                    msg2: ' ----MQTT------',
                    alarmStatusSet,
                    setdatachk_main,
                    MQTTGETDATA,
                };
                const now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var devicecontrol = {};
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var inputCreate = {};
                var log_time = 0;
                var cal_status = 0;
                var msg2 = '-----------------2222------------------------';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('2');
                    var msg2 = '-----------------alarmStatusSet 1------------------------';
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('2');
                    var msg2 = '-----------------alarmStatusSet 2------------------------';
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet 3------------------------';
                }
                else if (alarmStatusSet == 4) {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet 4------------------------';
                }
                else {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet ' +
                        alarmStatusSet +
                        '------------------------';
                }
                var cal_status_msg = {
                    msg: ' -----------countalarm_master-1-----------',
                    msg2: ' ----msg----' + msg2,
                    alarmStatusSet,
                    setdatachk_main,
                    MQTTGETDATA,
                };
                var devicecontrol = {};
                var now_time_cal = 0;
                var createddate_logs = now_time_full;
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var inputCreate = {};
                var log_time = 0;
                var cal_status = 0;
                var cal_status_msg = '---';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                }
                else {
                    var validate_count = parseInt('1');
                }
                var fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                if (alarmStatusSet == 999) {
                    await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                    var msg = '2- delete_alarmprocesslogal -- device_access_control_check';
                    return { msg, alarmStatusSet };
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    var mqtt_get_data = encodeURI(mqtt_data_value);
                    var mqtt_access_control = encodeURI(mqtt_data_control);
                    if (event == 1) {
                        var messageMqttControls = mqtt_control_on;
                        var eventSet = 1;
                    }
                    else {
                        var messageMqttControls = mqtt_control_off;
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    var mqtt_get_data = encodeURI(mqtt_data_value);
                    var mqtt_access_control = encodeURI(mqtt_data_control);
                    if (event == 1) {
                        var messageMqttControls = mqtt_control_off;
                        var eventSet = 0;
                    }
                    else {
                        var messageMqttControls = mqtt_control_on;
                        var eventSet = 1;
                    }
                }
                var fillterDataSENSOR = {};
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
                }
                else if (alarmStatusSet == 2) {
                    fillterDataSENSOR.status_alert = status_alert;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 3) {
                    fillterDataSENSOR.recovery_warning = recovery_warning;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 4) {
                    fillterDataSENSOR.recovery_alert = recovery_alert;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                var inputCreate = {
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
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id_mas;
                var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
                var countalarm_LogSensor = Number(crsmaster.length);
                if (crsmaster) {
                    var createddate_logsMaim = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                    var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logsMaim));
                    if (now_time_cal_main > time_life) {
                        var mqttconnect = [];
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id_mas;
                        setdatachk_main.alarm_status = alarmStatusSet;
                        setdatachk_main.date = format.getCurrentDatenow();
                        setdatachk_main.time = format.getCurrentTimenow();
                        var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                        if (crsmaster) {
                            var countalarm_LogSensor = Number(crsmaster.length);
                        }
                        else {
                            var countalarm_LogSensor = parseInt('0');
                        }
                        if (countalarm_LogSensor == 0) {
                            var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                            if (!isDuplicate) {
                                await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                            }
                        }
                        if (countalarm_LogSensor >= validate_count) {
                            if (alarmStatusSet == 999) {
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id;
                                fillter_device_control.alarm_status = alarmStatusSet;
                                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                                var msg = '3- delete_alarmprocesslogal -- device_access_control_check';
                                return { msg, alarmStatusSet };
                            }
                        }
                    }
                    if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                        var mqttconnect = [];
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id_mas;
                        setdatachk_main.alarm_status = alarmStatusSet;
                        setdatachk_main.date = format.getCurrentDatenow();
                        setdatachk_main.time = format.getCurrentTimenow();
                        var crsmaster = await this.settingsService.checkDuplicateLogSensor(setdatachk_main);
                        if (crsmaster) {
                            var countalarm_LogSensor = Number(crsmaster.length);
                        }
                        else {
                            var countalarm_LogSensor = parseInt('0');
                        }
                        if (countalarm_LogSensor == 0) {
                            var isDuplicate = await this.settingsService.checkDuplicateLogTwo(inputCreate);
                            if (!isDuplicate) {
                                await this.settingsService.manageAlarmLogRecoveryTwo(inputCreate, fillterDataSENSOR, validate_count);
                            }
                        }
                        if (countalarm_LogSensor >= validate_count) {
                            if (alarmStatusSet == 999) {
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id;
                                fillter_device_control.alarm_status = alarmStatusSet;
                                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
                                var msg = '4- delete_alarmprocesslogal -- device_access_control_check';
                                return { msg, alarmStatusSet };
                            }
                        }
                    }
                }
                var device_control_map = [];
                var fillter_device_control_map = {};
                fillter_device_control_map.alarm_action_id = alarm_action_id;
                fillter_device_control_map.bucket = bucket;
                var rsss = {
                    alarmStatusSet,
                    device_control,
                    device_control_map_count,
                    countalarm_LogSensor,
                    crsmaster,
                    fillter_device_control,
                };
                if (device_control) {
                    for (const [key, value] of Object.entries(device_control)) {
                        const values = value;
                        var alarm_action_id = Number(values.alarm_action_id);
                        const device_id = Number(values.device_id);
                        const mqtt_id = Number(values.mqtt_id);
                        const type_id_control = Number(values.type_id);
                        const mqtt_control_name = values.mqtt_name;
                        const device_control_name = values.device_name;
                        const type_control_name = values.type_name;
                        const device_bucket = values.bucket;
                        const status_warning = Number(values.status_warning);
                        const status_alert = Number(values.status_alert);
                        const recovery_warning = Number(values.recovery_warning);
                        const recovery_alert = Number(values.recovery_alert);
                        if (values.device_id == device_id_mas) {
                        }
                        else {
                            const mqtt_control_on = values.mqtt_control_on;
                            const mqtt_control_off = values.mqtt_control_off;
                            const mqtt_data_value = encodeURI(values.mqtt_data_value);
                            const mqtt_data_control = encodeURI(values.mqtt_data_control);
                            if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                                var mqtt_get_data = encodeURI(mqtt_data_value);
                                var mqtt_access_control = encodeURI(mqtt_data_control);
                                if (event == 1) {
                                    var messageMqttControls = mqtt_control_on;
                                    var eventSet = 1;
                                }
                                else {
                                    var messageMqttControls = mqtt_control_off;
                                    var eventSet = 0;
                                }
                            }
                            else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                                var mqtt_get_data = encodeURI(mqtt_data_value);
                                var mqtt_access_control = encodeURI(mqtt_data_control);
                                if (event == 1) {
                                    var messageMqttControls = mqtt_control_off;
                                    var eventSet = 0;
                                }
                                else {
                                    var messageMqttControls = mqtt_control_on;
                                    var eventSet = 1;
                                }
                            }
                            var datenow = format.getCurrentDatenow();
                            var timenow = format.getCurrentTimenow();
                            const fillter_device_control = {};
                            fillter_device_control.alarm_action_id = alarm_action_id;
                            fillter_device_control.device_id = device_id;
                            const countAlarmDeviceDontrol = Number(await this.settingsService.count_alarmprocesslog(fillter_device_control));
                            var RsIO = await this.settingsService.checkDuplicateLogIO(fillter_device_control);
                            var countalarm_LogIO = Number(RsIO.length);
                            if (countalarm_LogIO == 0) {
                                var createddate_logs = format.timeConvertermas(format.convertTZ(datenow, process.env.tzString));
                            }
                            else {
                                var createddate_logs = format.timeConvertermas(format.convertTZ(RsIO[0].createddate, process.env.tzString));
                            }
                            const nowtimefull = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                            var now_time_cal = Number(format.diffMinutes(nowtimefull, createddate_logs));
                            if (countAlarmDeviceDontrol > validate_count) {
                                var validate_count_status = Number(1);
                            }
                            else {
                                var validate_count_status = Number(2);
                            }
                            if (countAlarmDeviceDontrol <= validate_count) {
                                var validate_count_status_do = Number(1);
                            }
                            else {
                                var validate_count_status_do = Number(2);
                            }
                            if (now_time_cal > time_life) {
                                var time_cal_status = Number(1);
                            }
                            else {
                                var time_cal_status = Number(2);
                            }
                            if (validate_count_status_do == 1 && time_cal_status == 1) {
                                var do_status = Number(1);
                            }
                            else {
                                var do_status = Number(2);
                            }
                            if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                                if (countAlarmDeviceDontrol >= 1) {
                                    var do_status = Number(1);
                                }
                            }
                            if (validate_count_status == 1 && time_cal_status == 1) {
                                var not_do_status = Number(1);
                            }
                            else {
                                var not_do_status = Number(2);
                            }
                            var fillterDel = {};
                            fillterDel.alarm_action_id = alarm_action_id;
                            fillterDel.device_id = device_id;
                            if (validate_count_status == 1) {
                                await this.settingsService.delete_alarm_process_log_fillter(fillterDel);
                                continue;
                            }
                            var devicecontrol = [];
                            if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                                if (do_status == 1) {
                                    const topic_sends = encodeURI(mqtt_data_control);
                                    const message_sends = encodeURI(messageMqttControls);
                                    console.log(`topic_sends=>` +
                                        topic_sends +
                                        ` message_sends=>` +
                                        message_sends);
                                    var devicecontrol = await this.mqtt2Service.devicecontrol(topic_sends, message_sends);
                                    if (devicecontrol) {
                                        var device_status = (_a = devicecontrol['dataObject']) === null || _a === void 0 ? void 0 : _a.device_status;
                                    }
                                    else {
                                        var device_status = '--';
                                    }
                                    var inputCreate = {
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
                                        subject: subject +
                                            ` 1-Control ` +
                                            device_status +
                                            ` device ` +
                                            device_name,
                                        content: content +
                                            ` 1-Control ` +
                                            device_status +
                                            `  device ` +
                                            device_name +
                                            ` Type ` +
                                            type_control_name,
                                    };
                                    var isDuplicate = await this.settingsService.checkDuplicateLog(inputCreate);
                                    if (!isDuplicate) {
                                        await this.settingsService.manageAlarmLogRecovery(inputCreate, fillter_device_control, validate_count);
                                        continue;
                                    }
                                }
                            }
                            else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                                if (do_status == 1) {
                                    const topic_sends = encodeURI(mqtt_data_control);
                                    const message_sends = encodeURI(messageMqttControls);
                                    console.log(`topic_sends=>` +
                                        topic_sends +
                                        ` message_sends=>` +
                                        message_sends);
                                    var devicecontrol = await this.mqtt2Service.devicecontrol(topic_sends, message_sends);
                                    if (devicecontrol) {
                                        var device_status = (_b = devicecontrol['dataObject']) === null || _b === void 0 ? void 0 : _b.device_status;
                                    }
                                    else {
                                        var device_status = '--';
                                    }
                                    var inputCreate = {
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
                                        subject: subject +
                                            ` 1-Control ` +
                                            device_status +
                                            ` device ` +
                                            device_name,
                                        content: content +
                                            ` 1-Control ` +
                                            device_status +
                                            `  device ` +
                                            device_name +
                                            ` Type ` +
                                            type_control_name,
                                    };
                                    var isDuplicate = await this.settingsService.checkDuplicateLog(inputCreate);
                                    if (!isDuplicate) {
                                        await this.settingsService.manageAlarmLogRecovery(inputCreate, fillter_device_control, validate_count);
                                        continue;
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
                                    remark: 'validate_count_status=1 do validate_count_status=2 not do',
                                    fillterDel: fillterDel,
                                },
                                control: {
                                    event: event,
                                    mqtt_data_control: mqtt_data_control,
                                    messageMqttControls: messageMqttControls,
                                    alarmStatusSet: alarmStatusSet,
                                    fillter_device_control,
                                    devicecontrol,
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
                var mqttconnect = {
                    statusCode: 200,
                    code: 200,
                    status: 1,
                    payload: {
                        MQTTGETDATA,
                        filter,
                        alarmStatusSet,
                    },
                    device_control_map,
                    message: `Mqtt connect..device_access_control_check`,
                    message_th: `Mqtt connect..`,
                };
                return mqttconnect;
            }
            else {
                var mqttconnect = {
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
        }
        catch (error) {
            console.error('mqtt device_access_control_check error:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
        }
    }
    async alarm_to_email(dto) {
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
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
        var timestamps = datePart + ' ' + timePart;
        var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            var Mqttstatus = checkConnectionMqtt.status;
        }
        else {
            var Mqttstatus = false;
        }
        var setOption = dto.setOption;
        var cachetimeset = dto.cachetimeset;
        var cachetimeset1 = dto.cachetimeset1;
        var cachetimeset2 = dto.cachetimeset2;
        var cachetimeset3 = dto.cachetimeset3;
        var cachetimeset4 = dto.cachetimeset4;
        var deletecache = dto.deletecache;
        var kaycache_cache_a1 = dto.kaycache_cache_a1;
        var alarm_action_id = parseInt(dto.alarm_action_id);
        var device_id = dto.device_id;
        var device_id_mas = parseInt(dto.device_id_mas);
        var crsmasterio = dto.crsmasterio;
        var countalarm_master_io = dto.countalarm_master_io;
        var device_control = dto.device_control;
        var device_control_map_count = dto.device_control_map_count;
        var event = parseInt(dto.event);
        var time_life = dto.time_life;
        var bucket = dto.bucket;
        var location_id = dto.location_id;
        var values = dto.values;
        var mqtt_data_value = dto.mqtt_data_value;
        var mqtt_data_control = dto.mqtt_data_control;
        var configdata = dto.configdata;
        var mqtt_status_data_name = dto.mqtt_status_data_name;
        var type_id = parseInt(dto.type_id);
        var status_alert = dto.status_alert;
        var status_warning = dto.status_warning;
        var recovery_warning = dto.recovery_warning;
        var recovery_alert = dto.recovery_alert;
        var mqtt_name = dto.mqtt_name;
        var device_name = dto.device_name;
        var action_name = dto.action_name;
        var mqtt_control_on = dto.mqtt_control_on;
        var mqtt_control_off = dto.mqtt_control_off;
        var subject = dto.subject;
        var content = dto.content;
        var status = dto.status;
        var alarmStatusSet = dto.alarmStatusSet;
        var dataAlarm = dto.dataAlarm;
        var eventControl = dto.eventControl;
        var messageMqttControl = dto.messageMqttControl;
        var sensor_data = dto.sensor_data;
        var count_alarm = dto.count_alarm;
        var mqttconnect = [];
        var chk_email = {};
        chk_email.alarm_action_id = alarm_action_id;
        chk_email.device_id = device_id;
        try {
            var crsmasterio = await this.settingsService.chk_alarmprocesslogemail(chk_email);
            var count_alarm_master_email = (crsmasterio === null || crsmasterio === void 0 ? void 0 : crsmasterio.length) || 0;
        }
        catch (error) {
            console.error('Error checking alarm process log:', error);
            var count_alarm_master_email = 0;
        }
        if (crsmasterio) {
            var count_alarm_master_email = count_alarm_master_email;
            var rssData = crsmasterio[0];
        }
        else {
            var count_alarm_master_email = parseInt('0');
            var rssData = '';
        }
        var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
        if (count_alarm_master_email > 0) {
            var createddate_logs_Email = format.timeConvertermas(format.convertTZ(rssData.createddate, process.env.tzString));
            var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logs_Email));
            var caseSet = 1;
            if (now_time_cal_main > time_life) {
                var access_email = this.device_access_email_check(dto);
                if (count_alarm_master_email >= 3) {
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                }
                return access_email;
            }
            return {
                now_time_cal_main,
                time_life,
                count_alarm_master_email,
                rs: rssData,
            };
        }
        else {
            var access_email = this.device_access_email_new(dto);
            return access_email;
        }
    }
    async device_access_email_new(dto) {
        try {
            var values = dto.values;
            var mqtt_data_value = dto.mqtt_data_value;
            var mqtt_data_control = dto.mqtt_data_control;
            var configdata = dto.configdata;
            var mqtt_status_data_name = dto.mqtt_status_data_name;
            var setOption = dto.setOption;
            var cachetimeset = dto.cachetimeset;
            var cachetimeset1 = dto.cachetimeset1;
            var cachetimeset2 = dto.cachetimeset2;
            var cachetimeset3 = dto.cachetimeset3;
            var cachetimeset4 = dto.cachetimeset4;
            var type_id = Number(dto.type_id);
            var status_alert = dto.status_alert;
            var status_warning = dto.status_warning;
            var recovery_warning = dto.recovery_warning;
            var recovery_alert = dto.recovery_alert;
            var mqtt_name = dto.mqtt_name;
            var device_name = dto.device_name;
            var action_name = dto.action_name;
            var mqtt_control_on = dto.mqtt_control_on;
            var mqtt_control_off = dto.mqtt_control_off;
            var alarm_action_id = parseInt(dto.alarm_action_id);
            var device_id_mas = parseInt(dto.device_id);
            var event = parseInt(dto.event);
            var time_life = dto.time_life;
            var bucket = dto.bucket;
            var mqttconnect = [];
            var setdatachk_main_io = {};
            setdatachk_main_io.alarm_action_id = alarm_action_id;
            setdatachk_main_io.device_id = device_id_mas;
            var crsmasterio = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main_io);
            if (crsmasterio) {
                var countalarm_master_io = parseInt(crsmasterio.length);
            }
            else {
                var countalarm_master_io = parseInt('0');
            }
            var keyword = dto.keyword;
            var mqtt_id = dto.mqtt_id;
            var filterAlarm = {};
            if (device_id_mas) {
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
            var getdeviceactivemqttAlarmEmail = await this.getdeviceactivemqttAlarmEmail(filterAlarm);
            if (!mqtt_data_value || mqtt_data_value == undefined) {
                var mqttconnect = {
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
            const MQTTGETDATA = await this.mqtt2Service.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqtt2Service.getdevicedataAll(mqtt_data_value);
                const mqttData = mqttrs['data'];
                const mqttDataCount = parseInt(mqttData.length);
                const configObj = JSON.parse(configdata);
                const mqttConfigData = Object.values(configObj);
                const mqttCount = Number(mqttConfigData.length);
                const statusDataObj = JSON.parse(mqtt_status_data_name);
                const mqttStatusData = Object.values(statusDataObj);
                const merged = format.mapMqttDataToDeviceV2([values], mqttDataCount < mqttCount
                    ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
                    : Object.fromEntries(mqttConfigData.map((k, i) => [k, mqttData[i]])))[0];
                var sensorValueData = merged.value_data;
                var value_alarm = Number(merged.value_alarm);
                var value_relay = Number(merged.value_relay);
                var value_control_relay = Number(merged.value_control_relay);
                var sensorValue = sensorValueData;
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if (type_id == 1) {
                    var dataAlarm = encodeURI(sensorValue);
                    var alarmValue = encodeURI(value_alarm);
                }
                else {
                    var dataAlarm = encodeURI(sensorValueData);
                    var alarmValue = encodeURI(value_alarm);
                }
                var alarmTypeId = type_id;
                var filter = {};
                filter.alarmTypeId = type_id;
                if (type_id == 1) {
                    filter.sensorValueData = encodeURI(sensorValue);
                    filter.status_warning = encodeURI(status_warning);
                    filter.status_alert = encodeURI(status_alert);
                    filter.recovery_warning = encodeURI(recovery_warning);
                    filter.recovery_alert = encodeURI(recovery_alert);
                }
                else {
                    filter.sensorValueData = encodeURI(value_alarm);
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
                var setdatachk = {};
                setdatachk.alarm_action_id = alarm_action_id;
                setdatachk.device_id = device_id_mas;
                setdatachk.type_id = type_id;
                var count_alarm = Number(countalarm_master_io);
                filter.count_alarm = countalarm_master_io;
                var getAlarmDetails = await this.settingsService.getAlarmDetails(filter);
                if (getAlarmDetails) {
                    var alarmStatusSet = Number(getAlarmDetails.alarmStatusSet);
                    var messageMqttControl = getAlarmDetails.messageMqttControl;
                    var subject = getAlarmDetails.subject;
                    var content = getAlarmDetails.content;
                    var dataAlarmRs = getAlarmDetails.dataAlarm;
                    var eventControl = getAlarmDetails.eventControl;
                    var sensor_data = getAlarmDetails.sensor_data;
                }
                else {
                    var getAlarmDetails = [];
                    var alarmStatusSet = null;
                    var messageMqttControl = null;
                    var subject = null;
                    var content = null;
                    var dataAlarmRs = null;
                    var eventControl = null;
                    var sensor_data = null;
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    if (event == 1) {
                        var eventSet = 1;
                    }
                    else {
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    if (event == 1) {
                        var eventSet = 0;
                    }
                    else {
                        var eventSet = 1;
                    }
                }
                const now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var devicecontrol = {};
                var now_time_cal = 0;
                var createddate_logs = now_time_full;
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var log_time = 0;
                var cal_status = 0;
                var cal_status_msg = '---';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('2');
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                }
                else {
                    var validate_count = parseInt('1');
                }
                if (alarmStatusSet == 999) {
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    fillter_device_control.date = format.getCurrentDatenow();
                    fillter_device_control.alarm_status = alarmStatusSet;
                    await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                }
                var fillterData = {};
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
                }
                else if (alarmStatusSet == 2) {
                    fillterData.status_alert = status_alert;
                    fillterData.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 3) {
                    fillterData.recovery_warning = recovery_warning;
                    fillterData.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 4) {
                    fillterData.recovery_alert = recovery_alert;
                    fillterData.alarm_status = alarmStatusSet;
                }
                var tag = 1;
                const inputCreate = {
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
                var cal_status_msg = {
                    msg: ' -----------countalarm_master-0------------',
                    msg2: ' ----countalarm_master->0----1-case 1-2  mqtt connect---------',
                    alarmStatusSet,
                    inputCreate,
                };
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    if (alarmStatusSet != 999) {
                        var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
                        if (!isDuplicate) {
                            await this.settingsService.getAlarmDetailsSendEmail(filter);
                            await this.settingsService.manageAlarmLogEmail(inputCreate, fillterData, validate_count);
                        }
                    }
                }
                if (alarmStatusSet == 999) {
                    var device_control = [];
                }
                else {
                }
                var mqttconnect = {
                    statusCode: 200,
                    code: 200,
                    alarmStatusSet,
                    payload: MQTTGETDATA,
                    getdeviceactivemqttAlarmEmail,
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
                    filter,
                    message: `new Mqtt connect device_access_email_new..`,
                    message_th: `new Mqtt connect device_access_email_new..`,
                };
                return mqttconnect;
            }
            else {
                var mqttconnect = {
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
        }
        catch (error) {
            console.error('mqtt device_access_email_new error:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
        }
    }
    async device_access_email_check(dto) {
        try {
            var keyword = dto.keyword;
            var values = dto.values;
            var mqtt_data_value = dto.mqtt_data_value;
            var mqtt_data_control = dto.mqtt_data_control;
            var configdata = dto.configdata;
            var mqtt_status_data_name = dto.mqtt_status_data_name;
            var setOption = dto.setOption;
            var cachetimeset = dto.cachetimeset;
            var cachetimeset1 = dto.cachetimeset1;
            var cachetimeset2 = dto.cachetimeset2;
            var cachetimeset3 = dto.cachetimeset3;
            var cachetimeset4 = dto.cachetimeset4;
            var type_id = Number(dto.type_id);
            var status_alert = dto.status_alert;
            var status_warning = dto.status_warning;
            var recovery_warning = dto.recovery_warning;
            var recovery_alert = dto.recovery_alert;
            var mqtt_id = dto.mqtt_id;
            var mqtt_name = dto.mqtt_name;
            var device_name = dto.device_name;
            var action_name = dto.action_name;
            var mqtt_control_on = dto.mqtt_control_on;
            var mqtt_control_off = dto.mqtt_control_off;
            var alarm_action_id = Number(dto.alarm_action_id);
            var device_id_mas = Number(dto.device_id);
            var event = Number(dto.event);
            var time_life = dto.time_life;
            var bucket = dto.bucket;
            var mqttconnect = [];
            var setdatachk_main_io = {};
            setdatachk_main_io.alarm_action_id = alarm_action_id;
            setdatachk_main_io.device_id = device_id_mas;
            var crsmasterio = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main_io);
            if (crsmasterio) {
                var countalarm_master_io = Number(crsmasterio.length);
            }
            else {
                var countalarm_master_io = parseInt('0');
            }
            var keyword = dto.keyword;
            var mqtt_id = dto.mqtt_id;
            var filterAlarm = {};
            if (device_id_mas) {
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
            var getdeviceactivemqttAlarmEmail = await this.getdeviceactivemqttAlarmEmail(filterAlarm);
            if (!mqtt_data_value || mqtt_data_value == undefined) {
                var mqttconnect = {
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
            const MQTTGETDATA = await this.mqtt2Service.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqtt2Service.getdevicedataAll(mqtt_data_value);
                const mqttData = mqttrs['data'];
                const mqttDataCount = Number(mqttData.length);
                const configObj = JSON.parse(configdata);
                const mqttConfigData = Object.values(configObj);
                const mqttCount = Number(mqttConfigData.length);
                const statusDataObj = JSON.parse(mqtt_status_data_name);
                const mqttStatusData = Object.values(statusDataObj);
                const merged = format.mapMqttDataToDeviceV2([values], mqttDataCount < mqttCount
                    ? Object.fromEntries(mqttStatusData.map((k, i) => [k, mqttData[i]]))
                    : Object.fromEntries(mqttConfigData.map((k, i) => [k, mqttData[i]])))[0];
                var sensorValueData = merged.value_data;
                var value_alarm = Number(merged.value_alarm);
                var value_relay = Number(merged.value_relay);
                var value_control_relay = Number(merged.value_control_relay);
                var sensorValue = sensorValueData;
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if (type_id == 1) {
                    var dataAlarm = encodeURI(sensorValue);
                    var alarmValue = encodeURI(value_alarm);
                }
                else {
                    var dataAlarm = encodeURI(sensorValueData);
                    var alarmValue = encodeURI(value_alarm);
                }
                var alarmTypeId = type_id;
                var filter = {};
                filter.alarmTypeId = type_id;
                if (type_id == 1) {
                    filter.sensorValueData = encodeURI(sensorValue);
                    filter.status_warning = encodeURI(status_warning);
                    filter.status_alert = encodeURI(status_alert);
                    filter.recovery_warning = encodeURI(recovery_warning);
                    filter.recovery_alert = encodeURI(recovery_alert);
                }
                else {
                    filter.sensorValueData = encodeURI(value_alarm);
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
                var count_alarm = Number(countalarm_master_io);
                filter.count_alarm = countalarm_master_io;
                var getAlarmDetails = await this.settingsService.getAlarmDetails(filter);
                if (getAlarmDetails) {
                    var alarmStatusSet = Number(getAlarmDetails.alarmStatusSet);
                    var messageMqttControl = getAlarmDetails.messageMqttControl;
                    var subject = getAlarmDetails.subject;
                    var content = getAlarmDetails.content;
                    var dataAlarmRs = getAlarmDetails.dataAlarm;
                    var eventControl = getAlarmDetails.eventControl;
                    var sensor_data = getAlarmDetails.sensor_data;
                }
                else {
                    var getAlarmDetails = [];
                    var alarmStatusSet = Number(999);
                    var messageMqttControl = null;
                    var subject = null;
                    var content = null;
                    var dataAlarmRs = null;
                    var eventControl = null;
                    var sensor_data = null;
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    if (event == 1) {
                        var eventSet = 1;
                    }
                    else {
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    if (event == 1) {
                        var eventSet = 0;
                    }
                    else {
                        var eventSet = 1;
                    }
                }
                var cal_status_msg = {
                    msg: ' -----------countalarm_master-1-----------',
                    msg2: ' ----MQTT------',
                    alarmStatusSet,
                    setdatachk_main,
                    MQTTGETDATA,
                };
                const now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var devicecontrol = {};
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var inputCreate = {};
                var log_time = 0;
                var cal_status = 0;
                var msg2 = '-----------------2222------------------------';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('2');
                    var msg2 = '-----------------alarmStatusSet 1------------------------';
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('2');
                    var msg2 = '-----------------alarmStatusSet 2------------------------';
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet 3------------------------';
                }
                else if (alarmStatusSet == 4) {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet 4------------------------';
                }
                else {
                    var validate_count = parseInt('1');
                    var msg2 = '-----------------alarmStatusSet ' +
                        alarmStatusSet +
                        '------------------------';
                }
                var cal_status_msg = {
                    msg: ' -----------countalarm_master-1-----------',
                    msg2: ' ----msg----' + msg2,
                    alarmStatusSet,
                    setdatachk_main,
                    MQTTGETDATA,
                };
                var devicecontrol = {};
                var now_time_cal = 0;
                var createddate_logs = now_time_full;
                var setdata_chk2 = {};
                var new_count_alarm2 = 0;
                var inputCreate = {};
                var log_time = 0;
                var cal_status = 0;
                var cal_status_msg = '---';
                if (alarmStatusSet == 1) {
                    var validate_count = parseInt('3');
                }
                else if (alarmStatusSet == 2) {
                    var validate_count = parseInt('3');
                }
                else if (alarmStatusSet == 3) {
                    var validate_count = parseInt('1');
                }
                else {
                    var validate_count = parseInt('1');
                }
                if (alarmStatusSet == 999) {
                    const fillter_device_control = {};
                    fillter_device_control.alarm_action_id = alarm_action_id;
                    await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                }
                if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                    var mqtt_get_data = encodeURI(mqtt_data_value);
                    var mqtt_access_control = encodeURI(mqtt_data_control);
                    if (event == 1) {
                        var messageMqttControls = mqtt_control_on;
                        var eventSet = 1;
                    }
                    else {
                        var messageMqttControls = mqtt_control_off;
                        var eventSet = 0;
                    }
                }
                else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                    var mqtt_get_data = encodeURI(mqtt_data_value);
                    var mqtt_access_control = encodeURI(mqtt_data_control);
                    if (event == 1) {
                        var messageMqttControls = mqtt_control_off;
                        var eventSet = 0;
                    }
                    else {
                        var messageMqttControls = mqtt_control_on;
                        var eventSet = 1;
                    }
                }
                var fillterDataSENSOR = {};
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
                }
                else if (alarmStatusSet == 2) {
                    fillterDataSENSOR.status_alert = status_alert;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 3) {
                    fillterDataSENSOR.recovery_warning = recovery_warning;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                else if (alarmStatusSet == 4) {
                    fillterDataSENSOR.recovery_alert = recovery_alert;
                    fillterDataSENSOR.alarm_status = alarmStatusSet;
                }
                var inputCreate = {
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
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id_mas;
                var crsmaster = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                if (crsmaster) {
                    var crsmaster_email = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                    var count_crsmaster_email = parseInt(crsmaster_email.length) || 0;
                    if (count_crsmaster_email == 0) {
                        let createddate = new Date();
                        var createddate_logsMaim = format.timeConvertermas(format.convertTZ(createddate, process.env.tzString));
                    }
                    else {
                        var createddate_logsMaim = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
                    }
                    var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logsMaim));
                    if (now_time_cal_main > time_life) {
                        var mqttconnect = [];
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id_mas;
                        setdatachk_main.alarm_status = alarmStatusSet;
                        setdatachk_main.date = format.getCurrentDatenow();
                        setdatachk_main.time = format.getCurrentTimenow();
                        var crsmaster = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                        if (crsmaster) {
                            var countalarm_LogSensor = Number(crsmaster.length);
                        }
                        else {
                            var countalarm_LogSensor = parseInt('0');
                        }
                        if (countalarm_LogSensor == 0) {
                            if (alarmStatusSet != 999) {
                                var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
                                if (!isDuplicate) {
                                    await this.settingsService.getAlarmDetailsSendEmail(filter);
                                    await this.settingsService.manageAlarmLogEmail(inputCreate, fillterDataSENSOR, validate_count);
                                }
                            }
                        }
                        else if (countalarm_LogSensor > validate_count) {
                            if (alarmStatusSet == 999) {
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id;
                                fillter_device_control.device_id = device_id_mas;
                                await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                            }
                        }
                    }
                    if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                        var mqttconnect = [];
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id_mas;
                        setdatachk_main.alarm_status = alarmStatusSet;
                        setdatachk_main.date = format.getCurrentDatenow();
                        setdatachk_main.time = format.getCurrentTimenow();
                        var crsmaster = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                        if (crsmaster) {
                            var countalarm_LogSensor = Number(crsmaster.length);
                        }
                        else {
                            var countalarm_LogSensor = parseInt('0');
                        }
                        if (countalarm_LogSensor == 0) {
                            if (alarmStatusSet != 999) {
                                var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
                                if (!isDuplicate) {
                                    await this.settingsService.getAlarmDetailsSendEmail(filter);
                                    await this.settingsService.manageAlarmLogEmail(inputCreate, fillterDataSENSOR, validate_count);
                                }
                            }
                        }
                        else {
                            var setdatachk_main = {};
                            setdatachk_main.alarm_action_id = alarm_action_id;
                            setdatachk_main.device_id = device_id_mas;
                            var crsmaster = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                            if (crsmaster) {
                                var countalarm_LogSensor = parseInt(crsmaster.length);
                            }
                            else {
                                var countalarm_LogSensor = parseInt('0');
                            }
                            if (countalarm_LogSensor >= 1) {
                                if (alarmStatusSet != 999) {
                                    var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
                                    if (!isDuplicate) {
                                        await this.settingsService.getAlarmDetailsSendEmail(filter);
                                        await this.settingsService.manageAlarmLogEmail(inputCreate, fillterDataSENSOR, validate_count);
                                    }
                                }
                            }
                        }
                        if (alarmStatusSet == 999) {
                            const fillter_device_control = {};
                            fillter_device_control.alarm_action_id = alarm_action_id;
                            await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                        }
                    }
                }
                var mqttconnect = {
                    statusCode: 200,
                    code: 200,
                    status: 1,
                    payload: {
                        MQTTGETDATA,
                        getdeviceactivemqttAlarmEmail,
                        filter,
                        alarmStatusSet,
                    },
                    message: `Mqtt connect..device_access_email_check`,
                    message_th: `Mqtt connect..`,
                };
                return mqttconnect;
            }
            else {
                var mqttconnect = {
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
        }
        catch (error) {
            console.error('mqtt device_access_email_check error:', error);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: error.message || 'An error occurred',
                },
            });
        }
    }
    async getdeviceactivemqttAlarmEmail(query) {
        try {
            var main_type_id = Number(query.type_id);
            var device_id = query.device_id;
            var device_id_mas = query.device_id;
            var main_mqtt_name = query.mqtt_name;
            var main_event = query.event;
            var event = Number(query.event);
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
            var date_now = format.getCurrentDatenow();
            var time_now = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqtt2Service.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
                if (Mqttstatus == 0) {
                    const inputCreate = {
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
                    return checkConnectionMqtt;
                }
            }
            else {
                const inputCreate = {
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
                return checkConnectionMqtt;
            }
            var alarm_action_id = query.alarm_action_id;
            var deletecache = query.deletecache;
            var cachetimeset = 300;
            var ResultDataRS = [];
            var filterdeviceactiveAl = {};
            if (deletecache) {
                filterdeviceactiveAl.deletecache = deletecache;
            }
            if (alarm_action_id) {
                filterdeviceactiveAl.alarm_action_id = alarm_action_id;
            }
            if (query.device_id) {
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
            }
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_Al_Alarm_Email_' + filter_md5;
            var ResultData = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultData = await Cache.GetCacheData(kaycache_cache);
            if (ResultData) {
                var ResultData = ResultData;
                var cache_data_ResultData = 'cache';
            }
            else if (!ResultData) {
                var ResultData = await this.settingsService.deviceactiveAl(filterdeviceactiveAl);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var devicesensor = [];
            var deviceio = [];
            var devicecontrol = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning2 = rs.status_warning;
                    var status_alert2 = rs.status_alert;
                    var recovery_warning2 = rs.recovery_warning;
                    var recovery_alert2 = rs.recovery_alert;
                    var time_life = rs.time_life;
                    var period = rs.period;
                    var work_status = rs.work_status;
                    var max = rs.max;
                    var min = rs.min;
                    var oid = rs.oid;
                    var comparevalue = rs.comparevalue;
                    var createddate = rs.createddate;
                    var status = rs.status;
                    var unit = rs.unit;
                    var action_id = rs.action_id;
                    var status_alert_id = rs.status_alert_id;
                    var measurement = rs.measurement;
                    var type_name = rs.type_name;
                    var location_name = rs.location_name;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var latitude = rs.latitude;
                    var longitude = rs.longitude;
                    var mqtt_device_name = rs.mqtt_device_name;
                    var mqtt_status_over_name = rs.mqtt_status_over_name;
                    var mqtt_status_data_name = rs.mqtt_status_data_name;
                    var mqtt_act_relay_name = rs.mqtt_act_relay_name;
                    var mqtt_control_relay_name = rs.mqtt_control_relay_name;
                    var main_status_warning = rs.status_warning;
                    var main_status_alert = rs.status_alert;
                    var main_max = rs.max;
                    var main_min = rs.min;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    if (type_id == 1) {
                        var status_alert = query.status_alert;
                        var status_warning = query.status_warning;
                        var recovery_warning = query.recovery_warning;
                        var recovery_alert = query.recovery_alert;
                    }
                    else {
                        var status_alert = 0;
                        var status_warning = 0;
                        var recovery_warning = 1;
                        var recovery_alert = 1;
                    }
                    const mqttrs = await this.mqtt2Service.getMqttTopicDataRS(topic, deletecache);
                    const mqttrs_rs = mqttrs.data;
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
                        var rss = mqttrs.rs;
                        if (mqttstatus == 0) {
                            var inputCreate = {
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
                        let obj = [];
                        try {
                            obj = JSON.parse(configdata);
                        }
                        catch (e) {
                            throw e;
                        }
                        var mqtt_objt_data = Object.values(obj);
                        let obj2 = [];
                        try {
                            obj2 = JSON.parse(mqtt_status_data_name);
                        }
                        catch (e) {
                            throw e;
                        }
                        var mqttdata_arrs = await this.parseMqttData(mqttdata);
                        var mqttdata_arr = mqttdata_arrs['data'];
                        var mqtt_obj2_data = Object.values(obj2);
                        var mqttData_count = mqttdata_arr.length;
                        var mqttData = Object.fromEntries(mqtt_obj2_data.map((k, i) => [k, mqttdata_arr[i]]));
                        var merged_dataRs = format.mapMqttDataToDevices([va], mqttData);
                        var merged_data = merged_dataRs[0];
                        var merged2 = format.mapMqttDataToDeviceV2([va], mqttData);
                        var merged = merged2['0'];
                        if (merged) {
                            var value_data = merged.value_data;
                            var value_alarm = merged.value_alarm;
                            var value_relay = merged.value_relay;
                            var value_control_relay = merged.value_control_relay;
                        }
                        else {
                            var value_data = '';
                            var value_alarm = '';
                            var value_relay = '';
                            var value_control_relay = '';
                        }
                        var createddated = merged_data.createddate;
                        var createddate = format.timeConvertermas(format.convertTZ(createddated, process.env.tzString));
                        var updateddated = merged_data.updateddate;
                        var updateddate = format.timeConvertermas(format.convertTZ(updateddated, process.env.tzString));
                        var filter = {};
                        filter.alarmTypeId = main_type_id;
                        if (main_type_id == 1) {
                            filter.sensorValueData = encodeURI(value_data);
                            filter.status_warning = encodeURI(status_warning);
                            filter.status_alert = encodeURI(status_alert);
                            filter.recovery_warning = encodeURI(recovery_warning);
                            filter.recovery_alert = encodeURI(recovery_alert);
                            var data = value_data + ' ' + unit;
                        }
                        else {
                            filter.sensorValueData = encodeURI(value_alarm);
                            filter.status_warning = parseInt('0');
                            filter.status_alert = parseInt('0');
                            filter.recovery_warning = parseInt('1');
                            filter.recovery_alert = parseInt('1');
                            var data = Number(value_alarm);
                        }
                        filter.mqtt_name = mqtt_name;
                        filter.device_name = mqtt_device_name;
                        filter.action_name = mqtt_name;
                        filter.mqtt_control_on = encodeURI(mqtt_control_on);
                        filter.mqtt_control_off = encodeURI(mqtt_control_off);
                        filter.event = 1;
                        filter.unit = unit;
                        var getAlarmDetails = await this.settingsService.getAlarmDetailsAlert(filter);
                        if (getAlarmDetails) {
                            var subject = getAlarmDetails.subject;
                            var content = getAlarmDetails.content;
                            var status = getAlarmDetails.status;
                            var alarmStatusSet = getAlarmDetails.alarmStatusSet;
                            var dataAlarm = getAlarmDetails.dataAlarm;
                            var eventControl = getAlarmDetails.eventControl;
                            var messageMqttControl = getAlarmDetails.messageMqttControl;
                            var sensor_data = getAlarmDetails.sensor_data;
                            var count_alarm = getAlarmDetails.count_alarm;
                        }
                        else {
                            var subject = 'Normal';
                            var status = getAlarmDetails.status;
                            var alarmStatusSet = 999;
                        }
                        var status_report = {
                            1: 'Warning',
                            2: 'Alarm',
                            3: 'Recovery Warning',
                            4: 'Recovery Alarm',
                            5: 'Normal',
                        };
                        var timestamp = timestamps;
                        var sensor_data_name = subject;
                        if (type_id == 1) {
                            var value_data_msg = value_data;
                        }
                        else {
                            if (value_data == 1) {
                                var value_data_msg = 'ON';
                            }
                            else {
                                var value_data_msg = 'OFF';
                            }
                        }
                        if (status == 5) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        if (alarmStatusSet == 1) {
                            var validate_count = parseInt('2');
                        }
                        else if (alarmStatusSet == 2) {
                            var validate_count = parseInt('2');
                        }
                        else if (alarmStatusSet == 3) {
                            var validate_count = parseInt('1');
                        }
                        else {
                            var validate_count = parseInt('1');
                        }
                        var alarmTypeId = type_id;
                        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
                            if (event == 1) {
                                var eventSet = 1;
                            }
                            else {
                                var eventSet = 0;
                            }
                        }
                        else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                            if (event == 1) {
                                var eventSet = 0;
                            }
                            else {
                                var eventSet = 1;
                            }
                        }
                        if (type_id == 1) {
                            var dataAlarm = encodeURI(value_data);
                            var alarmValue = encodeURI(value_alarm);
                        }
                        else {
                            var dataAlarm = encodeURI(value_data);
                            var alarmValue = encodeURI(value_alarm);
                        }
                        var datenow = format.getCurrentDatenow();
                        var timenow = format.getCurrentTimenow();
                        var fillter_device_control = {};
                        fillter_device_control.alarm_action_id = alarm_action_id;
                        const countAlarmDeviceDontrol = Number(await this.settingsService.count_alarmprocesslog(fillter_device_control));
                        var RsIO = await this.settingsService.checkDuplicateLogIO(fillter_device_control);
                        var EmailRs = await this.settingsService.chk_alarmprocesslogemail(fillter_device_control);
                        var countalarm_LogIO = Number(RsIO.length);
                        if (countalarm_LogIO == 0) {
                            var createddate_logs = format.timeConvertermas(format.convertTZ(datenow, process.env.tzString));
                        }
                        else {
                            var createddate_logs = format.timeConvertermas(format.convertTZ(RsIO[0].createddate, process.env.tzString));
                        }
                        var countalarm_LogIEmail = Number(EmailRs.length);
                        if (countalarm_LogIEmail == 0) {
                            var createddate_logs_Email = format.timeConvertermas(format.convertTZ(datenow, process.env.tzString));
                        }
                        else {
                            var createddate_logs_Email = format.timeConvertermas(format.convertTZ(EmailRs[0].createddate, process.env.tzString));
                        }
                        var fillterDataSENSOR = {};
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
                        }
                        else if (alarmStatusSet == 2) {
                            fillterDataSENSOR.status_alert = status_alert;
                            fillterDataSENSOR.alarm_status = alarmStatusSet;
                        }
                        else if (alarmStatusSet == 3) {
                            fillterDataSENSOR.recovery_warning = recovery_warning;
                            fillterDataSENSOR.alarm_status = alarmStatusSet;
                        }
                        else if (alarmStatusSet == 4) {
                            fillterDataSENSOR.recovery_alert = recovery_alert;
                            fillterDataSENSOR.alarm_status = alarmStatusSet;
                        }
                        var inputCreateemail = {
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
                        var setdatachk_main = {};
                        setdatachk_main.alarm_action_id = alarm_action_id;
                        setdatachk_main.device_id = device_id;
                        var countDataEmail = await this.settingsService.countDataEmail(setdatachk_main);
                        var crsmaster = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main);
                        var crsmaster_main = [];
                        var crsmasterCount = crsmaster.length;
                        var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                        if (countDataEmail > 0) {
                            var now_time_cal_main = Number(format.diffMinutes(now_time_full, createddate_logs_Email));
                            var caseSet = 1;
                            if (now_time_cal_main > time_life) {
                                if (countDataEmail == 0) {
                                    if (alarmStatusSet != 999) {
                                        var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreateemail);
                                        if (!isDuplicate) {
                                            await this.settingsService.getAlarmDetailsSendEmail(filter);
                                            await this.settingsService.manageAlarmLogEmail(inputCreate, fillterDataSENSOR, validate_count);
                                        }
                                    }
                                }
                                else if (countDataEmail > validate_count) {
                                    if (alarmStatusSet == 999) {
                                        const fillter_device_control = {};
                                        fillter_device_control.alarm_action_id = alarm_action_id;
                                        fillter_device_control.device_id = device_id;
                                        await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                                    }
                                }
                            }
                            if (alarmStatusSet == 3 || alarmStatusSet == 4) {
                                if (alarmStatusSet != 999) {
                                    var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreateemail);
                                    if (!isDuplicate) {
                                        await this.settingsService.getAlarmDetailsSendEmail(filter);
                                        await this.settingsService.manageAlarmLogEmail(inputCreate, fillterDataSENSOR, validate_count);
                                    }
                                }
                            }
                            if (alarmStatusSet == 999) {
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id;
                                fillter_device_control.device_id = device_id;
                                await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                            }
                        }
                        else {
                            var createddate_logsMaim = now_time_full;
                            var now_time_cal_main = 0;
                            if (alarmStatusSet == 999) {
                                const fillter_device_control = {};
                                fillter_device_control.alarm_action_id = alarm_action_id;
                                fillter_device_control.date = format.getCurrentDatenow();
                                fillter_device_control.alarm_status = alarmStatusSet;
                                await this.settingsService.delete_alarmp_emaillog(fillter_device_control);
                            }
                            var fillterData = {};
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
                            }
                            else if (alarmStatusSet == 2) {
                                fillterData.status_alert = status_alert;
                                fillterData.alarm_status = alarmStatusSet;
                            }
                            else if (alarmStatusSet == 3) {
                                fillterData.recovery_warning = recovery_warning;
                                fillterData.alarm_status = alarmStatusSet;
                            }
                            else if (alarmStatusSet == 4) {
                                fillterData.recovery_alert = recovery_alert;
                                fillterData.alarm_status = alarmStatusSet;
                            }
                            var tag = 1;
                            const inputCreate = {
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
                                    var isDuplicate = await this.settingsService.checkDuplicateLogEmailOne(inputCreate);
                                    if (!isDuplicate) {
                                        await this.settingsService.getAlarmDetailsSendEmail(filter);
                                        await this.settingsService.manageAlarmLogEmail(inputCreate, fillterData, validate_count);
                                    }
                                }
                            }
                        }
                        var arraydata = {
                            device_id,
                            device_name,
                            mqtt_data_value,
                            mqtt_data_control,
                            mqtt_control_on,
                            mqtt_control_off,
                            type_name,
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
                            count_alarm,
                            value_alarm,
                            value_alarm_msg,
                            eventSet,
                            topic,
                            subject,
                            content,
                            dataAlarm,
                            alarmValue,
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
                                createddate_logs,
                                countalarm_LogIO,
                                countalarm_LogIEmail,
                                crsmasterCount,
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
                            cache: cache_data_ResultData,
                            alarmStatusSet,
                            mqttdata,
                            mqtt_status_data_name,
                            configdata,
                            status,
                            status_report,
                            mqttrs_rs,
                        };
                        if (type_id == 1) {
                            devicesensor.push(arraydata);
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                    }
                    else {
                        const inputCreate = {
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
                        var arraydata = {
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
        }
        catch (error) {
            var rss = {
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
    async scheduleproces(res, query, headers, params, req) {
        try {
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
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
            var device_status = 0;
            var ResultDatasendEmail = [];
            var useractive_arr = [];
            var filter_useractive = { status: 1 };
            var useractive = await this.UsersService.useractiveemail(filter_useractive);
            var user_arr = [];
            var device_id = query.device_id || '';
            var schedule_id = query.schedule_id || '';
            var page = Number(query.page) || 1;
            var pageSize = Number(query.pageSize) || 100000000000;
            var sort = query.sort;
            var keyword = query.keyword || '';
            var devicecontrol = '';
            if (!query.host_name) {
                var host_name = connectUrl_mqtt;
            }
            var cases = 0;
            var filter = [];
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
            var rowResultData = await this.mqtt2Service.scheduleprocess(filter);
            if (rowResultData == '' ||
                !rowResultData ||
                rowResultData.status == '422') {
                res.status(200).json({
                    statuscode: 200,
                    payload: null,
                    message: 'Data schedule proces is null.',
                    message_th: 'ไม่พบข้อมูล schedule proces.',
                });
                return;
            }
            var rowData = Number(rowResultData);
            var totalPages = Math.max(Math.ceil(rowData / pageSize), 1);
            var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
                pageSize });
            var today_name = '';
            var now_time = format.getCurrentTime();
            var now_time_cal = 3;
            var start_time = '';
            var end_time = '';
            var do_ststus = '';
            var ResultData = await this.mqtt2Service.scheduleprocess(filter2);
            let tempData = [];
            let tempDataoid = [];
            let tempData2 = [];
            for (const [key, va] of Object.entries(ResultData)) {
                const device_id = ResultData[key].device_id;
                var schedule_id = ResultData[key].schedule_id;
                var schedule_name = ResultData[key].schedule_name;
                var schedule_start = ResultData[key].schedule_event_start;
                var device_name = ResultData[key].device_name;
                var device_bucket = ResultData[key].device_bucket;
                var mqtt_bucket = ResultData[key].mqtt_bucket;
                var mqtt_name = ResultData[key].mqtt_name;
                var type_name = ResultData[key].type_name;
                var location_id = ResultData[key].location_id;
                var location_name = ResultData[key].location_name;
                var location_address = ResultData[key].location_address;
                var schedule_event_start = ResultData[key].schedule_event_start;
                var schedule_event = ResultData[key].schedule_event;
                var event = ResultData[key].schedule_event;
                var time_life = ResultData[key].time_life;
                var period = ResultData[key].period;
                var sunday = ResultData[key].sunday;
                var monday = ResultData[key].monday;
                var tuesday = ResultData[key].tuesday;
                var wednesday = ResultData[key].wednesday;
                var thursday = ResultData[key].thursday;
                var friday = ResultData[key].friday;
                var saturday = ResultData[key].saturday;
                var mqtt_id = ResultData[key].mqtt_id;
                var setting_id = ResultData[key].setting_id;
                var type_id = ResultData[key].type_id;
                var mqtt_data_value = ResultData[key].mqtt_data_value;
                var mqtt_data_control = ResultData[key].mqtt_data_control;
                var mqtt_control_on = ResultData[key].mqtt_control_on;
                var mqtt_control_off = ResultData[key].mqtt_control_off;
                var status_warning = ResultData[key].status_warning;
                var recovery_warning = ResultData[key].recovery_warning;
                var status_alert = ResultData[key].status_alert;
                var recovery_alert = ResultData[key].recovery_alert;
                var work_status = ResultData[key].work_status;
                var max = ResultData[key].max;
                var min = ResultData[key].min;
                var measurement = ResultData[key].measurement;
                var device_org = ResultData[key].device_org;
                var mqtt_org = ResultData[key].mqtt_org;
                var mqtt_device_name = ResultData[key].mqtt_device_name;
                var mqtt_status_over_name = ResultData[key].mqtt_status_over_name;
                var mqtt_act_relay_name = ResultData[key].mqtt_act_relay_name;
                var mqtt_control_relay_name = ResultData[key].mqtt_control_relay_name;
                var mqtt_message = ResultData[key].mqtt_control_relay_name;
                var type_id = ResultData[key].type_id;
                var type_name = ResultData[key].type_name;
                var group_id = ResultData[key].group_id;
                var host_id = ResultData[key].host_id;
                var host_name = ResultData[key].host_name;
                var idhost = ResultData[key].idhost;
                const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
                var today_name = format.getCurrentDayname();
                var now_time = format.getCurrentTime();
                if (today_name == 'sunday') {
                    if (sunday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'monday') {
                    if (monday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'tuesday') {
                    if (tuesday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'wednesday') {
                    if (wednesday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'thursday') {
                    if (thursday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'friday') {
                    if (friday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                else if (today_name == 'saturday') {
                    if (saturday == 1) {
                        var today_status = 1;
                    }
                    else {
                        var today_status = 0;
                    }
                }
                if (event == 1) {
                    var message_mqtt_control = mqtt_control_on;
                    var message_control = 'ON';
                    var device_1 = 1;
                }
                else {
                    var message_mqtt_control = mqtt_control_off;
                    var message_control = 'OFF';
                    var device_1 = 0;
                }
                var now_time_s = timestamp;
                var control_url = process.env.API_URL +
                    '/v1/mqtt3/control?topic=' +
                    mqtt_data_control +
                    '&message=' +
                    message_mqtt_control;
                var today_name = format.getCurrentDayname();
                var now_time = format.getCurrentTime();
                var now_time_1 = format.getCurrentTimeStatus(now_time, schedule_event_start);
                var now_time_2 = format.getCurrentTimeStatus(schedule_event_start, schedule_event_start);
                var now_time_1_s = format.getCurrentTimeStatusMsg(now_time, schedule_event_start);
                var now_time_2_s = format.getCurrentTimeStatusMsg(schedule_event_start, schedule_event_start);
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if (today_status == 1 && now_time_1 == now_time_2) {
                    if (now_time_1 == '1' && now_time_2 == '1') {
                        var dataset = {
                            schedule_id: schedule_id,
                            device_id: device_id,
                            schedule_event_start: schedule_event_start,
                            date: date_now,
                            schedule_event: message_mqtt_control,
                        };
                        var log_count = await this.mqtt2Service.scheduleprocesslog_count(dataset);
                        if (log_count >= 1) {
                            var log_count2 = await this.mqtt2Service.scheduleprocesslog_count_status(dataset);
                            if (log_count2 == 0) {
                                var deviceData = await this.mqtt2Service.getdevicedata(mqtt_data_value);
                                if (deviceData) {
                                    var devicecontrol = await this.mqtt2Service.devicecontrol(mqtt_data_control, message_mqtt_control);
                                    var now_time_s = timestamp;
                                    var datasetupdate = {
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
                                    await this.mqtt2Service.update_scheduleprocesslog_v2(datasetupdate);
                                }
                            }
                        }
                        else {
                            var createset = {
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
                                var devicecontrol = await this.mqtt2Service.devicecontrols(mqtt_data_control, message_mqtt_control, message_control);
                            }
                            var now_time_s = timestamp;
                            var deviceData = await this.mqtt2Service.getdevicedata(mqtt_data_value);
                            if (deviceData) {
                                if (log_count == 0) {
                                    await this.settingsService.create_scheduleprocesslog(createset);
                                }
                                if (message_control == 'ON') {
                                    var subject_event = 'On';
                                }
                                else {
                                    var subject_event = 'Off';
                                }
                                var subject = 'Schedule process ' +
                                    schedule_name +
                                    ' start ' +
                                    schedule_event_start +
                                    '  day ' +
                                    today_name;
                                var content = 'Schedule process ' +
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
                                var log_alarm_log = '';
                                if (log_count == 0) {
                                    var emails = [];
                                    for (const [k, v] of Object.entries(useractive)) {
                                        var email = useractive[k].email;
                                        emails.push(email);
                                        var mobile_number = useractive[k].mobile_number;
                                        var lineid = useractive[k].lineid;
                                        var user_arr = {
                                            email: email,
                                            mobile: mobile_number,
                                            lineid: lineid,
                                        };
                                        useractive_arr.push(user_arr);
                                    }
                                    await this.settingsService.sendEmail(emails, subject, content);
                                    var ResultDatasendEmail = 'sendEmail to ' + emails.join(', ');
                                }
                            }
                        }
                    }
                }
                else {
                    const ts = {
                        device_id: device_id,
                        schedule_id: schedule_id,
                    };
                }
                var event_control = 'OFF';
                if (event == 1) {
                    var event_control = 'ON';
                }
                const ProfileRs = {
                    device_id: device_id,
                    schedule_id: schedule_id,
                    schedule_name: schedule_name,
                    host_name,
                    location_address,
                    idhost,
                    location_id,
                    location_name,
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
        }
        catch (error) {
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
};
__decorate([
    (0, microservices_1.MessagePattern)('devices/+/status'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.MqttContext]),
    __metadata("design:returntype", void 0)
], Mqtt2Controller.prototype, "handleDeviceStatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "checkConnectionIndex", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('checkconnection'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "checkConnection", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('topic'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "topic", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('control'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "device_control_data", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicebuckets'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "devicebuckets", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('sensercharts'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "sensercharts", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'alarm device status' }),
    (0, common_1.Get)('alarmdevicestatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "alarmdevicestatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'monitordevicegroup' }),
    (0, common_1.Get)('monitordevicegroup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "monitordevicegroup", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('scheduleproces'),
    (0, swagger_1.ApiOperation)({ summary: 'schedule process' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], Mqtt2Controller.prototype, "scheduleproces", null);
Mqtt2Controller = Mqtt2Controller_1 = __decorate([
    (0, common_1.Controller)('mqtt2'),
    __metadata("design:paramtypes", [mqtt_service_1.MqttService,
        mqtt2_service_1.Mqtt2Service,
        mqtt3_service_1.Mqtt3Service,
        iot_service_1.IotService,
        users_service_1.UsersService,
        settings_service_1.SettingsService])
], Mqtt2Controller);
exports.Mqtt2Controller = Mqtt2Controller;
//# sourceMappingURL=mqtt2.controller.js.map