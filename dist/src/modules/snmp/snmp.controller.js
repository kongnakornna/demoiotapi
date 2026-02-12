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
exports.SnmpController = void 0;
const common_1 = require("@nestjs/common");
const snmp_service_1 = require("./snmp.service");
const create_snmp_dto_1 = require("./dto/create-snmp.dto");
const update_snmp_dto_1 = require("./dto/update-snmp.dto");
let SnmpController = class SnmpController {
    constructor(snmpService) {
        this.snmpService = snmpService;
    }
    create(createSnmpDto) {
        return this.snmpService.create(createSnmpDto);
    }
    findAll() {
        return this.snmpService.findAll();
    }
    findOne(id) {
        return this.snmpService.findOne(+id);
    }
    update(id, updateSnmpDto) {
        return this.snmpService.update(+id, updateSnmpDto);
    }
    remove(id) {
        return this.snmpService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_snmp_dto_1.CreateSnmpDto]),
    __metadata("design:returntype", void 0)
], SnmpController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SnmpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SnmpController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_snmp_dto_1.UpdateSnmpDto]),
    __metadata("design:returntype", void 0)
], SnmpController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SnmpController.prototype, "remove", null);
SnmpController = __decorate([
    (0, common_1.Controller)('snmp'),
    __metadata("design:paramtypes", [snmp_service_1.SnmpService])
], SnmpController);
exports.SnmpController = SnmpController;
//# sourceMappingURL=snmp.controller.js.map