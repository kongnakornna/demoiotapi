import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { CreateAccessmenuDto } from '@src/modules/accessmenu/dto/create-accessmenu.dto';
import { UpdateAccessmenuDto } from '@src/modules/accessmenu/dto/update-accessmenu.dto';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
var moment = require('moment');
import { User } from '@src/modules/users/entities/user.entity';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { Useraccessmenu } from '@src/modules/accessmenu/entities/useraccessmenu.entity';
import * as format from '@src/helpers/format.helper';

@Injectable()
export class AccessmenuService {
  private readonly logger = new Logger(AccessmenuService.name);
  constructor(
    @InjectRepository(AccessMenu)
    private AccessmenuRepository: Repository<AccessMenu>,
    @InjectRepository(Useraccessmenu)
    private UseraccessmenuRepository: Repository<Useraccessmenu>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  create(createInvoiceDto: CreateAccessmenuDto) {
    return 'This action adds a new invoice';
  }

  getHello(): string {
    var generatpwd: any = format.generatePassword(6);
    var result: any = {
      message: 'CmonIoT AccessmenuService!',
      generatpwd: generatpwd,
    };
    return result;
  }

  // admin
  async findAll(InputData: any): Promise<AccessMenu> {
    try {
      console.log(`InputData=>`);
      console.info(InputData);
      var generatpwd: any = format.generatePassword(6);
      const query: any = await this.AccessmenuRepository.createQueryBuilder(
        'a',
      );
      query.select([
        'a.admin_access_id AS access_id',
        'a.admin_type_id AS type_id',
        'a.admin_menu_id AS menu_id',
      ]);
      query.where('1=1');
      if (InputData.admin_type_id) {
        query.andWhere('a.admin_access_id=:admin_access_id', {
          admin_access_id: InputData.admin_type_id,
        });
      }
      if (InputData.admin_menu_id) {
        query.andWhere('a.admin_menu_id IN(:...admin_menu_id)', {
          admin_menu_id: [InputData.admin_menu_id],
        });
      }
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      let count: any = await query.getCount();
      let rs: any = await query.getRawMany();
      // console.log('count'); console.info(count);
      // console.log(`rs=`); console.info(rs);
      return rs;
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }

  // user
  async findAllUserMunu(InputData: any): Promise<Useraccessmenu> {
    try {
      // console.log(`InputData=>`); console.info(InputData);
      const query: any = await this.UseraccessmenuRepository.createQueryBuilder(
        'a',
      );
      query.select([
        'a.user_access_id AS access_id',
        'a.user_type_id AS type_id',
        'a.menu_id AS menu_id',
        'a.parent_id AS parent_id',
      ]);
      query.where('1=1');
      if (InputData.type_id) {
        query.andWhere('a.user_type_id=:user_type_id', {
          user_type_id: InputData.type_id,
        });
      }
      if (InputData.menu_id) {
        query.andWhere('a.menu_id IN(:...menu_id)', {
          menu_id: [InputData.menu_id],
        });
      }
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      if (InputData.count === 1) {
        let count: any = await query.getCount();
        // console.log('count:'+count);
        return count;
      } else {
        let rs: any = await query.getRawMany();
        // console.log(`rs=`); console.info(rs);
        return rs;
      }
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }

  async findOne(id: number) {
    try {
      return `This action returns a #${id} accessmenu`;
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }

  async update(id: number, updateAccessmenuDto: UpdateAccessmenuDto) {
    try {
      return `This action updates a #${id} accessmenu`;
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }

  async remove(id: number) {
    try {
      return `This action removes a #${id} accessmenu`;
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }
}
