"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChartDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_chart_dto_1 = require("./create-chart.dto");
class UpdateChartDto extends (0, swagger_1.PartialType)(create_chart_dto_1.CreateChartDto) {
}
exports.UpdateChartDto = UpdateChartDto;
//# sourceMappingURL=update-chart.dto.js.map