"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDataOne = exports.redisClient = exports.RedisClient = void 0;
const format = __importStar(require("../../helpers/format.helper"));
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const redis_option = process.env.REDIS_OPTION || '1';
const redis_host = process.env.REDIS_HOST || "192.168.1.37" || "192.168.1.37";
const redis_port = parseInt(process.env.REDIS_PORT, 10) || '6379';
const redis_ttl = parseInt(process.env.REDIS_TTL, 10) || undefined;
const redis_password = process.env.REDIS_PASSWORD || '';
const redis_key_file = process.env.REDIS_KEY_FILE || '';
const redis_cert = process.env.REDIS_CERT || '';
const redis_ca = process.env.REDIS_CA || '';
const { promisify } = require('util');
const axios = require('axios');
const redis = require('redis');
const ioRedis = require('ioredis');
const RedisTimeout = require('ioredis-timeout');
const moment = require('moment');
const clients = redis.createClient(redis_port, redis_host);
console.log('==============================✅ Redis createClient...================================================================');
const retRet = {
    result: true,
    remark: 'success',
    runlotime: null,
    data: [],
};
var client = null;
var isRedisConnected = false;
var client = ioRedis.createClient({
    host: redis_host,
    port: parseInt(redis_port),
    password: redis_password,
});
class RedisClient {
    constructor() {
        this.isConnected = false;
        this.initializeRedis();
    }
    initializeRedis() {
        try {
            if (this.client &&
                (this.client.status === 'connecting' || this.client.status === 'ready')) {
                console.log('⚠️ Redis client is already initialized, skipping initialization...');
                return;
            }
            const IoRedis = require('ioredis');
            this.client = new IoRedis({
                host: redis_host,
                port: redis_port,
                password: redis_password,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                enableReadyCheck: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });
            this.client.on('connect', () => {
            });
            this.client.on('ready', () => {
                this.isConnected = true;
            });
            this.client.on('error', (err) => {
                this.isConnected = false;
                console.error('🔴 Redis Error:', err.message);
            });
            this.client.on('end', () => {
                this.isConnected = false;
            });
            this.client.on('reconnecting', () => {
            });
            this.connect();
        }
        catch (error) {
            console.error('❌ Failed to initialize Redis client:', error);
        }
    }
    async connect() {
        try {
            if (!this.isConnected) {
                await this.client.connect();
                this.isConnected = true;
            }
            return true;
        }
        catch (error) {
            console.error('❌ Redis connection failed:', error);
            this.isConnected = false;
            return false;
        }
    }
    async healthCheck() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.ping();
            return true;
        }
        catch (error) {
            console.error('❌ Redis health check failed:', error);
            return false;
        }
    }
    getClient() {
        return this.client;
    }
    isReady() {
        var _a;
        return this.isConnected && ((_a = this.client) === null || _a === void 0 ? void 0 : _a.status) === 'ready';
    }
}
exports.RedisClient = RedisClient;
exports.redisClient = new RedisClient();
const clienton = client.on('ready', () => {
    console.log('Services Connecting to redis!', ' host:' +
        redis_host +
        ' port:' +
        redis_port +
        ' password :' +
        redis_password);
});
const clienterror = client.on('error', (err) => {
    console.error('❌ Failed to initialize Redis client:', err);
});
console.info('clienterror=>');
console.info(clienterror);
const redis_ready = client.ready;
console.info(redis_ready);
console.log('===============================✅ Redis:Ready process 🟡==========================');
class CacheDataOne {
    async SetCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        await client.setex(keycache, time, JSON.stringify(data));
        return keycache;
    }
    async SetCacheKey(setData) {
        const keycache = setData.keycache;
        const data = setData.data;
        await client.set(keycache, JSON.stringify(data));
        return keycache;
    }
    async UpdateCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        await client.hset(keycache, time, JSON.stringify(data));
        return keycache;
    }
    async GetCacheData(keycache) {
        const result = await promisify(client.get).bind(client)(keycache);
        const resultcache = JSON.parse(result);
        return resultcache;
    }
    async GetCacheData2(keycache) {
        try {
            const result = await client.get(keycache);
            return result;
        }
        catch (error) {
            if (error.message.includes('not a function') ||
                error.message.includes('callback')) {
                const promisifiedGet = promisify(client.get).bind(client);
                return await promisifiedGet(keycache);
            }
            throw error;
        }
    }
    async DeleteCacheData(keycache) {
        await promisify(client.del).bind(client)(keycache);
        return keycache;
    }
    async OTP(keycache) {
        let date = Date.now();
        let nowseconds = new Date().getTime();
        let timestamp = nowseconds;
        let datenew = new Date(timestamp);
        const dayth = format.toThaiDate(datenew);
        const dayen = format.toEnDate(datenew);
        const time = 30;
        const data = format.getRandomint(6);
        const keyotp = format.getRandomString(11);
        const key = keyotp;
        await client.setex(key, time, JSON.stringify(data));
        const getOTP = await promisify(client.get).bind(client)(key);
        const result_cache_OTP = JSON.parse(getOTP);
        let startDate = new Date(timestamp);
        let endDate = new Date(timestamp);
        if (startDate < endDate) {
        }
        const OTP = {
            key: key,
            time: time,
            OTP: result_cache_OTP,
            day_th: dayth,
            day_en: dayen,
            timestamp: timestamp,
            time_start: datenew,
        };
        return OTP;
    }
    async OTPTIME(keycache, ttm) {
        let date = Date.now();
        let nowseconds = new Date().getTime();
        let timestamp = nowseconds;
        let datenew = new Date(timestamp);
        const dayth = format.toThaiDate(datenew);
        const dayen = format.toEnDate(datenew);
        const data = format.getRandomint(6);
        const keyotp = format.getRandomString(11);
        const key = keyotp;
        if (ttm) {
            const time = ttm;
            await client.setex(key, time, JSON.stringify(data));
            const getOTP = await promisify(client.get).bind(client)(key);
            const result_cache_OTP = JSON.parse(getOTP);
            let startDate = new Date(timestamp);
            let endDate = new Date(timestamp);
            if (startDate < endDate) {
            }
            const OTP = {
                key: key,
                time: time,
                OTP: result_cache_OTP,
                day_th: dayth,
                day_en: dayen,
                timestamp: timestamp,
                time_start: datenew,
            };
            return OTP;
        }
        else {
            const time = 30;
            await client.setex(key, time, JSON.stringify(data));
            const getOTP = await promisify(client.get).bind(client)(key);
            const result_cache_OTP = JSON.parse(getOTP);
            let startDate = new Date(timestamp);
            let endDate = new Date(timestamp);
            if (startDate < endDate) {
            }
            const OTP = {
                key: key,
                time: time,
                OTP: result_cache_OTP,
                day_th: dayth,
                day_en: dayen,
                timestamp: timestamp,
                time_start: datenew,
            };
            return OTP;
        }
    }
    async validateOTP(setData) {
        const keycache = setData.keycache;
        const otpvalidate = setData.otpvalidate;
        const rsOTP = await promisify(client.get).bind(client)(keycache);
        const resultlocacheloOTP = JSON.parse(rsOTP);
        if (otpvalidate == resultlocacheloOTP) {
            await this.DeleteCacheData(keycache);
            let status = 1;
            return status;
        }
        else {
            let status = 0;
            return status;
        }
    }
    async validateGet(setData) {
        const keycache = setData.keycache;
        const otpvalidate = setData.otpvalidate;
        const rsOTP = await promisify(client.get).bind(client)(keycache);
        if (!rsOTP) {
            let status = 0;
            return status;
        }
        const resultlocacheloOTP = JSON.parse(rsOTP);
        if (otpvalidate == resultlocacheloOTP) {
            let status = 1;
            return status;
        }
        else {
            let status = 0;
            return status;
        }
    }
    async Run(datars) {
        const time = 30;
        const dataotp = format.getRandomint(6);
        const data = datars;
        let keyotp = format.getRandomString(8);
        const key = keyotp;
        const input = {};
        input.key = key;
        input.time = time;
        input.OTP = data;
        return input;
    }
    async OTPTIMEUSER(keycache, ttm, uid, email, username, token, roleId) {
        let date = Date.now();
        let nowseconds = new Date().getTime();
        let timestamp = nowseconds;
        let datenew = new Date(timestamp);
        const dayth = format.toThaiDate(datenew);
        const dayen = format.toEnDate(datenew);
        const data = format.getRandomint(6);
        const dataRs = {
            otp: data,
            uid: uid,
            email: email,
            username: username,
            token: token,
            roleId: roleId,
        };
        const keyotp = format.getRandomString(11);
        const key = keyotp;
        if (ttm) {
            const time = ttm;
            await client.setex(key, time, JSON.stringify(dataRs));
            const getOTP = await promisify(client.get).bind(client)(key);
            const result_cache_OTP = JSON.parse(getOTP);
            let startDate = new Date(timestamp);
            let endDate = new Date(timestamp);
            if (startDate < endDate) {
            }
            const OTP = {
                key: key,
                time: time,
                OTP: result_cache_OTP,
                day_th: dayth,
                day_en: dayen,
                timestamp: timestamp,
                time_start: datenew,
            };
            return OTP;
        }
        else {
            const time = 120;
            await client.setex(key, time, JSON.stringify(dataRs));
            const getOTP = await promisify(client.get).bind(client)(key);
            const result_cache_OTP = JSON.parse(getOTP);
            let startDate = new Date(timestamp);
            let endDate = new Date(timestamp);
            if (startDate < endDate) {
            }
            const OTP = {
                key: key,
                time: time,
                OTP: result_cache_OTP,
                day_th: dayth,
                day_en: dayen,
                timestamp: timestamp,
                time_start: datenew,
            };
            return OTP;
        }
    }
    async validateGetUser(setData) {
        const keycache = setData.keycache;
        const otpvalidate = setData.otpvalidate;
        const rsOTP = await promisify(client.get).bind(client)(keycache);
        if (!rsOTP) {
            return null;
        }
        const resultOTP = JSON.parse(rsOTP);
        const otp = resultOTP.otp;
        const resultlocacheOTP = {
            otp: resultOTP.otp,
            uid: resultOTP.uid,
            username: resultOTP.username,
            roleId: resultOTP.roleId,
            email: resultOTP.email,
            token: resultOTP.token,
        };
        if (otpvalidate === otp) {
            return resultlocacheOTP;
        }
        else {
            return null;
        }
    }
    async GetAllCacheDatakeys() {
        try {
            const keys = await promisify(client.keys).bind(client)('*');
            const allData = {};
            for (const key of keys) {
                const result = await promisify(client.get).bind(client)(key);
                if (result) {
                    allData[key] = JSON.parse(result);
                }
                else {
                    allData[key] = null;
                }
            }
            return allData;
        }
        catch (error) {
            console.error('Error getting all cache data:', error);
            throw error;
        }
    }
    async GetAllCacheDataWithScan() {
        try {
            const allData = {};
            let cursor = '0';
            do {
                const scanResult = await promisify(client.scan).bind(client)(cursor, 'MATCH', '*', 'COUNT', 100);
                cursor = scanResult[0];
                const keys = scanResult[1];
                console.log(`Scan cursor: ${cursor}, found keys: ${keys.length}`);
                for (const key of keys) {
                    const result = await promisify(client.get).bind(client)(key);
                    if (result) {
                        allData[key] = JSON.parse(result);
                    }
                    else {
                        allData[key] = null;
                    }
                }
            } while (cursor !== '0');
            return allData;
        }
        catch (error) {
            console.error('Error getting all cache data with scan:', error);
            throw error;
        }
    }
    async GetAllKeys() {
        try {
            const keys = await promisify(client.keys).bind(client)('*');
            return keys;
        }
        catch (error) {
            console.error('Error getting all keys:', error);
            throw error;
        }
    }
    async SearchKeys(pattern) {
        try {
            const keys = await promisify(client.keys).bind(client)(pattern);
            return keys;
        }
        catch (error) {
            console.error('Error searching keys:', error);
            throw error;
        }
    }
    async SearchKeysWithScan(pattern) {
        try {
            const foundKeys = [];
            let cursor = '0';
            do {
                const scanResult = await promisify(client.scan).bind(client)(cursor, 'MATCH', pattern, 'COUNT', 100);
                cursor = scanResult[0];
                const keys = scanResult[1];
                console.log(`Scan cursor: ${cursor}, found keys: ${keys.length}`);
                foundKeys.push(...keys);
            } while (cursor !== '0');
            return foundKeys;
        }
        catch (error) {
            console.error('Error searching keys with scan:', error);
            throw error;
        }
    }
    async SearchCacheData(pattern) {
        try {
            const keys = await this.SearchKeys(pattern);
            const resultData = {};
            for (const key of keys) {
                const value = await promisify(client.get).bind(client)(key);
                if (value) {
                    resultData[key] = JSON.parse(value);
                }
                else {
                    resultData[key] = null;
                }
            }
            return resultData;
        }
        catch (error) {
            console.error('Error searching cache data:', error);
            throw error;
        }
    }
    async HasKey(pattern) {
        try {
            const keys = await this.SearchKeys(pattern);
            return keys.length > 0;
        }
        catch (error) {
            console.error('Error checking key existence:', error);
            return false;
        }
    }
    async CountKeys(pattern) {
        try {
            const keys = await this.SearchKeys(pattern);
            return keys.length;
        }
        catch (error) {
            console.error('Error counting keys:', error);
            return 0;
        }
    }
    async getKeyTTL(key) {
        try {
            const ttl = await promisify(client.ttl).bind(client)(key);
            return ttl;
        }
        catch (error) {
            console.error(`Error getting TTL for key ${key}:`, error);
            return -1;
        }
    }
}
exports.CacheDataOne = CacheDataOne;
//# sourceMappingURL=redis.cache.js.map