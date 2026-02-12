import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * ตรวจสอบสิทธิ์การเข้าถึงเบื้องต้น
   */
  canActivate(context: ExecutionContext) {
    // สามารถเพิ่ม Logic พิเศษตรงนี้ได้ เช่น เช็ค IP หรือ Maintenance Mode
    return super.canActivate(context);
  }

  /**
   * จัดการ Error หลังจาก Passport ตรวจสอบ Token เสร็จแล้ว
   */
  handleRequest(err: any, user: any, info: any) {
    // 1. ถ้ามี Error หรือหา User ไม่เจอ (Token ผิด/หมดอายุ)
    if (err || !user) {
      throw err || new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }

    // 2. คืนค่า User เพื่อให้ NestJS นำไปใส่ใน Request object (req.user)
    return user;
  }
}

/***************
 * 
ในระบบ NestJS เมื่อเรามี JwtAuthGuard สำหรับยืนยันตัวตนแล้ว RolesGuard จะทำหน้าที่เป็นด่านที่สองเพื่อตรวจสอบว่า "User คนนี้มีสิทธิ์ (Permission) เข้าถึงทรัพยากรนี้หรือไม่"

เพื่อให้ RolesGuard ทำงานได้อย่างสมบูรณ์ คุณต้องใช้ร่วมกับ Custom Decorator (เช่น @Roles()) และตรวจสอบกับข้อมูล User ที่อยู่ใน Request ครับ

1. สร้าง Custom Decorator (@Roles)
ก่อนอื่นต้องสร้างไฟล์เพื่อใช้กำหนดว่า Route ไหนต้องการ Role อะไร:

TypeScript

// @src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
2. สร้าง RolesGuard
นี่คือโค้ดฉบับสมบูรณ์ที่รองรับการเช็ค Role หลายรายการ:

TypeScript

// @src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึงรายการ Roles ที่กำหนดไว้ใน Decorator (@Roles)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

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
      throw new ForbiddenException(`ต้องการสิทธิ์ระดับ: ${requiredRoles.join(' หรือ ')}`);
    }

    return true;
  }
}
3. วิธีนำไปใช้งานใน Controller
คุณต้องใช้ JwtAuthGuard ก่อนเสมอ เพื่อให้มีข้อมูล User ใน Request จากนั้นตามด้วย RolesGuard:

TypeScript

@ApiTags('Admin Controls')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // ใช้คู่กัน
export class AdminController {

  @Post('broadcast')
  @Roles('admin', 'super_user') // เฉพาะ admin หรือ super_user เท่านั้น
  async sendBroadcast() {
    return { message: 'Success' };
  }
}
4. ข้อควรระวังและการแก้ไข Error
Error: user is undefined: เกิดจากคุณลืมใส่ JwtAuthGuard ไว้ข้างหน้า RolesGuard ทำให้ไม่มีการถอดรหัส Token มาใส่ใน Request

Database Mapping: ตรวจสอบว่าในไฟล์ JwtStrategy ของคุณ คืนค่า role ออกมาด้วยหรือไม่ เช่น:

TypeScript

// ใน jwt.strategy.ts
async validate(payload: any) {
  return { id: payload.sub, username: payload.username, role: payload.role };
}
Case Sensitivity: ระวังเรื่องตัวพิมพ์เล็ก-ใหญ่ของชื่อ Role (แนะนำให้ใช้ Enum เพื่อลดความผิดพลาด)

คุณต้องการให้ผมช่วยเขียนไฟล์ Role Enum เพื่อนำไปใช้แทนการพิมพ์ String สดๆ ใน Decorator ไหมครับ? จะช่วยให้โค้ดของคุณ Clean และลด Error ได้มากเลยครับ
 **************
 */
