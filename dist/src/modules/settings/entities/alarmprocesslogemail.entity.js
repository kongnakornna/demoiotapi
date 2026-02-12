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
exports.alarmprocesslogemail = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let alarmprocesslogemail = class alarmprocesslogemail {
    constructor() {
        this.email_alarm = 0;
        this.line_alarm = 0;
        this.telegram_alarm = 0;
        this.sms_alarm = 0;
        this.nonc_alarm = 0;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "alarm_action_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "alarm_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "status_warning", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "recovery_warning", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "status_alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "recovery_alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "email_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "line_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "telegram_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "sms_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], alarmprocesslogemail.prototype, "nonc_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "data_alarm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "alarm_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], alarmprocesslogemail.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'created at' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], alarmprocesslogemail.prototype, "createddate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'updated at' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], alarmprocesslogemail.prototype, "updateddate", void 0);
alarmprocesslogemail = __decorate([
    (0, typeorm_1.Entity)('sd_alarm_process_log_email', { schema: 'public' })
], alarmprocesslogemail);
exports.alarmprocesslogemail = alarmprocesslogemail;
//# sourceMappingURL=alarmprocesslogemail.entity.js.map