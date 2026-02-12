import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from '@src/modules/mqtt/mqtt.controller';
import { MqttService } from '@src/modules/mqtt/mqtt.service';

describe('MqttController', () => {
  let controller: MqttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MqttController],
      providers: [MqttService],
    }).compile();

    controller = module.get<MqttController>(MqttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
