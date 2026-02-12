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
export class CreateSettingDto { 
  @ApiProperty({ description: 'location_id' })
  @IsNumber()
  @IsNotEmpty()
  location_id: number;

  @ApiProperty({
    description: 'setting_type_id',
  })
  @IsNumber()
  @IsNotEmpty()
  setting_type_id: number;

  @ApiProperty({
    description: 'setting_name',
  })
  @IsString()
  @IsNotEmpty()
  setting_name: string;
 
 @ApiProperty({
    description: 'sn',
  })
  @IsString()
  @IsNotEmpty()
  sn: string;
 
  createddate: Date;
  updateddate: Date;
 
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;
}