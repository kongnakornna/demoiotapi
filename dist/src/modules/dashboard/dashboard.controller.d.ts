import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    create(createDashboardDto: CreateDashboardDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDashboardDto: UpdateDashboardDto): string;
    remove(id: string): string;
}
