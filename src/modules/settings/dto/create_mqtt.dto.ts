import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMqttDto {
  @ApiProperty({ description: 'mqtt_type_id', nullable: true })
  @IsNumber()
  @IsNotEmpty()
  mqtt_type_id: number | null;

  @ApiProperty({ description: 'sort' })
  @IsNumber()
  @IsOptional()
  sort?: number = 1;

  @ApiProperty({ description: 'mqtt_name' })
  @IsString()
  @IsNotEmpty()
  mqtt_name: string;

  @ApiProperty({ description: 'host' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ description: 'port', nullable: true })
  @IsNumber()
  @IsNotEmpty()
  port: number | null;

  @ApiProperty({ description: 'username', nullable: true })
  @IsString()
  @IsOptional()
  username?: string | null;

  @ApiProperty({ description: 'password', nullable: true })
  @IsString()
  @IsOptional()
  password?: string | null;

  @ApiProperty({ description: 'secret', nullable: true })
  @IsString()
  @IsOptional()
  secret?: string | null;

  @ApiProperty({ description: 'expire_in', nullable: true })
  @IsString()
  @IsOptional()
  expire_in?: string | null;

  @ApiProperty({ description: 'token_value' })
  @IsString()
  @IsOptional()
  token_value?: string;

  @ApiProperty({ description: 'org', nullable: true })
  @IsString()
  @IsOptional()
  org?: string | null;

  @ApiProperty({ description: 'bucket', nullable: true })
  @IsString()
  @IsOptional()
  bucket?: string | null;

  @ApiProperty({ description: 'envavorment', nullable: true })
  @IsString()
  @IsOptional()
  envavorment?: string | null;

  @ApiProperty({ description: 'status' })
  @IsNumber()
  @IsOptional()
  status?: number = 0;

  @ApiProperty({ description: 'location_id', nullable: true })
  @IsNumber()
  @IsOptional()
  location_id?: number | null;

  @ApiProperty({ description: 'latitude', nullable: true })
  @IsString()
  @IsOptional()
  latitude?: string | null;

  @ApiProperty({ description: 'longitude', nullable: true })
  @IsString()
  @IsOptional()
  longitude?: string | null;

  @ApiProperty({ description: 'mqtt_main_id', default: 1 })
  @IsNumber()
  @IsOptional()
  mqtt_main_id?: number = 1;

  @ApiProperty({
    description: 'configuration',
    default:
      "{'0': 'temperature1','1': 'humidity1','2': 'temperature2','3': 'humidity2','4': 'temperature3','5': 'input1','6': 'AIR1','7': 'AIR2','8': 'UPS1','9': 'UPS2','10': 'Fire','11': 'waterleak','12': 'HSSD', '13': 'Temp','14': 'Volt','15': 'Amp'}",
  })
  configuration: string;
}
