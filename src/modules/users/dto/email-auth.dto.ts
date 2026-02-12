import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailAuthModel {
  @ApiProperty({
    description: 'Email of user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
