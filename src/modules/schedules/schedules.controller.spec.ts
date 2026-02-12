import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from '@src/modules/schedules/schedules.controller';
import { SchedulesService } from '@src/modules/schedules/schedules.service';

describe('SchedulesController', () => {
  let controller: SchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [SchedulesService],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
