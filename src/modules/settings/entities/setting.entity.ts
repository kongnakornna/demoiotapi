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
@Entity('sd_iot_setting', { schema: 'public' }) // Specifies the table name
export class Setting {
  //@PrimaryColumn()
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key
  setting_id: number;

  @Column({ type: 'int', nullable: true })
  location_id: number;

  @Column({ type: 'int', nullable: true })
  setting_type_id: number;

  @Column({ type: 'varchar', length: 50 })
  setting_name: string;

  @Column({ type: 'varchar', length: 50 })
  sn: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}
