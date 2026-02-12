import { Module } from '@nestjs/common';
import { UpcommingeventsService } from './upcommingevents.service';
import { UpcommingeventsController } from './upcommingevents.controller';

@Module({
  controllers: [UpcommingeventsController],
  providers: [UpcommingeventsService],
})
export class UpcommingeventsModule {}
