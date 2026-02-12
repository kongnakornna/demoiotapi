import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): string;
    remove(id: string): string;
}
