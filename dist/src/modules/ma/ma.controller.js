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
exports.MaController = void 0;
const common_1 = require("@nestjs/common");
const ma_service_1 = require("./ma.service");
const create_ma_dto_1 = require("./dto/create-ma.dto");
const update_ma_dto_1 = require("./dto/update-ma.dto");
let MaController = class MaController {
    constructor(maService) {
        this.maService = maService;
    }
    create(createMaDto) {
        return this.maService.create(createMaDto);
    }
    findAll() {
        return this.maService.findAll();
    }
    findOne(id) {
        return this.maService.findOne(+id);
    }
    update(id, updateMaDto) {
        return this.maService.update(+id, updateMaDto);
    }
    remove(id) {
        return this.maService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ma_dto_1.CreateMaDto]),
    __metadata("design:returntype", void 0)
], MaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ma_dto_1.UpdateMaDto]),
    __metadata("design:returntype", void 0)
], MaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaController.prototype, "remove", null);
MaController = __decorate([
    (0, common_1.Controller)('ma'),
    __metadata("design:paramtypes", [ma_service_1.MaService])
], MaController);
exports.MaController = MaController;
//# sourceMappingURL=ma.controller.js.map