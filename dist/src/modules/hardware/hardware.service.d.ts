import { CreateHardwareDto } from './dto/create-hardware.dto';
import { UpdateHardwareDto } from './dto/update-hardware.dto';
export declare class HardwareService {
    create(createHardwareDto: CreateHardwareDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHardwareDto: UpdateHardwareDto): string;
    remove(id: number): string;
}
