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
exports.ResetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ResetDto {
    constructor() {
        this.role_id = 1;
        this.username = 'root';
        this.email = 'root@cmon.com';
        this.password = 'Root@#59';
        this.status = 1;
        this.active_status = 1;
        this.loginfailed = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'role_ids' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ResetDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email of login' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }),
    __metadata("design:type", String)
], ResetDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'active status' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ResetDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'active status' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ResetDto.prototype, "active_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'active status',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ResetDto.prototype, "loginfailed", void 0);
exports.ResetDto = ResetDto;
//# sourceMappingURL=Reset.dto.js.map