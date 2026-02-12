import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
export declare class MapsService {
    create(createMapDto: CreateMapDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMapDto: UpdateMapDto): string;
    remove(id: number): string;
}
