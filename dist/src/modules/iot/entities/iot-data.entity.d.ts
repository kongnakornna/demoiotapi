import { DeviceAlert } from './device-alert.entity';
export declare class IotData {
    id: number;
    deviceId: string;
    data: {
        temperature?: number;
        humidity?: number;
        pressure?: number;
        voltage?: number;
        current?: number;
        power?: number;
        energy?: number;
        battery?: number;
        signal?: number;
        status?: string;
        [key: string]: any;
    };
    timestamp: Date;
    location: {
        lat?: number;
        lng?: number;
        accuracy?: number;
        altitude?: number;
        speed?: number;
        heading?: number;
    };
    metadata: {
        source?: string;
        version?: string;
        quality?: number;
        processingTime?: number;
        validated?: boolean;
        [key: string]: any;
    };
    dataType: string;
    dataQuality: number;
    createdAt: Date;
    alerts: DeviceAlert[];
    constructor();
    setDefaultTimestamp(): void;
    static createFromRawData(deviceId: string, rawData: string): IotData;
    extractValue(metric: string): number | null;
    hasMetric(metric: string): boolean;
    getMetrics(): string[];
    validate(): {
        valid: boolean;
        errors: string[];
    };
    toJSON(): any;
}
