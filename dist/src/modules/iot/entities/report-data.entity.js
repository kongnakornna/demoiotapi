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
exports.ReportData = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
let ReportData = class ReportData {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReportData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'device_id' }),
    __metadata("design:type", Number)
], ReportData.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_entity_1.Device)
], ReportData.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id', nullable: true }),
    __metadata("design:type", Number)
], ReportData.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'report_type', length: 50 }),
    __metadata("design:type", String)
], ReportData.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ReportData.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'period_start' }),
    __metadata("design:type", Date)
], ReportData.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'period_end' }),
    __metadata("design:type", Date)
], ReportData.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'generated_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ReportData.prototype, "generatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', length: 500, nullable: true }),
    __metadata("design:type", String)
], ReportData.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_format', length: 20, nullable: true }),
    __metadata("design:type", String)
], ReportData.prototype, "fileFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_exported', default: false }),
    __metadata("design:type", Boolean)
], ReportData.prototype, "isExported", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exported_at', nullable: true }),
    __metadata("design:type", Date)
], ReportData.prototype, "exportedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReportData.prototype, "createdAt", void 0);
ReportData = __decorate([
    (0, typeorm_1.Entity)('sd_report_data')
], ReportData);
exports.ReportData = ReportData;
//# sourceMappingURL=report-data.entity.js.map