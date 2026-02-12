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
export class CreateTypeDto {
  @ApiProperty({
    description: 'type_name',
  })
  @IsString()
  @IsNotEmpty()
  type_name: string;

  @IsNumber()
  @IsNotEmpty()
  group_id: number;
  
  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;
}
