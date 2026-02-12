"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHardwareDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_hardware_dto_1 = require("./create-hardware.dto");
class UpdateHardwareDto extends (0, swagger_1.PartialType)(create_hardware_dto_1.CreateHardwareDto) {
}
exports.UpdateHardwareDto = UpdateHardwareDto;
//# sourceMappingURL=update-hardware.dto.js.map