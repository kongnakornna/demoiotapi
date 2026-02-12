export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}
export interface DeviceFilterParams {
    deviceId?: string;
    deviceIds?: string[];
    deviceType?: string;
}
export declare class SensorDataDto {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    voltage?: number;
    current?: number;
    power?: number;
    energy?: number;
    battery?: number;
    signal?: number;
    co2?: number;
    tvoc?: number;
    pm2_5?: number;
    pm10?: number;
    light?: number;
    uv?: number;
    noise?: number;
    status?: string;
    errorCode?: number;
    errorMessage?: string;
    custom?: Record<string, any>;
}
export declare class LocationDto {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    floor?: string;
    room?: string;
}
export declare class MetadataDto {
    source?: string;
    protocol?: string;
    topic?: string;
    clientId?: string;
    messageId?: string;
    ipAddress?: string;
    port?: number;
    gatewayId?: string;
    networkType?: string;
    firmwareVersion?: string;
    hardwareVersion?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    customerId?: string;
    projectId?: string;
    siteId?: string;
    locationId?: string;
    quality?: number;
    processingTime?: number;
    custom?: Record<string, any>;
}
export declare class CreateIotDataDto {
    deviceId: string;
    data: SensorDataDto;
    timestamp?: string;
    receivedAt?: string;
    location?: LocationDto;
    metadata?: MetadataDto;
    dataType?: string;
    dataQuality?: number;
    calculatedValues?: Record<string, any>;
    tags?: Record<string, any>;
    validationRules?: Record<string, any>;
}
export declare class UpdateIotDataDto {
    isActive?: boolean;
    isProcessed?: boolean;
    tags?: string[];
    data?: any;
    metadata?: any;
    validated?: boolean;
}
export declare class CommandParametersDto {
    relay?: number;
    state?: string;
    duration?: number;
    pwm?: number;
    temperature?: number;
    interval?: number;
    custom?: Record<string, any>;
}
export declare class ControlDeviceDto {
    deviceId: string;
    action: string;
    parameters?: CommandParametersDto;
    priority?: string;
    timeout?: number;
    requireAck?: boolean;
    scheduleAt?: string;
    metadata?: Record<string, any>;
    issuedBy?: string;
}
export declare class ReportingConfigDto {
    enabled?: boolean;
    interval?: number;
    format?: string;
    batchSize?: number;
    maxRetries?: number;
    retryInterval?: number;
}
export declare class SensorConfigDto {
    enabled?: boolean;
    unit?: string;
    precision?: number;
    samplingRate?: number;
    offset?: number;
    multiplier?: number;
}
export declare class ThresholdConfigDto {
    min?: number;
    max?: number;
    warningMin?: number;
    warningMax?: number;
    criticalMin?: number;
    criticalMax?: number;
    hysteresis?: number;
}
export declare class AlertConfigDto {
    enabled?: boolean;
    email?: string[];
    sms?: string[];
    webhook?: string;
    escalationEnabled?: boolean;
    escalationLevels?: number;
    escalationInterval?: number;
}
export declare class CommunicationConfigDto {
    protocol?: string;
    endpoint?: string;
    port?: number;
    topic?: string;
    qos?: number;
    retain?: boolean;
    username?: string;
    password?: string;
    ssl?: boolean;
    keepAlive?: number;
}
export declare class PowerConfigDto {
    sleepMode?: boolean;
    sleepInterval?: number;
    wakeupInterval?: number;
    batterySave?: boolean;
    lowBatteryThreshold?: number;
    criticalBatteryThreshold?: number;
}
export declare class UpdateConfigDto {
    reporting?: ReportingConfigDto;
    sensors?: Record<string, SensorConfigDto>;
    thresholds?: Record<string, ThresholdConfigDto>;
    alerts?: AlertConfigDto;
    communication?: CommunicationConfigDto;
    power?: PowerConfigDto;
    custom?: Record<string, any>;
}
export declare class GeneralConfigDto {
    deviceName?: string;
    description?: string;
    timezone?: string;
    location?: LocationDto;
    group?: string;
    tags?: string[];
}
export declare class FirmwareConfigDto {
    version?: string;
    autoUpdate?: boolean;
    updateUrl?: string;
    checkInterval?: number;
    channel?: string;
}
export declare class ExportDataDto {
    deviceId?: string;
    startDate?: string;
    endDate?: string;
    format?: string;
    fields?: string[];
    includeHeaders?: boolean;
    compress?: boolean;
    limit?: number;
    dataType?: string;
    minQuality?: number;
    sortOrder?: string;
    timezone?: string;
}
export declare class SearchDataDto {
    query?: string;
    deviceId?: string;
    field?: string;
    page?: number;
    limit?: number;
    exactMatch?: boolean;
    caseSensitive?: boolean;
    startDate?: string;
    endDate?: string;
}
export declare class QueryIotDataDto implements PaginationParams, DateRangeParams, DeviceFilterParams {
    page?: number;
    limit?: number;
    deviceId?: string;
    deviceIds?: string[];
    startDate?: string;
    endDate?: string;
    dataType?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    fields?: string[];
    deviceType?: string;
    minQuality?: number;
    maxQuality?: number;
    processedOnly?: boolean;
    hasErrors?: boolean;
    includeArchived?: boolean;
}
export declare class CreateAlertDto {
    deviceId: string;
    type: string;
    metric?: string;
    value?: number;
    threshold?: ThresholdConfigDto;
    severity?: string;
    message: string;
    details?: Record<string, any>;
    dataId?: number;
    expiresAt?: string;
    acknowledged?: boolean;
    resolved?: boolean;
    resolutionNotes?: string;
}
export declare class ApiResponseDto<T> {
    statusCode: number;
    message: string;
    message_th?: string;
    data?: T;
    meta?: any;
    timestamp: string;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ValidationGroups {
    static readonly CREATE = "CREATE";
    static readonly UPDATE = "UPDATE";
    static readonly PARTIAL = "PARTIAL";
    static readonly BULK = "BULK";
}
import { ValidationOptions } from 'class-validator';
export declare function IsDateRange(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsDeviceId(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsSensorValue(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function ToLowerCase(): PropertyDecorator;
export declare function ToUpperCase(): PropertyDecorator;
export declare function Trim(): PropertyDecorator;
export declare function ToInt(): PropertyDecorator;
export declare function ToFloat(): PropertyDecorator;
export declare function ToBoolean(): PropertyDecorator;
export declare function ToDate(): PropertyDecorator;
export declare function ToArray(): PropertyDecorator;
