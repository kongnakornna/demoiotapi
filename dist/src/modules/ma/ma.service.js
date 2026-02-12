"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaService = void 0;
const common_1 = require("@nestjs/common");
let MaService = class MaService {
    create(createMaDto) {
        return 'This action adds a new ma';
    }
    findAll() {
        return `This action returns all ma`;
    }
    findOne(id) {
        return `This action returns a #${id} ma`;
    }
    update(id, updateMaDto) {
        return `This action updates a #${id} ma`;
    }
    remove(id) {
        return `This action removes a #${id} ma`;
    }
};
MaService = __decorate([
    (0, common_1.Injectable)()
], MaService);
exports.MaService = MaService;
//# sourceMappingURL=ma.service.js.map