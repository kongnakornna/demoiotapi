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
exports.CommandLog = void 0;
const typeorm_1 = require("typeorm");
let CommandLog = class CommandLog {
    markAsSent() {
        this.status = 'sent';
        this.sentAt = new Date();
    }
    markAsExecuted(response) {
        this.status = 'executed';
        this.executedAt = new Date();
        if (response) {
            this.response = response;
        }
    }
    markAsFailed(error) {
        this.status = 'failed';
        this.failedAt = new Date();
        this.error = error;
    }
    markAsCancelled() {
        this.status = 'cancelled';
    }
    isPending() {
        return this.status === 'pending';
    }
    isExecuted() {
        return this.status === 'executed';
    }
    getExecutionTime() {
        if (this.issuedAt && this.executedAt) {
            return this.executedAt.getTime() - this.issuedAt.getTime();
        }
        return null;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CommandLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], CommandLog.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CommandLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CommandLog.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CommandLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'pending' }),
    __metadata("design:type", String)
], CommandLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], CommandLog.prototype, "issuedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 45, nullable: true }),
    __metadata("design:type", String)
], CommandLog.prototype, "clientIp", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CommandLog.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], CommandLog.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CommandLog.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], CommandLog.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], CommandLog.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], CommandLog.prototype, "failedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CommandLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CommandLog.prototype, "updatedAt", void 0);
CommandLog = __decorate([
    (0, typeorm_1.Entity)('command_log'),
    (0, typeorm_1.Index)(['deviceId', 'issuedAt']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['issuedAt'])
], CommandLog);
exports.CommandLog = CommandLog;
//# sourceMappingURL=command-log.entity.js.map