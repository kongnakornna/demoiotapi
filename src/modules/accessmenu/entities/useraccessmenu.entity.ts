import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_user_access_menu', { schema: 'public' })
export class Useraccessmenu {
  @ApiProperty({ description: 'user_access_id' })
  @PrimaryGeneratedColumn({ type: 'int4' })
  user_access_id: number;

  @Column({ type: 'int4', nullable: true })
  user_type_id: number;

  @Column({ type: 'int4', nullable: true })
  menu_id: number;

  @Column({ type: 'int4', nullable: true })
  parent_id: number;
}
