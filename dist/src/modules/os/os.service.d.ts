import { CreateODto } from '@src/modules/os/dto/create-o.dto';
import { UpdateODto } from '@src/modules/os/dto/update-o.dto';
export declare class OsService {
    create(createODto: CreateODto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateODto: UpdateODto): string;
    remove(id: number): string;
}
