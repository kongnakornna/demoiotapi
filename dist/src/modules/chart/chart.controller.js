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
exports.ChartController = void 0;
const common_1 = require("@nestjs/common");
const chart_service_1 = require("./chart.service");
const create_chart_dto_1 = require("./dto/create-chart.dto");
const update_chart_dto_1 = require("./dto/update-chart.dto");
let ChartController = class ChartController {
    constructor(chartService) {
        this.chartService = chartService;
    }
    create(createChartDto) {
        return this.chartService.create(createChartDto);
    }
    findAll() {
        return this.chartService.findAll();
    }
    findOne(id) {
        return this.chartService.findOne(+id);
    }
    update(id, updateChartDto) {
        return this.chartService.update(+id, updateChartDto);
    }
    remove(id) {
        return this.chartService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chart_dto_1.CreateChartDto]),
    __metadata("design:returntype", void 0)
], ChartController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChartController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chart_dto_1.UpdateChartDto]),
    __metadata("design:returntype", void 0)
], ChartController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartController.prototype, "remove", null);
ChartController = __decorate([
    (0, common_1.Controller)('chart'),
    __metadata("design:paramtypes", [chart_service_1.ChartService])
], ChartController);
exports.ChartController = ChartController;
//# sourceMappingURL=chart.controller.js.map