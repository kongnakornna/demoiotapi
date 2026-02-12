import { Global, Module } from '@nestjs/common';
import { ConfigMongodbService } from './config.servicemongodb';

@Global()
@Module({
  providers: [
    {
      provide: ConfigMongodbService,
      useValue: new ConfigMongodbService(),
    },
  ],
  exports: [ConfigMongodbService],
})
export class ConfigModule {}
