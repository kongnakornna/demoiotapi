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
@Entity('sd_alarm_process_log_email', { schema: 'public' }) 
export class alarmprocesslogemail {   
  @PrimaryGeneratedColumn('uuid')
  id: string; // The uuid is now string

  @Column({ type: 'int', nullable: true })
  alarm_action_id: number;

  @Column({ type: 'int', nullable: true })
  device_id: number;

  @Column({ type: 'int', nullable: true })
  type_id: number;  // email=1 , control=1

  @Column({ type: 'varchar', length: 255, nullable: true })
  event: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alarm_type: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  status_warning: string;
  
  @Column({ type: 'varchar', length: 150, nullable: true })
  recovery_warning: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  status_alert: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  recovery_alert: string;

  @Column({ type: 'int', nullable: true })
  email_alarm: number=0;

  @Column({ type: 'int', nullable: true })
  line_alarm: number=0;

  @Column({ type: 'int', nullable: true })
  telegram_alarm: number=0;

  @Column({ type: 'int', nullable: true })
  sms_alarm: number=0;

  @Column({ type: 'int', nullable: true })
  nonc_alarm: number=0;
 
  @Column({ type: 'varchar', length: 150, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 100 })
  date: string;

  @Column({ type: 'varchar', length: 50 })
  time: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  data: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  data_alarm: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alarm_status: string;  

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;    

  @Column({ type: 'varchar', length: 255, nullable: true })
  content: string;  

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;
}