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
export class DeviceActionDto { 
  @IsNumber()
  @IsNotEmpty()
  alarm_action_id: number;

  @IsNumber()
  @IsNotEmpty()
  device_id: number;
}
