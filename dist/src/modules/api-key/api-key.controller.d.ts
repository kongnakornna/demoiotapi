import { ApiKeyService } from '@src/modules/api-key/api-key.service';
import { CreateApiKeyDto } from '@src/modules/api-key/dto/create-api-key.dto';
import { UpdateApiKeyDto } from '@src/modules/api-key/dto/update-api-key.dto';
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(createApiKeyDto: CreateApiKeyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): string;
    remove(id: string): string;
}
