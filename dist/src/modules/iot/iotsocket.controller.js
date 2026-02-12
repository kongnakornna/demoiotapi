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
var IotsocketController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotsocketController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const iot_data_service_1 = require("./iot-data.service");
let IotsocketController = IotsocketController_1 = class IotsocketController {
    constructor(iotDataService) {
        this.iotDataService = iotDataService;
        this.logger = new common_1.Logger(IotsocketController_1.name);
    }
    async handleMqttData(payload, context) {
        try {
            this.logger.log(`MQTT - Topic: ${payload.topic}, Message: ${payload.message}`);
            const deviceId = this.extractDeviceIdFromTopic(payload.topic);
            if (!deviceId) {
                throw new Error(`Cannot extract deviceId from topic: ${payload.topic}`);
            }
            const result = await this.iotDataService.processMqttData(deviceId, payload.message);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
            this.logger.log(`ประมวลผลข้อมูลสำเร็จสำหรับ ${deviceId}`);
            return {
                success: true,
                deviceId,
                dataId: result.id,
                timestamp: result.timestamp,
            };
        }
        catch (error) {
            this.logger.error(`ประมวลผลข้อมูลล้มเหลว: ${error.message}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async handleCommand(command, context) {
        try {
            this.logger.log(`ส่งคำสั่งไปยัง ${command.deviceId}: ${command.command}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
            return {
                success: true,
                deviceId: command.deviceId,
                command: command.command,
                sentAt: new Date(),
            };
        }
        catch (error) {
            this.logger.error(`ส่งคำสั่งล้มเหลว: ${error.message}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async handleDeviceStatus(status, context) {
        try {
            this.logger.log(`สถานะอุปกรณ์ ${status.deviceId}: ${status.status}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
            return {
                success: true,
                deviceId: status.deviceId,
                status: status.status,
                updatedAt: new Date(),
            };
        }
        catch (error) {
            this.logger.error(`อัปเดตสถานะล้มเหลว: ${error.message}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    extractDeviceIdFromTopic(topic) {
        const parts = topic.split('/');
        for (const part of parts) {
            if (part.startsWith('BAACTW')) {
                return part;
            }
        }
        return parts[parts.length - 1];
    }
    async handleAllDevices(data, context) {
        var _a;
        try {
            const pattern = (_a = context.getPattern) === null || _a === void 0 ? void 0 : _a.call(context);
            this.logger.warn(`ได้รับ pattern ที่ไม่รู้จัก: ${pattern}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
            return {
                success: false,
                error: `Unknown pattern: ${pattern}`,
            };
        }
        catch (error) {
            this.logger.error(`Error in handleAllDevices: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('iot.data.received'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], IotsocketController.prototype, "handleMqttData", null);
__decorate([
    (0, microservices_1.MessagePattern)('iot.command.send'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], IotsocketController.prototype, "handleCommand", null);
__decorate([
    (0, microservices_1.MessagePattern)('iot.device.status'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], IotsocketController.prototype, "handleDeviceStatus", null);
__decorate([
    (0, microservices_1.MessagePattern)('*'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.RmqContext]),
    __metadata("design:returntype", Promise)
], IotsocketController.prototype, "handleAllDevices", null);
IotsocketController = IotsocketController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [iot_data_service_1.IotDataService])
], IotsocketController);
exports.IotsocketController = IotsocketController;
//# sourceMappingURL=iotsocket.controller.js.map