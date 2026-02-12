import { forwardRef, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettingsService } from '@src/modules/settings/settings.service';
import { SettingsController } from '@src/modules/settings/settings.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule,getRepositoryToken  } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { UsersService } from '@src/modules/users/users.service';
import { UsersController } from '@src/modules/users/users.controller';
/****entity****/
import { DeviceType } from '@src/modules/settings/entities/devicetype.entity';
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
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
import { mqttlog } from '@src/modules/iot/entities/mqttlog.entity';
import { dashboardConfig } from '@src/modules/settings/entities/dashboard-config.entity';
/****entity****/
import { CreateDashboardConfigDto, UpdateDashboardConfigDto } from '@src/modules/settings/dto/dashboardConfig.dto';

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
 
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from '@src/modules/mqtt/mqtt.service'; 
import { Mqtt2Service } from '@src/modules/mqtt2/mqtt2.service';
import { Mqtt3Service } from '@src/modules/mqtt3/mqtt3.service';

import { IotService } from '@src/modules/iot/iot.service';
const logger = new Logger('SettingsModule');
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
const fs = require('fs');
var filePath = join(__dirname, 'public', 'emailConfigs.json');
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
      mqttlog, aircontrol,airmod,airperiod,airsettingwarning,airwarning,aircontroldevicemap,airmoddevicemap,airperioddevicemap,
      airsettingwarningdevicemap,airwarningdevicemap,aircontrollog,mqttlog,dashboardConfig
    ]),
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    MailerModule.forRootAsync({
      imports: [TypeOrmModule.forFeature([Email])],
      inject: [getRepositoryToken(Email)],
      useFactory: async (emailRepo: Repository<Email>) => {
        try {
          const emailConfig = await emailRepo.findOneBy({ status: 1 });
          var setup :number=Number(2); 
          const host:any = emailConfig?.host || process.env.SMTP_HOST;
          const port:number=  Number(emailConfig?.port) || Number(process.env.SMTP_PORT);
          const username :any = emailConfig?.username || process.env.SMTP_USER ;
          const password :any =  emailConfig?.password || process.env.SMTP_PASS;
          const secure :any =  process.env.SMTP_SECURE !== 'false'; // default true
          console.log('Email configuration:', { 
            source: emailConfig ? 'database' : 'environment', 
            host, 
            port 
          });
          if(setup==1){
                return {
                  transport: { 
                            host: '192.168.1.52',
                            port: Number(587),
                            secure: false, 
                            auth: {
                              user: 'demo',
                              pass: 'demo@123',
                            },
                    connectionTimeout: 60000,
                    greetingTimeout: 30000,
                    socketTimeout: 45000,
                    debug: true,
                    logger: true,
                    tls: {
                      rejectUnauthorized: false
                    }
                  },
                  defaults: {
                    from: `"No Reply" <Icmon>`,
                  },
                  verifyTransporters: false,
                };
          }else{
              // Database ------------
                return {
                  transport: {
                    host,
                    port,
                    secure,
                    auth: {
                      user: username,
                      pass: password,
                    },
                    connectionTimeout: 60000,
                    greetingTimeout: 30000,
                    socketTimeout: 45000,
                    debug: true,
                    logger: true,
                    tls: {
                      rejectUnauthorized: false
                    }
                  },
                  defaults: {
                    from: `"No Reply " <${username}>`,
                  },
                  verifyTransporters: false,
                };
            //------------------------
          }
        } catch (err) {
          console.error('Mailer configuration error, using fallback:', err);
          
          // Fallback to direct configuration
              // Fix data---------------
                return {
                  transport: { 
                            host: '102.19.16.12',
                            port: Number(587),
                            secure: false, 
                            auth: {
                              user: 'demo',
                              pass: 'demo@123',
                            },
                    connectionTimeout: 60000,
                    greetingTimeout: 30000,
                    socketTimeout: 45000,
                    debug: true,
                    logger: true,
                    tls: {
                      rejectUnauthorized: false
                    }
                  },
                  defaults: {
                    from: `"No Reply" <Icmon>`,
                  },
                  verifyTransporters: false,
                };
            //------------------------
        }
      },
    }),
  ],  
  controllers: [SettingsController],
  providers: [SettingsService, UsersService, AuthService, MqttService,Mqtt2Service,Mqtt3Service,IotService],
  exports: [
    UsersService,
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
      mqttlog,
      dashboardConfig
    ]),
  ],
})
export class SettingsModule {}