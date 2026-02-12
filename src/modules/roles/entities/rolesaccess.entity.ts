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
@Entity('sd_user_roles_access', { schema: 'public' })
export class Rolesaccess {
  @PrimaryColumn({ type: 'int4' })
  role_id: number;

  @PrimaryColumn({ type: 'int4' })
  role_type_id: number;

  // @Column({ type: 'timestamp', precision: 6, nullable: false, name: 'create' })
  // createdAt: Date;

  // @Column({ type: 'timestamp', precision: 6, nullable: false, name: 'update' })
  // updatedAt: Date;

  @CreateDateColumn({ 
    name: 'create',
    type: 'timestamp',
    precision: 6,
    nullable: false 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'update',
    type: 'timestamp',
    precision: 6,
    nullable: false 
  })
  updatedAt: Date;
}