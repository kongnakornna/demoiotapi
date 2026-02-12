import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Services
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import { RolesService } from '@src/modules/roles/roles.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { UsersService } from '@src/modules/users/users.service';
import { SettingsService } from '@src/modules/settings/settings.service';
import { IotService } from '@src/modules/iot/iot.service';

// Controllers
import { MqttController } from '@src/modules/mqtt/mqtt.controller';

// Modules
import { AuthModule } from '@src/modules/auth/auth.module';

// Entities - จัดกลุ่มให้เรียบร้อย
/**** User & Roles Entities ****/
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';

/**** Settings Entities ****/
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
import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity'; 
const ENV = process.env.NODE_ENV;
console.log('NODE_ENV: '+ENV);
console.log('MQTT_HOST: '+process.env.MQTT_HOST);

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // TypeORM Entities - แก้ไข syntax error
    TypeOrmModule.forFeature([
      // User & Roles
      User, Role, Rolesaccess, SdUserRole, UserFile, SdUserRolesAccess, UserRolePermission,
      
      // Settings
      Setting, Location, Type, Sensor, Group, Mqtt, Api, Device, DeviceType, Email, Host, 
      Influxdb, Line, Nodered, Schedule, Sms, Token, Deviceaction, Deviceactionlog, 
      Deviceactionuser, Devicealarmaction, Telegram, scheduleDevice, alarmDevice, 
      alarmDeviceEvent, scheduleprocesslog, alarmprocesslog, alarmprocesslogtemp, 
      alarmprocesslogemail, alarmprocesslogline, alarmprocesslogsms, 
      alarmprocesslogtelegram, mqtthost, alarmprocesslogmqtt,
      
      // IoT
      aircontrol, airmod, airperiod, airsettingwarning, airwarning, aircontroldevicemap, 
      airmoddevicemap, airperioddevicemap, airsettingwarningdevicemap, airwarningdevicemap, 
      aircontrollog,mqttlog,dashboardConfig
    ]),
    
    // MQTT Client Configuration
    ClientsModule.registerAsync([
      {
        name: 'MQTT_CLIENT',
        useFactory: async () => {
          return {
            transport: Transport.MQTT,
            options: {
              url: process.env.MQTT_HOST || 'mqtt://localhost:1883',
              clientId: `nestjs-client-${Math.random().toString(16).slice(3)}`,
              serializer: {
                serialize: (value: any) => value.data,
              },
            },
          };
        },
      },
    ]),
    
    // ใช้ forwardRef เพื่อป้องกัน circular dependency
    forwardRef(() => AuthModule),
  ],
  
  controllers: [MqttController],
  
  providers: [
    MqttService,
    RolesService,
    AuthService,
    UsersService,
    SettingsService,
    IotService
  ],
  
  exports: [
    MqttService,
    RolesService, 
    UsersService,
    IotService,
    
    // Export TypeORM features ถ้าจำเป็นต้องใช้ใน modules อื่น
    TypeOrmModule.forFeature([
      // เฉพาะ entities ที่จำเป็นจริงๆ
      User, Role, mqtthost, Device, Setting
    ])
  ],
})
export class MqttModule {}