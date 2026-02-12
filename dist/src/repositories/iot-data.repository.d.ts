import { Repository } from 'typeorm';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';
export declare class IotDataRepository extends Repository<IotData> {
    findLatestByDevice(deviceId: string): Promise<IotData>;
    findByDateRange(deviceId: string, startDate: Date, endDate: Date): Promise<IotData[]>;
    getDeviceStatistics(deviceId: string): Promise<any>;
    deleteOldData(olderThanDays: number): Promise<number>;
    bulkInsert(dataArray: Partial<IotData>[]): Promise<void>;
    searchData(deviceId?: string, startDate?: Date, endDate?: Date, dataType?: string, minQuality?: number, limit?: number): Promise<IotData[]>;
}
