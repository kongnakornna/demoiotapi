"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_iot_dto_1 = require("./create-iot.dto");
class UpdateIotDto extends (0, swagger_1.PartialType)(create_iot_dto_1.CreateIotDto) {
}
exports.UpdateIotDto = UpdateIotDto;
//# sourceMappingURL=update-iot.dto.js.map