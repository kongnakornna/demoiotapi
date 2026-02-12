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
var DeviceAlert_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceAlert = void 0;
const typeorm_1 = require("typeorm");
let DeviceAlert = DeviceAlert_1 = class DeviceAlert {
    static createThresholdAlert(deviceId, metric, value, threshold, severity = 'medium') {
        const alert = new DeviceAlert_1();
        alert.deviceId = deviceId;
        alert.type = 'THRESHOLD_VIOLATION';
        alert.metric = metric;
        alert.value = value;
        alert.threshold = threshold;
        alert.severity = severity;
        const isLow = threshold.min !== undefined && value < threshold.min;
        alert.message =
            `${metric} value ${value} is ${isLow ? 'below' : 'above'} threshold ` +
                `[${threshold.min || '-∞'}, ${threshold.max || '∞'}]`;
        alert.details = {
            violationType: isLow ? 'LOW' : 'HIGH',
            value,
            threshold,
        };
        return alert;
    }
    static createDeviceOfflineAlert(deviceId, lastSeen, timeoutMinutes) {
        const alert = new DeviceAlert_1();
        alert.deviceId = deviceId;
        alert.type = 'DEVICE_OFFLINE';
        alert.severity = 'high';
        alert.message = `Device ${deviceId} has been offline for more than ${timeoutMinutes} minutes`;
        alert.details = {
            lastSeen,
            timeoutMinutes,
            currentTime: new Date(),
        };
        return alert;
    }
    static createBatteryLowAlert(deviceId, batteryLevel, threshold = 20) {
        const alert = new DeviceAlert_1();
        alert.deviceId = deviceId;
        alert.type = 'BATTERY_LOW';
        alert.metric = 'battery';
        alert.value = batteryLevel;
        alert.severity = batteryLevel <= 10 ? 'critical' : 'high';
        alert.message = `Device ${deviceId} battery is low: ${batteryLevel}%`;
        alert.details = {
            batteryLevel,
            threshold,
            status: batteryLevel <= 10 ? 'CRITICAL' : 'LOW',
        };
        return alert;
    }
    acknowledge(user) {
        this.acknowledged = true;
        this.acknowledgedBy = user;
        this.acknowledgedAt = new Date();
    }
    resolve(user, notes) {
        this.resolved = true;
        this.resolvedBy = user;
        this.resolvedAt = new Date();
        this.resolutionNotes = notes;
    }
    escalate() {
        if (!this.escalation) {
            this.escalation = {
                level: 1,
                notifiedAt: [new Date()],
            };
        }
        else {
            this.escalation.level++;
            this.escalation.notifiedAt.push(new Date());
        }
        this.escalation.nextEscalationAt = new Date(Date.now() + 60 * 60 * 1000);
    }
    incrementNotificationCount() {
        this.notificationCount++;
    }
    shouldEscalate() {
        var _a;
        if (!((_a = this.escalation) === null || _a === void 0 ? void 0 : _a.nextEscalationAt))
            return false;
        return new Date() >= this.escalation.nextEscalationAt;
    }
    getDuration() {
        if (this.resolved && this.resolvedAt && this.createdAt) {
            return this.resolvedAt.getTime() - this.createdAt.getTime();
        }
        return Date.now() - this.createdAt.getTime();
    }
    getFormattedDuration() {
        const duration = this.getDuration();
        const seconds = Math.floor(duration / 1000);
        if (seconds < 60) {
            return `${seconds} seconds`;
        }
        else if (seconds < 3600) {
            return `${Math.floor(seconds / 60)} minutes`;
        }
        else if (seconds < 86400) {
            return `${Math.floor(seconds / 3600)} hours`;
        }
        else {
            return `${Math.floor(seconds / 86400)} days`;
        }
    }
    isExpired() {
        if (!this.expiresAt)
            return false;
        return new Date() > this.expiresAt;
    }
    toJSON() {
        return {
            id: this.id,
            deviceId: this.deviceId,
            type: this.type,
            metric: this.metric,
            value: this.value,
            severity: this.severity,
            message: this.message,
            resolved: this.resolved,
            acknowledged: this.acknowledged,
            createdAt: this.createdAt,
            duration: this.getFormattedDuration(),
            details: this.details,
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceAlert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "metric", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], DeviceAlert.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceAlert.prototype, "threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'low' }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceAlert.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DeviceAlert.prototype, "resolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "resolutionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "resolvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceAlert.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DeviceAlert.prototype, "acknowledged", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceAlert.prototype, "acknowledgedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceAlert.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceAlert.prototype, "escalation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DeviceAlert.prototype, "dataId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceAlert.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceAlert.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceAlert.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DeviceAlert.prototype, "notificationCount", void 0);
DeviceAlert = DeviceAlert_1 = __decorate([
    (0, typeorm_1.Entity)('device_alert'),
    (0, typeorm_1.Index)(['deviceId', 'createdAt']),
    (0, typeorm_1.Index)(['type', 'severity']),
    (0, typeorm_1.Index)(['resolved', 'createdAt']),
    (0, typeorm_1.Index)(['metric', 'createdAt'])
], DeviceAlert);
exports.DeviceAlert = DeviceAlert;
//# sourceMappingURL=device-alert.entity.js.map