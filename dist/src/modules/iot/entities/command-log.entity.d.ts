export declare class CommandLog {
    id: number;
    deviceId: string;
    action: string;
    parameters: any;
    metadata: any;
    status: 'pending' | 'sent' | 'executed' | 'failed' | 'cancelled';
    issuedBy: string;
    clientIp: string;
    response: any;
    error: string;
    issuedAt: Date;
    sentAt: Date;
    executedAt: Date;
    failedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    markAsSent(): void;
    markAsExecuted(response?: any): void;
    markAsFailed(error: string): void;
    markAsCancelled(): void;
    isPending(): boolean;
    isExecuted(): boolean;
    getExecutionTime(): number | null;
}
