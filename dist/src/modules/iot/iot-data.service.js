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
var IotDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_status_entity_1 = require("./entities/device-status.entity");
const iot_data_entity_1 = require("./entities/iot-data.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
let IotDataService = IotDataService_1 = class IotDataService {
    constructor(iotDataRepository, deviceStatusRepository, activityLogRepository) {
        this.iotDataRepository = iotDataRepository;
        this.deviceStatusRepository = deviceStatusRepository;
        this.activityLogRepository = activityLogRepository;
        this.logger = new common_1.Logger(IotDataService_1.name);
    }
    async processMqttData(deviceId, rawData) {
        try {
            this.logger.log(`กำลังประมวลผลข้อมูลจาก ${deviceId}: ${rawData}`);
            const iotData = iot_data_entity_1.IotData.createFromRawData(deviceId, rawData);
            const validation = iotData.validate();
            if (!validation.valid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
            const savedData = await this.iotDataRepository.save(iotData);
            await this.updateDeviceStatus(deviceId, iotData.data);
            await this.logActivity('DATA_RECEIVED', `ได้รับข้อมูลจาก ${deviceId}`, deviceId);
            this.logger.log(`บันทึกข้อมูลสำเร็จสำหรับ ${deviceId}, ID: ${savedData.id}`);
            return savedData;
        }
        catch (error) {
            this.logger.error(`เกิดข้อผิดพลาดในการประมวลผลข้อมูล: ${error.message}`);
            await this.logActivity('ERROR', `ข้อผิดพลาดในการประมวลผลข้อมูลจาก ${deviceId}: ${error.message}`, deviceId, { rawData, error: error.message });
            throw error;
        }
    }
    async updateDeviceStatus(deviceId, data) {
        try {
            let deviceStatus = await this.deviceStatusRepository.findOne({
                where: { deviceId },
            });
            if (!deviceStatus) {
                deviceStatus = new device_status_entity_1.DeviceStatus();
                deviceStatus.deviceId = deviceId;
                deviceStatus.isOnline = true;
                deviceStatus.isActive = true;
                deviceStatus.firstSeen = new Date();
                deviceStatus.connectionCount = 0;
            }
            deviceStatus.updateFromData(data);
            if (data.temperature !== undefined) {
                deviceStatus.temperature = data.temperature;
            }
            await this.deviceStatusRepository.save(deviceStatus);
        }
        catch (error) {
            this.logger.error(`อัปเดตสถานะอุปกรณ์ล้มเหลว: ${error.message}`);
        }
    }
    async logActivity(type, details, deviceId, data) {
        try {
            const activityLog = activity_log_entity_1.ActivityLog.createInfo(type, details, deviceId, data);
            await this.activityLogRepository.save(activityLog);
        }
        catch (error) {
            this.logger.error(`บันทึก activity log ล้มเหลว: ${error.message}`);
        }
    }
    async getLatestData(deviceId, limit = 10) {
        return this.iotDataRepository.find({
            where: { deviceId },
            order: { timestamp: 'DESC' },
            take: limit,
        });
    }
    async getDataByDateRange(deviceId, startDate, endDate) {
        return this.iotDataRepository.find({
            where: {
                deviceId,
                timestamp: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { timestamp: 'ASC' },
        });
    }
    async cleanupOldData(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const result = await this.iotDataRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
};
IotDataService = IotDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(iot_data_entity_1.IotData)),
    __param(1, (0, typeorm_1.InjectRepository)(device_status_entity_1.DeviceStatus)),
    __param(2, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IotDataService);
exports.IotDataService = IotDataService;
//# sourceMappingURL=iot-data.service.js.map