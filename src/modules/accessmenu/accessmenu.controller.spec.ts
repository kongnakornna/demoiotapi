import { Test, TestingModule } from '@nestjs/testing';
import { AccessmenuController } from './accessmenu.controller';
import { AccessmenuService } from './accessmenu.service';

describe('AccessmenuController', () => {
  let controller: AccessmenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessmenuController],
      providers: [AccessmenuService],
    }).compile();

    controller = module.get<AccessmenuController>(AccessmenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
