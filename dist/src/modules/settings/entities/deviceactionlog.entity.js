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
exports.Deviceactionlog = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Deviceactionlog = class Deviceactionlog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Deviceactionlog.prototype, "log_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Deviceactionlog.prototype, "alarm_action_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Deviceactionlog.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Deviceactionlog.prototype, "uid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Deviceactionlog.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'created at' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Deviceactionlog.prototype, "createddate", void 0);
Deviceactionlog = __decorate([
    (0, typeorm_1.Entity)('sd_iot_device_action_log', { schema: 'public' })
], Deviceactionlog);
exports.Deviceactionlog = Deviceactionlog;
//# sourceMappingURL=deviceactionlog.entity.js.map