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
exports.CreateMqttDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMqttDto {
    constructor() {
        this.sort = 1;
        this.status = 0;
        this.mqtt_main_id = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'mqtt_type_id', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "mqtt_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'sort' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'mqtt_name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "mqtt_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'host' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "host", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'port', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'username', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'password', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'secret', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "secret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'expire_in', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "expire_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'token_value' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "token_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'org', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "org", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'bucket', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'envavorment', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "envavorment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'status' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'location_id', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'latitude', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'longitude', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'mqtt_main_id', default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMqttDto.prototype, "mqtt_main_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'configuration',
        default: "{'0': 'temperature1','1': 'humidity1','2': 'temperature2','3': 'humidity2','4': 'temperature3','5': 'input1','6': 'AIR1','7': 'AIR2','8': 'UPS1','9': 'UPS2','10': 'Fire','11': 'waterleak','12': 'HSSD', '13': 'Temp','14': 'Volt','15': 'Amp'}",
    }),
    __metadata("design:type", String)
], CreateMqttDto.prototype, "configuration", void 0);
exports.CreateMqttDto = CreateMqttDto;
//# sourceMappingURL=create_mqtt.dto.js.map