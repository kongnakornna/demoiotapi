import { IotalarmService } from './iotalarm.service';
import { CreateIotalarmDto } from './dto/create-iotalarm.dto';
import { UpdateIotalarmDto } from './dto/update-iotalarm.dto';
export declare class IotalarmController {
    private readonly iotalarmService;
    constructor(iotalarmService: IotalarmService);
    create(createIotalarmDto: CreateIotalarmDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateIotalarmDto: UpdateIotalarmDto): string;
    remove(id: string): string;
}
