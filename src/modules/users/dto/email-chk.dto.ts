import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailChk {
  @ApiProperty({
    description: 'Email of user',
  })
  @IsNotEmpty()
  //@IsEmail()
  email: string;
}
