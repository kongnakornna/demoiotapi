"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToArray = exports.ToDate = exports.ToBoolean = exports.ToFloat = exports.ToInt = exports.Trim = exports.ToUpperCase = exports.ToLowerCase = exports.IsSensorValue = exports.IsDeviceId = exports.IsDateRange = exports.ValidationGroups = exports.PaginatedResponseDto = exports.ApiResponseDto = exports.CreateAlertDto = exports.QueryIotDataDto = exports.SearchDataDto = exports.ExportDataDto = exports.FirmwareConfigDto = exports.GeneralConfigDto = exports.UpdateConfigDto = exports.PowerConfigDto = exports.CommunicationConfigDto = exports.AlertConfigDto = exports.ThresholdConfigDto = exports.SensorConfigDto = exports.ReportingConfigDto = exports.ControlDeviceDto = exports.CommandParametersDto = exports.UpdateIotDataDto = exports.CreateIotDataDto = exports.MetadataDto = exports.LocationDto = exports.SensorDataDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class SensorDataDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Temperature in Celsius' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-50),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Relative humidity in percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "humidity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pressure in hPa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(800),
    (0, class_validator_1.Max)(1100),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "pressure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Voltage in volts' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "voltage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current in amperes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Power in watts' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "power", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Energy in watt-hours' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "energy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Battery level in percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "battery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Signal strength in dBm' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-120),
    (0, class_validator_1.Max)(0),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "signal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CO2 level in ppm' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(300),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "co2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'TVOC level in ppb' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "tvoc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PM2.5 level in µg/m³' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "pm2_5", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PM10 level in µg/m³' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "pm10", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Light intensity in lux' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "light", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UV index' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(15),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "uv", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Noise level in dB' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "noise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ON', 'OFF', 'STANDBY', 'ERROR', 'WARNING', 'MAINTENANCE']),
    __metadata("design:type", String)
], SensorDataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error code if any' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SensorDataDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], SensorDataDto.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom sensor data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SensorDataDto.prototype, "custom", void 0);
exports.SensorDataDto = SensorDataDto;
class LocationDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitude' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitude' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Altitude in meters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "altitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accuracy in meters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LocationDto.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Speed in m/s' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LocationDto.prototype, "speed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Heading in degrees' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(360),
    __metadata("design:type", Number)
], LocationDto.prototype, "heading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Street address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], LocationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LocationDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LocationDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Postal code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], LocationDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Floor number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], LocationDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Room number/name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LocationDto.prototype, "room", void 0);
exports.LocationDto = LocationDto;
class MetadataDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data source' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'MQTT',
        'HTTP',
        'WebSocket',
        'Modbus',
        'Serial',
        'Bluetooth',
        'LoRa',
    ]),
    __metadata("design:type", String)
], MetadataDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Communication protocol' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], MetadataDto.prototype, "protocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'MQTT topic or endpoint' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], MetadataDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client/device identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message ID for tracking' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address of sender' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], MetadataDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Port number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPort)(),
    __metadata("design:type", Number)
], MetadataDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gateway ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "gatewayId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Network type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['WiFi', '4G', '5G', 'LoRa', 'NB-IoT', 'Ethernet', 'Bluetooth']),
    __metadata("design:type", String)
], MetadataDto.prototype, "networkType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Firmware version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], MetadataDto.prototype, "firmwareVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hardware version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], MetadataDto.prototype, "hardwareVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device manufacturer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device model' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Serial number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Project ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Site ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "siteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], MetadataDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data quality score' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], MetadataDto.prototype, "quality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Processing time in milliseconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MetadataDto.prototype, "processingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom metadata fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MetadataDto.prototype, "custom", void 0);
exports.MetadataDto = MetadataDto;
class CreateIotDataDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device identifier',
        example: 'BAACTW01',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 100),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9\-_.]+$/, {
        message: 'Device ID can only contain letters, numbers, hyphens, underscores, and periods',
    }),
    __metadata("design:type", String)
], CreateIotDataDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sensor data payload',
        type: SensorDataDto,
        required: true,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SensorDataDto),
    __metadata("design:type", SensorDataDto)
], CreateIotDataDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp when data was generated by device (ISO 8601)',
        example: '2024-01-15T10:30:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], CreateIotDataDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp when data was received by server (ISO 8601)',
        example: '2024-01-15T10:30:05.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], CreateIotDataDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location information',
        type: LocationDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], CreateIotDataDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata',
        type: MetadataDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MetadataDto),
    __metadata("design:type", MetadataDto)
], CreateIotDataDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of data',
        enum: [
            'temperature',
            'humidity',
            'power',
            'water',
            'gas',
            'light',
            'motion',
            'status',
            'custom',
        ],
        example: 'temperature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'temperature',
        'humidity',
        'power',
        'water',
        'gas',
        'light',
        'motion',
        'status',
        'custom',
    ]),
    __metadata("design:type", String)
], CreateIotDataDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data quality score (0-100)',
        example: 95,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateIotDataDto.prototype, "dataQuality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calculated/derived values',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIotDataDto.prototype, "calculatedValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIotDataDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules applied',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIotDataDto.prototype, "validationRules", void 0);
