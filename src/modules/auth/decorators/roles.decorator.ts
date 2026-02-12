import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { UserRole } from '../enums/user-role.enum'; // check path
export var ROLES_KEY: any = 'roles';
export var Roles: any = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);