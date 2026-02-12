export declare class DeviceConfig {
    id: number;
    deviceId: string;
    config: {
        general?: {
            deviceName?: string;
            description?: string;
            timezone?: string;
            location?: {
                lat?: number;
                lng?: number;
                address?: string;
                floor?: string;
                room?: string;
            };
        };
        reporting?: {
            enabled?: boolean;
            interval?: number;
            format?: 'json' | 'csv' | 'xml';
            batchSize?: number;
            maxRetries?: number;
            retryInterval?: number;
        };
        sensors?: Record<string, {
            enabled?: boolean;
            unit?: string;
            precision?: number;
            calibration?: {
                offset?: number;
                multiplier?: number;
            };
            samplingRate?: number;
        }>;
        thresholds?: Record<string, {
            min?: number;
            max?: number;
            warningMin?: number;
            warningMax?: number;
            criticalMin?: number;
            criticalMax?: number;
        }>;
        alerts?: {
            enabled?: boolean;
            email?: string[];
            sms?: string[];
            webhook?: string;
            escalation?: {
                levels?: number;
                interval?: number;
            };
        };
        communication?: {
            protocol?: 'mqtt' | 'http' | 'websocket';
            endpoint?: string;
            port?: number;
            topic?: string;
            qos?: 0 | 1 | 2;
            retain?: boolean;
            username?: string;
            password?: string;
        };
        power?: {
            sleepMode?: boolean;
            sleepInterval?: number;
            wakeupInterval?: number;
            batterySave?: boolean;
        };
        firmware?: {
            version?: string;
            autoUpdate?: boolean;
            updateUrl?: string;
            checkInterval?: number;
        };
        custom?: Record<string, any>;
    };
    status: 'active' | 'inactive' | 'maintenance';
    notes: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastAppliedAt: Date;
    getConfigValue<T>(path: string, defaultValue?: T): T;
    setConfigValue<T>(path: string, value: T): void;
    mergeConfig(newConfig: Partial<DeviceConfig['config']>): void;
    private deepMerge;
    private isObject;
    validate(): {
        valid: boolean;
        errors: string[];
    };
}