exports.CreateIotDataDto = CreateIotDataDto;
class UpdateIotDataDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateIotDataDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateIotDataDto.prototype, "isProcessed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateIotDataDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateIotDataDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateIotDataDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateIotDataDto.prototype, "validated", void 0);
exports.UpdateIotDataDto = UpdateIotDataDto;
class CommandParametersDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Relay number (1-8)',
        example: 1,
        minimum: 1,
        maximum: 8,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CommandParametersDto.prototype, "relay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Relay state',
        enum: ['ON', 'OFF', 'TOGGLE'],
        example: 'ON',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ON', 'OFF', 'TOGGLE']),
    __metadata("design:type", String)
], CommandParametersDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Duration in seconds',
        example: 60,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CommandParametersDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'PWM duty cycle (0-100)',
        example: 75,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CommandParametersDto.prototype, "pwm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature setpoint in Celsius',
        example: 25,
        minimum: 10,
        maximum: 40,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(40),
    __metadata("design:type", Number)
], CommandParametersDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reporting interval in seconds',
        example: 300,
        minimum: 5,
        maximum: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CommandParametersDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom command parameters',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CommandParametersDto.prototype, "custom", void 0);
exports.CommandParametersDto = CommandParametersDto;
class ControlDeviceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device identifier',
        example: 'BAACTW01',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], ControlDeviceDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to perform',
        enum: [
            'TURN_ON',
            'TURN_OFF',
            'TOGGLE',
            'REBOOT',
            'RESET',
            'UPDATE_CONFIG',
            'READ_STATUS',
            'CALIBRATE',
            'UPGRADE_FIRMWARE',
            'SEND_MESSAGE',
            'CUSTOM',
        ],
        example: 'TURN_ON',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)([
        'TURN_ON',
        'TURN_OFF',
        'TOGGLE',
        'REBOOT',
        'RESET',
        'UPDATE_CONFIG',
        'READ_STATUS',
        'CALIBRATE',
        'UPGRADE_FIRMWARE',
        'SEND_MESSAGE',
        'CUSTOM',
    ]),
    __metadata("design:type", String)
], ControlDeviceDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Command parameters',
        type: CommandParametersDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CommandParametersDto),
    __metadata("design:type", CommandParametersDto)
], ControlDeviceDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority of command',
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        example: 'MEDIUM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    __metadata("design:type", String)
], ControlDeviceDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timeout in seconds',
        example: 30,
        minimum: 1,
        maximum: 300,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ControlDeviceDto.prototype, "timeout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Require acknowledgement',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ControlDeviceDto.prototype, "requireAck", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Schedule execution at specific time (ISO 8601)',
        example: '2024-01-15T14:30:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], ControlDeviceDto.prototype, "scheduleAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ControlDeviceDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who issued the command',
        example: 'admin',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ControlDeviceDto.prototype, "issuedBy", void 0);
