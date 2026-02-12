import { Injectable } from '@nestjs/common';
@Injectable()
export class SensorService {
  create(createSensorDto: any) {
    return 'This action adds a new sensor';
  }

  findAll() {
    return `This action returns all sensor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensor`;
  }

  update(id: number, updateSensorDto: any) {
    return `This action updates a #${id} sensor`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensor`;
  }
}
