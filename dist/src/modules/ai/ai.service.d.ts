import { CreateAiDto } from '@src/modules/ai/dto/create-ai.dto';
import { UpdateAiDto } from '@src/modules/ai/dto/update-ai.dto';
export declare class AiService {
    create(createAiDto: CreateAiDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAiDto: UpdateAiDto): string;
    remove(id: number): string;
}
