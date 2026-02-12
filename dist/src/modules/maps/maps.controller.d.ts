import { MapsService } from './maps.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
export declare class MapsController {
    private readonly mapsService;
    constructor(mapsService: MapsService);
    create(createMapDto: CreateMapDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMapDto: UpdateMapDto): string;
    remove(id: string): string;
}
