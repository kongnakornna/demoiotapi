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
exports.SyslogController = void 0;
const common_1 = require("@nestjs/common");
var moment = require('moment');
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const jwt_1 = require("@nestjs/jwt");
const format = __importStar(require("../../helpers/format.helper"));
const auth_guarduser_1 = require("../auth/auth.guarduser");
const { passwordStrength } = require('check-password-strength');
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const roles_service_1 = require("../roles/roles.service");
const syslog_service_1 = require("./syslog.service");
const create_syslog_type_dto_1 = require("./dto/create-syslog-type.dto");
let SyslogController = class SyslogController {
    constructor(syslogService, rolesService, usersService, authService, jwtService) {
        this.syslogService = syslogService;
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async listuserlog(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 20;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'create-DESC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = keyword;
        filter.status = status;
        filter.log_type_id = query.log_type_id;
        filter.select_status = query.select_status;
        filter.insert_status = query.insert_status;
        filter.update_status = query.update_status;
        filter.delete_status = query.delete_status;
        filter.isCount = 1;
        let rowResultData = await this.syslogService.loglistpaginate(filter);
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
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
        let ResultData = await this.syslogService.loglistpaginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const id = ResultData[key].id || null;
            const DataRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].create, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].update, process.env.tzString)),
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
    async getdevice(res, query, headers, params, req) {
        let device = query.device;
        if (device === null || device === '') {
            var result = {
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
        const rss = await Cache.GetCacheData(device);
        var result = {
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
    async listuserlogs(res, query, headers, params, req) {
        const idx = query.id || '';
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 20;
        var status = query.status || '';
        let select_status = query.select_status || '';
        var sort = query.sort || 'create-DESC';
        let keyword = query.keyword || '';
        let filter = {};
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
        console.log(`filter =>` + filter);
        console.info(filter);
        let rowResultData = await this.syslogService.loglistpaginate(filter);
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
        let ResultData = await this.syslogService.loglistpaginate(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const id = ResultData[key].id || null;
            const ProfileRs = {
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
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].create, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].update, process.env.tzString)),
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
    async getlisttypelog(res, dto, query, headers, params, req) {
        var getlist = await this.syslogService.getlisttype();
        let ResultData2 = [];
        for (const [key, va] of Object.entries(getlist)) {
            const log_type_id = getlist[key].log_type_id || null;
            const RS = {
                log_type_id: getlist[key].log_type_id,
                type_name: getlist[key].type_name,
                type_detail: getlist[key].type_detail,
                status: getlist[key].status,
                createDate: format.timeConvertermas(format.convertTZ(getlist[key].create, process.env.tzString)),
                updateDate: format.timeConvertermas(format.convertTZ(getlist[key].update, process.env.tzString)),
            };
            ResultData2.push(RS);
        }
        var result = {
            statuscode: 200,
            message: 'list type',
            payload: ResultData2,
        };
        res.status(200).json(result);
        return;
    }
    async createtypelog(query, headers, params, req, res, TypeDto) {
        const rs = await this.syslogService.getlogtype(TypeDto.type_name);
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
        const data = await this.syslogService.createlogtype(TypeDto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: data,
            message: 'create type log successfully..',
            message_th: 'สร้างประเภทข้อมูลสำเร็จ..',
        });
        return;
    }
    async createlog(query, headers, params, req, res, dto) {
        console.log('dto=>');
        console.info(dto);
        let datainput = {};
        if (dto.log_type_id) {
            datainput.log_type_id = dto.log_type_id;
        }
        if (dto.uid) {
            datainput.uid = dto.uid;
        }
        if (dto.name) {
            datainput.name = dto.name;
        }
        if (dto.detail) {
            datainput.detail = dto.detail;
        }
        if (dto.select_status) {
            datainput.select_status = dto.select_status || 0;
        }
        if (dto.insert_status) {
            datainput.insert_status = dto.insert_status || 0;
        }
        if (dto.update_status) {
            datainput.update_status = dto.update_status || 0;
        }
        if (dto.delete_status) {
            datainput.delete_status = dto.delete_status || 0;
        }
        if (dto.status) {
            datainput.status = dto.status || 1;
        }
        if (dto.lang) {
            datainput.lang = dto.lang || "en";
        }
        const data = await this.syslogService.createlog(datainput);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: data,
            message: 'create log successfully..',
            message_th: 'สร้าง log สำเร็จ..',
        });
        return;
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'list syslog' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "listuserlog", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'device data redis' }),
    (0, common_1.Get)('getdevice'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "getdevice", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'list syslog' }),
    (0, common_1.Get)('listuserlog'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "listuserlogs", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'listtype' }),
    (0, common_1.Get)('listtype'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "getlisttypelog", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.Post)('/createtypelog'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, create_syslog_type_dto_1.CreateSyslogTypeDto]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "createtypelog", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('/createlog'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SyslogController.prototype, "createlog", null);
SyslogController = __decorate([
    (0, common_1.Controller)('syslog'),
    __metadata("design:paramtypes", [syslog_service_1.SyslogService,
        roles_service_1.RolesService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], SyslogController);
exports.SyslogController = SyslogController;
//# sourceMappingURL=syslog.controller.js.map