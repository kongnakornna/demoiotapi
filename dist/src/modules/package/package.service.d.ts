import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
export declare class PackageService {
    create(createPackageDto: CreatePackageDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePackageDto: UpdatePackageDto): string;
    remove(id: number): string;
}
