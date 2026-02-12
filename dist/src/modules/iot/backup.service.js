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
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const BackupManager = require('influx-backup');
const InfluxDB_url = process.env.INFLUX_URL;
const InfluxDB_token = process.env.INFLUX_TOKEN;
const InfluxDB_org = process.env.INFLUX_ORG || 'cmon_org';
const InfluxDB_bucket = process.env.INFLUX_BUCKET || 'cmon_bucket';
const InfluxDB_username = process.env.INFLUXDB_USERNAME || 'admin';
const InfluxDB_password = process.env.INFLUXDB_PASSWORD || 'Na@0955@#@#';
console.log('===============================influxdb Client Start=============================================================');
let BackupService = class BackupService {
    constructor() {
        this.manager = new BackupManager({ db: InfluxDB_org });
    }
    async handleBackup() {
        try {
            await this.manager.backup();
            console.log('InfluxDB backup completed.');
        }
        catch (error) {
            console.error('InfluxDB backup failed:', error);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupService.prototype, "handleBackup", null);
BackupService = __decorate([
    (0, common_1.Injectable)()
], BackupService);
exports.BackupService = BackupService;
//# sourceMappingURL=backup.service.js.map