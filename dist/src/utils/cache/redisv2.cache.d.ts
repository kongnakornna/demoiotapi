import 'dotenv/config';
export declare class CacheDataOne {
    SetCacheData(setData: any): Promise<any>;
    SetCacheKey(setData: any): Promise<any>;
    UpdateCacheData(setData: any): Promise<any>;
    GetCacheData(keycache: any): Promise<any>;
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
    validateOTP(setData: any): Promise<number>;
    Run(datars: any): Promise<any>;
}
