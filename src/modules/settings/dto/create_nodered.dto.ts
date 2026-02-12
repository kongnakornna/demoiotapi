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
export class NoderedDto { 
  @IsString()
  @IsNotEmpty()
  nodered_name: string="Node-red";

  @IsString() 
  host: string="localhost";

  @IsString() 
  port: string="1881";

  @IsString() 
  routing: string="auth/token"; 

  @IsString() 
  client_id: string="node-red-admin";

  @IsString() 
  grant_type: string="password";

  @IsString() 
  scope: string= "*";

  @IsString() 
  username: string="admin";

  @IsString() 
  password: string="password"; 

  @IsString() 
  token_value: string; 
 
  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 0;
}
