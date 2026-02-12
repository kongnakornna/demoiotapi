import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
export declare class SensorService {
    create(createSensorDto: CreateSensorDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSensorDto: UpdateSensorDto): string;
    remove(id: number): string;
}
