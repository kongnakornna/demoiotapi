import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
/****entity****/
import { DeviceLog } from '@src/modules/syslog/entities/devicelog.entity';
import { UserLog } from '@src/modules/syslog/entities/userlog.entity';
import { UserLogtype } from '@src/modules/syslog/entities/userlogtype.entity';    
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
 /******** dto ****************/
import { CreateSyslogDto } from '@src/modules/syslog/dto/create-syslog.dto';
import { UpdateSyslogDto } from '@src/modules/syslog/dto/update-syslog.dto';
/******** service ****************/
import { AuthService } from '@src/modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
/******** service ****************/
import {
  getCurrentDateTimeForSQL,
  convertSortInput,
} from '@helpers/format.helper';
var moment = require('moment');
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SyslogService {
  private readonly logger = new Logger(SyslogService.name);
  constructor(
      @InjectRepository(Setting)private SettingRepository: Repository<Setting>,
      @InjectRepository(Location)private LocationRepository: Repository<Location>,
      @InjectRepository(Type)private TypeRepository: Repository<Type>,
      @InjectRepository(Sensor) private SensorRepository: Repository<Sensor>,
      @InjectRepository(Group) private GroupRepository: Repository<Group>,
      @InjectRepository(Mqtt)  private MqttRepository: Repository<Mqtt>,
      @InjectRepository(DeviceLog) private DeviceLogRepository: Repository<DeviceLog>,
      @InjectRepository(UserLog) private UserLogRepository: Repository<UserLog>,
      @InjectRepository(UserLogtype) private UserLogtypeRepository: Repository<UserLogtype>,
      @InjectRepository(User) private userRepository: Repository<User>,
      // @InjectRepository(SdUserRole) private userroleRepository: Repository<SdUserRole>,
      // @InjectRepository(UserFile)  private userfileRepository: Repository<UserFile>,
        @InjectRepository(SdUserRolesAccess)  private aduserRolesAccessRepository: Repository<SdUserRolesAccess>,
      // @InjectRepository(UserRolePermission)  private userRolePermissionRepository: Repository<UserRolePermission>,
  ) {}

  async loglistpaginate(dto: any): Promise<UserLog> {
    console.log(`getProfile dto=`);
    console.info(dto);
    try {
      var idx: string = dto.idx || '';
      var uid: string = dto.uid || '';
      var keyword: any = dto.keyword || '';
      var status: any = dto.status;
      var select_status: any = dto.select_status;
      var insert_status: any = dto.insert_status;
      var update_status: any = dto.update_status;
      var delete_status: any = dto.delete_status;
      var log_type_id: any = dto.log_type_id;
      var sort: string = dto.sort;
      var page: number = dto.page || 1;
      var pageSize: number = dto.pageSize || 10;
      var isCount: number = dto.isCount || 0;
      const query: any = await this.UserLogRepository.createQueryBuilder('l');
      if (isCount == 1) {
       // var countRs: number = await query.getCount();
        var countRs: number = await query.select('COUNT(DISTINCT l.id)', 'cnt');
      } else {
        query.select([
          'l.id AS id', 
          'l.log_type_id AS log_type_id',
          'l.uid AS uid',
          'l.name AS log_name',
          'l.detail AS detail',
          'l.select_status AS select_status',
          'l.insert_status AS insert_status',
          'l.update_status AS update_status',
          'l.delete_status AS delete_status',
          'l.status AS status',
          'l.create AS create',
          'l.update AS update', 
          'l.lang AS lang',
          'u.username AS username',
          'u.firstname AS firstname',
          't.type_name AS type_name',
        ]);
      }
      query.leftJoin(
                        "sd_user",
                        "u",
                        "l.uid = u.id"
                    ); 
      query.leftJoin(
                        "sd_user_log_type",
                        "t",
                        "l.log_type_id = t.log_type_id"
                    ); 
      query.where('1=1');
      if (keyword) {
        query.andWhere('l.name like :name', {
          name: keyword ? `%${keyword}%` : '%',
        });
      }
      if (idx) {
        query.andWhere('l.id=:id', { id: idx });
      }
      if (uid) {
        query.andWhere('l.uid=:uid', { uid: uid });
      }
      if (status) {
        query.andWhere('l.status=:status', { status: status });
      }
      if (select_status) {
        query.andWhere('l.select_status=:select_status', { select_status: select_status });
      }
      if (insert_status) {
        query.andWhere('l.insert_status=:insert_status', { insert_status: insert_status });
      }
      if (update_status) {
        query.andWhere('l.update_status=:update_status', { update_status: update_status });
      }
      if (delete_status) {
        query.andWhere('l.delete_status=:delete_status', { delete_status: delete_status });
      }
      if (log_type_id) {
        query.andWhere('l.log_type_id=:log_type_id', { log_type_id: log_type_id });
      }
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      if (isCount == 1) {
        // let tempCounts:any = {};
        // tempCounts.count = countRs;
        // return tempCounts.count;
        var count: any = await query.getCount();
        let tempCounts: any = {};
        tempCounts.count = countRs;
        console.log(`count =>` + count);
        console.log(`tempCounts.count =>` + tempCounts.count);
        return count;
      } else {
        // Sorting logic
        if (sort) {
          const sortResult = convertSortInput(sort);
          if (sortResult === false) {
            throw new BadRequestException(`Invalid sort option.`);
          }
          const { sortField, sortOrder } = sortResult;
          
          console.log(`sort=`);
          console.info(sort);
          console.log(`sortField=`+sortField);
          console.log(`sortOrder=`+sortOrder);
          console.log(`sortResult=`);
          console.info(sortResult); 
          if(sortOrder=='ASC' || sortOrder=='asc'){
            var sortOrders:any ='ASC';
          }else if(sortOrder=='DESC' || sortOrder=='desc'){
            var sortOrders:any ='DESC';
          }else{
            var sortOrders:any ='ASC';
          }
          query.orderBy(
            `l.${sortField}`,
            sortOrders.toLowerCase(),
          );
        } else {
          // Default sorting
          query.orderBy(`l.id `, 'ASC');
        }
        query.limit(pageSize);
        query.offset(pageSize * (page - 1));
        return await query.getRawMany();
      }
    } catch (error) {
      var error1: any = JSON.stringify(error);
      var error2: any = JSON.parse(error1);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          //args: { errorMessage: JSON.stringify(error) },
          args: { errorMessage: error2 },
        },
      });
    }
  }

  async getlisttype(): Promise<UserLogtype> {
    console.log(`getlisttype=`);
    try { 
      const query: any = await this.UserLogtypeRepository.createQueryBuilder('t');
      query.select(['t.*']); 
      query.where('1=1');
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      let count:any = await query.getCount();
      let rs: any = await query.getRawMany();
      console.info(query);
      console.log(`Counts=`, count);
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

  async createlog(dto: any): Promise<UserLog> {
      // console.log('create userlog');console.info(dto);   
      const result: any = await this.UserLogRepository.save(
        this.UserLogRepository.create(dto),
      );
      return result;
  }

  async createlogtype(dto: any): Promise<UserLogtype> {
      // console.log('create userlog');console.info(dto);   
      const result: any = await this.UserLogtypeRepository.save(
        this.UserLogtypeRepository.create(dto),
      );
      return result;
  }

  async getUserLog(id: number): Promise<UserLog> {
    try {
      const UserLog = await this.UserLogRepository.findOne({
        where: {
          id,
        },
      });
      //console.log('getUser=>');console.info(user);
      return UserLog;
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

  async getlogtype(type_name: any): Promise<UserLog> {
    try {
      const rs:any = await this.UserLogtypeRepository.findOne({
        where: {
          type_name,
        },
      });
      //console.log('getUser=>');console.info(user);
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

  async deleteLog(id: any): Promise<void> {
    try {
      this.logger.log(`Deleting getUserLog with Id: ${id}`);
      const user = await this.getUserLog(id);
      if (!user) {
        throw new NotFoundException(`getUserLog with id ${id} not found`);
      }

      await this.UserLogRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error while deleting getUserLog = ${error}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: error.message,
        },
      });
    }
  }

  async updatelogtype(dto) {
      // const idx:any = JSON.parse(dto.id);
      let log_type_id = dto.log_type_id;
      const DataUpdate: any = {};
      const query: any = await this.UserLogtypeRepository.createQueryBuilder('t');
      query.select(['t.log_type_id AS log_type_id', 't.type_name AS type_name']);
      query.where('1=1');
      query.andWhere('t.log_type_id=:log_type_id', { log_type_id: log_type_id });
      query.printSql();
      query.maxExecutionTime(10000);
      query.getSql();
      var count: any = await query.getCount();
      var dataRs: any = await query.getRawMany();
      // console.info(dto)
      // return dto
      if (!dataRs) {
        throw new NotFoundException(`Data with ID ${log_type_id} not found`);
        var result: any = {
            statusCode: 200,
            code: 422,
            message: `Data not found UserID ${log_type_id}.`,
            message_th: `ไม่พบข้อมูล UserID ${log_type_id}.`,
            payload: null,
          };
        return result;
      } else {
        // console.log('idx =>'+idx);  console.log(`count=`); console.info(count);
        // console.log('**************** dataRs =>'+dataRs+'****************');
        // console.info(dataRs);
      }
      if (dto.type_name) {
        DataUpdate.type_name = dto.type_name;
      }
      if (dto.type_detail) {
        DataUpdate.type_detail = dto.type_detail;
      }
      if (dto.status) {
        DataUpdate.status = dto.status;
      }  
     console.log('update DataUpdate'); console.info(DataUpdate);
      await this.UserLogtypeRepository
        .createQueryBuilder()
        .update(UserLogtype)
        .set(DataUpdate)
        .where('log_type_id=:log_type_id', { log_type_id: log_type_id })
        .execute();
      return 200;
  }
}