"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require('dotenv').config();
console.log('===============================Redis ready process================================================================');
const MONGODB_URL_APP = 'mongodb://' +
    process.env.MONGODB_URL +
    ':' +
    process.env.MONGODB_PORT +
    ':' +
    '/' +
    process.env.MONGODB_DB;
const mongoose_base_url = 'mongodb://' +
    process.env.MONGODB_URL +
    ':' +
    process.env.MONGODB_PORT +
    '/' +
    process.env.MONGODB_DB;
console.log('mongoose_base_url: ' + mongoose_base_url);
//# sourceMappingURL=mongodb.lib.js.map