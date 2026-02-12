import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique, 
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sd_iot_device', { schema: 'public' })
@Unique(['sn'])
@Index('idx_device_org_bucket', ['org', 'bucket'])
@Index('idx_device_sn', ['sn'])
@Index('idx_device_work_status', ['work_status'])
@Index('idx_device_created_date', ['createddate'])
export class Device {
  @PrimaryGeneratedColumn('increment', { name: 'device_id' })
  device_id: number; // Auto-generated, ไม่ควรส่งค่าเข้ามา

  @Column({ type: 'int', nullable: true })
  setting_id: number;

  @Column({ type: 'int', nullable: true })
  type_id: number;

  @Column({ type: 'int', nullable: true })
  location_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  device_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  sn: string;

  @Column({ type: 'int', nullable: true })
  hardware_id: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  status_warning: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  recovery_warning: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  status_alert: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  recovery_alert: string;

  @Column({ type: 'int', nullable: true, default: 1 })
  time_life: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  period: string;

  @Column({ type: 'int', nullable: true, default: 1 })
  work_status: number; // 1=on , 2=off

  @Column({ type: 'varchar', length: 255, nullable: true })
  max: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  min: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vendor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comparevalue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  unit: string;

  @Column({ type: 'int', nullable: true })
  mqtt_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oid: string;

  @Column({ type: 'int', nullable: true })
  action_id: number;

  @Column({ type: 'int', nullable: true })
  status_alert_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mqtt_data_value: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mqtt_data_control: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  measurement: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '1' })
  mqtt_control_on: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '0' })
  mqtt_control_off: string;

  @Column({ type: 'varchar', length: 255 })
  org: string;

  @Column({ type: 'varchar', length: 255 })
  bucket: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'varchar', length: 255 })
  mqtt_device_name: string;

  @Column({ type: 'text', nullable: true })
  mqtt_status_over_name: string;

  @Column({ type: 'text', nullable: true })
  mqtt_status_data_name: string;

  @Column({ type: 'text', nullable: true })
  mqtt_act_relay_name: string;

  @Column({ type: 'text', nullable: true })
  mqtt_control_relay_name: string;

  @Column({ type: 'text', nullable: true })
  mqtt_config: string;

  @Column({ type: 'int', nullable: true, default: 1 })
  layout: number; // 1 menu  2 card

  @Column({ type: 'int', nullable: true, default: 1 })
  alert_set: number; // 1 device  2 main

  @Column({
    type: 'text',
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-bell-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" /><path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004zm0 6a1 1 0 0 0 -1 1v1h-1l-.117 .007a1 1 0 0 0 .117 1.993h1v1l.007 .117a1 1 0 0 0 1.993 -.117v-1h1l.117 -.007a1 1 0 0 0 -.117 -1.993h-1v-1l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>',
  })
  icon_normal: string;

  @Column({
    type: 'text',
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bell-exclamation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 17h-11a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v1.5" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /><path d="M19 16v3" /><path d="M19 22v.01" /></svg>',
  })
  icon_warning: string;

  @Column({
    type: 'text',
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bell-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 17h-9a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v2" /><path d="M9 17v1a3 3 0 0 0 4.194 2.753" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>',
  })
  icon_alert: string;

  @Column({
    type: 'text',
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-temperature"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" /><path d="M10 9l4 0" /></svg>',
  })
  icon: string;

  @Column({
    type: 'text',
    default:
      '<svg id="stateair1_8_windmill_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-sun-high"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path class="windmill-spin" style="margin-left:6px; fill: color-mix(in srgb, transparent, var(--tblr-primary) 100%);" d="M12 19a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1m-4.95 -2.05a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m11.314 0l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m-5.049 -9.836a5 5 0 1 1 -2.532 9.674a5 5 0 0 1 2.532 -9.674m-9.315 3.886a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm18 0a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-16.364 -6.778l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m14.142 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m-7.778 -3.222a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1"></path></svg>',
  })
  icon_on: string;

  @Column({
    type: 'text',
    default:
      '<svg id="stateair1_8_windmill_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sun-high"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z"></path><path d="M6.343 17.657l-1.414 1.414"></path><path d="M6.343 6.343l-1.414 -1.414"></path><path d="M17.657 6.343l1.414 -1.414"></path><path d="M17.657 17.657l1.414 1.414"></path><path d="M4 12h-2"></path><path d="M12 4v-2"></path><path d="M20 12h2"></path><path d="M12 20v2"></path></svg>',
  })
  icon_off: string;

  @Column({ name: 'color_normal', default: '#22C55E' })
  color_normal: string;

  @Column({ name: 'color_warning', default: '#F59E0B' })
  color_warning: string;

  @Column({ name: 'color_alarm', default: '#EF4444' })
  color_alert: string;

  @Column({ name: 'code', default: 'normal' })
  code: string; // 'normal', 'warning', 'alarm', 'recovery_warning', 'recovery_alarm'

  @Column({ type: 'int', nullable: true, default: 1 })
  menu: number;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;
}

