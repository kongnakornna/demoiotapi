import { ChartService } from './chart.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
export declare class ChartController {
    private readonly chartService;
    constructor(chartService: ChartService);
    create(createChartDto: CreateChartDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateChartDto: UpdateChartDto): string;
    remove(id: string): string;
}
