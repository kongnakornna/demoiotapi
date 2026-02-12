import { PartialType } from '@nestjs/swagger';
import { CreateUpcommingeventDto } from './create-upcommingevent.dto';

export class UpdateUpcommingeventDto extends PartialType(
  CreateUpcommingeventDto,
) {}
