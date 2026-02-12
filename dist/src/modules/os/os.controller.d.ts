import { Response } from 'express';
import { OsService } from '@src/modules/os/os.service';
export declare class OsController {
    private readonly osService;
    constructor(osService: OsService);
    getMemoryInfoss(res: Response, query: any, headers: any, params: any, req: any): Promise<{
        error: string;
    }>;
    getMemoryInfo(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getCpuUsage(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getMemoryInfos(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getDiskSpace(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getAppCpuUsage(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getAppMemoryUsage(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
}
