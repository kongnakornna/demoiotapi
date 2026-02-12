export declare class DeviceStatus {
    id: number;
    deviceId: string;
    isOnline: boolean;
    isActive: boolean;
    lastSeen: Date;
    lastData: any;
    batteryLevel: number;
    signalStrength: number;
    temperature: number;
    humidity: number;
    firmwareVersion: string;
    uptime: number;
    location: {
        lat?: number;
        lng?: number;
        accuracy?: number;
        address?: string;
        timestamp?: Date;
    };
    networkInfo: {
        ipAddress?: string;
        macAddress?: string;
        ssid?: string;
        bssid?: string;
        rssi?: number;
        channel?: number;
    };
    hardwareInfo: {
        model?: string;
        manufacturer?: string;
        serialNumber?: string;
        cpuUsage?: number;
        memoryUsage?: number;
        storageUsage?: number;
    };
    metrics: {
        messagesReceived?: number;
        messagesSent?: number;
        errorsCount?: number;
        lastError?: string;
        avgResponseTime?: number;
        maxResponseTime?: number;
    };
    statusMessage: string;
    customFields: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    firstSeen: Date;
    lastMaintenance: Date;
    connectionCount: number;
    updateFromData(data: any): void;
    private previouslyOnline;
    getUptimePercentage(days?: number): number;
    getBatteryStatus(): {
        level: number;
        status: 'critical' | 'low' | 'medium' | 'high' | 'full';
    };
    getSignalStatus(): {
        strength: number;
        quality: 'poor' | 'fair' | 'good' | 'excellent';
    };
    resetMetrics(): void;
    recordMessageReceived(): void;
    recordError(error: string): void;
}
