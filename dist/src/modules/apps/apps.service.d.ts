import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
export declare class AppsService {
    create(createAppDto: CreateAppDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAppDto: UpdateAppDto): string;
    remove(id: number): string;
}
