import * as dotenv from 'dotenv';
dotenv.config();
import {
  RequestMethod,
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore, RedisCache } from 'cache-manager-redis-yet';
import { AppService } from '@src/app.service';
import appConfig from '@src/config/app.config';
import { typeOrmAsyncConfig } from '@src/config/db/db';
import { PassportModule } from '@nestjs/passport';
import { TransformInterceptor } from '@root/interceptors/transform.interceptor';
import { RouterModule, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { ENV_CONSTANTS } from '@root/env.constants';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from '@src/app.controller';
/*******entity***********/
import { User } from '@src/modules/users/entities/user.entity';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { DeviceStatus } from '@src/modules/iot/entities/device-status.entity';
import { DeviceConfig } from '@src/modules/iot/entities/device-config.entity';
import { IotData } from '@src/modules/iot/entities/iot-data.entity';
import { ActivityLog } from '@src/modules/iot/entities/activity-log.entity';
import { CommandLog } from '@src/modules/iot/entities/command-log.entity';
import { DeviceAlert } from '@src/modules/iot/entities/device-alert.entity';
/*******entity***********/
import { UserAuthModel } from '@src/modules/users/dto/user-auth.dto';
import { RedisModule } from '@src/modules/redis/redis.module';
import { SharedModule } from '@src/modules/shared/shared.module';
import { IotModule } from '@src/modules/iot/iot.module';
import { DashboardModule } from '@src/modules/dashboard/dashboard.module';
import { AppsModule } from '@src/modules/apps/apps.module';
import { ProjectModule } from '@src/modules/project/project.module';
import { EventsModule } from '@src/modules/events/events.module';
import { CategoriesModule } from '@src/modules/categories/categories.module';
import { UpcommingeventsModule } from '@src/modules/upcommingevents/upcommingevents.module';
import { ChatModule } from '@src/modules/chat/chat.module';
import { TodoModule } from '@src/modules/todo/todo.module';
import { TicketModule } from '@src/modules/ticket/ticket.module';
import { ApiKeyModule } from '@src/modules/api-key/api-key.module';
import { TimelineModule } from '@src/modules/timeline/timeline.module';
import { MonitoringModule } from '@src/modules/monitoring/monitoring.module';
import { MapsModule } from '@src/modules/maps/maps.module';
import { SettingsModule } from '@src/modules/settings/settings.module';
import { ChartModule } from '@src/modules/chart/chart.module';
import { CrmModule } from '@src/modules/crm/crm.module';
import { HardwareModule } from '@src/modules/hardware/hardware.module';
import { OrderModule } from '@src/modules/order/order.module';
import { PackageModule } from '@src/modules/package/package.module';
import { ServicesModule } from '@src/modules/services/services.module';
import { MaModule } from '@src/modules/ma/ma.module';
import { InvoiceModule } from '@src/modules/invoice/invoice.module';
import { EmployeeModule } from '@src/modules/employee/employee.module';
import { PartnerModule } from '@src/modules/partner/partner.module';
import { ManualModule } from '@src/modules/manual/manual.module';
import { TeamModule } from '@src/modules/team/team.module';
import { ReportModule } from '@src/modules/report/report.module';
import { AccountModule } from '@src/modules/account/account.module';
import { HrModule } from '@src/modules/hr/hr.module';
import { RolesModule } from '@src/modules/roles/roles.module';
import { SensorModule } from '@src/modules/sensor/sensor.module';
import { AccessmenuModule } from '@src/modules/accessmenu/accessmenu.module';
import { IotalarmModule } from '@src/modules/iotalarm/iotalarm.module';
import { CalendarModule } from '@src/modules/calendar/calendar.module';
import { GeoModule } from '@src/modules/geo/geo.module';
import { LocationModule } from '@src/modules/location/location.module';
import { SnmpModule } from '@src/modules/snmp/snmp.module';
import { AiModule } from '@src/modules/ai/ai.module';
import { TaskModule } from '@src/modules/task/task.module';
import { SyslogModule } from '@src/modules/syslog/syslog.module';
import { OsModule } from '@src/modules/os/os.module';
import { MqttModule } from '@src/modules/mqtt/mqtt.module';
import { Mqtt2Module } from '@src/modules/mqtt2/mqtt2.module';
import { Mqtt3Module } from '@src/modules/mqtt3/mqtt3.module'; 
import { mqtt4Module } from '@src/modules/mqtt4/mqtt4.module'; 
/******sqlite******/
const ENV = process.env.NODE_ENV;
//console.log('NODE_ENV: '+ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([User, AccessMenu]),
    // ใช้ forwardRef สำหรับโมดูลที่อาจมี circular dependency
    forwardRef(() => AuthModule),
    forwardRef(() => RedisModule),
    forwardRef(() => SharedModule),
    ConfigModule.forRoot({
      load: [appConfig],
      cache: true,
      envFilePath: [process.env.ENV_FILE, '.env.development'],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({}),
    }),
    // Group 1: Basic modules
    forwardRef(() => IotModule),
    forwardRef(() => DashboardModule),
    forwardRef(() => AppsModule),
    // Group 2: Project & Events
    forwardRef(() => ProjectModule),
    forwardRef(() => EventsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => UpcommingeventsModule),
    // Group 3: Communication
    forwardRef(() => ChatModule),
    forwardRef(() => TodoModule),
    forwardRef(() => TicketModule),
    // Group 4: System modules
    forwardRef(() => ApiKeyModule),
    forwardRef(() => TimelineModule),
    forwardRef(() => MonitoringModule),
    forwardRef(() => MapsModule),
    forwardRef(() => SettingsModule),
    forwardRef(() => SyslogModule),
    // Group 5: Business modules
    forwardRef(() => ChartModule),
    forwardRef(() => CrmModule),
    forwardRef(() => HardwareModule),
    forwardRef(() => OrderModule),
    forwardRef(() => PackageModule),
    forwardRef(() => ServicesModule),
    // Group 6: Management modules
    forwardRef(() => MaModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => PartnerModule),
    forwardRef(() => ManualModule),
    forwardRef(() => TeamModule),
    forwardRef(() => ReportModule),
    // Group 7: HR & Account
    forwardRef(() => AccountModule),
    forwardRef(() => HrModule),
    forwardRef(() => RolesModule),
    // Group 8: Technical modules
    forwardRef(() => SensorModule),
    forwardRef(() => IotalarmModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => GeoModule),
    forwardRef(() => LocationModule),
    forwardRef(() => SnmpModule),
    // Group 9: Advanced modules
    forwardRef(() => AiModule),
    forwardRef(() => TaskModule),
    forwardRef(() => OsModule),
    // V2  Error
    forwardRef(() => MqttModule),
    forwardRef(() => Mqtt2Module),
    forwardRef(() => Mqtt3Module),  
    forwardRef(() => mqtt4Module), 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthGuard,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  exports: [AppService, AuthGuard, JwtService],
})
export class AppModule {}