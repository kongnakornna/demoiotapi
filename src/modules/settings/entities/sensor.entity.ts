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
@Entity('sd_iot_sensor', { schema: 'public' }) // Specifies the table name
export class Sensor {
  //@PrimaryColumn()
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key
  sensor_id: number;

  @Column({ type: 'int', nullable: true })
  setting_id: number;

  @Column({ type: 'int', nullable: true })
  setting_type_id: number;

  @Column({ type: 'varchar', length: 50 })
  sensor_name: string;

  @Column({ type: 'varchar', length: 50 })
  sn: string;

  @Column({ type: 'varchar', length: 50 })
  max: string;

  @Column({ type: 'varchar', length: 50 })
  min: string;

  @Column({ type: 'int', nullable: true })
  hardware_id: number;

  @Column({ type: 'varchar', length: 50 })
  status_high: string;

  @Column({ type: 'varchar', length: 50 })
  status_warning: string;

  @Column({ type: 'varchar', length: 50 })
  status_alert: string;

  @Column({ type: 'varchar', length: 250 })
  model: string;

  @Column({ type: 'varchar', length: 250 })
  vendor: string;

  @Column({ type: 'varchar', length: 250 })
  comparevalue: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'varchar', length: 250 })
  unit: string;

  @Column({ type: 'int', nullable: true })
  mqtt_id: number;

  @Column({ type: 'varchar', length: 250 })
  oid: string;

  @Column({ type: 'int', nullable: true })
  action_id: number;

  @Column({ type: 'int', nullable: true })
  status_alert_id: number;

  @Column({ type: 'varchar', length: 250 })
  mqtt_data_value: string;

  @Column({ type: 'varchar', length: 250 })
  mqtt_data_control: string;
}
