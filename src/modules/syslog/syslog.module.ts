import { forwardRef, Module } from '@nestjs/common';
import { SyslogService } from '@src/modules/syslog/syslog.service';
import { SyslogController } from '@src/modules/syslog/syslog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from '@src/modules/roles/roles.service';
import { RolesController } from '@src/modules/roles/roles.controller';
import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '@src/modules/users/users.service';
import { UsersController } from '@src/modules/users/users.controller';
/****entity****/
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
import { DeviceLog } from '@src/modules/syslog/entities/devicelog.entity';
import { UserLog } from '@src/modules/syslog/entities/userlog.entity';
import { UserLogtype } from '@src/modules/syslog/entities/userlogtype.entity';    
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';
/****entity****/
@Module({ 
  imports: [
     TypeOrmModule.forFeature([DeviceLog,
                User, 
                UserLog,
                UserLogtype,
                Role,  
                Rolesaccess,
                User,
                SdUserRole,  
                UserFile,
                SdUserRolesAccess,
                UserRolePermission,Setting, Location, Type, Sensor, Group, Mqtt,
    ]), 
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SyslogController],
  providers: [SyslogService,RolesService, AuthService,UsersService, AuthService],
  exports: [RolesService, UsersService, 
              TypeOrmModule.forFeature([DeviceLog,
                User, 
                UserLog,
                UserLogtype,
                Role,  
                Rolesaccess,
                User,
                SdUserRole,  
                UserFile,
                SdUserRolesAccess,
                UserRolePermission,Setting, Location, Type, Sensor, Group, Mqtt,
              ]) 
          ], // ถ้าต้องการใช้ใน module อื่น
})
export class SyslogModule {}
