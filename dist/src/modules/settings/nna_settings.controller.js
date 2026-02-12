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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
var moment = require('moment');
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("../users/users.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const jwt_1 = require("@nestjs/jwt");
const format = __importStar(require("../../helpers/format.helper"));
const { passwordStrength } = require('check-password-strength');
const settings_service_1 = require("./settings.service");
const create_setting_dto_1 = require("./dto/create-setting.dto");
const create_location_dto_1 = require("./dto/create-location.dto");
const create_type_dto_1 = require("./dto/create_type.dto");
const create_sensor_dto_1 = require("./dto/create_sensor.dto");
const create_group_dto_1 = require("./dto/create_group.dto");
const create_mqtt_dto_1 = require("./dto/create_mqtt.dto");
const create_api_dto_1 = require("./dto/create_api.dto");
const create_device_dto_1 = require("./dto/create_device.dto");
const create_email_dto_1 = require("./dto/create_email.dto");
const create_host_dto_1 = require("./dto/create_host.dto");
const create_nodered_dto_1 = require("./dto/create_nodered.dto");
const create_schedule_dto_1 = require("./dto/create_schedule.dto");
const create_token_dto_1 = require("./dto/create_token.dto");
const create_scheduledevice_dto_1 = require("./dto/create_scheduledevice.dto");
const create_device_action_user_dto_1 = require("./dto/create_device_action_user.dto");
const create_device_alarmaction_dto_1 = require("./dto/create_device_alarmaction.dto");
const create_telegram_dto_1 = require("./dto/create-telegram.dto");
const updatemqttstatus_dto_1 = require("./dto/updatemqttstatus.dto");
var Cache = new redis_cache_1.CacheDataOne();
var md5 = require('md5');
require("dotenv/config");
var tzString = process.env.tzString;
var SEND_EMAIL = process.env.SEND_EMAIL;
require('dotenv').config();
const mqtt_service_1 = require("../mqtt/mqtt.service");
let SettingsController = class SettingsController {
    constructor(mqttService, settingsService, UsersService, authService, jwtService) {
        this.mqttService = mqttService;
        this.settingsService = settingsService;
        this.UsersService = UsersService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async findscheduledevice(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || 1;
        let schedule_id = query.schedule_id || '';
        let device_id = query.device_id || '';
        if ((!schedule_id) || (!device_id)) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data schedule_id or device_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id หรือ device_id ',
            });
            return;
        }
        var sort = query.sort;
        let filter = {};
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
        let rowResultData = await this.settingsService.findscheduledevice(filter);
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
        let ResultData = rowResultData;
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const id = ResultData[key].id || null;
            const ProfileRs = {
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
                sn: ResultData[key].device_sn
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
    async testgemail(res, query, headers, params, req) {
        let ResultData = await this.settingsService.testGmailConnection();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'testgemail .',
            message_th: 'testgemail.',
        });
    }
    async sendemail(res, query, headers, params, req) {
        var to = query.to;
        if (to == '' || to == 'undefined') {
            var to = 'icmon0955@gmail.com';
        }
        var subject = query.subject;
        if (subject == '' || subject == 'undefined') {
            var subject = 'Alarm Test';
        }
        var content = query.content;
        if (content == '' || content == 'undefined') {
            var content = 'Alarm Test';
        }
        console.log(`---sendemail--`);
        console.log(`to--` + to);
        console.log(`subject--` + subject);
        console.log(`content--` + content);
        let ResultData = await this.settingsService.sendEmail(to, subject, content);
        let payloadData = {
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
    async findscheduledevicechk(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || 1;
        let schedule_id = query.schedule_id || '';
        let device_id = query.device_id || '';
        if ((!schedule_id) || (!device_id)) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'Data schedule_id or device_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id หรือ device_id ',
            });
            return;
        }
        var sort = query.sort;
        let filter = {};
        filter.schedule_id = schedule_id;
        filter.device_id = device_id;
        let rowResultData = await this.settingsService.findscheduledevicechk(filter);
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
    async list_user_logs(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort || 'createddate-ASC';
        filter.keyword = keyword || '';
        filter.status = status || '';
        filter.setting_id = query.setting_id;
        filter.location_id = query.location_id || '';
        filter.setting_type_id = query.setting_type_id || '';
        filter.sn = query.sn || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        let rowResultData = await this.settingsService.setting_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort || 'createddate-ASC';
        filter2.keyword = keyword || '';
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
        let ResultData = await this.settingsService.setting_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const id = ResultData[key].id || null;
            const ProfileRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async setting_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.setting_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'list setting success.',
            message_th: 'lists etting success.',
        });
    }
    async list_location(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
        filter.status = status || '';
        filter.location_id = query.location_id || '';
        filter.ipaddress = query.ipaddress || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.location_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword || '';
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
        let ResultData = await this.settingsService.location_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                location_id: ResultData[key].location_id,
                location_name: ResultData[key].location_name,
                configdata: ResultData[key].configdata,
                ipaddress: ResultData[key].ipaddress,
                location_detail: ResultData[key].location_detail,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async location_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.location_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async list_type(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.type_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.type_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                type_id: ResultData[key].type_id,
                group_id: ResultData[key].group_id,
                type_name: ResultData[key].type_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_type_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.type_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async list_device_type_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.devicetype_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async devicetypeallcontrol(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.devicetype_all_oi();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async listdevicetype(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.devicetype_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.devicetype_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                type_id: ResultData[key].type_id,
                type_name: ResultData[key].type_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_devicetype_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.devicetype_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async list_sensor(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.sensor_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.location_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ArrayRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_sensor_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.sensor_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'location all success.',
            message_th: 'location all  success.',
        });
    }
    async create_schedule_device(res, query, headers, params, req) {
        const schedule_id = Number(query.schedule_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            schedule_id: schedule_id,
            device_id: device_id,
        };
        await this.settingsService.createscheduledevice(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Scheduled created successfully.',
            message_th: 'สร้าง Scheduled สำเร็จ.',
        });
    }
    async delete_schedule_devices(res, query, headers, params, req) {
        const schedule_id = Number(query.schedule_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            schedule_id: schedule_id,
            device_id: device_id,
        };
        await this.settingsService.delete_schedule_device(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Scheduled delete successfully.',
            message_th: 'ลบ Scheduled สำเร็จแล้ว.',
        });
    }
    async list_group(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
        filter.status = status || '';
        filter.group_id = query.group_id || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.group_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.group_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                group_id: ResultData[key].group_id,
                group_name: ResultData[key].group_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_group_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.group_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'group_all success.',
            message_th: 'group_all  success.',
        });
    }
    async list_group_page(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
        filter.status = status || '';
        filter.group_id = query.group_id || '';
        filter.ipaddress = query.ipaddress || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.group_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.group_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                group_id: ResultData[key].group_id,
                group_name: ResultData[key].group_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_mqtt(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        var select_status = query.select_status || '';
        var sort = query.sort || 'mqtt_id-ASC';
        var keyword = query.keyword || '';
        var mqtt_type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
        filter.status = status || '';
        filter.mqtt_id = query.mqtt_id || '';
        filter.mqtt_type_id = mqtt_type_id;
        filter.location_id = location_id;
        filter.secret = query.secret || '';
        filter.expire_in = query.expire_in || '';
        filter.token_value = query.token_value || '';
        filter.org = query.org || '';
        filter.bucket = query.bucket || '';
        filter.envavorment = query.envavorment || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.mqtt_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword || '';
        filter2.status = status || '';
        filter2.mqtt_id = query.mqtt_id || '';
        filter2.mqtt_type_id = mqtt_type_id;
        filter2.location_id = location_id;
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
        let ResultData = await this.settingsService.mqtt_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var bucket = ResultData[key].bucket;
            let filter2 = {};
            filter2.bucket = bucket;
            let device = await this.settingsService.device_lists_id(filter2);
            let device_count = device.length;
            const date = format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString));
            const RSdata = {
                mqtt_id: ResultData[key].mqtt_id,
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
    async list_mqtt_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.mqtt_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'mqtt_all success.',
            message_th: 'mqtt_all  success.',
        });
    }
    async mqttdelete(res, query, headers, params, req) {
        const dto = '';
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
        let ResultData = await this.settingsService.delete_mqtt(query.mqtt_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'delete mqtt success.',
            message_th: 'delete mqtt  success.',
        });
    }
    async list_api_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.api_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'api_all success.',
            message_th: 'api_all  success.',
        });
    }
    async api_list_paginate(res, query, headers, params, req) {
        const api_id = query.api_id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.api_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.api_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                api_id: ResultData[key].api_id,
                api_name: ResultData[key].api_name,
                host: ResultData[key].host,
                port: ResultData[key].port,
                token_value: ResultData[key].token_value,
                password: ResultData[key].password,
                type_name: ResultData[key].type_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_device_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.device_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'device_all success.',
            message_th: 'device_all  success.',
        });
    }
    async deviceeditget(res, query, headers, params, req) {
        const dto = '';
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
        let ResultData = await this.settingsService.deviceeditget(query.device_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'deviceeditget success.',
            message_th: 'deviceeditget  success.',
        });
    }
    async devicedetail(res, query, headers, params, req) {
        const dto = '';
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
        let filter = {};
        filter.device_id = query.device_id || '';
        filter.status = query.status || '';
        let ResultData = await this.settingsService.devicedetail(filter);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData['0'],
            message: 'deviceeditget success.',
            message_th: 'deviceeditget  success.',
        });
    }
    async deviceedelete(res, query, headers, params, req) {
        const dto = '';
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
        let ResultData = await this.settingsService.delete_device(query.device_id);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'delete success.',
            message_th: 'delete  success.',
        });
    }
    async device_list_paginate(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.device_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.device_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var mqtt_data_value = ResultData[key].mqtt_data_value;
            var mqtt_data_control = ResultData[key].mqtt_data_control;
            var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
            const DataRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async device_listdevicepage(res, query, headers, params, req) {
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
            keyword: query.keyword,
            type_name: query.type_name || '',
            host: query.host || '',
            port: query.port || '',
            password: query.password || '',
            createddate: query.date || '',
            isCount: 1,
        };
        var deletecache = query.deletecache;
        var filtercache = encodeURI(sort + device_id + query.mqtt_id + query.type_id + query.org + query.bucket + keyword + query.type_name + query.host + query.port + query.password + query.date + 'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'mqtt_device_list_paginate_v2_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate(filter);
            var InpuDatacache = { keycache: `${kaycache}`, time: 30, data: rowResultData };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var filter2cache = encodeURI(page + pageSize + sort + device_id + query.mqtt_id + query.type_id + query.org + query.bucket + keyword + query.type_name + query.host + query.port + query.password + query.date + 'isCount0');
        var filter2keymd5 = 'mqtt_device_list_paginate_v2_2_' + md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate(filter2);
            var InpuDatacache = { keycache: `${filter2keymd5}`, time: 30, data: ResultData };
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
    async device_list_paginate_active1(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.device_id = query.device_id || '';
        filter.mqtt_id = query.mqtt_id || '';
        filter.type_id = query.type_id || '';
        filter.org = query.org || '';
        filter.bucket = query.bucket || '';
        filter.keyword = keyword || '';
        filter.type_name = query.type_name || '';
        filter.host = query.host || '';
        filter.port = query.port || '';
        filter.password = query.password || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.device_list_paginate_active(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword || '';
        filter2.type_name = query.type_name || '';
        filter2.device_id = query.device_id || '';
        filter2.mqtt_id = query.mqtt_id || '';
        filter2.type_id = query.type_id || '';
        filter2.org = query.org || '';
        filter2.bucket = query.bucket || '';
        filter2.host = query.host;
        filter2.port = query.port || '';
        filter2.password = query.password || '';
        filter2.createddate = query.date || '';
        filter2.isCount = 0;
        filter2.page = page;
        filter2.pageSize = pageSize;
        console.log(`filter2=`);
        console.info(filter2);
        let ResultData = await this.settingsService.device_list_paginate_active(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var mqtt_data_value = ResultData[key].mqtt_data_value;
            var mqtt_data_control = ResultData[key].mqtt_data_control;
            var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
            const DataRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async device_list_paginate_actives(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 1000;
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
        var filtercache = encodeURI(sort + device_id + query.mqtt_id + query.type_id + query.org + bucket + keyword + query.type_name + query.host + query.port + query.password + query.date + 'isCount1');
        var filterkeymd5 = md5(filtercache);
        var kaycache = 'mqtt_listdevicepageactive_' + filterkeymd5;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache);
        }
        var rowResultData = await Cache.GetCacheData(kaycache);
        if (!rowResultData) {
            var rowResultData = await this.settingsService.device_list_paginate_active(filter);
            var InpuDatacache = { keycache: `${kaycache}`, time: 120, data: rowResultData };
            await Cache.SetCacheData(InpuDatacache);
            var cache_data = 'no cache';
        }
        else {
            var cache_data = 'cache';
        }
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var filter2cache = encodeURI(page + pageSize + sort + device_id + query.mqtt_id + query.type_id + query.org + query.bucket + keyword + query.type_name + query.host + query.port + query.password + query.date + 'isCount0');
        var filter2keymd5 = md5(filter2cache);
        var ResultData = await Cache.GetCacheData(filter2keymd5);
        if (!ResultData) {
            var ResultData = await this.settingsService.device_list_paginate_active(filter2);
            var InpuDatacache = { keycache: `${filter2keymd5}`, time: 120, data: ResultData };
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
    async mqttdata(res, query, headers, params, req) {
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
    async device_list_paginate_all(res, query, headers, params, req) {
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
        var rowResultData = await this.settingsService.device_list_paginate_all(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.device_list_paginate_all(filter2);
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
    async device_list_paginate_sensor(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 1000;
        var sort = query.sort;
        var keyword = query.keyword || '';
        var filter = {
            sort,
            device_id,
            mqtt_id: query.mqtt_id || '',
            type_id: 1,
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
        var rowResultData = await this.settingsService.device_list_paginate_all(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.device_list_paginate_all(filter2);
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
    async device_list_paginate_all_active(res, query, headers, params, req) {
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
        var rowResultData = await this.settingsService.device_list_paginate_all_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.device_list_paginate_all_active(filter2);
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
    async device_list_paginate_all_active_schedule(res, query, headers, params, req) {
        var schedule_id = query.schedule_id || '';
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
        if (schedule_id == "" || schedule_id == "undefined" || schedule_id == undefined) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'schedule_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id',
            });
            return;
        }
        var scheduleResultData = await this.settingsService.findOnescheduledevice(schedule_id);
        var rowResultData = await this.settingsService.device_list_paginate_all_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            schedule_id: schedule_id,
            pageSize: 1,
            page: 1
        };
        var scheduleResultData = await this.settingsService.schedule_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_list_paginate_all_active(filter2);
        console.log(`ResultData`);
        console.info(ResultData);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_schedule_device = await this.settingsService.get_data_schedule_device(filter_schedule);
            if (count_schedule_device >= 1) {
                var schedule_status = 1;
            }
            else {
                var schedule_status = 0;
            }
            const arraydata = {
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
                schedule_title: scheduleResultData['0'].schedule_name + ' ' + scheduleResultData['0'].start,
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async scheduledevicepage(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 1000;
        var sort = query.sort;
        var keyword = query.keyword || '';
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
        var rowResultData = await this.settingsService.scheduledevicepage(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.scheduledevicepage(filter2);
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
    async schedulelist(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 1000;
        var sort = query.sort;
        var keyword = query.keyword || '';
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
        var rowResultData = await this.settingsService.scheduledevicepage(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.scheduledevicepage(filter2);
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
    async device_list_alarm(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        if (location_id == "") {
            var location_id = 1;
        }
        var filter2 = {};
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
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_fan(filter2);
        let tempData = [];
        let tempDataoid = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var mqtt_data_value = ResultData[key].mqtt_data_value;
            var mqtt_data_control = ResultData[key].mqtt_data_control;
            var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
            var main_overFan1 = mqttdata['payload']['overFan1'];
            var main_overFan2 = mqttdata['payload']['overFan2'];
            var main_temperature = mqttdata['payload']['temperature'];
            var main_status_warning = ResultData[key].status_warning;
            var main_status_alert = ResultData[key].status_alert;
            var main_max = ResultData[key].max;
            var main_min = ResultData[key].min;
            var main_type_id = ResultData[key].type_id;
            var main_fan1 = mqttdata['payload']['fan1'];
            var main_fan2 = mqttdata['payload']['fan2'];
            var main_overFan1 = mqttdata['payload']['overFan1'];
            var main_overFan2 = mqttdata['payload']['overFan2'];
            if ((main_temperature >= main_status_warning && main_type_id == 1) || (main_temperature >= main_status_alert && main_type_id == 1)) {
                var alart_temperature = 0;
            }
            else {
                var alart_temperature = 1;
            }
            if (main_type_id == 1) {
                var sensor_name = 'temperature';
                var sensor_data = main_temperature;
                var sensor_data_name = sensor_data + ' ' + ResultData[key].unit;
                var alart_status = alart_temperature;
            }
            else if (main_type_id == 2) {
                var sensor_name = 'fan1';
                var sensor_data = main_fan1;
                var sensor_data_name = 'Alarm';
                var alart_status = main_overFan1;
            }
            else {
                var sensor_name = 'fan2';
                var sensor_data = main_fan2;
                var sensor_data_name = 'Alarm';
                var alart_status = main_overFan2;
            }
            const DataRs = {
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
            if (((main_overFan1 != '1' && main_type_id == 2)) || (main_overFan2 != '1' && main_type_id == 3) || ((main_temperature >= main_status_warning && main_type_id == 1) || (main_temperature >= main_status_alert && main_type_id == 1))) {
                tempData2.push(DataRs);
            }
        }
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: tempData2,
            message: 'list device success.',
            message_th: 'lists device success.',
        });
    }
    async device_list_alarm_air(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        if (location_id == "") {
            var location_id = 5;
        }
        var filter2 = {};
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter2);
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_air(filter2);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
            }
            else {
                filter.sensorValueData = encodeURI(value_alarm);
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
            var getAlarmDetails = await this.settingsService.getAlarmDetailsAlert(filter);
            if (getAlarmDetails) {
                var subject = getAlarmDetails.subject;
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = createddate;
            var sensor_data_name = subject;
            const DataRs = {
                mqttdata,
                mqttData_count,
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
            if (status < 3) {
                tempData.push(va);
                tempData2.push(DataRs);
            }
        }
        res.status(200).json({
            statusCode: 200,
            code: 200,
            filter2,
            payload: tempData2,
            message: 'list device success.',
            message_th: 'lists device success.',
        });
    }
    async listdevicealarmair(res, dto, query, headers, req) {
        try {
            var delete_cache = query.deletecache;
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
            var now = new Date();
            var pad = (num) => String(num).padStart(2, '0');
            var datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            if (!location_id) {
                var location_id = 5;
            }
            var filter2 = {};
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
            const deletecache = query.deletecache || 0;
            var tempData2 = [];
            var filtercache = encodeURI(sort + keyword + query.type_name + query.device_id + query.mqtt_id + query.type_id + query.org + query.bucket + status);
            var filterkeymd5 = md5(filtercache);
            var kaycache = 'data_device_alarm_air' + filterkeymd5;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var ResultDataalarm = await Cache.GetCacheData(kaycache);
            if (!ResultDataalarm) {
                let ResultDataalarm = await this.settingsService.device_list_ststus_alarm_air(filter2);
                var InpuDatacache = { keycache: `${kaycache}`, time: 300, data: ResultDataalarm };
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
                        var alarmStatusSet = '';
                    }
                    var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            var filtercache = encodeURI(sort + keyword + query.type_name + query.device_id + query.mqtt_id + query.type_id + query.org + query.bucket + status);
            var filterkeymd5 = md5(filtercache);
            var kaycache = 'device_list_ststus_alarm_all_' + filterkeymd5;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var ResultDataalarm = await Cache.GetCacheData(kaycache);
            if (!ResultDataalarm) {
                let ResultDataalarm = await this.settingsService.device_list_ststus_alarm_all(filter2alarm);
                var InpuDatacache = { keycache: `${kaycache}`, time: 600, data: ResultDataalarm };
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
                        var alarmStatusSet = '';
                    }
                    var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
    async _device_list_alarm_fan(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        if (location_id == "") {
            var location_id = 1;
        }
        var filter2 = {};
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter2);
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_fans(filter2);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
            }
            else {
                filter.sensorValueData = encodeURI(value_alarm);
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
            var getAlarmDetails = await this.settingsService.getAlarmDetailsAlert(filter);
            if (getAlarmDetails) {
                var subject = getAlarmDetails.subject;
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = createddate;
            var sensor_data_name = subject;
            const DataRs = {
                mqttdata,
                mqttData_count,
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
            if (status < 3) {
                tempData.push(va);
                tempData2.push(DataRs);
            }
        }
        res.status(200).json({
            statusCode: 200,
            code: 200,
            filter2,
            payload: tempData2,
            message: 'list device success.',
            message_th: 'lists device success.',
        });
    }
    async device_list_alarm_fan(res, dto, query, headers, req) {
        try {
            var delete_cache = query.deletecache;
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
            var now = new Date();
            var pad = (num) => String(num).padStart(2, '0');
            var datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            if (!location_id) {
                var location_id = 1;
            }
            var filter2 = {};
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
            const deletecache = query.deletecache || 0;
            var tempData2 = [];
            var filtercache = encodeURI(sort + keyword + query.type_name + query.device_id + query.mqtt_id + query.type_id + query.org + query.bucket + status);
            var filterkeymd5 = md5(filtercache);
            var kaycache = 'device_list_ststus_alarm_fan_' + filterkeymd5;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache);
            }
            var ResultDataalarm = await Cache.GetCacheData(kaycache);
            if (!ResultDataalarm) {
                let ResultDataalarm = await this.settingsService.device_list_ststus_alarm_fans(filter2);
                var InpuDatacache = { keycache: `${kaycache}`, time: 300, data: ResultDataalarm };
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
                        var alarmStatusSet = '';
                    }
                    var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
    async _devicemonitor(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        var option = query.option || '';
        if (!option) {
            var option = 2;
        }
        if (location_id == "") {
            var location_id = 5;
        }
        var bucket = query.bucket;
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
        var filter = {};
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter);
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_air(filter);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = timestamps;
            var sensor_data_name = subject;
            const DataRs = {
                mqttdata,
                mqttData_count,
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
                status_remart: '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
                timestamp,
                sensor_data_name,
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
            };
            tempData.push(va);
            tempData2.push(DataRs);
        }
        var filter2 = {};
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
        var tem = await this.devicemoniiterRS(filter2);
        if (tem) {
            var tem = tem['0'];
        }
        else {
            var tem = {};
        }
        var maindata = {};
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
            filter,
            message: 'device monitor success.',
            message_th: 'device monitor success.',
        });
    }
    async devicemonitor(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        var option = query.option || '';
        if (!option) {
            var option = 2;
        }
        if (location_id == "") {
            var location_id = 5;
        }
        var bucket = query.bucket;
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
        var filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter);
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_airs(filter);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = timestamps;
            var sensor_data_name = subject;
            const DataRs = {
                mqttdata,
                mqttData_count,
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
                status_remart: '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
                timestamp,
                sensor_data_name,
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
            };
            tempData.push(va);
            tempData2.push(DataRs);
        }
        var filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword || '';
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
        var tem = [];
        var tem = await this.devicemoniiterRSS(filter2);
        if (!tem) {
            var tem = [];
        }
        else {
            var tem = tem['0'];
        }
        var maindata = {};
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
            filter,
            filter2,
            message: 'device monitors success.',
            message_th: 'device monitors success.',
        });
    }
    async devicemonitors(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        var keyword = query.keyword || '';
        var location_id = query.location_id || '';
        var option = query.option || '';
        if (!option) {
            var option = 2;
        }
        if (location_id == "") {
            var location_id = 5;
        }
        var bucket = query.bucket;
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
        var filter = {};
        filter.sort = sort;
        filter.keyword = keyword || '';
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter);
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_airss(filter);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = timestamps;
            var sensor_data_name = subject;
            const DataRs = {
                mqttdata,
                mqttData_count,
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
                status_remart: '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
                timestamp,
                sensor_data_name,
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
            };
            tempData.push(va);
            tempData2.push(DataRs);
        }
        var filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword || '';
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
        var tem = [];
        var tem = await this.devicemoniiterRSS(filter2);
        if (!tem) {
            var tem = [];
        }
        else {
            var tem = tem['0'];
        }
        var maindata = {};
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
            filter,
            filter2,
            message: 'device monitors success.',
            message_th: 'device monitors success.',
        });
    }
    async device_list_alarm_limit(res, query, headers, params, req) {
        const device_id = query.device_id || '';
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort;
        let keyword = query.keyword || '';
        var type_id = query.type_id;
        let filter2 = {};
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_ststus_alarm_limit_' + md5(filter2);
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_limit(filter2);
        let tempData = [];
        let tempDataoid = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var mqtt_data_value = ResultData[key].mqtt_data_value;
            var mqtt_data_control = ResultData[key].mqtt_data_control;
            var mqttdata = await this.mqttService.getdevicedata(mqtt_data_value);
            var main_overFan1 = mqttdata['payload']['overFan1'];
            var main_overFan2 = mqttdata['payload']['overFan2'];
            var main_temperature = mqttdata['payload']['temperature'];
            var main_status_warning = ResultData[key].status_warning;
            var main_status_alert = ResultData[key].status_alert;
            var main_max = ResultData[key].max;
            var main_min = ResultData[key].min;
            var main_type_id = ResultData[key].type_id;
            var main_fan1 = mqttdata['payload']['fan1'];
            var main_fan2 = mqttdata['payload']['fan2'];
            var main_overFan1 = mqttdata['payload']['overFan1'];
            var main_overFan2 = mqttdata['payload']['overFan2'];
            if ((main_temperature >= main_status_warning && main_type_id == 1) || (main_temperature >= main_status_alert && main_type_id == 1)) {
                var alart_temperature = 0;
            }
            else {
                var alart_temperature = 1;
            }
            if (main_type_id == 1) {
                var sensor_name = 'temperature';
                var sensor_data = main_temperature;
                var sensor_data_name = sensor_data + ' ' + ResultData[key].unit;
                var alart_status = alart_temperature;
            }
            else if (main_type_id == 2) {
                var sensor_name = 'fan1';
                var sensor_data = main_fan1;
                var sensor_data_name = 'Alarm';
                var alart_status = main_overFan1;
            }
            else {
                var sensor_name = 'fan2';
                var sensor_data = main_fan2;
                var sensor_data_name = 'Alarm';
                var alart_status = main_overFan2;
            }
            const DataRs = {
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
            if (((main_overFan1 != '1' && main_type_id == 2)) || (main_overFan2 != '1' && main_type_id == 3) || ((main_temperature >= main_status_warning && main_type_id == 1) || (main_temperature >= main_status_alert && main_type_id == 1))) {
                tempData2.push(DataRs);
            }
        }
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: tempData2,
            message: 'list device success.',
            message_th: 'lists device success.',
        });
    }
    async email_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = query.keyword || '';
        filter.status = query.status || '';
        filter.email_id = query.email_id || '';
        filter.host_id = query.host_id || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.email_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.email_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const RSdata = {
                email_id: ResultData[key].email_id,
                email_name: ResultData[key].email_name,
                host_name: ResultData[key].host_name,
                host: ResultData[key].host,
                host_id: ResultData[key].host_id,
                port: ResultData[key].port,
                username: ResultData[key].username,
                password: ResultData[key].password,
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_email_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.email_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'email_all success.',
            message_th: 'email_all  success.',
        });
    }
    async mqtthost_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = query.keyword || '';
        filter.status = query.status || '';
        filter.id = query.id || '';
        filter.host_id = query.host_id || '';
        filter.createddate = query.date || '';
        filter.isCount = 1;
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.settingsService.mqtthost_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.mqtthost_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const RSdata = {
                id: ResultData[key].id,
                hostname: ResultData[key].hostname,
                host: ResultData[key].host,
                port: ResultData[key].port,
                username: ResultData[key].username,
                password: ResultData[key].password,
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_mqtthost_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.mqtthost_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'mqtthost_all success.',
            message_th: 'mqtthost_all  success.',
        });
    }
    async list_host_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.host_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'host_all success.',
            message_th: 'host_all  success.',
        });
    }
    async host_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.host_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.host_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                host_id: ResultData[key].host_id,
                host_name: ResultData[key].host_name,
                host: ResultData[key].host,
                port: ResultData[key].port,
                token_value: ResultData[key].token_value,
                password: ResultData[key].password,
                type_name: ResultData[key].type_name,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async influxdb_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.influxdb_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.influxdb_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                influxdb_id: ResultData[key].influxdb_id,
                influxdb_name: ResultData[key].influxdb_name,
                host: ResultData[key].host,
                port: ResultData[key].port,
                username: ResultData[key].username,
                password: ResultData[key].password,
                token_value: ResultData[key].token_value,
                buckets: ResultData[key].buckets,
                status: ResultData[key].status,
                date: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_influxdb_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.influxdb_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'influxdb_all success.',
            message_th: 'influxdb_all  success.',
        });
    }
    async mqtt_list_active_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 10000;
        var status = query.status || '';
        var select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        var deletecache = query.deletecache || '';
        var keyword = query.keyword || '';
        var filter = {};
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
        let rowResultData = await this.settingsService.mqtt_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        var keycache_na = query.keyword + '_' + query.status + '_' + query.host + '_' + query.port + '_' + query.username + '_' + query.password + '_' + query.type_name + '_' + query.mqtt_type_id + '_' + page + '_' + pageSize;
        var keycache2 = md5(keycache_na);
        var keycache = 'mqtt_list_paginate_' + keycache2;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(keycache);
        }
        var ResultData = await Cache.GetCacheData(keycache);
        if (!ResultData) {
            var ResultData = await this.settingsService.mqtt_list_paginate(filter2);
            let setCache = {};
            setCache.time = 3000;
            setCache.keycache = keycache;
            setCache.data = ResultData;
            await Cache.SetCacheData(setCache);
        }
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            let mqtt_id = ResultData[key].mqtt_id;
            let filterRss = {};
            filterRss.mqtt_id = mqtt_id;
            var keycache2 = 'device_mqtt_id' + mqtt_id;
            if (deletecache == 1) {
                await Cache.DeleteCacheData(keycache2);
            }
            var rss_device = await Cache.GetCacheData(keycache2);
            if (!rss_device) {
                var rss_device = await this.settingsService.device_lists(filterRss);
                let setCache2 = {};
                setCache2.time = 3000;
                setCache2.keycache = keycache;
                setCache2.data = ResultData;
                await Cache.SetCacheData(setCache2);
            }
            let rss_device_count = rss_device.length;
            if (rss_device_count >= 1) {
                const mqtt_data_value = rss_device['0']['mqtt_data_value'];
                const mqtt_data_control = rss_device['0']['mqtt_data_control'];
                const device_cache = await Cache.GetCacheData(mqtt_data_value);
                const RSdata = {
                    mqtt_id: ResultData[key].mqtt_id,
                    mqtt_name: ResultData[key].mqtt_name,
                    org: ResultData[key].org,
                    bucket: ResultData[key].bucket,
                    envavorment: ResultData[key].envavorment,
                    mqtt_type_id: ResultData[key].mqtt_type_id,
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
                data: tempData2,
            },
            message: 'list mqtt success..',
            message_th: 'lists mqtt success..',
        });
    }
    async mqtt_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 10;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.mqtt_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.mqtt_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            let mqtt_id = ResultData[key].mqtt_id;
            let filterRss = {};
            filterRss.mqtt_id = mqtt_id;
            var rss_device = await this.settingsService.device_lists(filterRss);
            let rss_device_count = rss_device.length;
            const RSdata = {
                mqtt_id: ResultData[key].mqtt_id,
                mqtt_name: ResultData[key].mqtt_name,
                org: ResultData[key].org,
                bucket: ResultData[key].bucket,
                envavorment: ResultData[key].envavorment,
                mqtt_type_id: ResultData[key].mqtt_type_id,
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
                data: tempData2,
            },
            message: 'list mqtt success..',
            message_th: 'lists mqtt success..',
        });
    }
    async mqtt_list_device_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'mqtt_id-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.mqtt_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.mqtt_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            let mqtt_id = ResultData[key].mqtt_id;
            let filterRss = {};
            filterRss.mqtt_id = mqtt_id;
            let rss_device = await this.settingsService.device_lists(filterRss);
            const RSdata = {
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
    async list_line_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.line_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'line_all success.',
            message_th: 'line_all  success.',
        });
    }
    async line_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.line_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.line_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_nodered_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.nodered_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'nodered_all success.',
            message_th: 'nodered_all  success.',
        });
    }
    async nodered_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.nodered_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.nodered_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const RSdata = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async list_schedule_all(res, query, headers, params, req) {
        const schedule_id = Number(query.schedule_id) || 1;
        const dto = {
            schedule_id: schedule_id,
        };
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.schedule_all(dto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'schedule_all success.',
            message_th: 'schedule_all  success.',
        });
    }
    async schedule_list_page(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.schedule_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.schedule_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            let filterDATA = {};
            filterDATA.schedule_id = ResultData[key].schedule_id;
            let countRs = await this.settingsService.scheduledeviceCOUNT(filterDATA);
            const RSdata = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
                status: ResultData[key].status,
                countRs: countRs
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
    async list_sms_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.sms_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'sms_all success.',
            message_th: 'sms_all  success.',
        });
    }
    async sms_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.sms_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.sms_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var createddate = ResultData[key].createddate;
            var updateddate1 = ResultData[key].updateddate;
            const ProfileRs = {
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
    async list_token_all(res, query, headers, params, req) {
        const dto = '';
        console.log(`dto=`);
        console.info(dto);
        let ResultData = await this.settingsService.token_all();
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: ResultData,
            message: 'token_all success.',
            message_th: 'token_all  success.',
        });
    }
    async token_list_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
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
        let rowResultData = await this.settingsService.token_list_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.token_list_paginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const ProfileRs = {
                token_id: ResultData[key].token_id,
                token_name: ResultData[key].token_name,
                host: ResultData[key].host,
                port: ResultData[key].port,
                token_value: ResultData[key].token_value,
                username: ResultData[key].username,
                password: ResultData[key].password,
                status: ResultData[key].status,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
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
    async create_setting(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_setting_sn(DataDto.sn);
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
    async create_location(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_location_ip(DataDto.ipaddress);
        if (Rs) {
            console.log('ipaddress>' + DataDto.ipaddress);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { ipaddress: DataDto.ipaddress },
                message: 'The ipaddress  duplicate this data cannot create.',
                message_th: 'ข้อมูล ipaddress ' + DataDto.ipaddress + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_type(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_type_name(DataDto.type_name);
        if (Rs) {
            console.log('type_name=>' + DataDto.type_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { type_name: DataDto.type_name },
                message: 'The type_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล type_name ' + DataDto.type_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_device_type(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_type_name(DataDto.type_name);
        if (Rs) {
            console.log('type_name=>' + DataDto.type_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { type_name: DataDto.type_name },
                message: 'The type_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล type_name ' + DataDto.type_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_sensor(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_sensor_chk(DataDto.sensor_name);
        if (Rs) {
            console.log('sensor_name=>' + DataDto.sensor_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { sensor_name: DataDto.sensor_name },
                message: 'The sensor_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล sensor_name ' + DataDto.sensor_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_group(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_group(DataDto.group_name);
        if (Rs) {
            console.log('group_name=>' + DataDto.group_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { group_name: DataDto.group_name },
                message: 'The group_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล group_name ' + DataDto.group_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_mqtt(res, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_mqtt(DataDto.mqtt_name);
        if (Rs) {
            console.log('mqtt_name=>' + DataDto.mqtt_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { mqtt_name: DataDto.mqtt_name },
                message: 'The mqtt_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล mqtt_name ' + DataDto.mqtt_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
        var sort_lasst = await this.settingsService.mqtt_last_sort();
        var sort_last = sort_lasst + 1;
        var mqtt_id = await this.settingsService.get_maxId_mqtt();
        console.log('mqtt_id=');
        console.info(mqtt_id);
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const autoddate = moment(new Date(), DATE_TIME_FORMAT);
        var DataDtos = {
            mqtt_id: mqtt_id,
            mqtt_type_id: DataDto.mqtt_type_id,
            sort: sort_last,
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
            latitude: DataDto.latitude,
            longitude: DataDto.longitude,
            mqtt_main_id: DataDto.mqtt_main_id
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
    async update_mqttt_sort(res, dto, DataDto, query, headers, params, req) {
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
        var DataDtos = {
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
    async create_api(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_api(DataDto.api_name);
        if (Rs) {
            console.log('api_name=>' + DataDto.api_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { api_name: DataDto.api_name },
                message: 'The api_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล api_name ' + DataDto.api_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_device(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_sn(DataDto.sn);
        if (Rs) {
            const Rscount = Rs.length;
            console.log('SN=>' + DataDto.sn);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { device_name: DataDto.sn, Rs, Rscount },
                message: 'The SN  duplicate this data cannot create.',
                message_th: 'ข้อมูล SN ' + DataDto.sn + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
        }
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
    async create_email(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_email(DataDto.email_name);
        if (Rs) {
            console.log('email_name=>' + DataDto.email_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { email_name: DataDto.email_name },
                message: 'The email_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล email_name ' + DataDto.email_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_mqtthost(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_mqtthost(DataDto.hostname);
        if (Rs) {
            console.log('hostname=>' + DataDto.hostname);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { hostname: DataDto.hostname },
                message: 'The hostname  duplicate this data cannot create.',
                message_th: 'ข้อมูล hostname ' + DataDto.hostname + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_host(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_email(DataDto.host_name);
        if (Rs) {
            console.log('host_name=>' + DataDto.host_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { host_name: DataDto.host_name },
                message: 'The host_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล host_name ' + DataDto.host_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_influxdb(res, DataDto, query, headers, params, req) {
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
    async create_line(res, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_line(DataDto.line_name);
        if (Rs) {
            console.log('line_name=>' + DataDto.line_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { line_name: DataDto.line_name },
                message: 'The line_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล line_name ' + DataDto.line_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_nodered(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_nodered(DataDto.nodered_name);
        if (Rs) {
            console.log('nodered_name=>' + DataDto.nodered_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { nodered_name: DataDto.nodered_name },
                message: 'The nodered_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล nodered_name ' + DataDto.nodered_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_schedule(dataDto) {
        if (!dataDto) {
            return {
                statusCode: 422,
                code: 422,
                payload: null,
                message: 'Data is null.',
                message_th: 'ไม่พบข้อมูล.',
            };
        }
        const isDuplicate = await this.settingsService.get_name_create_schedule(dataDto.schedule_name);
        if (isDuplicate) {
            return {
                statusCode: 409,
                code: 409,
                payload: { schedule_name: dataDto.schedule_name },
                message: 'The schedule_name is duplicate, cannot create.',
                message_th: `ข้อมูล schedule_name ${dataDto.schedule_name} ซ้ำไม่สามารถเพิ่มได้.`,
            };
        }
        await this.settingsService.create_schedule(dataDto);
        return {
            statusCode: 201,
            code: 201,
            payload: dataDto,
            message: 'Create Data successfully.',
            message_th: 'เพิ่มข้อมูลสำเร็จ.',
        };
    }
    async create_scheduleDevice(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.findOnescheduledevice(DataDto.schedule_id);
        if (Rs) {
            console.log('schedule_id=>' + DataDto.schedule_id);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { schedule_id: DataDto.schedule_id },
                message: 'The schedule_id  duplicate this data cannot create.',
                message_th: 'ข้อมูล schedule_id ' + DataDto.schedule_id + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_sms(res, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_sms(DataDto.sms_name);
        if (Rs) {
            console.log('sms_name=>' + DataDto.sms_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { sms_name: DataDto.sms_name },
                message: 'The sms_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล sms_name ' + DataDto.sms_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_token(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_token(DataDto.token_name);
        if (Rs) {
            console.log('token_name=>' + DataDto.token_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { token_name: DataDto.token_name },
                message: 'The token_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล token_name ' + DataDto.token_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_telegram(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_name_create_telegram(DataDto.telegram_name);
        if (Rs) {
            console.log('telegram_name=>' + DataDto.telegram_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { telegram_name: DataDto.telegram_name },
                message: 'The telegram_name  duplicate this data cannot create.',
                message_th: 'ข้อมูล telegram_name ' + DataDto.telegram_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async Deviceactionuser(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_deviceactionuserlog(DataDto.alarm_action_id);
        if (Rs) {
            console.log('alarm_action_id=>' + DataDto.alarm_action_id);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { alarm_action_id: DataDto.alarm_action_id },
                message: 'The alarm_action_id  duplicate this data cannot create.',
                message_th: 'ข้อมูล alarm_action_id ' + DataDto.alarm_action_id + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async update_setting(res, dto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_setting(dto.setting_id);
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
        }
        const setting_id = dto.setting_id;
        if (!setting_id) {
            const setting_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + setting_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + setting_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        const rt = await this.settingsService.update_setting(DataUpdate);
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
    async update_location(res, dto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_location(dto.location_id);
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
        }
        const location_id = dto.location_id;
        if (!location_id) {
            const location_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + location_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + location_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        const rt = await this.settingsService.update_location(DataUpdate);
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
    async update_type(res, dto, query, headers, params, req) {
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
        const type_id = dto.type_id;
        if (!type_id) {
            const type_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + type_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + type_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        const rt = await this.settingsService.update_type(DataUpdate);
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
    async update_device_type(res, dto, query, headers, params, req) {
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
        const type_id = dto.type_id;
        if (!type_id) {
            const type_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + type_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + type_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
        DataUpdate.type_id = type_id;
        if (dto.type_name) {
            DataUpdate.type_name = dto.type_name;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        const rt = await this.settingsService.update_device_type(DataUpdate);
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
    async update_sensor(res, dto, query, headers, params, req) {
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
        const sensor_id = dto.sensor_id;
        if (!sensor_id) {
            const sensor_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + sensor_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + sensor_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        const rt = await this.settingsService.update_sensor(DataUpdate);
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
    async update_group(res, dto, query, headers, params, req) {
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
        const group_id = dto.group_id;
        if (!group_id) {
            const group_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + group_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + group_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
        DataUpdate.group_id = group_id;
        if (dto.group_id) {
            DataUpdate.group_id = dto.group_id;
        }
        if (dto.group_name) {
            DataUpdate.group_name = dto.group_name;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        const rt = await this.settingsService.update_group(DataUpdate);
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
    async update_mqtt(res, dto, query, headers, params, req) {
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
        var mqtt_id = dto.mqtt_id;
        var status = dto.status;
        if (!mqtt_id) {
            const mqtt_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + mqtt_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + mqtt_id + '.',
            };
            res.status(200).json(result);
        }
        var DataUpdate = {};
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
        if (dto.mqtt_main_id) {
            DataUpdate.mqtt_main_id = dto.mqtt_main_id;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.settingsService.update_mqtt(DataUpdate);
        var rsbucket = await this.settingsService.get_mqtt(mqtt_id);
        var rs_bucket = rsbucket.bucket;
        var org = rsbucket.org;
        if (rt && rt == 200) {
            var result = {
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
    async update_mqtt_status(res, dto, query, headers, params, req) {
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
        var mqtt_id = dto.mqtt_id;
        if (mqtt_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + mqtt_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + mqtt_id + '.',
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
        DataUpdate.mqtt_id = mqtt_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_mqtt(mqtt_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_mqtt_status(mqtt_id, status);
        }
        else {
            var rt = await this.settingsService.update_mqtt_status(mqtt_id, 0);
        }
        if (rsbucket_count != 0) {
            var rs_bucket = rsbucket.bucket;
            var org = rsbucket.org;
            if (rt) {
                var DataUpdate2 = {};
                DataUpdate2.mqtt_id = mqtt_id;
                DataUpdate2.bucket = rs_bucket;
                DataUpdate2.status = dto.status;
                var mqtt_bucket = await this.settingsService.update_device_mqtt_status(rs_bucket, status);
            }
        }
        if (rt) {
            var result = {
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
    async update_api(res, dto, query, headers, params, req) {
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
        var api_id = dto.api_id;
        if (!api_id) {
            var api_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + api_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + api_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_api(DataUpdate);
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
    async update_device(res, dto, query, headers, params, req) {
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
        var device_id = dto.device_id;
        if (!device_id) {
            var device_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + device_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + device_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
            DataUpdate.recovery_warning = dto.hardware_id;
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
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.settingsService.update_device(DataUpdate);
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
    async update_email(res, dto, query, headers, params, req) {
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
        var email_id = dto.email_id;
        if (!email_id) {
            var email_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + email_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + email_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_email(DataUpdate);
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
    async update_mqtthost(res, dto, query, headers, params, req) {
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
        var id = dto.id;
        if (!id) {
            var id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_mqtthost(DataUpdate);
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
    async update_mqtthoststatus(res, dto, query, headers, params, req) {
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
        var id = dto.id;
        if (id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + id + '.',
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
        DataUpdate.id = id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_mqtthost_id(id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_mqtthost_status(id, 1);
        }
        else {
            var rt = await this.settingsService.update_mqtthost_status(id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                id: id,
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
    async update_host(res, dto, query, headers, params, req) {
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
        var host_id = dto.host_id;
        if (!host_id) {
            var host_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + host_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + host_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_host(DataUpdate);
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
    async update_influxdb(res, dto, query, headers, params, req) {
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
        var influxdb_id = dto.influxdb_id;
        if (!influxdb_id) {
            var influxdb_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + influxdb_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + influxdb_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        var rt = await this.settingsService.update_influxdb(DataUpdate);
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
    async updateinfluxdbstatus(res, dto, query, headers, params, req) {
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
        var influxdb_id = dto.influxdb_id;
        if (influxdb_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + influxdb_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + influxdb_id + '.',
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
        DataUpdate.influxdb_id = influxdb_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_influxdb(influxdb_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_influxdb_status(influxdb_id, 1);
        }
        else {
            var rt = await this.settingsService.update_influxdb_status(influxdb_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                influxdb_id: influxdb_id,
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
    async update_line(res, dto, query, headers, params, req) {
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
        var line_id = dto.line_id;
        if (!line_id) {
            var line_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + line_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + line_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_line(DataUpdate);
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
    async update_nodered(res, dto, query, headers, params, req) {
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
        var nodered_id = dto.nodered_id;
        if (!nodered_id) {
            var nodered_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + nodered_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + nodered_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_nodered(DataUpdate);
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
    async updatenoderedstatus(res, dto, query, headers, params, req) {
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
        var nodered_id = dto.nodered_id;
        if (nodered_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + nodered_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + nodered_id + '.',
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
        DataUpdate.nodered_id = nodered_id;
        DataUpdate.status = status;
        var rsdata = await this.settingsService.get_nodered(nodered_id);
        let rsdata_count = rsdata.length;
        if (rsdata_count != 0) {
            var rt = await this.settingsService.update_nodered_status(nodered_id, 1);
        }
        else {
            var rt = await this.settingsService.update_nodered_status(nodered_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                nodered_id: nodered_id,
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
    async update_schedule(dto, req) {
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
        let user;
        try {
            user = this.jwtService.decode(token);
        }
        catch (e) {
            return {
                statusCode: 401,
                code: 401,
                payload: null,
                message: 'Invalid token',
                message_th: 'Token ไม่ถูกต้อง',
            };
        }
        if (!dto || !dto.schedule_id) {
            return {
                statusCode: 200,
                code: 422,
                payload: null,
                message: 'schedule_id is required.',
                message_th: 'ต้องระบุ schedule_id.',
            };
        }
        const updatableFields = [
            'schedule_name', 'device_id', 'start', 'event',
            'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
            'status', 'calendar_time'
        ];
        const DataUpdate = { schedule_id: dto.schedule_id };
        for (const key of updatableFields) {
            if (dto[key] !== undefined) {
                DataUpdate[key] = dto[key];
            }
        }
        const rt = await this.settingsService.update_schedule(DataUpdate);
        if (rt && rt.code == 200) {
            return {
                statusCode: 200,
                code: 200,
                payload: DataUpdate,
                message: 'Update successful.',
                message_th: 'อัปเดตสำเร็จ.',
            };
        }
        else {
            return {
                statusCode: 200,
                code: 422,
                payload: DataUpdate,
                message: 'Update Unsuccessful',
                message_th: 'อัปเดตไม่สำเร็จ',
            };
        }
    }
    async update_sms(res, dto, query, headers, params, req) {
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
        var sms_id = dto.sms_id;
        if (!sms_id) {
            var sms_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + sms_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + sms_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_sms(DataUpdate);
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
    async updatelinestatus(res, dto, query, headers, params, req) {
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
        var line_id = dto.line_id;
        if (!line_id) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' line_id ' + line_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + line_id + '.',
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
        DataUpdate.line_id = line_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_line(line_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_line_status(line_id, 1);
        }
        else {
            var rt = await this.settingsService.update_line_status(line_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                line_id: line_id,
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
    async updatesmsstatus(res, dto, query, headers, params, req) {
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
        var sms_id = dto.sms_id;
        if (!sms_id) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' sms_id ' + sms_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + sms_id + '.',
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
        DataUpdate.sms_id = sms_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_sms(sms_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_sms_status(sms_id, 1);
        }
        else {
            var rt = await this.settingsService.update_sms_status(sms_id, 0);
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                sms_id: sms_id,
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
    async update_token(res, dto, query, headers, params, req) {
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
        var token_id = dto.token_id;
        if (!token_id) {
            var token_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + token_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + token_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_token(DataUpdate);
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
    async update_status_deviceid(res, dto, query, headers, params, req) {
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
        var device_id = dto.device_id;
        if (device_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' device_id ' + device_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  device_id ' + device_id + '.',
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
        var mqtt_bucket = await this.settingsService.update_device_mqtt_status_device_id(device_id, status);
        if (mqtt_bucket) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: mqtt_bucket,
                message: 'Update status device successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
                statusCode: 200,
                code: 422,
                payload: null,
                message: 'Update status device Unsuccessful',
                message_th: 'อัปเดต ไม่สำเร็จ',
            };
            res.status(200).json(result);
        }
    }
    async update_schedule_status(res, dto, query, headers, params, req) {
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
        var schedule_id = dto.schedule_id;
        if (schedule_id == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' id ' + schedule_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + schedule_id + '.',
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
        DataUpdate.schedule_id = schedule_id;
        DataUpdate.status = status;
        var rsbucket = await this.settingsService.get_schedule(schedule_id);
        let rsbucket_count = rsbucket.length;
        if (rsbucket_count != 0) {
            var rt = await this.settingsService.update_schedule_status(schedule_id, status);
        }
        else {
            var rt = await this.settingsService.update_schedule_status(schedule_id, 0);
        }
        if (rsbucket_count != 0) {
            if (rt) {
                var mqtt_bucket = await this.settingsService.update_schedule_status(schedule_id, status);
            }
        }
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                schedule_id: schedule_id,
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
    async update_schedule_day_status(res, dto, req) {
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
            const schedule_id = dto.schedule_id;
            if (!schedule_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'schedule_id is null.',
                    message_th: 'ไม่พบข้อมูล schedule_id.',
                });
            }
            const rsbucket = await this.settingsService.get_schedule(schedule_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ schedule_id ${schedule_id}`,
                    message_th: `ไม่พบ schedule_id ${schedule_id}`,
                });
            }
            const days = ['event', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'status'];
            const DataUpdate = {};
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
            const rt = await this.settingsService.update_schedule_status_day(schedule_id, DataUpdate);
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
    async delete_setting(res, dto, query, headers, params, req) {
        var setting_id = query.setting_id;
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
        }
        else {
            var Rs = await this.settingsService.get_setting(setting_id);
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
            }
            else {
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
    async delete_setting_del(res, setting_id) {
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
        }
        catch (e) {
            res.status(422).json({
                statusCode: 422,
                code: 422,
                payload: null,
                message: 'Delete setting failed',
                message_th: 'ลบข้อมูลไม่สำเร็จ',
            });
        }
    }
    async update_telegram(res, dto, query, headers, params, req) {
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
        var telegram_id = dto.telegram_id;
        if (!telegram_id) {
            var telegram_id = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: ' id ' + telegram_id + ' is null.',
                message_th: 'ไม่พบข้อมูล  id ' + telegram_id + '.',
            };
            res.status(200).json(result);
        }
        let DataUpdate = {};
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
        var rt = await this.settingsService.update_telegram(DataUpdate);
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
    async delete_location(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var location_id = query.location_id;
        if (!location_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: location_id,
                message: 'location_id is null.',
                message_th: 'location_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_location(location_id);
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
            }
            else {
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
    async delete_type(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var type_id = query.type_id;
        if (!type_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: type_id,
                message: 'type_id is null.',
                message_th: 'type_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_type(type_id);
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
            }
            else {
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
    async delete_device_type(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var type_id = query.type_id;
        if (!type_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: type_id,
                message: 'type_id is null.',
                message_th: 'type_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_type(type_id);
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
            }
            else {
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
    async delete_sensor(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var sensor_id = query.sensor_id;
        if (!sensor_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: sensor_id,
                message: 'sensor_id is null.',
                message_th: 'sensor_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_sensor(sensor_id);
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
            }
            else {
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
    async delete_group(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var group_id = query.group_id;
        if (!group_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: group_id,
                message: 'group_id is null.',
                message_th: 'group_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_group(group_id);
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
            }
            else {
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
    async delete_mqtt(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var mqtt_id = query.mqtt_id;
        if (!mqtt_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: mqtt_id,
                message: 'mqtt_id is null.',
                message_th: 'mqtt_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_mqtt(mqtt_id);
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
            }
            else {
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
    async delete_api(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var api_id = query.api_id;
        if (!api_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: api_id,
                message: 'api_id is null.',
                message_th: 'api_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_api(api_id);
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
            }
            else {
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
    async delete_device(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var device_id = query.device_id;
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
        else {
            var Rs = await this.settingsService.get_device(device_id);
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
            }
            else {
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
    async delete_email(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var email_id = query.email_id;
        if (!email_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: email_id,
                message: 'email_id is null.',
                message_th: 'email_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_email(email_id);
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
            }
            else {
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
    async delete_emqtthost(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var id = query.id;
        if (!id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: id,
                message: 'id is null.',
                message_th: 'id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_mqtthost_id(id);
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
            }
            else {
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
    async delete_host(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var host_id = query.host_id;
        if (!host_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: host_id,
                message: 'host_id is null.',
                message_th: 'host_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_host(host_id);
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
            }
            else {
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
    async delete_influxdb(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var influxdb_id = query.influxdb_id;
        if (!influxdb_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: influxdb_id,
                message: 'influxdb_id is null.',
                message_th: 'influxdb_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            var Rs = await this.settingsService.get_influxdb(influxdb_id);
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
            }
            else {
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
    async delete_line(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var line_id = query.line_id;
        if (!line_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: line_id,
                message: 'line_id is null.',
                message_th: 'line_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            const Rs = await this.settingsService.get_line(line_id);
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
            }
            else {
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
    async delete_nodered(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        var nodered_id = query.nodered_id;
        if (!nodered_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: nodered_id,
                message: 'nodered_id is null.',
                message_th: 'nodered_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            const Rs = await this.settingsService.get_nodered(nodered_id);
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
            }
            else {
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
    async delete_schedule(res, dto, query, headers, params, req) {
        var schedule_id = query.schedule_id;
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
        }
        else {
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
    async delete_sms(res, dto, query, headers, params, req) {
        var sms_id = query.sms_id;
        if (!sms_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: sms_id,
                message: 'sms_id is null.',
                message_th: 'sms_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            const Rs = await this.settingsService.get_sms(sms_id);
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
            }
            else {
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
    async delete_token(res, dto, query, headers, params, req) {
        var token_id = query.token_id;
        if (!token_id) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: token_id,
                message: 'token_id is null.',
                message_th: 'token_id ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            const Rs = await this.settingsService.get_token(token_id);
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
            }
            else {
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
    async delete_device_schedule_id(res, dto, query, headers, params, req) {
        var schedule_id = query.schedule_id;
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
        else {
            const Rs = await this.settingsService.get_ScscheduleId(schedule_id);
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
            }
            else {
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
    async delete_device_and_schedule(res, dto, query, headers, params, req) {
        var device_id = query.device_id;
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
        var schedule_id = query.schedule_id;
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
        else {
            const Rs = await this.settingsService.get_ScscheduleId(schedule_id);
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
                let filter = {};
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
            }
            else {
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
    async delete_telegram(res, dto, query, headers, params, req) {
        var telegram_id = query.telegram_id;
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
        var schedule_id = query.schedule_id;
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
        else {
            const Rs = await this.settingsService.get_telegram(schedule_id);
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
                let filter = {};
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
            }
            else {
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
    async listdevicescheduledata(res, query, headers, params, req) {
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
        var rowResultData = await this.settingsService.device_list_paginate_all_filter(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.device_list_paginate_all_filter(filter2);
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
    async delete_armdevice(res, dto, query, headers, params, req) {
        var alarm_action_id = query.alarm_action_id;
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
        let filter = {};
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
    async delete_armdevice_v2(res, dto, query, headers, params, req) {
        var alarm_action_id = query.alarm_action_id;
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
        var device_id = query.device_id;
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
        let filter = {};
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
    async create_alarmDevice(res, DataDto, query, headers, params, req) {
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
    async update_alarm_device(res, dto, query, headers, params, req) {
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
        let DataUpdate = {};
        DataUpdate.alarm_action_id = dto.alarm_action_id;
        const valdata = ['action_name', 'status_warning', 'recovery_warning', 'status_alert', 'recovery_alert', 'email_alarm', 'line_alarm', 'telegram_alarm', 'sms_alarm', 'nonc_alarm', 'time_life', 'event', 'status'];
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
        const rt = await this.settingsService.update_alarm_device_status_val(dto.alarm_action_id, DataUpdate);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: DataUpdate,
            message: 'Update devicealarmaction successfully..',
            message_th: 'แก้ไข ข้อมูลสำเร็จ..',
        });
        return;
    }
    async list_alarm_device_page(res, query, headers, params, req) {
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
        if (alarm_action_id == "" || alarm_action_id == "undefined" || alarm_action_id == undefined) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'alarm_action_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id',
            });
            return;
        }
        var eventResultData = await this.settingsService.get_alarm_device_map(alarm_action_id);
        var rowResultData = await this.settingsService.device_list_paginate_all_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            alarm_action_id: alarm_action_id,
            pageSize: 1,
            page: 1
        };
        var alarmData = await this.settingsService.device_alarm_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_list_paginate_all_active(filter2);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_alarm_device = await this.settingsService.alarm_device_id_alarm_count(filter_as);
            if (count_alarm_device >= 1) {
                var alarm_status = 1;
            }
            else {
                var alarm_status = 0;
            }
            const arraydata = {
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async list_alarm_event_device_page(res, query, headers, params, req) {
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
        if (alarm_action_id == "" || alarm_action_id == "undefined" || alarm_action_id == undefined) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'alarm_action_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id',
            });
            return;
        }
        var eventResultData = await this.settingsService.get_alarm_device_event_map(alarm_action_id);
        var rowResultData = await this.settingsService.device_list_paginate_all_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            alarm_action_id: alarm_action_id,
            pageSize: 1,
            page: 1
        };
        var alarmData = await this.settingsService.device_alarm_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_list_paginate_all_active(filter2);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_alarm_event_device = await this.settingsService.alarm_device_id_event_count(filter_as);
            if (count_alarm_event_device >= 1) {
                var alarm_event_status = 1;
            }
            else {
                var alarm_event_status = 0;
            }
            const arraydata = {
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async listalarmeventdevicecontrolpage(res, query, headers, params, req) {
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
        if (alarm_action_id == "" || alarm_action_id == "undefined" || alarm_action_id == undefined) {
            res.status(200).json({
                statuscode: 200,
                code: 400,
                payload: null,
                message: 'alarm_action_id is null.',
                message_th: 'ไม่พบข้อมูล schedule_id',
            });
            return;
        }
        var eventResultData = await this.settingsService.get_alarm_device_event_map(alarm_action_id);
        var rowResultData = await this.settingsService.device_list_paginate_all_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            alarm_action_id: alarm_action_id,
            pageSize: 1,
            page: 1
        };
        var alarmData = await this.settingsService.device_alarm_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_list_paginate_all_active_io(filter2);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_alarm_event_device = await this.settingsService.alarm_device_id_event_count(filter_as);
            if (count_alarm_event_device >= 1) {
                var alarm_event_status = 1;
            }
            else {
                var alarm_event_status = 0;
            }
            const arraydata = {
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async device_list_paginate_alarm_active(res, query, headers, params, req) {
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
        var rowResultData = await this.settingsService.device_list_paginate_alarm_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            alarm_action_id: alarm_action_id,
            pageSize: 1,
            page: 1
        };
        var alarmData = await this.settingsService.device_alarm_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_list_paginate_alarm_active(filter2);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_alarm_event_device = await this.settingsService.alarm_device_id_event_count(filter_as);
            if (count_alarm_event_device >= 1) {
                var alarm_event_status = 1;
            }
            else {
                var alarm_event_status = 0;
            }
            const arraydata = {
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async device_event_list_paginate_alarm_active(res, query, headers, params, req) {
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
        var rowResultData = await this.settingsService.device_event_list_paginate_alarm_active(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var schedule_filter = {
            alarm_action_id: alarm_action_id,
            pageSize: 1,
            page: 1
        };
        var alarmData = await this.settingsService.device_alarm_list_paginate(schedule_filter);
        var ResultData = await this.settingsService.device_event_list_paginate_alarm_active(filter2);
        var tempData2 = [];
        for (var va of ResultData) {
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
                device_id
            };
            var count_alarm_event_device = await this.settingsService.alarm_device_id_event_count(filter_as);
            if (count_alarm_event_device >= 1) {
                var alarm_event_status = 1;
            }
            else {
                var alarm_event_status = 0;
            }
            const arraydata = {
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
                mqtt_control_relay_name: mqtt_control_relay_name
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
    async create_alarm_device(res, query, headers, params, req) {
        const alarm_action_id = Number(query.alarm_action_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            alarm_action_id: alarm_action_id,
            device_id: device_id,
        };
        await this.settingsService.create_alarm_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Alarm device created successfully.',
            message_th: 'สร้าง Alarm device สำเร็จ.',
        });
    }
    async delete_alarm__devices(res, query, headers, params, req) {
        const alarm_action_id = Number(query.alarm_action_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            alarm_action_id: alarm_action_id,
            device_id: device_id,
        };
        await this.settingsService.delete_alarm_device_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Alarm device delete successfully.',
            message_th: 'ลบ Scheduled สำเร็จแล้ว.',
        });
    }
    async create_alarm_event_device(res, query, headers, params, req) {
        const alarm_action_id = Number(query.alarm_action_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            alarm_action_id: alarm_action_id,
            device_id: device_id,
        };
        await this.settingsService.create_alarm_device_event_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Alarm device created successfully.',
            message_th: 'สร้าง Scheduled สำเร็จ.',
        });
    }
    async delete_alarm_event_devices(res, query, headers, params, req) {
        const alarm_action_id = Number(query.alarm_action_id) || 1;
        const device_id = Number(query.device_id) || 1;
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
        var dtost = {
            alarm_action_id: alarm_action_id,
            device_id: device_id,
        };
        await this.settingsService.delete_alarm_device_event_map(dtost);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: null,
            message: 'Alarm device event delete successfully.',
            message_th: 'ลบ Alarm device event สำเร็จแล้ว.',
        });
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            var cases = 0;
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
            var rowResultData = await this.settingsService.scheduleprocess(filter);
            if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
            var today_name = '';
            var now_time = format.getCurrentTime();
            var now_time_cal = 3;
            var start_time = '';
            var end_time = '';
            var do_ststus = '';
            var ResultData = await this.settingsService.scheduleprocess(filter2);
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
                var location_name = ResultData[key].location_name;
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
                var control_url = 'http://localhost:3003/v1/mqtt/control?topic=' + mqtt_data_control + '&message=' + message_mqtt_control;
                var today_name = format.getCurrentDayname();
                var now_time = format.getCurrentTime();
                var now_time_1 = format.getCurrentTimeStatus(now_time, schedule_event_start);
                var now_time_2 = format.getCurrentTimeStatus(schedule_event_start, schedule_event_start);
                var now_time_1_s = format.getCurrentTimeStatusMsg(now_time, schedule_event_start);
                var now_time_2_s = format.getCurrentTimeStatusMsg(schedule_event_start, schedule_event_start);
                var date_now = format.getCurrentDatenow();
                var time_now = format.getCurrentTimenow();
                if ((today_status == 1) && (now_time_1 == now_time_2)) {
                    if (now_time_1 == '1' && now_time_2 == '1') {
                        var dataset = {
                            schedule_id: schedule_id,
                            device_id: device_id,
                            schedule_event_start: schedule_event_start,
                            date: date_now,
                            schedule_event: message_mqtt_control,
                        };
                        var log_count = await this.settingsService.scheduleprocesslog_count(dataset);
                        if (log_count >= 1) {
                            var log_count2 = await this.settingsService.scheduleprocesslog_count_status(dataset);
                            if (log_count2 == 0) {
                                var deviceData = await this.mqttService.getdevicedata(mqtt_data_value);
                                if (deviceData) {
                                    var devicecontrol = await this.mqttService.devicecontrol(mqtt_data_control, message_mqtt_control);
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
                                    await this.settingsService.update_scheduleprocesslog_v2(datasetupdate);
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
                                var devicecontrol = await this.mqttService.devicecontrols(mqtt_data_control, message_mqtt_control, message_control);
                            }
                            var now_time_s = timestamp;
                            var deviceData = await this.mqttService.getdevicedata(mqtt_data_value);
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
                                var subject = 'Schedule process ' + schedule_name + ' start ' + schedule_event_start + '  day ' + today_name;
                                var content = 'Schedule process ' + schedule_name + ' start ' + schedule_event_start + '  day ' + today_name + '  event ' + subject_event + '  date ' + date_now + '  time ' + time_now + ' device_id: ' + device_id;
                                var log_alarm_log = '';
                                if (log_count == 0) {
                                    var emails = [];
                                    for (const [k, v] of Object.entries(useractive)) {
                                        var email = useractive[k].email;
                                        emails.push(email);
                                        var mobile_number = useractive[k].mobile_number;
                                        var lineid = useractive[k].lineid;
                                        var user_arr = { email: email, mobile: mobile_number, lineid: lineid };
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
                const ProfileRs = {
                    device_id: device_id,
                    schedule_id: schedule_id,
                    schedule_name: schedule_name,
                    start: schedule_start,
                    event: event,
                    schedule_event: schedule_event,
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
                };
                tempDataoid.push(device_id);
                tempData.push(va);
                tempData2.push(ProfileRs);
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
                    data: tempData2,
                },
                message: 'ok',
                message_th: 'success',
            });
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
    async schedule_process_log_page(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 100000000000;
        var sort = query.sort;
        var keyword = query.keyword || '';
        var schedule_event_start = query.schedule_event_start || '';
        var day = query.day || '';
        var doday = query.doday || '';
        var dotime = query.dotime || '';
        var schedule_event = query.schedule_event || '';
        var device_status = query.device_status || '';
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
        var rowResultData = await this.settingsService.scheduleprocesslog_paginate(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.scheduleprocesslog_paginate(filter2);
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
    async create_devicealarmaction(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_devicealarmaction_chk(DataDto.action_name);
        if (Rs) {
            console.log('dto.sn=>' + DataDto.action_name);
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { sn: DataDto.action_name },
                message: 'The SN  duplicate this data cannot createddate.',
                message_th: 'ข้อมูล SN ' + DataDto.action_name + ' ซ้ำไม่สามารถเพิ่มได้.',
            });
            return;
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
    async create_alarmdevicepaginate(res, dto, DataDto, query, headers, params, req) {
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
        const Rs = await this.settingsService.get_setting_sn(DataDto.sn);
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
    async alarm_device_paginate(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var alarm_action_id = query.alarm_action_id || '';
        var status = query.status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = query.sort;
        filter.keyword = keyword || '';
        filter.status = query.status || '';
        filter.alarm_action_id = alarm_action_id || '';
        filter.event = query.event || '';
        filter.isCount = 1;
        let rowResultData = await this.settingsService.alarm_device_paginate(filter);
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
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.settingsService.alarm_device_paginate(filter2);
        let tempDataoid = [];
        for (const [key, va] of Object.entries(ResultData)) {
            var alarm_action_id = ResultData[key].alarm_action_id;
            var action_name = ResultData[key].action_name;
            var filter1 = {};
            filter1.alarm_action_id = alarm_action_id;
            var count_device = await this.settingsService.alarm_device_id_alarm_count(filter1);
            var filter3 = {};
            filter3.alarm_action_id = alarm_action_id;
            var count_device_event = await this.settingsService.alarm_device_id_event_count(filter3);
            var device_event = await this.settingsService.deviceeventmap(filter3);
            const DataRs = {
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
    async updatealarmstatus(res, dto, req) {
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
            const alarm_action_id = dto.alarm_action_id;
            if (!alarm_action_id) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: 'alarm_action_id is null.',
                    message_th: 'ไม่พบข้อมูล alarm_action_id.',
                });
            }
            const rsbucket = await this.settingsService.get_alarm_device(alarm_action_id);
            if (!rsbucket || rsbucket.length == 0) {
                return res.status(200).json({
                    statusCode: 200,
                    code: 404,
                    payload: dto,
                    message: `ไม่พบ alarm_action_id ${alarm_action_id}`,
                    message_th: `ไม่พบ alarm_action_id ${alarm_action_id}`,
                });
            }
            const valdata = ['status_warning', 'recovery_warning', 'status_alert', 'recovery_alert', 'email_alarm', 'line_alarm', 'telegram_alarm', 'sms_alarm', 'nonc_alarm', 'event', 'status'];
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
            const rt = await this.settingsService.update_alarm_device_status_val(alarm_action_id, DataUpdate);
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
    async scheduleprocesslogpaginate(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
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
        var rowResultData = await this.settingsService.scheduleprocesslogpaginate(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.scheduleprocesslogpaginate(filter2);
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
    async mqtterrorlogpaginate(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.mqttlogpaginate(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.mqttlogpaginate(filter2);
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
    async alarmlogpaginate(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpaginate(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpaginate(filter2);
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
    async alarmlogpaginateemail(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpaginateemail(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpaginateemail(filter2);
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
    async alarmlogpaginatecontrols(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpaginateecontrol(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpaginateecontrol(filter2);
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
    async alarmlogpaginateline(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpagline(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpagline(filter2);
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
    async alarmlogpaginatesms(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpagesms(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpagesms(filter2);
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
    async alarmlogpaginatetelegram(res, query, headers, params, req) {
        var device_id = query.device_id || '';
        var schedule_id = query.schedule_id || '';
        var page = Number(query.page) || 1;
        var pageSize = Number(query.pageSize) || 10;
        var sort = query.sort;
        var status = query.status;
        var keyword = query.keyword || '';
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
        var type_id_log = query.type_id_log || '';
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
        var rowResultData = await this.settingsService.alarmlogpaginatetelegram(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarmlogpaginatetelegram(filter2);
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
    async alarmlogpaginatecontrol(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 1000;
        var alarm_action_id = query.alarm_action_id || '';
        var status = query.status || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        var device_id = query.device_id || '';
        var sort = query.sort;
        var status = query.status;
        var type_id = query.type_id || '';
        var location_id = query.location_id || '';
        var event = query.event || '';
        var bucket = query.bucket || '';
        var start = query.start || '';
        var end = query.end || '';
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
        var rowResultData = await this.settingsService.alarm_processlog_page_temp_control(filter);
        if (rowResultData == "" || !rowResultData || rowResultData.status == '422') {
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
        var ResultData = await this.settingsService.alarm_processlog_page_temp_control(filter2);
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
    async handleMqttError(deviceInfo) {
        const { alarm_action_id, device_id, type_id, event, alarm_type_id, status_warning, recovery_warning, status_alert, recovery_alert } = deviceInfo;
        const inputCreate = {
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
            content: 'Mqtt Error Connect'
        };
        const now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
        const date_now = format.getCurrentDatenow();
        const setdatachk = {
            alarm_action_id,
            device_id,
            type_id,
            date: date_now
        };
        const count_alarm = Number(await this.settingsService.count_alarmprocesslogmqtt(setdatachk));
        if (count_alarm >= 3) {
            const setdata_chk_delete = {
                alarm_action_id,
                device_id,
                type_id: alarm_type_id,
                date_now: format.getCurrentDatenow()
            };
            await this.settingsService.delete_alarmprocesslog_mqtt(setdata_chk_delete);
        }
        const log_alarm_logs = await this.settingsService.chk_alarmprocesslogmqtt(setdatachk);
        let now_time_cal = 0;
        if (count_alarm >= 1) {
            const log_time = format.timeConvertermas(format.convertTZ(log_alarm_logs[0].createddate, process.env.tzString));
            now_time_cal = Number(format.diffMinutes(now_time_full, log_time));
        }
        const time_lifes = 10;
        if (count_alarm == 0 && now_time_cal > time_lifes) {
            await this.settingsService.create_alarmprocesslogmqtt(inputCreate);
            await this.settingsService.create_alarmprocesslogtemp(inputCreate);
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            var cachetimeset = 300;
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
            var filter_md5 = md5(query.device_id + query.keyword + query.mqtt_id + query.bucket + query.type_id);
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
                var rs = { keycache: `${kaycache_cache}`, time: cachetimeset, data: ResultData };
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
                        var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
                    deviceactive: ResultDataRS
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamps = datePart + ' ' + timePart;
            var date_now = format.getCurrentDatenow();
            var time_now = format.getCurrentTimenow();
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            ;
            var cachetimeset1 = parseInt('30');
            ;
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
                var useractiveRs = { keycache: `${kaycache_cache_user}`, time: cachetimeset, data: useractive };
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
            var kaycache_cache = 'alarmdevicestatus_row_' + filter_md5;
            var row = {};
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var rowResultData = await Cache.GetCacheData(kaycache_cache);
            if (rowResultData) {
                var row = rowResultData;
            }
            else if (!rowResultData) {
                var rowResultData = await this.settingsService.alarm_device_paginate_status(filter);
                var row = rowResultData;
                var rowResultData = { keycache: `${kaycache_cache}`, time: cachetimeset, data: rowResultData };
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
            var kaycache_cache = 'alarmdevicestatus_rs_' + filter2_md5;
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
                var ResultData = await this.settingsService.alarm_device_paginate_status(filter2);
                var rs = { keycache: `${kaycache_cache}`, time: cachetimeset, data: ResultData };
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
                var kaycachecache = 'alarmdevice_rs_' + alarm_action_id_master;
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
                        var rs = { keycache: `${kaycachecache}`, time: cachetimeset, data: alarmdevice };
                        await Cache.SetCacheData(rs);
                        var cache_data_alarmdevice = 'no cache';
                    }
                    catch (error) {
                        console.error('Error fetching alarm device:', error);
                        alarmdevice = [];
                    }
                    var rs = { keycache: `${kaycachecache}`, time: cachetimeset, data: alarmdevice };
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
                            sms_alarm
                        };
                        var mqttrs = await this.mqttService.getMqttTopicPA1(mqtt_data_value, deletecache);
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
                        var getAlarmDetails = await this.settingsService.getAlarmDetailValidate(filterAlarmValidate);
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
                        var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
                        fillterAlarm.messageMqttControl = getAlarmDetails.messageMqttControl;
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
                            var rs = { keycache: `${kaycachecache_ctl}`, time: cachetimeset, data: alarmdevice_ctl };
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
                                    date: date_now2
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
                                fillterAlarmCtl.messageMqttControl = getAlarmDetails.messageMqttControl;
                                fillterAlarmCtl.sensor_data = getAlarmDetails.sensor_data;
                                fillterAlarmCtl.count_alarm = getAlarmDetails.count_alarm;
                                fillterAlarmCtl.value_data = getAlarmDetails.value_data;
                                fillterAlarmCtl.value_alarm = getAlarmDetails.value_alarm;
                                fillterAlarmCtl.value_relay = getAlarmDetails.value_relay;
                                fillterAlarmCtl.device_id_val = device_id_val;
                                fillterAlarmCtl.device_id2 = device_id2;
                                fillterAlarmCtl.device_id_mas = device_id_val;
                                fillterAlarmCtl.device_id = device_id;
                                fillterAlarmCtl.value_control_relay = getAlarmDetails.value_control_relay;
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
                                            fillterAlarmCtl.createddate_logs_control = createddate_logs_control;
                                            fillterAlarmCtl.now_time_cal_control = now_time_cal_control;
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
                                    fillterAlarmToCtl.device_id_mas = fillterAlarmCtl.device_id_mas;
                                    fillterAlarmToCtl.device_id = fillterAlarmCtl.device_id;
                                    fillterAlarmToCtl.time_life = fillterAlarmCtl.time_life;
                                    fillterAlarmToCtl.now_time_cal_control = fillterAlarmCtl.now_time_cal_control;
                                    if (device_id_val != device_id2 && type_id2 > 1) {
                                        alarmdevice_arr_rs.push({
                                            alarm_action_id: alarm_action_id,
                                            device_id_main: device_id_val,
                                            device_id_val,
                                            device_id: device_id2,
                                            type_id: type_id,
                                            type_id2: type_id2,
                                            mqtt_id: mqtt_id,
                                            mqtt_name: mqtt_name,
                                            device_name: device_name,
                                            type_name: type_name,
                                            bucket: device_bucket,
                                            bucket_main,
                                            alarm_to_control: alarm_to_control,
                                            mqttData: fillterAlarmToCtl.mqttData,
                                            subject,
                                            content,
                                            type_ctl,
                                            time_life,
                                            crsmaster_control_logs_count,
                                            now_time_cal_control: fillterAlarmCtl.now_time_cal_control,
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
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var kaycachecache = 'alarm_device_id_event_rss_iot_crt' + md5(alarm_action_id + '-' + device_id + '-' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycachecache);
        }
        var device = await Cache.GetCacheData(kaycachecache);
        if (device) {
            var device = device;
        }
        else if (!device) {
            var device = await this.settingsService.alarm_device_id_event_crt(deviceFillter);
            var rs = { keycache: `${kaycachecache}`, time: cachetimeset, data: device };
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
            count_arry: { status_del, parsedCount, countAlarmDeviceControl, validate_count },
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
            recovery_alert: dto.recovery_alert
        };
        return await Rss;
    }
    async alarm_to_control_rss(dto) {
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            subject: subject,
            content: content,
        };
        var deviceFillter = {
            alarm_action_id: alarm_action_id,
            device_id: dto.device_id,
            bucket: bucket,
        };
        var kaycachecache = 'alarm_device_id_event_rss_iot_crt' + md5(alarm_action_id + '-' + device_id + '-' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycachecache);
        }
        var device = await Cache.GetCacheData(kaycachecache);
        if (device) {
            var device = device;
        }
        else if (!device) {
            var device = await this.settingsService.alarm_device_id_event_crt(deviceFillter);
            var rs = { keycache: `${kaycachecache}`, time: cachetimeset, data: device };
            await Cache.SetCacheData(rs);
            var cache_data_alarmdevice = 'no cache';
        }
        if (alarmStatusSet == 1 || alarmStatusSet == 2) {
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
                var isDuplicate = await this.settingsService.checkDuplicateLogOne(inputCreate);
                if (!isDuplicate) {
                    await this.settingsService.manageAlarmLogRecovery(inputCreate, fillterData, validate_count);
                }
                await this.mqtt_control_device(mqtt_access_control, messageMqttControls);
            }
            else {
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
                var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id_mas;
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
                        setdatachk_main.device_id = device_id_mas;
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
                                var device_id = rs.device_id;
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
        else if (alarmStatusSet == 3 || alarmStatusSet == 4) {
            var rs = await this.device_access_control_check(dtos);
            var mqttconnect = [];
            var setdatachk_main = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
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
                        var mqtt_data_control = va.mqtt_data_control;
                        var measurement = va.measurement;
                        var mqtt_control_on = va.mqtt_control_on;
                        var mqtt_control_off = va.mqtt_control_off;
                        var bucket = va.bucket;
                        var timestamp = va.timestamp;
                        var mqtt_device_name = va.mqtt_device_name;
                        var id = va.id;
                        var alarm_action_ids = va.alarm_action_id;
                        var device_id = rs.device_id;
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
            if (countalarm_LogSensor >= validate_count) {
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.alarm_status = alarmStatusSet;
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
                        var device_id = rs.device_id;
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
        else if (alarmStatusSet == 999) {
            const fillter_device_control = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
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
            }
            if (countAlarmDeviceControl >= validate_count) {
                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
            }
            var setdatachk_main = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
            if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
                var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
            }
            else {
                var createddate_logs_control = null;
            }
            var countalarmLogSensor = crsmaster.length;
            var parsedCount = parseInt(countalarmLogSensor);
            if (parsedCount >= validate_count) {
                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
            }
        }
        var Rss = {
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
            filter: { dto, dtos, device }
        };
        return await Rss;
    }
    async alarm_to_control_rss1(dto) {
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var date_now = format.getCurrentDatenow();
        var time_now = format.getCurrentTimenow();
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            subject: subject,
            content: content,
        };
        var deviceFillter = {
            alarm_action_id: alarm_action_id,
            device_id: dto.device_id,
            bucket: bucket,
        };
        var kaycachecache = 'alarm_device_id_event_rss' + md5(alarm_action_id + '-' + device_id + '-' + bucket);
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycachecache);
        }
        var device = await Cache.GetCacheData(kaycachecache);
        if (device) {
            var device = device;
        }
        else if (!device) {
            var device = await this.settingsService.alarm_device_id_event_rss(deviceFillter);
            var rs = { keycache: `${kaycachecache}`, time: cachetimeset, data: device };
            await Cache.SetCacheData(rs);
            var cache_data_alarmdevice = 'no cache';
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
            const fillter_device_control = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
            var countAlarmDeviceControl = 0;
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
                var isDuplicate = await this.settingsService.checkDuplicateLogOne(inputCreate);
                if (!isDuplicate) {
                    await this.settingsService.manageAlarmLogRecoveryOne(inputCreate, fillterData, validate_count);
                }
                await this.mqtt_control_device(mqtt_data_control, messageMqttControls);
            }
            else {
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
                var now_time_full = format.timeConvertermas(format.convertTZ(format.getCurrentFullDatenow(), process.env.tzString));
                var setdatachk_main = {};
                setdatachk_main.alarm_action_id = alarm_action_id;
                setdatachk_main.device_id = device_id_mas;
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
                        setdatachk_main.device_id = device_id_mas;
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
                                var device_id = rs.device_id;
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
            var rs = await this.device_access_control_check(dtos);
            var mqttconnect = [];
            var setdatachk_main = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
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
                        var mqtt_data_control = va.mqtt_data_control;
                        var measurement = va.measurement;
                        var mqtt_control_on = va.mqtt_control_on;
                        var mqtt_control_off = va.mqtt_control_off;
                        var bucket = va.bucket;
                        var timestamp = va.timestamp;
                        var mqtt_device_name = va.mqtt_device_name;
                        var id = va.id;
                        var alarm_action_ids = va.alarm_action_id;
                        var device_id = rs.device_id;
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
            if (countalarm_LogSensor >= validate_count) {
                const fillter_device_control = {};
                fillter_device_control.alarm_action_id = alarm_action_id;
                fillter_device_control.alarm_status = alarmStatusSet;
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
                        var device_id = rs.device_id;
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
        else if (alarmStatusSet == 999) {
            const fillter_device_control = {};
            fillter_device_control.alarm_action_id = alarm_action_id;
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
            }
            if (countAlarmDeviceControl >= validate_count) {
                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
            }
            var setdatachk_main = {};
            setdatachk_main.alarm_action_id = alarm_action_id;
            setdatachk_main.device_id = device_id_mas;
            var crsmaster = await this.settingsService.chk_alarm_temp_log_desc(setdatachk_main);
            if (crsmaster && crsmaster.length > 0 && crsmaster[0].createddate) {
                var createddate_logs_control = format.timeConvertermas(format.convertTZ(crsmaster[0].createddate, process.env.tzString));
            }
            else {
                var createddate_logs_control = null;
            }
            var countalarmLogSensor = crsmaster.length;
            var parsedCount = parseInt(countalarmLogSensor);
            if (parsedCount >= validate_count) {
                await this.settingsService.delete_alarmprocesslogal(fillter_device_control);
            }
        }
        var Rss = {
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
            deviceCount: device.length
        };
        return await Rss;
    }
    async mqtt_control_device(mqtt_data_control, messageMqttControls) {
        var _a;
        try {
            var topic_sends = encodeURI(mqtt_data_control);
            var message_sends = encodeURI(messageMqttControls);
            var devicecontrol = await this.mqttService.devicecontrol(topic_sends, message_sends);
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
                var rs = { keycache: `${kaycache_cache_a1}`, time: cachetimeset, data: crsmasterio };
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
                var rs = { keycache: `${kaycache_cache_ctl}`, time: cachetimeset_ctl, data: device_control };
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            if ((!mqtt_data_value) || mqtt_data_value == undefined) {
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
            var mqttrs = await this.mqttService.getMqttTopicPA1(mqtt_data_value, deletecache);
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamps = datePart + ' ' + timePart;
            var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
            if ((!mqtt_data_value) || mqtt_data_value == undefined) {
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
            var MQTTGETDATA = await this.mqttService.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
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
                    var alarmStatusSet = Number(888);
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
                    var msg2 = '-----------------alarmStatusSet ' + alarmStatusSet + '------------------------';
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
                    fillter_device_control
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
                        if (values.device_id == device_id_mas) { }
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
                                    console.log(`topic_sends=>` + topic_sends + ` message_sends=>` + message_sends);
                                    var devicecontrol = await this.mqttService.devicecontrol(topic_sends, message_sends);
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
                                        subject: subject + ` 1-Control ` + device_status + ` device ` + device_name,
                                        content: content + ` 1-Control ` + device_status + `  device ` + device_name + ` Type ` + type_control_name,
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
                                    console.log(`topic_sends=>` + topic_sends + ` message_sends=>` + message_sends);
                                    var devicecontrol = await this.mqttService.devicecontrol(topic_sends, message_sends);
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
                                        subject: subject + ` 1-Control ` + device_status + ` device ` + device_name,
                                        content: content + ` 1-Control ` + device_status + `  device ` + device_name + ` Type ` + type_control_name,
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
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var checkConnectionMqtt = await this.mqttService.checkConnectionStatusMqtt();
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
        var alarmStatusSet = alarmStatusSet;
        var alarmStatusSet = dto.alarmStatusSet;
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
        var setdatachk_main_email = {};
        setdatachk_main_email.alarm_action_id = alarm_action_id;
        setdatachk_main_email.device_id = device_id;
        setdatachk_main_email.event = event;
        setdatachk_main_email.time_life = time_life;
        setdatachk_main_email.bucket = bucket;
        setdatachk_main_email.device_name = device_name;
        setdatachk_main_email.status_alert = status_alert;
        setdatachk_main_email.status_warning = status_warning;
        try {
            var crsmasterio = await this.settingsService.chk_alarmprocesslogemail(setdatachk_main_email);
            var count_alarm_master_email = (crsmasterio === null || crsmasterio === void 0 ? void 0 : crsmasterio.length) || 0;
        }
        catch (error) {
            console.error('Error checking alarm process log:', error);
            var count_alarm_master_email = 0;
        }
        if (crsmasterio) {
            var count_alarm_master_email = count_alarm_master_email;
            var rssDeta = crsmasterio[0];
        }
        else {
            var count_alarm_master_email = parseInt('0');
            var rssDeta = '';
        }
        if (count_alarm_master_email == 0) {
            var access_email = this.device_access_email_new(dto);
        }
        else {
            var access_email = this.device_access_email_check(dto);
        }
        var Rss = {
            status: dto.status,
            count_alarm_master_email,
            setdatachk_main_email,
            access_email
        };
        return Rss;
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
            if ((!mqtt_data_value) || mqtt_data_value == undefined) {
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
            const MQTTGETDATA = await this.mqttService.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
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
                else { }
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
            if ((!mqtt_data_value) || mqtt_data_value == undefined) {
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
            const MQTTGETDATA = await this.mqttService.getdevicedataDirec(mqtt_data_value);
            if (MQTTGETDATA) {
                const mqttrs = await this.mqttService.getdevicedataAll(mqtt_data_value);
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
                    var alarmStatusSet = Number(888);
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
                    var msg2 = '-----------------alarmStatusSet ' + alarmStatusSet + '------------------------';
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
                        else {
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
                        getdeviceactivemqttAlarmEmail
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
    async parseMqttData(dataString) {
        const parts = dataString.split(',');
        return {
            device: parts[0],
            name: parseFloat(parts[1]),
            data: parts
        };
    }
    async devicemoniiterRS(query) {
        var option = query.option;
        if (!option) {
            var option = parseInt('2');
        }
        var filter = {};
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
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter);
        format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_air(filter);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = timestamps;
            var sensor_data_name = subject;
            const DataRs = {
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
                status_remart: '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
                timestamp,
                sensor_data_name,
                createddate,
                location_id: rs.location_id,
                location_name: rs.location_name,
                devicename: rs.device_name,
                mqtt_name: rs.mqtt_name,
                type_name: rs.type_name,
                mqtt_bucket: rs.mqtt_bucket,
                main_status_warning,
                main_status_alert,
                main_type_id,
                date,
                time,
            };
            tempData.push(va);
            tempData2.push(DataRs);
        }
        return tempData2;
    }
    async devicemoniiterRSS(query) {
        var filter = {};
        filter.sort = query.sort;
        filter.keyword = query.keyword || '';
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
        const deletecache = query.deletecache || 0;
        var cachekey = 'device_list_alarm_air' + md5(filter);
        var date = format.getCurrentDatenow();
        var time = format.getCurrentTimenow();
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamps = datePart + ' ' + timePart;
        var tempData2 = [];
        let ResultData = await this.settingsService.device_list_ststus_alarm_airs(filter);
        let tempData = [];
        let tempDataoid = [];
        for (var [key, va] of Object.entries(ResultData)) {
            var rs = ResultData[key];
            var evice_id = rs.evice_id;
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
            var mqttdata = await this.mqttService.getdevicedataMqtt(mqtt_data_value);
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
                var status = getAlarmDetails.status;
            }
            else {
                var subject = 'Normal';
                var status = getAlarmDetails.status;
            }
            var timestamp = timestamps;
            var sensor_data_name = subject;
            const DataRs = {
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
                status_remart: '1-Warning ,2-Alarm ,3-Recovery Warning,4-Recovery Alarm ,5-Normal ',
                timestamp,
                sensor_data_name,
                createddate,
                location_id: rs.location_id,
                location_name: rs.location_name,
                devicename: rs.device_name,
                mqtt_name: rs.mqtt_name,
                type_name: rs.type_name,
                mqtt_bucket: rs.mqtt_bucket,
                main_status_warning,
                main_status_alert,
                main_type_id,
                date,
                time,
            };
            tempData.push(va);
            tempData2.push(DataRs);
        }
        return tempData2;
    }
    async getdeviceactivemqttAlarm(query) {
        try {
            var date = format.getCurrentDatenow();
            var time = format.getCurrentTimenow();
            var now = new Date();
            var pad = (num) => String(num).padStart(2, '0');
            var datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            var filter_md5 = md5(query.device_id + query.keyword + query.mqtt_id + query.bucket + query.type_id);
            var kaycache_cache = 'device_active_ALL_mqtt_key_' + filter_md5;
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
                var rs = { keycache: `${kaycache_cache}`, time: cachetimeset, data: ResultData };
                await Cache.SetCacheData(rs);
                var cache_data_ResultData = 'no cache';
            }
            if (ResultData) {
                for (const [key, value] of Object.entries(ResultData)) {
                    var rs = ResultData[key];
                    var va = rs;
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
                    var model = rs.model;
                    var vendor = rs.vendor;
                    var comparevalue = rs.comparevalue;
                    var createddate = rs.createddate;
                    var updateddate = rs.updateddate;
                    var status = rs.status;
                    var unit = rs.unit;
                    var action_id = rs.action_id;
                    var status_alert_id = rs.status_alert_id;
                    var measurement = rs.measurement;
                    var mqtt_control_on = rs.mqtt_control_on;
                    var mqtt_control_off = rs.mqtt_control_off;
                    var device_org = rs.device_org;
                    var device_bucket = rs.device_bucket;
                    var timestamp = rs.timestamp;
                    var mqtt_device_name = rs.mqtt_device_name;
                    var devicemqtt_status_over_name_id = rs.mqtt_status_over_name;
                    var mqtt_status_data_name = rs.mqtt_status_data_name;
                    var mqtt_act_relay_name = rs.mqtt_act_relay_name;
                    var mqtt_control_relay_name = rs.mqtt_control_relay_name;
                    var evice_id = rs.evice_id;
                    var data_status = rs.data_status;
                    var mqtt_id = rs.mqtt_id;
                    var setting_id = rs.setting_id;
                    var type_name = rs.type_name;
                    var location_name = rs.location_name;
                    var mqtt_name = rs.mqtt_name;
                    var mqtt_org = rs.mqtt_org;
                    var mqtt_bucket = rs.mqtt_bucket;
                    var mqtt_envavorment = rs.mqtt_envavorment;
                    var latitude = rs.latitude;
                    var longitude = rs.longitude;
                    var mqtt_status_over_name = rs.mqtt_status_over_name;
                    var mqtt_status_data_name = rs.mqtt_status_data_name;
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
                        var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
                            fillter_device_control,
                            createddate_logs,
                            countalarm_LogIO,
                            createddate_logs_Email,
                            countalarm_LogIEmail,
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
                            fillter_device_control,
                            createddate_logs,
                            countalarm_LogIO,
                            createddate_logs_Email,
                            countalarm_LogIEmail,
                            mqttrs: 'Error',
                        };
                    }
                    if (alarmStatusSet != 999) {
                        ResultDataRS.push(arraydata);
                    }
                    else {
                        ResultDataRS.push(arraydata);
                    }
                }
            }
            return ResultDataRS;
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
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
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
            var filter_md5 = md5(query.device_id + query.keyword + query.mqtt_id + query.bucket + query.type_id);
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
                var rs = { keycache: `${kaycache_cache}`, time: cachetimeset, data: ResultData };
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
                        var status_report = { 1: 'Warning', 2: 'Alarm', 3: 'Recovery Warning', 4: 'Recovery Alarm', 5: 'Normal' };
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
                            sensor_data_name, status_warning,
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
                                time: { now_time_full, createddate_logs_Email, now_time_cal_main, time_life },
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
                            mqttrs_rs
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
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list scheduledevice' }),
    (0, common_1.Get)('listscheduledevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "findscheduledevice", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list scheduledevice' }),
    (0, common_1.Get)('testgemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "testgemail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list scheduledevice' }),
    (0, common_1.Get)('sendemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "sendemail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list scheduledevice' }),
    (0, common_1.Get)('findscheduledevicechk'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "findscheduledevicechk", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list setting' }),
    (0, common_1.Get)('listsetting'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_user_logs", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list setting' }),
    (0, common_1.Get)('settingall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "setting_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list location' }),
    (0, common_1.Get)('listlocation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_location", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'location_all' }),
    (0, common_1.Get)('locationall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "location_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list type' }),
    (0, common_1.Get)('listtype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_type", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'typeall' }),
    (0, common_1.Get)('typeall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_type_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'typeall' }),
    (0, common_1.Get)('devicetypeall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_device_type_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'typeall' }),
    (0, common_1.Get)('devicetypeallcontrol'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "devicetypeallcontrol", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list device type' }),
    (0, common_1.Get)('listdevicetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listdevicetype", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'typeall' }),
    (0, common_1.Get)('devicetypeall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_devicetype_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list sensor' }),
    (0, common_1.Get)('listsensor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_sensor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'sensor all' }),
    (0, common_1.Get)('sensorall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_sensor_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('createscheduledevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_schedule_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('deletescheduledevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_schedule_devices", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('lisgroup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_group", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'lisgroup' }),
    (0, common_1.Get)('lisgroupall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_group_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('listgrouppage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_group_page", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list mqtt' }),
    (0, common_1.Get)('lismqtt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_mqtt", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'lismqtt all' }),
    (0, common_1.Get)('lismqttall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_mqtt_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device all' }),
    (0, common_1.Get)('mqttdelete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqttdelete", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'api all' }),
    (0, common_1.Get)('apiall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_api_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'api list group' }),
    (0, common_1.Get)('listapipage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "api_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device all' }),
    (0, common_1.Get)('deviceall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_device_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device all' }),
    (0, common_1.Get)('deviceeditget'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "deviceeditget", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device all' }),
    (0, common_1.Get)('devicedetail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "devicedetail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device all' }),
    (0, common_1.Get)('devicedelete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "deviceedelete", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicepagess'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_listdevicepage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicepageactive1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_active1", null);
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
], SettingsController.prototype, "device_list_paginate_actives", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('mqttdata'),
    (0, swagger_1.ApiOperation)({ summary: 'mqttdata' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqttdata", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageall'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepagesensor'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_sensor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageallactive'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_all_active", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicepageallactiveschedule'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_all_active_schedule", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('scheduledevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "scheduledevicepage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('schedulelist'),
    (0, swagger_1.ApiOperation)({ summary: 'lists chedule list' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "schedulelist", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicealarm'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_alarm", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicealarmairV1'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_alarm_air", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Get)('listdevicealarmair'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listdevicealarmair", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicealarmall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "deviceactivemqtttalarm", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('_listdevicealarmfan'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "_device_list_alarm_fan", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicealarmfan'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_alarm_fan", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'devicemonitor' }),
    (0, common_1.Get)('_devicemonitor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "_devicemonitor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'devicemonitor' }),
    (0, common_1.Get)('devicemonitor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "devicemonitor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'devicemonitor' }),
    (0, common_1.Get)('devicemonitors'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "devicemonitors", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'device list group' }),
    (0, common_1.Get)('listdevicealarmlimit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_alarm_limit", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list email' }),
    (0, common_1.Get)('listemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "email_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'email all' }),
    (0, common_1.Get)('emailall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_email_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list mqtthost' }),
    (0, common_1.Get)('listmqtthost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqtthost_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'email all' }),
    (0, common_1.Get)('mqtthostall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_mqtthost_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'host all' }),
    (0, common_1.Get)('hostall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_host_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'host list ' }),
    (0, common_1.Get)('listhostpage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "host_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'influxdb list' }),
    (0, common_1.Get)('listinfluxdbpage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "influxdb_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'influxdb all' }),
    (0, common_1.Get)('influxdball'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_influxdb_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'mqtt list paginate' }),
    (0, common_1.Get)('listmqttpaginateactive'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqtt_list_active_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'mqtt list paginate' }),
    (0, common_1.Get)('listmqttpaginate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqtt_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'mqtt list paginate' }),
    (0, common_1.Get)('listmqttdevicepaginate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqtt_list_device_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'line all' }),
    (0, common_1.Get)('lineall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_line_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'line list group' }),
    (0, common_1.Get)('listlinepage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "line_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'nodered all' }),
    (0, common_1.Get)('noderedall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_nodered_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'nodered list paginate' }),
    (0, common_1.Get)('listnoderedpaginate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "nodered_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'schedule all' }),
    (0, common_1.Get)('scheduleall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_schedule_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'scheduled list paginate' }),
    (0, common_1.Get)('listschedulepage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "schedule_list_page", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'sms all' }),
    (0, common_1.Get)('smsall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_sms_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'sms list group' }),
    (0, common_1.Get)('listsmspage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "sms_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'token all' }),
    (0, common_1.Get)('tokenall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_token_all", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'token ' }),
    (0, common_1.Get)('tokensmspage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "token_list_paginate", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createsetting'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_setting_dto_1.CreateSettingDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_setting", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createlocation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_location_dto_1.CreateLocationDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_location", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createtype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_type_dto_1.CreateTypeDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_type", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createdevicetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_type_dto_1.CreateTypeDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_device_type", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createsensor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_sensor_dto_1.CreateSensorDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_sensor", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('creategroup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_group_dto_1.CreateGroupDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_group", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createmqtt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mqtt_dto_1.CreateMqttDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_mqtt", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('mqtttsort'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_mqttt_sort", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createapi'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_api_dto_1.ApiDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_api", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_device_dto_1.DeviceDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_device", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_email_dto_1.EmailDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_email", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createmqtthost'),
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
], SettingsController.prototype, "create_mqtthost", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createhost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_host_dto_1.HostDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_host", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createinfluxdb'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_influxdb", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createline'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_line", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createnodered'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_nodered_dto_1.NoderedDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_nodered", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createschedule'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.SchedulDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_schedule", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createscheduledevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_scheduledevice_dto_1.scheduleDevice, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_scheduleDevice", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createsms'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_sms", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createtoken'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_token_dto_1.TokenDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_token", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createtelegram'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_telegram_dto_1.TelegramDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_telegram", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('deviceactionuser'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_device_action_user_dto_1.DeviceActionuserDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "Deviceactionuser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_setting' }),
    (0, common_1.Post)('updatesetting'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_setting", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_location' }),
    (0, common_1.Post)('updatelocation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_location", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_type' }),
    (0, common_1.Post)('updatetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_type", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_device_type' }),
    (0, common_1.Post)('updatedevicetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_device_type", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_sensor' }),
    (0, common_1.Post)('updatesensor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_sensor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_group' }),
    (0, common_1.Post)('updategroup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_group", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_mqtt' }),
    (0, common_1.Post)('updatemqtt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_mqtt", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updatemqttstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, updatemqttstatus_dto_1.updatemqttstatusDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_mqtt_status", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_api' }),
    (0, common_1.Post)('updateapi'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_api", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_device' }),
    (0, common_1.Post)('updatedevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_email' }),
    (0, common_1.Post)('updateemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_email", null);
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
], SettingsController.prototype, "updateemailstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtthost' }),
    (0, common_1.Post)('updatemqtthost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_mqtthost", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update _mqtthost status' }),
    (0, common_1.Post)('updatemqtthoststatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_mqtthoststatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_host' }),
    (0, common_1.Post)('updatehost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_host", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_influxdb' }),
    (0, common_1.Post)('updateinfluxdb'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_influxdb", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updateinfluxdbstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateinfluxdbstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_line' }),
    (0, common_1.Post)('updateline'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_line", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_nodered' }),
    (0, common_1.Post)('updatenodered'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_nodered", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updatenoderedstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatenoderedstatus", null);
__decorate([
    (0, common_1.Post)('updateschedule'),
    (0, swagger_1.ApiOperation)({ summary: 'update_schedule' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_schedule", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_sms' }),
    (0, common_1.Post)('updatesms'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_sms", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updatelinestatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatelinestatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updatesmsstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatesmsstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_token' }),
    (0, common_1.Post)('updatetoken'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_token", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update status device id' }),
    (0, common_1.Post)('updatestatusdeviceid'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_status_deviceid", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update schedule status' }),
    (0, common_1.Post)('updateschedulestatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_schedule_status", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update schedule status' }),
    (0, common_1.Post)('updatescheduledaystatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_schedule_day_status", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_setting' }),
    (0, common_1.Get)('deletesetting'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_setting", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('deletesetting'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('setting_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_setting_del", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update_telegram' }),
    (0, common_1.Post)('updatetelegram'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_telegram", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_location' }),
    (0, common_1.Get)('deletelocation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_location", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_type' }),
    (0, common_1.Get)('deletetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_type", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_device_type' }),
    (0, common_1.Get)('deletedevicetype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_device_type", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_sensor' }),
    (0, common_1.Get)('deletesensor'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_sensor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_group' }),
    (0, common_1.Get)('deletegroup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_group", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_mqtt' }),
    (0, common_1.Get)('deletemqtt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_mqtt", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_api' }),
    (0, common_1.Get)('deleteapi'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_api", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_device' }),
    (0, common_1.Get)('deletedevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_email' }),
    (0, common_1.Get)('deleteemail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_email", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'deletemqtthost' }),
    (0, common_1.Get)('deletemqtthost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_emqtthost", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_host' }),
    (0, common_1.Get)('deletehost'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_host", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_influxdb' }),
    (0, common_1.Get)('deleteinfluxdb'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_influxdb", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_line' }),
    (0, common_1.Get)('deleteline'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_line", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_nodered' }),
    (0, common_1.Get)('deletenodered'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_nodered", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_schedule' }),
    (0, common_1.Get)('deleteschedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_schedule", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_sms' }),
    (0, common_1.Get)('deletesms'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_sms", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_token' }),
    (0, common_1.Get)('deletetoken'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_token", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_device_schedule_id' }),
    (0, common_1.Get)('deletedeviceschedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_device_schedule_id", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_deviceandschedule' }),
    (0, common_1.Get)('deletedeviceandschedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_device_and_schedule", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_telegram' }),
    (0, common_1.Get)('deletetelegram'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_telegram", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listdevicescheduledata'),
    (0, swagger_1.ApiOperation)({ summary: 'list device page active' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listdevicescheduledata", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_armdevice' }),
    (0, common_1.Get)('deletearmdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_armdevice", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'delete_armdevice' }),
    (0, common_1.Get)('deletearmdevicev2'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_armdevice_v2", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createalarmDevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_device_alarmaction_dto_1.DevicealarmactionDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_alarmDevice", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update alarm device' }),
    (0, common_1.Post)('updatealarmdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update_alarm_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listalarmdevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list alarm device page all' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_alarm_device_page", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listalarmeventdevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list alarm event device page all' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "list_alarm_event_device_page", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('listalarmeventdevicecontrolpage'),
    (0, swagger_1.ApiOperation)({ summary: 'list alarm event device page all' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listalarmeventdevicecontrolpage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('activealarmdevicepage'),
    (0, swagger_1.ApiOperation)({ summary: 'list alarm event device page all' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_list_paginate_alarm_active", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('activealarmeventdeviceeventpage'),
    (0, swagger_1.ApiOperation)({ summary: 'list alarm event device page all' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "device_event_list_paginate_alarm_active", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('createalarmdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_alarm_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('deletealarmdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_alarm__devices", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('createalarmeventdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_alarm_event_device", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'list group' }),
    (0, common_1.Get)('deletealarmeventdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "delete_alarm_event_devices", null);
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
], SettingsController.prototype, "scheduleproces", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('scheduleprocesslog'),
    (0, swagger_1.ApiOperation)({ summary: 'schedule process' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "schedule_process_log_page", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createdevicealarmaction'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_device_alarmaction_dto_1.DevicealarmactionDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_devicealarmaction", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('createalarmdevicepaginate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Headers)()),
    __param(5, (0, common_1.Param)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_setting_dto_1.CreateSettingDto, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create_alarmdevicepaginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'alarm device paginate' }),
    (0, common_1.Get)('alarmdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarm_device_paginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'update alarm status' }),
    (0, common_1.Post)('updatealarmstatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updatealarmstatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('scheduleprocesslogpaginate'),
    (0, swagger_1.ApiOperation)({ summary: 'schedule process log paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "scheduleprocesslogpaginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('mqtterrorlogpaginate'),
    (0, swagger_1.ApiOperation)({ summary: 'mqtt error log paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "mqtterrorlogpaginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginate'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginate", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginateemail'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log email paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginateemail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginatecontrols'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log controls paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginatecontrols", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginateline'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log line paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginateline", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginatesms'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log sms paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginatesms", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginatetelegram'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log telegram paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginatetelegram", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('alarmlogpaginatecontrol'),
    (0, swagger_1.ApiOperation)({ summary: 'alarm log paginate' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "alarmlogpaginatecontrol", null);
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
], SettingsController.prototype, "deviceactivemqttAlarm", null);
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
], SettingsController.prototype, "alarmdevicestatus", null);
SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [mqtt_service_1.MqttService,
        settings_service_1.SettingsService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], SettingsController);
exports.SettingsController = SettingsController;
//# sourceMappingURL=nna_settings.controller.js.map