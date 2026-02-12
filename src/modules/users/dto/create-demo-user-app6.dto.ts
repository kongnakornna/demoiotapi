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

export class CreateUserDemoDtoApp6 {
  @ApiProperty({ description: 'role_ids' })
  @IsNumber()
  @IsNotEmpty()
  role_id: number = 3;

  @ApiProperty({ description: 'network_id' })
  @IsNumber()
  @IsNotEmpty()
  network_id: number = 6;

  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  username: string = 'demo6';

  @ApiProperty({ description: 'Email of login' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string = 'demo6@gmail.com';

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1,
  // })
  password: string = 'demo6';

  @ApiProperty({ description: 'active status' })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;

  @ApiProperty({ description: 'active status' })
  @IsNumber()
  @IsNotEmpty()
  active_status: number = 1;

  @ApiProperty({
    description: 'active status',
  })
  @IsNumber()
  loginfailed: number = 0;

  @ApiProperty({ description: 'system_id' })
  @IsNumber()
  @IsNotEmpty()
  system_id: number = 6;

  @ApiProperty({ description: 'location_id' })
  @IsNumber()
  @IsNotEmpty()
  location_id: number = 6;
}
