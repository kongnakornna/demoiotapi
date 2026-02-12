"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmAsyncConfig = void 0;
const common_config_1 = __importDefault(require("./common.config"));
exports.typeOrmAsyncConfig = {
    useFactory: async () => (0, common_config_1.default)(),
};
//# sourceMappingURL=db2.js.map