exports.ControlDeviceDto = ControlDeviceDto;
class ReportingConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable/disable reporting',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReportingConfigDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reporting interval in seconds',
        example: 300,
        minimum: 1,
        maximum: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ReportingConfigDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data format',
        enum: ['json', 'csv', 'xml'],
        example: 'json',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['json', 'csv', 'xml']),
    __metadata("design:type", String)
], ReportingConfigDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Batch size for reporting',
        example: 10,
        minimum: 1,
        maximum: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ReportingConfigDto.prototype, "batchSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum retry attempts',
        example: 3,
        minimum: 0,
        maximum: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ReportingConfigDto.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Retry interval in seconds',
        example: 60,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ReportingConfigDto.prototype, "retryInterval", void 0);
exports.ReportingConfigDto = ReportingConfigDto;
class SensorConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable/disable sensor',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SensorConfigDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Measurement unit',
        example: '°C',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], SensorConfigDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Decimal precision',
        example: 2,
        minimum: 0,
        maximum: 6,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], SensorConfigDto.prototype, "precision", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sampling rate in seconds',
        example: 60,
        minimum: 1,
        maximum: 3600,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], SensorConfigDto.prototype, "samplingRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calibration offset',
        example: 0.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SensorConfigDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calibration multiplier',
        example: 1.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SensorConfigDto.prototype, "multiplier", void 0);
exports.SensorConfigDto = SensorConfigDto;
class ThresholdConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum threshold value',
        example: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum threshold value',
        example: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warning minimum threshold',
        example: 22,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "warningMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warning maximum threshold',
        example: 28,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "warningMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Critical minimum threshold',
        example: 18,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "criticalMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Critical maximum threshold',
        example: 32,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "criticalMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hysteresis value',
        example: 0.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ThresholdConfigDto.prototype, "hysteresis", void 0);
exports.ThresholdConfigDto = ThresholdConfigDto;
class AlertConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable/disable alerts',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AlertConfigDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email addresses for alerts',
        type: [String],
        example: ['admin@example.com'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], AlertConfigDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone numbers for SMS alerts',
        type: [String],
        example: ['+66123456789'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMobilePhone)('th-TH', {}, { each: true }),
    (0, class_validator_1.ArrayMaxSize)(5),
    __metadata("design:type", Array)
], AlertConfigDto.prototype, "sms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Webhook URL for alerts',
        example: 'https://api.example.com/webhook',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], AlertConfigDto.prototype, "webhook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable/disable escalation',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AlertConfigDto.prototype, "escalationEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Escalation levels',
        example: 3,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], AlertConfigDto.prototype, "escalationLevels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Escalation interval in minutes',
        example: 30,
        minimum: 1,
        maximum: 1440,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AlertConfigDto.prototype, "escalationInterval", void 0);
exports.AlertConfigDto = AlertConfigDto;
class CommunicationConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Communication protocol',
        enum: ['mqtt', 'http', 'websocket', 'modbus', 'serial'],
        example: 'mqtt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['mqtt', 'http', 'websocket', 'modbus', 'serial']),
    __metadata("design:type", String)
], CommunicationConfigDto.prototype, "protocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Server endpoint',
        example: 'mqtt://broker.example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CommunicationConfigDto.prototype, "endpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Port number',
        example: 1883,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPort)(),
    __metadata("design:type", Number)
], CommunicationConfigDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MQTT topic',
        example: 'devices/BAACTW01/data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CommunicationConfigDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MQTT QoS level',
        enum: [0, 1, 2],
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([0, 1, 2]),
    __metadata("design:type", Number)
], CommunicationConfigDto.prototype, "qos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MQTT retain flag',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CommunicationConfigDto.prototype, "retain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Username for authentication',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CommunicationConfigDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Password for authentication',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CommunicationConfigDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSL/TLS enabled',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CommunicationConfigDto.prototype, "ssl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Keep alive interval in seconds',
        example: 60,
        minimum: 10,
        maximum: 300,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CommunicationConfigDto.prototype, "keepAlive", void 0);
