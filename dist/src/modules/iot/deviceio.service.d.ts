import { Repository } from 'typeorm';
import { DeviceStatus } from '@src/modules/iot/entities/device-status.entity';
import { DeviceConfig } from '@src/modules/iot/entities/device-config.entity';
export declare class DeviceioService {
    private readonly deviceStatusRepository;
    private readonly deviceConfigRepository;
    private readonly logger;
    constructor(deviceStatusRepository: Repository<DeviceStatus>, deviceConfigRepository: Repository<DeviceConfig>);
    getDeviceStatus(deviceId: string): Promise<any>;
    updateDeviceStatus(deviceId: string, data: any): Promise<void>;
    getDeviceConfig(deviceId: string): Promise<DeviceConfig>;
    private calculateUptime;
    private getDefaultConfig;
}
