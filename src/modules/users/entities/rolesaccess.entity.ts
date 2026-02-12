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
@Entity('sd_user_roles_access', { schema: 'public' }) // Specifies the table name
export class SdUserRolesAccess {
  @CreateDateColumn({ 
    name: 'create',
    type: 'timestamp',
    precision: 6,
    nullable: false 
  })
  create: Date;

  @UpdateDateColumn({ 
    name: 'update',
    type: 'timestamp',
    precision: 6,
    nullable: false 
  })
  update: Date;

  @PrimaryColumn({ type: 'int', nullable: false })
  role_id: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  role_type_id: number;
}