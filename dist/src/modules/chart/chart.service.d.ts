import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
export declare class ChartService {
    create(createChartDto: CreateChartDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateChartDto: UpdateChartDto): string;
    remove(id: number): string;
}
