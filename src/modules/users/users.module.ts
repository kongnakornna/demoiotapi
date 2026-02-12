import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from '@src/modules/users/users.service';
import { UsersController } from '@src/modules/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
/****entity****/
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
/****entity****/
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';

// Notification 
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
import { DeviceSchedule } from '@src/modules/iot/entities/device-schedule.entity'
import { ChannelTemplate } from '@src/modules/iot/entities/channel-template.entity';
import { GroupNotificationConfig } from '@src/modules/iot/entities/sd-group-notification-config.entity'; 
import { AuditLog } from '@src/modules/iot/entities/sd-audit-log.entity';
import { SystemSetting } from '@src/modules/iot/entities/sd-system-setting.entity';
@Module({
  imports: [
     TypeOrmModule.forFeature([
      User,
      SdUserRole, 
      UserFile,
      SdUserRolesAccess,
      UserRolePermission,NotificationType,DeviceCategory,NotificationCondition,NotificationChannel,DeviceNotificationConfig,
                SensorData,NotificationLog ,DeviceStatusHistory,ReportData,DeviceGroup,DeviceGroupMember,DeviceSchedule,ChannelTemplate,
                GroupNotificationConfig,AuditLog,SystemSetting, 
    ]),
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService, 
            TypeOrmModule.forFeature([
              User,
              SdUserRole, 
              UserFile,
              SdUserRolesAccess,
              UserRolePermission,NotificationType,DeviceCategory,NotificationCondition,NotificationChannel,DeviceNotificationConfig,
                SensorData,NotificationLog ,DeviceStatusHistory,ReportData,DeviceGroup,DeviceGroupMember,DeviceSchedule,ChannelTemplate,
                GroupNotificationConfig,AuditLog,SystemSetting, 
            ]) 
        ], // ถ้าต้องการใช้ใน module อื่น
})
export class UsersModule {}
