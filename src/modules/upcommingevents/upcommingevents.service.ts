import { Injectable } from '@nestjs/common';
import { CreateUpcommingeventDto } from './dto/create-upcommingevent.dto';
import { UpdateUpcommingeventDto } from './dto/update-upcommingevent.dto';

@Injectable()
export class UpcommingeventsService {
  create(createUpcommingeventDto: CreateUpcommingeventDto) {
    return 'This action adds a new upcommingevent';
  }

  findAll() {
    return `This action returns all upcommingevents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upcommingevent`;
  }

  update(id: number, updateUpcommingeventDto: UpdateUpcommingeventDto) {
    return `This action updates a #${id} upcommingevent`;
  }

  remove(id: number) {
    return `This action removes a #${id} upcommingevent`;
  }
}
