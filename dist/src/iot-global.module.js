"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotGlobalModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const device_status_entity_1 = require("./modules/iot/entities/device-status.entity");
const iot_data_entity_1 = require("./modules/iot/entities/iot-data.entity");
const activity_log_entity_1 = require("./modules/iot/entities/activity-log.entity");
const deviceio_service_1 = require("./modules/iot/deviceio.service");
const iotsocketio_service_1 = require("./modules/iot/iotsocketio.service");
const ENV = process.env.NODE_ENV;
let IotGlobalModule = class IotGlobalModule {
};
IotGlobalModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([iot_data_entity_1.IotData, device_status_entity_1.DeviceStatus, activity_log_entity_1.ActivityLog])],
        providers: [deviceio_service_1.DeviceioService],
        exports: [iotsocketio_service_1.IotioService],
    })
], IotGlobalModule);
exports.IotGlobalModule = IotGlobalModule;
//# sourceMappingURL=iot-global.module.js.map