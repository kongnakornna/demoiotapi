import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';
export class SchedulDto { 
  @IsString()
  @IsNotEmpty()
  schedule_name: string;

  @IsNumber() 
  @IsNotEmpty()
  device_id: number=1;

  @IsString() 
  @IsNotEmpty()
  start: string='Device 1';

  @IsNumber() 
  @IsNotEmpty()
  event: number=1;

  @IsNumber() 
  sunday: number=0;

  @IsNumber() 
  monday: number=0;

  @IsNumber() 
  tuesday: number=0;

  @IsNumber() 
  wednesday: number=0;

  @IsNumber() 
  thursday: number=0;

  @IsNumber() 
  friday: number=0;

  @IsNumber() 
  saturday: number=0;
 
  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;
}
