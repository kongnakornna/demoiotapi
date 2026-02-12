"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsController = void 0;
const common_1 = require("@nestjs/common");
const os_service_1 = require("./os.service");
const os = __importStar(require("os"));
const osu = __importStar(require("node-os-utils"));
const check_disk_space_1 = __importDefault(require("check-disk-space"));
let OsController = class OsController {
    constructor(osService) {
        this.osService = osService;
    }
    async getMemoryInfoss(res, query, headers, params, req) {
        try {
            const totalMemory = os.totalmem();
            const freeMemory = os.freemem();
            const cpuUsage = await osu.cpu.usage();
            const path = os.platform() === 'win32' ? 'C:' : '/';
            const usedMemory = totalMemory - freeMemory;
            const usedMemoryPercentage = (usedMemory / totalMemory) * 100;
            const memoryUsage = process.memoryUsage();
            const { heapUsed, heapTotal } = memoryUsage;
            const heapUsagePercentage = (heapUsed / heapTotal) * 100;
            const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);
            const diskSpace = await (0, check_disk_space_1.default)(path);
            const total = diskSpace.size;
            const free = diskSpace.free;
            const used = total - free;
            const usedPercentage = (used / total) * 100;
            const toGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2);
            var Rs = {
                platform: os.platform(),
                type: os.type(),
                release: os.release(),
                version: os.version(),
                architecture: os.arch(),
                hostname: os.hostname(),
                uptime: os.uptime(),
                userInfo: os.userInfo(),
                cpuUsage: cpuUsage,
                cpuUsage_percen: `${cpuUsage}%`,
                totalMemory: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                usedMemory: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                freeMemory: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
                usedMemoryPercentage: `${usedMemoryPercentage.toFixed(2)}%`,
                heapUsed: `${toMB(heapUsed)} MB`,
                heapTotal: `${toMB(heapTotal)} MB`,
                heapUsagePercentage: `${heapUsagePercentage.toFixed(2)}%`,
                diskPath: diskSpace.diskPath,
                disktotal: `${toGB(total)} GB`,
                diskfree: `${toGB(free)} GB`,
                diskused: `${toGB(used)} GB`,
                diskusedPercentage: `${usedPercentage.toFixed(2)}%`,
            };
            res.status(200).json({
                statusCode: 200,
                code: 200,
                payload: {
                    data: Rs,
                },
                message: 'memory.',
                message_th: 'memory.',
            });
        }
        catch (error) {
            return { error: 'Failed to retrieve disk space information.' };
        }
    }
    async getMemoryInfo(res, query, headers, params, req) {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        var Rs = {
            totalMemory,
            freeMemory,
            usedMemory: totalMemory - freeMemory,
            freeMemoryPercentage: (freeMemory / totalMemory) * 100,
        };
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: Rs,
            },
            message: 'memory.',
            message_th: 'memory.',
        });
    }
    async getCpuUsage(res, query, headers, params, req) {
        const cpu = osu.cpu;
        const usage = await cpu.usage();
        var Rs = { usage: `${usage}%` };
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: Rs,
            },
            message: 'cpu usage.',
            message_th: 'cpu usage.',
        });
    }
    async getMemoryInfos(res, query, headers, params, req) {
        const mem = osu.mem;
        const info = await mem.info();
        var Rs = info;
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: Rs,
            },
            message: 'memory info.',
            message_th: 'memory info.',
        });
    }
    async getDiskSpace(res, query, headers, params, req) {
        const path = process.platform === 'win32' ? 'C:' : '/';
        const diskSpace = await (0, check_disk_space_1.default)(path);
        var Rs = diskSpace;
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: Rs,
            },
            message: 'diskspace.',
            message_th: 'diskspace.',
        });
    }
    async getAppCpuUsage(res, query, headers, params, req) {
        const usage = process.cpuUsage();
        const cpuUsage = (usage.user + usage.system) / 1000000;
        var rt = { cpuUsage: `${cpuUsage}s` };
        var Rs = rt;
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: Rs,
            },
            message: 'app cpu usage.',
            message_th: 'app cpu usage.',
        });
    }
    async getAppMemoryUsage(res, query, headers, params, req) {
        const usage = process.memoryUsage();
        var rss = {
            rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`,
        };
        res.status(200).json({
            statusCode: 200,
            code: 200,
            payload: {
                data: rss,
            },
            message: 'app memory usage.',
            message_th: 'app memory usage.',
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getMemoryInfoss", null);
__decorate([
    (0, common_1.Get)('memory'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getMemoryInfo", null);
__decorate([
    (0, common_1.Get)('cpuusage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getCpuUsage", null);
__decorate([
    (0, common_1.Get)('memoryinfo'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getMemoryInfos", null);
__decorate([
    (0, common_1.Get)('diskspace'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getDiskSpace", null);
__decorate([
    (0, common_1.Get)('appcpuusage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getAppCpuUsage", null);
__decorate([
    (0, common_1.Get)('appmemoryusage'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Param)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OsController.prototype, "getAppMemoryUsage", null);
OsController = __decorate([
    (0, common_1.Controller)('os'),
    __metadata("design:paramtypes", [os_service_1.OsService])
], OsController);
exports.OsController = OsController;
//# sourceMappingURL=os.controller.js.map