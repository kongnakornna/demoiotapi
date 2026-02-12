import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
export declare class TimelineController {
    private readonly timelineService;
    constructor(timelineService: TimelineService);
    create(createTimelineDto: CreateTimelineDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTimelineDto: UpdateTimelineDto): string;
    remove(id: string): string;
}
