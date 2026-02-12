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
export class CreateSyslogDto {
    @IsNumber()
    @IsNotEmpty()
    log_type_id: number;

    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    detail: string;

    // @IsString()
    // @IsNotEmpty()
    // select_status: number=0;

    // @IsString()
    // @IsNotEmpty()
    // insert_status: number=0;

    // @IsString()
    // @IsNotEmpty()
    // update_status: number=0;

    // @IsString()
    // @IsNotEmpty()
    // delete_status: number=0;
    
    // @IsString()
    // @IsNotEmpty()
    // status: number=0;

    // @IsString()
    // @IsNotEmpty()
    // lang: string='en';

}