exports.CommunicationConfigDto = CommunicationConfigDto;
class PowerConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable sleep mode',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PowerConfigDto.prototype, "sleepMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sleep interval in seconds',
        example: 3600,
        minimum: 60,
        maximum: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PowerConfigDto.prototype, "sleepInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Wake up interval in seconds',
        example: 300,
        minimum: 10,
        maximum: 3600,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PowerConfigDto.prototype, "wakeupInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable battery saving mode',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PowerConfigDto.prototype, "batterySave", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Low battery threshold in percentage',
        example: 20,
        minimum: 5,
        maximum: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], PowerConfigDto.prototype, "lowBatteryThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Critical battery threshold in percentage',
        example: 10,
        minimum: 1,
        maximum: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], PowerConfigDto.prototype, "criticalBatteryThreshold", void 0);
exports.PowerConfigDto = PowerConfigDto;
class UpdateConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'General device settings',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GeneralConfigDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reporting configuration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReportingConfigDto),
    __metadata("design:type", ReportingConfigDto)
], UpdateConfigDto.prototype, "reporting", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sensor configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateConfigDto.prototype, "sensors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Threshold configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateConfigDto.prototype, "thresholds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AlertConfigDto),
    __metadata("design:type", AlertConfigDto)
], UpdateConfigDto.prototype, "alerts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Communication configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CommunicationConfigDto),
    __metadata("design:type", CommunicationConfigDto)
], UpdateConfigDto.prototype, "communication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Power management configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PowerConfigDto),
    __metadata("design:type", PowerConfigDto)
], UpdateConfigDto.prototype, "power", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware update configurations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom configuration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateConfigDto.prototype, "custom", void 0);
exports.UpdateConfigDto = UpdateConfigDto;
class GeneralConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device name/alias',
        example: 'Temperature Sensor - Room 101',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GeneralConfigDto.prototype, "deviceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device description',
        example: 'Temperature and humidity sensor in conference room',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], GeneralConfigDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timezone',
        example: 'Asia/Bangkok',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsTimeZone)(),
    __metadata("design:type", String)
], GeneralConfigDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location information',
        type: LocationDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], GeneralConfigDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device group/category',
        example: 'environmental_sensors',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GeneralConfigDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device tags',
        type: [String],
        example: ['indoor', 'wireless', 'battery-powered'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], GeneralConfigDto.prototype, "tags", void 0);
exports.GeneralConfigDto = GeneralConfigDto;
class FirmwareConfigDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware version',
        example: '1.2.3',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsSemVer)(),
    __metadata("design:type", String)
], FirmwareConfigDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable auto-update',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FirmwareConfigDto.prototype, "autoUpdate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Firmware update URL',
        example: 'https://firmware.example.com/updates',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], FirmwareConfigDto.prototype, "updateUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update check interval in hours',
        example: 24,
        minimum: 1,
        maximum: 720,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], FirmwareConfigDto.prototype, "checkInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update channel',
        enum: ['stable', 'beta', 'alpha'],
        example: 'stable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['stable', 'beta', 'alpha']),
    __metadata("design:type", String)
], FirmwareConfigDto.prototype, "channel", void 0);
exports.FirmwareConfigDto = FirmwareConfigDto;
class ExportDataDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device identifier',
        example: 'BAACTW01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], ExportDataDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date (ISO 8601)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date (ISO 8601)',
        example: '2024-01-31T23:59:59.999Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], ExportDataDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Export format',
        enum: ['csv', 'json', 'excel'],
        example: 'csv',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['csv', 'json', 'excel']),
    __metadata("design:type", String)
], ExportDataDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fields to include in export',
        type: [String],
        example: ['id', 'deviceId', 'timestamp', 'temperature', 'humidity'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ExportDataDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include headers in CSV export',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportDataDto.prototype, "includeHeaders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Compress output as ZIP',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportDataDto.prototype, "compress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum records to export',
        example: 10000,
        minimum: 1,
        maximum: 1000000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ExportDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by data type',
        enum: [
            'temperature',
            'humidity',
            'power',
            'water',
            'gas',
            'light',
            'motion',
            'status',
            'custom',
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'temperature',
        'humidity',
        'power',
        'water',
        'gas',
        'light',
        'motion',
        'status',
        'custom',
    ]),
    __metadata("design:type", String)
], ExportDataDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum data quality score',
        example: 80,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ExportDataDto.prototype, "minQuality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC']),
    __metadata("design:type", String)
], ExportDataDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timezone for timestamp conversion',
        example: 'Asia/Bangkok',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsTimeZone)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "timezone", void 0);
