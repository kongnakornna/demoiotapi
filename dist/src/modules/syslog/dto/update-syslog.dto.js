"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSyslogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_syslog_dto_1 = require("./create-syslog.dto");
class UpdateSyslogDto extends (0, swagger_1.PartialType)(create_syslog_dto_1.CreateSyslogDto) {
}
exports.UpdateSyslogDto = UpdateSyslogDto;
//# sourceMappingURL=update-syslog.dto.js.map