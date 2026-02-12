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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
require('dotenv').config();
let RefreshJwtGuard = class RefreshJwtGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        console.log('RefreshJwtGuard token : ' + request);
        console.log('RefreshJwtGuard token : ' + token);
        if (!token)
            throw new common_1.UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET_KEY,
            });
            console.log('RefreshJwtGuard payload : ' + payload);
            request['user'] = payload;
        }
        catch (_a) {
            throw new common_1.UnauthorizedException();
        }
        return true;
    }
    async deCodeToken(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const decoded = this.jwtService.decode(token);
        return decoded;
    }
    extractTokenFromHeader(request) {
        var _a;
        const [type, token] = (_a = request.headers.authorization.split(' ')) !== null && _a !== void 0 ? _a : [];
        return type === 'Refresh' ? token : undefined;
    }
};
RefreshJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], RefreshJwtGuard);
exports.RefreshJwtGuard = RefreshJwtGuard;
//# sourceMappingURL=refresh.guard.js.map