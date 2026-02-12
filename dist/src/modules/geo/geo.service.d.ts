import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';
export declare class GeoService {
    create(createGeoDto: CreateGeoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateGeoDto: UpdateGeoDto): string;
    remove(id: number): string;
}
