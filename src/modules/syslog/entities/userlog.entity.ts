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
@Entity('sd_user_log', { schema: 'public' }) // Specifies the table name
export class UserLog {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  log_type_id: number;

  @Column({ type: 'uuid', length: 0, nullable: false })
  uid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  detail: string;

  @Column({ type: 'int4', nullable: true })
  select_status: number;

  @Column({ type: 'int4', nullable: true })
  insert_status: number;

  @Column({ type: 'int4', nullable: true })
  update_status: number;

  @Column({ type: 'int4', nullable: true })
  delete_status: number;

  @Column({ type: 'int4', nullable: true })
  status: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lang: string='en';

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