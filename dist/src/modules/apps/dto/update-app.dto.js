"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_app_dto_1 = require("./create-app.dto");
class UpdateAppDto extends (0, swagger_1.PartialType)(create_app_dto_1.CreateAppDto) {
}
exports.UpdateAppDto = UpdateAppDto;
//# sourceMappingURL=update-app.dto.js.map