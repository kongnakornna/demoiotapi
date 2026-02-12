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
@Entity('sd_user_role', { schema: 'public' }) // Specifies the table name
export class SdUserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  role_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createddate: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateddate: Date;

  @Column({ type: 'int', nullable: false })
  create_by: number;

  @Column({ type: 'int', nullable: false })
  lastupdate_by: number;

  @Column({ type: 'smallint', nullable: false })
  status: number;

  @Column({ type: 'int', nullable: false })
  type_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lang: string;
}
