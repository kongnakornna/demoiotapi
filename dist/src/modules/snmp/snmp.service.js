"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpService = void 0;
const common_1 = require("@nestjs/common");
let SnmpService = class SnmpService {
    create(createSnmpDto) {
        return 'This action adds a new snmp';
    }
    findAll() {
        return `This action returns all snmp`;
    }
    findOne(id) {
        return `This action returns a #${id} snmp`;
    }
    update(id, updateSnmpDto) {
        return `This action updates a #${id} snmp`;
    }
    remove(id) {
        return `This action removes a #${id} snmp`;
    }
};
SnmpService = __decorate([
    (0, common_1.Injectable)()
], SnmpService);
exports.SnmpService = SnmpService;
//# sourceMappingURL=snmp.service.js.map