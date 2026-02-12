export declare class DeviceAlert {
    id: number;
    deviceId: string;
    type: 'THRESHOLD_VIOLATION' | 'DEVICE_OFFLINE' | 'DEVICE_ERROR' | 'BATTERY_LOW' | 'SIGNAL_WEAK' | 'DATA_QUALITY' | 'MAINTENANCE_REQUIRED' | 'CONFIGURATION_ERROR' | 'SECURITY_ALERT' | 'CUSTOM' | 'SYSTEM';
    metric: string;
    value: number;
    threshold: {
        min?: number;
        max?: number;
        warningMin?: number;
        warningMax?: number;
        criticalMin?: number;
        criticalMax?: number;
    };
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    details: any;
    resolved: boolean;
    resolutionNotes: string;
    resolvedBy: string;
    resolvedAt: Date;
    acknowledged: boolean;
    acknowledgedBy: string;
    acknowledgedAt: Date;
    escalation: {
        level: number;
        notifiedAt: Date[];
        nextEscalationAt?: Date;
    };
    dataId: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    notificationCount: number;
    static createThresholdAlert(deviceId: string, metric: string, value: number, threshold: DeviceAlert['threshold'], severity?: DeviceAlert['severity']): DeviceAlert;
    static createDeviceOfflineAlert(deviceId: string, lastSeen: Date, timeoutMinutes: number): DeviceAlert;
    static createBatteryLowAlert(deviceId: string, batteryLevel: number, threshold?: number): DeviceAlert;
    acknowledge(user: string): void;
    resolve(user: string, notes?: string): void;
    escalate(): void;
    incrementNotificationCount(): void;
    shouldEscalate(): boolean;
    getDuration(): number;
    getFormattedDuration(): string;
    isExpired(): boolean;
    toJSON(): any;
}
