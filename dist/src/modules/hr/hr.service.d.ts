import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
export declare class HrService {
    create(createHrDto: CreateHrDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHrDto: UpdateHrDto): string;
    remove(id: number): string;
}
