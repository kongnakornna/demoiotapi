import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SensorService } from './sensor.service';
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  create(@Body() createSensorDto: any) {
    return this.sensorService.create(createSensorDto);
  }

  @Get()
  findAll() {
    return this.sensorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSensorDto: any) {
    return this.sensorService.update(+id, updateSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorService.remove(+id);
  }
}
