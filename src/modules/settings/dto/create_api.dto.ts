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
export class ApiDto {
  @ApiProperty({
    description: 'type_name',
  })
  @IsString()
  @IsNotEmpty()
  api_name: string;

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  port: string;

  @IsString()
  @IsNotEmpty()
  token_value: string;
  
  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;
}
