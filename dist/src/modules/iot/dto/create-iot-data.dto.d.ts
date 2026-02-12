export declare class CreateIotDataDto {
    deviceId: string;
    data: any;
    timestamp?: Date;
    receivedAt?: Date;
    location?: {
        latitude?: number;
        longitude?: number;
        altitude?: number;
        accuracy?: number;
        address?: string;
    };
    metadata?: {
        source?: string;
        protocol?: string;
        topic?: string;
        clientId?: string;
        ipAddress?: string;
        [key: string]: any;
    };
    dataType?: string;
    dataQuality?: number;
    calculatedValues?: any;
    tags?: any;
}
