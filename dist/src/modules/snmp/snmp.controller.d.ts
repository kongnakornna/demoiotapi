import { SnmpService } from './snmp.service';
import { CreateSnmpDto } from './dto/create-snmp.dto';
import { UpdateSnmpDto } from './dto/update-snmp.dto';
export declare class SnmpController {
    private readonly snmpService;
    constructor(snmpService: SnmpService);
    create(createSnmpDto: CreateSnmpDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSnmpDto: UpdateSnmpDto): string;
    remove(id: string): string;
}
