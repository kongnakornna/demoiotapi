"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqliteBaseConfig = void 0;
require("dotenv/config");
require('dotenv').config();
exports.sqliteBaseConfig = {
    dialect: 'sqlite',
    storage: process.env.SQLITE_DATABASE_PATH || 'dbsqlite/data.sqlite3',
    autoLoadModels: true,
    synchronize: true,
};
//# sourceMappingURL=database.config.js.map