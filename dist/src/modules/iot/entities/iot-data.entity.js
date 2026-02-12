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
var IotData_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotData = void 0;
const typeorm_1 = require("typeorm");
const device_alert_entity_1 = require("./device-alert.entity");
let IotData = IotData_1 = class IotData {
    constructor() {
        this.timestamp = new Date();
        this.data = {};
        this.metadata = {};
    }
    setDefaultTimestamp() {
        if (!this.timestamp) {
            this.timestamp = new Date();
        }
    }
    static createFromRawData(deviceId, rawData) {
        const iotData = new IotData_1();
        iotData.deviceId = deviceId;
        iotData.timestamp = new Date();
        try {
            const values = rawData.split(',').map((v) => v.trim());
            iotData.data = {
                temperature: parseFloat(values[0]) || null,
                value1: parseInt(values[1], 10) || 0,
                value2: parseInt(values[2], 10) || 0,
                value3: parseInt(values[3], 10) || 0,
                value4: parseInt(values[4], 10) || 0,
                value5: parseInt(values[5], 10) || 0,
                value6: parseInt(values[6], 10) || 0,
                value7: parseInt(values[7], 10) || 0,
                value8: parseInt(values[8], 10) || 0,
                raw: rawData,
            };
            iotData.metadata = {
                source: 'mqtt',
                version: '1.0',
                quality: 100,
                processingTime: 0,
                validated: true,
                parsedAt: new Date(),
            };
        }
        catch (error) {
            iotData.data = { raw: rawData, error: error.message };
            iotData.metadata = {
                source: 'mqtt',
                validated: false,
                error: 'Parse failed',
            };
        }
        return iotData;
    }
    extractValue(metric) {
        if (metric.includes('.')) {
            const keys = metric.split('.');
            let value = this.data;
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                }
                else {
                    return null;
                }
            }
            return typeof value === 'number' ? value : null;
        }
        return typeof this.data[metric] === 'number' ? this.data[metric] : null;
    }
    hasMetric(metric) {
        return this.extractValue(metric) !== null;
    }
    getMetrics() {
        const extractKeys = (obj, prefix = '') => {
            let keys = [];
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (obj[key] &&
                    typeof obj[key] === 'object' &&
                    !Array.isArray(obj[key])) {
                    keys = [...keys, ...extractKeys(obj[key], fullKey)];
                }
                else if (typeof obj[key] === 'number') {
                    keys.push(fullKey);
                }
            }
            return keys;
        };
        return extractKeys(this.data);
    }
    validate() {
        const errors = [];
        if (!this.deviceId) {
            errors.push('Device ID is required');
        }
        if (!this.data) {
            errors.push('Data is required');
        }
        if (!this.timestamp) {
            errors.push('Timestamp is required');
        }
        else if (this.timestamp > new Date()) {
            errors.push('Timestamp cannot be in the future');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    toJSON() {
        return {
            id: this.id,
            deviceId: this.deviceId,
            data: this.data,
            timestamp: this.timestamp,
            location: this.location,
            metadata: this.metadata,
            createdAt: this.createdAt,
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IotData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], IotData.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], IotData.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], IotData.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], IotData.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], IotData.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], IotData.prototype, "dataType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], IotData.prototype, "dataQuality", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IotData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_alert_entity_1.DeviceAlert, (alert) => alert.dataId),
    __metadata("design:type", Array)
], IotData.prototype, "alerts", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotData.prototype, "setDefaultTimestamp", null);
IotData = IotData_1 = __decorate([
    (0, typeorm_1.Entity)('iot_data'),
    (0, typeorm_1.Index)(['deviceId', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp']),
    (0, typeorm_1.Index)(['deviceId', 'createdAt']),
    __metadata("design:paramtypes", [])
], IotData);
exports.IotData = IotData;
//# sourceMappingURL=iot-data.entity.js.map