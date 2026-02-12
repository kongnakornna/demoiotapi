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
@Entity('sd_user_file', { schema: 'public' })
export class UserFile {
  @ApiProperty({ description: 'admin_access_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  file_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  file_type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  file_path: string;

  @Column({ type: 'int4' })
  file_type_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uid?: string;

  @UpdateDateColumn()
  file_date?: Date;

  @Column({ type: 'int2', nullable: false })
  status!: number;
}
