import { MaService } from './ma.service';
import { CreateMaDto } from './dto/create-ma.dto';
import { UpdateMaDto } from './dto/update-ma.dto';
export declare class MaController {
    private readonly maService;
    constructor(maService: MaService);
    create(createMaDto: CreateMaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMaDto: UpdateMaDto): string;
    remove(id: string): string;
}
