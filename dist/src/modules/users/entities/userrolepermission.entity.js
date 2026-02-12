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
exports.UserRolePermission = void 0;
const typeorm_1 = require("typeorm");
let UserRolePermission = class UserRolePermission {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'role_type_id', type: 'int' }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "role_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserRolePermission.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detail', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserRolePermission.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created',
        type: 'timestamp',
        precision: 6,
        comment: 'เพิ่มเมื่อ'
    }),
    __metadata("design:type", Date)
], UserRolePermission.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated',
        type: 'timestamp',
        precision: 6,
        nullable: true,
        comment: 'แก้ไขเมื่อ'
    }),
    __metadata("design:type", Date)
], UserRolePermission.prototype, "updated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'insert',
        type: 'int',
        nullable: true,
        comment: 'เพิ่มข้อมูล'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "insert", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'update',
        type: 'int',
        nullable: true,
        comment: 'แก้ไขข้อมูล'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "update", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'delete',
        type: 'int',
        nullable: true,
        comment: 'ลบข้อมูล'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "delete", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'select',
        type: 'int',
        nullable: true,
        comment: 'ดูข้อมูล'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "select", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'log',
        type: 'int',
        nullable: true,
        comment: 'จัดการประวัติ'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "log", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'config',
        type: 'int',
        nullable: true,
        comment: 'ตั้งค่าระบบ'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'truncate',
        type: 'int',
        nullable: true,
        comment: 'ล้างข้อมูล'
    }),
    __metadata("design:type", Number)
], UserRolePermission.prototype, "truncate", void 0);
UserRolePermission = __decorate([
    (0, typeorm_1.Entity)('sd_user_roles_permision', { schema: 'public' })
], UserRolePermission);
exports.UserRolePermission = UserRolePermission;
//# sourceMappingURL=userrolepermission.entity.js.map