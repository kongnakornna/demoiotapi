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
exports.Mqtt = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Mqtt = class Mqtt {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Mqtt.prototype, "mqtt_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Mqtt.prototype, "mqtt_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Mqtt.prototype, "sort", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "mqtt_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Mqtt.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "expire_in", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "token_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "org", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "bucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "envavorment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Mqtt.prototype, "createddate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Mqtt.prototype, "updateddate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Mqtt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1, nullable: true }),
    __metadata("design:type", Number)
], Mqtt.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Mqtt.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MQTT Main ID', default: 1 }),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Mqtt.prototype, "mqtt_main_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'configuration',
        type: 'text',
        nullable: true,
        default: {
            '0': 'temperature1',
            '1': 'humidity1',
            '2': 'temperature2',
            '3': 'humidity2',
            '4': 'temperature3',
            '5': 'input1',
            '6': 'AIR1',
            '7': 'AIR2',
            '8': 'UPS1',
            '9': 'UPS2',
            '10': 'Fire',
            '11': 'waterleak',
            '12': 'HSSD',
            '13': 'Temp',
            '14': 'Volt',
            '15': 'Amp',
        },
    }),
    __metadata("design:type", String)
], Mqtt.prototype, "configuration", void 0);
Mqtt = __decorate([
    (0, typeorm_1.Entity)('sd_iot_mqtt', { schema: 'public' })
], Mqtt);
exports.Mqtt = Mqtt;
//# sourceMappingURL=mqtt.entity.js.map