exports.ExportDataDto = ExportDataDto;
class SearchDataDto {
    constructor() {
        this.page = 1;
        this.limit = 50;
        this.exactMatch = false;
        this.caseSensitive = false;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query string',
        example: 'temperature > 25',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], SearchDataDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device identifier',
        example: 'BAACTW01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], SearchDataDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field to search in',
        enum: ['all', 'deviceId', 'data', 'location', 'metadata'],
        example: 'all',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['all', 'deviceId', 'data', 'location', 'metadata']),
    __metadata("design:type", String)
], SearchDataDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], SearchDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Results per page',
        example: 50,
        minimum: 1,
        maximum: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], SearchDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable exact match',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], SearchDataDto.prototype, "exactMatch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Case sensitive search',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], SearchDataDto.prototype, "caseSensitive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date (ISO 8601)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], SearchDataDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date (ISO 8601)',
        example: '2024-01-31T23:59:59.999Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], SearchDataDto.prototype, "endDate", void 0);
exports.SearchDataDto = SearchDataDto;
class QueryIotDataDto {
    constructor() {
        this.page = 1;
        this.limit = 50;
        this.sortBy = 'timestamp';
        this.sortOrder = 'DESC';
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], QueryIotDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Results per page',
        example: 50,
        minimum: 1,
        maximum: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], QueryIotDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device identifier',
        example: 'BAACTW01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Multiple device identifiers',
        type: [String],
        example: ['BAACTW01', 'BAACTW02'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(100),
    __metadata("design:type", Array)
], QueryIotDataDto.prototype, "deviceIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date (ISO 8601)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date (ISO 8601)',
        example: '2024-01-31T23:59:59.999Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data type',
        enum: [
            'temperature',
            'humidity',
            'power',
            'water',
            'gas',
            'light',
            'motion',
            'status',
            'custom',
        ],
        example: 'temperature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'temperature',
        'humidity',
        'power',
        'water',
        'gas',
        'light',
        'motion',
        'status',
        'custom',
    ]),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        enum: ['id', 'deviceId', 'timestamp', 'createdAt', 'dataQuality'],
        example: 'timestamp',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['id', 'deviceId', 'timestamp', 'createdAt', 'dataQuality', 'random']),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC']),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query',
        example: 'temperature > 25',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fields to include in response',
        type: [String],
        example: ['id', 'deviceId', 'timestamp', 'data'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(50),
    __metadata("design:type", Array)
], QueryIotDataDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device type',
        example: 'temperature_sensor',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], QueryIotDataDto.prototype, "deviceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum data quality score',
        example: 80,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], QueryIotDataDto.prototype, "minQuality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum data quality score',
        example: 100,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], QueryIotDataDto.prototype, "maxQuality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter processed data only',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], QueryIotDataDto.prototype, "processedOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter data with errors',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], QueryIotDataDto.prototype, "hasErrors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter archived data',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], QueryIotDataDto.prototype, "includeArchived", void 0);
exports.QueryIotDataDto = QueryIotDataDto;
class CreateAlertDto {
    constructor() {
        this.severity = 'medium';
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device identifier',
        example: 'BAACTW01',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert type',
        enum: [
            'THRESHOLD_VIOLATION',
            'DEVICE_OFFLINE',
            'DEVICE_ERROR',
            'BATTERY_LOW',
            'SIGNAL_WEAK',
            'DATA_QUALITY',
            'MAINTENANCE_REQUIRED',
            'CONFIGURATION_ERROR',
            'SECURITY_ALERT',
            'CUSTOM',
            'SYSTEM',
        ],
        example: 'THRESHOLD_VIOLATION',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)([
        'THRESHOLD_VIOLATION',
        'DEVICE_OFFLINE',
        'DEVICE_ERROR',
        'BATTERY_LOW',
        'SIGNAL_WEAK',
        'DATA_QUALITY',
        'MAINTENANCE_REQUIRED',
        'CONFIGURATION_ERROR',
        'SECURITY_ALERT',
        'CUSTOM',
        'SYSTEM',
    ]),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metric that triggered the alert',
        example: 'temperature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "metric", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Value that triggered the alert',
        example: 35.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Threshold values',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ThresholdConfigDto),
    __metadata("design:type", ThresholdConfigDto)
], CreateAlertDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert severity',
        enum: ['low', 'medium', 'high', 'critical'],
        example: 'high',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical']),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert message',
        example: 'Temperature exceeded maximum threshold',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional details',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Related data record ID',
        example: 12345,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "dataId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration time (ISO 8601)',
        example: '2024-01-16T10:30:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    (0, class_validator_1.IsISO8601)({ strict: true }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Acknowledge immediately',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAlertDto.prototype, "acknowledged", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Resolve immediately',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAlertDto.prototype, "resolved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Resolution notes',
        example: 'Manual override applied',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "resolutionNotes", void 0);
