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
exports.dashboardConfig = void 0;
const typeorm_1 = require("typeorm");
let dashboardConfig = class dashboardConfig {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], dashboardConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], dashboardConfig.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], dashboardConfig.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'config_data',
        type: 'json',
    }),
    __metadata("design:type", Object)
], dashboardConfig.prototype, "config_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], dashboardConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_date' }),
    __metadata("design:type", Date)
], dashboardConfig.prototype, "created_date", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_date' }),
    __metadata("design:type", Date)
], dashboardConfig.prototype, "updated_date", void 0);
dashboardConfig = __decorate([
    (0, typeorm_1.Entity)('sd_dashboard_config')
], dashboardConfig);
exports.dashboardConfig = dashboardConfig;
//# sourceMappingURL=dashboard-config.entity.js.map