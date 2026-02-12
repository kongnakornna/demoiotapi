"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManualDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_manual_dto_1 = require("./create-manual.dto");
class UpdateManualDto extends (0, swagger_1.PartialType)(create_manual_dto_1.CreateManualDto) {
}
exports.UpdateManualDto = UpdateManualDto;
//# sourceMappingURL=update-manual.dto.js.map