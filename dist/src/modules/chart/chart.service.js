"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartService = void 0;
const common_1 = require("@nestjs/common");
let ChartService = class ChartService {
    create(createChartDto) {
        return 'This action adds a new chart';
    }
    findAll() {
        return `This action returns all chart`;
    }
    findOne(id) {
        return `This action returns a #${id} chart`;
    }
    update(id, updateChartDto) {
        return `This action updates a #${id} chart`;
    }
    remove(id) {
        return `This action removes a #${id} chart`;
    }
};
ChartService = __decorate([
    (0, common_1.Injectable)()
], ChartService);
exports.ChartService = ChartService;
//# sourceMappingURL=chart.service.js.map