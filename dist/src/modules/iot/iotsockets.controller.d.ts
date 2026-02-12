import { Response, Request } from 'express';
import { IotsocketGateway } from '@src/modules/iot/iotsocket.gateway';
export declare class IotsocketsController {
    private readonly iotGateway;
    private readonly logger;
    constructor(iotGateway: IotsocketGateway);
    getIndex(res: Response, dto: any, query: any, headers: any, params: any, req: Request): Promise<void>;
    handleMqttData(data: any): {
        received: boolean;
        data: any;
    };
    handleCommandLog(data: any): {
        received: boolean;
    };
    handleConfigUpdate(data: any): {
        received: boolean;
    };
    getDeviceStatus(deviceId: string): {
        deviceId: string;
        status: string;
        lastUpdate: string;
        message: string;
    };
    controlDevice(commandDto: any): {
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    };
    updateConfig(id: string, configData: any): {
        id: string;
        updated: boolean;
        newConfig: any;
        timestamp: string;
    };
    getConnectedClients(): {
        message: string;
        endpoint: string;
    };
    healthCheck(): {
        status: string;
        gateway: string;
        timestamp: string;
        uptime: number;
    };
}
