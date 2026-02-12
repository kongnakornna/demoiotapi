// src/repositories/iot-data.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';

@EntityRepository(IotData)
export class IotDataRepository extends Repository<IotData> {
  // Custom repository methods

  async findLatestByDevice(deviceId: string): Promise<IotData> {
    return this.createQueryBuilder('data')
      .where('data.deviceId = :deviceId', { deviceId })
      .orderBy('data.timestamp', 'DESC')
      .getOne();
  }

  async findByDateRange(
    deviceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IotData[]> {
    return this.createQueryBuilder('data')
      .where('data.deviceId = :deviceId', { deviceId })
      .andWhere('data.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('data.timestamp', 'ASC')
      .getMany();
  }

  async getDeviceStatistics(deviceId: string): Promise<any> {
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

  async deleteOldData(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  async bulkInsert(dataArray: Partial<IotData>[]): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(IotData)
      .values(dataArray)
      .execute();
  }

  async searchData(
    deviceId?: string,
    startDate?: Date,
    endDate?: Date,
    dataType?: string,
    minQuality?: number,
    limit: number = 1000,
  ): Promise<IotData[]> {
    const query = this.createQueryBuilder('data');
    query.andWhere('1=1');
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
}
