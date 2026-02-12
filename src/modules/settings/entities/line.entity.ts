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
@Entity('sd_iot_line', { schema: 'public' }) // Specifies the table name
export class Line {
  @PrimaryGeneratedColumn('uuid')
  line_id: string; // The type is now string
  
  @Column({ type: 'text', nullable: true })
  line_name: string;

  @Column({ type: 'text', nullable: true })
  client_id: string;

  @Column({ type: 'text', nullable: true })
  client_secret: string;

  @Column({ type: 'text', nullable: true })
  secret_key: string;

  @Column({ type: 'text', nullable: true })
  redirect_uri : string;

  @Column({ type: 'varchar', length: 255 })
  grant_type : string;

  @Column({ type: 'varchar', length: 255 })
  code  : string;

  @Column({ type: 'text', nullable: true })
  accesstoken: string;
 
  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number;
}