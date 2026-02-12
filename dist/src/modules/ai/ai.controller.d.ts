import { AiService } from '@src/modules/ai/ai.service';
import { CreateAiDto } from '@src/modules/ai/dto/create-ai.dto';
import { UpdateAiDto } from '@src/modules/ai/dto/update-ai.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    create(createAiDto: CreateAiDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAiDto: UpdateAiDto): string;
    remove(id: string): string;
}
