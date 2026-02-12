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
exports.NotificationLog = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
const sd_notification_type_entity_1 = require("./sd-notification-type.entity");
const sd_notification_channel_entity_1 = require("./sd-notification-channel.entity");
let NotificationLog = class NotificationLog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotificationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'device_id', nullable: true }),
    __metadata("design:type", Number)
], NotificationLog.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_entity_1.Device)
], NotificationLog.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_type_id', nullable: true }),
    __metadata("design:type", Number)
], NotificationLog.prototype, "notificationTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_type_entity_1.NotificationType, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_type_id' }),
    __metadata("design:type", sd_notification_type_entity_1.NotificationType)
], NotificationLog.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_channel_id', nullable: true }),
    __metadata("design:type", Number)
], NotificationLog.prototype, "notificationChannelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_channel_entity_1.NotificationChannel, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_channel_id' }),
    __metadata("design:type", sd_notification_channel_entity_1.NotificationChannel)
], NotificationLog.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id', nullable: true }),
    __metadata("design:type", Number)
], NotificationLog.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], NotificationLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ length: 20, default: 'pending' }),
    __metadata("design:type", String)
], NotificationLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NotificationLog.prototype, "responseData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', nullable: true }),
    __metadata("design:type", Date)
], NotificationLog.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', nullable: true }),
    __metadata("design:type", Date)
], NotificationLog.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_at', nullable: true }),
    __metadata("design:type", Date)
], NotificationLog.prototype, "read_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'retry_count', default: 0 }),
    __metadata("design:type", Number)
], NotificationLog.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NotificationLog.prototype, "createdAt", void 0);
NotificationLog = __decorate([
    (0, typeorm_1.Entity)('sd_notification_log')
], NotificationLog);
exports.NotificationLog = NotificationLog;
//# sourceMappingURL=notification-log.entity.js.map