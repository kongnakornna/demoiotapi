"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ma_dto_1 = require("./create-ma.dto");
class UpdateMaDto extends (0, swagger_1.PartialType)(create_ma_dto_1.CreateMaDto) {
}
exports.UpdateMaDto = UpdateMaDto;
//# sourceMappingURL=update-ma.dto.js.map