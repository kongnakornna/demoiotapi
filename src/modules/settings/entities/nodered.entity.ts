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
@Entity('sd_iot_nodered', { schema: 'public' }) // Specifies the table name
export class Nodered {
  @PrimaryGeneratedColumn('uuid')
  nodered_id: string; // The type is now string

  @Column({ type: 'text', nullable: true })
  nodered_name: string;

  @Column({ type: 'varchar', length: 255 })
  host: string;

  @Column({ type: 'varchar', length: 255 })
  port: string;

  @Column({ type: 'text', nullable: true })
  routing: string;

  @Column({ type: 'text', nullable: true })
  client_id: string;

  @Column({ type: 'varchar', length: 255 })
  grant_type: string;

  @Column({ type: 'varchar', length: 255 })
  scope: string; 

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}
