import 'dotenv/config';
export declare class RedisClient {
    private client;
    private isConnected;
    constructor();
    private initializeRedis;
    connect(): Promise<boolean>;
    healthCheck(): Promise<boolean>;
    getClient(): any;
    isReady(): boolean;
}
export declare const redisClient: RedisClient;
export declare class CacheDataOne {
    SetCacheData(setData: any): Promise<any>;
    SetCacheKey(setData: any): Promise<any>;
    UpdateCacheData(setData: any): Promise<any>;
    GetCacheData(keycache: any): Promise<any>;
    GetCacheData2(keycache: any): Promise<any>;
    DeleteCacheData(keycache: any): Promise<any>;
    OTP(keycache: any): Promise<{
        key: any;
        time: number;
        OTP: any;
        day_th: string;
        day_en: string;
        timestamp: any;
        time_start: Date;
    }>;
    OTPTIME(keycache: any, ttm: any): Promise<{
        key: any;
        time: any;
        OTP: any;
        day_th: string;
        day_en: string;
        timestamp: any;
        time_start: Date;
    }>;
    validateOTP(setData: any): Promise<number>;
    validateGet(setData: any): Promise<number>;
    Run(datars: any): Promise<any>;
    OTPTIMEUSER(keycache: any, ttm: any, uid: any, email: any, username: any, token: any, roleId: any): Promise<{
        key: any;
        time: any;
        OTP: any;
        day_th: string;
        day_en: string;
        timestamp: any;
        time_start: Date;
    }>;
    validateGetUser(setData: any): Promise<any>;
    GetAllCacheDatakeys(): Promise<{
        [key: string]: any;
    }>;
    GetAllCacheDataWithScan(): Promise<{
        [key: string]: any;
    }>;
    GetAllKeys(): Promise<any>;
    SearchKeys(pattern: string): Promise<any>;
    SearchKeysWithScan(pattern: string): Promise<string[]>;
    SearchCacheData(pattern: string): Promise<{
        [key: string]: any;
    }>;
    HasKey(pattern: string): Promise<boolean>;
    CountKeys(pattern: string): Promise<number>;
    getKeyTTL(key: string): Promise<number>;
}
