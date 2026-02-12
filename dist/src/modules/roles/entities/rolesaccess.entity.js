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
exports.Rolesaccess = void 0;
const typeorm_1 = require("typeorm");
let Rolesaccess = class Rolesaccess {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int4' }),
    __metadata("design:type", Number)
], Rolesaccess.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int4' }),
    __metadata("design:type", Number)
], Rolesaccess.prototype, "role_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', precision: 6, nullable: false, name: 'create' }),
    __metadata("design:type", Date)
], Rolesaccess.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', precision: 6, nullable: false, name: 'update' }),
    __metadata("design:type", Date)
], Rolesaccess.prototype, "updatedAt", void 0);
Rolesaccess = __decorate([
    (0, typeorm_1.Entity)('sd_user_roles_access', { schema: 'public' })
], Rolesaccess);
exports.Rolesaccess = Rolesaccess;
//# sourceMappingURL=rolesaccess.entity.js.map