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
@Entity('sd_iot_email', { schema: 'public' }) // Specifies the table name
export class Email {
  @PrimaryGeneratedColumn('uuid')
  email_id: string; // The type is n 

  @Column({ type: 'varchar', length: 255 })
  email_name: string;

  @Column({ type: 'varchar', length: 255 })
  host: string;

  @Column({ type: 'int', nullable: true })
  port: number;

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
/* 
  smtp.gmail.com  
    - kongnakornit@gmail.com : asahzdatmywtwrji  : asah zdat mywt wrji 
    - icmon0955@gmail.com : mbwodofvkznougir
    - monitoring.system.report@gmail.com : owortggrxrqhubxa 
*/
