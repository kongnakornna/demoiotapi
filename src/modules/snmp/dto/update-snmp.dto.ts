import { PartialType } from '@nestjs/swagger';
import { CreateSnmpDto } from './create-snmp.dto';

export class UpdateSnmpDto extends PartialType(CreateSnmpDto) {}
