import { Module } from '@nestjs/common';
import { AiService } from '@src/modules/ai/ai.service';
import { AiController } from '@src/modules/ai/ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
