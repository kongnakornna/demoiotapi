export declare class ApiKey {
    id: number;
    name: string;
    description: string;
    key: string;
    secret: string;
    userId: string;
    permissions: any;
    expiresAt: Date;
    lastUsedAt: Date;
    usageCount: number;
    isActive: boolean;
    ipWhitelist: any;
    createdAt: Date;
    updatedAt: Date;
}
