import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
export declare class CalendarService {
    create(createCalendarDto: CreateCalendarDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCalendarDto: UpdateCalendarDto): string;
    remove(id: number): string;
}
