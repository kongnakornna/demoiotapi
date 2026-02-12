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
var DeviceioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_status_entity_1 = require("./entities/device-status.entity");
const device_config_entity_1 = require("./entities/device-config.entity");
let DeviceioService = DeviceioService_1 = class DeviceioService {
    constructor(deviceStatusRepository, deviceConfigRepository) {
        this.deviceStatusRepository = deviceStatusRepository;
        this.deviceConfigRepository = deviceConfigRepository;
        this.logger = new common_1.Logger(DeviceioService_1.name);
    }
    async getDeviceStatus(deviceId) {
        try {
            let status = await this.deviceStatusRepository.findOne({
                where: { deviceId },
            });
            if (!status) {
                status = this.deviceStatusRepository.create({
                    deviceId,
                    isOnline: false,
                    isActive: true,
                    lastSeen: new Date(),
                    lastData: {},
                    firmwareVersion: '1.0.0',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                status = await this.deviceStatusRepository.save(status);
            }
            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
            const isOnline = status.lastSeen > fifteenMinutesAgo;
            return {
                deviceId,
                isOnline,
                isActive: status.isActive,
                lastSeen: status.lastSeen,
                batteryLevel: status.batteryLevel,
                signalStrength: status.signalStrength,
                firmwareVersion: status.firmwareVersion,
                location: status.location,
                lastData: status.lastData,
                uptime: this.calculateUptime(status),
            };
        }
        catch (error) {
            this.logger.error(`Get device status error: ${error.message}`);
            throw error;
        }
    }
    async updateDeviceStatus(deviceId, data) {
        try {
            let status = await this.deviceStatusRepository.findOne({
                where: { deviceId },
            });
            if (!status) {
                status = this.deviceStatusRepository.create({ deviceId });
            }
            status.lastSeen = new Date();
            status.lastData = data;
            status.isOnline = true;
            if (data.battery !== undefined) {
                status.batteryLevel = data.battery;
            }
            if (data.signal !== undefined) {
                status.signalStrength = data.signal;
            }
            if (data.firmware !== undefined) {
                status.firmwareVersion = data.firmware;
            }
            if (data.location !== undefined) {
                status.location = data.location;
            }
            status.updatedAt = new Date();
            await this.deviceStatusRepository.save(status);
        }
        catch (error) {
            this.logger.error(`Update device status error: ${error.message}`);
        }
    }
    async getDeviceConfig(deviceId) {
        try {
            let config = await this.deviceConfigRepository.findOne({
                where: { deviceId },
            });
            if (!config) {
                config = this.deviceConfigRepository.create({
                    deviceId,
                    config: this.getDefaultConfig(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                config = await this.deviceConfigRepository.save(config);
            }
            return config;
        }
        catch (error) {
            this.logger.error(`Get device config error: ${error.message}`);
            throw error;
        }
    }
    calculateUptime(status) {
        if (!status.firstSeen)
            return '0s';
        const now = new Date();
        const uptimeMs = now.getTime() - status.firstSeen.getTime();
        const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
        if (days > 0)
            return `${days}d ${hours}h`;
        if (hours > 0)
            return `${hours}h ${minutes}m`;
        if (minutes > 0)
            return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }
    getDefaultConfig() {
        return {
            general: {
                deviceName: '',
                timezone: 'Asia/Bangkok',
                location: {
                    lat: 0,
                    lng: 0,
                    address: '',
                },
            },
            reporting: {
                enabled: true,
                interval: 300,
                format: 'json',
            },
            thresholds: {
                temperature: { min: 15, max: 40 },
                humidity: { min: 30, max: 80 },
            },
            alerts: {
                enabled: true,
                email: [],
                sms: [],
            },
        };
    }
};
DeviceioService = DeviceioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_status_entity_1.DeviceStatus)),
    __param(1, (0, typeorm_1.InjectRepository)(device_config_entity_1.DeviceConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DeviceioService);
exports.DeviceioService = DeviceioService;
//# sourceMappingURL=deviceio.service.js.map