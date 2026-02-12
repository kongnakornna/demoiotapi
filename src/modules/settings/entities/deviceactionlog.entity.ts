import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_iot_device_action_log', { schema: 'public' }) // Specifies the table name
export class Deviceactionlog {
  //@PrimaryColumn()
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key
  log_id: number; 

  @Column({ type: 'int', nullable: true })
  alarm_action_id: number;

  @Column({ type: 'int', nullable: true })
  device_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uid: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

}

