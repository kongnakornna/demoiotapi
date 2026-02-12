import { GeoService } from './geo.service';
import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';
export declare class GeoController {
    private readonly geoService;
    constructor(geoService: GeoService);
    create(createGeoDto: CreateGeoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateGeoDto: UpdateGeoDto): string;
    remove(id: string): string;
}
