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
@Entity('sd_iot_type', { schema: 'public' }) // Specifies the table name
export class Type {
  @PrimaryGeneratedColumn('increment') // จะเป็น auto-increment primary key
  type_id: number;

  @Column({ type: 'varchar', length: 255 })
  type_name: string;

  @Column({ type: 'int', nullable: true })
  group_id: number;

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}
