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
@Entity('sd_iot_host', { schema: 'public' }) // Specifies the table name
export class Host {
  @PrimaryGeneratedColumn('uuid')
  host_id: string; // The type is now string

  @Column({ type: 'varchar', length: 255 })
  host_name: string;

  @Column({ type: 'varchar', length: 255 })
  port: string;

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

  @Column({ type: 'int', nullable: true })
  idhost: number;
}
