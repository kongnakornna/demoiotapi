import { CreateManualDto } from './dto/create-manual.dto';
import { UpdateManualDto } from './dto/update-manual.dto';
export declare class ManualService {
    create(createManualDto: CreateManualDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateManualDto: UpdateManualDto): string;
    remove(id: number): string;
}
