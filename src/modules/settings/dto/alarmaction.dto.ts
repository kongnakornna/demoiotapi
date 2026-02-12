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
export class alarmactionDto {
  @IsString()
  @IsNotEmpty()
  action_name: string;

  @IsString()
  status_warning: string;

  @IsString()
  recovery_warning: string;

  @IsString()
  status_alert: string;

  @IsString()
  recovery_alert: string;

  @IsNumber()
  email_alarm: number;

  @IsNumber()
  line_alarm: number;

  @IsNumber()
  telegram_alarm: number;

  @IsNumber()
  sms_alarm: number;

  @IsNumber()
  nonc_alarm: number;

  @IsNumber()
  time_life: number;

  @IsNumber()
  event: number;

  @IsNumber()
  @IsNotEmpty()
  status: number = 1; 
}
