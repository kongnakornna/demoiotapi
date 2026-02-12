import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnerController {
    private readonly partnerService;
    constructor(partnerService: PartnerService);
    create(createPartnerDto: CreatePartnerDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePartnerDto: UpdatePartnerDto): string;
    remove(id: string): string;
}
