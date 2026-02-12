"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimelineDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_timeline_dto_1 = require("./create-timeline.dto");
class UpdateTimelineDto extends (0, swagger_1.PartialType)(create_timeline_dto_1.CreateTimelineDto) {
}
exports.UpdateTimelineDto = UpdateTimelineDto;
//# sourceMappingURL=update-timeline.dto.js.map