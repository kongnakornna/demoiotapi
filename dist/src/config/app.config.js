"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => {
    var _a, _b;
    return ({
        port: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3003,
        host: (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost',
    });
});
//# sourceMappingURL=app.config.js.map