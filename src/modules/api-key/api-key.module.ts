import { Module } from '@nestjs/common';
import { ApiKeyService } from '@src/modules/api-key/api-key.service';
import { ApiKeyController } from '@src/modules/api-key/api-key.controller';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}
