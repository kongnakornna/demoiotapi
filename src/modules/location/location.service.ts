import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { IS_RFC_3339, validate } from 'class-validator';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  In,
  Repository,
  EntityManager,
  DataSource,
  QueryRunner,
  QueryFailedError,
} from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
/******** entity *****************/ 
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { DeviceType } from '@src/modules/settings/entities/devicetype.entity';
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
import { Api } from '@src/modules/settings/entities/api.entity';
import { Device } from '@src/modules/settings/entities/device.entity';
import { Email } from '@src/modules/settings/entities/email.entity';
import { Host } from '@src/modules/settings/entities/host.entity';
import { Influxdb } from '@src/modules/settings/entities/influxdb.entity';
import { Line } from '@src/modules/settings/entities/line.entity';
import { Nodered } from '@src/modules/settings/entities/nodered.entity';
import { Schedule } from '@src/modules/settings/entities/schedule.entity';
import { Sms } from '@src/modules/settings/entities/sms.entity';
import { Token } from '@src/modules/settings/entities/token.entity';
import { scheduleDevice } from '@src/modules/settings/entities/scheduledevice.entity';
import { Deviceaction } from '@src/modules/settings/entities/deviceaction.entity';
import { Deviceactionlog } from '@src/modules/settings/entities/deviceactionlog.entity';
import { Deviceactionuser } from '@src/modules/settings/entities/deviceactionuser.entity';
import { Devicealarmaction } from '@src/modules/settings/entities/devivicealarmaction.entity';
import { Telegram } from '@src/modules/settings/entities/telegram.entity';
import { alarmDevice } from '@src/modules/settings/entities/alarmdevice.entity';
import { alarmDeviceEvent } from '@src/modules/settings/entities/alarmdeviceevent.entity';
import { scheduleprocesslog } from '@src/modules/settings/entities/scheduleprocesslog.entity';
import { alarmprocesslog } from '@src/modules/settings/entities/alarmprocesslog.entity';
import { alarmprocesslogtemp } from '@src/modules/settings/entities/alarmprocesslogtemp.entity';
import { alarmprocesslogmqtt } from '@src/modules/settings/entities/alarmprocesslogmqtt.entity';
import { alarmprocesslogemail } from '@src/modules/settings/entities/alarmprocesslogemail.entity';
import { alarmprocesslogline } from '@src/modules/settings/entities/alarmprocesslogline.entity';
import { alarmprocesslogsms } from '@src/modules/settings/entities/alarmprocesslogsms.entity';
import { alarmprocesslogtelegram } from '@src/modules/settings/entities/alarmprocesslogtelegram.entity';
import { mqtthost } from '@src/modules/settings/entities/mqtthost.entity';
import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity';
/****entity****/
import {
  getCurrentDateTimeForSQL,
  convertSortInput,
} from '@helpers/format.helper';
var moment = require('moment');
var md5 = require('md5');
import 'dotenv/config';
import { firstValueFrom } from 'rxjs';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
const tz = require('moment-timezone');
var Cache = new CacheDataOne();
var md5V1 = require('md5');
import md5 from 'md5';
import { connect, MqttClient } from 'mqtt'; // <-- ใช้ 'mqtt' โดยตรง
import { Subject } from 'rxjs';
import { filter, first, timeout, map } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
/******** service ****************/
@Injectable()
export class LocationService { 
  private readonly logger = new Logger(LocationService.name);
  private latestData = new Map<string, any>();
  private mqttClient: MqttClient;
  private messageStream = new Subject<{ topic: string; payload: Buffer }>();
  constructor(
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    @InjectRepository(dashboardConfig)
    private readonly dashboardConfigRepository: Repository<dashboardConfig>, 
    @InjectRepository(Location) 
    private LocationRepository: Repository<Location>,
    @InjectRepository(Type) private TypeRepository: Repository<Type>,
    @InjectRepository(Sensor) private SensorRepository: Repository<Sensor>,
    @InjectRepository(Group) private GroupRepository: Repository<Group>,
    @InjectRepository(Mqtt) private MqttRepository: Repository<Mqtt>,
    @InjectRepository(Api) private ApiRepository: Repository<Api>,
    @InjectRepository(DeviceType)
    private DeviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(Device) private DeviceRepository: Repository<Device>,
    @InjectRepository(Email) private EmailRepository: Repository<Email>,
    @InjectRepository(Host) private HostRepository: Repository<Host>,
    @InjectRepository(Influxdb)
    private InfluxdbRepository: Repository<Influxdb>,
    @InjectRepository(Line) private LineRepository: Repository<Line>,
    @InjectRepository(Nodered) private NoderedRepository: Repository<Nodered>,
    @InjectRepository(Schedule)
    private ScheduleRepository: Repository<Schedule>,
    @InjectRepository(Sms) private SmsRepository: Repository<Sms>,
    @InjectRepository(Token) private TokenRepository: Repository<Token>,
    @InjectRepository(scheduleDevice)
    private scheduleDeviceRepository: Repository<scheduleDevice>,
    @InjectRepository(Deviceaction)
    private DeviceactionRepository: Repository<Deviceaction>,
    @InjectRepository(Deviceactionlog)
    private DeviceactionlogRepository: Repository<Deviceactionlog>,
    @InjectRepository(Deviceactionuser)
    private DeviceactionuserRepository: Repository<Deviceactionuser>,
    @InjectRepository(Devicealarmaction)
    private DevicealarmactionRepository: Repository<Devicealarmaction>,
    @InjectRepository(Telegram)
    private TelegramRepository: Repository<Telegram>,
    @InjectRepository(alarmDevice)
    private alarmDeviceRepository: Repository<alarmDevice>,
    @InjectRepository(alarmDeviceEvent)
    private alarmDeviceEventRepository: Repository<alarmDeviceEvent>,
    @InjectRepository(scheduleprocesslog)
    private scheduleprocesslogRepository: Repository<scheduleprocesslog>,
    @InjectRepository(alarmprocesslog)
    private alarmprocesslogRepository: Repository<alarmprocesslog>,
    @InjectRepository(alarmprocesslogtemp)
    private alarmprocesslogtempRepository: Repository<alarmprocesslogtemp>,
    @InjectRepository(alarmprocesslogmqtt)
    private alarmprocesslogmqttRepository: Repository<alarmprocesslogmqtt>,
    @InjectRepository(alarmprocesslogemail)
    private alarmprocesslogemailRepository: Repository<alarmprocesslogemail>,
    @InjectRepository(alarmprocesslogline)
    private alarmprocessloglineRepository: Repository<alarmprocesslogline>,
    @InjectRepository(alarmprocesslogsms)
    private alarmprocesslogsmsRepository: Repository<alarmprocesslogsms>,
    @InjectRepository(alarmprocesslogtelegram)
    private alarmprocesslogtelegramRepository: Repository<alarmprocesslogtelegram>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SdUserRole)
    private SdUserRoleRepository: Repository<SdUserRole>,
    @InjectRepository(SdUserRolesAccess)
    private SdUserRolesAccessRepository: Repository<SdUserRolesAccess>,
    @InjectRepository(UserRolePermission)
    private UserRolePermissionRepository: Repository<UserRolePermission>,
    @InjectRepository(mqtthost)
    private mqtthostRepository: Repository<mqtthost>,
  ) {}
  /********Location**********/
  async maxid_Location(): Promise<Location> {
    try {
      const RS: any = await this.LocationRepository.query(
        'SELECT MAX(location_id) AS location_id FROM sd_iot_location',
      );
      console.log('location_id');
      console.info(RS);
      var location_id: any = RS['0'].location_id;
      console.log('maxlocation_id=');
      console.info(location_id);
      var location_ids: any = location_id + 1;
      console.log('maxlocation_id=');
      console.info(location_ids);
      return location_ids;
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
  async create_location(dto: any): Promise<Location> {
    // console.log('create userlog');console.info(dto);
    const result: any = await this.LocationRepository.save(
      this.LocationRepository.create(dto),
    );
    return result;
  }
  async delete_location(location_id: any): Promise<void> {
    try {
      this.logger.log(
        `Deleting sd_iot_location with location_id: ${location_id}`,
      );
      const const_location = await this.get_location(location_id);
      if (!const_location) {
        throw new NotFoundException(
          `sd_iot_location with location_id ${location_id} not found`,
        );
      }

      await this.LocationRepository.delete(location_id);
    } catch (error) {
      this.logger.error(`Error while deleting sd_iot_location = ${error}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: error.message,
        },
      });
    }
  }
  async get_location(location_id: any): Promise<Location> {
    try {
      const rs: any = await this.LocationRepository.findOne({
        where: {
          location_id,
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
  async get_location_ip(ipaddress: any): Promise<Location> {
    try {
      const rs: any = await this.LocationRepository.findOne({
        where: {
          ipaddress,
        },
      });
      console.log('===ipaddress===');
      console.log('rs=>');
      console.info(rs);
      return rs;
    } catch {
      return null;
    }
  }
  async update_location(dto) {
    // const location_idx:any = JSON.parse(dto.location_id);
    let location_id = dto.location_id;
    const DataUpdate: any = {};
    const query: any = await this.LocationRepository.createQueryBuilder('l');
    query.select(['l.location_id AS location_id']);
    query.where('1=1');
    query.andWhere('l.location_id=:location_id', { location_id: location_id });
    query.printSql();
    query.maxExecutionTime(10000);
    query.getSql();
    //var count: any = await query.getCount();
    var dataRs: any = await query.getRawMany();
    // console.info(dto)
    // return dto
    if (!dataRs) {
      throw new NotFoundException(
        `Data with location_id ${location_id} not found`,
      );
      var result: any = {
        statusCode: 200,
        code: 422,
        message: `Data not found sd_iot_locationlocation_id ${location_id}.`,
        message_th: `ไม่พบข้อมูล sd_iot_locationlocation_id ${location_id}.`,
        payload: null,
      };
      return result;
    } else {
      // console.log('location_idx =>'+location_idx);  console.log(`count=`); console.info(count);
      // console.log('**************** dataRs =>'+dataRs+'****************');
      // console.info(dataRs);
    }
    if (dto.location_name) {
      DataUpdate.location_name = dto.location_name;
    }
    if (dto.ipaddress) {
      DataUpdate.ipaddress = dto.ipaddress;
    }
    if (dto.location_detail) {
      DataUpdate.location_detail = dto.location_detail;
    }
    if (dto.configdata) {
      DataUpdate.configdata = dto.configdata;
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    const updateddate = moment(new Date(), DATE_TIME_FORMAT);
    DataUpdate.updateddate = Date();
    console.log('update DataUpdate');
    console.info(DataUpdate);
    await this.LocationRepository.createQueryBuilder()
      .update('sd_iot_location')
      .set(DataUpdate)
      .where('location_id=:location_id', { location_id: location_id })
      .execute();
    return 200;
  }
  /********location_list**********/

  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
