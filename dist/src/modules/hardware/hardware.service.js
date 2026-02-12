"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareService = void 0;
const common_1 = require("@nestjs/common");
let HardwareService = class HardwareService {
    create(createHardwareDto) {
        return 'This action adds a new hardware';
    }
    findAll() {
        return `This action returns all hardware`;
    }
    findOne(id) {
        return `This action returns a #${id} hardware`;
    }
    update(id, updateHardwareDto) {
        return `This action updates a #${id} hardware`;
    }
    remove(id) {
        return `This action removes a #${id} hardware`;
    }
};
HardwareService = __decorate([
    (0, common_1.Injectable)()
], HardwareService);
exports.HardwareService = HardwareService;
//# sourceMappingURL=hardware.service.js.map