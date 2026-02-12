"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
require("dotenv/config");
require('dotenv').config();
function commonConfig() {
    const devConfig = {
        name: 'Postgres_Connection',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: null,
    };
    const prodConfig = {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    };
    JSON.stringify(devConfig);
    JSON.stringify(prodConfig);
    return Object.assign({ name: 'Postgres_Connection', type: 'postgres', logging: true, synchronize: true, entities: [(0, path_1.join)(__dirname, '../../**/*.entity{.ts,.js}')], migrations: [
            '@root/migrations/**/*{.ts,.js}',
        ] }, (process.env.NODE_ENV === 'production' ? prodConfig : devConfig));
}
exports.default = commonConfig;
//# sourceMappingURL=common.config.js.map