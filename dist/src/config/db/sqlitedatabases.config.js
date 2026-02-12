"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqliteBaseConfigs = void 0;
require("dotenv/config");
require('dotenv').config();
exports.sqliteBaseConfigs = {
    dialect: 'sqlite',
    storage: process.env.SQLITE_DATABASE_PATH || 'src/dbsqlite/data.sqlite3',
    autoLoadModels: true,
    synchronize: true,
};
//# sourceMappingURL=sqlitedatabases.config.js.map