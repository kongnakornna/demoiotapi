"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcommingeventsService = void 0;
const common_1 = require("@nestjs/common");
let UpcommingeventsService = class UpcommingeventsService {
    create(createUpcommingeventDto) {
        return 'This action adds a new upcommingevent';
    }
    findAll() {
        return `This action returns all upcommingevents`;
    }
    findOne(id) {
        return `This action returns a #${id} upcommingevent`;
    }
    update(id, updateUpcommingeventDto) {
        return `This action updates a #${id} upcommingevent`;
    }
    remove(id) {
        return `This action removes a #${id} upcommingevent`;
    }
};
UpcommingeventsService = __decorate([
    (0, common_1.Injectable)()
], UpcommingeventsService);
exports.UpcommingeventsService = UpcommingeventsService;
//# sourceMappingURL=upcommingevents.service.js.map