import { UpcommingeventsService } from './upcommingevents.service';
import { CreateUpcommingeventDto } from './dto/create-upcommingevent.dto';
import { UpdateUpcommingeventDto } from './dto/update-upcommingevent.dto';
export declare class UpcommingeventsController {
    private readonly upcommingeventsService;
    constructor(upcommingeventsService: UpcommingeventsService);
    create(createUpcommingeventDto: CreateUpcommingeventDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUpcommingeventDto: UpdateUpcommingeventDto): string;
    remove(id: string): string;
}
