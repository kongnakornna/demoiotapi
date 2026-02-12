import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import {
  Global,
  Module,
  forwardRef,
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, In, Repository } from 'typeorm';
import { RolesService } from '@src/modules/roles/roles.service';
import { RolesController } from '@src/modules/roles/roles.controller';
import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';

import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';
import { IotService } from '@src/modules/iot/iot.service';
import { UsersService } from '@src/modules/users/users.service';
/****entity****/
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity'; // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
/****entity****/
import { DeviceType } from '@src/modules/settings/entities/devicetype.entity';
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
import { Deviceaction } from '@src/modules/settings/entities/deviceaction.entity';
import { Deviceactionlog } from '@src/modules/settings/entities/deviceactionlog.entity';
import { Deviceactionuser } from '@src/modules/settings/entities/deviceactionuser.entity';
import { Devicealarmaction } from '@src/modules/settings/entities/devivicealarmaction.entity';
import { Telegram } from '@src/modules/settings/entities//telegram.entity';
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
import { alarmDevice } from '@src/modules/settings/entities/alarmdevice.entity';
import { alarmDeviceEvent } from '@src/modules/settings/entities/alarmdeviceevent.entity';
import { scheduleprocesslog } from '@src/modules/settings/entities/scheduleprocesslog.entity';
import { alarmprocesslog } from '@src/modules/settings/entities/alarmprocesslog.entity';
import { alarmprocesslogtemp } from '@src/modules/settings/entities/alarmprocesslogtemp.entity';
import { alarmprocesslogemail } from '@src/modules/settings/entities/alarmprocesslogemail.entity';
import { alarmprocesslogline } from '@src/modules/settings/entities/alarmprocesslogline.entity';
import { alarmprocesslogsms } from '@src/modules/settings/entities/alarmprocesslogsms.entity';
import { alarmprocesslogtelegram } from '@src/modules/settings/entities/alarmprocesslogtelegram.entity';
import { alarmprocesslogmqtt } from '@src/modules/settings/entities/alarmprocesslogmqtt.entity';
import { mqtthost } from '@src/modules/settings/entities/mqtthost.entity';
/****entity****/
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import { Mqtt2Service } from '@src/modules/mqtt2/mqtt2.service';
import { Mqtt3Service } from '@src/modules/mqtt3/mqtt3.service';
import { MqttController } from '@src/modules/mqtt/mqtt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
/****entity****/
import { aircontrol } from '@src/modules/iot/entities/aircontrol.entity';
import { airmod } from '@src/modules/iot/entities/airmod.entity';
import { airperiod } from '@src/modules/iot/entities/airperiod.entity';
import { airsettingwarning } from '@src/modules/iot/entities/airsettingwarning.entity';
import { airwarning } from '@src/modules/iot/entities/airwarning.entity';
import { aircontroldevicemap } from '@src/modules/iot/entities/aircontroldevicemap.entity';
import { airmoddevicemap } from '@src/modules/iot/entities/airmoddevicemap.entity';
import { airperioddevicemap } from '@src/modules/iot/entities/airperioddevicemap.entity';
import { airsettingwarningdevicemap } from '@src/modules/iot/entities/airsettingwarningdevicemap.entity';
import { airwarningdevicemap } from '@src/modules/iot/entities/airwarningdevicemap.entity';
import { aircontrollog } from '@src/modules/iot/entities/aircontrollog.entity';
import { mqttlog } from '@src/modules/iot/entities/mqttlog.entity';
import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity';
// Notification
import { User } from '@src/modules/users/entities/user.entity';
import { NotificationType } from '@src/modules/iot/entities/sd-notification-type.entity';
import { DeviceCategory } from '@src/modules/iot/entities/sd-device-category.entity';
import { NotificationCondition } from '@src/modules/iot/entities/notification-condition.entity';
import { NotificationChannel } from '@src/modules/iot/entities/sd-notification-channel.entity';
import { DeviceNotificationConfig } from '@src/modules/iot/entities/device-notification-config.entity';
import { SensorData } from '@src/modules/iot/entities/sensor-data.entity';
import { NotificationLog } from '@src/modules/iot/entities/notification-log.entity';
import { DeviceStatusHistory } from '@src/modules/iot/entities/device-status-history.entity';
import { ReportData } from '@src/modules/iot/entities/report-data.entity';
import { DeviceGroup } from '@src/modules/iot/entities/device-group.entity';
import { DeviceGroupMember } from '@src/modules/iot/entities/sd-device-group-member.entity';
import { DeviceSchedule } from '@src/modules/iot/entities/device-schedule.entity';
import { ChannelTemplate } from '@src/modules/iot/entities/channel-template.entity';
import { GroupNotificationConfig } from '@src/modules/iot/entities/sd-group-notification-config.entity';
import { ApiKey } from '@src/modules/iot/entities/sd-api-key.entity';
import { AuditLog } from '@src/modules/iot/entities/sd-audit-log.entity';
import { SystemSetting } from '@src/modules/iot/entities/sd-system-setting.entity';
import { DeviceStatus } from '@src/modules/iot/entities/device-status.entity';
import { DeviceConfig } from '@src/modules/iot/entities/device-config.entity';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';
import { ActivityLog } from '@src/modules/iot/entities/activity-log.entity';
import { CommandLog } from '@src/modules/iot/entities/command-log.entity';
import { DeviceAlert } from '@src/modules/iot/entities/device-alert.entity';
/*******entity***********/
/******ENV******/
import * as moment from 'moment-timezone';
import { SettingsService } from '@src/modules/settings/settings.service';
import { Deviceervice } from '@src/modules/iot/device.service';
import { DeviceioService } from '@src/modules/iot/deviceio.service';
import { IotioService } from '@src/modules/iot/iotsocketio.service';

import { IotsocketController } from '@src/modules/iot/iotsocket.controller'; // ไฟล์ที่คุณส่งมาล่าสุด
import { IotsocketGateway } from '@src/modules/iot/iotsocket.gateway';
const ENV = process.env.NODE_ENV;
@Global() // ← ทำให้สามารถใช้ได้ทั่วทั้ง application
@Module({
  imports: [TypeOrmModule.forFeature([IotData, DeviceStatus, ActivityLog])],
  providers: [DeviceioService],
  exports: [IotioService],
})
export class IotGlobalModule {}
