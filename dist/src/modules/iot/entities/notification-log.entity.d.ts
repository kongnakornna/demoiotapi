import { Device } from '@src/modules/settings/entities/device.entity';
import { NotificationType } from './sd-notification-type.entity';
import { NotificationChannel } from './sd-notification-channel.entity';
export declare class NotificationLog {
    id: number;
    DeviceId: number;
    Device: Device;
    notificationTypeId: number;
    notificationType: NotificationType;
    notificationChannelId: number;
    channel: NotificationChannel;
    templateId: number;
    message: string;
    status: string;
    responseData: any;
    sentAt: Date;
    deliveredAt: Date;
    read_at: Date;
    retryCount: number;
    errorMessage: string;
    messageId: string;
    recipient: string;
    createdAt: Date;
}
