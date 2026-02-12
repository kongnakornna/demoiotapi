"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotDataRepository = void 0;
const typeorm_1 = require("typeorm");
const iot_data_entity_1 = require("../entities/iot-data.entity");
let IotDataRepository = class IotDataRepository extends typeorm_1.Repository {
    async findLatestByDevice(deviceId) {
        return this.createQueryBuilder('data')
            .where('data.deviceId = :deviceId', { deviceId })
            .orderBy('data.timestamp', 'DESC')
            .getOne();
    }
    async findByDateRange(deviceId, startDate, endDate) {
        return this.createQueryBuilder('data')
            .where('data.deviceId = :deviceId', { deviceId })
            .andWhere('data.timestamp BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('data.timestamp', 'ASC')
            .getMany();
    }
    async getDeviceStatistics(deviceId) {
        return this.createQueryBuilder('data')
            .select([
            'COUNT(*) as total_count',
            'MIN(data.timestamp) as first_record',
            'MAX(data.timestamp) as last_record',
            'AVG(data.dataQuality) as avg_quality',
            'SUM(CASE WHEN data.hasErrors THEN 1 ELSE 0 END) as error_count',
        ])
            .where('data.deviceId = :deviceId', { deviceId })
            .getRawOne();
    }
    async deleteOldData(olderThanDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        const result = await this.createQueryBuilder()
            .delete()
            .where('timestamp < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
    async bulkInsert(dataArray) {
        await this.createQueryBuilder()
            .insert()
            .into(iot_data_entity_1.IotData)
            .values(dataArray)
            .execute();
    }
    async searchData(deviceId, startDate, endDate, dataType, minQuality, limit = 1000) {
        const query = this.createQueryBuilder('data');
        if (deviceId) {
            query.andWhere('data.deviceId = :deviceId', { deviceId });
        }
        if (startDate && endDate) {
            query.andWhere('data.timestamp BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        if (dataType) {
            query.andWhere('data.dataType = :dataType', { dataType });
        }
        if (minQuality) {
            query.andWhere('data.dataQuality >= :minQuality', { minQuality });
        }
        query.orderBy('data.timestamp', 'DESC').limit(limit);
        return query.getMany();
    }
};
IotDataRepository = __decorate([
    (0, typeorm_1.EntityRepository)(iot_data_entity_1.IotData)
], IotDataRepository);
exports.IotDataRepository = IotDataRepository;
//# sourceMappingURL=iot-data.repository.js.map