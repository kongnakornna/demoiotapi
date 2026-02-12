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
var IotController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotController = exports.InfluxDB_password = exports.InfluxDB_username = exports.InfluxDB_bucket = exports.InfluxDB_org = exports.InfluxDB_token = exports.InfluxDB_url = void 0;
const common_1 = require("@nestjs/common");
let isOn = false;
let intervalId;
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("../settings/settings.service");
const iotsocket_gateway_1 = require("./iotsocket.gateway");
require("dotenv/config");
require('dotenv').config();
const jwt_1 = require("@nestjs/jwt");
const { passwordStrength } = require('check-password-strength');
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const roles_service_1 = require("../roles/roles.service");
var md5 = require('md5');
require("dotenv/config");
require('dotenv').config();
const mqtt_service_1 = require("../mqtt/mqtt.service");
class PublishDto {
    constructor() {
        this.topic = 'BAACTW02/CONTROL';
        this.message = '1';
    }
}
require("dotenv/config");
require('dotenv').config();
console.log('===============================influxdb Ready process================================================================');
const InfluxDB_url = process.env.INFLUX_URL;
exports.InfluxDB_url = InfluxDB_url;
const InfluxDB_token = process.env.INFLUX_TOKEN;
exports.InfluxDB_token = InfluxDB_token;
const InfluxDB_org = process.env.INFLUX_ORG || 'cmon_org';
exports.InfluxDB_org = InfluxDB_org;
const InfluxDB_bucket = process.env.INFLUX_BUCKET || 'cmon_bucket';
exports.InfluxDB_bucket = InfluxDB_bucket;
const InfluxDB_username = process.env.INFLUXDB_USERNAME || 'admin';
exports.InfluxDB_username = InfluxDB_username;
const InfluxDB_password = process.env.INFLUXDB_PASSWORD || 'Na@0955@#@#';
exports.InfluxDB_password = InfluxDB_password;
const tzString = process.env.tzString;
console.log('===============================influxdb Client Start=============================================================');
const moment = require('moment');
const tz = require('moment-timezone');
const format = __importStar(require("../../helpers/format.helper"));
const iot_service_1 = require("./iot.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
const API_VERSION = '1';
var md5 = require('md5');
let IotController = IotController_1 = class IotController {
    constructor(IotService, settingsService, mqttService, rolesService, usersService, authService, jwtService, iotGateway) {
        this.IotService = IotService;
        this.settingsService = settingsService;
        this.mqttService = mqttService;
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
        this.iotGateway = iotGateway;
        this.logger = new common_1.Logger(IotController_1.name);
    }
    async GetIndex(res, dto, query, headers, params, req) {
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: [],
            message: 'iotIndex.',
            message_th: 'iotIndex.',
        });
        return;
    }
    async _getcachelist(res, query) {
        try {
            const { cachekey, bucket, status = 1, deletecache, includeValues = 'false', } = query;
            let cachePattern = '*';
            if (cachekey) {
                cachePattern = `${cachekey}*`;
            }
            const keys = await Cache.SearchKeysWithScan(cachePattern);
            const sortedKeys = keys.sort();
            let arrayData = [];
            let cacheValues = {};
            let deletedKeys = [];
            if (deletecache == 1) {
                for (const key of sortedKeys) {
                    try {
                        await Cache.DeleteCacheData(key);
                        deletedKeys.push(key);
                        console.log(`Deleted cache for key: ${key}`);
                    }
                    catch (error) {
                        console.error(`Error deleting cache for key ${key}:`, error);
                    }
                }
                res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    payload: {
                        deletedKeys: deletedKeys,
                        totalDeleted: deletedKeys.length,
                        summary: {
                            originalTotal: keys.length,
                            searchPattern: cachePattern,
                            successfullyDeleted: deletedKeys.length,
                        },
                    },
                    status: 0,
                    message: `Successfully deleted ${deletedKeys.length} cache keys`,
                    message_th: `ลบ ${deletedKeys.length} คีย์ใน cache สำเร็จ`,
                });
                return;
            }
            if (includeValues === 'true') {
                for (let i = 0; i < sortedKeys.length; i++) {
                    const key = sortedKeys[i];
                    try {
                        const value = await Cache.GetCacheData(key);
                        cacheValues[key] = value;
                        arrayData.push({
                            id: i + 1,
                            key: key,
                            value: value,
                            valueType: typeof value,
                            valueLength: value ? JSON.stringify(value).length : 0,
                            ttl: await Cache.getKeyTTL(key),
                        });
                    }
                    catch (error) {
                        console.error(`Error getting value for key ${key}:`, error);
                        arrayData.push({
                            id: i + 1,
                            key: key,
                            value: null,
                            error: 'Failed to retrieve value',
                        });
                    }
                }
            }
            else {
                arrayData = sortedKeys.map((key, index) => ({
                    id: index + 1,
                    key: key,
                }));
            }
            res.status(200).json({
                statusCode: 200,
                code: 200,
                payload: {
                    data: arrayData,
                    summary: {
                        totalKeys: keys.length,
                        searchPattern: cachePattern,
                        withValues: includeValues === 'true',
                    },
                    filter: {
                        cachekey: cachekey,
                        bucket: bucket,
                        status: status,
                        deleteRequested: false,
                    },
                },
                status: 0,
                message: `Found ${keys.length} cache keys`,
                message_th: `พบ ${keys.length} คีย์ใน cache`,
            });
        }
        catch (error) {
            console.error('Error in getcachelist:', error);
            res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: null,
                status: 1,
                message: `Error retrieving cache list: ${error.message}`,
                message_th: `เกิดข้อผิดพลาดในการดึงรายการ cache`,
            });
        }
    }
    async getcachelist(res, query) {
        try {
            const { cachekey, bucket, status = 1, deletecache, includeValues = 'false', } = query;
            let cachePattern = '*';
            if (cachekey) {
                cachePattern = `${cachekey}*`;
            }
            const keys = await Cache.SearchKeysWithScan(cachePattern);
            const sortedKeys = keys.sort();
            if (deletecache == 1) {
                const deletedKeys = [];
                for (const key of sortedKeys) {
                    try {
                        await Cache.DeleteCacheData(key);
                        deletedKeys.push(key);
                        console.log(`Deleted cache for key: ${key}`);
                    }
                    catch (error) {
                        console.error(`Error deleting cache for key ${key}:`, error);
                    }
                }
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    payload: {
                        deletedKeys: deletedKeys,
                        totalDeleted: deletedKeys.length,
                        summary: {
                            originalTotal: keys.length,
                            successfullyDeleted: deletedKeys.length,
                        },
                    },
                    status: 0,
                    message: `Successfully deleted ${deletedKeys.length} cache keys`,
                    message_th: `ลบ ${deletedKeys.length} คีย์ใน cache สำเร็จ`,
                });
            }
            let arrayData = [];
            if (includeValues === 'true') {
                for (let i = 0; i < sortedKeys.length; i++) {
                    const key = sortedKeys[i];
                    try {
                        const value = await Cache.GetCacheData(key);
                        arrayData.push({
                            id: i + 1,
                            key: key,
                            value: value,
                            valueType: typeof value,
                            valueLength: value ? JSON.stringify(value).length : 0,
                        });
                    }
                    catch (error) {
                        console.error(`Error getting value for key ${key}:`, error);
                        arrayData.push({
                            id: i + 1,
                            key: key,
                            value: null,
                            error: 'Failed to retrieve value',
                        });
                    }
                }
            }
            else {
                arrayData = sortedKeys.map((key, index) => ({
                    id: index + 1,
                    key: key,
                }));
            }
            res.status(200).json({
                statusCode: 200,
                code: 200,
                payload: {
                    data: arrayData,
                    summary: {
                        totalKeys: keys.length,
                        searchPattern: cachePattern,
                        withValues: includeValues === 'true',
                    },
                },
                status: 0,
                message: `Found ${keys.length} cache keys`,
                message_th: `พบ ${keys.length} คีย์ใน cache`,
            });
        }
        catch (error) {
            console.error('Error in getcachelist:', error);
            res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: null,
                status: 1,
                message: `Error: ${error.message}`,
                message_th: `เกิดข้อผิดพลาด`,
            });
        }
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
                time: 60,
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
    async getDeviceData(res, dto, query, headers, req) {
        const topic = query.topic;
        const deletecache = query.deletecache;
        if (!topic) {
            res.status(200).json({
                statusCode: 200,
                code: 200,
                query: query,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            });
            return;
        }
        if (!topic) {
            throw new common_1.HttpException('Topic is required', common_1.HttpStatus.BAD_REQUEST);
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
        if (topic == '') {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'topic  is null',
                message_th: 'topic  is null',
                satatus: 0,
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
                satatus: 0,
                payload: {},
            });
            return;
        }
        var topic_send = encodeURI(topic);
        var message_send = encodeURI(message);
        var data = await this.mqttService.devicecontrol(topic_send, message_send);
        res.status(200).json(data);
        return;
    }
    async device_get_data(res, dto, query, headers, params, req) {
        var topic = query.topic;
        var message = query.message;
        if (!topic) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'topic  is null',
                message_th: 'topic  is null',
                satatus: 0,
                payload: {},
            });
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
                satatus: 0,
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
                time: 60,
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
                time: 60,
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
                time: 60,
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
                satatus: 0,
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
                satatus: 1,
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
                    satatus: 0,
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
                    time: 60,
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
                    time: 60,
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
                    time: 60,
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
                    satatus: 0,
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
                    satatus: 1,
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
    async getChartio(Dto) {
        const time_start = Dto.time_start || '-1h';
        const bucket = process.env.INFLUX_BUCKET || Dto.bucket;
        const measurement = Dto.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = Dto.field || 'temperature';
        const start = Dto.start || '-1h';
        const stop = Dto.stop || 'now()';
        const windowPeriod = Dto.windowPeriod || '5s';
        const tzString = Dto.tzString || 'Asia/Bangkok';
        const mean = Dto.mean || 'now';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        let all = await this.IotService.getStartend(Dtos);
        let deta = await this.IotService.getStartend1(Dtos);
        let date = await this.IotService.getStartend2(Dtos);
        const rt = {
            all: all['0'].field,
            deta: deta,
            date: date,
        };
        return rt;
    }
    getRandomsrtsmallandint(length) {
        var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    findIndex() {
        return this.IotService.findAll();
    }
    async writeData(res, req, body) {
        console.log('req.headers=>');
        console.info(req.headers);
        let idx = req.headers.id;
        console.log('idx=>' + idx);
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        await this.IotService.writeData(body.measurement, body.fields, body.tags);
        return { message: 'Data written successfully' };
    }
    async getTemperatureData(res, req, body) {
        console.log('req.headers=>');
        console.info(req.headers);
        let idx = req.headers.id;
        console.log('idx=>' + idx);
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const Results = await this.IotService.queryTemperatureData();
        let ArrData = [];
        if (Results) {
            for (const [key, value] of Object.entries(Results)) {
                let result = Results[key].result;
                let table = Results[key].table;
                let start = format.convertDatetime(Results[key]._start);
                let stop = format.convertDatetime(Results[key]._stop);
                let time = format.convertDatetime(Results[key]._time);
                let value = format.convertToTwoDecimals(Results[key]._value);
                let field = Results[key]._field;
                let measurement = Results[key]._measurement;
                const datas = {
                    field: field,
                    measurement: measurement,
                    time: time,
                    value: value,
                };
                ArrData.push(datas);
            }
        }
        else {
            ArrData = null;
        }
        return ArrData;
    }
    async getStartends(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        const time_start = query.time_start || '-1h';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = query.field || 'temperature';
        const start = query.start || '-1h';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '5s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'now';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        let rt = await this.getChartio(Dtos);
        if (!rt.all) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                chart: rt,
            });
            return;
        }
    }
    async B1Data(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        const time_start = query.time_start || '-1h';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = query.field || 'temperature';
        const start = query.start || '-1h';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '5s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'now';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        let all = await this.IotService.B1Data(Dtos);
        if (!all) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                chart: all,
            });
            return;
        }
    }
    async sensers(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
        }
        const start = query.start || '-1m';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const bucket = query.bucket;
        const measurement = query.measurement || 'temperature';
        const field = query.field || 'value';
        const time = query.time || '1m';
        const limit = query.limit || 1;
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
        let data = await this.IotService.influxdbFilterData(Dtos);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                bucket: data[0].bucket,
                chart: { data: data },
                name: data[0].field,
            });
            return;
        }
    }
    async senser(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
        }
        const time_start = query.time_start || '-15m';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || 'temperature' || process.env.INFLUXDB_Envavorment;
        const field = query.field || 'value';
        const start = query.start || '-15m';
        const stop = query.stop || 'now()';
        const limit = query.limit || 150;
        const offset = query.offset || 0;
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'last';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            limit: limit,
            offset: offset,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        console.info(Dtos);
        let data = await this.IotService.getSenser(Dtos);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                bucket: data[0].bucket,
                chart: { data: data },
                name: data[0].field,
            });
            return;
        }
    }
    async getStartendchart(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
        }
        const time_start = query.time_start || '-15m';
        const bucket = query.bucket;
        const measurement = query.measurement || 'temperature' || process.env.INFLUXDB_Envavorment;
        const field = query.field || 'value';
        const start = query.start || '-15m';
        const stop = query.stop || 'now()';
        const limit = query.limit || 150;
        const offset = query.offset || 0;
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'last';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            limit: 1,
            offset: 0,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        console.info(Dtos);
        let data = await this.IotService.getSenser(Dtos);
        const Dtos2 = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            limit: limit,
            offset: offset,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        console.info(Dtos2);
        let data1 = await this.IotService.getSenserchart1(Dtos2);
        let data2 = await this.IotService.getSenserchart2(Dtos2);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                bucket: data[0].bucket,
                field: data[0].field,
                payload: data,
                chart: { data: data1, date: data2 },
                name: data[0].field,
            });
            return;
        }
    }
    async getSenser(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
        }
        const time_start = query.time_start || '-15m';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || 'temperature' || process.env.INFLUXDB_Envavorment;
        const field = query.field || 'value';
        const start = query.start || '-15m';
        const stop = query.stop || 'now()';
        const limit = query.limit || 1;
        const offset = query.offset || 0;
        const windowPeriod = query.windowPeriod || '15s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'last';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            limit: limit,
            offset: offset,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        console.info(Dtos);
        let data = await this.IotService.getSenser(Dtos);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                bucket: data[0].bucket,
                chart: { data: data },
                name: data[0].field,
            });
            return;
        }
    }
    async getStartend(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
        }
        const time_start = query.time_start || '-1h';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = query.field || 'temperature';
        const start = query.start || '-1h';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '5s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'now';
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
        };
        console.info(Dtos);
        let data = await this.IotService.getStartend(Dtos);
        let data1 = await this.IotService.getStartend1(Dtos);
        let data2 = await this.IotService.getStartend2(Dtos);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
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
                satatus: 1,
                bucket: data[0].bucket,
                chart: { data: data1, date: data2 },
                name: data[0].field,
            });
            return;
        }
    }
    async getStartendlimit(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 203,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const time_start = query.time_start || '-1h';
        const bucket = process.env.INFLUX_BUCKET || query.bucket;
        const measurement = query.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = query.field || 'temperature';
        const start = query.start || '-1h';
        const stop = query.stop || 'now()';
        const windowPeriod = query.windowPeriod || '5s';
        const tzString = query.tzString || 'Asia/Bangkok';
        const mean = query.mean || 'now';
        const limit = query.limit || 10;
        const offset = query.offset || 20;
        const Dtos = {
            time_start: time_start,
            bucket: bucket,
            measurement: measurement,
            field: field,
            start: start,
            stop: stop,
            windowPeriod: windowPeriod,
            tzString: tzString,
            mean: mean,
            limit: limit,
            offset: offset,
        };
        var keycache_set = time_start +
            bucket +
            field +
            start +
            stop +
            windowPeriod +
            tzString +
            mean +
            limit +
            offset;
        if (time_start === '-1h') {
            var keycache_time = 30;
        }
        else if (time_start === '-7d') {
            var keycache_time = 300;
        }
        else {
            var keycache_time = 60;
        }
        let keycache_md5 = md5(keycache_set);
        const keycache = 'get_startend_limit_' + keycache_md5;
        var DataCacheGet = await Cache.GetCacheData(keycache);
        if (DataCacheGet == null) {
            var Results = await this.IotService.getStartendlimit(Dtos);
            var setDataCache = {};
            setDataCache.keycache = keycache;
            setDataCache.time = keycache_time;
            setDataCache.data = Results;
            await Cache.SetCacheData(setDataCache);
            var cache = 0;
        }
        else {
            var cache = 1;
            var Results = await Cache.GetCacheData(keycache);
        }
        if (!Results) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
                cache: cache,
                payload: {
                    bucket: bucket,
                    result: 'now',
                    time: '2025-01-00:00:00:00',
                    value: 0,
                    field: field,
                    measurement: measurement,
                },
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                message: 'OK',
                satatus: 1,
                cache: cache,
                payload: Results,
            });
            return;
        }
    }
    async getGetone(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const field = query.field || 'temperature';
        const Dtos = {
            time_start: '-10s',
            bucket: process.env.INFLUX_BUCKET,
            measurement: process.env.INFLUXDB_Envavorment,
            field: field,
            start: '-10s',
            stop: 'now()',
            windowPeriod: '10s',
            tzString: process.env.tzString,
            mean: 'now',
        };
        let data = await this.IotService.getStartend(Dtos);
        let length = data.length;
        if (length == 0) {
            const nodata = {
                bucket: process.env.INFLUX_BUCKET,
                result: 'now',
                time: '2025-01-00:00:00:00',
                value: 0,
                field: field,
                measurement: process.env.INFLUXDB_Envavorment,
            };
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
                payload: nodata,
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 1,
                payload: data[0],
            });
            return;
        }
    }
    async getqueryFilterData(res, query, headers, params, req) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        const time_start = query.time_start || '-1d';
        const bucket = query.bucket || process.env.INFLUX_BUCKET;
        const measurement = query.measurement || process.env.INFLUXDB_Envavorment || 'Envavorment';
        const field = query.field || 'temperature';
        const time = query.time || '1d';
        const Dtos = {
            time_start: time_start.split(),
            bucket: bucket.split(),
            measurement: measurement.split(),
            field: field.split(),
            time: time.split(),
        };
        let Results = await this.IotService.queryFilterData(Dtos);
        let ArrData = [];
        for (const [key, value] of Object.entries(Results)) {
            let result = Results[key].result;
            let table = Results[key].table;
            let start = format.convertDatetime(Results[key]._start);
            let stop = format.convertDatetime(Results[key]._stop);
            let time = format.convertDatetime(Results[key]._time);
            let value = format.convertToTwoDecimals(Results[key]._value);
            let field = Results[key]._field;
            let measurement = Results[key]._measurement;
            const datas = {
                field: field,
                measurement: measurement,
                time: time,
                value: value,
            };
            ArrData.push(datas);
        }
        res.status(200).json({
            statusCode: 200,
            code: 200,
            message: 'OK',
            query: query,
            payload: ArrData,
        });
        return;
    }
    async readDatafilters(res, req, measurement, filters, timeRange) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const parsedFilters = JSON.parse(filters);
        const data = await this.IotService.queryFilteredData(measurement, parsedFilters, timeRange);
        res.status(200).json(data);
        return;
    }
    async readData(res, req, body) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const data = await this.IotService.queryDataRow(body.query);
        res.status(200).json(data);
        return;
    }
    async queryData(res, req, body) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        if (secretkey != process.env.SECRET_KEY) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        const data = await this.IotService.queryData(body.query);
        res.status(200).json(data);
        return;
    }
    async removemeasurement(res, query, headers, params, req) {
        let header = req.headers;
        let idx = header.id;
        let secretkey = header.secretkey;
        let start_filter = '2025-05-01T00:00:00Z';
        if (secretkey != process.env.SECRET_KEY) {
        }
        const tz = process.env.tzString;
        const datanow = Date.now();
        let date = moment(datanow);
        let syncDate = date.tz(tz);
        console.log(syncDate.format());
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        const measurement = query.measurement;
        if (!measurement) {
            res.status(200).json({
                statusCode: 403,
                code: 403,
                message: 'Forbidden! measurement ..',
                message_th: 'กรุณาระบุ measurement.',
            });
            return;
        }
        const Dtos = {
            org: InfluxDB_org,
            token: InfluxDB_token,
            bucket: InfluxDB_bucket,
            start: start_filter,
            stop: syncDate,
            measurement: measurement,
        };
        console.info(Dtos);
        let data = await this.IotService.removeMeasurement(Dtos);
        if (!data) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 0,
                payload: {
                    value: 0,
                },
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'OK',
                satatus: 1,
                data: data,
            });
            return;
        }
    }
    async aircontrolPaginated(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || '';
        var keyword = query.keyword || '';
        var active = query.active || '';
        var air_control_id = query.air_control_id;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.air_control_id = air_control_id;
        filter.status = status || '';
        filter.active = active || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.aircontrol_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.air_control_id = air_control_id;
        filter2.status = status || '';
        filter2.active = active || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.aircontrol_paginate(filter2);
        let tempData = [];
        let rs = [];
        for (const [key, va] of Object.entries(Row)) {
            const Rss = {
                air_control_id: Row[key].air_control_id,
                name: Row[key].name,
                data: Row[key].data,
                status: Row[key].status,
                active: Row[key].active,
                createddate: format.timeConvertermas(format.convertTZ(Row[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Row[key].updateddate, process.env.tzString)),
            };
            tempData.push(va);
            rs.push(Rss);
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
                data: rs,
            },
            message: 'list aircontrollist success.',
            message_th: 'lists aircontrollist success.',
        });
    }
    async airmodelist(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status || '';
        var air_mod_id = query.air_mod_id || '';
        var sort = query.sort || '';
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.air_mod_id = air_mod_id;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.airmod_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.air_mod_id = air_mod_id;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.airmod_paginate(filter2);
        let tempData = [];
        let rs = [];
        for (const [key, va] of Object.entries(Row)) {
            const Rss = {
                air_mod_id: Row[key].air_mod_id,
                name: Row[key].name,
                data: Row[key].data,
                status: Row[key].status,
                active: Row[key].active,
                createddate: format.timeConvertermas(format.convertTZ(Row[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Row[key].updateddate, process.env.tzString)),
            };
            tempData.push(va);
            rs.push(Rss);
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
                data: rs,
            },
            message: 'list aircontrollist success.',
            message_th: 'lists aircontrollist success.',
        });
    }
    async createairmod(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.IotService.get_airmod_name(DataDto.name);
        if (Rs) {
            console.log('name>' + DataDto.name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        await this.IotService.create_airmod(DataDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataDto,
            message: 'Create Data successfully..',
            message_th: 'เพิ่มข้อมูลสำเร็จ..',
        });
        return;
    }
    async delete_airmod(res, query, headers, params, req) {
        var air_mod_id = query.air_mod_id;
        if (!air_mod_id) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'air_mod_id is null.',
                message_th: 'ไม่พบข้อมูล air_mod_id',
            });
            return;
        }
        if (air_mod_id <= 3) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'forbidden delete! air_mod_id ' + air_mod_id,
                message_th: 'ห้ามลบ! air_mod_id ' + air_mod_id,
            });
            return;
        }
        let rss = await this.IotService.delete_airmod(air_mod_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: rss,
            message: 'delete air mod success.',
            message_th: 'delete air mod success.',
        });
    }
    async updateairmodestatus(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_mod_id = dto.air_mod_id;
            if (!air_mod_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_mod_id is null.',
                    message_th: 'ไม่พบข้อมูล air_mod_id.',
                });
            }
            const rsbucket = await this.IotService.get_airmod(air_mod_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_mod_id ${air_mod_id}`,
                    message_th: `ไม่พบ air_mod_id ${air_mod_id}`,
                });
            }
            const valdata = ['active', 'status'];
            const DataUpdate = {};
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
            const rt = await this.IotService.update_airmodstatus_val(air_mod_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_mod_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairwarningstatus(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_warning_id = dto.air_warning_id;
            if (!air_warning_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_warning_id is null.',
                    message_th: 'ไม่พบข้อมูล air_warning_id.',
                });
            }
            const rsbucket = await this.IotService.get_airwarning(air_warning_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_warning_id ${air_warning_id}`,
                    message_th: `ไม่พบ air_warning_id ${air_warning_id}`,
                });
            }
            const valdata = ['active', 'status'];
            const DataUpdate = {};
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
            const rt = await this.IotService.update_airwarning_val(air_warning_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_warning_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairmode(res, dto, query, headers, params, req) {
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
        var air_mod_id = dto.air_mod_id;
        if (!air_mod_id) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' air_mod_id ' + air_mod_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  air_mod_id ' + air_mod_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
        DataUpdate.air_mod_id = air_mod_id;
        if (dto.name) {
            DataUpdate.name = dto.name;
        }
        if (dto.data) {
            DataUpdate.data = dto.data;
        }
        if (dto.active) {
            DataUpdate.active = dto.active;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.IotService.updateAirMode(DataUpdate);
        if (rt && rt == 200) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: DataUpdate,
                rt: rt,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
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
    async airperiodPaginated(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status;
        var air_period_id = query.air_period_id;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.air_period_id = air_period_id;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.airperiod_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.air_period_id = air_period_id;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.airperiod_paginate(filter2);
        let tempData = [];
        let rs = [];
        for (const [key, va] of Object.entries(Row)) {
            const Rss = {
                air_period_id: Row[key].air_period_id,
                name: Row[key].name,
                data: Row[key].data,
                active: Row[key].active,
                status: Row[key].status,
                createddate: format.timeConvertermas(format.convertTZ(Row[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Row[key].updateddate, process.env.tzString)),
            };
            tempData.push(va);
            rs.push(Rss);
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
                data: rs,
            },
            message: 'list aircontrollist success.',
            message_th: 'lists aircontrollist success.',
        });
    }
    async createperiod(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.IotService.get_period_name(DataDto.name);
        if (Rs) {
            console.log('name>' + DataDto.name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        await this.IotService.create_airperiod(DataDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataDto,
            message: 'Create Data successfully..',
            message_th: 'เพิ่มข้อมูลสำเร็จ..',
        });
        return;
    }
    async updateperiod(res, dto, query, headers, params, req) {
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
        var air_period_id = dto.air_period_id;
        if (!air_period_id) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' air_period_id ' + air_period_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  air_period_id ' + air_period_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
        DataUpdate.air_period_id = air_period_id;
        if (dto.name) {
            DataUpdate.name = dto.name;
        }
        if (dto.data) {
            DataUpdate.data = dto.data;
        }
        if (dto.active) {
            DataUpdate.active = dto.active;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.IotService.update_airperiod(DataUpdate);
        if (rt && rt == 200) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: DataUpdate,
                rt: rt,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
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
    async delete_airperiod(res, query, headers, params, req) {
        var air_period_id = query.air_period_id;
        if (!air_period_id) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'air_period_id is null.',
                message_th: 'ไม่พบข้อมูล air_period_id',
            });
            return;
        }
        if (air_period_id <= 5) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'forbidden delete! air_period_id ' + air_period_id,
                message_th: 'ห้ามลบ! air_period_id ' + air_period_id,
            });
            return;
        }
        let rss = await this.IotService.delete_airperiod_id(air_period_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: rss,
            message: 'delete air mod success.',
            message_th: 'delete air mod success.',
        });
    }
    async updateperiodstatus(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_period_id = dto.air_period_id;
            if (!air_period_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_period_id is null.',
                    message_th: 'ไม่พบข้อมูล air_period_id.',
                });
            }
            const rsbucket = await this.IotService.get_airperiod(air_period_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_period_id ${air_period_id}`,
                    message_th: `ไม่พบ air_period_id ${air_period_id}`,
                });
            }
            const valdata = ['active', 'status'];
            const DataUpdate = {};
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
            const rt = await this.IotService.update_airperiodstatus_val(air_period_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_period_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async airsettingwarningPaginated(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status;
        var air_setting_warning_id = query.air_setting_warning_id;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.air_setting_warning_id = air_setting_warning_id;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.airsettingwarning_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.air_setting_warning_id = air_setting_warning_id;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.airsettingwarning_paginate(filter2);
        let tempData = [];
        let rs = [];
        for (const [key, va] of Object.entries(Row)) {
            const Rss = {
                air_setting_warning_id: Row[key].air_setting_warning_id,
                name: Row[key].name,
                data: Row[key].data,
                active: Row[key].active,
                status: Row[key].status,
                createddate: format.timeConvertermas(format.convertTZ(Row[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Row[key].updateddate, process.env.tzString)),
            };
            tempData.push(va);
            rs.push(Rss);
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
                data: rs,
            },
            message: 'list aircontrollist success.',
            message_th: 'lists aircontrollist success.',
        });
    }
    async airwarningPaginated(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status;
        var air_warning_id = query.air_warning_id;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.air_warning_id = air_warning_id;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.airwarning_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.air_warning_id = air_warning_id;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.airwarning_paginate(filter2);
        let tempData = [];
        let rs = [];
        for (const [key, va] of Object.entries(Row)) {
            const Rss = {
                air_warning_id: Row[key].air_warning_id,
                name: Row[key].name,
                data: Row[key].data,
                status: Row[key].status,
                active: Row[key].active,
                createddate: format.timeConvertermas(format.convertTZ(Row[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Row[key].updateddate, process.env.tzString)),
            };
            tempData.push(va);
            rs.push(Rss);
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
                data: rs,
            },
            message: 'list aircontrollist success.',
            message_th: 'lists aircontrollist success.',
        });
    }
    async createwarning(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.IotService.get_warning_name(DataDto.name);
        if (Rs) {
            console.log('name>' + DataDto.name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        await this.IotService.create_air_warning(DataDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataDto,
            message: 'Create Data successfully..',
            message_th: 'เพิ่มข้อมูลสำเร็จ..',
        });
        return;
    }
    async updatewarning(res, dto, query, headers, params, req) {
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
        var air_warning_id = dto.air_warning_id;
        if (!air_warning_id) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' air_warning_id ' + air_warning_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  air_warning_id ' + air_warning_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
        DataUpdate.air_warning_id = air_warning_id;
        if (dto.name) {
            DataUpdate.name = dto.name;
        }
        if (dto.data) {
            DataUpdate.data = dto.data;
        }
        if (dto.active) {
            DataUpdate.active = dto.active;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.IotService.update_air_warning(DataUpdate);
        if (rt && rt == 200) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: DataUpdate,
                rt: rt,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
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
    async delete_warning(res, query, headers, params, req) {
        var air_warning_id = query.air_warning_id;
        if (!air_warning_id) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'air_warning_id is null.',
                message_th: 'ไม่พบข้อมูล air_warning_id',
            });
            return;
        }
        if (air_warning_id <= 6) {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: {},
                message: 'forbidden delete! air_warning_id ' + air_warning_id,
                message_th: 'ห้ามลบ! air_warning_id ' + air_warning_id,
            });
            return;
        }
        let rss = await this.IotService.delete_air_warning_id(air_warning_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: rss,
            message: 'delete air mod success.',
            message_th: 'delete air mod success.',
        });
    }
    async mqttlogPaginated(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status;
        var device_id = query.device_id;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.device_id = query.device_id;
        filter.type_id = query.type_id;
        filter.date = query.date;
        filter.start = query.start;
        filter.end = query.end;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.mqttlog_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.device_id = query.device_id;
        filter2.type_id = query.type_id;
        filter2.date = query.date;
        filter2.start = query.start;
        filter2.end = query.end;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.mqttlog_paginate(filter2);
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
                data: Row,
            },
            message: 'mqttlog',
            message_th: 'mqttlog success.',
        });
    }
    async updateaircontrolstatus(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_control_id = dto.air_control_id;
            if (!air_control_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_control_id is null.',
                    message_th: 'ไม่พบข้อมูล air_control_id.',
                });
            }
            const rsbucket = await this.IotService.get_aircontrol(air_control_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_control_id ${air_control_id}`,
                    message_th: `ไม่พบ air_control_id ${air_control_id}`,
                });
            }
            const statusValue = dto.active !== undefined
                ? dto.active
                : dto.status !== undefined
                    ? dto.status
                    : null;
            if (statusValue === null) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: dto,
                    message: 'No status value provided.',
                    message_th: 'ไม่พบค่าสถานะที่จะอัปเดต',
                });
            }
            const DataUpdate = {};
            DataUpdate['active'] = statusValue;
            console.log('Updating with data:', {
                air_control_id,
                statusValue,
                DataUpdate,
            });
            const rt = await this.IotService.update_status_aircontrol(air_control_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_control_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            console.error('Error in updateaircontrolstatus:', err);
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairmodactive(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_control_id = dto.air_control_id;
            if (!air_control_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_control_id is null.',
                    message_th: 'ไม่พบข้อมูล air_control_id.',
                });
            }
            const rsbucket = await this.IotService.get_aircontrol(air_control_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_control_id ${air_control_id}`,
                    message_th: `ไม่พบ air_control_id ${air_control_id}`,
                });
            }
            const datastatus = ['event'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_empty_active_aircontrol(air_control_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_control_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updatestatusairsettingwarning(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_setting_warning_id = dto.air_setting_warning_id;
            if (!air_setting_warning_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_setting_warning_id is null.',
                    message_th: 'ไม่พบข้อมูล air_setting_warning_id.',
                });
            }
            const rsbucket = await this.IotService.get_airsettingwarning(air_setting_warning_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_setting_warning_id ${air_setting_warning_id}`,
                    message_th: `ไม่พบ air_setting_warning_id ${air_setting_warning_id}`,
                });
            }
            const datastatus = ['event', 'status'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_status_setting_warning(air_setting_warning_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_setting_warning_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairsettingwarningactive(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_setting_warning_id = dto.air_setting_warning_id;
            if (!air_setting_warning_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_setting_warning_id is null.',
                    message_th: 'ไม่พบข้อมูล air_setting_warning_id.',
                });
            }
            const rsbucket = await this.IotService.get_airsettingwarning(air_setting_warning_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_setting_warning_id ${air_setting_warning_id}`,
                    message_th: `ไม่พบ air_setting_warning_id ${air_setting_warning_id}`,
                });
            }
            const datastatus = ['event'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_empty_active_setting_warning(air_setting_warning_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_setting_warning_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updatestatusairwarning(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_warning_id = dto.air_warning_id;
            if (!air_warning_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_warning_id is null.',
                    message_th: 'ไม่พบข้อมูล air_warning_id.',
                });
            }
            const rsbucket = await this.IotService.get_air_warning(air_warning_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_warning_id ${air_warning_id}`,
                    message_th: `ไม่พบ air_warning_id ${air_warning_id}`,
                });
            }
            const datastatus = ['event', 'status'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_status_airperiod(air_warning_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_warning_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairwarningactive(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_warning_id = dto.air_warning_id;
            if (!air_warning_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_warning_id is null.',
                    message_th: 'ไม่พบข้อมูล air_warning_id.',
                });
            }
            const rsbucket = await this.IotService.get_air_warning(air_warning_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_warning_id ${air_warning_id}`,
                    message_th: `ไม่พบ air_warning_id ${air_warning_id}`,
                });
            }
            const datastatus = ['event'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_empty_active_airperiod(air_warning_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_warning_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updatestatusairperiod(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_period_id = dto.air_period_id;
            if (!air_period_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_period_id is null.',
                    message_th: 'ไม่พบข้อมูล air_period_id.',
                });
            }
            const rsbucket = await this.IotService.get_airperiod(air_period_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_period_id ${air_period_id}`,
                    message_th: `ไม่พบ air_period_id ${air_period_id}`,
                });
            }
            const datastatus = ['event', 'status'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_status_air_airmod(air_period_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_period_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updateairperiodactive(res, dto, req) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '').trim();
            if (!token) {
                return res.status(401).json({
                    statusCode: 401,
                    code: 401,
                    message: 'Unauthorized',
                    message_th: 'ไม่ได้รับอนุญาต',
                });
            }
            const air_period_id = dto.air_period_id;
            if (!air_period_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'air_period_id is null.',
                    message_th: 'ไม่พบข้อมูล air_period_id.',
                });
            }
            const rsbucket = await this.IotService.get_airperiod(air_period_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ air_period_id ${air_period_id}`,
                    message_th: `ไม่พบ air_period_id ${air_period_id}`,
                });
            }
            const datastatus = ['event'];
            const DataUpdate = {};
            for (const da of datastatus) {
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
            const rt = await this.IotService.update_empty_active_air_airmod(air_period_id, DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    air_period_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async createaircontrol(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.IotService.get_aircontrol_data(DataDto.name);
        if (Rs) {
            console.log('ipaddress>' + DataDto.name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        await this.IotService.create_aircontrol(DataDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataDto,
            message: 'Create Data successfully..',
            message_th: 'เพิ่มข้อมูลสำเร็จ..',
        });
        return;
    }
    async airmoddevicemap(res, query, headers, params, req) {
        const air_mod_id = Number(query.air_mod_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_mod_id =>` + air_mod_id);
        console.info(air_mod_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_mod_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_mod_id null.',
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
        var dtost = {
            air_mod_id: air_mod_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.create_aircontrol_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airmoddevicemap created successfully.',
            message_th: 'สร้าง airmoddevicemap สำเร็จ.',
        });
    }
    async delete_aircontrol(res, query, headers, params, req) {
        const air_control_id = Number(query.air_control_id);
        if (!air_control_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_control_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        var dtost = { air_control_id: air_control_id };
        await this.IotService.delete_aircontrol(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airmoddevicemap delete successfully.',
            message_th: 'ลบ airmoddevicemap  สำเร็จแล้ว.',
        });
    }
    async delete_alarm_event_Device(res, query, headers, params, req) {
        const air_mod_id = Number(query.air_mod_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_mod_id =>` + air_mod_id);
        console.info(air_mod_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_mod_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_mod_id null.',
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
        var dtost = {
            air_mod_id: air_mod_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.delete_alarm_device_event_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airmoddevicemap delete successfully.',
            message_th: 'ลบ airmoddevicemap  สำเร็จแล้ว.',
        });
    }
    async aircontroldevicemap(res, query, headers, params, req) {
        const air_mod_id = Number(query.air_mod_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_mod_id =>` + air_mod_id);
        console.info(air_mod_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_mod_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_mod_id null.',
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
        var dtost = {
            air_mod_id: air_mod_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.create_air_control_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'aircontroldevicemap created successfully.',
            message_th: 'สร้าง aircontroldevicemap สำเร็จ.',
        });
    }
    async deleteaircontroldevicemap(res, query, headers, params, req) {
        const air_mod_id = Number(query.air_mod_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_mod_id =>` + air_mod_id);
        console.info(air_mod_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_mod_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_mod_id null.',
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
        var dtost = {
            air_mod_id: air_mod_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.delete_air_control_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'aircontroldevicemap delete successfully.',
            message_th: 'ลบ aircontroldevicemap  สำเร็จแล้ว.',
        });
    }
    async airperioddevicemap(res, query, headers, params, req) {
        const air_period_id = Number(query.air_period_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_period_id =>` + air_period_id);
        console.info(air_period_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_period_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_period_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        if (!device_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is device_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            air_period_id: air_period_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.create_air_period_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airperioddevicemap created successfully.',
            message_th: 'สร้าง airperioddevicemap สำเร็จ.',
        });
    }
    async deleteairperioddevicemap(res, query, headers, params, req) {
        const air_period_id = Number(query.air_period_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_period_id =>` + air_period_id);
        console.info(air_period_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_period_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_period_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        if (!device_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is device_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            air_period_id: air_period_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.delete_air_period_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airperioddevicemap delete successfully.',
            message_th: 'ลบ airperioddevicemap  สำเร็จแล้ว.',
        });
    }
    async airsettingwarningdevicemap(res, query, headers, params, req) {
        const air_setting_warning_id = Number(query.air_setting_warning_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_setting_warning_id =>` + air_setting_warning_id);
        console.info(air_setting_warning_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_setting_warning_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_setting_warning_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        if (!device_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is device_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            air_setting_warning_id: air_setting_warning_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.create_air_setting_warning_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airsettingwarningdevicemap created successfully.',
            message_th: 'สร้าง airsettingwarningdevicemap สำเร็จ.',
        });
    }
    async deleteairsettingwarningdevicemap(res, query, headers, params, req) {
        const air_setting_warning_id = Number(query.air_setting_warning_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_setting_warning_id =>` + air_setting_warning_id);
        console.info(air_setting_warning_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_setting_warning_id) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_setting_warning_id null.',
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
        var dtost = {
            air_setting_warning_id: air_setting_warning_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.delete_air_setting_warning_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airsettingwarningdevicemap delete successfully.',
            message_th: 'ลบ airsettingwarningdevicemap  สำเร็จแล้ว.',
        });
    }
    async airwarningdevicemap(res, query, headers, params, req) {
        const air_warning_id = Number(query.air_warning_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_warning_id =>` + air_warning_id);
        console.info(air_warning_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_warning_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_warning_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        if (!device_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is device_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            air_warning_id: air_warning_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.create_air_warning_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airwarningdevicemap created successfully.',
            message_th: 'สร้าง airwarningdevicemap สำเร็จ.',
        });
    }
    async deleteairwarningdevicemap(res, query, headers, params, req) {
        const air_warning_id = Number(query.air_warning_id) || 1;
        const air_control_id = Number(query.air_control_id) || 1;
        const device_id = Number(query.device_id) || 1;
        console.log(`air_warning_id =>` + air_warning_id);
        console.info(air_warning_id);
        console.log(`air_control_id =>` + air_control_id);
        console.info(air_control_id);
        console.log(`device_id =>` + device_id);
        console.info(device_id);
        if (!air_warning_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is air_warning_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        if (!device_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is device_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            air_warning_id: air_warning_id,
            air_control_id: air_control_id,
            device_id: device_id,
        };
        await this.IotService.delete_air_warning_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'airwarningdevicemap delete successfully.',
            message_th: 'ลบ airwarningdevicemap  สำเร็จแล้ว.',
        });
    }
    async updateemailstatus(res, dto, query, headers, params, req) {
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
        var email_id = dto.email_id;
        if (email_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + email_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + email_id + '.',
            };
            res.status(200).json(result);
        }
        var status = dto.status;
        if (status == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + status + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + status + '.',
            };
            res.status(200).json(result);
        }
        var DataUpdate = {};
        DataUpdate.email_id = email_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_email(email_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_email_status(email_id, 1);
        }
        else {
            var rt = await this.settingsService.update_email_status(email_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                email_id: email_id,
                rt: rt,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
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
    async host_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 100000000;
        var status = query.status || 1;
        var keyword = query.keyword || '';
        var status = query.status;
        var idhost = query.idhost;
        var host_id = query.host_id;
        var port = query.port;
        var username = query.username;
        var password = query.password;
        var sort = query.sort;
        var sort = query.sort;
        var isCount = 0;
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword;
        filter.idhost = idhost;
        filter.host_id = host_id;
        filter.port = port;
        filter.username = username;
        filter.password = password;
        filter.start = query.start;
        filter.end = query.end;
        filter.status = status || '';
        filter.isCount = 1;
        var rowResultData = await this.IotService.host_paginate(filter);
        console.log(`filter =>` + filter);
        console.info(filter);
        if (!rowResultData || rowResultData.status == '422') {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: { filter, row: rowResultData },
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล',
            });
            return;
        }
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword;
        filter2.idhost = idhost;
        filter2.host_id = host_id;
        filter2.port = port;
        filter2.username = username;
        filter2.password = password;
        filter2.start = query.start;
        filter2.end = query.end;
        filter2.status = status || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let Row = await this.IotService.host_paginate(filter2);
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
                data: Row,
            },
            message: 'hostlist',
            message_th: 'hostlist success.',
        });
    }
    async updatehost(res, dto, req) {
        try {
            const host_id = dto.host_id;
            if (!host_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'host_id is host_id.',
                    message_th: 'ไม่พบข้อมูล host_id.',
                });
            }
            const rsbucket = await this.IotService.get_host_id(host_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ host_id ${host_id}`,
                    message_th: `ไม่พบ host_id ${host_id}`,
                });
            }
            var host_name = dto.host_name;
            var port = dto.port;
            var username = dto.username;
            var password = dto.password;
            var status = dto.status;
            var DataUpdate = {};
            DataUpdate.host_id = host_id;
            DataUpdate.host_name = host_name;
            DataUpdate.port = port;
            DataUpdate.username = username;
            DataUpdate.password = password;
            DataUpdate.status = status;
            const rt = await this.IotService.update_host(DataUpdate);
            if (rt) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    host_id,
                    payload: DataUpdate,
                    rt,
                    message: 'Update successful.',
                    message_th: 'อัปเดตสำเร็จ.',
                });
            }
            else {
                return res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: DataUpdate,
                    rt,
                    message: 'Update Unsuccessful',
                    message_th: 'อัปเดตไม่สำเร็จ',
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                code: 500,
                message: 'Internal Server Error',
                message_th: 'เกิดข้อผิดพลาดภายในระบบ',
                error: err.message,
            });
        }
    }
    async updatehoststatus(res, dto, query, headers, params, req) {
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
        var host_id = dto.host_id;
        if (host_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + host_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + host_id + '.',
            };
            res.status(200).json(result);
        }
        var status = dto.status;
        if (status == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + status + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + status + '.',
            };
            res.status(200).json(result);
        }
        var DataUpdate = {};
        DataUpdate.host_id = host_id;
        DataUpdate.status = status;
        var rsbucket = await this.IotService.get_host_id(host_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.IotService.update_host_status(host_id, 1);
        }
        else {
            var rt = await this.IotService.update_host_status(host_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                host_id: host_id,
                rt: rt,
                dto,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
                statusCode: 200,
                code: 422,
                payload: DataUpdate,
                rt: rt,
                dto,
                message: 'Update Unsuccessful',
                message_th: 'อัปเดต ไม่สำเร็จ',
            };
            res.status(200).json(result);
        }
    }
    async createhost(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.IotService.check_data_host(DataDto.host_name);
        if (Rs) {
            console.log('name>' + DataDto.host_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.host_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        await this.IotService.create_host(DataDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataDto,
            message: 'Create Data successfully..',
            message_th: 'เพิ่มข้อมูลสำเร็จ..',
        });
        return;
    }
    async deletehosts(res, query, headers, params, req) {
        const host_id = query.host_id;
        console.log(`host_id =>` + host_id);
        console.info(host_id);
        if (!host_id) {
            return res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data is host_id null.',
                message_th: 'ไม่พบข้อมูล',
            });
        }
        var dtost = {
            host_id: host_id,
        };
        await this.IotService.delete_host(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: ' delete Successfully.',
            message_th: 'ลบ  สำเร็จแล้ว.',
        });
    }
    getDeviceStatus(deviceId) {
        this.logger.log(`GET status for device: ${deviceId}`);
        const statusData = {
            deviceId,
            status: 'online',
            lastUpdate: new Date().toISOString(),
            message: 'ดึงข้อมูลสถานะอุปกรณ์สำเร็จ',
        };
        this.iotGateway.broadcast('device_status', statusData);
        return statusData;
    }
    send(data) {
        this.logger.log(`send for data: ${data}`);
        this.logger.log('Received MQTT Data:', data);
        this.iotGateway.broadcastMqttData('BAACTW01/DATA', data);
        this.logger.log('Command Log:', data);
        this.iotGateway.broadcast('command_log', Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
        const statusData = {
            data,
            status: 'online',
            received: true,
            lastUpdate: new Date().toISOString(),
            message: 'ดึงข้อมูลสถานะอุปกรณ์สำเร็จ',
        };
        this.iotGateway.broadcast('device_status', statusData);
        return statusData;
    }
    controlDevice(commandDto) {
        this.logger.log('Control command received:', commandDto);
        const commandData = {
            action: commandDto.action,
            target: commandDto.target,
            status: 'pending',
            timestamp: new Date().toISOString(),
        };
        this.iotGateway.broadcast('command_log', commandData);
        return {
            success: true,
            message: `ส่งคำสั่ง ${commandDto.action} ไปยังอุปกรณ์แล้ว`,
            data: commandDto,
            timestamp: new Date().toISOString(),
        };
    }
    updateConfig(id, configData) {
        this.logger.log(`Update config for device ${id}:`, configData);
        const updateData = {
            deviceId: id,
            newConfig: configData,
            timestamp: new Date().toISOString(),
        };
        this.iotGateway.broadcast('config_update', updateData);
        return {
            id,
            updated: true,
            newConfig: configData,
            timestamp: new Date().toISOString(),
        };
    }
    getConnectedClients() {
        this.logger.log('GET connected clients');
        return {
            message: 'Use WebSocket to get connected clients info',
            endpoint: 'Connect via ws://your-domain/iot and send "get_clients" message',
        };
    }
    healthCheck() {
        return {
            status: 'healthy',
            gateway: 'IotsocketGateway',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async wsBroadcast(data, req) {
        try {
            const { event, message } = data;
            if (!event || !message) {
                return {
                    success: false,
                    message: 'Event and message are required',
                };
            }
            const sentCount = this.iotGateway.broadcast(event, message);
            return {
                success: true,
                event,
                sentTo: sentCount,
                message: `Broadcasted to ${sentCount} clients`,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in wsBroadcast:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async wsSendByKey(data, req) {
        try {
            const { key, event, message } = data;
            if (!key || !event || !message) {
                return {
                    success: false,
                    message: 'Key, event and message are required',
                };
            }
            const sent = this.iotGateway.sendToClientByKey(key, event, message);
            return {
                success: sent,
                key,
                event,
                sent,
                message: sent
                    ? `Sent to clients with key: ${key}`
                    : `No clients found with key: ${key}`,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in wsSendByKey:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async wsGetAllClients() {
        try {
            return {
                success: true,
                message: 'Use WebSocket endpoint to get real-time data',
                endpoints: {
                    websocket: 'Connect via ws://your-domain/iot',
                    events: {
                        set_key: 'Send {event: "set_key", data: {key: "your_key"}}',
                        get_data: 'Send {event: "request_all_data"} to get all clients data',
                        send_data: 'Send {event: "get_all_data", data: {...}} to send data',
                    },
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in wsGetAllClients:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async wsConnectedCount() {
        try {
            return {
                success: true,
                message: 'Connect via WebSocket to get real-time connected count',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in wsConnectedCount:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async wsSendMqttData(data, req) {
        try {
            const { topic, payload } = data;
            if (!topic || !payload) {
                return {
                    success: false,
                    message: 'Topic and payload are required',
                };
            }
            const sentCount = this.iotGateway.broadcastMqttData(topic, payload);
            return {
                success: true,
                topic,
                sentTo: sentCount,
                message: `MQTT data sent to ${sentCount} WebSocket clients`,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in wsSendMqttData:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async wsSendNotification(data, req) {
        try {
            const { title, message, type = 'info', key } = data;
            if (!title || !message) {
                return {
                    success: false,
                    message: 'Title and message are required',
                };
            }
            const notification = {
                title,
                message,
                type,
                timestamp: new Date().toISOString(),
            };
            let result;
            if (key) {
                const sent = this.iotGateway.sendToClientByKey(key, 'notification', notification);
                result = {
                    success: sent,
                    key,
                    sent,
                    message: sent
                        ? `Notification sent to clients with key: ${key}`
                        : `No clients found with key: ${key}`,
                };
            }
            else {
                const sentCount = this.iotGateway.broadcast('notification', notification);
                result = {
                    success: true,
                    sentTo: sentCount,
                    message: `Notification broadcasted to ${sentCount} clients`,
                };
            }
            return Object.assign(Object.assign({}, result), { notification, timestamp: new Date().toISOString() });
        }
        catch (error) {
            this.logger.error('Error in wsSendNotification:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    controlDeviceIO(commandDto) {
        this.logger.log('Control command received:', commandDto);
        const commandData = {
            action: commandDto.action,
            target: commandDto.target,
            status: 'pending',
            timestamp: new Date().toISOString(),
        };
        this.iotGateway.broadcast('command_log', commandData);
        this.iotGateway.broadcast('notification', {
            title: 'Device Control',
            message: `Command ${commandDto.action} sent to device`,
            type: 'info',
            timestamp: new Date().toISOString(),
        });
        return {
            success: true,
            message: `ส่งคำสั่ง ${commandDto.action} ไปยังอุปกรณ์แล้ว`,
            data: commandDto,
            timestamp: new Date().toISOString(),
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "GetIndex", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('_cachelist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "_getcachelist", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('cachelist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getcachelist", null);
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
], IotController.prototype, "getDeviceDatafan", null);
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
], IotController.prototype, "getMqttlist", null);
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
], IotController.prototype, "getMqttlistall", null);
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
], IotController.prototype, "DeviceDataGet", null);
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
], IotController.prototype, "device_control1", null);
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
], IotController.prototype, "device_control", null);
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
], IotController.prototype, "getDeviceData", null);
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
], IotController.prototype, "DeviceData", null);
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
], IotController.prototype, "device_control_data", null);
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
], IotController.prototype, "device_get_data", null);
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
], IotController.prototype, "sensercharts", null);
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
], IotController.prototype, "senserchart", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotController.prototype, "findIndex", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Post)('write'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "writeData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('readone'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getTemperatureData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getstartends'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getStartends", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('B1Data'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "B1Data", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('sensers'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "sensers", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('senser'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "senser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getsenserchart'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getStartendchart", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getsenser'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getSenser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getstartend'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getStartend", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getstartendlimit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getStartendlimit", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('getone'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getGetone", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('queryFilterData'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getqueryFilterData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('read'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('measurement')),
    __param(3, (0, common_1.Query)('filters')),
    __param(4, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "readDatafilters", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Post)('read1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "readData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('query'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "queryData", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('removemeasurement'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "removemeasurement", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list aircontrollist' }),
    (0, common_1.Get)('aircontrollist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "aircontrolPaginated", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list aircontrollist' }),
    (0, common_1.Get)('airmodelist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airmodelist", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createairmod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createairmod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('deleteairmod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "delete_airmod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update  air mode status' }),
    (0, common_1.Post)('updateairmodestatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairmodestatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update  air mode status' }),
    (0, common_1.Post)('updateairwarningstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairwarningstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Update air mode configuration' }),
    (0, swagger_1.ApiOperation)({ summary: 'update_api' }),
    (0, common_1.Post)('updateairmode'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairmode", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('airperiodlist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airperiodPaginated", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createperiod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createperiod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Update air mode configuration' }),
    (0, swagger_1.ApiOperation)({ summary: 'update_api' }),
    (0, common_1.Post)('updateperiod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateperiod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('deleteairperiod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "delete_airperiod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update  air mode status' }),
    (0, common_1.Post)('updateperiodstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateperiodstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('airsettingwarninglist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airsettingwarningPaginated", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('airwarninglist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airwarningPaginated", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createwarning'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createwarning", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Update air mode configuration' }),
    (0, swagger_1.ApiOperation)({ summary: 'update_api' }),
    (0, common_1.Post)('updatewarning'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatewarning", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deletewarning' }),
    (0, common_1.Get)('deletewarning'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "delete_warning", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('mqttlog'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "mqttlogPaginated", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update aircontrol status' }),
    (0, common_1.Post)('updateaircontrolstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateaircontrolstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airmod status' }),
    (0, common_1.Post)('updateairmodactive'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairmodactive", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airsettingwarning status' }),
    (0, common_1.Post)('updatestatusairsettingwarning'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatestatusairsettingwarning", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airsettingwarning status' }),
    (0, common_1.Post)('updateairsettingwarningactive'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairsettingwarningactive", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airwarning status' }),
    (0, common_1.Post)('updatestatusairwarning'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatestatusairwarning", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airwarning status' }),
    (0, common_1.Post)('updateairwarningactive'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairwarningactive", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airperiod status' }),
    (0, common_1.Post)('updatestatusairperiod'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatestatusairperiod", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update airperiod status' }),
    (0, common_1.Post)('updateairperiodactive'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateairperiodactive", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createaircontrol'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createaircontrol", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'airmoddevicemap' }),
    (0, common_1.Get)('airmoddevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airmoddevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteairmoddevicemap' }),
    (0, common_1.Get)('deleteaircontrol'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "delete_aircontrol", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteairmoddevicemap' }),
    (0, common_1.Get)('deleteairmoddevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "delete_alarm_event_Device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'aircontroldevicemap' }),
    (0, common_1.Get)('aircontroldevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "aircontroldevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteaircontroldevicemap' }),
    (0, common_1.Get)('deleteaircontroldevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "deleteaircontroldevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'airperioddevicemap' }),
    (0, common_1.Get)('airperioddevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airperioddevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteairperioddevicemap' }),
    (0, common_1.Get)('deleteairperioddevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "deleteairperioddevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'airsettingwarningdevicemap' }),
    (0, common_1.Get)('airsettingwarningdevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airsettingwarningdevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteairsettingwarningdevicemap' }),
    (0, common_1.Get)('deleteairsettingwarningdevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "deleteairsettingwarningdevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'airwarningdevicemap' }),
    (0, common_1.Get)('airwarningdevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "airwarningdevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deleteairwarningdevicemap' }),
    (0, common_1.Get)('deleteairwarningdevicemap'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "deleteairwarningdevicemap", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updateemailstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateemailstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list airperiod_paginate' }),
    (0, common_1.Get)('hostlist'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "host_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update host' }),
    (0, common_1.Post)('updatehost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatehost", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update  status' }),
    (0, common_1.Post)('updatehoststatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updatehoststatus", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createahost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createhost", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_host' }),
    (0, common_1.Get)('deletehosts'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "deletehosts", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('deviceid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IotController.prototype, "getDeviceStatus", null);
__decorate([
    (0, common_1.Get)('send'),
    __param(0, (0, common_1.Query)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('control'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotController.prototype, "controlDevice", null);
__decorate([
    (0, common_1.Put)('config/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IotController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('clients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotController.prototype, "getConnectedClients", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('ws/broadcast'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsBroadcast", null);
__decorate([
    (0, common_1.Post)('ws/send-by-key'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsSendByKey", null);
__decorate([
    (0, common_1.Get)('ws/get-all-clients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsGetAllClients", null);
__decorate([
    (0, common_1.Get)('ws/connected-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsConnectedCount", null);
__decorate([
    (0, common_1.Post)('ws/send-mqtt'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsSendMqttData", null);
__decorate([
    (0, common_1.Post)('ws/notify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "wsSendNotification", null);
__decorate([
    (0, common_1.Post)('control'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotController.prototype, "controlDeviceIO", null);
IotController = IotController_1 = __decorate([
    (0, common_1.Controller)('iot'),
    __metadata("design:paramtypes", [iot_service_1.IotService,
        settings_service_1.SettingsService,
        mqtt_service_1.MqttService,
        roles_service_1.RolesService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService,
        iotsocket_gateway_1.IotsocketGateway])
], IotController);
exports.IotController = IotController;
//# sourceMappingURL=iot.controller.js.map