exports.CreateAlertDto = CreateAlertDto;
class ApiResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'HTTP status code', example: 200 }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response message', example: 'Success' }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thai language message',
        example: 'สำเร็จ',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message_th", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Response data' }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metadata/pagination info' }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response timestamp',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "timestamp", void 0);
exports.ApiResponseDto = ApiResponseDto;
class PaginatedResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of items' }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of items', example: 150 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number', example: 1 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page', example: 50 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages', example: 3 }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has next page', example: true }),
    __metadata("design:type", Boolean)
], PaginatedResponseDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has previous page', example: false }),
    __metadata("design:type", Boolean)
], PaginatedResponseDto.prototype, "hasPrev", void 0);
exports.PaginatedResponseDto = PaginatedResponseDto;
class ValidationGroups {
}
exports.ValidationGroups = ValidationGroups;
ValidationGroups.CREATE = 'CREATE';
ValidationGroups.UPDATE = 'UPDATE';
ValidationGroups.PARTIAL = 'PARTIAL';
ValidationGroups.BULK = 'BULK';
const class_validator_2 = require("class-validator");
function IsDateRange(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_2.registerDecorator)({
            name: 'isDateRange',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const dto = args.object;
                    if (dto.startDate && dto.endDate) {
                        const start = new Date(dto.startDate);
                        const end = new Date(dto.endDate);
                        return start <= end;
                    }
                    return true;
                },
                defaultMessage(args) {
                    return 'Start date must be before or equal to end date';
                },
            },
        });
    };
}
exports.IsDateRange = IsDateRange;
function IsDeviceId(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_2.registerDecorator)({
            name: 'isDeviceId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'string' && /^[A-Za-z0-9\-_.]+$/.test(value);
                },
                defaultMessage() {
                    return 'Device ID can only contain letters, numbers, hyphens, underscores, and periods';
                },
            },
        });
    };
}
exports.IsDeviceId = IsDeviceId;
function IsSensorValue(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_2.registerDecorator)({
            name: 'isSensorValue',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (value === null || value === undefined)
                        return true;
                    if (typeof value !== 'number')
                        return false;
                    return !isNaN(value) && isFinite(value);
                },
                defaultMessage() {
                    return 'Sensor value must be a valid number';
                },
            },
        });
    };
}
exports.IsSensorValue = IsSensorValue;
function ToLowerCase() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase();
        }
        return value;
    });
}
exports.ToLowerCase = ToLowerCase;
function ToUpperCase() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toUpperCase();
        }
        return value;
    });
}
exports.ToUpperCase = ToUpperCase;
function Trim() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
        return value;
    });
}
exports.Trim = Trim;
function ToInt() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return parseInt(value, 10);
        }
        return value;
    });
}
exports.ToInt = ToInt;
function ToFloat() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        return value;
    });
}
exports.ToFloat = ToFloat;
function ToBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value === 'true' || value === '1';
        }
        return value;
    });
}
exports.ToBoolean = ToBoolean;
function ToDate() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return new Date(value);
        }
        return value;
    });
}
exports.ToDate = ToDate;
function ToArray() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim());
        }
        return value;
    });
}
exports.ToArray = ToArray;
//# sourceMappingURL=iot-data.dto.js.map