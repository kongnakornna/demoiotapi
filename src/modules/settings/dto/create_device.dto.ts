import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';
export class DeviceDto {
  @IsNumber()
  @IsNotEmpty()
  setting_id: number = 1;

  @IsNumber()
  @IsNotEmpty()
  type_id: number = 1;

  @IsNumber()
  @IsNotEmpty()
  location_id: number = 1;

  @IsString()
  @IsNotEmpty()
  device_name: string;

  @IsString()
  @IsNotEmpty()
  sn: string;

  @IsString()
  @IsOptional()   
  max: string='';

  @IsString()
  @IsOptional()   
  min: string = '';

  @IsNumber()
  hardware_id: number;

  @IsString()
  @IsOptional() 
  status_warning: string='';

  @IsString()
  @IsOptional() 
  recovery_warning: string='';

  @IsString()
  @IsOptional() 
  status_alert: string='';

  @IsString()
  @IsOptional() 
  recovery_alert: string='';

  @IsNumber()
  time_life: number;

  @IsNumber()
  period: number;

  @IsString()
  model: string;

  @IsString()
  @IsOptional() 
  vendor: string='';

  @IsString()
  @IsOptional() 
  comparevalue: string='';

  @IsString() 
  @IsOptional()   
  unit: string='';

  @IsNumber()
  mqtt_id: number;

  @IsString()
  @IsOptional()   
  oid: string='';
 
  @IsNumber()
  action_id: number;

  @IsNumber()
  status_alert_id: number;

  @IsString()
  mqtt_data_value: string;

  @IsString()
  mqtt_data_control: string;

  @IsString()
  measurement: string;

  @IsNumber()
  work_status: number;

  @IsString()
  mqtt_control_on: string;

  @IsString()
  mqtt_control_off: string;

  @IsString()
  org: string;

  @IsString()
  bucket: string;

  createddate: Date;
  updateddate: Date;
  @ApiProperty({
    description: 'status',
  })
  @IsNumber()
  @IsNotEmpty()
  status: number = 1;

  @IsString()
  mqtt_device_name: string;

  @IsString()
  mqtt_status_over_name: string;

  @IsString()
  mqtt_status_data_name: string;

  @IsString()
  mqtt_act_relay_name: string;

  @IsString()
  mqtt_control_relay_name: string;

  @IsString()
  alert_set: string;

  @IsString()
  layout: string;

  @IsString()
  @IsOptional()   
  code: string='';

  @IsString()
  icon: string;

  @IsString()
  icon_normal: string;

  @IsString()
  icon_warning: string;

  @IsString()
  icon_alert: string;

  @IsString()
  icon_on: string;

  @IsString()
  icon_off: string;

  @IsString()
  color_normal: string;

  @IsString()
  color_warning: string;

  @IsString()
  color_alert: string;
}
 