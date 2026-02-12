import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
  @ApiProperty({ description: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'Updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @ApiProperty({ description: 'Delete Date' })
  @DeleteDateColumn({ type: 'date', nullable: true })
  deletedate: Date;
}
