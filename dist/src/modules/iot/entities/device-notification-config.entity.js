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
exports.DeviceNotificationConfig = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
const sd_notification_channel_entity_1 = require("./sd-notification-channel.entity");
const sd_notification_type_entity_1 = require("./sd-notification-type.entity");
let DeviceNotificationConfig = class DeviceNotificationConfig {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'device_id' }),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_entity_1.Device)
], DeviceNotificationConfig.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_channel_id' }),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "notificationChannelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_channel_entity_1.NotificationChannel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_channel_id' }),
    __metadata("design:type", sd_notification_channel_entity_1.NotificationChannel)
], DeviceNotificationConfig.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_type_id' }),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "notificationTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_type_entity_1.NotificationType, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_type_id' }),
    __metadata("design:type", sd_notification_type_entity_1.NotificationType)
], DeviceNotificationConfig.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], DeviceNotificationConfig.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], DeviceNotificationConfig.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_count', default: 3 }),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_delay_minutes', default: 5 }),
    __metadata("design:type", Number)
], DeviceNotificationConfig.prototype, "retryDelayMinutes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeviceNotificationConfig.prototype, "createdAt", void 0);
DeviceNotificationConfig = __decorate([
    (0, typeorm_1.Entity)('sd_device_notification_config'),
    (0, typeorm_1.Unique)('unique_Device_channel_type', ['DeviceId', 'notificationChannelId', 'notificationTypeId'])
], DeviceNotificationConfig);
exports.DeviceNotificationConfig = DeviceNotificationConfig;
//# sourceMappingURL=device-notification-config.entity.js.map