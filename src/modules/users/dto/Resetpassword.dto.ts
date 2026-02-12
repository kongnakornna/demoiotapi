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
import { USER_TYPE } from 'src/types';

export class passwordtDto {
  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword({
  //     minLength: 8,
  //     minLowercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //     minUppercase: 1
  // })
  password: string;
  confirm_password: string;
}
