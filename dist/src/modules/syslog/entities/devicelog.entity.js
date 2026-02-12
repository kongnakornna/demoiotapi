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
exports.DeviceLog = void 0;
const typeorm_1 = require("typeorm");
let DeviceLog = class DeviceLog {
    constructor() {
        this.lang = 'en';
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DeviceLog.prototype, "type_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DeviceLog.prototype, "sensor_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], DeviceLog.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], DeviceLog.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], DeviceLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], DeviceLog.prototype, "lang", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'create',
        type: 'timestamp',
        precision: 6,
        nullable: false
    }),
    __metadata("design:type", Date)
], DeviceLog.prototype, "create", void 0);
DeviceLog = __decorate([
    (0, typeorm_1.Entity)('sd_device_log', { schema: 'public' })
], DeviceLog);
exports.DeviceLog = DeviceLog;
//# sourceMappingURL=devicelog.entity.js.map