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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deviceervice = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("../settings/entities/device.entity");
const iot_data_entity_1 = require("./entities/iot-data.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const command_log_entity_1 = require("./entities/command-log.entity");
const device_alert_entity_1 = require("./entities/device-alert.entity");
const device_config_entity_1 = require("./entities/device-config.entity");
const device_status_entity_1 = require("./entities/device-status.entity");
let Deviceervice = class Deviceervice {
    constructor(deviceRepository, iotDataRepository, ActivityLogRepository, CommandLogRepository, DeviceAlertRepository, DeviceConfigRepository, DeviceStatusRepository) {
        this.deviceRepository = deviceRepository;
        this.iotDataRepository = iotDataRepository;
        this.ActivityLogRepository = ActivityLogRepository;
        this.CommandLogRepository = CommandLogRepository;
        this.DeviceAlertRepository = DeviceAlertRepository;
        this.DeviceConfigRepository = DeviceConfigRepository;
        this.DeviceStatusRepository = DeviceStatusRepository;
    }
    async create(data) {
        const device = this.deviceRepository.create(data);
        return await this.deviceRepository.save(device);
    }
};
Deviceervice = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(1, (0, typeorm_1.InjectRepository)(iot_data_entity_1.IotData)),
    __param(2, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __param(3, (0, typeorm_1.InjectRepository)(command_log_entity_1.CommandLog)),
    __param(4, (0, typeorm_1.InjectRepository)(device_alert_entity_1.DeviceAlert)),
    __param(5, (0, typeorm_1.InjectRepository)(device_config_entity_1.DeviceConfig)),
    __param(6, (0, typeorm_1.InjectRepository)(device_status_entity_1.DeviceStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], Deviceervice);
exports.Deviceervice = Deviceervice;
//# sourceMappingURL=device.service.js.map