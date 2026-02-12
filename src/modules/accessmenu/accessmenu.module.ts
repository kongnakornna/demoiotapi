import { forwardRef, Module } from '@nestjs/common';
import { AccessmenuService } from '@src/modules/accessmenu/accessmenu.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { UsersService } from '@src/modules/users/users.service';
/************/
import { AccessmenuController } from '@src/modules/accessmenu/accessmenu.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from '@src/modules/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
/*******entity***********/
import { User } from '@src/modules/users/entities/user.entity';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { Useraccessmenu } from '@src/modules/accessmenu/entities/useraccessmenu.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   // เพิ่มบรรทัดนี้
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
/****entity****/
/*******entity***********/
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@src/modules/auth/auth.module';
@Module({
  imports: [
    /*******entity***********/
    TypeOrmModule.forFeature([User, 
      AccessMenu, 
      Useraccessmenu, 
      SdUserRole, // เพิ่ม entity นี้
      UserFile,
      SdUserRolesAccess,
      UserRolePermission,
    ]),
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AccessmenuController],
  providers: [AccessmenuService, UsersService, AuthService],
  exports: [AccessmenuService],
})
export class AccessmenuModule {}
