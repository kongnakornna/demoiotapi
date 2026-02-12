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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcommingeventsController = void 0;
const common_1 = require("@nestjs/common");
const upcommingevents_service_1 = require("./upcommingevents.service");
const create_upcommingevent_dto_1 = require("./dto/create-upcommingevent.dto");
const update_upcommingevent_dto_1 = require("./dto/update-upcommingevent.dto");
let UpcommingeventsController = class UpcommingeventsController {
    constructor(upcommingeventsService) {
        this.upcommingeventsService = upcommingeventsService;
    }
    create(createUpcommingeventDto) {
        return this.upcommingeventsService.create(createUpcommingeventDto);
    }
    findAll() {
        return this.upcommingeventsService.findAll();
    }
    findOne(id) {
        return this.upcommingeventsService.findOne(+id);
    }
    update(id, updateUpcommingeventDto) {
        return this.upcommingeventsService.update(+id, updateUpcommingeventDto);
    }
    remove(id) {
        return this.upcommingeventsService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_upcommingevent_dto_1.CreateUpcommingeventDto]),
    __metadata("design:returntype", void 0)
], UpcommingeventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UpcommingeventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UpcommingeventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_upcommingevent_dto_1.UpdateUpcommingeventDto]),
    __metadata("design:returntype", void 0)
], UpcommingeventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UpcommingeventsController.prototype, "remove", null);
UpcommingeventsController = __decorate([
    (0, common_1.Controller)('upcommingevents'),
    __metadata("design:paramtypes", [upcommingevents_service_1.UpcommingeventsService])
], UpcommingeventsController);
exports.UpcommingeventsController = UpcommingeventsController;
//# sourceMappingURL=upcommingevents.controller.js.map