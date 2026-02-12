import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
export declare class TimelineService {
    create(createTimelineDto: CreateTimelineDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTimelineDto: UpdateTimelineDto): string;
    remove(id: number): string;
}
