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

export class CreateUserDto {
  @ApiProperty({ description: 'role_ids' })
  @IsNumber()
  @IsNotEmpty()
  role_id: number = 4;

  @ApiProperty({
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email of login',
  })
  @IsString()
  //@IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirm password',
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  // @ApiProperty({
  //     description: 'Password',
  // })
  // @IsString()
  // @IsNotEmpty()
  // @IsStrongPassword({
  //     minLength: 8,
  //     minLowercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //     minUppercase: 1
  // })
  // password: string;

  // @ApiProperty({
  //     description: 'Confirm password',
  // })
  // @IsString()
  // @IsNotEmpty()
  // @IsStrongPassword({
  //     minLength: 8,
  //     minLowercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //     minUppercase: 1
  // })
  // confirm_password: string;

  @ApiProperty({
    description: 'active status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;

  @ApiProperty({
    description: 'active status',
  })
  @IsNumber()
  @IsNotEmpty()
  active_status: number = 0;

  @ApiProperty({
    description: 'active status',
  })
  @IsNumber()
  loginfailed: number = 0;
}
