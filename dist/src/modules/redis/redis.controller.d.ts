import { RedisService } from '@src/modules/redis/redis.service';
import { redisDto } from '@src/modules/redis/dto/redis.dto';
export declare class RedisController {
    private readonly RedisService;
    constructor(RedisService: RedisService);
    otpIndex(Request: any): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
    otp(Request: any): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
    validateOTP(Request: any, res: Response, caseModel: redisDto): Promise<{
        message: 'ok';
        statuscode: 200;
    }>;
}
