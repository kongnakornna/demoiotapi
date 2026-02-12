import { PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from '@src/modules/schedules/dto/create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
