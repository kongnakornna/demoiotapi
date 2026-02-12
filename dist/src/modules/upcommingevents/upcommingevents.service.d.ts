import { CreateUpcommingeventDto } from './dto/create-upcommingevent.dto';
import { UpdateUpcommingeventDto } from './dto/update-upcommingevent.dto';
export declare class UpcommingeventsService {
    create(createUpcommingeventDto: CreateUpcommingeventDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUpcommingeventDto: UpdateUpcommingeventDto): string;
    remove(id: number): string;
}
