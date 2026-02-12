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
@Entity('sd_iot_token', { schema: 'public' }) // Specifies the table name
export class Token {
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key
  token_id: number;

  @Column({ type: 'varchar', length: 255 })
  token_name: string;

  @Column({ type: 'int', nullable: true })
  host: number;

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
