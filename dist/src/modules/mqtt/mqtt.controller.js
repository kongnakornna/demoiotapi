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
var MqttController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttController = void 0;
const common_1 = require("@nestjs/common");
let isOn = false;
let intervalId;
var moment = require('moment');
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const settings_service_1 = require("../settings/settings.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const jwt_1 = require("@nestjs/jwt");
const format = __importStar(require("../../helpers/format.helper"));
const { passwordStrength } = require('check-password-strength');
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const roles_service_1 = require("../roles/roles.service");
var Cache = new redis_cache_1.CacheDataOne();
var md5 = require('md5');
require("dotenv/config");
var tzString = process.env.tzString;
require('dotenv').config();
const iot_service_1 = require("../iot/iot.service");
const mqtt_service_1 = require("./mqtt.service");
const microservices_1 = require("@nestjs/microservices");
class PublishDto {
    constructor() {
        this.topic = 'AIR1/CONTROL';
        this.message = '1';
    }
}
let MqttController = MqttController_1 = class MqttController {
    constructor(settingsService, mqttService, rolesService, usersService, authService, jwtService, IotService) {
        this.settingsService = settingsService;
        this.mqttService = mqttService;
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
        this.IotService = IotService;
        this.logger = new common_1.Logger(MqttController_1.name);
    }
    handleDeviceStatus(data, context) {
        this.logger.log(`สถานะอุปกรณ์จาก Topic: ${context.getTopic()}`);
        this.logger.log(`ข้อมูลสถานะ: ${JSON.stringify(data)}`);
    }
    async createMqttErrorLog(checkConnectionMqtt, isConnected = false) {
        const inputCreate = {
            name: isConnected ? 'MQTT Connected' : 'MQTT Not Connected',
            statusmqtt: +(checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.status) || 0,
            msg: 'Error ' + ((checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.msg) || 'Unknown error'),
            device_id: 0,
            type_id: 0,
            device_name: 0,
            date: format.getCurrentDatenow(),
            time: format.getCurrentTimenow(),
            data: 'Error ' + ((checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.msg) || 'Unknown error'),
            status: (checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.status) || 0,
            createddate: new Date(),
        };
        await this.mqttService.create_mqttlogRepository(inputCreate);
        return inputCreate;
    }
    createErrorResponse(messageEn, messageTh, code = 200, payload = null) {
        return {
            statusCode: 200,
            code: code,
            payload: payload,
            message: messageEn,
            message_th: messageTh,
        };
    }
    async checkMqttConnection(res) {
        try {
            const checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (!checkConnectionMqtt) {
                await this.createMqttErrorLog({ status: 0, msg: 'Connection check failed' }, false);
                res
                    .status(200)
                    .json(this.createErrorResponse('MQTT connection check failed', 'ตรวจสอบการเชื่อมต่อ MQTT ล้มเหลว', 200, { Mqttstatus: 0, payload: checkConnectionMqtt }));
                return false;
            }
            const Mqttstatus = checkConnectionMqtt.status;
            if (Mqttstatus === 0) {
                await this.createMqttErrorLog(checkConnectionMqtt, false);
                res
                    .status(200)
                    .json(this.createErrorResponse('MQTT is not connected', 'MQTT ไม่ได้เชื่อมต่อ', 200, { Mqttstatus, payload: checkConnectionMqtt }));
                return false;
            }
            return true;
        }
        catch (error) {
            this.logger.error(`MQTT connection check error: ${error.message}`);
            return false;
        }
    }
    async mqttdevicepage(res, query, headers, params, req) {
        const connectionResult = await this.mqttService.checkConnectionStatusMqtt();
        if (!connectionResult.isConnected) {
            return res.status(200).json(this.createErrorResponse('MQTT is not connected', 'MQTT ไม่ได้เชื่อมต่อ', 200, {
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
            }));
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var buckets = query.bucket;
        var bucket = buckets;
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
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'Index_listdevicepage_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active_al(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == '' ||
            !rowResultData ||
            rowResultData.status == '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = 'Index_listdevicepagemd5_' + md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active_al(filter2);
            var InpuDatacache = {
                keycache: `${filter2keymd5}`,
                time: 3600,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
                var status_warning = rs.status_warning;
                var status_alert = rs.status_alert;
                var recovery_warning = rs.recovery_warning;
                var recovery_alert = rs.recovery_alert;
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
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                var mqttrs = await this.mqttService.getDataTopicPage(topic, deletecache);
                var timestampMqtt = mqttrs.timestamp;
                if (timestampMqtt) {
                    var timestamps = timestampMqtt;
                }
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                    var filters = {};
                    filters.alarmTypeId = main_type_id;
                    if (main_type_id == 1) {
                        filters.sensorValueData = encodeURI(value_data);
                        filters.status_warning = encodeURI(status_warning);
                        filters.status_alert = encodeURI(status_alert);
                        filters.recovery_warning = encodeURI(recovery_warning);
                        filters.recovery_alert = encodeURI(recovery_alert);
                        var data = value_data + ' ' + unit;
                    }
                    else {
                        filters.sensorValueData = encodeURI(value_alarm);
                        filters.status_warning = Number(0);
                        filters.status_alert = Number(0);
                        filters.recovery_warning = Number(1);
                        filters.recovery_alert = Number(1);
                        var data = Number(value_alarm);
                    }
                    filters.mqtt_name = mqtt_name;
                    filters.device_name = mqtt_device_name;
                    filters.action_name = mqtt_name;
                    filters.mqtt_control_on = encodeURI(mqtt_control_on);
                    filters.mqtt_control_off = encodeURI(mqtt_control_off);
                    filters.event = 1;
                    filters.unit = unit;
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
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
                    }
                    else if (type_id > 1) {
                        deviceio.push(arraydata);
                    }
                }
                const arraydatarr = {
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
    async getDeviceDataIndexmq(res, dto, query, headers, req) {
        try {
            let filter = {};
            var bucket = query.bucket;
            if (!bucket) {
                res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    payload: bucket,
                    message: 'bucket inull',
                    message_th: 'check bucket inull',
                });
            }
            var status = query.status;
            if (!status) {
                var status = 1;
            }
            var deletecache = query.deletecache;
            filter.status = status;
            filter.bucket = bucket;
            var kaycache = md5('mqtt_status_m_' + status + '_bucket_' + bucket);
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var Resultate = await Cache.GetCacheData(kaycache);
            if (!Resultate) {
                var Resultate = await this.mqttService.mqtt_list_paginate_active(filter);
                var InpuDatacache = {
                    keycache: `${kaycache}`,
                    time: 120,
                    data: Resultate,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data = 'no cache';
            }
            else {
                var cache_data = 'cache';
            }
            let ArrayData = [];
            for (const [key, va] of Object.entries(Resultate)) {
                let filter2 = {};
                filter2.bucket = Resultate[key].bucket;
                console.log(`filter2 =>` + filter2);
                console.info(filter2);
                var kaycache_cache = md5('mqtt_bucket_' + Resultate[key].bucket);
                if (deletecache == 1) {
                    await Cache.DeleteCacheData(kaycache_cache);
                }
                var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
                if (!ResultDatadevice) {
                    var ResultDatadevice = await this.settingsService.device_lists(filter2);
                    var InpuDatacache = {
                        keycache: `${kaycache_cache}`,
                        time: 120,
                        data: ResultDatadevice,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    var cache_data_2 = 'no cache';
                }
                else {
                    var cache_data_2 = 'cache';
                }
                var deviceData = [];
                for (const [key2, va] of Object.entries(ResultDatadevice)) {
                    var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                    var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                    var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                    const arraydata = {
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
                        control_on: 'mqtt/control?topic=' +
                            ResultDatadevice[key2].mqtt_data_control +
                            '&message=' +
                            ResultDatadevice[key2].mqtt_control_on,
                        mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                        control_off: 'mqtt/control?topic=' +
                            ResultDatadevice[key2].mqtt_data_control +
                            '&message=' +
                            ResultDatadevice[key2].mqtt_control_off,
                        location_name: ResultDatadevice[key2].location_name,
                        mqtt_name: ResultDatadevice[key2].mqtt_name,
                        mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                    deviceData.push(arraydata);
                }
                const arraydata = {
                    mqtt_id: Resultate[key].mqtt_id,
                    mqtt_name: Resultate[key].mqtt_name,
                    cache: cache_data,
                    cache2: cache_data_2,
                    device: deviceData,
                    mqtt: mqttdata['payload'],
                    org: Resultate[key].org,
                    bucket: Resultate[key].bucket,
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
        }
        catch (error) {
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
    async getDeviceAir(res, dto, query, headers, req) {
        try {
            let filter = {};
            var bucket = query.bucket;
            if (!bucket) {
                res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    payload: bucket,
                    message: 'bucket inull',
                    message_th: 'check bucket inull',
                });
            }
            var status = query.status;
            if (!status) {
                var status = 1;
            }
            var deletecache = query.deletecache;
            filter.status = status;
            filter.bucket = bucket;
            var kaycache = md5('mqtt_status_m_' + status + '_bucket_' + bucket);
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var Resultate = await Cache.GetCacheData(kaycache);
            if (!Resultate) {
                var Resultate = await this.mqttService.mqtt_list_paginate_active(filter);
                var InpuDatacache = {
                    keycache: `${kaycache}`,
                    time: 120,
                    data: Resultate,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data = 'no cache';
            }
            else {
                var cache_data = 'cache';
            }
            let ArrayData = [];
            for (const [key, va] of Object.entries(Resultate)) {
                let filter2 = {};
                filter2.bucket = Resultate[key].bucket;
                console.log(`filter2 =>` + filter2);
                console.info(filter2);
                var kaycache_cache = md5('mqtt_bucket_' + Resultate[key].bucket);
                if (deletecache == 1) {
                    await Cache.DeleteCacheData(kaycache_cache);
                }
                var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
                if (!ResultDatadevice) {
                    var ResultDatadevice = await this.settingsService.device_lists(filter2);
                    var InpuDatacache = {
                        keycache: `${kaycache_cache}`,
                        time: 120,
                        data: ResultDatadevice,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    var cache_data_2 = 'no cache';
                }
                else {
                    var cache_data_2 = 'cache';
                }
                var deviceData = [];
                for (const [key2, va] of Object.entries(ResultDatadevice)) {
                    var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                    var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                    var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                    const arraydata = {
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
                        control_on: 'mqtt/control?topic=' +
                            ResultDatadevice[key2].mqtt_data_control +
                            '&message=' +
                            ResultDatadevice[key2].mqtt_control_on,
                        mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                        control_off: 'mqtt/control?topic=' +
                            ResultDatadevice[key2].mqtt_data_control +
                            '&message=' +
                            ResultDatadevice[key2].mqtt_control_off,
                        location_name: ResultDatadevice[key2].location_name,
                        mqtt_name: ResultDatadevice[key2].mqtt_name,
                        mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                    deviceData.push(arraydata);
                }
                const arraydata = {
                    mqtt_id: Resultate[key].mqtt_id,
                    mqtt_name: Resultate[key].mqtt_name,
                    cache: cache_data,
                    cache2: cache_data_2,
                    device: deviceData,
                    mqtt: mqttdata['payload'],
                    org: Resultate[key].org,
                    bucket: Resultate[key].bucket,
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
        }
        catch (error) {
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
    async checkConnection(res, dto, query, headers, req) {
        try {
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
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
            }
            else {
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
    async deviceactivemqtt(res, dto, query, headers, req) {
        try {
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
            if (query.device_id) {
                filter.device_id = query.device_id;
            }
            if (query.keyword) {
                filter.keyword = query.keyword;
            }
            if (query.type_id) {
                filter.keyword = query.type_id;
            }
            var filter_md5 = md5(filter);
            var kaycache_cache = 'deviceactive_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactive(filter);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var ResultDataRS = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    const va = ResultData[key];
                    const device_id = va.device_id;
                    const type_id = va.type_id;
                    const device_name = va.device_name;
                    const mqtt_data_value = va.mqtt_data_value;
                    const mqtt_data_control = va.mqtt_data_control;
                    const mqtt_control_on = va.mqtt_control_on;
                    const mqtt_control_off = va.mqtt_control_off;
                    const device_org = va.device_org;
                    const device_bucket = va.device_bucket;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttmsg = mqttrs.msg;
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
                                data: mqttmsg,
                                status: 1,
                                createddate: new Date(),
                            };
                            await this.mqttService.create_mqttlogRepository(inputCreate);
                        }
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
                            topic,
                            mqttrs,
                            inputCreate,
                        };
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
                        await this.mqttService.create_mqttlogRepository(inputCreate);
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
    async deviceactivemqttAlarm(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var ResultDataRS = [];
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
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    var alarmStatusSet = 999;
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
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
    async getDeviceairV1(res, dto, query, headers, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        var location_id = query.location_id;
        if (!location_id) {
            var location_id = 5;
        }
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        filter.location_id = location_id;
        var kaycache = md5('air_mqtt_status_air_' +
            status +
            '_bucket_' +
            bucket +
            '_location_id_' +
            location_id);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (!Resultate) {
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
        let ArrayDataAir = [];
        for (const [key, va] of Object.entries(Resultate)) {
            var rs = Resultate[key];
            var mqtt_id = rs.mqtt_id;
            var mqtt_type_id = rs.mqtt_type_id;
            var sort = rs.sort;
            var location_name = rs.location_name;
            var mqtt_name = rs.mqtt_name;
            var org = rs.org;
            var bucket = rs.bucket;
            var envavorment = rs.envavorment;
            var createddate = rs.createddate;
            var status = rs.status;
            var location_id = rs.location_id;
            var latitude = rs.latitude;
            var longitude = rs.longitude;
            var type_name = rs.type_name;
            var filterdevice = {};
            filterdevice.type_name = type_name;
            filterdevice.mqtt_id = mqtt_id || '';
            filterdevice.org = org;
            filterdevice.bucket = bucket;
            filterdevice.deletecache = deletecache;
            var device = await this.devicemoniiterRSS(filterdevice);
            if (!device) {
                var device = [];
            }
            const DataRs = {
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
    async getDeviceair(res, dto, query, headers, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        var location_id = query.location_id;
        if (!location_id) {
            var location_id = 5;
        }
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        filter.location_id = location_id;
        var kaycache = md5('air_mqtt_status_air_' +
            status +
            '_bucket_' +
            bucket +
            '_location_id_' +
            location_id);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (!Resultate) {
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
        let ArrayDataAir = [];
        for (const [key, va] of Object.entries(Resultate)) {
            var rs = Resultate[key];
            var mqtt_id = rs.mqtt_id;
            var mqtt_type_id = rs.mqtt_type_id;
            var sort = rs.sort;
            var location_name = rs.location_name;
            var mqtt_name = rs.mqtt_name;
            var org = rs.org;
            var bucket = rs.bucket;
            var envavorment = rs.envavorment;
            var createddate = rs.createddate;
            var status = rs.status;
            var location_id = rs.location_id;
            var latitude = rs.latitude;
            var longitude = rs.longitude;
            var type_name = rs.type_name;
            const DataRs = {
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
    async getDevicefanapp(res, dto, query, headers, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        var location_id = query.location_id;
        if (!location_id) {
            var location_id = 1;
        }
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        filter.location_id = location_id;
        var kaycache = md5('fan_mqtt_status_fanapp_' +
            status +
            '_bucket_' +
            bucket +
            '_location_id_' +
            location_id);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (!Resultate) {
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
        let ArrayDataAir = [];
        for (const [key, va] of Object.entries(Resultate)) {
            var rs = Resultate[key];
            var mqtt_id = rs.mqtt_id;
            var mqtt_type_id = rs.mqtt_type_id;
            var sort = rs.sort;
            var location_name = rs.location_name;
            var mqtt_name = rs.mqtt_name;
            var org = rs.org;
            var bucket = rs.bucket;
            var envavorment = rs.envavorment;
            var createddate = rs.createddate;
            var status = rs.status;
            var location_id = rs.location_id;
            var latitude = rs.latitude;
            var longitude = rs.longitude;
            var type_name = rs.type_name;
            const DataRs = {
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
    async fanlist(res, dto, query, headers, req) {
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        var location_id = query.location_id;
        if (!location_id) {
            var location_id = 1;
        }
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        filter.location_id = location_id;
        var kaycache = md5('fan_mqtt_status_fan_' +
            status +
            '_bucket_' +
            bucket +
            '_location_id_' +
            location_id);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_fan_app(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data_fan = 'no cache fan';
        }
        else {
            var cache_data_fan = 'cache fan';
        }
        if (!Resultate) {
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
        let ArrayDataAir = [];
        for (const [key, va] of Object.entries(Resultate)) {
            var rs = Resultate[key];
            var mqtt_id = rs.mqtt_id;
            var mqtt_type_id = rs.mqtt_type_id;
            var sort = rs.sort;
            var location_name = rs.location_name;
            var mqtt_name = rs.mqtt_name;
            var org = rs.org;
            var bucket = rs.bucket;
            var envavorment = rs.envavorment;
            var createddate = rs.createddate;
            var status = rs.status;
            var location_id = rs.location_id;
            var latitude = rs.latitude;
            var longitude = rs.longitude;
            var type_name = rs.type_name;
            var filterdevice = {};
            filterdevice.type_name = type_name;
            filterdevice.mqtt_id = mqtt_id || '';
            filterdevice.org = org;
            filterdevice.bucket = bucket;
            filterdevice.deletecache = deletecache;
            var device = await this.devicemoniiterRSSFan(filterdevice);
            if (!device) {
                var device = [];
            }
            const DataRs = {
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
    async getDeviceDatafan(res, dto, query, headers, req) {
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = md5('fan_mqtt_status_m_' + status + '_bucket_' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_fan(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        let ArrayData = [];
        for (const [key, va] of Object.entries(Resultate)) {
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = md5('mqtt_bucket_' + Resultate[key].bucket);
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            var deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                const arraydata = {
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
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                device: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
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
    async getMqttlist(res, dto, query, headers, req) {
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = md5('mqtt_status_listtitle_' + status + '_bucket_' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        let ArrayData = [];
        for (const [key, va] of Object.entries(Resultate)) {
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'mqtt_listtitle_bucket_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                sort: Resultate[key].sort,
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
    async getMqttlistall(res, dto, query, headers, req) {
        let filter = {};
        var bucket = query.bucket;
        var status = query.status;
        if (!status) {
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = md5('mqtt_status_listtitle_all_' + status + '_bucket_' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_all_data(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        let ArrayData = [];
        for (const [key, va] of Object.entries(Resultate)) {
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'mqtt_listtitle_all_bucket_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                sort: Resultate[key].sort,
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
    async DeviceDataGet(res, dto, query, headers, req) {
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
        var deletecache = query.deletecache;
        let filter = {};
        filter.mqtt_data_value = query.topic;
        console.log(`filter =>` + filter);
        console.info(filter);
        var mqttdata = await this.mqttService.getdevicedata(query.topic);
        var kaycache_cache = 'mqtt_getdevice_topic_' + query.topic;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache_cache);
        }
        var ResultData = await Cache.GetCacheData(kaycache_cache);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_lists(filter);
            var InpuDatacache = {
                keycache: `${kaycache_cache}`,
                time: 120,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data_2 = 'no cache';
        }
        else {
            var cache_data_2 = 'cache';
        }
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const arraydata = {
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
                control_on: 'mqtt/control?topic=' +
                    ResultData[key].mqtt_data_control +
                    '&message=' +
                    ResultData[key].mqtt_control_on,
                mqtt_control_off: ResultData[key].mqtt_control_off,
                control_off: 'mqtt/control?topic=' +
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
        var Rsdata = {
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
        };
        res.status(200).json(Rsdata);
        return;
    }
    async device_control1(res, dto, query, headers, params, req) {
        var topic_mqtt = query.topic;
        var message_mqtt = query.message;
        try {
            var Rt = await this.mqttService.publish(topic_mqtt, message_mqtt);
            var InpuDatacache = {
                keycache: `${topic_mqtt}`,
                data: message_mqtt,
            };
            await Cache.SetCacheKey(InpuDatacache);
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
            const originalTopic = topic_mqtt;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            var topicrs = 'topic_mqtt_' + newTopic;
            var GetCacheData = await Cache.GetCacheData(newTopic);
            if (GetCacheData) {
                Cache.DeleteCacheData(newTopic);
            }
            console.log(newTopic);
            if (message_mqtt == 0) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 1) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 1,
                    device_status: 'on',
                };
            }
            else if (message_mqtt == 2) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 3) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 1,
                    device_status: 'on',
                };
            }
            var dataRs = await this.mqttService.getDataFromTopic(newTopic);
            var InpuDatacache = {
                keycache: `${newTopic}`,
                time: 10,
                data: dataRs,
            };
            await Cache.SetCacheData(InpuDatacache);
            var mqttdata = await Cache.GetCacheData(newTopic);
            const parts = mqttdata.split(',');
            const getDataObject = {
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
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.REQUEST_TIMEOUT);
        }
    }
    async device_control(res, dto, query, headers, params, req) {
        var topic_mqtt = query.topic;
        var message_mqtt = query.message;
        try {
            var Rt = await this.mqttService.publish(topic_mqtt, message_mqtt);
            var InpuDatacache = {
                keycache: `${topic_mqtt}`,
                data: message_mqtt,
            };
            await Cache.SetCacheKey(InpuDatacache);
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
            const originalTopic = topic_mqtt;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            Cache.DeleteCacheData(newTopic);
            var GetCacheData = await Cache.GetCacheData(newTopic);
            if (GetCacheData) {
                Cache.DeleteCacheData(newTopic);
            }
            var mqttdata = await Cache.GetCacheData(newTopic);
            console.log(newTopic);
            if (message_mqtt == 0) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 1) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 1,
                    device_status: 'on',
                };
            }
            else if (message_mqtt == 2) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 3) {
                var dataObject = {
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
            var InpuDatacache = {
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
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.REQUEST_TIMEOUT);
        }
    }
    async devicelistcontrolsV2(res, dto, query, headers, req) {
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
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
            var now = new Date();
            var pad = (num) => String(num).padStart(2, '0');
            var datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate()),
            ].join('-');
            var timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds()),
            ].join(':');
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getMqttTopicDataRS(topic, deletecache);
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
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
                            mqttdata,
                            mqtt_status_data_name,
                            configdata,
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
    async listdevicepageactive(res, query, headers, params, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var buckets = query.bucket;
        var bucket = buckets;
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
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'mqttListDevicePageActives_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active_al(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == '' ||
            !rowResultData ||
            rowResultData.status == '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active_al(filter2);
            var InpuDatacache = {
                keycache: `${filter2keymd5}`,
                time: 3600,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
                var status_warning = rs.status_warning;
                var status_alert = rs.status_alert;
                var recovery_warning = rs.recovery_warning;
                var recovery_alert = rs.recovery_alert;
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
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                const mqttrs = await this.mqttService.getMqttTopicDataRS(topic, deletecache);
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                    var filters = {};
                    filters.alarmTypeId = main_type_id;
                    if (main_type_id == 1) {
                        filters.sensorValueData = encodeURI(value_data);
                        filters.status_warning = encodeURI(status_warning);
                        filters.status_alert = encodeURI(status_alert);
                        filters.recovery_warning = encodeURI(recovery_warning);
                        filters.recovery_alert = encodeURI(recovery_alert);
                        var data = value_data + ' ' + unit;
                    }
                    else {
                        filters.sensorValueData = encodeURI(value_alarm);
                        filters.status_warning = Number(0);
                        filters.status_alert = Number(0);
                        filters.recovery_warning = Number(1);
                        filters.recovery_alert = Number(1);
                        var data = Number(value_alarm);
                    }
                    filters.mqtt_name = mqtt_name;
                    filters.device_name = mqtt_device_name;
                    filters.action_name = mqtt_name;
                    filters.mqtt_control_on = encodeURI(mqtt_control_on);
                    filters.mqtt_control_off = encodeURI(mqtt_control_off);
                    filters.event = 1;
                    filters.unit = unit;
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
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
                        mqttrs,
                        mqtt_status_data_name,
                        configdata,
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
                        mqttrs: 'Error',
                        mqtt_status_data_name,
                        configdata,
                    };
                }
                devicecontrol.push(arraydata);
            }
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
                connectionMqtt: checkConnectionMqtt,
                cache: cache_data,
                data: devicecontrol,
            },
            message: 'Device cache success.',
            message_th: 'Device cache success.',
        });
    }
    async listdevicepageair(res, query, headers, params, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var buckets = query.bucket;
        var bucket = buckets;
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
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'listdevicepage_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active_al(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == '' ||
            !rowResultData ||
            rowResultData.status == '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = 'listdevicepagemd5_' + md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active_al(filter2);
            var InpuDatacache = {
                keycache: `${filter2keymd5}`,
                time: 3600,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
                var status_warning = rs.status_warning;
                var status_alert = rs.status_alert;
                var recovery_warning = rs.recovery_warning;
                var recovery_alert = rs.recovery_alert;
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
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                var mqttrs = await this.mqttService.getMqttTopicPA1(topic, deletecache);
                var timestampMqtt = mqttrs.timestamp;
                if (timestampMqtt) {
                    var timestamps = timestampMqtt;
                }
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                    var merged2Mode = format.mapMqttDataToDeviceALLMode([va], mqttData);
                    var active = 1;
                    var airmod = await this.IotService.get_airmod_active(active);
                    if (airmod) {
                        var airmodName = airmod.name;
                        var airsmod = airmod.data;
                    }
                    else {
                        var airmodName = 'auto';
                        var airsmod = 's';
                    }
                    var airwarning = await this.IotService.get_warning_active(active);
                    var airperiod = await this.IotService.get_airperiod_active(active);
                    var mergedMode = merged2Mode;
                    if (mergedMode) {
                        var warning = merged2Mode.warning;
                        var airperiod = merged2Mode.period;
                        var mode = merged2Mode.mode;
                        var stateair1 = merged2Mode.stateair1;
                        var stateair2 = merged2Mode.stateair2;
                        var air1alarm = merged2Mode.air1alarm;
                        var air2alarm = merged2Mode.stateair2;
                    }
                    else {
                        var mergedMode = 35;
                        var airperiod = 6;
                        var mode = 1;
                        var stateair1 = 1;
                        var stateair2 = 1;
                        var air1alarm = 1;
                        var air2alarm = 1;
                    }
                    var merged_dataRs = format.mapMqttDataToDevices([va], mqttData);
                    var merged_data = merged_dataRs[0];
                    var merged2 = format.mapMqttDataToDeviceV2([va], mqttData);
                    var merged2Alls = format.mapMqttDataToDeviceALL([va], mqttData);
                    var merged2All = merged2Alls.mqttData;
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
                    var filters = {};
                    filters.alarmTypeId = main_type_id;
                    if (main_type_id == 1) {
                        filters.sensorValueData = encodeURI(value_data);
                        filters.status_warning = encodeURI(status_warning);
                        filters.status_alert = encodeURI(status_alert);
                        filters.recovery_warning = encodeURI(recovery_warning);
                        filters.recovery_alert = encodeURI(recovery_alert);
                        var data = value_data + ' ' + unit;
                    }
                    else {
                        filters.sensorValueData = encodeURI(value_alarm);
                        filters.status_warning = Number(0);
                        filters.status_alert = Number(0);
                        filters.recovery_warning = Number(1);
                        filters.recovery_alert = Number(1);
                        var data = Number(value_alarm);
                    }
                    filters.mqtt_name = mqtt_name;
                    filters.device_name = mqtt_device_name;
                    filters.action_name = mqtt_name;
                    filters.mqtt_control_on = encodeURI(mqtt_control_on);
                    filters.mqtt_control_off = encodeURI(mqtt_control_off);
                    filters.event = 1;
                    filters.unit = unit;
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
                    var arraydata = {
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
    async listdevicepage(res, query, headers, params, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var buckets = query.bucket;
        var bucket = buckets;
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
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'listdevicepage_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active_al(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == '' ||
            !rowResultData ||
            rowResultData.status == '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = 'listdevicepagemd5_' + md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active_al(filter2);
            var InpuDatacache = {
                keycache: `${filter2keymd5}`,
                time: 3600,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
                var host_id = rs.host_id;
                var host_name = rs.host_name;
                var hardware_type_name = rs.hardware_type_name;
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
                var status_warning = rs.status_warning;
                var status_alert = rs.status_alert;
                var recovery_warning = rs.recovery_warning;
                var recovery_alert = rs.recovery_alert;
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
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                var mqttrs = await this.mqttService.getDataTopicPage(topic, deletecache);
                var timestampMqtt = mqttrs.timestamp;
                if (timestampMqtt) {
                    var timestamps = timestampMqtt;
                }
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                    var merged2Alls = format.mapMqttDataToDeviceALL([va], mqttData);
                    var merged2All = merged2Alls.mqttData;
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
                    var filters = {};
                    filters.alarmTypeId = main_type_id;
                    if (main_type_id == 1) {
                        filters.sensorValueData = encodeURI(value_data);
                        filters.status_warning = encodeURI(status_warning);
                        filters.status_alert = encodeURI(status_alert);
                        filters.recovery_warning = encodeURI(recovery_warning);
                        filters.recovery_alert = encodeURI(recovery_alert);
                        var data = value_data + ' ' + unit;
                    }
                    else {
                        filters.sensorValueData = encodeURI(value_alarm);
                        filters.status_warning = Number(0);
                        filters.status_alert = Number(0);
                        filters.recovery_warning = Number(1);
                        filters.recovery_alert = Number(1);
                        var data = Number(value_alarm);
                    }
                    filters.mqtt_name = mqtt_name;
                    filters.device_name = mqtt_device_name;
                    filters.action_name = mqtt_name;
                    filters.mqtt_control_on = encodeURI(mqtt_control_on);
                    filters.mqtt_control_off = encodeURI(mqtt_control_off);
                    filters.event = 1;
                    filters.unit = unit;
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
                    var arraydata = {
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
                        mqttrs,
                        mqtt_status_data_name,
                        configdata,
                        merged,
                        mqttdata_arr,
                        mqtt_obj2_data,
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
    async listdevicepageV1(res, query, headers, params, req) {
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
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var buckets = query.bucket;
        var bucket = buckets;
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
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'listdevicepage_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active_al(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 3600,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == '' ||
            !rowResultData ||
            rowResultData.status == '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = 'listdevicepagemd5_' + md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active_al(filter2);
            var InpuDatacache = {
                keycache: `${filter2keymd5}`,
                time: 3600,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
                var status_warning = rs.status_warning;
                var status_alert = rs.status_alert;
                var recovery_warning = rs.recovery_warning;
                var recovery_alert = rs.recovery_alert;
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
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                var mqttrs = await this.mqttService.getDataTopicPage(topic, deletecache);
                var timestampMqtt = mqttrs.timestamp;
                if (timestampMqtt) {
                    var timestamps = timestampMqtt;
                }
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                    var filters = {};
                    filters.alarmTypeId = main_type_id;
                    if (main_type_id == 1) {
                        filters.sensorValueData = encodeURI(value_data);
                        filters.status_warning = encodeURI(status_warning);
                        filters.status_alert = encodeURI(status_alert);
                        filters.recovery_warning = encodeURI(recovery_warning);
                        filters.recovery_alert = encodeURI(recovery_alert);
                        var data = value_data + ' ' + unit;
                    }
                    else {
                        filters.sensorValueData = encodeURI(value_alarm);
                        filters.status_warning = Number(0);
                        filters.status_alert = Number(0);
                        filters.recovery_warning = Number(1);
                        filters.recovery_alert = Number(1);
                        var data = Number(value_alarm);
                    }
                    filters.mqtt_name = mqtt_name;
                    filters.device_name = mqtt_device_name;
                    filters.action_name = mqtt_name;
                    filters.mqtt_control_on = encodeURI(mqtt_control_on);
                    filters.mqtt_control_off = encodeURI(mqtt_control_off);
                    filters.event = 1;
                    filters.unit = unit;
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
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
                        mqttrs,
                        mqtt_status_data_name,
                        configdata,
                        merged,
                        mqttdata_arr,
                        mqtt_obj2_data,
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
    async getDeviceData(res, dto, query, headers, req) {
        const topic = query.topic;
        const deletecache = query.deletecache;
        if (!topic) {
            res.status(200).json(this.createErrorResponse('Topic is required', 'กรุณาระบุ topic', 400));
            return;
        }
        try {
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
            console.log(`Requesting data from topic: ${topic}`);
            if (deletecache == 1) {
                await Cache.DeleteCacheData(topic);
            }
            var data = await Cache.GetCacheData(topic);
            if (data) {
                var dataObject = data;
                var getdataFrom = 'Cache';
            }
            else if (!data) {
                var data = await this.mqttService.getDataFromTopic(topic);
                if (!data) {
                    var dataObjects = {
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
                var getdataFrom = 'MQTT';
                var mqttdata = await this.mqttService.getDataFromTopic(topic);
                const parts = mqttdata.split(',');
                const dataObject = {
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
                var InpuDatacache = {
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
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.REQUEST_TIMEOUT);
        }
    }
    async DeviceData(res, dto, query, headers, req) {
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
        const deletecache = query.deletecache;
        let filter = {};
        filter.mqtt_data_value = query.topic;
        console.log(`filter =>` + filter);
        console.info(filter);
        var mqttdata = await this.mqttService.getdevicedata(query.topic);
        var kaycache1 = 'get_device_' + md5(query.topic);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache1);
        }
        var ResultData = await Cache.GetCacheData(kaycache1);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_lists(filter);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 5,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const arraydata = {
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
                control_on: 'mqtt/control?topic=' +
                    ResultData[key].mqtt_data_control +
                    '&message=' +
                    ResultData[key].mqtt_control_on,
                mqtt_control_off: ResultData[key].mqtt_control_off,
                control_off: 'mqtt/control?topic=' +
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
        var Rsdata = {
            statusCode: mqttdata['statusCode'],
            code: mqttdata['code'],
            topic: mqttdata['topic'],
            timestamp: mqttdata['payload']['timestamp'],
            data: mqttdata['payload'],
            dataFrom: mqttdata['getdataFrom'],
            payload: tempData2,
        };
        res.status(200).json(Rsdata);
        return;
    }
    async device_control_data(res, dto, query, headers, params, req) {
        var topic = query.topic;
        var message = query.message;
        if (!topic) {
            res
                .status(200)
                .json(this.createErrorResponse('Topic is required', 'กรุณาระบุ topic', 400));
            return;
        }
        if (!message) {
            res
                .status(200)
                .json(this.createErrorResponse('Message is required', 'กรุณาระบุ message', 400));
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
        var data = await this.mqttService.devicecontrol(topic_send, message_send);
        res.status(200).json(data);
        return;
    }
    async _device_get_data2(res, dto, query, headers, params, req) {
        var topic = query.topic;
        var message = query.message;
        if (!topic) {
            res.status(200).json(this.createErrorResponse('Topic is required', 'กรุณาระบุ topic', 400));
            return;
        }
        var data = await this.mqttService.getDataFromTopic(topic);
        var parts = data.split(',');
        res.status(200).json({
            statuscode: 200,
            code: 200,
            message: 'mqtt topic ' + topic,
            message_th: 'mqtt topic ' + topic,
            payload: { data: data, parts: parts },
        });
        return;
    }
    async device_get_data(res, dto, query, headers, params, req) {
        const topic = query.topic;
        if (!topic) {
            res.status(200).json(this.createErrorResponse('Topic is required', 'กรุณาระบุ topic', 400));
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
        }
        catch (error) {
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
    async sensercharts(res, query, headers, params, req) {
        const start = query.start || '-8m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '8m';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
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
        var kaycache1 = 'get_start_to_end_v1_' +
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
        var kaycache2 = 'get_start_to_end_v2_' +
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
        var kaycache3 = 'get_start_to_end_v3_' +
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
    async airsenserchartsV1(res, query, headers, params, req) {
        var datenow = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            var Mqttstatus = checkConnectionMqtt.status;
            if (Mqttstatus == 0) {
                var inputCreate = {
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
        }
        else {
            var inputCreate = {
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
        var start = query.start || '-8m';
        var stop = query.stop || 'now()';
        var windowPeriod = query.windowPeriod || '8m';
        var tzString = query.tzString || 'Asia/Bangkok';
        var bucket = query.bucket;
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
        var measurement = query.measurement;
        if (!measurement) {
            var measurement = 'temperature';
        }
        var field = query.field || 'value';
        var time = query.time || '8m';
        var limit = query.limit || 120;
        var offset = query.offset || 0;
        var mean = query.mean || 'last';
        var Dtos = {
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
        var kaycache1 = 'get_start_to_end_v1_' +
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
        var kaycache2 = 'get_start_to_end_v2_' +
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
        var kaycache3 = 'get_start_to_end_v3_' +
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = 'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                var temperature = mqttdata['payload']['temperature'];
                if (!temperature) {
                    var temperature = '25.10';
                }
                const arraydata = {
                    device_id: ResultDatadevice[key2].device_id,
                    type_id: ResultDatadevice[key2].type_id,
                    device_name: ResultDatadevice[key2].device_name,
                    type_name: ResultDatadevice[key2].type_name,
                    timestamp: mqttdata['payload']['timestamp'],
                    temperature_value: temperature,
                    status_warning: ResultDatadevice[key2].status_warning,
                    recovery_warning: ResultDatadevice[key2].recovery_warning,
                    status_alert: ResultDatadevice[key2].status_alert,
                    recovery_alert: ResultDatadevice[key2].recovery_alert,
                    time_life: ResultDatadevice[key2].time_life,
                    mqtt_data_value: mqtt_data_value,
                    mqtt_data_control: mqtt_data_control,
                    mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
                    mqtt_dada: mqttdata['payload']['mqtt_dada'],
                    contRelay1: mqttdata['payload']['contRelay1'],
                    actRelay1: mqttdata['payload']['actRelay1'],
                    contRelay2: mqttdata['payload']['contRelay2'],
                    actRelay2: mqttdata['payload']['actRelay2'],
                    fan1: mqttdata['payload']['fan1'],
                    overFan1: mqttdata['payload']['overFan1'],
                    fan2: mqttdata['payload']['fan2'],
                    overFan2: mqttdata['payload']['overFan2'],
                    data,
                };
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                data: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
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
                device: ArrayData,
            });
            return;
        }
    }
    async airsensercharts(res, query, headers, params, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var datenow = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
        if (checkConnectionMqtt) {
            var Mqttstatus = checkConnectionMqtt.status;
            if (Mqttstatus == 0) {
                var inputCreate = {
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
        }
        else {
            var inputCreate = {
                name: 'Mqtt Not connect',
                statusmqtt: +(checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.status),
                msg: 'Error ' + (checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.msg),
                device_id: 0,
                type_id: 0,
                device_name: 0,
                date: format.getCurrentDatenow(),
                time: format.getCurrentTimenow(),
                data: 'Error' + (checkConnectionMqtt === null || checkConnectionMqtt === void 0 ? void 0 : checkConnectionMqtt.msg),
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
        var start = query.start || '-8m';
        var stop = query.stop || 'now()';
        var windowPeriod = query.windowPeriod || '8m';
        var tzString = query.tzString || 'Asia/Bangkok';
        var bucket = query.bucket;
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
        var measurement = query.measurement;
        if (!measurement) {
            var measurement = 'temperature';
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
        var field = query.field || 'value';
        var time = query.time || '8m';
        var limit = query.limit || 120;
        var offset = query.offset || 0;
        var mean = query.mean || 'last';
        var Dtos = {
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
        var kaycache1 = 'get_start_to_end_v1_' +
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
        if (data[0].measurement) {
            var temperature = data[0].measurement;
        }
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
        var kaycache2 = 'get_start_to_end_v2_' +
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
        var kaycache3 = 'get_start_to_end_v3_' +
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = 'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                var temperature = (mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload.temperature) || '25.10';
                const arraydata = {
                    device_id: ResultDatadevice[key2].device_id,
                    type_id: ResultDatadevice[key2].type_id,
                    device_name: ResultDatadevice[key2].device_name,
                    type_name: ResultDatadevice[key2].type_name,
                    timestamp: ((_a = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _a === void 0 ? void 0 : _a.timestamp) || null,
                    temperature_value: temperature,
                    status_warning: ResultDatadevice[key2].status_warning,
                    recovery_warning: ResultDatadevice[key2].recovery_warning,
                    status_alert: ResultDatadevice[key2].status_alert,
                    recovery_alert: ResultDatadevice[key2].recovery_alert,
                    time_life: ResultDatadevice[key2].time_life,
                    mqtt_data_value: mqtt_data_value,
                    mqtt_data_control: mqtt_data_control,
                    mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
                    mqtt_dada: ((_b = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _b === void 0 ? void 0 : _b.mqtt_dada) || null,
                    contRelay1: ((_c = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _c === void 0 ? void 0 : _c.contRelay1) || null,
                    actRelay1: ((_d = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _d === void 0 ? void 0 : _d.actRelay1) || null,
                    contRelay2: ((_e = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _e === void 0 ? void 0 : _e.contRelay2) || null,
                    actRelay2: ((_f = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _f === void 0 ? void 0 : _f.actRelay2) || null,
                    fan1: ((_g = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _g === void 0 ? void 0 : _g.fan1) || null,
                    overFan1: ((_h = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _h === void 0 ? void 0 : _h.overFan1) || null,
                    fan2: ((_j = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _j === void 0 ? void 0 : _j.fan2) || null,
                    overFan2: ((_k = mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) === null || _k === void 0 ? void 0 : _k.overFan2) || null,
                    data,
                };
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                data: deviceData,
                mqtt: (mqttdata === null || mqttdata === void 0 ? void 0 : mqttdata.payload) || {},
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
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
                device: ArrayData,
            });
            return;
        }
    }
    async mqttsenserchartsv1(res, query, headers, params, req) {
        const start = query.start || '-2m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = 'sd_mqtt_list_paginate_active_air_' + status + '_bucket_' + bucket;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'sd_mqtt_bucket_air_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                var temperature = mqttdata['payload']['temperature'];
                if (!temperature) {
                    var temperature = '25.10';
                }
                const arraydata = {
                    device_id: ResultDatadevice[key2].device_id,
                    type_id: ResultDatadevice[key2].type_id,
                    device_name: ResultDatadevice[key2].device_name,
                    type_name: ResultDatadevice[key2].type_name,
                    timestamp: mqttdata['payload']['timestamp'],
                    temperature_value: temperature,
                    status_warning: ResultDatadevice[key2].status_warning,
                    recovery_warning: ResultDatadevice[key2].recovery_warning,
                    status_alert: ResultDatadevice[key2].status_alert,
                    recovery_alert: ResultDatadevice[key2].recovery_alert,
                    time_life: ResultDatadevice[key2].time_life,
                    mqtt_data_value: mqtt_data_value,
                    mqtt_data_control: mqtt_data_control,
                    mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                device: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
        }
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '2m';
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
        var kaycache1 = 'get_air_mqtt_senser_chart_v1_' +
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
        var data = await Cache.GetCacheData(kaycache1);
        if (!data) {
            var data = await this.IotService.influxdbFilterData(Dtos);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 300,
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
        var kaycache2 = 'get_air_mqtt_senser_chart_v2_' +
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
        var kaycache3 = 'get_air_mqtt_senser_chart_v3_' +
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
                message: 'get air mqtt senser chart',
                status: 1,
                bucket: data[0].bucket,
                field: data[0].field,
                payload: data[0],
                chart: { data: data1, date: data2 },
                name: data[0].field,
                cache: cache_data,
                datamqtt: ArrayData,
                mqtt_name: ArrayData['0']['mqtt_name'],
                org: ArrayData['0']['org'],
                mqtt: ArrayData['0']['mqtt'],
            });
            return;
        }
    }
    async senserchart(res, query, headers, params, req) {
        try {
            const start = query.start || '-1m';
            const stop = query.stop || 'now()';
            const windowPeriod = query.windowPeriod || '15s';
            const tzString = query.tzString || 'Asia/Bangkok';
            const bucket = query.bucket;
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
            const measurement = query.measurement || 'temperature';
            const field = query.field || 'value';
            const time = query.time || '1m';
            const limit = query.limit || 20;
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
            var kaycache1 = 'get_startend_v1_' +
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
            var kaycache2 = 'get_startend_v2_' +
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
            var kaycache3 = 'get_startend_v3_' +
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
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: {},
                message: 'Internal server error 500',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
                error: error.message || error,
            });
        }
    }
    async mqttsenserchart22(res, query, headers, params, req) {
        const start = query.start || '-2m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var Resultate = await this.mqttService.mqtt_list_paginate_active(filter);
        let ArrayData = [];
        for (const [key, va] of Object.entries(Resultate)) {
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var ResultDatadevice = await this.settingsService.device_lists(filter2);
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                const arraydata = {
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
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                device: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
        }
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '2m';
        const limit = query.limit || 50;
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
        var data = await this.IotService.influxdbFilterData(Dtos);
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
        var kaycache2 = 'get_mqtt_senser_chart_v2_' +
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
        var kaycache3 = 'get_mqtt_senser_chart_v3_' +
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
                datamqtt: ArrayData,
                mqtt_name: ArrayData['0']['mqtt_name'],
                org: ArrayData['0']['org'],
                mqtt: ArrayData['0']['mqtt'],
            });
            return;
        }
    }
    async mqttsenserchartcache(res, query, headers, params, req) {
        const start = query.start || '-2m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = 'mqtt_senser_chart_status_fan_' + status + '_bucket_' + bucket;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_fan(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'mqtt_bucket_fan_' + Resultate[key].bucket;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                var temperature = mqttdata['payload']['temperature'];
                if (!temperature) {
                    var temperature = '25.10';
                }
                const arraydata = {
                    device_id: ResultDatadevice[key2].device_id,
                    type_id: ResultDatadevice[key2].type_id,
                    device_name: ResultDatadevice[key2].device_name,
                    type_name: ResultDatadevice[key2].type_name,
                    timestamp: mqttdata['payload']['timestamp'],
                    temperature_value: temperature,
                    status_warning: ResultDatadevice[key2].status_warning,
                    recovery_warning: ResultDatadevice[key2].recovery_warning,
                    status_alert: ResultDatadevice[key2].status_alert,
                    recovery_alert: ResultDatadevice[key2].recovery_alert,
                    time_life: ResultDatadevice[key2].time_life,
                    mqtt_data_value: mqtt_data_value,
                    mqtt_data_control: mqtt_data_control,
                    mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                device: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
        }
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '2m';
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
        var kaycache1 = 'get_mqtt_senser_chart_v1_' +
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
        var data = await Cache.GetCacheData(kaycache1);
        if (!data) {
            var data = await this.IotService.influxdbFilterData(Dtos);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 300,
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
        var kaycache2 = 'get_mqtt_senser_chart_v2_' +
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
        var kaycache3 = 'get_mqtt_senser_chart_v3_' +
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
                datamqtt: ArrayData,
                mqtt_name: ArrayData['0']['mqtt_name'],
                org: ArrayData['0']['org'],
                mqtt: ArrayData['0']['mqtt'],
            });
            return;
        }
    }
    async mqttsenserchartaircache(res, query, headers, params, req) {
        const start = query.start || '-2m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
        var location_id = query.location_id;
        if (!location_id) {
            var location_id = 5;
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
        let filter = {};
        var status = query.status;
        bucket;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        filter.location_id = location_id;
        var kaycache = 'mqtt_senser_chart_status_air_' +
            status +
            '_bucket_' +
            bucket +
            '_location_id_' +
            location_id;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active_air(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
            let filter2 = {};
            filter2.bucket = Resultate[key].bucket;
            filter2.location_id = location_id;
            console.log(`filter2 =>` + filter2);
            console.info(filter2);
            var kaycache_cache = 'mqtt_bucket_air_' +
                Resultate[key].bucket +
                '_location_id_' +
                location_id;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
            if (!ResultDatadevice) {
                var ResultDatadevice = await this.settingsService.device_air_lists(filter2);
                var InpuDatacache = {
                    keycache: `${kaycache_cache}`,
                    time: 300,
                    data: ResultDatadevice,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data_2 = 'no cache';
            }
            else {
                var cache_data_2 = 'cache';
            }
            console.log('------------------------ResultDatadevice-----api---------------------');
            console.info(ResultDatadevice);
            console.log('------------------------ResultDatadevice-----Start---------------------');
            console.info(ResultDatadevice);
            console.log('------------------------ResultDatadevice-----End---------------------');
            let deviceData = [];
            for (const [key2, va] of Object.entries(ResultDatadevice)) {
                var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
                var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
                var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
                var temperature = mqttdata['payload']['temperature'];
                if (!temperature) {
                    var temperature = '25.10';
                }
                const arraydata = {
                    device_id: ResultDatadevice[key2].device_id,
                    type_id: ResultDatadevice[key2].type_id,
                    device_name: ResultDatadevice[key2].device_name,
                    type_name: ResultDatadevice[key2].type_name,
                    timestamp: mqttdata['payload']['timestamp'],
                    temperature_value: temperature,
                    status_warning: ResultDatadevice[key2].status_warning,
                    recovery_warning: ResultDatadevice[key2].recovery_warning,
                    status_alert: ResultDatadevice[key2].status_alert,
                    recovery_alert: ResultDatadevice[key2].recovery_alert,
                    time_life: ResultDatadevice[key2].time_life,
                    mqtt_data_value: mqtt_data_value,
                    mqtt_data_control: mqtt_data_control,
                    mqtt_control_on: ResultDatadevice[key2].mqtt_control_on,
                    control_on: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_on,
                    mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                    control_off: 'mqtt/control?topic=' +
                        ResultDatadevice[key2].mqtt_data_control +
                        '&message=' +
                        ResultDatadevice[key2].mqtt_control_off,
                    location_name: ResultDatadevice[key2].location_name,
                    mqtt_name: ResultDatadevice[key2].mqtt_name,
                    mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
                deviceData.push(arraydata);
            }
            const arraydata = {
                mqtt_id: Resultate[key].mqtt_id,
                mqtt_name: Resultate[key].mqtt_name,
                cache: cache_data,
                cache2: cache_data_2,
                device: deviceData,
                mqtt: mqttdata['payload'],
                org: Resultate[key].org,
                bucket: Resultate[key].bucket,
                status: Resultate[key].status,
            };
            ArrayData.push(arraydata);
        }
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '2m';
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
        var kaycache1 = 'get_mqtt_senser_chart_air_' +
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
        var data = await Cache.GetCacheData(kaycache1);
        if (!data) {
            var data = await this.IotService.influxdbFilterData(Dtos);
            var InpuDatacache = {
                keycache: `${kaycache1}`,
                time: 300,
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
        var kaycache2 = 'get_mqtt_senser_chart_air_' +
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
        var kaycache3 = 'get_mqtt_senser_chart_v3_' +
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
                datamqtt: ArrayData,
                mqtt_name: ArrayData['0']['mqtt_name'],
                org: ArrayData['0']['org'],
                mqtt: ArrayData['0']['mqtt'],
            });
            return;
        }
    }
    async mqttsenserchartcachev2(res, query, headers, params, req) {
        const start = query.start || '-2m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
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
        let filter = {};
        var status = query.status;
        if (!status) {
            var status = 1;
        }
        var deletecache = query.deletecache;
        filter.status = status;
        filter.bucket = bucket;
        var kaycache = 'mqtt_sensers_chartv2_status_' + status + '_bucket_' + bucket;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var Resultate = await Cache.GetCacheData(kaycache);
        if (!Resultate) {
            var Resultate = await this.mqttService.mqtt_list_paginate_active(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: Resultate,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
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
        var buckets = Resultate['0']['bucket'];
        let filters = {};
        filters.bucket = buckets;
        console.log(`filter2 =>` + filters);
        console.info(filters);
        var kaycache_cache = 'mqtt_sensers_v2_bucket_' + buckets;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache_cache);
        }
        var ResultDatadevice = await Cache.GetCacheData(kaycache_cache);
        if (!ResultDatadevice) {
            var ResultDatadevice = await this.settingsService.device_lists(filters);
            var InpuDatacache = {
                keycache: `${kaycache_cache}`,
                time: 300,
                data: ResultDatadevice,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data_2 = 'no cache';
        }
        else {
            var cache_data_2 = 'cache';
        }
        var mqtt_data_value = ResultDatadevice['0'].mqtt_data_value;
        var mqtt_data_control = ResultDatadevice['0'].mqtt_data_control;
        var location_id = ResultDatadevice['0'].location_id;
        var location_name = ResultDatadevice['0'].location_name;
        var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
        var mqtt_data = mqttrs['data'];
        var mqtt_timestamp = mqttrs['timestamp'];
        var mqtt_topic = mqttrs['topic'];
        var configdata = ResultDatadevice['0'].configdata;
        var obj = [];
        try {
            var obj = JSON.parse(configdata);
        }
        catch (e) {
            throw e;
        }
        var mqtt_objt_data = Object.values(obj);
        const result_mqtt = Object.fromEntries(mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]));
        console.log(result_mqtt);
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '2m';
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
        var kaycache1 = 'get_mqttData_chart_v1_' +
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
        var kaycache2 = 'get_mqttData_chart_v2_' +
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
        var kaycache3 = 'get_mqttData_chart_v3_' +
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
        var deviceData = [];
        for (const [key2, va] of Object.entries(ResultDatadevice)) {
            var mqtt_data_value = ResultDatadevice[key2].mqtt_data_value;
            var mqtt_data_control = ResultDatadevice[key2].mqtt_data_control;
            const arraydata = {
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
                control_on: 'mqtt/control?topic=' +
                    ResultDatadevice[key2].mqtt_data_control +
                    '&message=' +
                    ResultDatadevice[key2].mqtt_control_on,
                mqtt_control_off: ResultDatadevice[key2].mqtt_control_off,
                control_off: 'mqtt/control?topic=' +
                    ResultDatadevice[key2].mqtt_data_control +
                    '&message=' +
                    ResultDatadevice[key2].mqtt_control_off,
                location_name: ResultDatadevice[key2].location_name,
                mqtt_name: ResultDatadevice[key2].mqtt_name,
                mqtt_bucket: ResultDatadevice[key2].mqtt_bucket,
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
        const mergedData = format.mapMqttDataToDevices(deviceData, result_mqtt);
        const combinedArray = mergedData.map((data, index) => (Object.assign(Object.assign({}, deviceData[index]), data)));
        res.status(200).json({
            code: 200,
            location_id: location_id,
            location_name: location_name,
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
    async deviceactivemqtttest(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var ResultDataRS = [];
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
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
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
    async deviceactivemqttappv1(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var arraydataMain = [];
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
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    res.status(200).json({
                        statuscode: 200,
                        code: 200,
                        Mqttstatus,
                        payload: { topic },
                        message: 'check  Mqtt topic ' + topic,
                        message_th: 'check Mqtt topic',
                    });
                    return;
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    res.status(200).json({
                        statuscode: 200,
                        code: 200,
                        Mqttstatus,
                        payload: { topic, mqttrs },
                        message: 'check  Mqtt topic',
                        message_th: 'check Mqtt topic',
                    });
                    return;
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
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
                    cache: cache_data_ResultData,
                    checkConnectionMqtt,
                    devicesensor: devicesensor,
                    deviceio: deviceio,
                },
                message: 'check Connection Status Mqtt',
                message_th: 'check Connection Status Mqtt',
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
    async devicelistcontrols(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var arraydataMain = [];
            var devicecontrol = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
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
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        if (type_id == 1) {
                            devicesensor.push(arraydata);
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        devicecontrol.push(arraydata);
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
                    cache: cache_data_ResultData,
                    checkConnectionMqtt,
                    devicesensor: devicesensor,
                    deviceio: deviceio,
                    devicecontrol: devicecontrol,
                },
                message: 'check Connection Status Mqtt',
                message_th: 'check Connection Status Mqtt',
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
    async deviceactivemqttapp(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var deletecache = query.deletecache;
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var device_id = rs.device_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
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
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        if (type_id == 1) {
                            devicesensor.push(arraydata);
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        devicecontrol.push(arraydata);
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
                    cache: cache_data_ResultData,
                    checkConnectionMqtt,
                    devicesensor: devicesensor,
                    deviceio: deviceio,
                    devicecontrol: devicecontrol,
                },
                message: 'check Connection Status Mqtt',
                message_th: 'check Connection Status Mqtt',
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
    async deviceactivemqttt(res, dto, query, headers, req) {
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var cachetimeset = 3600;
            var deletecache = query.deletecache;
            var bucket = query.bucket;
            if (!bucket) {
                res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    payload: bucket,
                    message: 'bucket inull',
                    message_th: 'check bucket inull',
                });
            }
            var status = query.status;
            if (!status) {
                var status = 1;
            }
            var filterMain = {};
            var deletecache = query.deletecache;
            filterMain.status = status;
            filterMain.bucket = bucket;
            var kaycache = md5('mqtt_status_device_actives_' + status + '_bucket_' + bucket);
            console.log(`filterMain=`);
            console.info(filterMain);
            var ResultDataMainArr = [];
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var ResultDataMainArr = await Cache.GetCacheData(kaycache);
            if (ResultDataMainArr) {
                var cache_data_ResultData = 'cache';
                var ResultDataMainArr = ResultDataMainArr;
            }
            else {
                var rs = await this.settingsService.mqtt_filter(filterMain);
                var ResultDataMainArr = rs['0'];
                var rs = {
                    keycache: `${kaycache}`,
                    time: cachetimeset,
                    data: ResultDataMainArr,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            if (ResultDataMainArr) {
                var ResultDataMainArrRS = {
                    mqtt_id: ResultDataMainArr.mqtt_id,
                    location_id: ResultDataMainArr.location_id,
                    mqtt_type_id: ResultDataMainArr.mqtt_type_id,
                    mqtt_name: ResultDataMainArr.mqtt_name,
                    location_name: ResultDataMainArr.location_name,
                    bucket: ResultDataMainArr.bucket,
                    org: ResultDataMainArr.org,
                };
            }
            else {
                var ResultDataMainArrRS = [];
            }
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
                var rs = {
                    keycache: `${kaycache_cache}`,
                    time: cachetimeset,
                    data: ResultData,
                };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            var ResultDataRSMain = [];
            var ResultDataRS = [];
            var arraydataMain = [];
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
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    const topic = encodeURI(mqtt_data_value);
                    const mqttrs = await this.mqttService.getDataFromTopic(topic);
                    if (mqttrs) {
                        var mqttstatus = mqttrs;
                        var mqttdata = mqttrs;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        if (main_type_id == 1) {
                            var arraydataMain = {
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
                                mqttrs,
                            };
                            ResultDataRSMain.push(arraydataMain);
                        }
                        else {
                            var arraydata = {
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
                                mqttrs,
                            };
                            ResultDataRS.push(arraydata);
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
                        var arraydataMain = [];
                        var arraydata = [];
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
        }
        catch (error) {
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
    async deviceactivemqtttalarm(res, dto, query, headers, req) {
        try {
            var delete_cache = query.deletecache;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            var sort = query.sort;
            var keyword = query.keyword;
            var location_id = query.location_id;
            var deletecache = query.deletecache;
            var filter2alarm = {};
            filter2alarm.sort = sort;
            filter2alarm.keyword = keyword || '';
            filter2alarm.type_name = query.type_name || '';
            filter2alarm.status = status || 1;
            console.log(`filter2alarm=`);
            console.info(filter2alarm);
            var tempData2 = [];
            var cachekey = 'device_list_alarm_air' + md5(filter2alarm);
            var tempData2 = [];
            var filtercache = encodeURI(sort +
                keyword +
                query.type_name +
                query.device_id +
                query.mqtt_id +
                query.type_id +
                query.org +
                query.bucket +
                status);
            var filterkeymd5 = md5(filtercache);
            var kaycache = 'devicealarmallss_' + filterkeymd5;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var ResultDataalarm = await Cache.GetCacheData(kaycache);
            if (!ResultDataalarm) {
                let ResultDataalarm = await this.settingsService.device_list_ststus_alarm_all(filter2alarm);
                var InpuDatacache = {
                    keycache: `${kaycache}`,
                    time: 600,
                    data: ResultDataalarm,
                };
                await Cache.SetCacheData(InpuDatacache);
                var cache_data = 'no cache';
            }
            else {
                var cache_data = 'cache';
            }
            let tempDataoid = [];
            let dataAlert = [];
            for (var [key, va] of Object.entries(ResultDataalarm)) {
                var rs = ResultDataalarm[key];
                var device_id = rs.device_id;
                var mqtt_id = rs.mqtt_id;
                var setting_id = rs.setting_id;
                var type_id = rs.type_id;
                var device_name = rs.device_name;
                var sn = rs.sn;
                var hardware_id = rs.hardware_id;
                var status_warning = rs.status_warning;
                var recovery_warning = rs.recovery_warning;
                var status_alert = rs.status_alert;
                var recovery_alert = rs.recovery_alert;
                var time_life = rs.time_life;
                var period = rs.period;
                var work_status = rs.work_status;
                var max = rs.max;
                var min = rs.min;
                var oid = rs.oid;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var comparevalue = rs.comparevalue;
                var createddate = rs.createddate;
                var status = rs.status;
                var unit = rs.unit;
                var action_id = rs.action_id;
                var status_alert_id = rs.status_alert_id;
                var measurement = rs.measurement;
                var mqtt_control_on = rs.mqtt_control_on;
                var mqtt_control_off = rs.mqtt_control_off;
                var device_org = rs.device_org;
                var device_bucket = rs.device_bucket;
                var type_name = rs.type_name;
                var location_name = rs.location_name;
                var mqtt_name = rs.mqtt_name;
                var mqtt_org = rs.mqtt_org;
                var mqtt_bucket = rs.mqtt_bucket;
                var mqtt_envavorment = rs.mqtt_envavorment;
                var latitude = rs.latitude;
                var longitude = rs.longitude;
                var mqtt_main_id = rs.mqtt_main_id;
                var mqtt_device_name = rs.mqtt_device_name;
                var mqtt_status_over_name = rs.mqtt_status_over_name;
                var mqtt_status_data_name = rs.mqtt_status_data_name;
                var mqtt_act_relay_name = rs.mqtt_act_relay_name;
                var mqtt_control_relay_name = rs.mqtt_control_relay_name;
                var main_status_warning = rs.status_warning;
                var main_status_alert = rs.status_alert;
                var main_max = rs.max;
                var main_min = rs.min;
                var main_type_id = rs.type_id;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var configdata = mqtt_status_data_name;
                var main_type_id = rs.type_id;
                var configdata = mqtt_status_data_name;
                const topic = encodeURI(mqtt_data_value);
                const mqttrs = await this.mqttService.getDataTopicCacheData(topic);
                if (mqttrs) {
                    var mqttstatus = mqttrs.status;
                    var mqttdata = mqttrs.msg;
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
                        filter.status_warning = Number(0);
                        filter.status_alert = Number(0);
                        filter.recovery_warning = Number(1);
                        filter.recovery_alert = Number(1);
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
                        var alarmStatusSet = '';
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
                    if (value_alarm == 1) {
                        var value_alarm_msg = 'Normal';
                    }
                    else {
                        var value_alarm_msg = 'Alarm!';
                    }
                }
                var DataRs = {
                    cache_data,
                    topic,
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
                };
                if (status != 5) {
                    tempDataoid.push(DataRs);
                }
            }
            res.status(200).json({
                statuscode: 200,
                code: 200,
                checkConnectionMqtt,
                Mqttstatus,
                payload: tempDataoid,
                message: 'check Connection Mqtt device alarm',
                message_th: 'check Connection Mqtt ',
            });
        }
        catch (error) {
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
    async device_list_paginate_actives_sss(res, query, headers, params, req) {
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
        var deletecache = query.deletecache;
        var filtercache = encodeURI(sort +
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
            'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'mqtt_listdevicepageactive_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active(filter);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: rowResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData === '' ||
            !rowResultData ||
            rowResultData.status === '422') {
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
        var filter2 = Object.assign(Object.assign({}, filter), { isCount: 0, page,
            pageSize });
        var filter2cache = encodeURI(page +
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
            'isCount0');
        var filter2keymd5 = md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active(filter2);
            var InpuDatacache = {
                keycache: `${kaycache}`,
                time: 300,
                data: ResultData,
            };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        var tempData2 = [];
        for (var va of ResultData) {
            var mqtt_data_value = va.mqtt_data_value;
            var mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
            var mqtt_data = mqttrs['data'];
            var mqtt_timestamp = mqttrs['timestamp'];
            var timestamp = mqttrs['timestamp'];
            var configdata = va.configdata;
            var mqttrs_count = mqtt_data.length;
            let obj = [];
            try {
                obj = JSON.parse(configdata);
            }
            catch (e) {
                throw e;
            }
            var mqtt_objt_data = Object.values(obj);
            var mqtt_count = mqtt_objt_data.length;
            var mqtt_status_data_name = va.mqtt_status_data_name;
            let obj2 = [];
            try {
                obj2 = JSON.parse(mqtt_status_data_name);
            }
            catch (e) {
                throw e;
            }
            var mqtt_obj2_data = Object.values(obj2);
            var mqtt2_count = mqtt_obj2_data.length;
            var mqtt_v1 = Object.fromEntries(mqtt_obj2_data.map((k, i) => [k, mqtt_data[i]]));
            console.log('mqtt_v1=>' + mqtt_v1);
            var mqtt_v2 = Object.fromEntries(mqtt_objt_data.map((k, i) => [k, mqtt_data[i]]));
            console.log('mqtt_v2=>' + mqtt_v2);
            if (mqttrs_count < mqtt_count) {
                var mqtt = mqtt_v1;
            }
            else {
                var mqtt = mqtt_v2;
            }
            var merged = format.mapMqttDataToDeviceV2([va], mqtt)[0];
            tempData2.push(Object.assign(Object.assign(Object.assign({}, va), merged), { timestamp,
                mqttrs,
                mqttrs_count,
                mqtt_v1,
                mqtt_count,
                mqtt_v2,
                mqtt }));
        }
        var configdata = ResultData['0'].configdata;
        var mqtt_data = ResultData['0'].mqtt_data_value;
        var mqttrss = await this.mqttService.getdevicedataAll(mqtt_data);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                page,
                currentPage: page,
                pageSize,
                totalPages,
                total: rowData,
                mqttrs: tempData2['0']['data'],
                data: tempData2,
            },
            message: 'v2 list device success.',
            message_th: 'v2 lists device success.',
        });
    }
    async parseMqttData(mqttdata) {
        try {
            const data = mqttdata.split(',').map(item => parseFloat(item.trim()) || 0);
            return { data: data };
        }
        catch (error) {
            this.logger.error(`Parse MQTT data error: ${error.message}`);
            return { data: [] };
        }
    }
    async parseData2(dataString) {
        const parts = dataString.split(',');
        return {
            device: parts[0],
            name: parseFloat(parts[1]),
            data: parts,
        };
    }
    async devicemoniiterRSS(query) {
        try {
            var sort = query.sort;
            var keyword = query.keyword || '';
            var location_id = query.location_id;
            var type_name = query.type_name || '';
            var device_id = query.device_id || '';
            var mqtt_id = query.mqtt_id || '';
            var type_id = query.type_id || '';
            var org = query.org || '';
            var bucket = query.bucket || '';
            var status = query.status;
            var option = 1;
            var filter = {};
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
            const deletecache = query.deletecache || 0;
            var cachekey = 'device_moniiter_RSS_air_' +
                md5(sort +
                    keyword +
                    location_id +
                    type_name +
                    device_id +
                    mqtt_id +
                    type_id +
                    org +
                    bucket +
                    status +
                    option);
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var tempData2 = [];
            if (deletecache == 1) {
                await Cache.DeleteCacheData(cachekey);
            }
            var ResultData = await Cache.GetCacheData(cachekey);
            if (!ResultData) {
                var ResultData = await this.settingsService.device_list_ststus_alarm_airss(filter);
                var rss = { keycache: `${cachekey}`, time: 3600, data: ResultData };
                await Cache.SetCacheData(rss);
                var cache_data = 'no cache';
            }
            else {
                var cache_data = 'cache';
            }
            if (ResultData) {
                var mqtt_data_value = ResultData['0'].mqtt_data_value;
                var mqtt_data_control = ResultData['0'].mqtt_data_control;
            }
            else {
                return { status: 0, msg: 'Errior' };
            }
            var mqttdata = await this.mqttService.getdMqttdataTopics(mqtt_data_value);
            let tempData = [];
            for (var [key, va] of Object.entries(ResultData)) {
                var rs = ResultData[key];
                var evice_id = rs.evice_id;
                var data_status = rs.data_status;
                var mqtt_id = rs.mqtt_id;
                var setting_id = rs.setting_id;
                var type_id = rs.type_id;
                var device_name = rs.device_name;
                var sn = rs.sn;
                var hardware_id = rs.hardware_id;
                var status_warning = rs.status_warning;
                var recovery_warning = rs.recovery_warning;
                var status_alert = rs.status_alert;
                var recovery_alert = rs.recovery_alert;
                var time_life = rs.time_life;
                var period = rs.period;
                var work_status = rs.work_status;
                var max = rs.max;
                var min = rs.min;
                var oid = rs.oid;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var comparevalue = rs.comparevalue;
                var createddate = rs.createddate;
                var status = rs.status;
                var unit = rs.unit;
                var action_id = rs.action_id;
                var status_alert_id = rs.status_alert_id;
                var measurement = rs.measurement;
                var mqtt_control_on = rs.mqtt_control_on;
                var mqtt_control_off = rs.mqtt_control_off;
                var device_org = rs.device_org;
                var device_bucket = rs.device_bucket;
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
                var main_type_id = rs.type_id;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var configdata = mqtt_status_data_name;
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
                    filter.status_warning = Number(0);
                    filter.status_alert = Number(0);
                    filter.recovery_warning = Number(1);
                    filter.recovery_alert = Number(1);
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
                    var status = getAlarmDetails.status;
                }
                else {
                    var subject = 'Normal';
                    var status = getAlarmDetails.status;
                }
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
                if (data_status == 1) {
                    var DataRs = {
                        cachekey,
                        cache_data,
                        device_id: rs.device_id,
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
                        control_on: 'mqtt/control?topic=' +
                            mqtt_data_control +
                            '&message=' +
                            mqtt_control_on,
                        control_off: 'mqtt/control?topic=' +
                            mqtt_data_control +
                            '&message=' +
                            mqtt_control_off,
                    };
                    tempData.push(va);
                    tempData2.push(DataRs);
                }
            }
            return tempData2;
        }
        catch (error) {
            this.logger.error(`Device monitor error: ${error.message}`);
            return [];
        }
    }
    async devicemoniiterRSSFan(query) {
        try {
            var sort = query.sort;
            var keyword = query.keyword || '';
            var location_id = query.location_id;
            var type_name = query.type_name || '';
            var device_id = query.device_id || '';
            var mqtt_id = query.mqtt_id || '';
            var type_id = query.type_id || '';
            var org = query.org || '';
            var bucket = query.bucket || '';
            var status = query.status;
            var option = 1;
            var filter = {};
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
            const deletecache = query.deletecache || 0;
            var cachekey = 'device_moniiter_RSS_FAN_' +
                md5(sort +
                    keyword +
                    location_id +
                    type_name +
                    device_id +
                    mqtt_id +
                    type_id +
                    org +
                    bucket +
                    status +
                    option);
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
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
            var timestamps = datePart + ' ' + timePart;
            var tempData2 = [];
            if (deletecache == 1) {
                await Cache.DeleteCacheData(cachekey);
            }
            var ResultData = await Cache.GetCacheData(cachekey);
            if (!ResultData) {
                var ResultData = await this.settingsService.device_list_ststus_alarm_fanss(filter);
                var rss = {
                    keycache: `${cachekey}`,
                    time: 3600,
                    data: ResultData,
                };
                await Cache.SetCacheData(rss);
                var cache_data = 'no cache';
            }
            else {
                var cache_data = 'cache';
            }
            if (ResultData) {
                var mqtt_data_value = ResultData['0'].mqtt_data_value;
                var mqtt_data_control = ResultData['0'].mqtt_data_control;
            }
            else {
                return { status: 0, msg: 'Errior' };
            }
            var mqttdata = await this.mqttService.getdMqttdataTopics(mqtt_data_value);
            let tempData = [];
            for (var [key, va] of Object.entries(ResultData)) {
                var rs = ResultData[key];
                var evice_id = rs.evice_id;
                var data_status = rs.data_status;
                var mqtt_id = rs.mqtt_id;
                var setting_id = rs.setting_id;
                var type_id = rs.type_id;
                var device_name = rs.device_name;
                var sn = rs.sn;
                var hardware_id = rs.hardware_id;
                var status_warning = rs.status_warning;
                var recovery_warning = rs.recovery_warning;
                var status_alert = rs.status_alert;
                var recovery_alert = rs.recovery_alert;
                var time_life = rs.time_life;
                var period = rs.period;
                var work_status = rs.work_status;
                var max = rs.max;
                var min = rs.min;
                var oid = rs.oid;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var comparevalue = rs.comparevalue;
                var createddate = rs.createddate;
                var status = rs.status;
                var unit = rs.unit;
                var action_id = rs.action_id;
                var status_alert_id = rs.status_alert_id;
                var measurement = rs.measurement;
                var mqtt_control_on = rs.mqtt_control_on;
                var mqtt_control_off = rs.mqtt_control_off;
                var device_org = rs.device_org;
                var device_bucket = rs.device_bucket;
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
                var main_type_id = rs.type_id;
                var mqtt_data_value = rs.mqtt_data_value;
                var mqtt_data_control = rs.mqtt_data_control;
                var configdata = mqtt_status_data_name;
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
                    filter.status_warning = Number(0);
                    filter.status_alert = Number(0);
                    filter.recovery_warning = Number(1);
                    filter.recovery_alert = Number(1);
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
                    var status = getAlarmDetails.status;
                }
                else {
                    var subject = 'Normal';
                    var status = getAlarmDetails.status;
                }
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
                if (data_status == 1) {
                    var DataRs = {
                        cachekey,
                        cache_data,
                        device_id: rs.device_id,
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
                        control_on: 'mqtt/control?topic=' +
                            mqtt_data_control +
                            '&message=' +
                            mqtt_control_on,
                        control_off: 'mqtt/control?topic=' +
                            mqtt_data_control +
                            '&message=' +
                            mqtt_control_off,
                    };
                    tempData.push(va);
                    tempData2.push(DataRs);
                }
            }
            return tempData2;
        }
        catch (error) {
            this.logger.error(`Fan device monitor error: ${error.message}`);
            return [];
        }
    }
    async devicemqttappcharttest(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getMqttTopicPA(topic, deletecache);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
    async devicemqttappchartair(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getMqttTopicPA1(topic, deletecache);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                        var merged2Mode = format.mapMqttDataToDeviceALLMode([va], mqttData);
                        var active = 1;
                        var cachetimeset = 300;
                        var kaycache_cache = 'airmod_active_keys_' + active;
                        var airmod = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airmod = await Cache.GetCacheData(kaycache_cache);
                        if (airmod) {
                            var airmod = airmod;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airmod) {
                            var airmod = await this.IotService.get_airmod_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airmod,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        if (airmod) {
                            var airmodName = airmod.name;
                            var airModdata = airmod.data;
                        }
                        else {
                            var airmodName = 'auto';
                            var airModdata = 's';
                        }
                        var kaycache_cache = 'airwarning_active_keys_' + active;
                        var airwarning = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airwarning = await Cache.GetCacheData(kaycache_cache);
                        if (airwarning) {
                            var airwarning = airwarning;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airwarning) {
                            var airwarning = await this.IotService.get_warning_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airwarning,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        var kaycache_cache = 'airperiod_active_keys_' + active;
                        var airperiod = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airperiod = await Cache.GetCacheData(kaycache_cache);
                        if (airperiod) {
                            var airperiod = airperiod;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airperiod) {
                            var airperiod = await this.IotService.get_airperiod_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airperiod,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        var mergedMode = merged2Mode;
                        if (mergedMode) {
                            var warning = merged2Mode.warning;
                            var period = merged2Mode.period;
                            var mode = merged2Mode.mode;
                            var stateair1 = merged2Mode.stateair1;
                            var stateair2 = merged2Mode.stateair2;
                            var air1alarm = merged2Mode.air1alarm;
                            var air2alarm = merged2Mode.stateair2;
                        }
                        else {
                            var mergedMode = 35;
                            var period = 6;
                            var mode = 1;
                            var stateair1 = 1;
                            var stateair2 = 1;
                            var air1alarm = 1;
                            var air2alarm = 1;
                        }
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
                            var data = Number(value_alarm);
                        }
                        filter.mqtt_name = mqtt_name;
                        filter.device_name = mqtt_device_name;
                        filter.action_name = mqtt_name;
                        filter.mqtt_control_on = encodeURI(mqtt_control_on);
                        filter.mqtt_control_off = encodeURI(mqtt_control_off);
                        filter.event = 1;
                        filter.unit = unit;
                        var kaycache_cache = 'getAlarmDetailsAlert_keys_' +
                            md5(main_type_id +
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
                                unit);
                        var getAlarmDetails = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var getAlarmDetails = await Cache.GetCacheData(kaycache_cache);
                        if (getAlarmDetails) {
                            var getAlarmDetails = getAlarmDetails;
                            var cache_data_msg = 'cache';
                        }
                        else if (!getAlarmDetails) {
                            var getAlarmDetails = await this.settingsService.getAlarmDetailsAlert(filter);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: getAlarmDetails,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        const topicss = encodeURI(device_bucket + '/CONTROL');
                        const msg = encodeURI(airModdata);
                        var arraydata = {
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
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
        }
        catch (error) {
            res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: null,
                message: 'Mqtt Internal server error 500',
                message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
                error: error.message || error,
            });
        }
        finally {
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
    async devicemqttappchartairv1(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getMqttTopicPA1(topic, deletecache);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                        var merged2Mode = format.mapMqttDataToDeviceALLMode([va], mqttData);
                        var active = 1;
                        var cachetimeset = 300;
                        var kaycache_cache = 'airmod_active_keys_' + active;
                        var airmod = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airmod = await Cache.GetCacheData(kaycache_cache);
                        if (airmod) {
                            var airmod = airmod;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airmod) {
                            var airmod = await this.IotService.get_airmod_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airmod,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        if (airmod) {
                            var airmodName = airmod.name;
                            var airModdata = airmod.data;
                        }
                        else {
                            var airmodName = 'auto';
                            var airModdata = 's';
                        }
                        var kaycache_cache = 'airwarning_active_keys_' + active;
                        var airwarning = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airwarning = await Cache.GetCacheData(kaycache_cache);
                        if (airwarning) {
                            var airwarning = airwarning;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airwarning) {
                            var airwarning = await this.IotService.get_warning_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airwarning,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        var kaycache_cache = 'airperiod_active_keys_' + active;
                        var airperiod = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var airperiod = await Cache.GetCacheData(kaycache_cache);
                        if (airperiod) {
                            var airperiod = airperiod;
                            var cache_data_msg = 'cache';
                        }
                        else if (!airperiod) {
                            var airperiod = await this.IotService.get_airperiod_active(active);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: airperiod,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
                        var mergedMode = merged2Mode;
                        if (mergedMode) {
                            var warning = merged2Mode.warning;
                            var period = merged2Mode.period;
                            var mode = merged2Mode.mode;
                            var stateair1 = merged2Mode.stateair1;
                            var stateair2 = merged2Mode.stateair2;
                            var air1alarm = merged2Mode.air1alarm;
                            var air2alarm = merged2Mode.stateair2;
                        }
                        else {
                            var mergedMode = 35;
                            var period = 6;
                            var mode = 1;
                            var stateair1 = 1;
                            var stateair2 = 1;
                            var air1alarm = 1;
                            var air2alarm = 1;
                        }
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
                            var data = Number(value_alarm);
                        }
                        filter.mqtt_name = mqtt_name;
                        filter.device_name = mqtt_device_name;
                        filter.action_name = mqtt_name;
                        filter.mqtt_control_on = encodeURI(mqtt_control_on);
                        filter.mqtt_control_off = encodeURI(mqtt_control_off);
                        filter.event = 1;
                        filter.unit = unit;
                        var kaycache_cache = 'getAlarmDetailsAlert_keys_' +
                            md5(main_type_id +
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
                                unit);
                        var getAlarmDetails = {};
                        if (deletecache == 1) {
                            await Cache.DeleteCacheData(kaycache_cache);
                        }
                        var getAlarmDetails = await Cache.GetCacheData(kaycache_cache);
                        if (getAlarmDetails) {
                            var getAlarmDetails = getAlarmDetails;
                            var cache_data_msg = 'cache';
                        }
                        else if (!getAlarmDetails) {
                            var getAlarmDetails = await this.settingsService.getAlarmDetailsAlert(filter);
                            var rs = {
                                keycache: `${kaycache_cache}`,
                                time: cachetimeset,
                                data: getAlarmDetails,
                            };
                            await Cache.SetCacheData(rs);
                            var cache_data_msg = 'no cache';
                        }
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        const topicss = encodeURI(device_bucket + '/CONTROL');
                        const msg = encodeURI(airModdata);
                        var arraydata = {
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
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
        }
        catch (error) {
            res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: null,
                message: 'Mqtt Internal server error 500',
                message_th: 'Mqtt เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
                error: error.message || error,
            });
        }
        finally {
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
    async devicemqttappchart(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getMqttTopicPA1(topic, deletecache);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
        }
        catch (error) {
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
    async devicemqttappcharts(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getDataTopicdevicemqtt(topic, deletecache);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
    async devicemqttappchartV2(res, dto, query, headers, req) {
        try {
            var bucket = query.bucket;
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
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
            if (checkConnectionMqtt) {
                var Mqttstatus = checkConnectionMqtt.status;
            }
            else {
                var Mqttstatus = false;
            }
            var deletecache = query.deletecache;
            var filterchart = {};
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
            var senser_chart = await this.senser_chart(filterchart);
            var cachetimeset = 3600;
            var filter = {};
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
            var filter_md5 = md5(query.device_id +
                query.keyword +
                query.mqtt_id +
                query.bucket +
                query.type_id);
            var kaycache_cache = 'deviceactive_AL_mqtt_key_' + filter_md5;
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
                var ResultData = await this.settingsService.deviceactiveAl(filter);
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
            var deviceioinfo = [];
            var devicecontrol = [];
            var arraydataMain = [];
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var va = ResultData[key];
                    var rs = ResultData[key];
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var device_name = rs.device_name;
                    var device_id = rs.device_id;
                    var type_id = rs.type_id;
                    var hardware_id = rs.hardware_id;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var device_name = rs.device_name;
                    var mqtt_data_value = rs.mqtt_data_value;
                    var mqtt_data_control = rs.mqtt_data_control;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var setting_id = rs.setting_id;
                    var sn = rs.sn;
                    var hardware_id = rs.hardware_id;
                    var status_warning = rs.status_warning;
                    var status_alert = rs.status_alert;
                    var recovery_warning = rs.recovery_warning;
                    var recovery_alert = rs.recovery_alert;
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
                    var main_type_id = rs.type_id;
                    var configdata = mqtt_status_data_name;
                    var topic = encodeURI(mqtt_data_value);
                    var mqttrs = await this.mqttService.getDataTopicCacheDataMqtt(topic);
                    var timestampMqtt = mqttrs.timestamp;
                    if (timestampMqtt) {
                        var timestamps = timestampMqtt;
                    }
                    if (mqttrs) {
                        var mqttstatus = mqttrs.status;
                        var mqttdata = mqttrs.msg;
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
                            filter.status_warning = Number(0);
                            filter.status_alert = Number(0);
                            filter.recovery_warning = Number(1);
                            filter.recovery_alert = Number(1);
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
                            var alarmStatusSet = '';
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
                        if (value_alarm == 1) {
                            var value_alarm_msg = 'Normal';
                        }
                        else {
                            var value_alarm_msg = 'Alarm!';
                        }
                        var arraydata = {
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
                            mqttrs,
                        };
                        var arraydatainfo = {
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
                        }
                        else if (type_id > 1) {
                            deviceio.push(arraydata);
                        }
                        deviceioinfo.push(arraydatainfo);
                        devicecontrol.push(arraydata);
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
};
__decorate([
    (0, microservices_1.MessagePattern)('devices/+/status'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.MqttContext]),
    __metadata("design:returntype", void 0)
], MqttController.prototype, "handleDeviceStatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'list device page' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttdevicepage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mq'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceDataIndexmq", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceair'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceAir", null);
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
], MqttController.prototype, "checkConnection", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqtt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqtt", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqttalarm'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqttAlarm", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('airV1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceairV1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('air'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceair", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('fan'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDevicefanapp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('fanlist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "fanlist", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('fanss'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceDatafan", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('listtitle'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getMqttlist", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('listtitleall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getMqttlistall", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "DeviceDataGet", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicecontrol1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "device_control1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicecontrol'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "device_control", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicelistcontrolsV2'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicelistcontrolsV2", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageactive'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "listdevicepageactive", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageair'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "listdevicepageair", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "listdevicepage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageV1'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "listdevicepageV1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getDeviceData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('device'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "DeviceData", null);
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
], MqttController.prototype, "device_control_data", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('_getdata2'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "_device_get_data2", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getdata'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "device_get_data", null);
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
], MqttController.prototype, "sensercharts", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('airsenserchartsV1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "airsenserchartsV1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('airsensercharts'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "airsensercharts", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mqttsenserchartsv1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttsenserchartsv1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('senserchart'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "senserchart", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mqttsenserchart22'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttsenserchart22", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mqttsenserchart'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttsenserchartcache", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mqttsenserchartair'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttsenserchartaircache", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('mqttsenserchartv2'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "mqttsenserchartcachev2", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqtttest'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqtttest", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqttappv1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqttappv1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicelistcontrols'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicelistcontrols", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqttapp'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqttapp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqttt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqttt", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('deviceactivemqtttalarm'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "deviceactivemqtttalarm", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageactivess'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "device_list_paginate_actives_sss", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicemqttappcharttest'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappcharttest", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, throttler_1.Throttle)({ default: { ttl: 20000, limit: 100 } }),
    (0, common_1.Get)('devicemqttappchartair'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappchartair", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicemqttappchartairv1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappchartairv1", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicemqttappchart'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappchart", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicemqttappcharts'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappcharts", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('devicemqttappchartV2'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "devicemqttappchartV2", null);
MqttController = MqttController_1 = __decorate([
    (0, common_1.Controller)('mqtt'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        mqtt_service_1.MqttService,
        roles_service_1.RolesService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService,
        iot_service_1.IotService])
], MqttController);
exports.MqttController = MqttController;
//# sourceMappingURL=mqtt.controller.js.map