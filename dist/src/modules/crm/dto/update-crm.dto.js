"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCrmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_crm_dto_1 = require("./create-crm.dto");
class UpdateCrmDto extends (0, swagger_1.PartialType)(create_crm_dto_1.CreateCrmDto) {
}
exports.UpdateCrmDto = UpdateCrmDto;
//# sourceMappingURL=update-crm.dto.js.map