import { Device } from '@src/modules/settings/entities/device.entity';
export declare class ReportData {
    id: number;
    DeviceId: number;
    Device: Device;
    templateId: number;
    reportType: string;
    data: any;
    periodStart: Date;
    periodEnd: Date;
    generatedAt: Date;
    filePath: string;
    fileFormat: string;
    isExported: boolean;
    exportedAt: Date;
    createdAt: Date;
}
