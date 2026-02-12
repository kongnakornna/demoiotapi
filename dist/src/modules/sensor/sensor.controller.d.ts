import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
export declare class SensorController {
    private readonly sensorService;
    constructor(sensorService: SensorService);
    create(createSensorDto: CreateSensorDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSensorDto: UpdateSensorDto): string;
    remove(id: string): string;
}
