"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
require("dotenv/config");
require('dotenv').config();
exports.default = (0, config_1.registerAs)('refresh-jwt', () => ({
    secret: process.env.SECRET_KEY,
    expiresIn: '365d',
}));
//# sourceMappingURL=refresh-jwt.config.js.map