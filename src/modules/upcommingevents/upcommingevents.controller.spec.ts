import { Test, TestingModule } from '@nestjs/testing';
import { UpcommingeventsController } from './upcommingevents.controller';
import { UpcommingeventsService } from './upcommingevents.service';

describe('UpcommingeventsController', () => {
  let controller: UpcommingeventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpcommingeventsController],
      providers: [UpcommingeventsService],
    }).compile();

    controller = module.get<UpcommingeventsController>(
      UpcommingeventsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
