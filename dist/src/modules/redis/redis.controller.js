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
exports.RedisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const redis_service_1 = require("./redis.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
const redis_dto_1 = require("./dto/redis.dto");
var Cache = new redis_cache_1.CacheDataOne();
const format = __importStar(require("../../helpers/format.helper"));
let RedisController = class RedisController {
    constructor(RedisService) {
        this.RedisService = RedisService;
    }
    async otpIndex(Request) {
        let secretkey = Request.headers.secretkey;
        let time = Request.headers.time || 60;
        console.log('Request_headers_secretkey=>' + secretkey);
        console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
        console.log('Request_headers_time=>' + time);
        if (secretkey != process.env.SECRET_KEY) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! SKEY is not valid . ',
            };
            return result;
        }
        const Randomint = format.getRandomint(6);
        const otpot = await Cache.OTPTIME(Randomint, time);
        console.info('otpot', otpot);
        var result = {
            statuscode: 200,
            message: 'OTP',
            payload: otpot,
        };
        return result;
    }
    async otp(Request) {
        let secretkey = Request.headers.secretkey;
        let time = Number(Request.headers.time) || 60;
        console.log('Request_headers_secretkey=>' + secretkey);
        console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
        console.log('Request_headers_time=>' + time);
        if (secretkey != process.env.SECRET_KEY) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! SKEY is not valid . ',
            };
            return result;
        }
        const Randomint = format.getRandomint(6);
        const otpot = await Cache.OTPTIME(Randomint, time);
        const keycache = otpot.key;
        const otpvalidate = otpot.otp;
        console.info('otpot', otpot);
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
    async validateOTP(Request, res, caseModel) {
        let secretkey = Request.headers.secretkey;
        let time = Request.headers.time || 60;
        console.log('Request_headers_secretkey=>' + secretkey);
        console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
        console.log('Request_headers_time=>' + time);
        const keycache = caseModel.keycache;
        const otpvalidate = caseModel.otpvalidate;
        console.log('keycache=>' + keycache);
        console.log('otpvalidate=>' + otpvalidate);
        if (secretkey != process.env.SECRET_KEY) {
            var result = {
                statuscode: 200,
                message: 'Forbidden! SKEY is not valid . ',
            };
            return result;
        }
        console.info('keycache', keycache);
        console.info('otpvalidate', otpvalidate);
        var input = {
            keycache: keycache,
            otpvalidate: otpvalidate,
        };
        var result = {
            statuscode: 200,
            message: 'OTP',
            payload: Cache.validateOTP(input),
        };
        console.info('otp result', result);
        return result;
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "otpIndex", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Get)('/otp'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "otp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'This Redis.' }),
    (0, common_1.Post)('/validateotp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Response,
        redis_dto_1.redisDto]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "validateOTP", null);
RedisController = __decorate([
    (0, common_1.Controller)('redis'),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisController);
exports.RedisController = RedisController;
//# sourceMappingURL=redis.controller.js.map