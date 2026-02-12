"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGeoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_geo_dto_1 = require("./create-geo.dto");
class UpdateGeoDto extends (0, swagger_1.PartialType)(create_geo_dto_1.CreateGeoDto) {
}
exports.UpdateGeoDto = UpdateGeoDto;
//# sourceMappingURL=update-geo.dto.js.map