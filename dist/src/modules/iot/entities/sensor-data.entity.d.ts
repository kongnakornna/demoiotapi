import { Device } from '@src/modules/settings/entities/device.entity';
import { NotificationType } from './sd-notification-type.entity';
export declare class SensorData {
    id: number;
    DeviceId: number;
    Device: Device;
    value: number;
    rawData: any;
    notificationTypeId: number;
    notificationType: NotificationType;
    batteryLevel: number;
    signalStrength: number;
    timestamp: Date;
    createdAt: Date;
}
