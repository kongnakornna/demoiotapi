import * as path from 'path';
//const envPath = path.join(__dirname, '../config.conf')
//require('dotenv').config({ path: envPath })
import * as format from '@src/helpers/format.helper';
import 'dotenv/config';
require('dotenv').config();
import { paginate, PaginateConfig } from 'nestjs-paginate';

console.log(
  '===============================paginate===============================================================',
);
export class Paginate {
  /*
    async getPaginatedData(query:any, repo:any,Entity:any) {
        const config: PaginateConfig(<Entity>) = {
          sortableColumns: ['name', 'createdAt'],
          searchableColumns: ['name'],
          relations: ['relationName'],
        };
        return paginate<Entity>(query, repo, config);
      }

    async paginate(options: IPaginationOptions): Promise<Pagination<Entity>> {
        return paginate<Entity>(this.repository, options);
    }
    */
}

/*
# controler

@Get()
async index(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Entity>> {
  return this.service.paginate({ page, limit });
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);

  return { page, limit };
});


import { Repository } from 'typeorm';

export class PaginationService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async paginate(page: number, limit: number): Promise<{ items: T[]; total: number }> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }
}

import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class SharedModule {}


@Get()
async getPaginatedData(@PaginationParams() paginationParams) {
  const { page, limit } = paginationParams;
  return this.paginationService.paginate(page, limit);
}


*/
