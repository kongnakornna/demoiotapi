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
exports.ChannelTemplate = void 0;
const typeorm_1 = require("typeorm");
const sd_notification_channel_entity_1 = require("./sd-notification-channel.entity");
const sd_notification_type_entity_1 = require("./sd-notification-type.entity");
let ChannelTemplate = class ChannelTemplate {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], ChannelTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ChannelTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'channel_id' }),
    __metadata("design:type", Number)
], ChannelTemplate.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_channel_entity_1.NotificationChannel, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'channel_id' }),
    __metadata("design:type", sd_notification_channel_entity_1.NotificationChannel)
], ChannelTemplate.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'notification_type_id' }),
    __metadata("design:type", Number)
], ChannelTemplate.prototype, "notificationTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sd_notification_type_entity_1.NotificationType, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_type_id' }),
    __metadata("design:type", sd_notification_type_entity_1.NotificationType)
], ChannelTemplate.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChannelTemplate.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChannelTemplate.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ChannelTemplate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], ChannelTemplate.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ChannelTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ChannelTemplate.prototype, "updatedAt", void 0);
ChannelTemplate = __decorate([
    (0, typeorm_1.Entity)('sd_channel_template')
], ChannelTemplate);
exports.ChannelTemplate = ChannelTemplate;
//# sourceMappingURL=channel-template.entity.js.map