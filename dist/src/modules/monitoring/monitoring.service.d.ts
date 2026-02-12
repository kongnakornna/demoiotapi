import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
export declare class MonitoringService {
    create(createMonitoringDto: CreateMonitoringDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMonitoringDto: UpdateMonitoringDto): string;
    remove(id: number): string;
}
