import { ManualService } from './manual.service';
import { CreateManualDto } from './dto/create-manual.dto';
import { UpdateManualDto } from './dto/update-manual.dto';
export declare class ManualController {
    private readonly manualService;
    constructor(manualService: ManualService);
    create(createManualDto: CreateManualDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateManualDto: UpdateManualDto): string;
    remove(id: string): string;
}
