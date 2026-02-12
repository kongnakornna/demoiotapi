"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require('dotenv').config();
const DB_DC_RD_SERVER1 = process.env.REDIS_HOST_SERVER1;
const DB_DC_RD_SERVER2 = process.env.REDIS_HOST_SERVER2;
const DB_DC_RD_SERVER3 = process.env.REDIS_HOST_SERVER3;
const REDIS_HOST_PORT1 = process.env.REDIS_HOST_PORT1;
const REDIS_HOST_PORT2 = process.env.REDIS_HOST_PORT2;
const REDIS_HOST_PORT3 = process.env.REDIS_HOST_PORT3;
const REDIS_HOST_PASSWORD = process.env.REDIS_HOST_PASSWORD;
let objConfig = {
    host: [],
    option: {
        timeout: 3000,
        redisOptions: {
            password: null,
        },
    },
};
try {
    switch (process.env.NODE_ENV) {
        case 'canary':
        case 'staging':
        case 'production':
            objConfig = {
                host: [
                    {
                        host: DB_DC_RD_SERVER1,
                        port: parseInt(REDIS_HOST_PORT1),
                    },
                    {
                        host: DB_DC_RD_SERVER2,
                        port: parseInt(REDIS_HOST_PORT2),
                    },
                    {
                        host: DB_DC_RD_SERVER3,
                        port: parseInt(REDIS_HOST_PORT3),
                    },
                ],
                option: {
                    timeout: 3000,
                    redisOptions: {
                        password: REDIS_HOST_PASSWORD,
                    },
                },
            };
            break;
        case 'development':
            objConfig = {
                host: [
                    {
                        host: DB_DC_RD_SERVER1,
                        port: parseInt(REDIS_HOST_PORT1),
                    },
                    {
                        host: DB_DC_RD_SERVER2,
                        port: parseInt(REDIS_HOST_PORT2),
                    },
                    {
                        host: DB_DC_RD_SERVER3,
                        port: parseInt(REDIS_HOST_PORT3),
                    },
                ],
                option: {
                    timeout: 3000,
                    redisOptions: {
                        password: REDIS_HOST_PASSWORD,
                    },
                },
            };
            break;
        case 'local':
            objConfig = {
                host: [
                    {
                        host: DB_DC_RD_SERVER1,
                        port: parseInt(REDIS_HOST_PORT1),
                    },
                    {
                        host: DB_DC_RD_SERVER2,
                        port: parseInt(REDIS_HOST_PORT2),
                    },
                    {
                        host: DB_DC_RD_SERVER3,
                        port: parseInt(REDIS_HOST_PORT3),
                    },
                ],
                option: {
                    timeout: 3000,
                    redisOptions: {
                        password: REDIS_HOST_PASSWORD,
                    },
                },
            };
            break;
    }
}
catch (err) {
    console.error('Cache Redis Cluster Config error  :', `${err.stack}`);
}
finally {
    const ioRedis = require('ioredis');
    const RedisTimeout = require('ioredis-timeout');
    let client = null;
    client = new ioRedis.Cluster(objConfig.host, objConfig.option);
    const Timeout = RedisTimeout(client, objConfig.option.timeout);
    console.log('Timeout', Timeout);
    client.on('ready', () => {
    });
    client.on('error', (err) => {
    });
}
exports.default = objConfig;
//# sourceMappingURL=rediscluster-config.cache.js.map