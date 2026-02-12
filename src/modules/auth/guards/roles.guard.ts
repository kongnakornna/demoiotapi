// @src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึงรายการ Roles ที่กำหนดไว้ใน Decorator (@Roles)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. ถ้าไม่ได้กำหนด @Roles ไว้ที่ Route นั้น ให้ผ่านได้เลย
    if (!requiredRoles) {
      return true;
    }

    // 3. ดึงข้อมูล User จาก Request (ซึ่งถูกใส่เข้ามาโดย JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }

    // 4. ตรวจสอบว่า Role ของ User ตรงกับที่ต้องการหรือไม่
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `ต้องการสิทธิ์ระดับ: ${requiredRoles.join(' หรือ ')}`,
      );
    }

    return true;
  }
}
