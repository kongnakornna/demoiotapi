import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    create(createTicketDto: CreateTicketDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTicketDto: UpdateTicketDto): string;
    remove(id: string): string;
}
