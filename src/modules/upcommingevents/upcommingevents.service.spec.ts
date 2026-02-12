import { Test, TestingModule } from '@nestjs/testing';
import { UpcommingeventsService } from './upcommingevents.service';

describe('UpcommingeventsService', () => {
  let service: UpcommingeventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpcommingeventsService],
    }).compile();

    service = module.get<UpcommingeventsService>(UpcommingeventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
