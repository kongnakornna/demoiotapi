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
export class LineDto {
  @ApiProperty({
    description: 'line_name',
  })
  @IsString()
  @IsNotEmpty()
  line_name: string;

  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 0;
}
