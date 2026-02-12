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
exports.Sensor = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Sensor = class Sensor {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Sensor.prototype, "sensor_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "setting_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "setting_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "sensor_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "sn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "max", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "min", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "hardware_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "status_high", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "status_warning", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Sensor.prototype, "status_alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "comparevalue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'created at' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sensor.prototype, "createddate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'updated at' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sensor.prototype, "updateddate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "mqtt_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "oid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "action_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Sensor.prototype, "status_alert_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "mqtt_data_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Sensor.prototype, "mqtt_data_control", void 0);
Sensor = __decorate([
    (0, typeorm_1.Entity)('sd_iot_sensor', { schema: 'public' })
], Sensor);
exports.Sensor = Sensor;
//# sourceMappingURL=sensor.entity.js.map