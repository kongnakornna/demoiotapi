"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSnmpDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_snmp_dto_1 = require("./create-snmp.dto");
class UpdateSnmpDto extends (0, swagger_1.PartialType)(create_snmp_dto_1.CreateSnmpDto) {
}
exports.UpdateSnmpDto = UpdateSnmpDto;
//# sourceMappingURL=update-snmp.dto.js.map