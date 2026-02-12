import { Response } from 'express';
import { SharedService } from '@src/modules/shared/shared.service';
import 'dotenv/config';
export declare class SharedController {
    private readonly sharedService;
    constructor(sharedService: SharedService);
    index(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<{}>;
}
