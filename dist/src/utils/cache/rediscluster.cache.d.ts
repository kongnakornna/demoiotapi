import 'dotenv/config';
export declare class CacheData {
    SetCacheData(setData: any): Promise<any>;
    GetCacheData(keycache: any): Promise<any>;
    DeleteCacheData(keycache: any): Promise<any>;
    resetCacheById(keycache: any): Promise<any>;
    UpdateCacheData(setData: any): Promise<any>;
    gethCacheById(setData: any): Promise<any>;
    Test(setData: any): Promise<string>;
    OTP(keycache: any): Promise<{
        key: any;
        time: number;
        OTP: any;
        dayloth: string;
        dayloen: string;
        timestamp: any;
        timelostart: Date;
    }>;
    validateOTP(setData: any): Promise<number>;
    Run(keycache: any): Promise<{
        key: any;
        time: number;
        OTP: any;
    }>;
}
