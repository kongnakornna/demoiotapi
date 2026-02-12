"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
require("dotenv/config");
require('dotenv').config();
function commonConfig() {
    const devConfig = {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    };
    const prodConfig = {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    };
    const sslConfig = process.env.DATABASE_HOST === '192.168.1.40'
        ? false
        : { rejectUnauthorized: false };
    return Object.assign({ name: 'postgres', type: 'postgres', logging: true, synchronize: false, ssl: sslConfig, entities: [(0, path_1.join)(__dirname, '../../**/*.entity{.ts,.js}')], migrations: ['@root/migrations/**/*{.ts,.js}'] }, (process.env.NODE_ENV === 'production' ? prodConfig : devConfig));
}
exports.default = commonConfig;
//# sourceMappingURL=postgres.config.js.map