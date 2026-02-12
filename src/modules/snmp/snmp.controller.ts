import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SnmpService } from './snmp.service';
import { CreateSnmpDto } from './dto/create-snmp.dto';
import { UpdateSnmpDto } from './dto/update-snmp.dto';

@Controller('snmp')
export class SnmpController {
  constructor(private readonly snmpService: SnmpService) {}

  @Post()
  create(@Body() createSnmpDto: CreateSnmpDto) {
    return this.snmpService.create(createSnmpDto);
  }

  @Get()
  findAll() {
    return this.snmpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snmpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnmpDto: UpdateSnmpDto) {
    return this.snmpService.update(+id, updateSnmpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snmpService.remove(+id);
  }
}
