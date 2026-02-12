import { PartialType } from '@nestjs/swagger';
import { CreateHardwareDto } from './create-hardware.dto';

export class UpdateHardwareDto extends PartialType(CreateHardwareDto) {}
