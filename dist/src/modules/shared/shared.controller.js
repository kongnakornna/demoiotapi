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
exports.SharedController = void 0;
const common_1 = require("@nestjs/common");
var moment = require('moment');
const shared_service_1 = require("./shared.service");
const auth_decorator_1 = require("../auth/auth.decorator");
require("dotenv/config");
require('dotenv').config();
let SharedController = class SharedController {
    constructor(sharedService) {
        this.sharedService = sharedService;
    }
    async index(res, dto, query, headers, params, req) {
        let getIndex = await this.sharedService.getIndex();
        var result = {
            statuscode: 200,
            message: 'OK',
            data: getIndex,
        };
        res.status(200).json({ result });
        return;
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, auth_decorator_1.AuthUserRequired)(),
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
], SharedController.prototype, "index", null);
SharedController = __decorate([
    (0, common_1.Controller)('shared'),
    __metadata("design:paramtypes", [shared_service_1.SharedService])
], SharedController);
exports.SharedController = SharedController;
//# sourceMappingURL=shared.controller.js.map