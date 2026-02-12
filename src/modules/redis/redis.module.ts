import { Module } from '@nestjs/common';
import { RedisService } from '@src/modules/redis/redis.service';
import { RedisController } from '@src/modules/redis/redis.controller';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import * as format from '@src/helpers/format.helper';
@Module({
  providers: [RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
