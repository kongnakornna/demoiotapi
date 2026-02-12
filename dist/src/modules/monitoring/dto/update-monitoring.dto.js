"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMonitoringDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_monitoring_dto_1 = require("./create-monitoring.dto");
class UpdateMonitoringDto extends (0, swagger_1.PartialType)(create_monitoring_dto_1.CreateMonitoringDto) {
}
exports.UpdateMonitoringDto = UpdateMonitoringDto;
//# sourceMappingURL=update-monitoring.dto.js.map