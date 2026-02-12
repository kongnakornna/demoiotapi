import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from '@src/modules/roles/roles.service';
import { RolesController } from '@src/modules/roles/roles.controller';
import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '@src/modules/users/users.service';
import { UsersController } from '@src/modules/users/users.controller';
/****entity****/
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   // เพิ่มบรรทัดนี้
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
     TypeOrmModule.forFeature([
      Role, // เพิ่ม entity นี้ 
      Rolesaccess, // เพิ่ม entity นี้ 
      User,
      SdUserRole, // เพิ่ม entity นี้
      UserFile,
      SdUserRolesAccess,
      UserRolePermission,
    ]), 
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RolesController,UsersController],
  providers: [RolesService, AuthService,UsersService, AuthService],
  exports: [RolesService, UsersService, 
              TypeOrmModule.forFeature([
                Role, // เพิ่ม entity นี้ 
                Rolesaccess,
                User,
                SdUserRole, // เพิ่ม entity นี้
                UserFile,
                SdUserRolesAccess,
                UserRolePermission,
              ]) 
          ], // ถ้าต้องการใช้ใน module อื่น
  })
 
export class RolesModule {}
 