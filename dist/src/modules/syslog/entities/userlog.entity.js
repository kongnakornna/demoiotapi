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
exports.UserLog = void 0;
const typeorm_1 = require("typeorm");
let UserLog = class UserLog {
    constructor() {
        this.lang = 'en';
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], UserLog.prototype, "log_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', length: 0, nullable: false }),
    __metadata("design:type", String)
], UserLog.prototype, "uid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserLog.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserLog.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLog.prototype, "select_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLog.prototype, "insert_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLog.prototype, "update_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLog.prototype, "delete_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int4', nullable: true }),
    __metadata("design:type", Number)
], UserLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], UserLog.prototype, "lang", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'create',
        type: 'timestamp',
        precision: 6,
        nullable: false
    }),
    __metadata("design:type", Date)
], UserLog.prototype, "create", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'update',
        type: 'timestamp',
        precision: 6,
        nullable: false
    }),
    __metadata("design:type", Date)
], UserLog.prototype, "update", void 0);
UserLog = __decorate([
    (0, typeorm_1.Entity)('sd_user_log', { schema: 'public' })
], UserLog);
exports.UserLog = UserLog;
//# sourceMappingURL=userlog.entity.js.map