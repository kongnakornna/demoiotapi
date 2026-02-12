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
exports.AccessmenuController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/auth.decorator");
var moment = require('moment');
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_2 = require("../auth/auth.decorator");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("../users/users.service");
const redis_cache_1 = require("../../utils/cache/redis.cache");
var Cache = new redis_cache_1.CacheDataOne();
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const jwt_1 = require("@nestjs/jwt");
const auth_guarduser_1 = require("../auth/auth.guarduser");
const accessmenu_service_1 = require("./accessmenu.service");
const create_accessmenu_dto_1 = require("./dto/create-accessmenu.dto");
const update_accessmenu_dto_1 = require("./dto/update-accessmenu.dto");
let AccessmenuController = class AccessmenuController {
    constructor(accessmenuService, usersService, authService, jwtService) {
        this.accessmenuService = accessmenuService;
        this.usersService = usersService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async create(Request, res, headers, createAccessmenuDto) {
        let payloads = await this.accessmenuService.create(createAccessmenuDto);
        res.status(200).json({
            statusCode: 200,
            payload: payloads,
            message: 'Post.',
            message_th: 'Post.',
        });
        return;
    }
    async getHello(req) {
        var payload = await this.accessmenuService.getHello();
        var result = {
            statusCode: 200,
            code: 200,
            message: 'Index accessmenu',
            payload: payload,
        };
        return result;
    }
    async findAll(res, query, headers, params, req) {
        let admin_access_id = query.admin_access_id || '';
        let admin_type_id = query.admin_type_id || 1;
        let admin_menu_id = query.admin_menu_id || '';
        let InputData = {};
        InputData.admin_access_id = admin_access_id;
        InputData.admin_type_id = admin_type_id;
        InputData.admin_menu_id = admin_menu_id;
        const Results = await this.accessmenuService.findAll(InputData);
        res.status(200).json({
            statusCode: 200,
            payload: Results,
            message: 'find accessss.',
            message_th: 'find accessss.',
        });
        return;
    }
    async finduseraccessss(Request, res, headers, Param, query) {
        let access_id = query.access_id || null;
        let type_id = query.type_id || 1;
        let menu_id = query.menu_id || 1;
        let parent_id = query.parent_id || null;
        let count = query.count || 0;
        let InputData_row = {};
        InputData_row.access_id = access_id;
        InputData_row.type_id = type_id;
        InputData_row.menu_id = menu_id;
        InputData_row.parent_id = parent_id;
        InputData_row.count = 1;
        const Results_row = await this.accessmenuService.findAllUserMunu(InputData_row);
        let InputData = {};
        InputData.access_id = access_id;
        InputData.type_id = type_id;
        InputData.menu_id = menu_id;
        InputData.parent_id = parent_id;
        InputData.count = null;
        const Results = await this.accessmenuService.findAllUserMunu(InputData);
        let payloads = {};
        payloads.row = Results_row;
        payloads.Results = Results;
        res.status(200).json({
            statusCode: 200,
            payload: payloads,
            message: 'find user accessss.',
            message_th: 'find user accessss.',
        });
        return;
    }
    async findOne(res, query, headers, id, req) {
        return await this.accessmenuService.findOne(+id);
    }
    async update(res, query, headers, id, updateAccessmenuDto) {
        return await this.accessmenuService.update(+id, updateAccessmenuDto);
    }
    async remove(res, query, headers, id) {
        return await this.accessmenuService.remove(+id);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Post Accessmenu' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, create_accessmenu_dto_1.CreateAccessmenuDto]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "create", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "getHello", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Get Accessmenu' }),
    (0, common_1.Get)('findall'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, common_1.Get)('/finduseraccessss'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "finduseraccessss", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Get Accessmenu' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)('id')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Patch Accessmenu' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)('id')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, update_accessmenu_dto_1.UpdateAccessmenuDto]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, auth_decorator_2.AuthUserRequired)(),
    (0, common_1.UseGuards)(auth_guarduser_1.AuthGuardUser),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Accessmenu' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], AccessmenuController.prototype, "remove", null);
AccessmenuController = __decorate([
    (0, swagger_1.ApiTags)('accessmenu'),
    (0, common_1.Controller)('accessmenu'),
    __metadata("design:paramtypes", [accessmenu_service_1.AccessmenuService,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], AccessmenuController);
exports.AccessmenuController = AccessmenuController;
//# sourceMappingURL=accessmenu.controller.js.map