import { PartialType } from '@nestjs/swagger';
import { CreateAccessmenuDto } from './create-accessmenu.dto';

export class UpdateAccessmenuDto extends PartialType(CreateAccessmenuDto) {}
