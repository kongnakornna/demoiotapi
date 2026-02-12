import { Module } from '@nestjs/common';
import { LocationService } from '@src/modules/location/location.service';
import { SettingsService } from '@src/modules/settings/settings.service';
import { LocationController } from '@src/modules/location/location.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule,getRepositoryToken  } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
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
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from '@src/modules/mqtt/mqtt.service'; 
import { Mqtt2Service } from '@src/modules/mqtt2/mqtt2.service';
import { Mqtt3Service } from '@src/modules/mqtt3/mqtt3.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Setting,
        Location,
        Type,
        Sensor,
        Group,
        Mqtt,
        scheduleDevice,
        User,
        SdUserRole,
        UserFile,
        SdUserRolesAccess,
        UserRolePermission,
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
        dashboardConfig
      ]),
      ClientsModule.registerAsync([
          {
            name: 'MQTT_CLIENT',
            imports: [TypeOrmModule.forFeature([mqtthost])],
            inject: [getRepositoryToken(mqtthost)],
            useFactory: async (mqtthostRepo: Repository<mqtthost>) => {
              const mqtthostConfig = await mqtthostRepo.findOne({ where: { status: 1 } });
              if (!mqtthostConfig) {
                throw new Error('MQTT host config not found in database');
              }
              return {
                transport: Transport.MQTT,
                options: {  
                  //url: process.env.MQTT_HOST || mqtthostConfig.host,
                  url: mqtthostConfig.host || process.env.MQTT_HOST,
                  clientId: `nestjs-client-${Math.random().toString(16).slice(3)}`,
                  serializer: {
                    serialize: (value: any) => value.data,
                  },
                },
              };
            },
          },
        ]),  
  ],   
  controllers: [LocationController], 
  providers: [
    LocationService,
    SettingsService
  ],
  exports: [ 
      TypeOrmModule.forFeature([
        Setting,
        Location,
        Type,
        Sensor,
        Group,
        Mqtt,
        scheduleDevice,
        User,
        SdUserRole,
        UserFile,
        SdUserRolesAccess,
        UserRolePermission,
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
        dashboardConfig
      ]),
  ],
})
export class LocationModule {}
