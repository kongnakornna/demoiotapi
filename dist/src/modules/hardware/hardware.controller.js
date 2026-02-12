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
exports.HardwareController = void 0;
const common_1 = require("@nestjs/common");
const hardware_service_1 = require("./hardware.service");
const create_hardware_dto_1 = require("./dto/create-hardware.dto");
const update_hardware_dto_1 = require("./dto/update-hardware.dto");
let HardwareController = class HardwareController {
    constructor(hardwareService) {
        this.hardwareService = hardwareService;
    }
    create(createHardwareDto) {
        return this.hardwareService.create(createHardwareDto);
    }
    findAll() {
        return this.hardwareService.findAll();
    }
    findOne(id) {
        return this.hardwareService.findOne(+id);
    }
    update(id, updateHardwareDto) {
        return this.hardwareService.update(+id, updateHardwareDto);
    }
    remove(id) {
        return this.hardwareService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hardware_dto_1.CreateHardwareDto]),
    __metadata("design:returntype", void 0)
], HardwareController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HardwareController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HardwareController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hardware_dto_1.UpdateHardwareDto]),
    __metadata("design:returntype", void 0)
], HardwareController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HardwareController.prototype, "remove", null);
HardwareController = __decorate([
    (0, common_1.Controller)('hardware'),
    __metadata("design:paramtypes", [hardware_service_1.HardwareService])
], HardwareController);
exports.HardwareController = HardwareController;
//# sourceMappingURL=hardware.controller.js.map