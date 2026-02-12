import { Device } from '@src/modules/settings/entities/device.entity';
import { NotificationChannel } from './sd-notification-channel.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class DeviceNotificationConfig {
    id: number;
    DeviceId: number;
    Device: Device;
    notificationChannelId: number;
    channel: NotificationChannel;
    notificationTypeId: number;
    notificationType: NotificationType;
    config: any;
    isActive: boolean;
    retryCount: number;
    retryDelayMinutes: number;
    createdAt: Date;
}
