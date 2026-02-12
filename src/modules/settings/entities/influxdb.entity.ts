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
@Entity('sd_iot_influxdb', { schema: 'public' }) // Specifies the table name
export class Influxdb {
  @PrimaryGeneratedColumn('uuid')
  influxdb_id: string; // The type is now string
   
  @Column({ type: 'text', nullable: true })
  influxdb_name: string;

  @Column({ type: 'text', nullable: true })
  host: string;

  @Column({ type: 'varchar', length: 255 })
  port: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text', nullable: true })
  token_value: string;

  @Column({ type: 'text', nullable: true })
  buckets: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}