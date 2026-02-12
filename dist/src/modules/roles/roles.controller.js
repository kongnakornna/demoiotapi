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
exports.RolesController = void 0;
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
const auth_guarduser_1 = require("../auth/auth.guarduser");
const { passwordStrength } = require('check-password-strength');
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const roles_service_1 = require("./roles.service");
let RolesController = class RolesController {
    constructor(rolesService, usersService, authService, jwtService) {
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async index(res, dto, query, headers, params, req) {
        var getlist = await this.rolesService.getlist();
        var result = {
            statuscode: 200,
            message: 'Role',
            payload: getlist,
        };
        res.status(200).json(result);
        return;
    }
    async list(res, dto, query, headers, params, req) {
        var getlist = await this.rolesService.getlist();
        var result = {
            statuscode: 200,
            message: 'Role',
            payload: getlist,
        };
        res.status(200).json(result);
        return;
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Role' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "index", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_1.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Role list' }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "list", null);
RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], RolesController);
exports.RolesController = RolesController;
//# sourceMappingURL=roles.controller.js.map