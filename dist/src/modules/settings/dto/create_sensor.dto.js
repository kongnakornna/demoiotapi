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
exports.CreateSensorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSensorDto {
    constructor() {
        this.max = '100';
        this.min = '10';
        this.status_high = '10';
        this.status_warning = '30';
        this.status_alert = '60';
        this.status = 1;
        this.mqtt_id = 1;
        this.action_id = 1;
        this.status_alert_id = 1;
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "setting_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "setting_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'sensor_name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "sensor_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'sn',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "sn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'max',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'min',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "min", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "hardware_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status_high',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "status_high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status_warning',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "status_warning", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status_alert',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "status_alert", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'model',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'vendor',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'comparevalue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "comparevalue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'unit',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'mqtt_id',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "mqtt_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'oid',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'action_id',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "action_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'status_alert_id',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSensorDto.prototype, "status_alert_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'mqtt_data_value',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "mqtt_data_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'mqtt_data_control',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDto.prototype, "mqtt_data_control", void 0);
exports.CreateSensorDto = CreateSensorDto;
//# sourceMappingURL=create_sensor.dto.js.map