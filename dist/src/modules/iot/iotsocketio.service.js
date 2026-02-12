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
exports.IotioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const iot_data_entity_1 = require("./entities/iot-data.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const command_log_entity_1 = require("./entities/command-log.entity");
const device_alert_entity_1 = require("./entities/device-alert.entity");
const device_config_entity_1 = require("./entities/device-config.entity");
const device_status_entity_1 = require("./entities/device-status.entity");
let IotioService = class IotioService {
    constructor(iotDataRepository, ActivityLogRepository, CommandLogRepository, DeviceAlertRepository, DeviceConfigRepository, DeviceStatusRepository) {
        this.iotDataRepository = iotDataRepository;
        this.ActivityLogRepository = ActivityLogRepository;
        this.CommandLogRepository = CommandLogRepository;
        this.DeviceAlertRepository = DeviceAlertRepository;
        this.DeviceConfigRepository = DeviceConfigRepository;
        this.DeviceStatusRepository = DeviceStatusRepository;
    }
    async getDataByDeviceId(deviceId, limit) {
        const query = this.iotDataRepository
            .createQueryBuilder('data')
            .where('data.deviceId = :deviceId', { deviceId })
            .orderBy('data.createdAt', 'DESC');
        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }
    async getLatestData(deviceId) {
        return this.iotDataRepository.findOne({
            where: { deviceId },
            order: { createdAt: 'DESC' },
        });
    }
    async checkDatabaseConnection() {
        try {
            await this.iotDataRepository.query('SELECT 1');
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async saveDeviceStatus(deviceId, data) {
        return Object.assign(Object.assign({ deviceId }, data), { timestamp: new Date() });
    }
    async findAll(options) {
        const { page = 1, limit = 50, deviceId, startDate, endDate, dataType, sortBy, sortOrder, } = options;
        const query = this.iotDataRepository.createQueryBuilder('data');
        if (deviceId) {
            query.where('data.deviceId = :deviceId', { deviceId });
        }
        if (startDate) {
            query.andWhere('data.createdAt >= :startDate', {
                startDate: new Date(startDate),
            });
        }
        if (endDate) {
            query.andWhere('data.createdAt <= :endDate', {
                endDate: new Date(endDate),
            });
        }
        if (dataType) {
            query.andWhere('data.dataType = :dataType', { dataType });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(`data.${sortBy || 'createdAt'}`, sortOrder || 'DESC')
            .getManyAndCount();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async searchData(options) {
        const { query, deviceId, field, page = 1, limit = 50 } = options;
        const qb = this.iotDataRepository.createQueryBuilder('data');
        if (deviceId) {
            qb.where('data.deviceId = :deviceId', { deviceId });
        }
        if (query && field) {
            qb.andWhere(`data.${field} LIKE :query`, { query: `%${query}%` });
        }
        const [results, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('data.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data: results,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findByDeviceId(deviceId, limit = 100, order = 'DESC', startDate, endDate) {
        const query = this.iotDataRepository
            .createQueryBuilder('data')
            .where('data.deviceId = :deviceId', { deviceId })
            .orderBy('data.createdAt', order);
        if (startDate) {
            query.andWhere('data.createdAt >= :startDate', {
                startDate: new Date(startDate),
            });
        }
        if (endDate) {
            query.andWhere('data.createdAt <= :endDate', {
                endDate: new Date(endDate),
            });
        }
        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }
    async findLatestByDeviceId(deviceId) {
        return this.getLatestData(deviceId);
    }
    async getDeviceStats(deviceId) {
        var _a, _b;
        const data = await this.findByDeviceId(deviceId, 1000);
        if (data.length === 0) {
            return {
                count: 0,
                firstRecord: null,
                lastRecord: null,
                averageData: {},
            };
        }
        const stats = {
            count: data.length,
            firstRecord: (_a = data[data.length - 1]) === null || _a === void 0 ? void 0 : _a.createdAt,
            lastRecord: (_b = data[0]) === null || _b === void 0 ? void 0 : _b.createdAt,
            dataPoints: {},
        };
        return stats;
    }
    async getDeviceStatus(deviceId) {
        const latestData = await this.getLatestData(deviceId);
        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        return {
            deviceId,
            isOnline: latestData ? latestData.createdAt > fifteenMinutesAgo : false,
            isActive: true,
            lastSeen: (latestData === null || latestData === void 0 ? void 0 : latestData.createdAt) || null,
            firmwareVersion: '1.0.0',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    async findById(id, includeRelated) {
        return this.iotDataRepository.findOne({ where: { id } });
    }
    async saveIotData(dto) {
        const iotData = this.iotDataRepository.create({
            deviceId: dto.deviceId,
            data: dto.data || {},
            createdAt: dto.timestamp ? new Date(dto.timestamp) : new Date(),
        });
        return this.iotDataRepository.save(iotData);
    }
    async update(id, dto) {
        var updatedAt = new Date();
        await this.iotDataRepository.update(id, {
            data: dto.data,
        });
        return this.findById(id);
    }
    async delete(id) {
        await this.iotDataRepository.delete(id);
    }
    async getAllDevices(activeOnly, deviceType) {
        const query = this.iotDataRepository
            .createQueryBuilder('data')
            .select('DISTINCT data.deviceId', 'deviceId')
            .addSelect('MAX(data.createdAt)', 'lastSeen')
            .groupBy('data.deviceId')
            .orderBy('lastSeen', 'DESC');
        const results = await query.getRawMany();
        return results.map((row) => ({
            deviceId: row.deviceId,
            lastSeen: row.lastSeen,
            isOnline: new Date().getTime() - new Date(row.lastSeen).getTime() <
                15 * 60 * 1000,
        }));
    }
    async getDeviceConfig(deviceId) {
        return {
            deviceId,
            config: {
                general: {
                    deviceName: deviceId,
                    timezone: 'Asia/Bangkok',
                },
                reporting: {
                    enabled: true,
                    interval: 300,
                },
            },
        };
    }
    async updateDeviceConfig(deviceId, config) {
        return Object.assign(Object.assign({ deviceId }, config), { updatedAt: new Date() });
    }
    async logActivity(data) {
        console.log('Activity logged:', data);
        return Object.assign(Object.assign({ id: Date.now() }, data), { timestamp: new Date() });
    }
    async saveBatchData(data) {
        const results = [];
        for (const item of data) {
            try {
                const saved = await this.saveIotData(item);
                results.push(saved);
            }
            catch (error) {
                console.error('Error saving batch item:', error);
                results.push({ error: error.message, item });
            }
        }
        return results;
    }
    async logCommand(data) {
        return Object.assign(Object.assign({ id: Date.now() }, data), { timestamp: new Date(), status: 'pending' });
    }
    async updateCommandStatus(id, status) {
        console.log(`Command ${id} status updated to: ${status}`);
    }
    async getDeviceCommands(deviceId, page, limit, status) {
        return [
            {
                id: 1,
                deviceId,
                action: 'restart',
                status: 'completed',
                timestamp: new Date(),
            },
        ];
    }
    async exportToCsv(exportDto) {
        const { deviceId, startDate, endDate } = exportDto;
        const data = await this.findByDeviceId(deviceId, 10000, 'ASC', startDate, endDate);
        let csv = 'timestamp,deviceId,data\n';
        data.forEach((item) => {
            csv += `${item.createdAt.toISOString()},${item.deviceId},"${JSON.stringify(item.data)}"\n`;
        });
        return csv;
    }
    async exportToJson(exportDto) {
        const { deviceId, startDate, endDate } = exportDto;
        const data = await this.findByDeviceId(deviceId, 10000, 'ASC', startDate, endDate);
        return {
            deviceId,
            exportDate: new Date().toISOString(),
            count: data.length,
            data,
        };
    }
    async importFromFile(file, deviceId, format) {
        console.log(`Importing ${format} file for device ${deviceId}`);
        return { imported: 0, failed: 0, details: [] };
    }
    async getStatistics(deviceId, period = 'day', metric) {
        return {
            deviceId: deviceId || 'all',
            period,
            count: 0,
            average: 0,
            min: 0,
            max: 0,
        };
    }
    async getDailySummary(deviceId, date, detailed) {
        return {
            deviceId,
            date,
            dataPoints: 0,
            averageValues: {},
        };
    }
    async getChartData(deviceId, metric, startDate, endDate, interval) {
        return [];
    }
    async cleanupOldData(days, deviceId) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const query = this.iotDataRepository
            .createQueryBuilder('data')
            .delete()
            .where('data.createdAt < :cutoffDate', { cutoffDate });
        if (deviceId) {
            query.andWhere('data.deviceId = :deviceId', { deviceId });
        }
        const result = await query.execute();
        return { deleted: result.affected || 0 };
    }
    async getSystemLogs(type, page, limit) {
        return [
            {
                id: 1,
                type,
                timestamp: new Date(),
                message: 'System log entry',
            },
        ];
    }
    async updateDeviceLastSeen(deviceId) {
        console.log(`Device ${deviceId} last seen updated`);
    }
    async getLast24hStats(deviceId) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const data = await this.iotDataRepository
            .createQueryBuilder('data')
            .where('data.deviceId = :deviceId', { deviceId })
            .andWhere('data.createdAt >= :startDate', {
            startDate: twentyFourHoursAgo,
        })
            .orderBy('data.createdAt', 'DESC')
            .getMany();
        return {
            count: data.length,
            period: '24h',
            deviceId,
        };
    }
};
IotioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(iot_data_entity_1.IotData)),
    __param(1, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __param(2, (0, typeorm_1.InjectRepository)(command_log_entity_1.CommandLog)),
    __param(3, (0, typeorm_1.InjectRepository)(device_alert_entity_1.DeviceAlert)),
    __param(4, (0, typeorm_1.InjectRepository)(device_config_entity_1.DeviceConfig)),
    __param(5, (0, typeorm_1.InjectRepository)(device_status_entity_1.DeviceStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IotioService);
exports.IotioService = IotioService;
//# sourceMappingURL=iotsocketio.service.js.map