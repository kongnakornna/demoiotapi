import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_user', { schema: 'public' }) // Specifies the table name
export class User{
  @ApiProperty({ description: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'Updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @ApiProperty({ description: 'Delete Date' })
  @DeleteDateColumn({ type: 'date', nullable: true })
  deletedate: Date;

  @Column({ type: 'int4', nullable: false })
  role_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_temp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullname?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idcard?: string;

  @UpdateDateColumn()
  lastsignindate?: Date;

  @Column({ type: 'int2', nullable: false })
  status!: number;

  @Column({ type: 'int2', nullable: true })
  active_status?: number;
 
  @Column({
    type: 'int4',
    nullable: true,
    default: 1
  })
  network_id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark?: string;

  @Column({ type: 'int2', nullable: true ,default: 0})
  infomation_agree_status?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 0})
  online_status?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message?: string;

  @Column({ type: 'int4', nullable: true ,default: 0})
  network_type_id?: number;

  @Column({ type: 'int2', nullable: true ,default: 0})
  public_status?: number;

  @Column({ type: 'int4', nullable: true ,default: 0})
  type_id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarpath?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  refresh_token?: string;

  @Column({ type: 'int2', nullable: true })
  loginfailed?: number;

  @Column({ type: 'int2', nullable: true, default: 0  })
  public_notification?: number = 0;

  @Column({ type: 'int2', nullable: true, default: 0  })
  sms_notification?: number = 0;

  @Column({ type: 'int2', nullable: true, default: 0 })
  email_notification?: number = 0;

  @Column({ type: 'int2', nullable: true, default: 0 })
  line_notification?: number = 0;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 0})
  mobile_number?: string;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 0})
  phone_number?: string;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 0})
  lineid?: string;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 1})
  system_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true ,default: 1})
  location_id?: string;

}  