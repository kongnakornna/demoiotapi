import { Module } from '@nestjs/common';
import { AccountService } from '@src/modules/account/account.service';
import { AccountController } from '@src/modules/account/account.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
