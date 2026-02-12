import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity('sd_user_roles_permision', { schema: 'public' })
export class Role {
  @PrimaryColumn({ type: 'int4' })
  role_type_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  created: Date;

  @Column({ type: 'timestamp', precision: 6, nullable: true })
  updated: Date;

  @Column({ type: 'int4', nullable: true })
  insert: number;

  @Column({ type: 'int4', nullable: true })
  update: number;

  @Column({ type: 'int4', nullable: true })
  delete: number;

  @Column({ type: 'int4', nullable: true })
  select: number;

  @Column({ type: 'int4', nullable: true })
  log: number;

  @Column({ type: 'int4', nullable: true })
  config: number;

  @Column({ type: 'int4', nullable: true })
  truncate: number;
}
