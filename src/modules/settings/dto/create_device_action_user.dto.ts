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
export class DeviceActionuserDto { 
  @IsNumber()
  @IsNotEmpty()
  alarm_action_id: number;

  @IsString()
  uid: string;
}
