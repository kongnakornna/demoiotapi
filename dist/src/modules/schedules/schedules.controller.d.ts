import { Response } from 'express';
import 'dotenv/config';
import { SchedulesService } from '@src/modules/schedules/schedules.service';
import { CreateScheduleDto } from '@src/modules/schedules/dto/create-schedule.dto';
import { UpdateScheduleDto } from '@src/modules/schedules/dto/update-schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    GetIndex(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    create(createScheduleDto: CreateScheduleDto): string;
    findOne(id: string): string;
    update(id: string, updateScheduleDto: UpdateScheduleDto): string;
    remove(id: string): string;
}
