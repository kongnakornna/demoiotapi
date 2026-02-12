import { Device } from '@src/modules/settings/entities/device.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class NotificationCondition {
    id: number;
    DeviceId: number;
    Device: Device;
    notificationTypeId: number;
    notificationType: NotificationType;
    minValue: number;
    maxValue: number;
    conditionOperator: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
}
