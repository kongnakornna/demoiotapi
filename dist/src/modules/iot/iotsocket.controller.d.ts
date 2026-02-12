import { RmqContext } from '@nestjs/microservices';
import { IotDataService } from '@src/modules/iot/iot-data.service';
export declare class IotsocketController {
    private readonly iotDataService;
    private readonly logger;
    constructor(iotDataService: IotDataService);
    handleMqttData(payload: {
        topic: string;
        message: string;
    }, context: RmqContext): Promise<{
        success: boolean;
        deviceId: string;
        dataId: number;
        timestamp: Date;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        deviceId?: undefined;
        dataId?: undefined;
        timestamp?: undefined;
    }>;
    handleCommand(command: {
        deviceId: string;
        command: string;
        parameters?: any;
    }, context: RmqContext): Promise<{
        success: boolean;
        deviceId: string;
        command: string;
        sentAt: Date;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        deviceId?: undefined;
        command?: undefined;
        sentAt?: undefined;
    }>;
    handleDeviceStatus(status: {
        deviceId: string;
        status: string;
        data?: any;
    }, context: RmqContext): Promise<{
        success: boolean;
        deviceId: string;
        status: string;
        updatedAt: Date;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        deviceId?: undefined;
        status?: undefined;
        updatedAt?: undefined;
    }>;
    private extractDeviceIdFromTopic;
    handleAllDevices(data: any, context: RmqContext): Promise<{
        success: boolean;
        error: any;
    }>;
}
