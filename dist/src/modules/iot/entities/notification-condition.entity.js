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
exports.NotificationCondition = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
const sd_notification_type_entity_1 = require("./sd-notification-type.entity");
let NotificationCondition = class NotificationCondition {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'device_id' }),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_entity_1.Device)
], NotificationCondition.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_type_id' }),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "notificationTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_type_entity_1.NotificationType, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_type_id' }),
    __metadata("design:type", sd_notification_type_entity_1.NotificationType)
], NotificationCondition.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'condition_operator', length: 10, default: 'between' }),
    __metadata("design:type", String)
], NotificationCondition.prototype, "conditionOperator", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], NotificationCondition.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], NotificationCondition.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NotificationCondition.prototype, "createdAt", void 0);
NotificationCondition = __decorate([
    (0, typeorm_1.Entity)('sd_notification_condition')
], NotificationCondition);
exports.NotificationCondition = NotificationCondition;
//# sourceMappingURL=notification-condition.entity.js.map