import { Device } from '@src/modules/settings/entities/device.entity';
export declare class DeviceSchedule {
    id: number;
    DeviceId: number;
    Device: Device;
    name: string;
    description: string;
    scheduleType: string;
    scheduleConfig: any;
    action: any;
    isActive: boolean;
    lastRunAt: Date;
    nextRunAt: Date;
    runCount: number;
    createdAt: Date;
    updatedAt: Date;
}
