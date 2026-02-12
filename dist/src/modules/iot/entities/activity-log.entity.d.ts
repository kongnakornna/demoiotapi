export declare class ActivityLog {
    id: number;
    type: 'DATA_RECEIVED' | 'DATA_PROCESSED' | 'DATA_SAVED' | 'DATA_UPDATED' | 'DATA_DELETED' | 'DEVICE_REGISTERED' | 'DEVICE_STATUS_CHANGED' | 'DEVICE_CONFIG_UPDATED' | 'COMMAND_ISSUED' | 'COMMAND_EXECUTED' | 'COMMAND_FAILED' | 'ALERT_TRIGGERED' | 'ALERT_RESOLVED' | 'ALERT_ACKNOWLEDGED' | 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_ACTION' | 'SYSTEM_START' | 'SYSTEM_STOP' | 'SYSTEM_ERROR' | 'ERROR' | 'MAINTENANCE' | 'DATA_IMPORT' | 'DATA_EXPORT' | 'BACKUP_CREATED' | 'BACKUP_RESTORED' | 'OTHER';
    deviceId: string;
    userId: string;
    details: string;
    data: any;
    severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    correlationId: string;
    timestamp: Date;
    createdAt: Date;
    stackTrace: string;
    static createFromError(error: Error, type: ActivityLog['type'], details: string, deviceId?: string, userId?: string, data?: any): ActivityLog;
    static createInfo(type: ActivityLog['type'], details: string, deviceId?: string, userId?: string, data?: any): ActivityLog;
    toJSON(): any;
    isError(): boolean;
    getFormattedTimestamp(): string;
}
