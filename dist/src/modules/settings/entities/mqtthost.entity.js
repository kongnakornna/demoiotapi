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
exports.mqtthost = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let mqtthost = class mqtthost {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], mqtthost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], mqtthost.prototype, "hostname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], mqtthost.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], mqtthost.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], mqtthost.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], mqtthost.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'created at' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], mqtthost.prototype, "createddate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'updated at' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], mqtthost.prototype, "updateddate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], mqtthost.prototype, "status", void 0);
mqtthost = __decorate([
    (0, typeorm_1.Entity)('sd_mqtt_host', { schema: 'public' })
], mqtthost);
exports.mqtthost = mqtthost;
//# sourceMappingURL=mqtthost.entity.js.map