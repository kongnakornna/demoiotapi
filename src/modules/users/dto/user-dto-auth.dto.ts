import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDtoAuthModel {
  @ApiProperty({
    description: 'username of user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
