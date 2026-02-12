import { Test, TestingModule } from '@nestjs/testing';
import { SyslogService } from './syslog.service';

describe('SyslogService', () => {
  let service: SyslogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyslogService],
    }).compile();

    service = module.get<SyslogService>(SyslogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
