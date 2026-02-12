import { CrmService } from './crm.service';
import { CreateCrmDto } from './dto/create-crm.dto';
import { UpdateCrmDto } from './dto/update-crm.dto';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    create(createCrmDto: CreateCrmDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCrmDto: UpdateCrmDto): string;
    remove(id: string): string;
}
