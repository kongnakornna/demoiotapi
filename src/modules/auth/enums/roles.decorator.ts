// @src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@src/modules/users/enums/user-role.enum'; // ตรวจสอบ path ให้ถูกต้อง
export const ROLES_KEY = 'roles';

/**
 * Decorator สำหรับกำหนดสิทธิ์การเข้าถึง Route
 * @param roles รายการ UserRole ที่อนุญาต
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
