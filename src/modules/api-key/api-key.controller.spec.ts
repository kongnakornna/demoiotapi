import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyController } from '@src/modules/api-key/api-key.controller';
import { ApiKeyService } from '@src/modules/api-key/api-key.service';

describe('ApiKeyController', () => {
  let controller: ApiKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [ApiKeyService],
    }).compile();

    controller = module.get<ApiKeyController>(ApiKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
