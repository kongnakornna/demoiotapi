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
exports.DeviceConfig = void 0;
const typeorm_1 = require("typeorm");
let DeviceConfig = class DeviceConfig {
    getConfigValue(path, defaultValue) {
        const keys = path.split('.');
        let current = this.config;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            }
            else {
                return defaultValue;
            }
        }
        return current !== undefined ? current : defaultValue;
    }
    setConfigValue(path, value) {
        const keys = path.split('.');
        let current = this.config;
        if (!current) {
            this.config = {};
            current = this.config;
        }
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;
    }
    mergeConfig(newConfig) {
        this.config = this.deepMerge(this.config || {}, newConfig);
    }
    deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        output[key] = source[key];
                    }
                    else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                }
                else {
                    output[key] = source[key];
                }
            });
        }
        return output;
    }
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    validate() {
        const errors = [];
        if (!this.deviceId) {
            errors.push('Device ID is required');
        }
        if (this.config) {
            if (this.config.reporting) {
                if (this.config.reporting.interval !== undefined &&
                    this.config.reporting.interval < 1) {
                    errors.push('Reporting interval must be at least 1 second');
                }
            }
            if (this.config.thresholds) {
                Object.entries(this.config.thresholds).forEach(([metric, range]) => {
                    if (range.min !== undefined &&
                        range.max !== undefined &&
                        range.min >= range.max) {
                        errors.push(`Threshold for ${metric}: min must be less than max`);
                    }
                });
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], DeviceConfig.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], DeviceConfig.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'active' }),
    __metadata("design:type", String)
], DeviceConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceConfig.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceConfig.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], DeviceConfig.prototype, "lastAppliedAt", void 0);
DeviceConfig = __decorate([
    (0, typeorm_1.Entity)('device_config'),
    (0, typeorm_1.Index)(['deviceId'], { unique: true })
], DeviceConfig);
exports.DeviceConfig = DeviceConfig;
//# sourceMappingURL=device-config.entity.js.map