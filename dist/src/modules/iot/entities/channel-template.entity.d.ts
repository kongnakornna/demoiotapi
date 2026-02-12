import { NotificationChannel } from './sd-notification-channel.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class ChannelTemplate {
    id: number;
    name: string;
    description: string;
    channelId: number;
    channel: NotificationChannel;
    notificationTypeId: number;
    notificationType: NotificationType;
    template: string;
    variables: any;
    isActive: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
