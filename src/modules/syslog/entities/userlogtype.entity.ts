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
@Entity('sd_user_log_type', { schema: 'public' }) // Specifies the table name
export class UserLogtype {
  @PrimaryGeneratedColumn()
  log_type_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type_detail: string;

  @Column({ type: 'int4', nullable: true })
  status: number;

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
}