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
export class TelegramDto {
  @ApiProperty({
    description: 'telegram_name',
  })
  @IsString()
  @IsNotEmpty()
  telegram_name: string;

  @IsString() 
  host: string;

  @IsString() 
  port: string;

  @IsString() 
  username: string;

 @IsString() 
  password: string; 
 
  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 0;
}
