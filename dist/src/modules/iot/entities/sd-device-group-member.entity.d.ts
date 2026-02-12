import { Device } from '@src/modules/settings/entities/device.entity';
import { DeviceGroup } from './device-group.entity';
export declare class DeviceGroupMember {
    id: number;
    DeviceId: number;
    Device: Device;
    groupId: number;
    group: DeviceGroup;
    role: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
}
