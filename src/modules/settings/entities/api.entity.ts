import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_iot_api', { schema: 'public' }) // Specifies the table name
export class Api {
  @PrimaryGeneratedColumn('increment')// จะเป็น auto-increment primary key
  api_id: number;

  @Column({ type: 'varchar', length: 255 })
  api_name: string;

  @Column({ type: 'int', nullable: true })
  host: string;

  @Column({ type: 'varchar', length: 255 })
  port: string;

  @Column({ type: 'text', nullable: true })
  token_value: string;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}
