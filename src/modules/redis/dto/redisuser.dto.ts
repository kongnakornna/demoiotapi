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
export class redisUserDto {
  @ApiProperty({ description: 'otp key' })
  @IsString()
  keycache: string;

  @ApiProperty({ description: 'otp validate' })
  @IsString()
  otpvalidate: string;
}
