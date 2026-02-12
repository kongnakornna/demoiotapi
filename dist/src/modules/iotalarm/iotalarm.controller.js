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
exports.IotalarmController = void 0;
const common_1 = require("@nestjs/common");
const iotalarm_service_1 = require("./iotalarm.service");
const create_iotalarm_dto_1 = require("./dto/create-iotalarm.dto");
const update_iotalarm_dto_1 = require("./dto/update-iotalarm.dto");
let IotalarmController = class IotalarmController {
    constructor(iotalarmService) {
        this.iotalarmService = iotalarmService;
    }
    create(createIotalarmDto) {
        return this.iotalarmService.create(createIotalarmDto);
    }
    findAll() {
        return this.iotalarmService.findAll();
    }
    findOne(id) {
        return this.iotalarmService.findOne(+id);
    }
    update(id, updateIotalarmDto) {
        return this.iotalarmService.update(+id, updateIotalarmDto);
    }
    remove(id) {
        return this.iotalarmService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_iotalarm_dto_1.CreateIotalarmDto]),
    __metadata("design:returntype", void 0)
], IotalarmController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotalarmController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IotalarmController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_iotalarm_dto_1.UpdateIotalarmDto]),
    __metadata("design:returntype", void 0)
], IotalarmController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IotalarmController.prototype, "remove", null);
IotalarmController = __decorate([
    (0, common_1.Controller)('iotalarm'),
    __metadata("design:paramtypes", [iotalarm_service_1.IotalarmService])
], IotalarmController);
exports.IotalarmController = IotalarmController;
//# sourceMappingURL=iotalarm.controller.js.map