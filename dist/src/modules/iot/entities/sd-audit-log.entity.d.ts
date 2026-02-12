export declare class AuditLog {
    audit_id: number;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId: number;
    before: any;
    after: any;
    changes: any;
    ipAddress: string;
    userAgent: string;
    actionTime: Date;
    description: string;
    createdAt: Date;
}
