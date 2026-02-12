import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('sd_dashboard_config')
export class dashboardConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'location_id' })
  location_id: number;

  @Column()
  name: string;

  @Column({
    name: 'config_data',
    type: 'json', // or 'text' depending on your database
  })
  config_data: any;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updated_date: Date;
}