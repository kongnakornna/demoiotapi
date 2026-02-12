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
var IotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotService = exports.InfluxDB_password = exports.InfluxDB_username = exports.InfluxDB_bucket = exports.InfluxDB_org = exports.InfluxDB_token = exports.InfluxDB_url = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aircontrol_entity_1 = require("./entities/aircontrol.entity");
const airmod_entity_1 = require("./entities/airmod.entity");
const airperiod_entity_1 = require("./entities/airperiod.entity");
const airsettingwarning_entity_1 = require("./entities/airsettingwarning.entity");
const airwarning_entity_1 = require("./entities/airwarning.entity");
const aircontroldevicemap_entity_1 = require("./entities/aircontroldevicemap.entity");
const airmoddevicemap_entity_1 = require("./entities/airmoddevicemap.entity");
const airperioddevicemap_entity_1 = require("./entities/airperioddevicemap.entity");
const airsettingwarningdevicemap_entity_1 = require("./entities/airsettingwarningdevicemap.entity");
const airwarningdevicemap_entity_1 = require("./entities/airwarningdevicemap.entity");
const aircontrollog_entity_1 = require("./entities/aircontrollog.entity");
const mqttlog_entity_1 = require("./entities/mqttlog.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const devicetype_entity_1 = require("../settings/entities/devicetype.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
const deviceaction_entity_1 = require("../settings/entities/deviceaction.entity");
const deviceactionlog_entity_1 = require("../settings/entities/deviceactionlog.entity");
const deviceactionuser_entity_1 = require("../settings/entities/deviceactionuser.entity");
const devivicealarmaction_entity_1 = require("../settings/entities/devivicealarmaction.entity");
const telegram_entity_1 = require("../settings/entities/telegram.entity");
const api_entity_1 = require("../settings/entities/api.entity");
const device_entity_1 = require("../settings/entities/device.entity");
const email_entity_1 = require("../settings/entities/email.entity");
const host_entity_1 = require("../settings/entities/host.entity");
const influxdb_entity_1 = require("../settings/entities/influxdb.entity");
const line_entity_1 = require("../settings/entities/line.entity");
const nodered_entity_1 = require("../settings/entities/nodered.entity");
const schedule_entity_1 = require("../settings/entities/schedule.entity");
const sms_entity_1 = require("../settings/entities/sms.entity");
const token_entity_1 = require("../settings/entities/token.entity");
const scheduledevice_entity_1 = require("../settings/entities/scheduledevice.entity");
const alarmdevice_entity_1 = require("../settings/entities/alarmdevice.entity");
const alarmdeviceevent_entity_1 = require("../settings/entities/alarmdeviceevent.entity");
const scheduleprocesslog_entity_1 = require("../settings/entities/scheduleprocesslog.entity");
const alarmprocesslog_entity_1 = require("../settings/entities/alarmprocesslog.entity");
const alarmprocesslogtemp_entity_1 = require("../settings/entities/alarmprocesslogtemp.entity");
const alarmprocesslogemail_entity_1 = require("../settings/entities/alarmprocesslogemail.entity");
const alarmprocesslogline_entity_1 = require("../settings/entities/alarmprocesslogline.entity");
const alarmprocesslogsms_entity_1 = require("../settings/entities/alarmprocesslogsms.entity");
const alarmprocesslogtelegram_entity_1 = require("../settings/entities/alarmprocesslogtelegram.entity");
const alarmprocesslogmqtt_entity_1 = require("../settings/entities/alarmprocesslogmqtt.entity");
const mqtthost_entity_1 = require("../settings/entities/mqtthost.entity");
const format = __importStar(require("../../helpers/format.helper"));
var { promisify } = require('util');
const format_helper_1 = require("../../helpers/format.helper");
var md5 = require('md5');
var axios = require('axios');
var moment = require('moment');
require("dotenv/config");
require('dotenv').config();
const schedule_1 = require("@nestjs/schedule");
const BackupManager = require('influx-backup');
var InfluxDB_url = process.env.INFLUX_URL;
exports.InfluxDB_url = InfluxDB_url;
var InfluxDB_token = process.env.INFLUX_TOKEN;
exports.InfluxDB_token = InfluxDB_token;
var InfluxDB_org = process.env.INFLUX_ORG;
exports.InfluxDB_org = InfluxDB_org;
var InfluxDB_bucket = process.env.INFLUX_BUCKET;
exports.InfluxDB_bucket = InfluxDB_bucket;
var InfluxDB_username = process.env.INFLUXDB_USERNAME;
exports.InfluxDB_username = InfluxDB_username;
var InfluxDB_password = process.env.INFLUXDB_PASSWORD;
exports.InfluxDB_password = InfluxDB_password;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const child_process_1 = require("child_process");
let IotService = IotService_1 = class IotService {
    constructor(entityManager, dataSource, aircontrolRepository, airmodRepository, airperiodRepository, airsettingwarningRepository, airwarningRepository, aircontroldevicemapRepository, airmoddevicemapRepository, airperioddevicemapRepository, airsettingwarningdevicemapRepository, airwarningdevicemapRepository, aircontrollogRepository, mqttlogRepository, SettingRepository, LocationRepository, TypeRepository, SensorRepository, GroupRepository, MqttRepository, ApiRepository, DeviceTypeRepository, DeviceRepository, EmailRepository, HostRepository, InfluxdbRepository, LineRepository, NoderedRepository, ScheduleRepository, SmsRepository, TokenRepository, scheduleDeviceRepository, DeviceactionRepository, DeviceactionlogRepository, DeviceactionuserRepository, DevicealarmactionRepository, TelegramRepository, alarmDeviceRepository, alarmDeviceEventRepository, scheduleprocesslogRepository, alarmprocesslogRepository, alarmprocesslogtempRepository, alarmprocesslogmqttRepository, alarmprocesslogemailRepository, alarmprocessloglineRepository, alarmprocesslogsmsRepository, alarmprocesslogtelegramRepository, userRepository, SdUserRoleRepository, SdUserRolesAccessRepository, UserRolePermissionRepository, mqtthostRepository) {
        this.entityManager = entityManager;
        this.dataSource = dataSource;
        this.aircontrolRepository = aircontrolRepository;
        this.airmodRepository = airmodRepository;
        this.airperiodRepository = airperiodRepository;
        this.airsettingwarningRepository = airsettingwarningRepository;
        this.airwarningRepository = airwarningRepository;
        this.aircontroldevicemapRepository = aircontroldevicemapRepository;
        this.airmoddevicemapRepository = airmoddevicemapRepository;
        this.airperioddevicemapRepository = airperioddevicemapRepository;
        this.airsettingwarningdevicemapRepository = airsettingwarningdevicemapRepository;
        this.airwarningdevicemapRepository = airwarningdevicemapRepository;
        this.aircontrollogRepository = aircontrollogRepository;
        this.mqttlogRepository = mqttlogRepository;
        this.SettingRepository = SettingRepository;
        this.LocationRepository = LocationRepository;
        this.TypeRepository = TypeRepository;
        this.SensorRepository = SensorRepository;
        this.GroupRepository = GroupRepository;
        this.MqttRepository = MqttRepository;
        this.ApiRepository = ApiRepository;
        this.DeviceTypeRepository = DeviceTypeRepository;
        this.DeviceRepository = DeviceRepository;
        this.EmailRepository = EmailRepository;
        this.HostRepository = HostRepository;
        this.InfluxdbRepository = InfluxdbRepository;
        this.LineRepository = LineRepository;
        this.NoderedRepository = NoderedRepository;
        this.ScheduleRepository = ScheduleRepository;
        this.SmsRepository = SmsRepository;
        this.TokenRepository = TokenRepository;
        this.scheduleDeviceRepository = scheduleDeviceRepository;
        this.DeviceactionRepository = DeviceactionRepository;
        this.DeviceactionlogRepository = DeviceactionlogRepository;
        this.DeviceactionuserRepository = DeviceactionuserRepository;
        this.DevicealarmactionRepository = DevicealarmactionRepository;
        this.TelegramRepository = TelegramRepository;
        this.alarmDeviceRepository = alarmDeviceRepository;
        this.alarmDeviceEventRepository = alarmDeviceEventRepository;
        this.scheduleprocesslogRepository = scheduleprocesslogRepository;
        this.alarmprocesslogRepository = alarmprocesslogRepository;
        this.alarmprocesslogtempRepository = alarmprocesslogtempRepository;
        this.alarmprocesslogmqttRepository = alarmprocesslogmqttRepository;
        this.alarmprocesslogemailRepository = alarmprocesslogemailRepository;
        this.alarmprocessloglineRepository = alarmprocessloglineRepository;
        this.alarmprocesslogsmsRepository = alarmprocesslogsmsRepository;
        this.alarmprocesslogtelegramRepository = alarmprocesslogtelegramRepository;
        this.userRepository = userRepository;
        this.SdUserRoleRepository = SdUserRoleRepository;
        this.SdUserRolesAccessRepository = SdUserRolesAccessRepository;
        this.UserRolePermissionRepository = UserRolePermissionRepository;
        this.mqtthostRepository = mqtthostRepository;
        this.manager = new BackupManager({ db: InfluxDB_org });
        this.logger = new common_1.Logger(IotService_1.name);
        this.latestData = new Map();
        var url = InfluxDB_url;
        var token = InfluxDB_token;
        var org = InfluxDB_org;
        var bucket = InfluxDB_bucket;
        this.influxDB = new influxdb_client_1.InfluxDB({ url, token });
        this.writeApi = this.influxDB.getWriteApi(org, bucket);
        this.queryApi = this.influxDB.getQueryApi(InfluxDB_org);
    }
    async handleBackup() {
        try {
            await this.manager.backup();
        }
        catch (error) {
        }
    }
    async backup(database, backupDir) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`influxd backup -portable -db ${database} ${backupDir}`, (error, stdout, stderr) => {
                if (error)
                    return reject(stderr);
                resolve(stdout);
            });
        });
    }
    async restore(database, backupDir) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`influxd restore -portable -db ${database} ${backupDir}`, (error, stdout, stderr) => {
                if (error)
                    return reject(stderr);
                resolve(stdout);
            });
        });
    }
    async writeData(measurement, fields, tags) {
        var point = new influxdb_client_1.Point(measurement);
        Object.entries(fields).forEach(([key, value]) => point.floatField(key, value));
        if (tags) {
            Object.entries(tags).forEach(([key, value]) => point.tag(key, value));
        }
        this.writeApi.writePoint(point);
        await this.writeApi.flush();
    }
    async B1Data(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var fluxQuery = `
        from(bucket: "cmon_bucket")
        |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
        |> filter(fn: (r) => r["_measurement"] == "FAN_control_TEST2")
        |> filter(fn: (r) => r["_field"] == "Temperature" or r["_field"] == "TimeStamp" or r["_field"] == "SN" or r["_field"] == "Relay2" or r["_field"] == "Relay1" or r["_field"] == "Location" or r["_field"] == "Current")
        |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
        |> yield(name: "mean")
      `;
        var results = [];
        return new Promise((resolve, reject) => {
            this.queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    var data = tableMeta.toObject(row);
                    results.push(data);
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(results);
                },
            });
        });
    }
    async queryFilterData(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: ${time_start}) 
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> aggregateWindow(every: ${time}, fn: mean, createEmpty: true)
      `;
        var results = [];
        return new Promise((resolve, reject) => {
            this.queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    var data = tableMeta.toObject(row);
                    results.push(data);
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(results);
                },
            });
        });
    }
    async influxdbFilterDatas(Dto) {
        var start = Dto.start || '-1m';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'temperature';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var limit = Dto.limit || 150;
        var offset = Dto.offset || 0;
        var mean = Dto.mean || 'last';
        var fluxQuery = `
                from(bucket: "${bucket}")
                  |> range(start: ${start}, stop: ${stop})
                  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
                  |> filter(fn: (r) => r["_field"] == "${field}") 
                  |> limit(n:${limit}, offset: ${offset})
                  |> yield(name: "${mean}")`;
        var results = [];
        return new Promise((resolve, reject) => {
            this.queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    var data = tableMeta.toObject(row);
                    results.push(data);
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(results);
                },
            });
        });
    }
    async influxdbFilterData(Dto) {
        var start = Dto.start || '-1m';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'temperature';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var limit = Dto.limit || 1;
        var offset = Dto.offset || 0;
        var mean = Dto.mean || 'last';
        var fluxQuery = `
                from(bucket: "${bucket}")
                  |> range(start: ${start}, stop: ${stop})
                  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
                  |> filter(fn: (r) => r["_field"] == "${field}") 
                  |> limit(n:${limit}, offset: ${offset})
                  |> yield(name: "${mean}")`;
        var results = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results.push({
                            bucket: bucket,
                            measurement: data._measurement,
                            result: data.result,
                            table: data.table,
                            field: data._field,
                            start: format.convertDatetime(start),
                            stop: format.convertDatetime(stop),
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async influxdbFilterchart1(Dto) {
        var start = Dto.start || '-1m';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Temp';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var limit = Dto.limit || 150;
        var offset = Dto.offset || 0;
        var mean = Dto.mean || 'last';
        var fluxQuery = `
                from(bucket: "${bucket}")
                  |> range(start: ${start}, stop: ${stop})
                  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
                  |> filter(fn: (r) => r["_field"] == "${field}") 
                  |> limit(n:${limit}, offset: ${offset})
                  |> yield(name: "${mean}")`;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertToTwoDecimals(data._value));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async influxdbFilterchart2(Dto) {
        var start = Dto.start || '-1m';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Temp';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var limit = Dto.limit || 150;
        var offset = Dto.offset || 0;
        var mean = Dto.mean || 'last';
        var fluxQuery = `
                from(bucket: "${bucket}")
                  |> range(start: ${start}, stop: ${stop})
                  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
                  |> filter(fn: (r) => r["_field"] == "${field}") 
                  |> limit(n:${limit}, offset: ${offset})
                  |> yield(name: "${mean}")`;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertDatetime(dtime));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getStartendlimit(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var start = Dto.start || '-30d';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'median';
        var limit = Dto.limit;
        var offset = Dto.offset;
        var fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: ${start}, stop: ${stop})
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false)
          |> yield(name: "${mean}")
          |> limit(n:${limit}, offset: ${offset})
      `;
        var results = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results.push({
                            bucket: bucket,
                            result: data.result,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                            field: data._field,
                            measurement: data._measurement,
                        });
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getStartend(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var start = Dto.start || '-30d';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'median';
        var fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false)
        |> yield(name: "${mean}")
    `;
        var results = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getStartend1(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var start = Dto.start || '-30d';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'median';
        var fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: ${start}, stop: ${stop})
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false)
          |> yield(name: "${mean}")
      `;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertToTwoDecimals(data._value));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getStartend2(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'Envavorment';
        var field = Dto.field || 'Humidity';
        var time = Dto.time || '1m';
        var start = Dto.start || '-30d';
        var stop = Dto.stop || 'now()';
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'median';
        var fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: ${start}, stop: ${stop})
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> aggregateWindow(every: ${windowPeriod}, fn: mean, createEmpty: false)
          |> yield(name: "${mean}")
      `;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertDatetime(dtime));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getSenser(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'room2Temp';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var start = Dto.start || '-15m';
        var stop = Dto.stop || 'now()';
        var limit = Dto.limit || 1;
        var offset = Dto.offset || 0;
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'last';
        var fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: ${windowPeriod}, fn: last, createEmpty: false)
        |> limit(n:${limit}, offset: ${offset})
        |> yield(name: "${mean}")
    `;
        var results = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results.push({
                            bucket: bucket,
                            measurement: data._measurement,
                            result: data.result,
                            table: data.table,
                            field: data._field,
                            start: format.convertDatetime(start),
                            stop: format.convertDatetime(stop),
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getSenserchart1(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'room2Temp';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var start = Dto.start || '-15m';
        var stop = Dto.stop || 'now()';
        var limit = Dto.limit || 1;
        var offset = Dto.offset || 0;
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'last';
        var fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: ${windowPeriod}, fn: last, createEmpty: false)
        |> limit(n:${limit}, offset: ${offset})
        |> yield(name: "${mean}")
    `;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertToTwoDecimals(data._value));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async getSenserchart2(Dto) {
        var time_start = Dto.time_start || '-1h';
        var bucket = Dto.bucket || InfluxDB_bucket;
        var measurement = Dto.measurement || 'room2Temp';
        var field = Dto.field || 'value';
        var time = Dto.time || '1m';
        var start = Dto.start || '-15m';
        var stop = Dto.stop || 'now()';
        var limit = Dto.limit || 1;
        var offset = Dto.offset || 0;
        var windowPeriod = Dto.windowPeriod || '12h';
        var tzString = Dto.tzString || 'Asia/Bangkok';
        var mean = Dto.mean || 'last';
        var fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: ${windowPeriod}, fn: last, createEmpty: false)
        |> limit(n:${limit}, offset: ${offset})
        |> yield(name: "${mean}")
    `;
        var results = [];
        var results1 = [];
        try {
            await new Promise((resolve, reject) => {
                this.queryApi.queryRows(fluxQuery, {
                    next(row, tableMeta) {
                        var data = tableMeta.toObject(row);
                        var start = format.convertTZ(data._start, tzString);
                        var stop = format.convertTZ(data._stop, tzString);
                        var dtime = format.convertTZ(data._time, tzString);
                        results1.push({
                            bucket: bucket,
                            field: data._field,
                            time: format.convertDatetime(dtime),
                            value: format.convertToTwoDecimals(data._value),
                        });
                        results.push(format.convertDatetime(dtime));
                    },
                    error(error) {
                        reject(error);
                    },
                    complete() {
                        resolve(results);
                    },
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to query InfluxDB: ${error.message}`);
        }
        return results;
    }
    async queryTemperatureData() {
        var fluxQuery1 = `
        from(bucket: "${InfluxDB_bucket}")
          |> range(start: -1h) 
          |> filter(fn: (r) => r["_measurement"] == "Envavorment")
          |> filter(fn: (r) => r["_field"] == "Amp" or r["_field"] == "Humidity" or r["_field"] == "Latitude" or r["_field"] == "Longitude" or r["_field"] == "Temperature" or r["_field"] == "Temperature2" or r["_field"] == "Voltage" or r["_field"] == "sensors_Relay1")
          |> yield(name: "mean")
      `;
        var fluxQuery2 = `
        from(bucket: "${InfluxDB_bucket}")
          |> range(start: -1d) 
          |> filter(fn: (r) => r["_measurement"] == "Envavorment")
          |> filter(fn: (r) => r["_field"] == "Amp" or r["_field"] == "Humidity" or r["_field"] == "Latitude" or r["_field"] == "Longitude" or r["_field"] == "Temperature" or r["_field"] == "Temperature2" or r["_field"] == "Voltage" or r["_field"] == "sensors_Relay1")
          |> aggregateWindow(every: 30m, fn: mean, createEmpty: true)
      `;
        var time_start = '-1h';
        var bucket = InfluxDB_bucket;
        var _measurement = 'Envavorment';
        var _field = 'Humidity';
        var time = '1m';
        var fluxQuery = `
        from(bucket: "${InfluxDB_bucket}")
          |> range(start: ${time_start}) 
          |> filter(fn: (r) => r["_measurement"] == "${_measurement}")
          |> filter(fn: (r) => r["_field"] == "${_field}")
          |> aggregateWindow(every: ${time}, fn: mean, createEmpty: true)
      `;
        var results = [];
        return new Promise((resolve, reject) => {
            this.queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    var data = tableMeta.toObject(row);
                    results.push(data);
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(results);
                },
            });
        });
    }
    async queryFilteredData(measurement, filters, timeRange) {
        var queryApi = this.queryApi;
        let fluxQuery = `from(bucket: "${process.env.INFLUX_BUCKET}") |> range(start: ${timeRange}) |> filter(fn: (r) => r._measurement == "${measurement}")`;
        for (var [key, value] of Object.entries(filters)) {
            fluxQuery += ` |> filter(fn: (r) => r.${key} == "${value}")`;
        }
        var rows = [];
        await queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                var obj = tableMeta.toObject(row);
                rows.push(obj);
            },
            error(error) {
            },
            complete() {
            },
        });
        return rows;
    }
    async recordTemperature(sensorId, value) {
        var point = new influxdb_client_1.Point('temperature')
            .tag('sensor_id', sensorId)
            .floatField('value', value);
        await this.writeApi.writePoint(point);
    }
    async queryData(queryData) {
        var query = "from(bucket: 'cmon_bucket') |> range(start: -1h)";
        var queryApi = await this.queryApi.collectRows(query);
        return queryApi;
    }
    async getRecentReadings() {
        var query = `
      from(bucket: "sensors")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "temperature")
    `;
        return this.queryApi.queryRows(query);
    }
    async queryDataRow(fluxQuery) {
        var rows = [];
        await new Promise((resolve, reject) => {
            this.queryApi.queryRows(fluxQuery, {
                next(row) {
                    rows.push(row);
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(rows);
                },
            });
        });
        return rows;
    }
    create(createIotDto) {
        return 'This action adds a new iot';
    }
    findAll() {
        return `This action returns all iot`;
    }
    findOne(id) {
        return `This action returns a #${id} iot`;
    }
    update(id, updateIotDto) {
        return `This action updates a #${id} iot`;
    }
    remove(id) {
        return `This action removes a #${id} iot`;
    }
    async removeMeasurement(Dto) {
        var org = Dto.org;
        var token = Dto.token;
        var bucket = Dto.bucket;
        var start = Dto.start;
        var stop = Dto.stop;
        var measurement = Dto.measurement;
        var fluxQuery = `influx delete --org '${org}' --token '${token}' --bucket '${bucket}' --start ${start} --stop $(date +"${stop}") --predicate '_measurement="${measurement}"'`;
        await this.queryApi.queryRows(fluxQuery);
        return `This action removes Measurement  #${measurement}`;
    }
    async create_aircontrol(dto) {
        const result = await this.aircontrolRepository.save(this.aircontrolRepository.create(dto));
        return result;
    }
    async get_aircontrol_data(name) {
        try {
            const rs = await this.aircontrolRepository.findOne({
                where: {
                    name,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_aircontrol_id(air_control_id) {
        if (!air_control_id || isNaN(air_control_id) || air_control_id <= 0) {
            throw new common_1.UnprocessableEntityException('Invalid air_control_id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_control_id: ${air_control_id}`);
            const constsetting = await this.get_aircontrol(air_control_id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with air_control_id ${air_control_id} not found`);
            }
            await this.aircontrolRepository.delete(air_control_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_aircontrol(dto) {
        try {
            var air_control_id = dto.air_control_id;
            var status = dto.status;
            const query = await this.aircontrolRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.alarm_action_id)', 'cnt');
            query.where('1=1');
            query.andWhere('l.air_control_id=:air_control_id', { air_control_id: air_control_id });
            if (status) {
                query.andWhere('l.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                if (status) {
                    var criteria = { status: status, air_control_id: air_control_id };
                }
                else {
                    var criteria = { air_control_id: air_control_id };
                }
                const deleteResult = await this.aircontrolRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async get_aircontrol(air_control_id) {
        try {
            const rs = await this.aircontrolRepository.findOne({
                where: {
                    air_control_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_status_aircontrol(air_control_id, statusData) {
        try {
            if (!air_control_id || air_control_id <= 0) {
                throw new common_1.UnprocessableEntityException('Invalid air_control_id');
            }
            const DataUpdates = {};
            if (statusData.active !== undefined) {
                DataUpdates.active = statusData.active;
            }
            if (Object.keys(DataUpdates).length === 0) {
                this.logger.warn(`No valid fields to update for air_control_id '${air_control_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.aircontrolRepository
                .createQueryBuilder()
                .update('sd_air_control')
                .set(DataUpdates)
                .where('air_control_id = :air_control_id', { air_control_id })
                .execute();
            if (updateResult.affected === 0) {
                this.logger.warn(`Update failed for air_control_id '${air_control_id}'.`);
                throw new common_1.NotFoundException(`Update failed for air_control_id '${air_control_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_control_id '${air_control_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_control_id '${air_control_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_empty_active_aircontrol(air_control_id, dto) {
        try {
            const DataUpdateUd = {};
            DataUpdateUd.active = 0;
            const updateResultRT = await this.aircontrolRepository
                .createQueryBuilder()
                .update('sd_air_control')
                .set(DataUpdateUd)
                .where('air_control_id=:air_control_id', { air_control_id })
                .execute();
            if (updateResultRT.affected == 0) {
                this.logger.warn(`No devices found for air_control_id '${air_control_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_control_id '${air_control_id}'`);
            }
            const DataUpdateActive = {};
            DataUpdateActive.active = 1;
            const updateResult = await this.aircontrolRepository
                .createQueryBuilder()
                .update('sd_air_control')
                .set(DataUpdateActive)
                .where('air_control_id=:air_control_id', { air_control_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_control_id '${air_control_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_control_id '${air_control_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_control_id '${air_control_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_control_id '${air_control_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_aircontrol(dto) {
        let air_control_id = dto.air_control_id;
        let name = dto.name;
        let data = dto.data;
        let status = dto.status;
        const DataUpdate = {};
        const query = await this.aircontrolRepository.createQueryBuilder('a');
        query.select(['a.air_control_id AS air_control_id']);
        query.where('1=1');
        query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${air_control_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${air_control_id}.`,
                message_th: `ไม่พบข้อมูล setting ${air_control_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (air_control_id) {
            DataUpdate.air_control_id = air_control_id;
        }
        if (name) {
            DataUpdate.name = name;
        }
        if (dto.setting_name) {
            DataUpdate.setting_name = dto.setting_name;
        }
        if (data) {
            DataUpdate.data = data;
        }
        if (dto.active) {
            DataUpdate.active = dto.active;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.aircontrolRepository
            .createQueryBuilder()
            .update('sd_air_control')
            .set(DataUpdate)
            .where('air_control_id=:air_control_id', { air_control_id: air_control_id })
            .execute();
        return 200;
    }
    async aircontrol_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var active = dto.active;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.aircontrolRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.air_control_id)', 'cnt');
            }
            else {
                query.select([
                    'a.air_control_id as air_control_id',
                    'a.name as name',
                    'a.data as data',
                    'a.status as status',
                    'a.active as active',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.air_control_id) {
                query.andWhere('a.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (status) {
                query.andWhere('a.status=:status', { status: status });
            }
            if (active) {
                query.andWhere('a.active=:active', { active: active });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_airmod(dto) {
        const result = await this.airmodRepository.save(this.airmodRepository.create(dto));
        return result;
    }
    async delete_airmod_id(air_mod_id) {
        if (!air_mod_id || isNaN(air_mod_id) || air_mod_id <= 0) {
            throw new common_1.UnprocessableEntityException('Invalid air_mod_id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_mod_id: ${air_mod_id}`);
            const constsetting = await this.get_airmod(air_mod_id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with air_mod_id ${air_mod_id} not found`);
            }
            await this.airmodRepository.delete(air_mod_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airmod(air_mod_id) {
        try {
            var air_mod_id = air_mod_id;
            const query = await this.airmodRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.air_mod_id)', 'cnt');
            query.where('1=1');
            query.andWhere('l.air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = { air_mod_id: air_mod_id };
                const deleteResult = await this.airmodRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async get_airmod_active(active) {
        try {
            const rs = await this.airmodRepository.findOne({
                where: {
                    active,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async get_warning_active(active) {
        try {
            const rs = await this.airwarningRepository.findOne({
                where: {
                    active,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async get_airperiod_active(active) {
        try {
            const rs = await this.airperiodRepository.findOne({
                where: {
                    active,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async get_airwarning(air_warning_id) {
        try {
            const rs = await this.airwarningRepository.findOne({
                where: {
                    air_warning_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_airwarning_val(air_warning_id, dto) {
        try {
            const DataUpdate = {};
            const validFields = ['active', 'status'];
            for (const field of validFields) {
                if (dto[field] !== undefined && dto[field] !== '') {
                    DataUpdate[field] = dto[field];
                }
            }
            if (Object.keys(DataUpdate).length === 0) {
                this.logger.warn(`No valid fields to update for air_warning_id '${air_warning_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            let updateResult;
            if (dto.active !== undefined && dto.active !== '') {
                if (dto.active == 1) {
                    await this.airwarningRepository
                        .createQueryBuilder()
                        .update('sd_air_warning')
                        .set({ active: 0 })
                        .execute();
                }
                updateResult = await this.airwarningRepository
                    .createQueryBuilder()
                    .update('sd_air_warning')
                    .set(DataUpdate)
                    .where('air_warning_id = :air_warning_id', { air_warning_id })
                    .execute();
            }
            else {
                updateResult = await this.airwarningRepository
                    .createQueryBuilder()
                    .update('sd_air_warning')
                    .set(DataUpdate)
                    .where('air_warning_id = :air_warning_id', { air_warning_id })
                    .execute();
            }
            if (updateResult.affected === 0) {
                this.logger.warn(`No devices found for air_warning_id '${air_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_warning_id '${air_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_warning_id '${air_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_warning_id '${air_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async get_airmod(air_mod_id) {
        try {
            const rs = await this.airmodRepository.findOne({
                where: {
                    air_mod_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async get_airmod_name(name) {
        try {
            const rs = await this.airmodRepository.findOne({
                where: {
                    name,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_airmodstatus_val(air_mod_id, dto) {
        try {
            const DataUpdate = {};
            const validFields = ['active', 'status'];
            for (const field of validFields) {
                if (dto[field] !== undefined && dto[field] !== '') {
                    DataUpdate[field] = dto[field];
                }
            }
            if (Object.keys(DataUpdate).length === 0) {
                this.logger.warn(`No valid fields to update for air_mod_id '${air_mod_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            let updateResult;
            if (dto.active !== undefined && dto.active !== '') {
                if (dto.active == 1) {
                    await this.airmodRepository
                        .createQueryBuilder()
                        .update('sd_air_mod')
                        .set({ active: 0 })
                        .execute();
                }
                updateResult = await this.airmodRepository
                    .createQueryBuilder()
                    .update('sd_air_mod')
                    .set(DataUpdate)
                    .where('air_mod_id = :air_mod_id', { air_mod_id })
                    .execute();
            }
            else {
                updateResult = await this.airmodRepository
                    .createQueryBuilder()
                    .update('sd_air_mod')
                    .set(DataUpdate)
                    .where('air_mod_id = :air_mod_id', { air_mod_id })
                    .execute();
            }
            if (updateResult.affected === 0) {
                this.logger.warn(`No devices found for air_mod_id '${air_mod_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_mod_id '${air_mod_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_mod_id '${air_mod_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_mod_id '${air_mod_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async updateAirMode(dto) {
        var air_mod_id = dto.air_mod_id;
        var DataUpdate = {};
        if (dto.name != '') {
            DataUpdate.name = dto.name;
        }
        if (dto.data != '') {
            DataUpdate.data = dto.data;
        }
        if (dto.status != '') {
            DataUpdate.status = dto.status;
        }
        if (dto.active != '') {
            DataUpdate.active = dto.active;
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.airmodRepository
            .createQueryBuilder()
            .update('sd_air_mod')
            .set(DataUpdate)
            .where('air_mod_id=:air_mod_id', { air_mod_id: dto.air_mod_id })
            .execute();
        return 200;
    }
    async airmod_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.airmodRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.air_mod_id)', 'cnt');
            }
            else {
                query.select([
                    'a.air_mod_id as air_mod_id',
                    'a.name as name',
                    'a.data as data',
                    'a.status as status',
                    'a.active as active',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.air_mod_id) {
                query.andWhere('a.air_mod_id =:air_mod_id', { air_mod_id: dto.air_mod_id });
            }
            if (status) {
                query.andWhere('a.status=:status', { status: status });
            }
            if (dto.active) {
                query.andWhere('a.active=:active', { active: dto.active });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_statusairmod(air_mod_id, dto) {
        try {
            const DataUpdate = {};
            const valdata = ['status', 'active', 'data'];
            for (const da of valdata) {
                if (dto[da] !== undefined && dto[da] !== '') {
                    DataUpdate[da] = dto[da];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_mod_id '${air_mod_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_mod')
                .set(DataUpdate)
                .where('air_mod_id=:air_mod_id', { air_mod_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_mod_id '${air_mod_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_mod_id '${air_mod_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_mod_id '${air_mod_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for schedule_id '${air_mod_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_status_airmod(air_mod_id, dto) {
        try {
            const DataUpdate = {};
            const datastatus = ['active', 'status'];
            for (const datatus of datastatus) {
                if (dto[datatus] !== undefined && dto[datatus] !== '') {
                    DataUpdate[datatus] = dto[datatus];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_mod_id '${air_mod_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_mod')
                .set(DataUpdate)
                .where('air_mod_id=:air_mod_id', { air_mod_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_mod_id '${air_mod_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_mod_id '${air_mod_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_mod_id '${air_mod_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_mod_id '${air_mod_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_empty_active_airmod(air_mod_id, dto) {
        try {
            const DataUpdateUd = {};
            DataUpdateUd.active = 0;
            const updateResultRT = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_mod')
                .set(DataUpdateUd)
                .where('air_mod_id=:air_mod_id', { air_mod_id })
                .execute();
            if (updateResultRT.affected == 0) {
                this.logger.warn(`No devices found for air_mod_id '${air_mod_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_mod_id '${air_mod_id}'`);
            }
            const DataUpdateActive = {};
            DataUpdateActive.active = 1;
            const updateResult = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_mod')
                .set(DataUpdateActive)
                .where('air_mod_id=:air_mod_id', { air_mod_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_mod_id '${air_mod_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_mod_id '${air_mod_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_mod_id '${air_mod_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_mod_id '${air_mod_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async create_airperiod(dto) {
        const result = await this.airperiodRepository.save(this.airperiodRepository.create(dto));
        return result;
    }
    async get_period_name(name) {
        try {
            const rs = await this.airperiodRepository.findOne({
                where: {
                    name,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_airperiod_id(air_period_id) {
        if (!air_period_id || isNaN(air_period_id) || air_period_id <= 0) {
            throw new common_1.UnprocessableEntityException('Invalid air_period_id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_period_id: ${air_period_id}`);
            const constsetting = await this.get_airperiod(air_period_id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with air_period_id ${air_period_id} not found`);
            }
            await this.airperiodRepository.delete(air_period_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airperiod(dto) {
        try {
            var air_period_id = dto.air_period_id;
            var status = dto.status;
            const query = await this.airperiodRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.air_period_id)', 'cnt');
            query.where('1=1');
            query.andWhere('l.air_period_id=:air_period_id', { air_period_id: air_period_id });
            if (status) {
                query.andWhere('l.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                if (status) {
                    var criteria = { status: status, air_period_id: air_period_id };
                }
                else {
                    var criteria = { air_period_id: air_period_id };
                }
                const deleteResult = await this.airperiodRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async get_airperiod(air_period_id) {
        try {
            const rs = await this.airperiodRepository.findOne({
                where: {
                    air_period_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_airperiodstatus_val(air_period_id, dto) {
        try {
            const DataUpdate = {};
            const validFields = ['active', 'status'];
            for (const field of validFields) {
                if (dto[field] !== undefined && dto[field] !== '') {
                    DataUpdate[field] = dto[field];
                }
            }
            if (Object.keys(DataUpdate).length === 0) {
                this.logger.warn(`No valid fields to update for air_period_id '${air_period_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            let updateResult;
            if (dto.active !== undefined && dto.active !== '') {
                if (dto.active == 1) {
                    await this.airperiodRepository
                        .createQueryBuilder()
                        .update('sd_air_period')
                        .set({ active: 0 })
                        .execute();
                }
                updateResult = await this.airperiodRepository
                    .createQueryBuilder()
                    .update('sd_air_period')
                    .set(DataUpdate)
                    .where('air_period_id = :air_period_id', { air_period_id })
                    .execute();
            }
            else {
                updateResult = await this.airperiodRepository
                    .createQueryBuilder()
                    .update('sd_air_period')
                    .set(DataUpdate)
                    .where('air_period_id = :air_period_id', { air_period_id })
                    .execute();
            }
            if (updateResult.affected === 0) {
                this.logger.warn(`No devices found for air_period_id '${air_period_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_period_id '${air_period_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_period_id '${air_period_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_period_id '${air_period_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_airperiod(dto) {
        let air_period_id = dto.air_period_id;
        let name = dto.name;
        let data = dto.data;
        let status = dto.status;
        const DataUpdate = {};
        const query = await this.airperiodRepository.createQueryBuilder('a');
        query.select(['a.air_period_id AS air_period_id']);
        query.where('1=1');
        query.andWhere('a.air_period_id=:air_period_id', { air_period_id: air_period_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${air_period_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${air_period_id}.`,
                message_th: `ไม่พบข้อมูล setting ${air_period_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (air_period_id) {
            DataUpdate.air_period_id = air_period_id;
        }
        if (name) {
            DataUpdate.name = name;
        }
        if (data) {
            DataUpdate.data = data;
        }
        if (dto.active) {
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.airperiodRepository
            .createQueryBuilder()
            .update('sd_air_period')
            .set(DataUpdate)
            .where('air_period_id=:air_period_id', { air_period_id: air_period_id })
            .execute();
        return 200;
    }
    async airperiod_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.airperiodRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.air_period_id)', 'cnt');
            }
            else {
                query.select([
                    'a.air_period_id as air_period_id',
                    'a.name as name',
                    'a.data as data',
                    'a.active as active',
                    'a.status as status',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.air_period_id) {
                query.andWhere('a.air_period_id =:air_period_id', { air_period_id: dto.air_period_id });
            }
            if (status) {
                query.andWhere('a.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_status_air_airmod2(air_period_id, dto) {
        try {
            const DataUpdate = {};
            const valdata = ['status', 'active', 'data'];
            for (const da of valdata) {
                if (dto[da] !== undefined && dto[da] !== '') {
                    DataUpdate[da] = dto[da];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_period_id '${air_period_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airperiodRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdate)
                .where('air_period_id=:air_period_id', { air_period_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_period_id '${air_period_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_period_id '${air_period_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_period_id '${air_period_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for schedule_id '${air_period_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_status_air_airmod(air_period_id, dto) {
        try {
            const DataUpdate = {};
            const datastatus = ['active', 'status'];
            for (const datatus of datastatus) {
                if (dto[datatus] !== undefined && dto[datatus] !== '') {
                    DataUpdate[datatus] = dto[datatus];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_period_id '${air_period_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airperiodRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdate)
                .where('air_period_id=:air_period_id', { air_period_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_period_id '${air_period_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_period_id '${air_period_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_period_id '${air_period_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_period_id '${air_period_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_empty_active_air_airmod(air_period_id, dto) {
        try {
            const DataUpdateUd = {};
            DataUpdateUd.active = 0;
            const updateResultRT = await this.airperiodRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdateUd)
                .where('air_period_id=:air_period_id', { air_period_id })
                .execute();
            if (updateResultRT.affected == 0) {
                this.logger.warn(`No devices found for air_period_id '${air_period_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_period_id '${air_period_id}'`);
            }
            const DataUpdateActive = {};
            DataUpdateActive.active = 1;
            const updateResult = await this.airperiodRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdateActive)
                .where('air_period_id=:air_period_id', { air_period_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_period_id '${air_period_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_period_id '${air_period_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_period_id '${air_period_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_period_id '${air_period_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async create_airsettingwarning(dto) {
        const result = await this.airsettingwarningRepository.save(this.airsettingwarningRepository.create(dto));
        return result;
    }
    async delete_airsettingwarning_id(air_setting_warning_id) {
        if (!air_setting_warning_id || isNaN(air_setting_warning_id) || air_setting_warning_id <= 0) {
            throw new common_1.UnprocessableEntityException('Invalid air_setting_warning_id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_setting_warning_id: ${air_setting_warning_id}`);
            const constsetting = await this.get_airsettingwarning(air_setting_warning_id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with air_setting_warning_id ${air_setting_warning_id} not found`);
            }
            await this.airsettingwarningRepository.delete(air_setting_warning_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airsettingwarning(dto) {
        try {
            var air_setting_warning_id = dto.air_setting_warning_id;
            var status = dto.status;
            const query = await this.airsettingwarningRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.air_setting_warning_id)', 'cnt');
            query.where('1=1');
            query.andWhere('l.air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
            if (status) {
                query.andWhere('l.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                if (status) {
                    var criteria = { status: status, air_setting_warning_id: air_setting_warning_id };
                }
                else {
                    var criteria = { air_setting_warning_id: air_setting_warning_id };
                }
                const deleteResult = await this.airsettingwarningRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async get_airsettingwarning(air_setting_warning_id) {
        try {
            const rs = await this.airsettingwarningRepository.findOne({
                where: {
                    air_setting_warning_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_sairsettingwarning(dto) {
        let air_setting_warning_id = dto.air_setting_warning_id;
        let name = dto.name;
        let data = dto.data;
        let status = dto.status;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airsettingwarningRepository.createQueryBuilder('a');
        query.select(['a.air_setting_warning_id AS air_setting_warning_id']);
        query.where('1=1');
        query.andWhere('a.air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${air_setting_warning_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${air_setting_warning_id}.`,
                message_th: `ไม่พบข้อมูล setting ${air_setting_warning_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.type_id) {
            DataUpdate.type_id = dto.type_id;
        }
        if (dto.device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        if (dto.type_id) {
            DataUpdate.type_id = dto.type_id;
        }
        if (dto.period_id) {
            DataUpdate.period_id = dto.period_id;
        }
        if (dto.event_name) {
            DataUpdate.event_name = dto.event_name;
        }
        DataUpdate.date = date_now;
        DataUpdate.time = time_now;
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.airsettingwarningRepository
            .createQueryBuilder()
            .update('sd_air_control')
            .set(DataUpdate)
            .where('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id })
            .execute();
        return 200;
    }
    async airsettingwarning_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.airsettingwarningRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.air_setting_warning_id)', 'cnt');
            }
            else {
                query.select([
                    'a.air_setting_warning_id as air_setting_warning_id',
                    'a.name as name',
                    'a.data as data',
                    'a.active as active',
                    'a.status as status',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.air_setting_warning_id) {
                query.andWhere('a.air_setting_warning_id =:air_setting_warning_id', { air_setting_warning_id: dto.air_setting_warning_id });
            }
            if (status) {
                query.andWhere('a.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_status_air_setting_warning(air_setting_warning_id, dto) {
        try {
            const DataUpdate = {};
            const valdata = ['status', 'active', 'data'];
            for (const da of valdata) {
                if (dto[da] !== undefined && dto[da] !== '') {
                    DataUpdate[da] = dto[da];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_setting_warning_id '${air_setting_warning_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_setting_warning')
                .set(DataUpdate)
                .where('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_setting_warning_id '${air_setting_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_setting_warning_id '${air_setting_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_setting_warning_id '${air_setting_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for schedule_id '${air_setting_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_status_setting_warning(air_setting_warning_id, dto) {
        try {
            const DataUpdate = {};
            const datastatus = ['active', 'status'];
            for (const datatus of datastatus) {
                if (dto[datatus] !== undefined && dto[datatus] !== '') {
                    DataUpdate[datatus] = dto[datatus];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_setting_warning_id '${air_setting_warning_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airsettingwarningRepository
                .createQueryBuilder()
                .update('sd_air_setting_warning')
                .set(DataUpdate)
                .where('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_setting_warning_id '${air_setting_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_setting_warning_id '${air_setting_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_setting_warning_id '${air_setting_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_setting_warning_id '${air_setting_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_empty_active_setting_warning(air_setting_warning_id, dto) {
        try {
            const DataUpdateUd = {};
            DataUpdateUd.active = 0;
            const updateResultRT = await this.airsettingwarningRepository
                .createQueryBuilder()
                .update('sd_air_setting_warning')
                .set(DataUpdateUd)
                .where('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id })
                .execute();
            if (updateResultRT.affected == 0) {
                this.logger.warn(`No devices found for air_setting_warning_id '${air_setting_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_setting_warning_id '${air_setting_warning_id}'`);
            }
            const DataUpdateActive = {};
            DataUpdateActive.active = 1;
            const updateResult = await this.airsettingwarningRepository
                .createQueryBuilder()
                .update('sd_air_setting_warning')
                .set(DataUpdateActive)
                .where('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_setting_warning_id '${air_setting_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_setting_warning_id '${air_setting_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_setting_warning_id '${air_setting_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_setting_warning_id '${air_setting_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async get_warning_name(name) {
        try {
            const rs = await this.airwarningRepository.findOne({
                where: {
                    name,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async create_air_warning(dto) {
        const result = await this.airwarningRepository.save(this.airwarningRepository.create(dto));
        return result;
    }
    async delete_air_warning_id(air_warning_id) {
        if (!air_warning_id || isNaN(air_warning_id) || air_warning_id <= 0) {
            throw new common_1.UnprocessableEntityException('Invalid air_warning_id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_warning_id: ${air_warning_id}`);
            const constsetting = await this.get_air_warning(air_warning_id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with air_warning_id ${air_warning_id} not found`);
            }
            await this.airwarningRepository.delete(air_warning_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_air_warning(dto) {
        try {
            var air_warning_id = dto.air_warning_id;
            var status = dto.status;
            const query = await this.airwarningRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.air_warning_id)', 'cnt');
            query.where('1=1');
            query.andWhere('l.air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
            if (status) {
                query.andWhere('l.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                if (status) {
                    var criteria = { status: status, air_warning_id: air_warning_id };
                }
                else {
                    var criteria = { air_warning_id: air_warning_id };
                }
                const deleteResult = await this.airwarningRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async get_air_warning(air_warning_id) {
        try {
            const rs = await this.airwarningRepository.findOne({
                where: {
                    air_warning_id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_air_warning(dto) {
        let air_warning_id = dto.air_warning_id;
        let name = dto.name;
        let data = dto.data;
        let status = dto.status;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airwarningRepository.createQueryBuilder('a');
        query.select(['a.air_warning_id AS air_warning_id']);
        query.where('1=1');
        query.andWhere('a.air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${air_warning_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${air_warning_id}.`,
                message_th: `ไม่พบข้อมูล setting ${air_warning_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
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
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.airwarningRepository
            .createQueryBuilder()
            .update('sd_air_warning')
            .set(DataUpdate)
            .where('air_warning_id=:air_warning_id', { air_warning_id: air_warning_id })
            .execute();
        return 200;
    }
    async airwarning_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.airwarningRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.air_warning_id)', 'cnt');
            }
            else {
                query.select([
                    'a.air_warning_id as air_warning_id',
                    'a.name as name',
                    'a.data as data',
                    'a.status as status',
                    'a.active as active',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.air_warning_id) {
                query.andWhere('a.air_warning_id =:air_warning_id', { air_warning_id: dto.air_warning_id });
            }
            if (status) {
                query.andWhere('a.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_status_air_warning(air_warning_id, dto) {
        try {
            const DataUpdate = {};
            const valdata = ['status', 'active', 'data'];
            for (const da of valdata) {
                if (dto[da] !== undefined && dto[da] !== '') {
                    DataUpdate[da] = dto[da];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_warning_id '${air_warning_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airmodRepository
                .createQueryBuilder()
                .update('sd_air_warning')
                .set(DataUpdate)
                .where('air_warning_id=:air_warning_id', { air_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_warning_id '${air_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_warning_id '${air_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_warning_id '${air_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for schedule_id '${air_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_status_airperiod(air_warning_id, dto) {
        try {
            const DataUpdate = {};
            const datastatus = ['active', 'status'];
            for (const datatus of datastatus) {
                if (dto[datatus] !== undefined && dto[datatus] !== '') {
                    DataUpdate[datatus] = dto[datatus];
                }
            }
            if (Object.keys(DataUpdate).length == 0) {
                this.logger.warn(`No valid fields to update for air_warning_id '${air_warning_id}'.`);
                throw new common_1.UnprocessableEntityException('No valid fields to update.');
            }
            const updateResult = await this.airwarningRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdate)
                .where('air_warning_id=:air_warning_id', { air_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_warning_id '${air_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_warning_id '${air_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_warning_id '${air_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_warning_id '${air_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async update_empty_active_airperiod(air_warning_id, dto) {
        try {
            const DataUpdateUd = {};
            DataUpdateUd.active = 0;
            const updateResultRT = await this.airwarningRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdateUd)
                .where('air_warning_id=:air_warning_id', { air_warning_id })
                .execute();
            if (updateResultRT.affected == 0) {
                this.logger.warn(`No devices found for air_warning_id '${air_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_warning_id '${air_warning_id}'`);
            }
            const DataUpdateActive = {};
            DataUpdateActive.active = 1;
            const updateResult = await this.airwarningRepository
                .createQueryBuilder()
                .update('sd_air_period')
                .set(DataUpdateActive)
                .where('air_warning_id=:air_warning_id', { air_warning_id })
                .execute();
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for air_warning_id '${air_warning_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with air_warning_id '${air_warning_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for air_warning_id '${air_warning_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for air_warning_id '${air_warning_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
    async aircontroldevicemap_all(dto) {
        try {
            const query = await this.aircontroldevicemapRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.id) {
                query.andWhere('al.id =:id', { id: dto.id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_aircontroldevicemap(dto) {
        const result = await this.aircontroldevicemapRepository.save(this.aircontroldevicemapRepository.create(dto));
        return result;
    }
    async get_by_id_aircontroldevicemap(id) {
        try {
            const rs = await this.aircontroldevicemapRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_aircontroldevicemap(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_mod_id: ${id}`);
            const constsetting = await this.get_by_id_aircontroldevicemap(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.aircontroldevicemapRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_aircontroldevicemap(dto) {
        try {
            var air_control_id = dto.air_control_id;
            var device_id = dto.device_id;
            const query = await this.aircontroldevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_mod_id)', 'cnt');
            query.where('1=1');
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = {};
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.aircontroldevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_aircontroldevicemap(dto) {
        var id = dto.id;
        var air_control_id = dto.air_control_id;
        var device_id = dto.device_id;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.aircontroldevicemapRepository.createQueryBuilder('a');
        query.select(['a.air_mod_id AS air_mod_id']);
        query.where('1=1');
        if (id) {
            query.andWhere('a.id=:id', { id: id });
        }
        if (air_control_id) {
            query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('a.device_id=:device_id', { device_id: device_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${id}.`,
                message_th: `ไม่พบข้อมูล setting ${id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.air_control_id) {
            DataUpdate.air_control_id = dto.air_control_id;
        }
        if (device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        const querys = await await this.aircontroldevicemapRepository;
        querys.createQueryBuilder();
        querys.update('sd_air_mod_device_map');
        querys.set(DataUpdate);
        query.where('1=1');
        if (id) {
            query.andWhere('id=:id', { id: id });
        }
        if (air_control_id) {
            query.andWhere('air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('device_id=:device_id', { device_id: device_id });
        }
        querys.execute();
        return 200;
    }
    async create_aircontrol_map(dto) {
        const air_mod_id = Number(dto.air_mod_id) || 1;
        const air_control_id = Number(dto.air_control_id) || 1;
        const device_id = Number(dto.device_id) || 1;
        const result = await this.aircontrolRepository.save(this.aircontrolRepository.create(dto));
        return result;
    }
    async delete_alarm_device_event_map(dto) {
        try {
            const air_mod_id = Number(dto.air_mod_id) || 1;
            const air_control_id = Number(dto.air_control_id) || 1;
            const device_id = Number(dto.device_id) || 1;
            const query = await this.aircontrolRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_mod_id)', 'cnt');
            query.where('1=1');
            if (air_mod_id) {
                query.andWhere('a.air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                if (air_mod_id) {
                    criteria.air_mod_id = air_mod_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.aircontrolRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_air_control_device_map(dto) {
        const air_mod_id = Number(dto.air_mod_id) || 1;
        const air_control_id = Number(dto.air_control_id) || 1;
        const device_id = Number(dto.device_id) || 1;
        const result = await this.aircontrolRepository.save(this.aircontrolRepository.create(dto));
        return result;
    }
    async delete_air_control_device_map(dto) {
        try {
            const air_mod_id = Number(dto.air_mod_id) || 1;
            const air_control_id = Number(dto.air_control_id) || 1;
            const device_id = Number(dto.device_id) || 1;
            const query = await this.aircontrolRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_mod_id)', 'cnt');
            query.where('1=1');
            if (air_mod_id) {
                query.andWhere('a.air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                if (air_mod_id) {
                    criteria.air_mod_id = air_mod_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.aircontrolRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async airmoddevicemap_all(dto) {
        try {
            const query = await this.airmoddevicemapRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.id) {
                query.andWhere('al.id =:id', { id: dto.id });
            }
            if (dto.air_mod_id) {
                query.andWhere('al.air_mod_id =:air_mod_id', { air_mod_id: dto.air_mod_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_airmoddevicemap(dto) {
        const result = await this.airmoddevicemapRepository.save(this.airmoddevicemapRepository.create(dto));
        return result;
    }
    async get_by_id_airmoddevicemap(id) {
        try {
            const rs = await this.airmoddevicemapRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_airmoddevicemap(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_mod_id: ${id}`);
            const constsetting = await this.get_by_id_airmoddevicemap(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.airmoddevicemapRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airmoddevicemap(dto) {
        try {
            var id = dto.id;
            var air_mod_id = dto.air_mod_id;
            var air_control_id = dto.air_control_id;
            var device_id = dto.device_id;
            const query = await this.airmoddevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_mod_id)', 'cnt');
            query.where('1=1');
            if (air_mod_id) {
                query.andWhere('a.air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = {};
                if (id) {
                    criteria.id = id;
                }
                if (air_mod_id) {
                    criteria.air_mod_id = air_mod_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airmoddevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_airmoddevicemap(dto) {
        var id = dto.id;
        var air_mod_id = dto.air_mod_id;
        var air_control_id = dto.air_control_id;
        var device_id = dto.device_id;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airmoddevicemapRepository.createQueryBuilder('a');
        query.select(['a.air_mod_id AS air_mod_id']);
        query.where('1=1');
        if (id) {
            query.andWhere('a.id=:id', { id: id });
        }
        if (air_mod_id) {
            query.andWhere('a.air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
        }
        if (air_control_id) {
            query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('a.device_id=:device_id', { device_id: device_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${id}.`,
                message_th: `ไม่พบข้อมูล setting ${id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.air_mod_id) {
            DataUpdate.air_mod_id = dto.air_mod_id;
        }
        if (dto.air_control_id) {
            DataUpdate.air_control_id = dto.air_control_id;
        }
        if (device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        const querys = await await this.airmoddevicemapRepository;
        querys.createQueryBuilder();
        querys.update('sd_air_mod_device_map');
        querys.set(DataUpdate);
        query.where('1=1');
        if (id) {
            query.andWhere('id=:id', { id: id });
        }
        if (air_mod_id) {
            query.andWhere('air_mod_id=:air_mod_id', { air_mod_id: air_mod_id });
        }
        if (air_control_id) {
            query.andWhere('air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('device_id=:device_id', { device_id: device_id });
        }
        querys.execute();
        return 200;
    }
    async airperioddevicemap_all(dto) {
        try {
            const query = await this.airperioddevicemapRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.id) {
                query.andWhere('al.id =:id', { id: dto.id });
            }
            if (dto.air_setting_warning_id) {
                query.andWhere('al.air_setting_warning_id =:air_setting_warning_id', { air_setting_warning_id: dto.air_setting_warning_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_airperioddevicemap(dto) {
        const result = await this.airperioddevicemapRepository.save(this.airperioddevicemapRepository.create(dto));
        return result;
    }
    async get_by_id_airperioddevicemap(id) {
        try {
            const rs = await this.airperioddevicemapRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_airperioddevicemap(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_period_id: ${id}`);
            const constsetting = await this.get_by_id_airperioddevicemap(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.airperioddevicemapRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airperioddevicemap(dto) {
        try {
            var id = dto.id;
            var air_period_id = dto.air_period_id;
            var air_control_id = dto.air_control_id;
            var device_id = dto.device_id;
            const query = await this.airperioddevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_period_id)', 'cnt');
            query.where('1=1');
            if (air_period_id) {
                query.andWhere('a.air_period_id=:air_period_id', { air_period_id: air_period_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = {};
                if (id) {
                    criteria.id = id;
                }
                if (air_period_id) {
                    criteria.air_period_id = air_period_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airperioddevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_airperioddevicemap(dto) {
        var id = dto.id;
        var air_period_id = dto.air_period_id;
        var air_control_id = dto.air_control_id;
        var device_id = dto.device_id;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airperioddevicemapRepository.createQueryBuilder('a');
        query.select(['a.air_period_id AS air_period_id']);
        query.where('1=1');
        if (id) {
            query.andWhere('a.id=:id', { id: id });
        }
        if (air_period_id) {
            query.andWhere('a.air_period_id=:air_period_id', { air_period_id: air_period_id });
        }
        if (air_control_id) {
            query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('a.device_id=:device_id', { device_id: device_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${id}.`,
                message_th: `ไม่พบข้อมูล setting ${id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.air_period_id) {
            DataUpdate.air_period_id = dto.air_period_id;
        }
        if (dto.air_control_id) {
            DataUpdate.air_control_id = dto.air_control_id;
        }
        if (device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        const querys = await await this.airperioddevicemapRepository;
        querys.createQueryBuilder();
        querys.update('sd_air_period_device_map');
        querys.set(DataUpdate);
        query.where('1=1');
        if (id) {
            query.andWhere('id=:id', { id: id });
        }
        if (air_period_id) {
            query.andWhere('air_period_id=:air_period_id', { air_period_id: air_period_id });
        }
        if (air_control_id) {
            query.andWhere('air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('device_id=:device_id', { device_id: device_id });
        }
        querys.execute();
        return 200;
    }
    async create_air_period_device_map(dto) {
        const air_period_id = Number(dto.air_period_id) || 1;
        const air_control_id = Number(dto.air_control_id) || 1;
        const device_id = Number(dto.device_id) || 1;
        const result = await this.airperioddevicemapRepository.save(this.airperioddevicemapRepository.create(dto));
        return result;
    }
    async delete_air_period_device_map(dto) {
        try {
            const air_period_id = Number(dto.air_period_id) || 1;
            const air_control_id = Number(dto.air_control_id) || 1;
            const device_id = Number(dto.device_id) || 1;
            const query = await this.airperioddevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_period_id)', 'cnt');
            query.where('1=1');
            if (air_period_id) {
                query.andWhere('a.air_period_id=:air_period_id', { air_period_id: air_period_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                if (air_period_id) {
                    criteria.air_period_id = air_period_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airperioddevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async airsettingwarningdevicemap_all(dto) {
        try {
            const query = await this.airsettingwarningdevicemapRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.id) {
                query.andWhere('al.id =:id', { id: dto.id });
            }
            if (dto.air_period_id) {
                query.andWhere('al.air_period_id =:air_period_id', { air_period_id: dto.air_period_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_airsettingwarningdevicemap(dto) {
        const result = await this.airsettingwarningdevicemapRepository.save(this.airsettingwarningdevicemapRepository.create(dto));
        return result;
    }
    async get_by_id_airsettingwarningdevicemap(id) {
        try {
            const rs = await this.airsettingwarningdevicemapRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_air_setting_warningdevice_map(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_setting_warning_id: ${id}`);
            const constsetting = await this.get_by_id_airsettingwarningdevicemap(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.airsettingwarningdevicemapRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airsettingwarningdevicemap(dto) {
        try {
            var id = dto.id;
            var air_setting_warning_id = dto.air_setting_warning_id;
            var air_control_id = dto.air_control_id;
            var device_id = dto.device_id;
            const query = await this.airsettingwarningdevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_setting_warning_id)', 'cnt');
            query.where('1=1');
            if (air_setting_warning_id) {
                query.andWhere('a.air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = {};
                if (id) {
                    criteria.id = id;
                }
                if (air_setting_warning_id) {
                    criteria.air_setting_warning_id = air_setting_warning_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airsettingwarningdevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_airsettingwarningdevicemap(dto) {
        var id = dto.id;
        var air_setting_warning_id = dto.air_setting_warning_id;
        var air_control_id = dto.air_control_id;
        var device_id = dto.device_id;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airsettingwarningdevicemapRepository.createQueryBuilder('a');
        query.select(['a.air_setting_warning_id AS air_setting_warning_id']);
        query.where('1=1');
        if (id) {
            query.andWhere('a.id=:id', { id: id });
        }
        if (air_setting_warning_id) {
            query.andWhere('a.air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
        }
        if (air_control_id) {
            query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('a.device_id=:device_id', { device_id: device_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${id}.`,
                message_th: `ไม่พบข้อมูล setting ${id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.air_setting_warning_id) {
            DataUpdate.air_setting_warning_id = dto.air_setting_warning_id;
        }
        if (dto.air_control_id) {
            DataUpdate.air_control_id = dto.air_control_id;
        }
        if (device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        const querys = await await this.airsettingwarningdevicemapRepository;
        querys.createQueryBuilder();
        querys.update('sd_air_setting_warning_device_map');
        querys.set(DataUpdate);
        query.where('1=1');
        if (id) {
            query.andWhere('id=:id', { id: id });
        }
        if (air_setting_warning_id) {
            query.andWhere('air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
        }
        if (air_control_id) {
            query.andWhere('air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('device_id=:device_id', { device_id: device_id });
        }
        querys.execute();
        return 200;
    }
    async create_air_setting_warning_device_map(dto) {
        const air_setting_warning_id = Number(dto.air_setting_warning_id) || 1;
        const air_control_id = Number(dto.air_control_id) || 1;
        const device_id = Number(dto.device_id) || 1;
        const result = await this.airsettingwarningdevicemapRepository.save(this.airsettingwarningdevicemapRepository.create(dto));
        return result;
    }
    async delete_air_setting_warning_device_map(dto) {
        try {
            const air_setting_warning_id = Number(dto.air_setting_warning_id) || 1;
            const air_control_id = Number(dto.air_control_id) || 1;
            const device_id = Number(dto.device_id) || 1;
            const query = await this.airsettingwarningdevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_setting_warning_id)', 'cnt');
            query.where('1=1');
            if (air_setting_warning_id) {
                query.andWhere('a.air_setting_warning_id=:air_setting_warning_id', { air_setting_warning_id: air_setting_warning_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                if (air_setting_warning_id) {
                    criteria.air_setting_warning_id = air_setting_warning_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airsettingwarningdevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async airwarningdevicemap_all(dto) {
        try {
            const query = await this.airwarningdevicemapRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.id) {
                query.andWhere('al.id =:id', { id: dto.id });
            }
            if (dto.air_warning_id) {
                query.andWhere('al.air_warning_id =:air_warning_id', { air_warning_id: dto.air_warning_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_airwarningdevicemap(dto) {
        const result = await this.airwarningdevicemapRepository.save(this.airwarningdevicemapRepository.create(dto));
        return result;
    }
    async get_by_id_airwarningdevicemap(id) {
        try {
            const rs = await this.airwarningdevicemapRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_airwarningdevicemap(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_warning_id: ${id}`);
            const constsetting = await this.get_by_id_airwarningdevicemap(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.airwarningdevicemapRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async delete_airwarningdevicemap(dto) {
        try {
            var id = dto.id;
            var air_warning_id = dto.air_warning_id;
            var air_control_id = dto.air_control_id;
            var device_id = dto.device_id;
            const query = await this.airwarningdevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_warning_id)', 'cnt');
            query.where('1=1');
            if (air_warning_id) {
                query.andWhere('a.air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                var criteria = {};
                if (id) {
                    criteria.id = id;
                }
                if (air_warning_id) {
                    criteria.air_warning_id = air_warning_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airwarningdevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_airwarningdevicemap(dto) {
        var id = dto.id;
        var air_warning_id = dto.air_warning_id;
        var air_control_id = dto.air_control_id;
        var device_id = dto.device_id;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.airwarningdevicemapRepository.createQueryBuilder('a');
        query.select(['a.air_warning_id AS air_warning_id']);
        query.where('1=1');
        if (id) {
            query.andWhere('a.id=:id', { id: id });
        }
        if (air_warning_id) {
            query.andWhere('a.air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
        }
        if (air_control_id) {
            query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('a.device_id=:device_id', { device_id: device_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with id ${id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${id}.`,
                message_th: `ไม่พบข้อมูล setting ${id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.air_warning_id) {
            DataUpdate.air_warning_id = dto.air_warning_id;
        }
        if (dto.air_control_id) {
            DataUpdate.air_control_id = dto.air_control_id;
        }
        if (device_id) {
            DataUpdate.device_id = dto.device_id;
        }
        const querys = await await this.airwarningdevicemapRepository;
        querys.createQueryBuilder();
        querys.update('sd_air_warning_device_map');
        querys.set(DataUpdate);
        query.where('1=1');
        if (id) {
            query.andWhere('id=:id', { id: id });
        }
        if (air_warning_id) {
            query.andWhere('air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
        }
        if (air_control_id) {
            query.andWhere('air_control_id=:air_control_id', { air_control_id: air_control_id });
        }
        if (device_id) {
            query.andWhere('device_id=:device_id', { device_id: device_id });
        }
        querys.execute();
        return 200;
    }
    async create_air_warning_device_map(dto) {
        const air_warning_id = Number(dto.air_warning_id) || 1;
        const air_control_id = Number(dto.air_control_id) || 1;
        const device_id = Number(dto.device_id) || 1;
        const result = await this.airwarningdevicemapRepository.save(this.airwarningdevicemapRepository.create(dto));
        return result;
    }
    async delete_air_warning_device_map(dto) {
        try {
            const air_warning_id = Number(dto.air_warning_id) || 1;
            const air_control_id = Number(dto.air_control_id) || 1;
            const device_id = Number(dto.device_id) || 1;
            const query = await this.airwarningdevicemapRepository.createQueryBuilder('a');
            var countRs = await query.select('COUNT(DISTINCT a.air_warning_id)', 'cnt');
            query.where('1=1');
            if (air_warning_id) {
                query.andWhere('a.air_warning_id=:air_warning_id', { air_warning_id: air_warning_id });
            }
            if (air_control_id) {
                query.andWhere('a.air_control_id=:air_control_id', { air_control_id: air_control_id });
            }
            if (device_id) {
                query.andWhere('a.device_id=:device_id', { device_id: device_id });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                if (air_warning_id) {
                    criteria.air_warning_id = air_warning_id;
                }
                if (air_control_id) {
                    criteria.air_control_id = air_control_id;
                }
                if (device_id) {
                    criteria.device_id = device_id;
                }
                const deleteResult = await this.airwarningdevicemapRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async aircontrollog_all(dto) {
        try {
            const query = await this.aircontrollogRepository.createQueryBuilder('al');
            query.select(['al.*',]);
            query.where('1=1');
            if (dto.alarm_action_id) {
                query.andWhere('al.alarm_action_id =:alarm_action_id', { alarm_action_id: dto.alarm_action_id });
            }
            if (dto.type_id) {
                query.andWhere('al.type_id =:type_id', { type_id: dto.type_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_aircontrollog(dto) {
        const result = await this.aircontrollogRepository.save(this.aircontrollogRepository.create(dto));
        return result;
    }
    async get_by_id_aircontrollog(id) {
        try {
            const rs = await this.aircontrollogRepository.findOne({
                where: {
                    id,
                },
            });
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async delete_by_id_aircontrollog(id) {
        if (!id || isNaN(id)) {
            throw new common_1.UnprocessableEntityException('Invalid id');
        }
        try {
            this.logger.log(`Deleting sd_iot_setting with air_warning_id: ${id}`);
            const constsetting = await this.get_by_id_aircontrollog(id);
            if (!constsetting) {
                throw new common_1.NotFoundException(`sd_iot_setting with id ${id} not found`);
            }
            await this.aircontrollogRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting sd_iot_setting = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async air_control_log_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.aircontrollogRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.id)', 'cnt');
            }
            else {
                query.select([
                    'a.id as id',
                    'a.alarm_action_id as alarm_action_id',
                    'a.air_control_id as air_control_id',
                    'a.device_id as device_id',
                    'd.device_name as device_name',
                    'a.type_id as type_id',
                    'a.temperature as temperature',
                    'a.warning as warning',
                    'a.recovery as recovery',
                    'a.period as period',
                    'a.percent as percent',
                    'a.firealarm as firealarm',
                    'a.humidityalarm as humidityalarm',
                    'a.air2_alarm as air2_alarm',
                    'a.air1_alarm as air1_alarm',
                    'a.temperaturealarm as temperaturealarm',
                    'a.mode as mode',
                    'a.state_air1 as state_air1',
                    'a.state_air2 as state_air2',
                    'a.temperaturealarmoff as temperaturealarmoff',
                    'a.ups_alarm as ups_alarm',
                    'a.ups2_alarm as ups2_alarm',
                    'a.hssdalarm as hssdalarm',
                    'a.waterleakalarm as waterleakalarm',
                    'a.date as date',
                    'a.time as time',
                    'a.data as data',
                    'a.status as status',
                    'a.createddate as createddate',
                    'a.updateddate as updateddate',
                ]);
            }
            query.leftJoin("sd_iot_device", "d", "d.device_id= a.device_id");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.data like :data', { data: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.id) {
                query.andWhere('a.id =:id', { id: dto.id });
            }
            if (dto.alarm_action_id) {
                query.andWhere('a.alarm_action_id =:alarm_action_id', { alarm_action_id: dto.alarm_action_id });
            }
            if (dto.type_id) {
                query.andWhere('a.type_id =:type_id', { type_id: dto.type_id });
            }
            if (dto.air_control_id) {
                query.andWhere('al.air_control_id =:air_control_id', { air_control_id: dto.air_control_id });
            }
            if (dto.device_id) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            if (dto.temperature) {
                query.andWhere('al.temperature =:temperature', { temperature: dto.temperature });
            }
            if (dto.recovery) {
                query.andWhere('al.recovery =:recovery', { recovery: dto.recovery });
            }
            if (dto.period) {
                query.andWhere('al.period =:period', { period: dto.period });
            }
            if (dto.warning) {
                query.andWhere('al.warning =:warning', { warning: dto.warning });
            }
            if (dto.percent) {
                query.andWhere('al.percent =:percent', { percent: dto.percent });
            }
            if (dto.firealarm) {
                query.andWhere('al.firealarm =:firealarm', { firealarm: dto.firealarm });
            }
            if (dto.humidityalarm) {
                query.andWhere('al.humidityalarm =:humidityalarm', { humidityalarm: dto.humidityalarm });
            }
            if (dto.air2_alarm) {
                query.andWhere('al.air2_alarm =:air2_alarm', { air2_alarm: dto.air2_alarm });
            }
            if (dto.air1_alarm) {
                query.andWhere('al.air1_alarm =:air1_alarm', { air1_alarm: dto.air1_alarm });
            }
            if (dto.temperaturealarm) {
                query.andWhere('al.temperaturealarm =:temperaturealarm', { temperaturealarm: dto.temperaturealarm });
            }
            if (dto.mode) {
                query.andWhere('al.mode =:mode', { mode: dto.mode });
            }
            if (dto.state_air1) {
                query.andWhere('al.state_air1 =:state_air1', { state_air1: dto.state_air1 });
            }
            if (dto.state_air2) {
                query.andWhere('al.state_air2 =:state_air2', { state_air2: dto.state_air2 });
            }
            if (dto.temperaturealarmoff) {
                query.andWhere('al.temperaturealarmoff =:temperaturealarmoff', { temperaturealarmoff: dto.temperaturealarmoff });
            }
            if (dto.ups_alarm) {
                query.andWhere('al.ups_alarm =:ups_alarm', { ups_alarm: dto.ups_alarm });
            }
            if (dto.ups2_alarm) {
                query.andWhere('al.ups2_alarm =:ups2_alarm', { ups2_alarm: dto.ups2_alarm });
            }
            if (dto.hssdalarm) {
                query.andWhere('al.hssdalarm =:hssdalarm', { hssdalarm: dto.hssdalarm });
            }
            if (dto.waterleakalarm) {
                query.andWhere('al.waterleakalarm =:waterleakalarm', { waterleakalarm: dto.waterleakalarm });
            }
            if (dto.percent) {
                query.andWhere('al.device_id =:device_id', { device_id: dto.device_id });
            }
            if (dto.date) {
                query.andWhere('a.date=:date', { date: dto.date });
            }
            if (dto.time) {
                query.andWhere('a.time=:time', { time: dto.time });
            }
            if (dto.status) {
                query.andWhere('a.status=:status', { status: dto.status });
            }
            if (dto.start && dto.end) {
                query.andWhere('a.createddate BETWEEN :startDate AND :endDate', {
                    startDate: dto.start,
                    endDate: dto.end,
                });
            }
            else if (dto.start) {
                query.andWhere('a.createddate >= :startDate', { startDate: dto.start });
            }
            else if (dto.end) {
                query.andWhere('a.createddate <= :endDate', { endDate: dto.end });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'DESC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_mqttlogRepository(dto) {
        const result = await this.mqttlogRepository.save(this.mqttlogRepository.create(dto));
        return result;
    }
    async mqttlog_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 1000;
            var isCount = dto.isCount || 0;
            const query = await this.mqttlogRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.id)', 'cnt');
            }
            else {
                query.select(['a.*']);
            }
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.device_name) {
                query.andWhere('a.device_name like :device_name', { device_name: dto.device_name ? `%${dto.device_name}%` : '%', });
            }
            if (dto.message) {
                query.andWhere('a.msg like :msg', { msg: dto.message ? `%${dto.message}%` : '%', });
            }
            if (dto.statusmqtt) {
                query.andWhere('a.statusmqtt =:statusmqtt', { statusmqtt: dto.statusmqtt });
            }
            if (dto.device_id) {
                query.andWhere('a.device_id =:device_id', { device_id: dto.device_id });
            }
            if (dto.type_id) {
                query.andWhere('a.type_id =:type_id', { type_id: dto.type_id });
            }
            if (dto.date) {
                query.andWhere('a.date=:date', { date: dto.date });
            }
            if (dto.time) {
                query.andWhere('a.time=:time', { time: dto.time });
            }
            if (dto.status) {
                query.andWhere('a.status=:status', { status: dto.status });
            }
            if (dto.start && dto.end) {
                query.andWhere('a.createddate BETWEEN :startDate AND :endDate', {
                    startDate: dto.start,
                    endDate: dto.end,
                });
            }
            else if (dto.start) {
                query.andWhere('a.createddate >= :startDate', { startDate: dto.start });
            }
            else if (dto.end) {
                query.andWhere('a.createddate <= :endDate', { endDate: dto.end });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                query.orderBy(`a.createddate`, 'DESC');
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_host(dto) {
        const result = await this.HostRepository.save(this.HostRepository.create(dto));
        return result;
    }
    async check_data_host(dto) {
        var idhost = dto.idhost;
        var host_id = dto.host_id;
        var port = dto.port;
        var username = dto.username;
        var host_name = dto.host_name;
        var password = dto.password;
        try {
            const query = await this.HostRepository.createQueryBuilder('h');
            query.select(['h.*']);
            query.where('1=1');
            if (dto.host_name) {
                query.andWhere('h.host_name=:host_name', { host_name: dto.host_name });
            }
            if (dto.status) {
                query.andWhere('h.status=:status', { status: dto.status });
            }
            if (host_id) {
                query.andWhere('h.host_id=:host_id', { host_id: host_id });
            }
            if (idhost) {
                query.andWhere('h.idhost=:idhost', { idhost: idhost });
            }
            if (dto.start && dto.end) {
                query.andWhere('h.createddate BETWEEN :startDate AND :endDate', {
                    startDate: dto.start,
                    endDate: dto.end,
                });
            }
            else if (dto.start) {
                query.andWhere('h.createddate >= :startDate', { startDate: dto.start });
            }
            else if (dto.end) {
                query.andWhere('h.createddate <= :endDate', { endDate: dto.end });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            return await query.getRawMany();
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async get_host_id(host_id) {
        try {
            const rs = await this.HostRepository.findOne({
                where: {
                    host_id,
                },
            });
            console.log('get rs=>');
            console.info(rs);
            return rs;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async update_host(dto) {
        var host_id = dto.host_id;
        var host_name = dto.host_name;
        var port = dto.port;
        var username = dto.username;
        var password = dto.password;
        var status = dto.status;
        var idhost = dto.idhost || 1;
        var today_name = format.getCurrentDayname();
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        const DataUpdate = {};
        const query = await this.HostRepository.createQueryBuilder('a');
        query.select(['h.host_id AS host_id']);
        query.where('1=1');
        if (host_id) {
            query.andWhere('h.host_id=:host_id', { host_id: host_id });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with host_id ${host_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found setting ${host_id}.`,
                message_th: `ไม่พบข้อมูล setting ${host_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (host_name) {
            DataUpdate.host_name = host_name;
        }
        if (port) {
            DataUpdate.port = port;
        }
        if (username) {
            DataUpdate.username = username;
        }
        if (password) {
            DataUpdate.password = password;
        }
        if (status) {
            DataUpdate.status = status;
        }
        if (idhost) {
            DataUpdate.idhost = idhost;
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        const querys = await await this.HostRepository;
        querys.createQueryBuilder();
        querys.update('sd_iot_host');
        querys.set(DataUpdate);
        query.where('1=1');
        query.andWhere('host_id=:host_id', { host_id: host_id });
        if (idhost) {
            query.andWhere('idhost=:idhost', { idhost: idhost });
        }
        querys.execute();
        return 200;
    }
    async delete_host(dto) {
        try {
            const host_id = dto.host_id;
            const query = await this.HostRepository.createQueryBuilder('h');
            var countRs = await query.select('COUNT(DISTINCT h.host_id)', 'cnt');
            query.where('1=1');
            query.andWhere('h.host_id=:host_id', { host_id: host_id });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            if (count >= 1) {
                const criteria = {};
                criteria.host_id = host_id;
                const deleteResult = await this.HostRepository.delete(criteria);
                if (deleteResult.affected && deleteResult.affected > 0) {
                }
                else {
                }
                return deleteResult;
            }
            else {
                return null;
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async host_paginate(dto) {
        try {
            var keyword = dto.keyword || '';
            var idhost = dto.idhost;
            var host_id = dto.host_id;
            var port = dto.port;
            var username = dto.username;
            var password = dto.password;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.HostRepository.createQueryBuilder('h');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT h.host_id)', 'cnt');
            }
            else {
                query.select(['h.*']);
            }
            query.where('1=1');
            if (keyword) {
                query.andWhere('h.data host_name :host_name', { host_name: keyword ? `%${keyword}%` : '%', });
            }
            if (dto.status) {
                query.andWhere('h.status=:status', { status: dto.status });
            }
            if (host_id) {
                query.andWhere('h.host_id=:host_id', { host_id: host_id });
            }
            if (idhost) {
                query.andWhere('h.idhost=:idhost', { idhost: idhost });
            }
            if (dto.start && dto.end) {
                query.andWhere('h.createddate BETWEEN :startDate AND :endDate', {
                    startDate: dto.start,
                    endDate: dto.end,
                });
            }
            else if (dto.start) {
                query.andWhere('h.createddate >= :startDate', { startDate: dto.start });
            }
            else if (dto.end) {
                query.andWhere('h.createddate <= :endDate', { endDate: dto.end });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`h.idhost`, 'ASC');
                }
                else {
                    query.orderBy(`h.idhost`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async update_host_status(host_id, status) {
        console.log(`Updating devices with bucket '${host_id}' to status ${status}`);
        try {
            if (status == 1) {
                var DataUpdate = {};
                var DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
                var updateddate = moment(new Date(), DATE_TIME_FORMAT);
                var statusset = '0';
                DataUpdate.status = statusset;
                DataUpdate.updateddate = Date();
                console.log('update DataUpdate');
                console.info(DataUpdate);
                await this.HostRepository
                    .createQueryBuilder()
                    .update('sd_iot_email')
                    .set(DataUpdate)
                    .execute();
            }
            var updateResult = await this.HostRepository.update({ host_id: host_id }, { status: status });
            if (updateResult.affected == 0) {
                this.logger.warn(`No devices found for mqtt_id '${host_id}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with bucket '${host_id}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for host_id '${host_id}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for mqtt_id '${host_id}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating status.');
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IotService.prototype, "handleBackup", null);
IotService = IotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(aircontrol_entity_1.aircontrol)),
    __param(3, (0, typeorm_1.InjectRepository)(airmod_entity_1.airmod)),
    __param(4, (0, typeorm_1.InjectRepository)(airperiod_entity_1.airperiod)),
    __param(5, (0, typeorm_1.InjectRepository)(airsettingwarning_entity_1.airsettingwarning)),
    __param(6, (0, typeorm_1.InjectRepository)(airwarning_entity_1.airwarning)),
    __param(7, (0, typeorm_1.InjectRepository)(aircontroldevicemap_entity_1.aircontroldevicemap)),
    __param(8, (0, typeorm_1.InjectRepository)(airmoddevicemap_entity_1.airmoddevicemap)),
    __param(9, (0, typeorm_1.InjectRepository)(airperioddevicemap_entity_1.airperioddevicemap)),
    __param(10, (0, typeorm_1.InjectRepository)(airsettingwarningdevicemap_entity_1.airsettingwarningdevicemap)),
    __param(11, (0, typeorm_1.InjectRepository)(airwarningdevicemap_entity_1.airwarningdevicemap)),
    __param(12, (0, typeorm_1.InjectRepository)(aircontrollog_entity_1.aircontrollog)),
    __param(13, (0, typeorm_1.InjectRepository)(mqttlog_entity_1.mqttlog)),
    __param(14, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(15, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(16, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(17, (0, typeorm_1.InjectRepository)(sensor_entity_1.Sensor)),
    __param(18, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(19, (0, typeorm_1.InjectRepository)(mqtt_entity_1.Mqtt)),
    __param(20, (0, typeorm_1.InjectRepository)(api_entity_1.Api)),
    __param(21, (0, typeorm_1.InjectRepository)(devicetype_entity_1.DeviceType)),
    __param(22, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(23, (0, typeorm_1.InjectRepository)(email_entity_1.Email)),
    __param(24, (0, typeorm_1.InjectRepository)(host_entity_1.Host)),
    __param(25, (0, typeorm_1.InjectRepository)(influxdb_entity_1.Influxdb)),
    __param(26, (0, typeorm_1.InjectRepository)(line_entity_1.Line)),
    __param(27, (0, typeorm_1.InjectRepository)(nodered_entity_1.Nodered)),
    __param(28, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(29, (0, typeorm_1.InjectRepository)(sms_entity_1.Sms)),
    __param(30, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(31, (0, typeorm_1.InjectRepository)(scheduledevice_entity_1.scheduleDevice)),
    __param(32, (0, typeorm_1.InjectRepository)(deviceaction_entity_1.Deviceaction)),
    __param(33, (0, typeorm_1.InjectRepository)(deviceactionlog_entity_1.Deviceactionlog)),
    __param(34, (0, typeorm_1.InjectRepository)(deviceactionuser_entity_1.Deviceactionuser)),
    __param(35, (0, typeorm_1.InjectRepository)(devivicealarmaction_entity_1.Devicealarmaction)),
    __param(36, (0, typeorm_1.InjectRepository)(telegram_entity_1.Telegram)),
    __param(37, (0, typeorm_1.InjectRepository)(alarmdevice_entity_1.alarmDevice)),
    __param(38, (0, typeorm_1.InjectRepository)(alarmdeviceevent_entity_1.alarmDeviceEvent)),
    __param(39, (0, typeorm_1.InjectRepository)(scheduleprocesslog_entity_1.scheduleprocesslog)),
    __param(40, (0, typeorm_1.InjectRepository)(alarmprocesslog_entity_1.alarmprocesslog)),
    __param(41, (0, typeorm_1.InjectRepository)(alarmprocesslogtemp_entity_1.alarmprocesslogtemp)),
    __param(42, (0, typeorm_1.InjectRepository)(alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt)),
    __param(43, (0, typeorm_1.InjectRepository)(alarmprocesslogemail_entity_1.alarmprocesslogemail)),
    __param(44, (0, typeorm_1.InjectRepository)(alarmprocesslogline_entity_1.alarmprocesslogline)),
    __param(45, (0, typeorm_1.InjectRepository)(alarmprocesslogsms_entity_1.alarmprocesslogsms)),
    __param(46, (0, typeorm_1.InjectRepository)(alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram)),
    __param(47, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(48, (0, typeorm_1.InjectRepository)(sduserrole_entity_1.SdUserRole)),
    __param(49, (0, typeorm_1.InjectRepository)(rolesaccess_entity_1.SdUserRolesAccess)),
    __param(50, (0, typeorm_1.InjectRepository)(userrolepermission_entity_1.UserRolePermission)),
    __param(51, (0, typeorm_1.InjectRepository)(mqtthost_entity_1.mqtthost)),
    __metadata("design:paramtypes", [typeorm_2.EntityManager,
        typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IotService);
exports.IotService = IotService;
//# sourceMappingURL=iot.service.js.map