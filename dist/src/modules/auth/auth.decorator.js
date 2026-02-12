"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.PUBLIC_KEY = exports.auth = exports.AuthTokenRequired = exports.AuthUserRequired2 = exports.AuthUserRequired = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("@nestjs/passport/dist/auth.guard");
require("dotenv/config");
require('dotenv').config();
async function getData(data) {
    console.log('getData data=>');
    console.info(data);
    try {
        var response = await data;
        console.log('getData response=>');
        console.info(response);
        return response;
    }
    catch (error) {
        console.error(error);
    }
}
function AuthUserRequired() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt')), (0, swagger_1.ApiBearerAuth)('default'));
}
exports.AuthUserRequired = AuthUserRequired;
function AuthUserRequired2() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt')), (0, swagger_1.ApiBearerAuth)('default'));
}
exports.AuthUserRequired2 = AuthUserRequired2;
function AuthTokenRequired() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt-external-user')), (0, swagger_1.ApiBearerAuth)('default'));
}
exports.AuthTokenRequired = AuthTokenRequired;
class auth {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async GetrefreshToken(req) {
        console.log('REDIS_PORT: ' + process.env.REDIS_PORT);
        let jwt = req.headers.authorization.replace('Bearer ', '');
        let jsonString = this.jwtService.decode(jwt);
    }
}
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], auth.prototype, "GetrefreshToken", null);
exports.auth = auth;
exports.PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.PUBLIC_KEY, true);
exports.Public = Public;
//# sourceMappingURL=auth.decorator.js.map