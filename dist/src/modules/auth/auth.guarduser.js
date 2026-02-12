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
exports.AuthGuardUser = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
require('dotenv').config();
const users_service_1 = require("../users/users.service");
let AuthGuardUser = class AuthGuardUser {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Authorization header is missing or invalid.');
        }
        const token = request.headers.authorization.replace('Bearer ', '').trim();
        const refreshToken = request
            .get('authorization')
            .replace('Bearer', '')
            .trim();
        if (!token) {
            const decoded = this.jwtService.decode(token);
            request.user = decoded;
            return false;
        }
        try {
            const decoded = this.jwtService.decode(token);
            request.user = decoded;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    canActivateS(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization
            .replace('Bearer ', '')
            .replace('Bearer ', '');
        console.log(' AuthGuard ~ token --' + token);
        let jsonString = this.jwtService.decode(token);
        const decoded = this.jwtService.decode(token);
        request.user = decoded;
        const idx = decoded.id;
        console.log('idx=>' + idx);
        try {
            if (idx) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    }
};
AuthGuardUser = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthGuardUser);
exports.AuthGuardUser = AuthGuardUser;
//# sourceMappingURL=auth.guarduser.js.map