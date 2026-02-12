import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
/******** entity *****************/
import { UsersService } from '@src/modules/users/users.service';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';

import * as format from '@src/helpers/format.helper';
import * as argon2 from 'argon2';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from '@src/modules/auth/types/auth-jwtPayload';
import refreshJwtConfig from '@src/modules/auth/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import 'dotenv/config';
require('dotenv').config();
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Role) private RoleRepository: Repository<Role>, 
    @InjectRepository(Rolesaccess) private RolesaccessRepository: Repository<Rolesaccess>, 
  ) {}

  async getlist(): Promise<Role> {
    console.log(`getlist urole_type_id=`);
    try { 
      const query: any = await this.RoleRepository.createQueryBuilder('r');
      query.select(['r.*']); 
      query.where('1=1');
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      //let count:any = await query.getCount();
      let rs: any = await query.getRawMany();
      console.info(query);
      //console.log(`Counts=`, count);
      console.log(`rs=`); console.info(rs); 
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

  async getData(role_type_id: number): Promise<Role> {
      try {
        const rs = await this.RoleRepository.findOne({
          where: {
            role_type_id,
          },
        });
        //console.log('getRole=>');console.info(Role);
        return rs;
      } catch (err) {
        this.logger.error(`Error ${JSON.stringify(err)}`);
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            errorMessage: err.message,
          },
        });
      }
  }

  async deleteData(role_type_id: number):Promise<void> {
    try {
      this.logger.log(`Deleting Role with role_type_id: ${role_type_id}`);
      const Role = await this.getData(role_type_id);
      if (!Role) {
        throw new NotFoundException(`Role with role_type_id ${role_type_id} not found`);
      }

      await this.RoleRepository.delete(role_type_id);
    } catch (error) {
      this.logger.error(`Error while deleting Role = ${error}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: error.message,
        },
      });
    }
  }

  async createData(dto: any): Promise<Role> {
      // console.info(userToCreate);
      const result: any = await this.RoleRepository.save(
        this.RoleRepository.create(dto),
      );
      return result;
  }

  async updateData(dto) {
      // const role_type_id:any = JSON.parse(dto.role_type_id);
      let role_type_id = dto.role_type_id;
      const DataUpdate: any = {};
      // const dataRs = await this.RoleRepository.findOne({where: { role_type_id: role_type_id } });
      const query: any = await this.RoleRepository.createQueryBuilder('r');
      query.select(['r.role_type_id AS urole_type_id', 'r.role_role_type_id AS rolerole_type_id']);
      query.where('1=1');
      query.andWhere('r.role_type_id=:role_type_id', { role_type_id: role_type_id });
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      let count: any = await query.getCount();
      let dataRs: any = await query.getRawMany();
      // console.info(dto)
      // return dto
      if (!dataRs) {
        throw new NotFoundException(`Data with role_type_id ${role_type_id} not found`);
        var result: any = {
          statusCode: 200,
          code: 422,
          message: `Data not found Userrole_type_id ${role_type_id}.`,
          message_th: `ไม่พบข้อมูล Userrole_type_id ${role_type_id}.`,
          payload: null,
        };
        return result;
      } else {
        // console.log('role_type_id =>'+role_type_id);  console.log(`count=`); console.info(count);
        // console.log('**************** dataRs =>'+dataRs+'****************');
        // console.info(dataRs);
      }
      if (dto.name) {
        DataUpdate.name = dto.name;
      }
      if (dto.detail) {
        DataUpdate.detail = dto.detail;
      } 
      if (dto.created) {
        DataUpdate.created = dto.created;
      }
      if (dto.updated) {
        DataUpdate.updated = dto.updated;
      }
      if (dto.insert) {
        DataUpdate.insert = dto.insert;
      }
      if (dto.update) {
        DataUpdate.update = dto.update;
      }
      if (dto.delete) {
        DataUpdate.delete = dto.delete;
      }
      if (dto.select) {
        DataUpdate.select = dto.select;
      }
      if (dto.log) {
        DataUpdate.log = dto.log;
      }
      if (dto.config) {
        DataUpdate.config = dto.config;
      }
      if (dto.truncate) {
        DataUpdate.truncate = dto.truncate;
      } 
     console.log('update DataUpdate'); console.info(DataUpdate);
      await this.RoleRepository
        .createQueryBuilder()
        .update(Role)
        .set(DataUpdate)
        .where('role_type_id=:role_type_id', { role_type_id: role_type_id })
        .execute();
      // var result:any ={
      //     statusCode: 200
      //     ,code: 200
      //     ,message: `Update User role_type_id  ${role_type_id} Successful.`
      //     ,message_th: `อัปเดต  Userrole_type_id ${role_type_id} สำเร็จ.`
      //     ,payload:null
      // }
      // return result;
      return 200;
  }
 
}