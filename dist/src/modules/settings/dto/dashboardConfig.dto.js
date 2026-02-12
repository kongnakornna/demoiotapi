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
exports.UpdateDashboardConfigDto = exports.CreateDashboardConfigDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDashboardConfigDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDashboardConfigDto.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Dashboard' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            updated_at: "06/01/2026",
            groups: []
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDashboardConfigDto.prototype, "config", void 0);
exports.CreateDashboardConfigDto = CreateDashboardConfigDto;
class UpdateDashboardConfigDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDashboardConfigDto.prototype, "location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Dashboard' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDashboardConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            updated_at: "06/01/2026",
            groups: []
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDashboardConfigDto.prototype, "config", void 0);
exports.UpdateDashboardConfigDto = UpdateDashboardConfigDto;
//# sourceMappingURL=dashboardConfig.dto.js.map