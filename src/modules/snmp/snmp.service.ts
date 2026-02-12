import { Injectable } from '@nestjs/common';
import { CreateSnmpDto } from './dto/create-snmp.dto';
import { UpdateSnmpDto } from './dto/update-snmp.dto';

@Injectable()
export class SnmpService {
  create(createSnmpDto: CreateSnmpDto) {
    return 'This action adds a new snmp';
  }

  findAll() {
    return `This action returns all snmp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} snmp`;
  }

  update(id: number, updateSnmpDto: UpdateSnmpDto) {
    return `This action updates a #${id} snmp`;
  }

  remove(id: number) {
    return `This action removes a #${id} snmp`;
  }
}
