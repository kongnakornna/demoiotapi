import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
export declare class HrController {
    private readonly hrService;
    constructor(hrService: HrService);
    create(createHrDto: CreateHrDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHrDto: UpdateHrDto): string;
    remove(id: string): string;
}
