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
exports.DeviceSchedule = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
let DeviceSchedule = class DeviceSchedule {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'device_id' }),
    __metadata("design:type", Number)
], DeviceSchedule.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_entity_1.Device)
], DeviceSchedule.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], DeviceSchedule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceSchedule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'schedule_type', length: 50 }),
    __metadata("design:type", String)
], DeviceSchedule.prototype, "scheduleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schedule_config', type: 'jsonb' }),
    __metadata("design:type", Object)
], DeviceSchedule.prototype, "scheduleConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], DeviceSchedule.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], DeviceSchedule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_run_at', nullable: true }),
    __metadata("design:type", Date)
], DeviceSchedule.prototype, "lastRunAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'next_run_at', nullable: true }),
    __metadata("design:type", Date)
], DeviceSchedule.prototype, "nextRunAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'run_count', default: 0 }),
    __metadata("design:type", Number)
], DeviceSchedule.prototype, "runCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeviceSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DeviceSchedule.prototype, "updatedAt", void 0);
DeviceSchedule = __decorate([
    (0, typeorm_1.Entity)('sd_device_schedule')
], DeviceSchedule);
exports.DeviceSchedule = DeviceSchedule;
//# sourceMappingURL=device-schedule.entity.js.map