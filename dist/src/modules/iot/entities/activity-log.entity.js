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
var ActivityLog_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const typeorm_1 = require("typeorm");
let ActivityLog = ActivityLog_1 = class ActivityLog {
    static createFromError(error, type, details, deviceId, userId, data) {
        const log = new ActivityLog_1();
        log.type = type;
        log.deviceId = deviceId;
        log.userId = userId;
        log.details = details;
        log.data = data || {};
        log.severity = 'error';
        log.timestamp = new Date();
        log.stackTrace = error.stack || error.message;
        return log;
    }
    static createInfo(type, details, deviceId, userId, data) {
        const log = new ActivityLog_1();
        log.type = type;
        log.deviceId = deviceId;
        log.userId = userId;
        log.details = details;
        log.data = data || {};
        log.severity = 'info';
        log.timestamp = new Date();
        return log;
    }
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            deviceId: this.deviceId,
            userId: this.userId,
            details: this.details,
            data: this.data,
            severity: this.severity,
            timestamp: this.timestamp,
            createdAt: this.createdAt,
        };
    }
    isError() {
        return this.severity === 'error' || this.severity === 'critical';
    }
    getFormattedTimestamp() {
        return this.timestamp.toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'info' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 45, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "correlationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ActivityLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "stackTrace", void 0);
ActivityLog = ActivityLog_1 = __decorate([
    (0, typeorm_1.Entity)('activity_log'),
    (0, typeorm_1.Index)(['type', 'timestamp']),
    (0, typeorm_1.Index)(['deviceId', 'timestamp']),
    (0, typeorm_1.Index)(['userId', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp'])
], ActivityLog);
exports.ActivityLog = ActivityLog;
//# sourceMappingURL=activity-log.entity.js.map