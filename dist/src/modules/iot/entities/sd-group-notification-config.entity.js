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
exports.GroupNotificationConfig = void 0;
const typeorm_1 = require("typeorm");
const device_group_entity_1 = require("./device-group.entity");
const sd_notification_channel_entity_1 = require("./sd-notification-channel.entity");
const sd_notification_type_entity_1 = require("./sd-notification-type.entity");
let GroupNotificationConfig = class GroupNotificationConfig {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'group_id' }),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_group_entity_1.DeviceGroup, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", device_group_entity_1.DeviceGroup)
], GroupNotificationConfig.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_channel_id' }),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "notificationChannelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_channel_entity_1.NotificationChannel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_channel_id' }),
    __metadata("design:type", sd_notification_channel_entity_1.NotificationChannel)
], GroupNotificationConfig.prototype, "notificationChannel", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_type_id' }),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "notificationTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_type_entity_1.NotificationType, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_type_id' }),
    __metadata("design:type", sd_notification_type_entity_1.NotificationType)
], GroupNotificationConfig.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], GroupNotificationConfig.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], GroupNotificationConfig.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'escalation_level', default: 1 }),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "escalationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'escalation_delay_minutes', default: 30 }),
    __metadata("design:type", Number)
], GroupNotificationConfig.prototype, "escalationDelayMinutes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GroupNotificationConfig.prototype, "createdAt", void 0);
GroupNotificationConfig = __decorate([
    (0, typeorm_1.Entity)('sd_group_notification_config'),
    (0, typeorm_1.Unique)('unique_group_channel_type', ['groupId', 'notificationChannelId', 'notificationTypeId'])
], GroupNotificationConfig);
exports.GroupNotificationConfig = GroupNotificationConfig;
//# sourceMappingURL=sd-group-notification-config.entity.js.map