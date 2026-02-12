import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import { Mqtt2Service } from '@src/modules/mqtt2/mqtt2.service';
import { Mqtt3Service } from '@src/modules/mqtt3/mqtt3.service';
import { Mqtt2Controller } from '@src/modules/mqtt2/mqtt2.controller';
// Modules
import { AuthModule } from '@src/modules/auth/auth.module';
import { SettingsService } from '@src/modules/settings/settings.service';
import { IotService } from '@src/modules/iot/iot.service'; 
import { UsersService } from '@src/modules/users/users.service';
/**** Settings Entities ****/
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';

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
import { Telegram } from '@src/modules/settings/entities/telegram.entity';
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
import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity'; 
/**** IoT Entities ****/
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
/****entity****/ 
///////////
@Module({
  imports: [
     TypeOrmModule.forFeature([
          User,SdUserRole,UserFile ,SdUserRolesAccess,
          Role, Rolesaccess,UserRolePermission,
          Setting,
          Location,
          Type,
          Sensor,
          Group,
          Mqtt,
          scheduleDevice, 
          Api,
          Device,
          DeviceType,
          Email,
          Host,
          Influxdb,
          Line,
          Nodered,
          Schedule,
          Sms,
          Token,
          Deviceaction,
          Deviceactionlog,
          Deviceactionuser,
          Devicealarmaction,
          Telegram,
          alarmDevice,
          alarmDeviceEvent,
          scheduleprocesslog,
          alarmprocesslog,
          alarmprocesslogtemp,
          alarmprocesslogemail,
          alarmprocesslogline,
          alarmprocesslogsms,
          alarmprocesslogtelegram,
          alarmprocesslogmqtt,
          mqtthost,
          mqttlog, aircontrol,airmod,airperiod,airsettingwarning,airwarning,aircontroldevicemap,airmoddevicemap,airperioddevicemap,
          airsettingwarningdevicemap,airwarningdevicemap,aircontrollog,mqttlog,dashboardConfig
        ]),
     ConfigModule.forRoot(),
    // MQTT Client Configuration
      ClientsModule.registerAsync([
        {
          name: 'MQTT_CLIENT',
          useFactory: async () => {
            return {
              transport: Transport.MQTT,
              options: {
                url: process.env.MQTT_HOST2 || 'mqtt://broker.mmm.com:1883',
                clientId: `nestjs-client-${Math.random().toString(16).slice(3)}`,
                serializer: {
                  serialize: (value: any) => value.data,
                },
              },
            };
          },
        },
      ]), 
       forwardRef(() => AuthModule),
  ],
  controllers: [Mqtt2Controller],
  providers: [MqttService,Mqtt2Service,Mqtt3Service,IotService,SettingsService,UsersService],
  exports: [MqttService,Mqtt2Service,Mqtt3Service,IotService,SettingsService,UsersService,
      TypeOrmModule.forFeature([
        User,SdUserRole,UserFile ,SdUserRolesAccess,
        Role, Rolesaccess,UserRolePermission,
        Setting,
        Location,
        Type,
        Sensor,
        Group,
        Mqtt,
        scheduleDevice, 
        Api,
        Device,
        DeviceType,
        Email,
        Host,
        Influxdb,
        Line,
        Nodered,
        Schedule,
        Sms,
        Token,
        Deviceaction,
        Deviceactionlog,
        Deviceactionuser,
        Devicealarmaction,
        Telegram,
        alarmDevice,
        alarmDeviceEvent,
        scheduleprocesslog,
        alarmprocesslog,
        alarmprocesslogtemp,
        alarmprocesslogemail,
        alarmprocesslogline,
        alarmprocesslogsms,
        alarmprocesslogtelegram,
        alarmprocesslogmqtt,
        mqtthost,
        mqttlog,
        dashboardConfig
      ]),],
})
export class Mqtt2Module {}
