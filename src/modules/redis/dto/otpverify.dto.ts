import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';
export class otpverifyDto {
  @ApiProperty({ description: 'otp key' })
  @IsString()
  otpkey: string;

  @ApiProperty({ description: 'otp validate' })
  @IsString()
  otp: string;
}
