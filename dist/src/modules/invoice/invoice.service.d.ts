import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceService {
    create(createInvoiceDto: CreateInvoiceDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
    remove(id: number): string;
}
