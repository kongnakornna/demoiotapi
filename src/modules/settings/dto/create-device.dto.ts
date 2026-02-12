import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsInt,
  Min,
  Max 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  setting_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  type_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  location_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  device_name?: string;

  @ApiProperty({ description: 'Serial Number - Must be unique' })
  @IsNotEmpty()
  @IsString()
  sn: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  hardware_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status_warning?: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  recovery_warning?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status_alert?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  recovery_alert?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  time_life?: number = 1;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  work_status?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  max?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  min?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comparevalue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  mqtt_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  action_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  status_alert_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_data_value?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_data_control?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  measurement?: string;

  @ApiProperty({ required: false, default: '1' })
  @IsOptional()
  @IsString()
  mqtt_control_on?: string = '1';

  @ApiProperty({ required: false, default: '0' })
  @IsOptional()
  @IsString()
  mqtt_control_off?: string = '0';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  org: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bucket: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  status?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mqtt_device_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_status_over_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_status_data_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_act_relay_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mqtt_control_relay_name?: string;
}