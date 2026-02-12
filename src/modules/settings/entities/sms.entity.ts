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
@Entity('sd_iot_sms', { schema: 'public' }) // Specifies the table name
export class Sms {
  @PrimaryGeneratedColumn('uuid') // จะเป็น auto-increment primary key
  sms_id: number;

  @Column({ type: 'varchar', length: 255 })
  sms_name: string;

  @Column({ type: 'varchar', length: 255 })
  host: string;

  @Column({ type: 'int', nullable: true })
  port: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  apikey: string;

  @Column({ type: 'varchar', length: 255 })
  originator: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}