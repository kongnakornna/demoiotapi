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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
var moment = require('moment');
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/auth.decorator");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("./users.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const jwt_1 = require("@nestjs/jwt");
const format = __importStar(require("../../helpers/format.helper"));
const auth_guarduser_1 = require("../auth/auth.guarduser");
const file_dto_1 = require("./dto/file.dto");
const forgeot_password_dto_1 = require("./dto/forgeot-password.dto");
const { passwordStrength } = require('check-password-strength');
let UsersController = class UsersController {
    constructor(usersService, authService, jwtService) {
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async Me(res, dto, query, headers, params, req) {
        const proFile = {
            uid: req.user.id,
            userCreatedatd: req.user.createddate,
            username: req.user.username,
            email: req.user.email,
            status: req.user.status,
            usertype: req.user.usertype,
            type: req.user.type,
        };
        const status = req.user.status;
        if (status == 0 || status == false) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! This username: ' +
                    req.user.username +
                    ' Email: ' +
                    req.user.email +
                    ' Inactive',
                payload: null,
            };
            res.status(200).json(result);
            return;
        }
        else {
            let jwt = req.headers.authorization.replace('Bearer ', '');
            const token = req.headers.authorization.replace('Bearer ', '').trim();
            let jsonString = this.jwtService.decode(token);
            let idx = jsonString.id;
            await this.authService.checkRefreshToken(idx);
            var decoded = {};
            var decoded = this.jwtService.decode(token);
            var iat = decoded.iat * 1000;
            var exp = decoded.exp * 1000;
            var d1 = new Date(iat);
            var d2 = new Date(exp);
            var EXPIRE_TIME = Number(exp - iat);
            var TokenDate = {
                EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
                signin_date: format.timeConvertermas(d1),
                expires_date: format.timeConvertermas(d2),
                token: jwt,
            };
            const Profiles = await this.usersService.getProfile(idx);
            const Profile = Profiles[0];
            const lastsignindates = format.convertTZ(Profile.lastsignindate, process.env.tzString);
            const lastsignindate2 = format.timeConvertermas(lastsignindates);
            const lastsignindate = format.timeConvertermas(format.convertTZ(Profile.lastsignindate, process.env.tzString));
            const ProfileRs = {
                uid: Profile.uid,
                role_id: Profile.roleid,
                email: Profile.email,
                username: Profile.username,
                firstname: Profile.firstname,
                lastname: Profile.lastname,
                fullname: Profile.fullname,
                nickname: Profile.nickname,
                idcard: Profile.idcard,
                lastsignindate: lastsignindate,
                network_id: Profile.network_id,
                infomation_agree_status: Profile.infomation_agree_status,
                gender: Profile.gender,
                birthday: Profile.birthday,
                online_status: Profile.online_status,
                message: Profile.message,
                type_id: Profile.type_id,
                avatarpath: Profile.avatarpath,
                avatar: Profile.avatar,
                loginfailed: Profile.loginfailed,
                refresh_token: Profile.refresh_token,
                createddate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Profile.updateddate, process.env.tzString)),
                deletedate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
            };
            var result = {
                statuscode: 200,
                message: 'proFile',
                payload: ProfileRs,
                tokenInfo: TokenDate,
            };
            res.status(200).json(result);
            return;
        }
    }
    async paginate(res, dto, query, headers, params, page = 1, limit = 10, req) {
        {
            limit = limit > 100 ? 100 : limit;
            return await this.usersService.paginate({
                page,
                limit,
                route: 'http://127.0.0.1/v1/user/paginate',
            });
        }
    }
    uploadFile(res, query, headers, params, req, body, file) {
        console.log('file: ' + file);
        return {
            body,
            file: file.buffer.toString(),
        };
    }
    uploadFileAndPassValidation(res, query, headers, params, req, body, file) {
        return {
            body,
            file: file === null || file === void 0 ? void 0 : file.buffer.toString(),
        };
    }
    uploadFileAndFailValidation(res, query, headers, params, req, body, file) {
        return {
            body,
            file: file.buffer.toString(),
        };
    }
    async listUser(res, query, headers, params, req) {
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 20;
        var status = query.status || '';
        let active_status = query.active || '';
        var sort = query.sort || 'createddate-ASC';
        let keyword = query.keyword || '';
        let filter = {};
        filter.sort = sort;
        filter.keyword = keyword;
        filter.status = status;
        filter.active_status = active_status;
        filter.isCount = 1;
        let rowResultData = await this.usersService.listpaginateAdmin(filter);
        const rowData = Number(rowResultData);
        const totalPages = Math.round(rowData / pageSize) || 1;
        let filter2 = {};
        filter2.sort = sort;
        filter2.keyword = keyword;
        filter2.status = status;
        filter2.active_status = active_status;
        filter2.page = page;
        filter2.pageSize = pageSize;
        filter2.isCount = 0;
        console.log(`filter2=`);
        console.info(filter2);
        let ResultData = await this.usersService.listpaginateAdmin(filter2);
        let tempData = [];
        let tempDataoid = [];
        let tempData2 = [];
        for (const [key, va] of Object.entries(ResultData)) {
            const uid = ResultData[key].uid || null;
            const lastsignindates = format.convertTZ(ResultData[key].lastsignindate, process.env.tzString);
            const lastsignindate2 = format.timeConvertermas(lastsignindates);
            const lastsignindate = format.timeConvertermas(format.convertTZ(ResultData[key].lastsignindate, process.env.tzString));
            const ProfileRs = {
                uid: ResultData[key].uid,
                role_id: ResultData[key].role_id,
                email: ResultData[key].email,
                username: ResultData[key].username,
                firstname: ResultData[key].firstname,
                lastname: ResultData[key].lastname,
                fullname: ResultData[key].fullname,
                nickname: ResultData[key].nickname,
                idcard: ResultData[key].idcard,
                lastsignindate: lastsignindate,
                status: ResultData[key].status,
                active_status: ResultData[key].active_status,
                network_id: ResultData[key].network_id,
                remark: ResultData[key].remark,
                infomation_agree_status: ResultData[key].infomation_agree_status,
                gender: ResultData[key].gender,
                birthday: ResultData[key].birthday,
                online_status: ResultData[key].online_status,
                message: ResultData[key].message,
                network_type_id: ResultData[key].network_type_id,
                public_status: ResultData[key].public_status,
                type_id: ResultData[key].type_id,
                avatarpath: ResultData[key].avatarpath,
                avatar: ResultData[key].avatar,
                loginfailed: ResultData[key].loginfailed,
                refresh_token: ResultData[key].refresh_token,
                mobile_number: ResultData[key].mobile_number,
                lineid: ResultData[key].lineid,
                public_notification: ResultData[key].public_notification,
                sms_notification: ResultData[key].sms_notification,
                email_notification: ResultData[key].email_notification,
                line_notification: ResultData[key].line_notification,
                phone_number: ResultData[key].phone_number,
                rolename: ResultData[key].rolename,
                role_type_id: ResultData[key].role_type_id,
                permision_name: ResultData[key].permision_name,
                permision_detail: ResultData[key].permision_detail,
                permision_created: ResultData[key].permision_created,
                permision_updated: ResultData[key].permision_updated,
                permision_insert: ResultData[key].permision_insert,
                permision_update: ResultData[key].permision_update,
                permision_delete: ResultData[key].permision_delete,
                permision_select: ResultData[key].permision_select,
                permision_log: ResultData[key].permision_log,
                permision_config: ResultData[key].permision_config,
                permision_truncate: ResultData[key].permision_truncate,
                createddate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(ResultData[key].updateddate, process.env.tzString)),
                deletedate: format.timeConvertermas(format.convertTZ(ResultData[key].createddate, process.env.tzString)),
            };
            tempDataoid.push(uid);
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
                filter2: filter2,
                data: tempData2,
            },
            message: 'success.',
            message_th: 'success.',
        });
    }
    async deleteprofile(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        let jwt = req.headers.authorization.replace('Bearer ', '');
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        console.log('token=>' + token);
        let jsonString = this.jwtService.decode(token);
        var uid = query.uid;
        if (!uid) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: null,
                message: 'uid is null.',
                message_th: 'ไม่พบข้อมูล.',
            });
            return;
        }
        else {
            const Profiles = await this.usersService.chkProfile(uid);
            if (!Profiles) {
                res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: null,
                    message: 'uid is null.',
                    message_th: 'ไม่พบข้อมูล.',
                });
                return;
            }
            if (Profiles) {
                await this.usersService.deleteUser(uid);
                res.status(200).json({
                    statusCode: 200,
                    code: 200,
                    uid: uid,
                    payload: null,
                    message: 'This User is deleted complete.',
                    message_th: 'ผู้ใช้รายนี้ถูกลบออกเรียบร้อยแล้ว',
                });
            }
            else {
                res.status(200).json({
                    statusCode: 200,
                    code: 400,
                    uid: uid,
                    payload: null,
                    message: 'This User not in database.',
                    message_th: 'ผู้ใช้นี้ไม่มีอยู่ในฐานข้อมูล',
                });
            }
        }
    }
    async profiledetail(res, dto, query, headers, params, req) {
        console.log('query');
        console.info(query);
        let jwt = req.headers.authorization.replace('Bearer ', '');
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        console.log('token=>' + token);
        let jsonString = this.jwtService.decode(token);
        console.log('Get req.user');
        console.info(req.user);
        const uid = query.uid;
        const status = req.user.status;
        if (!uid) {
            res.status(200).json({
                statuscode: 404,
                message: 'This user is not found.',
                message_th: 'ไม่พบผู้ใช้รายนี้!',
                payload: null
            });
        }
        else {
            const Profiles = await this.usersService.getProfile(uid);
            const Profile = Profiles[0];
            const lastsignindates = format.convertTZ(Profile.lastsignindate, process.env.tzString);
            const lastsignindate2 = format.timeConvertermas(lastsignindates);
            const lastsignindate = format.timeConvertermas(format.convertTZ(Profile.lastsignindate, process.env.tzString));
            if (Profile.birthday) {
                var birthday = format.timeConvertermas(format.convertTZ(Profile.birthday, process.env.tzString));
            }
            else {
                var birthday = Profile.birthday;
            }
            const ProfileRs = {
                uid: Profile.uid,
                role_id: Profile.roleid,
                role_type_id: Profile.role_type_id,
                rolename: Profile.rolename,
                email: Profile.email,
                username: Profile.username,
                firstname: Profile.firstname,
                lastname: Profile.lastname,
                fullname: Profile.fullname,
                nickname: Profile.nickname,
                idcard: Profile.idcard,
                lastsignindate: lastsignindate,
                status: Profile.status,
                active_status: Profile.active_status,
                network_id: Profile.network_id,
                remark: Profile.remark,
                infomation_agree_status: Profile.infomation_agree_status,
                gender: Profile.gender,
                birthday: birthday,
                online_status: Profile.online_status,
                message: Profile.message,
                network_type_id: Profile.network_type_id,
                public_status: Profile.public_status,
                type_id: Profile.type_id,
                avatarpath: Profile.avatarpath,
                avatar: Profile.avatar,
                loginfailed: Profile.loginfailed,
                refresh_token: Profile.refresh_token,
                permision_name: Profile.permision_name,
                permision_detail: Profile.permision_detail,
                permision_insert: Profile.permision_insert,
                permision_update: Profile.permision_update,
                permision_delete: Profile.permision_delete,
                permision_select: Profile.permision_select,
                permision_log: Profile.permision_log,
                permision_config: Profile.permision_config,
                permision_truncate: Profile.permision_truncate,
                public_notification: Profile.public_notification,
                sms_notification: Profile.sms_notification,
                email_notification: Profile.email_notification,
                line_notification: Profile.line_notification,
                lineid: Profile.lineid,
                mobile_number: Profile.mobile_number,
                phone_number: Profile.phone_number,
                createddate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Profile.updateddate, process.env.tzString)),
                deletedate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
            };
            res.status(200).json({
                statusCode: 200,
                code: 200,
                uid: uid,
                payload: ProfileRs,
                message: 'Profile load data success.',
                message_th: 'โหลดข้อมูลโปรไฟล์สำเร็จ.',
            });
        }
    }
    async Profile(res, query, headers, params, req) {
        console.log('Get req.user');
        console.info(req.user);
        const proFile = {
            uid: req.user.id,
            username: req.user.username,
            email: req.user.email,
            status: req.user.status,
            usertype: req.user.usertype,
            type: req.user.type,
        };
        const status = req.user.status;
        if (status == 0 || status == false) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! This username: ' +
                    req.user.username +
                    ' Email: ' +
                    req.user.email +
                    ' Inactive',
                payload: null,
            };
            return result;
        }
        else {
            let jwt = req.headers.authorization.replace('Bearer ', '');
            const token = req.headers.authorization
                .replace('Bearer ', '')
                .trim();
            let jsonString = this.jwtService.decode(token);
            let idx = jsonString.id;
            await this.authService.checkRefreshToken(idx);
            var decoded = {};
            var decoded = this.jwtService.decode(token);
            var iat = decoded.iat * 1000;
            var exp = decoded.exp * 1000;
            var d1 = new Date(iat);
            var d2 = new Date(exp);
            var EXPIRE_TIME = Number(exp - iat);
            var TokenDate = {
                EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
                signin_date: format.timeConvertermas(d1),
                expires_date: format.timeConvertermas(d2),
                token: jwt,
            };
            const Profiles = await this.usersService.getProfile(idx);
            const Profile = Profiles[0];
            const lastsignindates = format.convertTZ(Profile.lastsignindate, process.env.tzString);
            const lastsignindate2 = format.timeConvertermas(lastsignindates);
            const lastsignindate = format.timeConvertermas(format.convertTZ(Profile.lastsignindate, process.env.tzString));
            if (Profile.birthday) {
                var birthday = format.timeConvertermas(format.convertTZ(Profile.birthday, process.env.tzString));
            }
            else {
                var birthday = Profile.birthday;
            }
            const ProfileRs = {
                uid: Profile.uid,
                role_id: Profile.roleid,
                role_type_id: Profile.role_type_id,
                rolename: Profile.rolename,
                email: Profile.email,
                username: Profile.username,
                firstname: Profile.firstname,
                lastname: Profile.lastname,
                fullname: Profile.fullname,
                nickname: Profile.nickname,
                idcard: Profile.idcard,
                lastsignindate: lastsignindate,
                status: Profile.status,
                active_status: Profile.active_status,
                network_id: Profile.network_id,
                remark: Profile.remark,
                infomation_agree_status: Profile.infomation_agree_status,
                gender: Profile.gender,
                birthday: birthday,
                online_status: Profile.online_status,
                message: Profile.message,
                network_type_id: Profile.network_type_id,
                public_status: Profile.public_status,
                type_id: Profile.type_id,
                avatarpath: Profile.avatarpath,
                avatar: Profile.avatar,
                loginfailed: Profile.loginfailed,
                refresh_token: Profile.refresh_token,
                permision_name: Profile.permision_name,
                permision_detail: Profile.permision_detail,
                permision_insert: Profile.permision_insert,
                permision_update: Profile.permision_update,
                permision_delete: Profile.permision_delete,
                permision_select: Profile.permision_select,
                permision_log: Profile.permision_log,
                permision_config: Profile.permision_config,
                permision_truncate: Profile.permision_truncate,
                public_notification: Profile.public_notification,
                sms_notification: Profile.sms_notification,
                email_notification: Profile.email_notification,
                line_notification: Profile.line_notification,
                lineid: Profile.lineid,
                mobile_number: Profile.mobile_number,
                phone_number: Profile.phone_number,
                createddate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
                updateddate: format.timeConvertermas(format.convertTZ(Profile.updateddate, process.env.tzString)),
                deletedate: format.timeConvertermas(format.convertTZ(Profile.createddate, process.env.tzString)),
            };
            res.status(200).json({
                statusCode: 200,
                code: 200,
                uid: idx,
                payload: ProfileRs,
                tokenInfo: TokenDate,
                message: 'success.',
                message_th: 'success.',
            });
        }
    }
    async ProfilePost(res, dto, query, headers, params, req) {
        console.log('Post req');
        console.info(req);
        const status = req.user.status;
        if (status == 0 || status == false) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! This username: ' +
                    req.user.username +
                    ' Email: ' +
                    req.user.email +
                    ' Inactive',
                payload: null,
            };
            res.status(200).json(result);
            return;
        }
        else {
            let jwt = req.headers.authorization.replace('Bearer ', '');
            const token = req.headers.authorization.replace('Bearer ', '').trim();
            console.log('token=>' + token);
            let jsonString = this.jwtService.decode(token);
            let idx = jsonString.id;
            await this.authService.checkRefreshToken(idx);
            var decoded = {};
            var decoded = this.jwtService.decode(token);
            var iat = decoded.iat * 1000;
            var exp = decoded.exp * 1000;
            var d1 = new Date(iat);
            var d2 = new Date(exp);
            var EXPIRE_TIME = Number(exp - iat);
            var TokenDate = {
                EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
                signin_date: format.timeConvertermas(d1),
                expires_date: format.timeConvertermas(d2),
                token: jwt,
            };
            const Profiles = await this.usersService.getProfile(idx);
            const Profile = Profiles[0];
            const ProfileRs = {
                uid: Profile.uid,
                role_id: Profile.roleid,
                email: Profile.email,
                username: Profile.username,
                firstname: Profile.firstname,
                lastname: Profile.lastname,
                fullname: Profile.fullname,
                nickname: Profile.nickname,
                idcard: Profile.idcard,
                lastsignindate: Profile.lastsignindate,
                status: Profile.status,
                active_status: Profile.active_status,
                network_id: Profile.network_id,
                remark: Profile.remark,
                infomation_agree_status: Profile.infomation_agree_status,
                gender: Profile.gender,
                birthday: Profile.birthday,
                online_status: Profile.online_status,
                message: Profile.message,
                network_type_id: Profile.network_type_id,
                public_status: Profile.public_status,
                type_id: Profile.type_id,
                avatarpath: Profile.avatarpath,
                avatar: Profile.avatar,
                refresh_token: Profile.refresh_token,
                createddate: Profile.createddate,
                updateddate: Profile.updateddate,
                deletedate: Profile.deletedate,
                loginfailed: Profile.loginfailed,
                public_notification: Profile.public_notification,
                sms_notification: Profile.sms_notification,
                email_notification: Profile.email_notification,
                line_notification: Profile.line_notification,
                lineid: Profile.lineid,
                mobile_number: Profile.mobile_number,
                phone_number: Profile.phone_number,
            };
            var result = {
                statusCode: 200,
                code: 200,
                payload: ProfileRs,
                tokenInfo: TokenDate,
                message: 'Profile.',
                message_th: 'Profile.',
            };
            res.status(200).json(result);
        }
    }
    async updateProfile(res, dto, query, headers, params, req) {
        let jwt = req.headers.authorization.replace('Bearer ', '');
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        console.log('token=>' + token);
        let jsonString = this.jwtService.decode(token);
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
        const uid = dto.uid;
        const email = dto.email;
        const username = dto.username;
        console.log('email=> ' + email);
        console.log('username=> ' + username);
        if (!uid) {
            const uid = '0';
            var result = {
                statusCode: 200,
                code: 404,
                payload: null,
                message: 'uid ' + uid + ' is null.',
                message_th: 'ไม่พบข้อมูล uid ' + uid + '.',
            };
            res.status(200).json(result);
        }
        if (email) {
            console.log('if email=> ' + email);
            const emailExists = await this.usersService.findByEmail(email);
            if (emailExists) {
                console.log('emailExists=>' + emailExists.email);
                res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: { email: emailExists.email },
                    message: 'The email duplicate this data cannot update.',
                    message_th: 'ข้อมูลซ้ำนี้ไม่สามารถ แก้ไขข้อมูล ได้.',
                });
                return;
            }
        }
        if (username) {
            console.log('if username=> ' + username);
            const usernameRs = await this.usersService.getUserByusername(username);
            if (usernameRs) {
                console.log('username=>' + usernameRs.username);
                res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: { username: usernameRs.username },
                    message: 'The username duplicate this data cannot update.',
                    message_th: 'ข้อมูลซ้ำนี้ไม่สามารถ แก้ไขข้อมูล ได้.',
                });
                return;
            }
        }
        let DataUpdate = {};
        DataUpdate.id = uid;
        if (dto.role_id) {
            DataUpdate.role_id = dto.role_id;
        }
        if (email) {
            DataUpdate.email = email;
        }
        if (username) {
            DataUpdate.username = username;
        }
        if (dto.password != dto.confirm_password) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                code: 400,
                payload: dto,
                message: 'Password and Confirm Password do not match..',
                message_th: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน.',
            });
            return;
        }
        if (dto.password) {
            const password_val = passwordStrength(dto.password).value;
            if (password_val === 'Weak') {
                res.status(200).json({
                    statusCode: 200,
                    code: 400,
                    payload: null,
                    message: 'Password is ' + password_val + ' please change it for security.',
                    message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
                });
                return;
            }
            if (password_val === 'Medium') {
                res.status(200).json({
                    statusCode: 200,
                    code: 400,
                    payload: null,
                    message: 'Password is ' + password_val + ' please change it for security.',
                    message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
                });
                return;
            }
        }
        if (dto.password) {
            DataUpdate.password = dto.password;
        }
        if (dto.password) {
            DataUpdate.password_temp = dto.password;
        }
        if (dto.firstname) {
            DataUpdate.firstname = dto.firstname;
        }
        if (dto.lastname) {
            DataUpdate.lastname = dto.lastname;
        }
        if (dto.fullname) {
            DataUpdate.fullname = dto.fullname;
        }
        if (dto.nickname) {
            DataUpdate.nickname = dto.nickname;
        }
        if (dto.idcard) {
            DataUpdate.idcard = dto.idcard;
        }
        if (dto.lastsignindate) {
            DataUpdate.lastsignindate = Date();
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        if (dto.active_status) {
            DataUpdate.active_status = dto.active_status;
        }
        if (dto.network_id) {
            DataUpdate.network_id = dto.network_id;
        }
        if (dto.remark) {
            DataUpdate.remark = dto.remark;
        }
        if (dto.infomation_agree_status) {
            DataUpdate.infomation_agree_status = dto.infomation_agree_status;
        }
        if (dto.gender) {
            DataUpdate.gender = dto.gender;
        }
        if (dto.birthday) {
            DataUpdate.birthday = dto.birthday;
        }
        if (dto.online_status) {
            DataUpdate.online_status = dto.online_status;
        }
        if (dto.message) {
            DataUpdate.message = dto.message;
        }
        if (dto.network_type_id) {
            DataUpdate.network_type_id = dto.network_type_id;
        }
        if (dto.public_status) {
            DataUpdate.public_status = dto.public_status;
        }
        if (dto.type_id) {
            DataUpdate.type_id = dto.type_id;
        }
        if (dto.avatarpath) {
            DataUpdate.avatar = dto.avatarpath;
        }
        if (dto.avatar) {
            DataUpdate.avatar = dto.avatar;
        }
        if (dto.refresh_token) {
            DataUpdate.refresh_token = dto.refresh_token;
        }
        if (dto.createddate) {
            DataUpdate.createddate = dto.createddate;
        }
        if (dto.deletedate) {
            DataUpdate.deletedate = dto.deletedate;
        }
        if (dto.loginfailed) {
            DataUpdate.loginfailed = dto.loginfailed;
        }
        if (dto.public_notification) {
            DataUpdate.public_notification = dto.public_notification;
        }
        if (dto.sms_notification) {
            DataUpdate.sms_notification = dto.sms_notification;
        }
        if (dto.email_notification) {
            DataUpdate.email_notification = dto.email_notification;
        }
        if (dto.mobile_number) {
            DataUpdate.mobile_number = dto.mobile_number;
        }
        if (dto.phone_number) {
            DataUpdate.phone_number = dto.phone_number;
        }
        if (dto.line_notification) {
            DataUpdate.line_notification = dto.line_notification;
        }
        if (dto.lineid) {
            DataUpdate.lineid = dto.lineid;
        }
        console.log(`DataUpdate=>`);
        console.info(DataUpdate);
        const rt = await this.usersService.updateSdUser(DataUpdate);
        if (rt && rt == 200) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: DataUpdate,
                rt: rt,
                message: 'Profile update successful.',
                message_th: 'อัปเดตโปรไฟล์ สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
                statusCode: 200,
                code: 422,
                payload: DataUpdate,
                rt: rt,
                message: 'Profile update Unsuccessful',
                message_th: 'อัปเดตโปรไฟล์ ไม่สำเร็จ',
            };
            res.status(200).json(result);
        }
    }
    async update_status(res, dto, query, headers, params, req) {
        let jwt = req.headers.authorization.replace('Bearer ', '');
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        let jsonString = this.jwtService.decode(token);
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
        var uid = dto.uid;
        if (uid == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' uid ' + uid + ' is null.',
                message_th: 'ไม่พบข้อมูล  uid ' + uid + '.',
            };
            res.status(200).json(result);
        }
        var active_status = dto.active_status;
        if (active_status == null) {
            var result = {
                statusCode: 200,
                code: 404,
                payload: dto,
                message: ' active_status ' + active_status + ' is null.',
                message_th: 'ไม่พบข้อมูล  active_status ' + active_status + '.',
            };
            res.status(200).json(result);
        }
        var rt = await this.usersService.update_user_status(uid, active_status);
        if (rt) {
            var result = {
                statusCode: 200,
                code: 200,
                payload: rt,
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
            };
            res.status(200).json(result);
        }
        else {
            var result = {
                statusCode: 200,
                code: 422,
                payload: rt,
                message: 'Update Unsuccessful',
                message_th: 'อัปเดต ไม่สำเร็จ',
            };
            res.status(200).json(result);
        }
    }
    async verifyresetpaas(dto, query, headers, params, req, Request, res, Param) {
        let secretkey = Request.headers.secretkey;
        let token = Request.headers.authorization.replace('Bearer ', '');
        let jsonString = this.jwtService.decode(token);
        let idx = jsonString.id;
        const Profiles = await this.usersService.getProfile(idx);
        if (!Profiles) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                payload: null,
                message: 'Data not found in system.',
                message_th: 'ไม่พบข้อมูลในระบบ.',
            });
            return;
        }
        const Profile = Profiles[0];
        res.status(200).json({
            statusCode: 200,
            payload: {
                uid: Profile.uid,
                email: Profile.email,
                token: token,
            },
            message: 'Verify User.',
            message_th: 'Verify User.',
        });
        return;
    }
    async ResetSystem(query, headers, params, req, Request, res, Reset) {
        let secretkey = Request.headers.secretkey;
        console.log('Reset =>');
        console.info(Reset);
        let token = Request.headers.authorization.replace('Bearer ', '');
        let jsonString = this.jwtService.decode(token);
        let idx = jsonString.id;
        await this.authService.checkRefreshToken(idx);
        if (!Reset) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                code: 400,
                payload: Reset,
                message: 'Data not found in system.',
                message_th: 'ไม่พบข้อมูลในระบบ.',
            });
            return;
        }
        let passwords = Reset.password;
        let passwords_update = Reset.password;
        let confirm_passwords = Reset.confirm_password;
        if (!passwords_update) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                code: 400,
                payload: Reset,
                message: 'password is null.',
                message_th: 'กรุณา กำหนดค่า รหัสผ่าน.',
            });
            return;
        }
        if (!confirm_passwords) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                code: 400,
                payload: Reset,
                message: 'confirm password is null.',
                message_th: 'กรุณา กำหนดค่า ยืนยันรหัสผ่าน.',
            });
            return;
        }
        if (passwords_update != confirm_passwords) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                code: 400,
                payload: Reset,
                message: 'Password and Confirm Password do not match..',
                message_th: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน.',
            });
            return;
        }
        const password = passwordStrength(passwords).value;
        const confirm_password = passwordStrength(confirm_passwords).value;
        if (password != confirm_password) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                payload: null,
                message: 'Passwords do not match.. ',
                message_th: 'รหัสผ่านไม่ตรงกัน..',
            });
            return;
        }
        if (password === 'Weak' || confirm_password === 'Weak') {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                payload: null,
                message: 'Password is ' + password + ' please change it for security.',
                message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
            });
            return;
        }
        if (password === 'Medium' || confirm_password === 'Medium') {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                payload: null,
                message: 'Password is ' + password + ' please change it for security.',
                message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
            });
            return;
        }
        const dto = {
            password: passwords_update,
            id: idx,
        };
        const rt = await this.usersService.resetPassword(dto);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: { data: rt, password: passwords_update },
            message: 'Reset password succeed.',
            message_th: 'รีเซ็ตรหัสผ่านสำเร็จ.',
        });
        return;
    }
    async ForgotPassword(res, input, query, headers, params, req) {
        console.log('input=>');
        console.info(input);
        let email = input.email;
        if (email === '' || email === null) {
            var result = {
                statuscode: 200,
                message: 'email is null',
                message_th: 'email is null',
                payload: null,
            };
            res.status(200).json(result);
            return;
        }
        const user = await this.usersService.getUserByEmail(input.email);
        if (user) {
            const status = user.status;
            if (status == 0 || status == false) {
                res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    payload: user.email,
                    uid: user.id,
                    message: 'Forbidden',
                    message_th: 'Forbidden',
                    error: 'Forbidden! This username: ' +
                        req.user.username +
                        ' Email: ' +
                        req.user.email +
                        ' Inactive',
                });
                return;
            }
            else {
                var EXPIRE_TIME_SET = Number(900);
                const token = await this.authService.generateTokenUser(user.id, EXPIRE_TIME_SET);
                var decoded = {};
                var decoded = this.jwtService.decode(token);
                var iat = decoded.iat * 1000;
                var exp = decoded.exp * 1000;
                var d1 = new Date(iat);
                var d2 = new Date(exp);
                var EXPIRE_TIME = Number(exp - iat);
                var TokenDate = {
                    EXPIRE_TOKEN: EXPIRE_TIME_SET,
                    signin_date: format.timeConvertermas(d1),
                    expires_date: format.timeConvertermas(d2),
                };
                res.status(200).json({
                    statuscode: 200,
                    code: 200,
                    token: token,
                    payload: user.email,
                    uid: user.id,
                    did: decoded.id,
                    TokenDate: TokenDate,
                    message: 'Success',
                    message_th: 'Reset link are sended to your mailbox, check there first',
                });
                return;
            }
        }
        else {
            res.status(200).json({
                statuscode: 200,
                code: 404,
                payload: null,
                uid: null,
                message: 'Username not found in database',
                message_th: 'Username not found in database',
            });
            return;
        }
    }
    async GetrefreshToken(res, dto, query, headers, params, req) {
        let jwt = req.headers.authorization.replace('Bearer ', '').trim();
        let jsonString = this.jwtService.decode(jwt);
        let idx = jsonString.id;
        await this.authService.checkRefreshToken(idx);
        const TokenTime = await this.authService.generateTokenTime(idx);
        var decoded = {};
        var decoded = this.jwtService.decode(TokenTime);
        var decoded1 = this.jwtService.decode(jwt);
        var iat = decoded.iat * 1000;
        var exp = decoded.exp * 1000;
        var d1 = new Date(iat);
        var d2 = new Date(exp);
        var EXPIRE_TIME = Number(exp - iat);
        var TokenDate = {
            signin: iat,
            expires: exp,
            EXPIRE_TIME: EXPIRE_TIME,
            EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
            signin_date: format.timeConvertermas(d1),
            expires_date: format.timeConvertermas(d2),
        };
        const proFile = {
            uid: req.user.id,
            userCreatedatd: req.user.createddate,
            username: req.user.username,
            email: req.user.email,
            status: req.user.status,
            usertype: req.user.usertype,
            type: req.user.type,
        };
        const status = req.user.status;
        if (status == 0 || status == false) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! This username: ' +
                    req.user.username +
                    ' Email: ' +
                    req.user.email +
                    ' Inactive',
                payload: null,
            };
            return result;
        }
        else {
            const Response = {
                statuscode: 200,
                payload: proFile,
                id: idx,
                token: TokenTime,
                TokenDate: TokenDate,
                message: 'decode token',
            };
            return await Response;
        }
    }
    async logOut(res, dto, query, headers, params, req) {
        const token = req.headers.authorization.replace('Bearer ', '').trim() ||
            req.headers.authorization.replace('Bearer ', '') ||
            '';
        console.log('token=>');
        console.info(token);
        if (!token) {
            var result = {
                statuscode: 200,
                code: 422,
                case: 1,
                message: 'Token information not found.',
                message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
                payload: token,
            };
            res.status(200).json(result);
            return;
        }
        let jsonString = this.jwtService.decode(token);
        let idx = jsonString.id;
        console.log('idx');
        console.info(idx);
        const Profiles = await this.usersService.getProfile(idx);
        const Profile = Profiles[0];
        var uid = Profile.uid;
        var status = Profile.status;
        const refresh_token = Profile.refresh_token;
        console.log('Get uid');
        console.info(uid);
        console.log('Get refresh_tokens');
        console.info(refresh_token);
        if (!refresh_token) {
            var result = {
                statuscode: 200,
                code: 422,
                case: 2,
                message: 'Refresh Token information not found.',
                message_th: 'ไม่พบข้อมูล Refresh Token ที่ระบุ..',
                payload: uid,
            };
            res.status(200).json(result);
            return;
        }
        if (status == 0 || status == false || status == '') {
            var result = {
                statuscode: 200,
                case: 3,
                message: 'Forbidden!',
                payload: status,
            };
            res.status(200).json(result);
            return;
        }
        if (!refresh_token) {
            var result = {
                statuscode: 200,
                code: 422,
                case: 4,
                message: 'Refresh Token information not found.',
                message_th: 'ไม่พบข้อมูล Refresh Token ที่ระบุ..',
                payload: refresh_token,
            };
            res.status(200).json(result);
            return;
        }
        const oldTokenNue = null;
        await this.usersService.logout(idx, oldTokenNue);
        const resultRT = {
            statuscode: 200,
            code: 200,
            case: 5,
            message: 'Logout successfull.',
            message_th: 'ออกจากระบบสำเร็จ.',
            payload: idx,
        };
        res.status(200).json(resultRT);
        return;
    }
    async remove(req, id, res, dto, query, headers, params) {
        let jwt = req.headers.authorization.replace('Bearer ', '');
        const token = req.headers.authorization.replace('Bearer ', '').trim();
        let jsonString = this.jwtService.decode(token);
        let idx = jsonString.id;
        await this.authService.checkRefreshToken(idx);
        if (idx == id) {
            const result = {
                statuscode: 200,
                message: 'Delete data successfull...',
                message_th: 'ลบข้อมูล จากระบบ...',
                payload: id,
            };
            res.status(200).json(result);
            return;
        }
        const resultRT = await this.usersService.remove(id);
        const result = {
            statuscode: 200,
            message: 'Delete successfull.',
            message_th: 'ลบข้อมูล จากระบบสำเร็จ.',
            payload: id,
        };
        res.status(200).json(result);
        return;
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "Me", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'user paginate' }),
    (0, common_1.Get)('paginate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(7, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "paginate", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)('file'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Body)()),
    __param(6, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, file_dto_1.fileDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)('file/pass-validation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Body)()),
    __param(6, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 1000 }),
            new common_1.FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
    }), new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'jpeg',
    })
        .build({
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, file_dto_1.fileDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadFileAndPassValidation", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)('file/fail-validation'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Body)()),
    __param(6, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'png',
    })
        .build())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, file_dto_1.fileDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadFileAndFailValidation", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'list User' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Get)('deleteprofile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteprofile", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Get)('profiledetail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "profiledetail", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "Profile", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Post)('profiles'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ProfilePost", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieves the authorized user' }),
    (0, common_1.Post)('updateprofile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'update mqtt status' }),
    (0, common_1.Post)('updatestatus'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update_status", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.Get)('/verifyemail'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Req)()),
    __param(6, (0, common_1.Res)()),
    __param(7, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyresetpaas", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.Post)('/resetpassword'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __param(6, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ResetSystem", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'forgot-password' }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, forgeot_password_dto_1.FogotPassword, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ForgotPassword", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, swagger_1.ApiOperation)({ summary: 'refreshToken' }),
    (0, common_1.Get)('refreshToken'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetrefreshToken", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, swagger_1.ApiOperation)({ summary: 'logout' }),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logOut", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Query)()),
    __param(5, (0, common_1.Headers)()),
    __param(6, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map