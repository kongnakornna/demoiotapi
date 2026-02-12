import { HardwareService } from './hardware.service';
import { CreateHardwareDto } from './dto/create-hardware.dto';
import { UpdateHardwareDto } from './dto/update-hardware.dto';
export declare class HardwareController {
    private readonly hardwareService;
    constructor(hardwareService: HardwareService);
    create(createHardwareDto: CreateHardwareDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHardwareDto: UpdateHardwareDto): string;
    remove(id: string): string;
}
