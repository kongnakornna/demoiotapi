"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHrDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_hr_dto_1 = require("./create-hr.dto");
class UpdateHrDto extends (0, swagger_1.PartialType)(create_hr_dto_1.CreateHrDto) {
}
exports.UpdateHrDto = UpdateHrDto;
//# sourceMappingURL=update-hr.dto.js.map