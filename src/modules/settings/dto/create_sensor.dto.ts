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
export class CreateSensorDto {
  @IsNumber()
  @IsNotEmpty()
  setting_id: number;

  @IsNumber()
  @IsNotEmpty()
  setting_type_id: number;

  @ApiProperty({
    description: 'sensor_name',
  })
  @IsString()
  @IsNotEmpty()
  sensor_name: string;

  @ApiProperty({
    description: 'sn',
  })
  @IsString()
  @IsNotEmpty()
  sn: string;

  @ApiProperty({
    description: 'max',
  })
  @IsString()
  @IsNotEmpty()
  max: string = '100';
  
  @ApiProperty({
    description: 'min',
  })
  @IsString()
  @IsNotEmpty()
  min: string = '10';

  @IsNumber()
  @IsNotEmpty()
  hardware_id: number;

  @ApiProperty({
      description: 'status_high',
  })
  @IsString()
  @IsNotEmpty()
  status_high: string='10';

  @ApiProperty({
      description: 'status_warning',
  })
  @IsString()
  @IsNotEmpty()
  status_warning: string='30';

  @ApiProperty({
      description: 'status_alert',
  })
  @IsString()
  @IsNotEmpty()
  status_alert: string='60';

  @ApiProperty({
      description: 'model',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
      description: 'vendor',
  })
  @IsString()
  @IsNotEmpty()
  vendor: string;

  @ApiProperty({
      description: 'comparevalue',
  })
  @IsString()
  @IsNotEmpty()
  comparevalue: string;

  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;

  @ApiProperty({
      description: 'unit',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
      description: 'mqtt_id',
  })
  @IsNumber()
  @IsNotEmpty()
  mqtt_id: number=1;

  @ApiProperty({
      description: 'oid',
  })
  @IsString()
  @IsNotEmpty()
  oid: string;

  @ApiProperty({
      description: 'action_id',
  })
  @IsNumber()
  @IsNotEmpty()
  action_id: number=1;

  @ApiProperty({
      description: 'status_alert_id',
  })
  @IsNumber()
  @IsNotEmpty()
  status_alert_id: number=1;

  @ApiProperty({
      description: 'mqtt_data_value',
  })
  @IsString()
  @IsNotEmpty()
  mqtt_data_value: string;

  @ApiProperty({
      description: 'mqtt_data_control',
  })
  @IsString()
  @IsNotEmpty()
  mqtt_data_control: string;
}
