import { Test, TestingModule } from '@nestjs/testing';
import { SharedController } from '@src/modules/shared/shared.controller';

describe('SharedController', () => {
  let controller: SharedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedController],
    }).compile();

    controller = module.get<SharedController>(SharedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
