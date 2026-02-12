import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
export declare class PackageController {
    private readonly packageService;
    constructor(packageService: PackageService);
    create(createPackageDto: CreatePackageDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePackageDto: UpdatePackageDto): string;
    remove(id: string): string;
}
