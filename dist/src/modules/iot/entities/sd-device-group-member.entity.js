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
exports.DeviceGroupMember = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../settings/entities/device.entity");
const device_group_entity_1 = require("./device-group.entity");
let DeviceGroupMember = class DeviceGroupMember {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceGroupMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'Device_id' }),
    __metadata("design:type", Number)
], DeviceGroupMember.prototype, "DeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'Device_id' }),
    __metadata("design:type", device_entity_1.Device)
], DeviceGroupMember.prototype, "Device", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'group_id' }),
    __metadata("design:type", Number)
], DeviceGroupMember.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_group_entity_1.DeviceGroup, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", device_group_entity_1.DeviceGroup)
], DeviceGroupMember.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'member' }),
    __metadata("design:type", String)
], DeviceGroupMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], DeviceGroupMember.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], DeviceGroupMember.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeviceGroupMember.prototype, "createdAt", void 0);
DeviceGroupMember = __decorate([
    (0, typeorm_1.Entity)('sd_device__member'),
    (0, typeorm_1.Unique)('unique_Device_group', ['DeviceId', 'groupId'])
], DeviceGroupMember);
exports.DeviceGroupMember = DeviceGroupMember;
//# sourceMappingURL=sd-device-group-member.entity.js.map