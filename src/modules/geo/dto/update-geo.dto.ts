import { PartialType } from '@nestjs/swagger';
import { CreateGeoDto } from './create-geo.dto';

export class UpdateGeoDto extends PartialType(CreateGeoDto) {}
