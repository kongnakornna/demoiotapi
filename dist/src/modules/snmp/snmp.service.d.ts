import { CreateSnmpDto } from './dto/create-snmp.dto';
import { UpdateSnmpDto } from './dto/update-snmp.dto';
export declare class SnmpService {
    create(createSnmpDto: CreateSnmpDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSnmpDto: UpdateSnmpDto): string;
    remove(id: number): string;
}
