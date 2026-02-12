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
export class InfluxdbDto {
  @ApiProperty({
    description: 'email_name',
  })
  @IsString()
  @IsNotEmpty()
  influxdb_name: string;

  @IsString() 
  host: string;

  @IsString() 
  port: string;

  @IsString() 
  username: string;

  @IsString() 
  password: string; 

  token_value: string; 
  buckets: string; 

  // createddate: Date;
  // updateddate: Date;
  
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 0;
}

/*
    sd_iot_influxdb
      influxdb_id: string; 
      influxdb_name: string;
      host: number;
      port: string;
      username: string;
      password: string;
      token_value: string;
      buckets: string;
      createddate: Date;
      updateddate: Date;
      status: number;
 */