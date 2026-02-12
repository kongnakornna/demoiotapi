import { Test, TestingModule } from '@nestjs/testing';
import { SyslogController } from './syslog.controller';
import { SyslogService } from './syslog.service';

describe('SyslogController', () => {
  let controller: SyslogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyslogController],
      providers: [SyslogService],
    }).compile();

    controller = module.get<SyslogController>(SyslogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
