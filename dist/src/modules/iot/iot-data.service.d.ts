import { Repository } from 'typeorm';
import { DeviceStatus } from '@src/modules/iot/entities/device-status.entity';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';
import { ActivityLog } from '@src/modules/iot/entities/activity-log.entity';
export declare class IotDataService {
    private readonly iotDataRepository;
    private readonly deviceStatusRepository;
    private readonly activityLogRepository;
    private readonly logger;
    constructor(iotDataRepository: Repository<IotData>, deviceStatusRepository: Repository<DeviceStatus>, activityLogRepository: Repository<ActivityLog>);
    processMqttData(deviceId: string, rawData: string): Promise<IotData>;
    private updateDeviceStatus;
    private logActivity;
    getLatestData(deviceId: string, limit?: number): Promise<IotData[]>;
    getDataByDateRange(deviceId: string, startDate: Date, endDate: Date): Promise<IotData[]>;
    cleanupOldData(days?: number): Promise<number>;
}
