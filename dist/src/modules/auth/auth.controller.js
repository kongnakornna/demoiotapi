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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
var moment = require('moment');
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const user_auth_dto_1 = require("../users/dto/user-auth.dto");
const email_chk_dto_1 = require("../users/dto/email-chk.dto");
const create_demo_user_dto_1 = require("../users/dto/create-demo-user.dto");
const Reset_dto_1 = require("../users/dto/Reset.dto");
const otpverify_dto_1 = require("../redis/dto/otpverify.dto");
const swagger_1 = require("@nestjs/swagger");
const format = __importStar(require("../../helpers/format.helper"));
const jwt_1 = require("@nestjs/jwt");
const { passwordStrength, defaultOptions } = require('check-password-strength');
const redis_cache_1 = require("../../utils/cache/redis.cache");
const redis_dto_1 = require("../redis/dto/redis.dto");
const redisuser_dto_1 = require("../redis/dto/redisuser.dto");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
let AuthController = class AuthController {
    constructor(jwtService, authService, userService) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.userService = userService;
    }
    async generatetoken(request, res, userModel) {
        try {
            if (!userModel) {
                res.status(common_1.HttpStatus.NOT_FOUND).json({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Data not found in system.',
                    message_th: 'ไม่พบข้อมูลในระบบ.',
                });
                return;
            }
            const emailExists = await this.userService.findByEmail(userModel.email);
            if (emailExists) {
                const data = await this.authService.authenticateSetGen(userModel);
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    payload: data,
                });
                return;
            }
            const usernameRs = await this.userService.getUserByusername(userModel.username);
            if (usernameRs) {
                const data = await this.authService.authenticateSetGen(userModel);
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    payload: data,
                });
                return;
            }
            await this.userService.createsystem(userModel);
            const data = await this.authService.authenticateSetGen(userModel);
            res.status(common_1.HttpStatus.CREATED).json({
                statusCode: common_1.HttpStatus.CREATED,
                payload: data,
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            });
        }
    }
    async ResetSystem(Request, res, ResetModel) {
        let secretkey = Request.headers.secretkey;
        if (secretkey != 'Cmon@Amin1') {
            res.status(common_1.HttpStatus.FORBIDDEN).json({
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Forbidden! KEY is not valid ..',
                message_th: 'KEY นี้ไม่มีในระบบ.',
            });
            return;
        }
        if (!ResetModel) {
            res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                payload: ResetModel,
                message: 'Data not found in system.',
                message_th: 'ไม่พบข้อมูลในระบบ.',
            });
            return;
        }
        const emailExists = await this.userService.findByEmail(ResetModel.email);
        if (emailExists) {
            const data = await this.authService.authenticateSetGen(ResetModel);
            res.status(200).json({
                statusCode: 200,
                payload: data,
            });
            return;
        }
        const usernameRs = await this.userService.getUserByusername(ResetModel.username);
        if (usernameRs) {
            const data = await this.authService.authenticateSetGen(ResetModel);
            res.status(200).json({
                statusCode: 200,
                payload: data,
            });
            return;
        }
        await this.userService.createsystem(ResetModel);
        const data = await this.authService.authenticateSetGen(ResetModel);
        res.status(201).json({
            statusCode: 201,
            payload: data,
        });
        return;
    }
    async allRevenueData(req, res) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        await this.authService.checkRefreshToken(idx);
        if (idx == null || idx == '') {
            res.status(403).json({
                statusCode: 403,
                message: 'Plase send! system id..',
                message_th: 'กรุณาระบุ system id.',
            });
            return;
        }
        const userInfo = await this.userService.getUser(idx);
        if (!userInfo) {
            res.status(422).json({
                statusCode: 422,
                message: 'The specified information was not found."',
                message_th: 'ไม่พบข้อมูลที่ระบุ..',
            });
        }
        if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
            res.status(422).json({
                statusCode: 422,
                message: 'Token information not found.',
                message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
                payload: userInfo.id,
            });
        }
        const TokenTime = await this.authService.generateTokenTime(idx);
        const refreshtoken_data = await this.authService.generateAccessToken(idx);
        await this.userService.updaterefreshtoken(idx, refreshtoken_data);
        var decoded = {};
        var decoded = this.jwtService.decode(TokenTime);
        var iat = decoded.iat * 1000;
        var exp = decoded.exp * 1000;
        var d1 = new Date(iat);
        var d2 = new Date(exp);
        var EXPIRE_TIME = Number(exp - iat);
        var TokenDate = {
            signin: iat,
            expires: exp,
            EXPIRE_TIME: EXPIRE_TIME,
            EXPIRE_DAY: process.env.EXPIRE_DAY,
            signin_date: format.timeConvertermas(d1),
            expires_date: format.timeConvertermas(d2),
        };
        res.status(200).json({
            statusCode: 200,
            message: 'New token',
            message_th: 'สร้างโทเค็นใหม่.',
            payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
        });
    }
    async allRevenue(req, res) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        await this.authService.checkRefreshToken(idx);
        if (idx == null || idx == '') {
            res.status(403).json({
                statusCode: 403,
                message: 'Plase send! system id..',
                message_th: 'กรุณาระบุ system id.',
            });
            return;
        }
        const userInfo = await this.userService.getUser(idx);
        if (!userInfo) {
            res.status(422).json({
                statusCode: 422,
                message: 'The specified information was not found."',
                message_th: 'ไม่พบข้อมูลที่ระบุ..',
            });
        }
        if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
            res.status(422).json({
                statusCode: 422,
                message: 'Token information not found.',
                message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
                payload: userInfo.id,
            });
        }
        const TokenTime = await this.authService.generateTokenTime(idx);
        const refreshtoken_data = await this.authService.generateAccessToken(idx);
        await this.userService.updaterefreshtoken(idx, refreshtoken_data);
        var decoded = {};
        var decoded = this.jwtService.decode(TokenTime);
        var iat = decoded.iat * 1000;
        var exp = decoded.exp * 1000;
        var d1 = new Date(iat);
        var d2 = new Date(exp);
        var EXPIRE_TIME = Number(exp - iat);
        var TokenDate = {
            signin: iat,
            expires: exp,
            EXPIRE_TIME: EXPIRE_TIME,
            EXPIRE_DAY: process.env.EXPIRE_DAY,
            signin_date: format.timeConvertermas(d1),
            expires_date: format.timeConvertermas(d2),
        };
        res.status(200).json({
            statusCode: 200,
            message: 'New token',
            message_th: 'สร้างโทเค็นใหม่.',
            payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
        });
    }
    async resetToken(req, res) {
        let idx = req.headers.id;
        let secretkey = req.headers.secretkey;
        await this.authService.checkRefreshToken(idx);
        if (idx == null || idx == '') {
            res.status(403).json({
                statusCode: 403,
                message: 'Plase send! system id..',
                message_th: 'กรุณาระบุ system id.',
            });
            return;
        }
        const userInfo = await this.userService.getUser(idx);
        if (!userInfo) {
            res.status(422).json({
                statusCode: 422,
                message: 'The specified information was not found."',
                message_th: 'ไม่พบข้อมูลที่ระบุ..',
            });
        }
        if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
            res.status(422).json({
                statusCode: 422,
                message: 'Token information not found.',
                message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
                payload: userInfo.id,
            });
            return;
        }
        const TokenTime = await this.authService.generateTokenTime(idx);
        const refreshtoken_data = await this.authService.generateAccessToken(idx);
        await this.userService.updaterefreshtoken(idx, refreshtoken_data);
        console.info(refreshtoken_data);
        var decoded = {};
        var decoded = this.jwtService.decode(TokenTime);
        var iat = decoded.iat * 1000;
        var exp = decoded.exp * 1000;
        var d1 = new Date(iat);
        var d2 = new Date(exp);
        var EXPIRE_TIME = Number(exp - iat);
        var TokenDate = {
            signin: iat,
            expires: exp,
            EXPIRE_TIME: EXPIRE_TIME,
            EXPIRE_DAY: process.env.EXPIRE_DAY,
            signin_date: format.timeConvertermas(d1),
            expires_date: format.timeConvertermas(d2),
        };
        res.status(200).json({
            statusCode: 200,
            message: 'New token',
            message_th: 'สร้างโทเค็นใหม่.',
            payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
        });
        return;
    }
    async SigninvalidateOTP(Request, res, caseModel) {
        let secretkey = Request.headers.secretkey;
        let time = Request.headers.time || 120;
        const keycache = caseModel.keycache;
        const otpvalidate = caseModel.otpvalidate;
        console.info('keycache', keycache);
        console.info('otpvalidate', otpvalidate);
        var inputOTP = { keycache: keycache, otpvalidate: otpvalidate };
        const inputOTPa = await Cache.validateGetUser(inputOTP);
        if (inputOTPa === null || inputOTPa === '') {
            var result = {
                statuscode: 200,
                code: 400,
                message: 'OTP is null',
                message_th: 'OTP is null',
                payload: null,
            };
            console.info('otp result', result);
            res.status(200).json(result);
            return;
        }
        const Profiles = await this.userService.getProfile(inputOTPa.uid);
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
            createddate: Profile.createdDate,
            updateddate: Profile.updatedDate,
            deletedate: Profile.deleteDate,
            loginfailed: Profile.loginFailed,
        };
        var result = {
            statuscode: 200,
            code: 200,
            message: 'OTP',
            message_th: 'OTP',
            payload: ProfileRs,
        };
        console.info('otp result', result);
        res.status(200).json(result);
        return;
    }
    async Signin(res, auth) {
        try {
            const data = await this.authService.authenticateEmail(auth);
            if (data.uid && data.loginfailed >= 10) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 400,
                    message: 'This user is locked please contact admin..',
                    message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
                    payload: null,
                });
                return;
            }
            if (!data.uid) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 400,
                    message: 'Sign in failed!',
                    message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
                    payload: null,
                });
                return;
            }
            if (data.uid) {
                const checkUserActive = await this.userService.checkUserActive(data.uid);
                if (!checkUserActive) {
                    res.status(common_1.HttpStatus.OK).json({
                        statusCode: common_1.HttpStatus.OK,
                        code: 403,
                        message: 'This account is inactive.',
                        message_th: 'บัญชีนี้ไม่อยู่ในสถานะพร้อมใช้งาน.',
                        payload: null,
                    });
                    return;
                }
            }
            const DataUpdate = {
                id: data.uid,
                lastsignindate: new Date(),
            };
            await this.userService.updateSdUser(DataUpdate);
            res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                code: 200,
                message: 'Sign In Successful.',
                message_th: 'เข้าระบบสำเร็จ.',
                payload: data,
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            });
        }
    }
    async SigninUser(res, auth) {
        try {
            if (!auth.email) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 400,
                    message: 'Email is required.',
                    message_th: 'กรุณาระบุอีเมล.',
                    payload: null,
                });
                return;
            }
            if (!auth.password) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 400,
                    message: 'Password is required.',
                    message_th: 'กรุณาระบุรหัสผ่าน.',
                    payload: null,
                });
                return;
            }
            const data = await this.authService.authenticateEmail(auth);
            res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                code: 200,
                message: 'Sign In Successful.',
                message_th: 'เข้าระบบสำเร็จ.',
                payload: data,
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            });
        }
    }
    async Signinapp(query, headers, params, req, res, auth) {
        if (!auth.username) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: ' username is null..',
                message_th: 'username ไม่ถูกส่งมา..',
                payload: null,
            });
            return;
        }
        if (!auth.password) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: 'password is null..',
                message_th: 'password ไม่ถูกส่งมา..',
                payload: null,
            });
            return;
        }
        const datas = await this.authService.authenticateuser(auth);
        var loginfailed = datas.loginfailed;
        if (datas.uid && loginfailed >= 10) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: 'This is user Locked please contact admin..',
                message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
                payload: null,
            });
            return;
        }
        if (!datas.uid) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: 'Sign in failed!',
                message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
                payload: null,
            });
            return;
        }
        if (datas.uid) {
            let checkUserActive = await this.userService.checkUserActive(datas.uid);
            if (checkUserActive < 1) {
                res.status(200).json({
                    statusCode: 200,
                    code: 403,
                    message: 'This account Inactive status.',
                    message_th: 'บัญชีนี้ ไม่อยู่ในสถานะ พร้อมใช้งาน.',
                    payload: null,
                });
                return;
            }
        }
        let DataUpdate = {};
        DataUpdate.id = datas.uid;
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.lastsignindate = Date();
        await this.userService.updateSdUser(DataUpdate);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            message: 'Sign In Successful.',
            message_th: 'เข้าระบบสำเร็จ.',
            payload: datas,
        });
        return;
    }
    async userUnlock(Request, res, auth) {
        let secretkey = Request.headers.secretkey;
        const data = await this.authService.userUnlock(auth);
        var loginfailed = data.loginfailed;
        if (loginfailed != 0) {
            res.status(403).json({
                statusCode: 403,
                message: 'This is user Locked..',
                message_th: 'ผู้ใช้นี้ถูกล็อค..',
                payload: null,
            });
            return;
        }
        res.status(200).json({
            statusCode: 200,
            message: 'This user unlock successful.',
            message_th: 'ผู้ใช้รายนี้ปลดได้ทำการล็อคแล้ว.',
            payload: data,
        });
        return;
    }
    async signup(res, userModel) {
        try {
            const checkEmailFormat = format.checkEmail(userModel.email);
            if (!checkEmailFormat) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 422,
                    message: 'Invalid email format.',
                    message_th: 'รูปแบบอีเมล์ไม่ถูกต้อง',
                });
                return;
            }
            const emailExists = await this.userService.findByEmail(userModel.email);
            if (emailExists) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 422,
                    message: 'The email already exists.',
                    message_th: 'อีเมลนี้มีอยู่ในระบบแล้ว',
                });
                return;
            }
            const usernameRs = await this.userService.getUserByusername(userModel.username);
            if (usernameRs) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 422,
                    message: 'The username already exists.',
                    message_th: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว',
                });
                return;
            }
            if (userModel.password !== userModel.confirm_password) {
                res.status(common_1.HttpStatus.OK).json({
                    statusCode: common_1.HttpStatus.OK,
                    code: 400,
                    message: 'Passwords do not match.',
                    message_th: 'รหัสผ่านไม่ตรงกัน',
                });
                return;
            }
            await this.userService.create(userModel);
            const data = await this.authService.authenticate(userModel);
            res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                code: 200,
                message: 'Register successfully.',
                message_th: 'ลงทะเบียนสำเร็จ',
                payload: data,
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            });
        }
    }
    async signup3(Req, query, res, userModel) {
        const option = Number(query.option) || 0;
        const checkEmailfomat = format.checkEmail(userModel.email);
        if (checkEmailfomat == false || checkEmailfomat === 0) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { email: userModel.email },
                message: 'Invalid email format.',
                message_th: 'รูปแบบอีเมล์ไม่ถูกต้อง',
            });
            return;
        }
        const emailExists = await this.userService.findByEmail(userModel.email);
        if (emailExists) {
            res.status(200).json({
                statusCode: 200,
                code: 422,
                payload: { email: emailExists.email },
                message: 'The email duplicate this data cannot signup.',
                message_th: 'ข้อมูล email' + userModel.email + ' ซ้ำไม่สามารถลงทะเบียนได้.',
            });
            return;
        }
        else if (!emailExists) {
            const usernameRs = await this.userService.getUserByusername(userModel.username);
            if (usernameRs) {
                res.status(200).json({
                    statusCode: 200,
                    code: 422,
                    payload: { username: usernameRs.username },
                    message: 'The username duplicate this data cannot signup.',
                    message_th: 'ข้อมูล username ' + userModel.username + ' ซ้ำไม่สามารถลงทะเบียนได้.',
                });
                return;
            }
        }
        const password = passwordStrength(userModel.password).value;
        const confirm_password = passwordStrength(userModel.confirm_password).value;
        if (userModel.password != userModel.confirm_password) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                payload: null,
                message: 'Passwords do not match.. ',
                message_th: 'รหัสผ่านไม่ตรงกัน..',
            });
            return;
        }
        await this.userService.create(userModel);
        const data = await this.authService.authenticate(userModel);
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: data,
            message: 'Register successfully..',
            message_th: 'ลงทะเบียนสำเร็จ..',
        });
        return;
    }
    async otp(Request) {
        let secretkey = Request.headers.secretkey;
        let time = Number(Request.headers.time) || 60;
        const Randomint = format.getRandomint(6);
        const otpot = await Cache.OTPTIME(Randomint, time);
        const keycache = otpot.key;
        const otpvalidate = otpot.otp;
        var input = {
            keycache: keycache,
            otpvalidate: otpvalidate,
        };
        var result = {
            statuscode: 200,
            message: 'OTP',
            payload: otpot,
            validateOTP: Cache.validateGet(input),
        };
        return result;
    }
    async verifyOTP(Request, res, caseModel) {
        let secretkey = Request.headers.secretkey;
        let time = Request.headers.time || 60;
        const keycache = caseModel.keycache;
        const otpvalidate = caseModel.otpvalidate;
        var input = {
            keycache: keycache,
            otpvalidate: otpvalidate,
        };
        var otp = await Cache.validateOTP(input);
        if (otp) {
            res.status(200).json({
                statuscode: 200,
                message: 'OK',
                message_th: 'OTP',
                code: otp,
                payload: otp,
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                message: 'OTP expire',
                message_th: 'OTP หมดอายุ',
                code: otp,
                payload: null,
            });
            return;
        }
    }
    async SigninOTP(Req, res, auth) {
        const data = await this.authService.authenticate(auth);
        var loginfailed = data.loginfailed;
        if (data.uid && loginfailed >= 10) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: 'This is user Locked please contact admin..',
                message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
                payload: null,
            });
            return;
        }
        if (!data.uid) {
            res.status(200).json({
                statusCode: 200,
                code: 400,
                message: 'Sign in failed!',
                message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
                payload: null,
            });
            return;
        }
        if (data.uid) {
            let checkUserActive = await this.userService.checkUserActive(data.uid);
            if (checkUserActive < 1) {
                res.status(200).json({
                    statusCode: 200,
                    code: 403,
                    message: 'This account Inactive status.',
                    message_th: 'บัญชีนี้ ไม่อยู่ในสถานะ พร้อมใช้งาน.',
                    payload: null,
                });
                return;
            }
            let secretkey = Req.headers.secretkey;
            let time = Number(Req.headers.time) || 300;
            const Randomint = format.getRandomint(6);
            const otpot = await Cache.OTPTIMEUSER(Randomint, time, data.uid, data.email, data.username, data.token, data.roleId);
            const keycache = otpot.key;
            const otpvalidate = otpot.OTP.otp;
            var inputOTP = { keycache: keycache, otpvalidate: otpvalidate };
            const inputOTPa = await Cache.validateGetUser(inputOTP);
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'Sign In OTP',
                message_th: 'กรุณาตรวจสอบ OTP.',
                payload: {
                    key: otpot.key,
                    time: otpot.time,
                    otp: otpot.OTP.otp,
                },
            });
            return;
        }
    }
    async verifyUserOTP(Request, res, caseModel) {
        let secretkey = Request.headers.secretkey;
        let time = Request.headers.time || 60;
        const keycache = caseModel.otpkey;
        const otpvalidate = caseModel.otp;
        var input = {
            keycache: keycache,
            otpvalidate: otpvalidate,
        };
        var otp = await Cache.validateGetUser(input);
        if (otp) {
            res.status(200).json({
                statuscode: 200,
                code: 200,
                message: 'Success',
                message_th: 'Verify OTP Successful',
                payload: otp,
            });
            return;
        }
        else {
            res.status(200).json({
                statuscode: 200,
                code: 422,
                message: 'OTP is invalid or OTP expire.',
                message_th: 'OTP ไม่ถูกต้อง หรือ OTP หมดอายุ.',
                payload: null,
            });
            return;
        }
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/generatetoken'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_demo_user_dto_1.CreateUserDemoDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generatetoken", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/reset'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Reset_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "ResetSystem", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('allRevenue-data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "allRevenueData", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('allRevenue'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "allRevenue", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('resetToken'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetToken", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate user OTP.' }),
    (0, common_1.Post)('/validateotp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, redisuser_dto_1.redisUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SigninvalidateOTP", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_auth_dto_1.UserAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Signin", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signinuser'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SigninUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signinapp'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Param)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Signinapp", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/userUnlock'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, email_chk_dto_1.EmailChk]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userUnlock", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('/signup3'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup3", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Get)('/otp'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otp", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Post)('/verifyotp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, redis_dto_1.redisDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOTP", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signinotp'),
    (0, swagger_1.ApiOperation)({ summary: 'Signin OTP.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_auth_dto_1.UserAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SigninOTP", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Post)('/verifyuserotp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, otpverify_dto_1.otpverifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUserOTP", null);
AuthController = __decorate([
    (0, common_1.Injectable)(),
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map