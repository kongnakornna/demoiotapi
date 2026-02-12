"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsService = void 0;
const common_1 = require("@nestjs/common");
let AppsService = class AppsService {
    create(createAppDto) {
        return 'This action adds a new app';
    }
    findAll() {
        return `This action returns all apps`;
    }
    findOne(id) {
        return `This action returns a #${id} app`;
    }
    update(id, updateAppDto) {
        return `This action updates a #${id} app`;
    }
    remove(id) {
        return `This action removes a #${id} app`;
    }
};
AppsService = __decorate([
    (0, common_1.Injectable)()
], AppsService);
exports.AppsService = AppsService;
//# sourceMappingURL=apps.service.js.map