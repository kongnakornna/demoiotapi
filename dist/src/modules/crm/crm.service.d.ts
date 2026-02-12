import { CreateCrmDto } from './dto/create-crm.dto';
import { UpdateCrmDto } from './dto/update-crm.dto';
export declare class CrmService {
    create(createCrmDto: CreateCrmDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCrmDto: UpdateCrmDto): string;
    remove(id: number): string;
}
