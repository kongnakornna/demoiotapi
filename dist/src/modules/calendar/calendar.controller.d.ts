import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    create(createCalendarDto: CreateCalendarDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCalendarDto: UpdateCalendarDto): string;
    remove(id: string): string;
}
