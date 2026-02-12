import { CreateApiKeyDto } from '@src/modules/api-key//dto/create-api-key.dto';
import { UpdateApiKeyDto } from '@src/modules/api-key/dto/update-api-key.dto';
export declare class ApiKeyService {
    create(createApiKeyDto: CreateApiKeyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateApiKeyDto: UpdateApiKeyDto): string;
    remove(id: number): string;
}
