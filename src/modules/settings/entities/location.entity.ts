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
@Entity('sd_iot_location', { schema: 'public' }) // Specifies the table name
export class Location {
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key 
  location_id: number;

  @Column({ type: 'varchar', length: 255 })
  location_name: string;

  @Column({ type: 'varchar', length: 255 })
  ipaddress: string;

  @Column()
  location_detail: string;

  @Column({ type: 'text', nullable: true })
  configdata: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}
