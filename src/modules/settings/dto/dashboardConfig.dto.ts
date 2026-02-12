// dto/create-dashboard-config.dto.ts
import { IsString, IsOptional, IsObject,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDashboardConfigDto {
 @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  location_id?: number;

  @ApiProperty({ example: 'Main Dashboard' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: { 
      updated_at: "06/01/2026", 
      groups: [] 
    } 
  })
  @IsObject()
  config: any;// รองรับโครงสร้าง JSON positions ที่คุณมี
}

export class UpdateDashboardConfigDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    location_id?: number;

    @ApiProperty({ example: 'Main Dashboard' })
    @IsString()
    name: string;

    @ApiProperty({
        example: {
            updated_at: "06/01/2026",
            groups: []
        }
    })
    @IsObject()
    config: any;
}
