"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaModule = void 0;
const common_1 = require("@nestjs/common");
const ma_service_1 = require("./ma.service");
const ma_controller_1 = require("./ma.controller");
let MaModule = class MaModule {
};
MaModule = __decorate([
    (0, common_1.Module)({
        controllers: [ma_controller_1.MaController],
        providers: [ma_service_1.MaService],
    })
], MaModule);
exports.MaModule = MaModule;
//# sourceMappingURL=ma.module.js.map