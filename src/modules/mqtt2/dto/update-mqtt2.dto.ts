import { PartialType } from '@nestjs/swagger';
import { CreateMqtt2Dto } from './create-mqtt2.dto';

export class UpdateMqtt2Dto extends PartialType(CreateMqtt2Dto) {}
