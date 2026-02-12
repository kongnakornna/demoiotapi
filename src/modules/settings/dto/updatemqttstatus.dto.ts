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
export class updatemqttstatusDto {
  @IsNumber()
  @IsNotEmpty()
  mqtt_id: number

  @IsNumber()
  @IsNotEmpty()
  status: number;

}
