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
@Entity('sd_iot_alarm_device', { schema: 'public' }) // Specifies the table name
export class alarmDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string; // The type is now string

  @Column({ type: 'int', nullable: true })
  alarm_action_id: number;

  @Column({ type: 'int', nullable: true })
  device_id: number;
}