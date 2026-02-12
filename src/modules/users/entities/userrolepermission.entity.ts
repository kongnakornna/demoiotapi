import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
@Entity('sd_user_roles_permision', { schema: 'public' }) // Specifies the table name
export class UserRolePermission {
  @PrimaryColumn({ name: 'role_type_id', type: 'int' })
  role_type_id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail?: string;

  @CreateDateColumn({ 
    name: 'created', 
    type: 'timestamp', 
    precision: 6,
    comment: 'เพิ่มเมื่อ'
  })
  created: Date;

  @UpdateDateColumn({ 
    name: 'updated', 
    type: 'timestamp', 
    precision: 6, 
    nullable: true,
    comment: 'แก้ไขเมื่อ'
  })
  updated?: Date;

  @Column({ 
    name: 'insert', 
    type: 'int', 
    nullable: true,
    comment: 'เพิ่มข้อมูล'
  })
  insert?: number;

  @Column({ 
    name: 'update', 
    type: 'int', 
    nullable: true,
    comment: 'แก้ไขข้อมูล'
  })
  update?: number;

  @Column({ 
    name: 'delete', 
    type: 'int', 
    nullable: true,
    comment: 'ลบข้อมูล'
  })
  delete?: number;

  @Column({ 
    name: 'select', 
    type: 'int', 
    nullable: true,
    comment: 'ดูข้อมูล'
  })
  select?: number;

  @Column({ 
    name: 'log', 
    type: 'int', 
    nullable: true,
    comment: 'จัดการประวัติ'
  })
  log?: number;

  @Column({ 
    name: 'config', 
    type: 'int', 
    nullable: true,
    comment: 'ตั้งค่าระบบ'
  })
  config?: number;

  @Column({ 
    name: 'truncate', 
    type: 'int', 
    nullable: true,
    comment: 'ล้างข้อมูล'
  })
  truncate?: number;
}