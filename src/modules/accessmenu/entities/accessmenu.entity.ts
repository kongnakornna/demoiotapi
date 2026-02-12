import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_admin_access_menu', { schema: 'public' })
export class AccessMenu {
  @ApiProperty({ description: 'admin_access_id' })
  @PrimaryGeneratedColumn({ type: 'int4' })
  admin_access_id: number;

  @Column({ type: 'int4', nullable: true })
  admin_type_id: number;

  @Column({ type: 'int4', nullable: true })
  admin_menu_id: number;
}
