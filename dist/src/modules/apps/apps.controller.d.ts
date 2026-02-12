import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
export declare class AppsController {
    private readonly appsService;
    constructor(appsService: AppsService);
    create(createAppDto: CreateAppDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAppDto: UpdateAppDto): string;
    remove(id: string): string;
}
