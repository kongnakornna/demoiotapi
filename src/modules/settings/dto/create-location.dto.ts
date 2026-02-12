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
export class CreateLocationDto {
  @ApiProperty({
    description: 'location_name',
  })
  @IsString()
  @IsNotEmpty()
  location_name: string;

  @ApiProperty({
    description: 'ipaddress',
  })
  @IsString()
  @IsNotEmpty()
  ipaddress: string;

  @ApiProperty({
    description: 'location_detail',
  })
  @IsString()
  @IsNotEmpty()
  location_detail: string;

  @IsString()
  @IsNotEmpty()
  configdata: string;
  
  createddate: Date;
  updateddate: Date;
 
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;
}