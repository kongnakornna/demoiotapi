import { Test, TestingModule } from '@nestjs/testing';
import { AccessmenuService } from '@src/modules/accessmenu/accessmenu.service';

describe('AccessmenuService', () => {
  let service: AccessmenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessmenuService],
    }).compile();

    service = module.get<AccessmenuService>(AccessmenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
