import { Device } from '@src/modules/settings/entities/device.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class DeviceStatusHistory {
    id: number;
    DeviceId: number;
    Device: Device;
    status: string;
    value: number;
    notificationTypeId: number;
    notificationType: NotificationType;
    durationMinutes: number;
    previousStatus: string;
    previousValue: number;
    changeReason: string;
    createdAt: Date;
}
