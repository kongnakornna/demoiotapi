import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    create(createMonitoringDto: CreateMonitoringDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMonitoringDto: UpdateMonitoringDto): string;
    remove(id: string): string;
}
