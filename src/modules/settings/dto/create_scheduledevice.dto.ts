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
export class scheduleDevice {
  @IsNumber()
  @IsNotEmpty()
  schedule_id: number;

  @IsNumber()
  @IsNotEmpty()
  device_id: number;
}
