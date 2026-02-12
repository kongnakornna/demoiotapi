 import { forwardRef, Module } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
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
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';

/****entity****/
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
import { AuthService } from '@src/modules/auth/auth.service';


import { SchedulesService } from '@src/modules/schedules/schedules.service';
import { SchedulesController } from '@src/modules/schedules/schedules.controller';

@Module({
  imports: [
     TypeOrmModule.forFeature([Setting, Location, Type, Sensor, Group, Mqtt,
      User,
      SdUserRole, 
      UserFile,
      SdUserRolesAccess,
      UserRolePermission,
    ]),
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ], 
  controllers: [SchedulesController],
  providers: [SchedulesService,UsersService, AuthService], 
  exports: [UsersService, 
            TypeOrmModule.forFeature([Setting, Location, Type, Sensor, Group, Mqtt,
              User,
              SdUserRole,
              UserFile,
              SdUserRolesAccess,
              UserRolePermission,
            ]) 
        ], // ถ้าต้องการใช้ใน module อื่น
})
export class SchedulesModule {}
