import { DeviceGroup } from './device-group.entity';
import { NotificationChannel } from './sd-notification-channel.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class GroupNotificationConfig {
    id: number;
    groupId: number;
    group: DeviceGroup;
    notificationChannelId: number;
    notificationChannel: NotificationChannel;
    notificationTypeId: number;
    notificationType: NotificationType;
    config: any;
    isActive: boolean;
    escalationLevel: number;
    escalationDelayMinutes: number;
    createdAt: Date;
}
