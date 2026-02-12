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
@Entity('sd_schedule_process_log', { schema: 'public' }) // Specifies the table name
export class scheduleprocesslog {
  @PrimaryGeneratedColumn('uuid')
  id: string; // The type is now string

  @Column({ type: 'int', nullable: true })
  schedule_id: number;

  @Column({ type: 'int', nullable: true })
  device_id: number;

  @Column({ type: 'varchar', length: 255 })
  schedule_event_start: string;

  @Column({ type: 'varchar', length: 255 })
  day: string;

  @Column({ type: 'varchar', length: 255 })
  doday: string;

  @Column({ type: 'varchar', length: 255 })
  dotime: string;

  @Column({ type: 'varchar', length: 255 })
  schedule_event: string;
 
  @Column({ type: 'varchar', length: 255 })
  device_status: string;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 50 })
  date: string;

  @Column({ type: 'varchar', length: 20 })
  time: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;
}