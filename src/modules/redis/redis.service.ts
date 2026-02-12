import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/modules/users/entities/user.entity';

@Injectable()
export class RedisService {
  constructor() {}

  getIndex(): string {
    return 'Welcome RedisService!';
  }
}
