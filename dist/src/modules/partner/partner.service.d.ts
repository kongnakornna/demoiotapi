import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnerService {
    create(createPartnerDto: CreatePartnerDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePartnerDto: UpdatePartnerDto): string;
    remove(id: number): string;
}
