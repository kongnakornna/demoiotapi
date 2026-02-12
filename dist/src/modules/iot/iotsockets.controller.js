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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IotsocketsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotsocketsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const iotsocket_gateway_1 = require("./iotsocket.gateway");
let IotsocketsController = IotsocketsController_1 = class IotsocketsController {
    constructor(iotGateway) {
        this.iotGateway = iotGateway;
        this.logger = new common_1.Logger(IotsocketsController_1.name);
    }
    async getIndex(res, dto, query, headers, params, req) {
        this.logger.log('GET /v1/iotsockets called');
        res.status(common_1.HttpStatus.OK).json({
            statusCode: common_1.HttpStatus.OK,
            code: common_1.HttpStatus.OK,
            payload: [],
            message: 'iotsocket endpoint',
            message_th: 'iotsocket endpoint',
        });
    }
    handleMqttData(data) {
        this.logger.log('Received MQTT Data:', data);
        this.iotGateway.broadcastMqttData('BAACTW01/DATA', data);
        return { received: true, data };
    }
    handleCommandLog(data) {
        this.logger.log('Command Log:', data);
        this.iotGateway.broadcast('command_log', Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
        return { received: true };
    }
    handleConfigUpdate(data) {
        this.logger.log('Config Update:', data);
        this.iotGateway.broadcast('config_update', Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
        return { received: true };
    }
    getDeviceStatus(deviceId) {
        this.logger.log(`GET status for device: ${deviceId}`);
        const statusData = {
            deviceId,
            status: 'online',
            lastUpdate: new Date().toISOString(),
            message: 'ดึงข้อมูลสถานะอุปกรณ์สำเร็จ',
        };
        this.iotGateway.broadcast('device_status', statusData);
        return statusData;
    }
    controlDevice(commandDto) {
        this.logger.log('Control command received:', commandDto);
        const commandData = {
            action: commandDto.action,
            target: commandDto.target,
            status: 'pending',
            timestamp: new Date().toISOString(),
        };
        this.iotGateway.broadcast('command_log', commandData);
        return {
            success: true,
            message: `ส่งคำสั่ง ${commandDto.action} ไปยังอุปกรณ์แล้ว`,
            data: commandDto,
            timestamp: new Date().toISOString(),
        };
    }
    updateConfig(id, configData) {
        this.logger.log(`Update config for device ${id}:`, configData);
        const updateData = {
            deviceId: id,
            newConfig: configData,
            timestamp: new Date().toISOString(),
        };
        this.iotGateway.broadcast('config_update', updateData);
        return {
            id,
            updated: true,
            newConfig: configData,
            timestamp: new Date().toISOString(),
        };
    }
    getConnectedClients() {
        this.logger.log('GET connected clients');
        return {
            message: 'Use WebSocket to get connected clients info',
            endpoint: 'Connect via ws://your-domain/iot and send "get_clients" message',
        };
    }
    healthCheck() {
        return {
            status: 'healthy',
            gateway: 'IotsocketGateway',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __param(4, (0, common_1.Param)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IotsocketsController.prototype, "getIndex", null);
__decorate([
    (0, microservices_1.MessagePattern)('BAACTW01/DATA'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "handleMqttData", null);
__decorate([
    (0, microservices_1.MessagePattern)('COMMAND_LOG'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "handleCommandLog", null);
__decorate([
    (0, microservices_1.MessagePattern)('CONFIG_UPDATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "handleConfigUpdate", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('deviceid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "getDeviceStatus", null);
__decorate([
    (0, common_1.Post)('control'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "controlDevice", null);
__decorate([
    (0, common_1.Put)('config/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('clients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "getConnectedClients", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IotsocketsController.prototype, "healthCheck", null);
IotsocketsController = IotsocketsController_1 = __decorate([
    (0, common_1.Controller)('v1/iotsockets'),
    __metadata("design:paramtypes", [iotsocket_gateway_1.IotsocketGateway])
], IotsocketsController);
exports.IotsocketsController = IotsocketsController;
//# sourceMappingURL=iotsockets.controller.js.map