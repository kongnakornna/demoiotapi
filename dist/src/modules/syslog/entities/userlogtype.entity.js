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
exports.UserLogtype = void 0;
const typeorm_1 = require("typeorm");
let UserLogtype = class UserLogtype {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserLogtype.prototype, "log_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserLogtype.prototype, "type_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserLogtype.prototype, "type_detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLogtype.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'create',
        type: 'timestamp',
        precision: 6,
        nullable: false
    }),
    __metadata("design:type", Date)
], UserLogtype.prototype, "create", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'update',
        type: 'timestamp',
        precision: 6,
        nullable: false
    }),
    __metadata("design:type", Date)
], UserLogtype.prototype, "update", void 0);
UserLogtype = __decorate([
    (0, typeorm_1.Entity)('sd_user_log_type', { schema: 'public' })
], UserLogtype);
exports.UserLogtype = UserLogtype;
//# sourceMappingURL=userlogtype.entity.js.map