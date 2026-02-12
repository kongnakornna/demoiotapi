import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpcommingeventsService } from './upcommingevents.service';
import { CreateUpcommingeventDto } from './dto/create-upcommingevent.dto';
import { UpdateUpcommingeventDto } from './dto/update-upcommingevent.dto';

@Controller('upcommingevents')
export class UpcommingeventsController {
  constructor(
    private readonly upcommingeventsService: UpcommingeventsService,
  ) {}

  @Post()
  create(@Body() createUpcommingeventDto: CreateUpcommingeventDto) {
    return this.upcommingeventsService.create(createUpcommingeventDto);
  }

  @Get()
  findAll() {
    return this.upcommingeventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.upcommingeventsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUpcommingeventDto: UpdateUpcommingeventDto,
  ) {
    return this.upcommingeventsService.update(+id, updateUpcommingeventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.upcommingeventsService.remove(+id);
  }
}
