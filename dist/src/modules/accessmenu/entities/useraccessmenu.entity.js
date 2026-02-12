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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Useraccessmenu = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Useraccessmenu = class Useraccessmenu {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'user_access_id' }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int4' }),
    __metadata("design:type", Number)
], Useraccessmenu.prototype, "user_access_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], Useraccessmenu.prototype, "user_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], Useraccessmenu.prototype, "menu_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], Useraccessmenu.prototype, "parent_id", void 0);
Useraccessmenu = __decorate([
    (0, typeorm_1.Entity)('sd_user_access_menu', { schema: 'public' })
], Useraccessmenu);
exports.Useraccessmenu = Useraccessmenu;
//# sourceMappingURL=useraccessmenu.entity.js.map