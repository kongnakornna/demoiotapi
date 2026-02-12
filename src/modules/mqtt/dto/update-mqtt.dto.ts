import { PartialType } from '@nestjs/swagger';
import { CreateMqttDto } from './create-mqtt.dto';

export class UpdateMqttDto extends PartialType(CreateMqttDto) {}
