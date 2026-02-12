// @src/users/enums/user-role.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
  USER = 'user',
  GUEST = 'guest',
}
export type Role = UserRole; // หรือใช้ร่วมกัน
// Make sure the Roles decorator expects these values
// @src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
