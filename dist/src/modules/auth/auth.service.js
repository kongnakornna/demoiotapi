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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const format = __importStar(require("../../helpers/format.helper"));
const argon2 = __importStar(require("argon2"));
require("dotenv/config");
require('dotenv').config();
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async generateTokenApikey(payload) {
        return this.jwtService.sign(payload);
    }
    async generateToken(ids) {
        const tokenGen = await this.jwtService.sign({ id: ids });
        return tokenGen;
    }
    async generateTokenDecode(ids) {
        const tokenGen = await this.jwtService.sign({ id: ids });
        return tokenGen;
    }
    async generateTokenTime(id) {
        try {
            const token = await this.jwtService.sign({
                id: id,
                expiresIn: process.env.EXPIRE_TOKEN || '30d',
                secret: process.env.SECRET_KEY,
            });
            return token;
        }
        catch (error) {
            throw new common_1.BadRequestException('Token generation failed');
        }
    }
    async generateTokenUser(ids, expires) {
        let expire_time = expires;
        if (expire_time == '') {
            const tokenRs = await this.jwtService.sign({
                id: ids,
                expiresIn: process.env.EXPIRE_TOKEN || '30d',
                secret: process.env.SECRET_KEY,
            });
            return tokenRs;
        }
        else {
            const tokenRs = await this.jwtService.signAsync({ id: ids }, {
                expiresIn: expire_time || process.env.EXPIRE_TOKEN || '1d',
                secret: process.env.SECRET_KEY,
            });
            return tokenRs;
        }
    }
    async validateUser(payload) {
        const loggedInUser = await this.userService.getUser(payload.id);
        return loggedInUser;
    }
    async authenticateSetGen(auth) {
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        if (!isRightPassword) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const status = user.status;
        if (status == 0 || status == '' || status == false) {
            var result = {
                code: 422,
                message: 'Forbidden! This username: ' +
                    user.username +
                    ' Email: ' +
                    user.email +
                    ' Inactive',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            const tokenRs = await this.jwtService.sign({ id: user.id });
            let jsonString = this.jwtService.decode(tokenRs);
            let idx = jsonString.id;
            var decoded = {};
            var decoded = this.jwtService.decode(tokenRs);
            var iat = decoded.iat * 1000;
            var exp = decoded.exp * 1000;
            var d1 = new Date(iat);
            var d2 = new Date(exp);
            var EXPIRE_TIME = Number(exp - iat);
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(idx, hashedrefreshtoken);
            return {
                uid: user.id,
                uname: user.username,
                token: tokenRs,
                iat: iat,
                exp: exp,
                EXPIRE_TOKEN_APP: process.env.EXPIRE_TOKEN_APP,
                signin_date: format.timeConvertermas(d1),
                expires_date: format.timeConvertermas(d2),
            };
        }
    }
    async authenticateSet(auth) {
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        if (!isRightPassword) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const status = user.status;
        if (status == 0 || status == '' || status == false) {
            var result = {
                code: 422,
                message: 'Forbidden! This username: ' +
                    user.username +
                    ' Email: ' +
                    user.email +
                    ' Inactive',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            const tokenRs = await this.jwtService.sign({ id: user.id });
            let jsonString = this.jwtService.decode(tokenRs);
            let idx = jsonString.id;
            var decoded = {};
            var decoded = this.jwtService.decode(tokenRs);
            var iat = decoded.iat * 1000;
            var exp = decoded.exp * 1000;
            var d1 = new Date(iat);
            var d2 = new Date(exp);
            var EXPIRE_TIME = Number(exp - iat);
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(idx, hashedrefreshtoken);
            return {
                uid: user.id,
                uname: user.username,
                token: tokenRs,
                iat: iat,
                exp: exp,
                EXPIRE_TOKEN_APP: process.env.EXPIRE_TOKEN_APP,
                signin_date: format.timeConvertermas(d1),
                expires_date: format.timeConvertermas(d2),
            };
        }
    }
    async authenticate(auth) {
        console.log('authenticate auth =>');
        console.info(auth);
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            const result = {
                code: 422,
                message: 'This email or user not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลหรือบัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('authenticate isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == 0) {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    username: userChk.username,
                    token: null,
                    message: 'This user account is locked. Please contact the administrator.',
                    message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            var user2 = await this.userService.finduserId(user.id);
            var loginfailed1 = user2.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            const result = {
                code: 200,
                message: 'Password is incorrect.',
                message_th: 'รหัสผ่านไม่ถูกต้อง',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                message: 'This user account is locked. Please contact the administrator.',
                message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const createddateRT = format.timeConvertermas(user.createddate);
        const status = user.status;
        if (status == '' || status == 0 || status == false) {
            const result = {
                code: 200,
                message: 'This email or username not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    token: null,
                    msg: 'login failed',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            const tokenRs = await this.jwtService.sign({ id: user.id });
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(user.id, hashedrefreshtoken);
            return {
                code: 200,
                uid: user.id,
                email: user.email,
                username: user.username,
                token: tokenRs,
            };
        }
    }
    async authenticateEmail(auth) {
        console.log('authenticate auth =>');
        console.info(auth);
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            const result = {
                code: 422,
                message: 'This email or user not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลหรือบัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('authenticate isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == 0) {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    username: userChk.username,
                    token: null,
                    message: 'This user account is locked. Please contact the administrator.',
                    message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            var user2 = await this.userService.finduserId(user.id);
            var loginfailed1 = user2.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            const result = {
                code: 200,
                message: 'Password is incorrect.',
                message_th: 'รหัสผ่านไม่ถูกต้อง',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                message: 'This user account is locked. Please contact the administrator.',
                message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const createddateRT = format.timeConvertermas(user.createddate);
        const status = user.status;
        if (status == '' || status == 0 || status == false) {
            const result = {
                code: 200,
                message: 'This email or username not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    token: null,
                    msg: 'login failed',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            await this.jwtService.sign({ id: user.id });
            const tokenRs = await this.jwtService.sign({
                id: user.id,
                expiresIn: process.env.EXPIRE_TOKEN || '30d',
                secret: process.env.SECRET_KEY,
            });
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(user.id, hashedrefreshtoken);
            return {
                code: 200,
                uid: user.id,
                email: user.email,
                username: user.username,
                token: tokenRs,
            };
        }
    }
    async authenticateuser(auth) {
        console.log('authenticate auth =>');
        console.info(auth);
        console.log('auth.email =>' + auth.username);
        const user = await this.userService.getUserByusernameauth(auth.username);
        console.log('user =>');
        console.info(user);
        if (!user) {
            const result = {
                code: 422,
                message: 'This username  not found data or Inactive',
                message_th: 'ไม่พบข้อมูลใน บัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('authenticate isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == 0) {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    username: userChk.username,
                    token: null,
                    message: 'This user account is locked. Please contact the administrator.',
                    message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            var user2 = await this.userService.finduserId(user.id);
            var loginfailed1 = user2.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            const result = {
                code: 200,
                message: 'Password is incorrect.',
                message_th: 'รหัสผ่านไม่ถูกต้อง',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                message: 'This user account is locked. Please contact the administrator.',
                message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const createddateRT = format.timeConvertermas(user.createddate);
        const status = user.status;
        if (status == '' || status == 0 || status == false) {
            const result = {
                code: 200,
                message: 'This email or username not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    token: null,
                    msg: 'login failed',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            const tokenRs = await this.jwtService.sign({
                id: user.id,
                expiresIn: process.env.EXPIRE_TOKEN || '30d',
                secret: process.env.SECRET_KEY,
            });
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(user.id, hashedrefreshtoken);
            return {
                code: 200,
                uid: user.id,
                email: user.email,
                username: user.username,
                token: tokenRs,
            };
        }
    }
    async authenticateemail(auth) {
        console.log('authenticate auth =>');
        console.info(auth);
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            const result = {
                code: 422,
                message: 'This email not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('authenticate isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == 0) {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    username: userChk.username,
                    token: null,
                    message: 'This user account is locked. Please contact the administrator.',
                    message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            var user2 = await this.userService.finduserId(user.id);
            var loginfailed1 = user2.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            const result = {
                code: 200,
                message: 'Password is incorrect.',
                message_th: 'รหัสผ่านไม่ถูกต้อง',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                message: 'This user account is locked. Please contact the administrator.',
                message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const createddateRT = format.timeConvertermas(user.createddate);
        const status = user.status;
        if (status == '' || status == 0 || status == false) {
            const result = {
                code: 200,
                message: 'This email or username not found data or Inactive',
                message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    token: null,
                    msg: 'login failed',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            const tokenRs = await this.jwtService.sign({
                id: user.id,
                expiresIn: process.env.EXPIRE_TOKEN || '30d',
                secret: process.env.SECRET_KEY,
            });
            const hashedrefreshtoken = await this.generateAccessToken(user.id);
            const updaterefreshtoken = await this.userService.updaterefreshtoken(user.id, hashedrefreshtoken);
            return {
                code: 200,
                uid: user.id,
                email: user.email,
                username: user.username,
                token: tokenRs,
            };
        }
    }
    async authenticateUserAuthen(auth) {
        var user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            var user = await this.userService.getUserByusername(auth.email);
            if (!user) {
                const data = {
                    code: 422,
                    uid: null,
                    email: null,
                    token: null,
                    msg: 'Invalid credentials',
                    loginfailed: 0,
                };
                return await data;
            }
        }
        else if (!user) {
            const data = {
                code: 422,
                uid: null,
                email: null,
                token: null,
                msg: 'Invalid credentials',
                loginfailed: 0,
            };
            return await data;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                token: null,
                msg: 'login failed',
                loginfailed: loginfailed1,
            };
            return await data;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        if (!isRightPassword) {
            var userChk = await this.userService.finduserId(user.id);
            var loginfailed1 = userChk.loginfailed;
            if (loginfailed1 >= 10) {
                const data = {
                    code: 422,
                    uid: userChk.id,
                    email: userChk.email,
                    username: userChk.username,
                    token: null,
                    message: 'This user account is locked. Please contact the administrator.',
                    message_th: 'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
                    loginfailed: loginfailed1,
                };
                return await data;
            }
            var user2 = await this.userService.finduserId(user.id);
            var loginfailed1 = user2.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            const result = {
                code: 422,
                message: 'Password is incorrect.',
                message_th: 'รหัสผ่านไม่ถูกต้อง',
                payload: { proFile: null },
            };
            return result;
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                message: 'Password is incorrect ' + loginfailed1,
                message_th: 'รหัสผ่านไม่ถูกต้อง ' + loginfailed1,
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const tokenRs = await this.jwtService.sign({
            id: user.id,
            expiresIn: process.env.EXPIRE_TOKEN || '30d',
            secret: process.env.SECRET_KEY,
        });
        const userId = user.id;
        const gentoken = await this.generateAccessToken(userId);
        await this.userService.updaterefreshtoken(userId, gentoken);
        const data = {
            code: 422,
            message: 'login failed',
            message_th: 'login failed',
            uid: user.id,
            email: user.email,
            username: user.username,
            roleId: user.role_id,
            authUser: user.username,
            token: tokenRs,
            loginfailed: loginfailed1,
        };
        return await data;
    }
    async authenticateUserAuthen2(auth) {
        var user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            var user = await this.userService.getUserByusername(auth.email);
            if (!user) {
                const data = {
                    code: 200,
                    message: 'ok',
                    message_th: 'Success',
                    uid: null,
                    email: null,
                    token: null,
                    loginfailed: 0,
                };
                return await data;
            }
        }
        else if (!user) {
            const data = {
                code: 422,
                message: 'login failed',
                message_th: 'login failed',
                uid: null,
                email: null,
                token: null,
                loginfailed: 0,
            };
            return await data;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                message: 'login failed',
                message_th: 'login failed',
                uid: userChk.id,
                email: userChk.email,
                token: null,
                loginfailed: loginfailed1,
            };
            return await data;
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == null) {
            var user = await this.userService.finduserId(user.id);
            var loginfailed1 = user.loginfailed;
            var loginfailed = loginfailed1 + 1;
            await this.userService.updatereloginfailed(user.id, loginfailed);
            throw new common_1.BadRequestException('Invalid credentials');
        }
        else {
            var loginfailed = 0;
        }
        var userChk = await this.userService.finduserId(user.id);
        var loginfailed1 = userChk.loginfailed;
        if (loginfailed1 >= 10) {
            const data = {
                code: 422,
                message: 'login failed',
                message_th: 'login failed',
                uid: userChk.id,
                email: userChk.email,
                username: userChk.username,
                token: null,
                loginfailed: loginfailed1,
            };
            return await data;
        }
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword != false || isRightPassword != 0) {
            var loginfailed = 0;
            await this.userService.updatereloginfailed(user.id, loginfailed);
        }
        const tokenRs = await this.jwtService.sign({
            id: user.id,
            expiresIn: process.env.EXPIRE_TOKEN || '30d',
            secret: process.env.SECRET_KEY,
        });
        const userId = user.id;
        const gentoken = await this.generateAccessToken(userId);
        await this.userService.updaterefreshtoken(userId, gentoken);
        const data = {
            code: 200,
            message: 'ok',
            message_th: 'Success',
            uid: user.id,
            email: user.email,
            username: user.username,
            roleid: user.role_id,
            authUser: user.username,
            token: tokenRs,
            loginfailed: loginfailed1,
        };
        return await data;
    }
    async userUnlock(auth) {
        var user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            var user = await this.userService.getUserByusername(auth.email);
            if (!user) {
                throw new common_1.BadRequestException();
            }
        }
        else if (!user) {
            throw new common_1.BadRequestException();
        }
        var loginfailed = 0;
        await this.userService.updatereloginfailed(user.id, loginfailed);
        const data = {
            code: 422,
            message: 'login failed',
            message_th: 'login failed',
            uid: user.id,
            email: user.email,
            username: user.username,
            token: null,
            loginfailed: loginfailed,
        };
        return await data;
    }
    async authenticateUserEmail(auth) {
        const user = await this.userService.getUserByEmail(auth.email);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        if (!isRightPassword) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const tokenRs = await this.jwtService.sign({
            id: user.id,
            expiresIn: process.env.EXPIRE_TOKEN || '30d',
            secret: process.env.SECRET_KEY,
        });
        const userId = user.id;
        const gentoken = await this.generateAccessToken(userId);
        await this.userService.updaterefreshtoken(userId, gentoken);
        const data = {
            code: 200,
            message: 'ok',
            message_th: 'Success',
            uid: user.id,
            email: user.email,
            username: user.username,
            token: tokenRs,
        };
        return await data;
    }
    async authenticateUser(auth) {
        const user = await this.userService.getUserByusername(auth.username);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const isRightPassword = await this.userService.compareHash(auth.password, user.password);
        console.log('isRightPassword =>');
        console.info(isRightPassword);
        if (isRightPassword == false || isRightPassword == 0) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const tokenRs = await this.jwtService.sign({
            id: user.id,
            expiresIn: process.env.EXPIRE_TOKEN || '30d',
            secret: process.env.SECRET_KEY,
        });
        const refreshtoken = await this.generateAccessToken(user.id);
        console.log('refreshtoken =>' + refreshtoken);
        this.userService.updaterefreshtoken(user.id, refreshtoken);
        const rt = await {
            code: 200,
            message: 'ok',
            message_th: 'Success',
            uid: user.id,
            email: user.email,
            username: user.username,
            token: tokenRs,
        };
        return rt;
    }
    async authenticateToken(auth) {
        return { token: this.jwtService.sign({ id: auth }) };
    }
    async checkRefreshToken(id) {
        const user = await this.userService.finduserId(id);
        if (!user || !user.refresh_token) {
            throw new common_1.BadRequestException('Invalid Token');
        }
    }
    async checkRefreshTokenInt(id) {
        const user = await this.userService.finduserId(id);
        if (!user || !user.refresh_token) {
            return await 0;
        }
        else {
            return await 1;
        }
    }
    async validateRefreshToken(id, refreshtoken) {
        const user = await this.userService.finduserId(id);
        if (!user || !user.refresh_token)
            throw new common_1.BadRequestException('Invalid Refresh Token');
        const refreshTokenMatches = await argon2.verify(user.refresh_token, refreshtoken);
        if (!refreshTokenMatches)
            throw new common_1.BadRequestException('Invalid Refresh Token');
        return { id: id };
    }
    async validateGoogleUser(googleUser) {
        const user = await this.userService.findByEmail(googleUser.email);
        if (user)
            return user;
        return await this.userService.create(googleUser);
    }
    async generateAccessToken(id) {
        const token = await this.jwtService.signAsync({ id: id });
        return token;
    }
    async generateRefreshToken(id, expiresIn) {
        const token = await this.jwtService.sign({
            id: id,
            expiresIn: process.env.EXPIRE_TOKEN || '30d',
            secret: process.env.SECRET_KEY,
        });
        return token;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map