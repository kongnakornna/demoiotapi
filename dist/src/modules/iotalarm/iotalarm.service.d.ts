import { CreateIotalarmDto } from './dto/create-iotalarm.dto';
import { UpdateIotalarmDto } from './dto/update-iotalarm.dto';
export declare class IotalarmService {
    create(createIotalarmDto: CreateIotalarmDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateIotalarmDto: UpdateIotalarmDto): string;
    remove(id: number): string;
}
