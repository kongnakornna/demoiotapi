import { CreateMaDto } from './dto/create-ma.dto';
import { UpdateMaDto } from './dto/update-ma.dto';
export declare class MaService {
    create(createMaDto: CreateMaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMaDto: UpdateMaDto): string;
    remove(id: number): string;
}
