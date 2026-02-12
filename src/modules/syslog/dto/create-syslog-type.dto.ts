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
import { USER_TYPE } from 'src/types';
export class CreateSyslogTypeDto {
  @IsString()
  @IsNotEmpty()
  type_name: string;

  @IsString()
  @IsNotEmpty()
  type_detail: string;

  @IsNumber()
  @IsNotEmpty()
  status: number=1;
}
