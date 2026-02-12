export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_USER = 'super_user',
  MAINTAINER = 'maintainer',
  GUEST = 'guest'
}

/*

1. ตรวจสอบไฟล์ต้นทาง (Enum Definition)ต้องมั่นใจว่าในไฟล์ user-role.enum.ts มีการ export และใช้ค่าที่เป็น string (เพื่อส่ง/รับกับ Database ได้ง่าย)TypeScript// src/users/enums/user-role.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MAINTAINER = 'maintainer',
  GUEST = 'guest',
}
2. ตรวจสอบระยะของ Folder (Path Resolution)หากไฟล์ที่คุณกำลังเขียนอยู่คือ @src/auth/decorators/roles.decorator.ts และโครงสร้างโปรเจกต์เป็นดังนี้:Plaintextsrc/
 ├── auth/
 │    └── decorators/
 │         └── roles.decorator.ts  <-- คุณอยู่ที่นี่
 └── users/
      └── enums/
           └── user-role.enum.ts   <-- คุณจะไปที่นี่
การใช้ ../../users/enums/user-role.enum นั้น ถูกต้องแล้ว แต่ถ้าคุณได้รับ Error Cannot find module ให้ลองเปลี่ยนไปใช้ Path Alias (ถ้าตั้งค่าไว้ใน tsconfig.json):TypeScript// ใช้ Path Alias (สะอาดกว่าและย้ายไฟล์ง่ายกว่า)
import { UserRole } from '@src/users/enums/user-role.enum';
3. การใช้งานใน Roles Decoratorเพื่อให้การใช้งานร่วมกับ RolesGuard สมบูรณ์ โค้ดควรเป็นดังนี้:TypeScriptimport { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';

export const ROLES_KEY = 'roles';
// กำหนดให้รับเฉพาะค่าที่อยู่ใน UserRole Enum เท่านั้น
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
4. วิธีแก้ปัญหา Error ที่พบบ่อยErrorสาเหตุวิธีแก้TS2307หาไฟล์ไม่เจอเช็คสะกดชื่อไฟล์ (ตัวเล็ก/ใหญ่) และจำนวน ../TS2614ลืม exportเติม export หน้า enum UserRoleCircular DependencyImport วนลูปหลีกเลี่ยงการ Import จากไฟล์ index.ts (Barrel files) ให้ Import ตรงเข้าไฟล์ Enum เลยคำแนะนำเพิ่มเติม:หากโปรเจกต์ของคุณเริ่มใหญ่ขึ้น แนะนำให้ทำ Barrel Export ไว้ที่ src/users/enums/index.ts:TypeScript// src/users/enums/index.ts
export * from './user-role.enum';
แล้วเวลาเรียกใช้จากข้างนอกจะเหลือเพียง:import { UserRole } from '../../users/enums';

*/