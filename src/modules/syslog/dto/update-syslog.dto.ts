import { PartialType } from '@nestjs/swagger';
import { CreateSyslogDto } from './create-syslog.dto';

export class UpdateSyslogDto extends PartialType(CreateSyslogDto) {}
