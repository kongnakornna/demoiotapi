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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let User = class User {
    constructor() {
        this.public_notification = 0;
        this.sms_notification = 0;
        this.email_notification = 0;
        this.line_notification = 0;
    }
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'uuid' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createddate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updateddate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delete Date' }),
    (0, typeorm_1.DeleteDateColumn)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deletedate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password_temp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "idcard", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "lastsignindate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "active_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "network_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "infomation_agree_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "online_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "network_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "public_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarpath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refresh_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "loginfailed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "public_notification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "sms_notification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "email_notification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int2', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "line_notification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "mobile_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lineid", void 0);
User = __decorate([
    (0, typeorm_1.Entity)('sd_user', { schema: 'public' })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map