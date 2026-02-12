import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from '@src/modules/api-key//dto/create-api-key.dto';
import { UpdateApiKeyDto } from '@src/modules/api-key/dto/update-api-key.dto';

@Injectable()
export class ApiKeyService {
  create(createApiKeyDto: CreateApiKeyDto) {
    return 'This action adds a new apiKey';
  }

  findAll() {
    return `This action returns all apiKey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiKey`;
  }

  update(id: number, updateApiKeyDto: UpdateApiKeyDto) {
    return `This action updates a #${id} apiKey`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiKey`;
  }
}
