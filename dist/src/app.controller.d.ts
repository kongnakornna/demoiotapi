import { AppService } from '@src/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(req: any): Promise<any>;
    hi(): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
}
