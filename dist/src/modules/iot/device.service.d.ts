import { Repository } from 'typeorm';
import { Device } from '@src/modules/settings/entities/device.entity';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';
import { ActivityLog } from '@src/modules/iot/entities/activity-log.entity';
import { CommandLog } from '@src/modules/iot/entities/command-log.entity';
import { DeviceAlert } from '@src/modules/iot/entities/device-alert.entity';
import { DeviceConfig } from '@src/modules/iot/entities/device-config.entity';
import { DeviceStatus } from '@src/modules/iot/entities/device-status.entity';
export declare class Deviceervice {
    private readonly deviceRepository;
    private readonly iotDataRepository;
    private readonly ActivityLogRepository;
    private readonly CommandLogRepository;
    private readonly DeviceAlertRepository;
    private readonly DeviceConfigRepository;
    private readonly DeviceStatusRepository;
    constructor(deviceRepository: Repository<Device>, iotDataRepository: Repository<IotData>, ActivityLogRepository: Repository<ActivityLog>, CommandLogRepository: Repository<CommandLog>, DeviceAlertRepository: Repository<DeviceAlert>, DeviceConfigRepository: Repository<DeviceConfig>, DeviceStatusRepository: Repository<DeviceStatus>);
    create(data: Partial<Device>): Promise<Device>;
}
