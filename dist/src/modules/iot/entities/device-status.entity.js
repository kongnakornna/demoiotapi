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
exports.DeviceStatus = void 0;
const typeorm_1 = require("typeorm");
let DeviceStatus = class DeviceStatus {
    constructor() {
        this.previouslyOnline = false;
    }
    updateFromData(data) {
        this.lastSeen = new Date();
        this.lastData = data;
        if (data) {
            if (data.battery !== undefined) {
                this.batteryLevel = data.battery;
            }
            if (data.signal !== undefined) {
                this.signalStrength = data.signal;
            }
            if (data.temperature !== undefined) {
                this.temperature = data.temperature;
            }
            if (data.humidity !== undefined) {
                this.humidity = data.humidity;
            }
            if (data.firmware !== undefined) {
                this.firmwareVersion = data.firmware;
            }
            if (data.location) {
                this.location = Object.assign(Object.assign(Object.assign({}, this.location), data.location), { timestamp: new Date() });
            }
            if (data.network) {
                this.networkInfo = Object.assign(Object.assign({}, this.networkInfo), data.network);
            }
            if (data.hardware) {
                this.hardwareInfo = Object.assign(Object.assign({}, this.hardwareInfo), data.hardware);
            }
        }
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        this.isOnline = this.lastSeen > fifteenMinutesAgo;
        if (this.isOnline && !this.previouslyOnline) {
            this.connectionCount++;
        }
        this.previouslyOnline = this.isOnline;
    }
    getUptimePercentage(days = 7) {
        if (!this.firstSeen)
            return 100;
        const totalTime = days * 24 * 60 * 60 * 1000;
        const onlineTime = this.connectionCount * 15 * 60 * 1000;
        return Math.min(100, (onlineTime / totalTime) * 100);
    }
    getBatteryStatus() {
        const level = this.batteryLevel || 0;
        let status;
        if (level <= 10)
            status = 'critical';
        else if (level <= 25)
            status = 'low';
        else if (level <= 50)
            status = 'medium';
        else if (level <= 90)
            status = 'high';
        else
            status = 'full';
        return { level, status };
    }
    getSignalStatus() {
        const strength = this.signalStrength || -100;
        let quality;
        if (strength <= -90)
            quality = 'poor';
        else if (strength <= -75)
            quality = 'fair';
        else if (strength <= -60)
            quality = 'good';
        else
            quality = 'excellent';
        return { strength, quality };
    }
    resetMetrics() {
        this.metrics = {
            messagesReceived: 0,
            messagesSent: 0,
            errorsCount: 0,
            lastError: null,
            avgResponseTime: 0,
            maxResponseTime: 0,
        };
    }
    recordMessageReceived() {
        if (!this.metrics) {
            this.metrics = { messagesReceived: 0 };
        }
        this.metrics.messagesReceived = (this.metrics.messagesReceived || 0) + 1;
    }
    recordError(error) {
        if (!this.metrics) {
            this.metrics = { errorsCount: 0 };
        }
        this.metrics.errorsCount = (this.metrics.errorsCount || 0) + 1;
        this.metrics.lastError = error;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], DeviceStatus.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DeviceStatus.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DeviceStatus.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], DeviceStatus.prototype, "lastSeen", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "lastData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "batteryLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "signalStrength", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "humidity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], DeviceStatus.prototype, "firmwareVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "uptime", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "networkInfo", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "hardwareInfo", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceStatus.prototype, "statusMessage", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceStatus.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceStatus.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceStatus.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceStatus.prototype, "firstSeen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceStatus.prototype, "lastMaintenance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DeviceStatus.prototype, "connectionCount", void 0);
DeviceStatus = __decorate([
    (0, typeorm_1.Entity)('device_status'),
    (0, typeorm_1.Index)(['deviceId'], { unique: true }),
    (0, typeorm_1.Index)(['lastSeen']),
    (0, typeorm_1.Index)(['isOnline']),
    (0, typeorm_1.Index)(['isActive'])
], DeviceStatus);
exports.DeviceStatus = DeviceStatus;
//# sourceMappingURL=device-status.entity.js.map