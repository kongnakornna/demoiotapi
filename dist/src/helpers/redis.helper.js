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
exports.cacheDataOne = exports.CacheDataOne = exports.redisHelper = exports.RedisHelper = void 0;
const format = __importStar(require("./format.helper"));
require("dotenv/config");
const common_1 = require("@nestjs/common");
const API_VERSION = '1';
const redis_option = process.env.REDIS_OPTION || '1';
const redis_host = process.env.REDIS_HOST || '172.25.99.10';
const redis_port = parseInt(process.env.REDIS_PORT, 10) || 6379;
const redis_ttl = parseInt(process.env.REDIS_TTL, 10) || undefined;
const redis_password = process.env.REDIS_PASSWORD || '';
const redis_key_file = process.env.REDIS_KEY_FILE || '';
const redis_cert = process.env.REDIS_CERT || '';
const redis_ca = process.env.REDIS_CA || '';
const moment = require('moment');
class RedisHelper {
    constructor() {
        this.isConnected = false;
        this.isInitialized = false;
        this.connectionPromise = null;
        this.logger = new common_1.Logger(RedisHelper.name);
        this.IoRedis = require('ioredis');
    }
    static getInstance() {
        if (!RedisHelper.instance) {
            RedisHelper.instance = new RedisHelper();
        }
        return RedisHelper.instance;
    }
    async initialize() {
        if (this.isInitialized && this.isConnected) {
            console.log('🟢 Redis already initialized and connected');
            return;
        }
        if (this.connectionPromise) {
            console.log('🟡 Redis connection in progress, waiting...');
            await this.connectionPromise;
            return;
        }
        this.connectionPromise = this.initializeRedis();
        await this.connectionPromise;
        this.connectionPromise = null;
    }
    async initializeRedis() {
        try {
            console.log('🟡 Initializing Redis connection...');
            if (this.client) {
                try {
                    await this.client.quit();
                }
                catch (e) {
                }
            }
            this.client = new this.IoRedis({
                host: redis_host,
                port: redis_port,
                password: redis_password,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });
            this.pubClient = new this.IoRedis({
                host: redis_host,
                port: redis_port,
                password: redis_password,
            });
            this.subClient = new this.IoRedis({
                host: redis_host,
                port: redis_port,
                password: redis_password,
            });
            this.setupEventHandlers();
            await new Promise((resolve, reject) => {
                this.client.once('ready', () => {
                    console.log('✅ Redis main client connected and ready');
                    resolve();
                });
                this.client.once('error', (err) => {
                    console.error('❌ Redis main client connection failed:', err);
                    reject(err);
                });
            });
            await Promise.all([
                new Promise((resolve) => {
                    this.pubClient.once('ready', () => {
                        console.log('✅ Redis pub client ready');
                        resolve();
                    });
                }),
                new Promise((resolve) => {
                    this.subClient.once('ready', () => {
                        console.log('✅ Redis sub client ready');
                        resolve();
                    });
                }),
            ]);
            this.isConnected = true;
            this.isInitialized = true;
            console.log('🎉 All Redis clients connected successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Redis:', error);
            this.isConnected = false;
            this.isInitialized = false;
            throw error;
        }
    }
    setupEventHandlers() {
        this.client.on('connect', () => {
            console.log('🟢 Redis main client connecting...');
        });
        this.client.on('ready', () => {
            this.isConnected = true;
            console.log('✅ Redis main client ready');
        });
        this.client.on('error', (err) => {
            this.isConnected = false;
            console.error('🔴 Redis main client error:', err.message);
        });
        this.client.on('end', () => {
            this.isConnected = false;
            console.log('🔴 Redis main client connection closed');
        });
        this.client.on('reconnecting', () => {
            console.log('🟡 Redis main client reconnecting...');
        });
        this.pubClient.on('error', (err) => {
            console.error('🔴 Redis pub client error:', err.message);
        });
        this.subClient.on('error', (err) => {
            console.error('🔴 Redis sub client error:', err.message);
        });
    }
    async connect() {
        try {
            if (!this.isConnected) {
                await this.initialize();
            }
            return true;
        }
        catch (error) {
            console.error('❌ Redis connection failed:', error);
            return false;
        }
    }
    async healthCheck() {
        try {
            if (!this.client || !this.isConnected) {
                await this.connect();
            }
            const result = await this.client.ping();
            return result === 'PONG';
        }
        catch (error) {
            console.error('❌ Redis health check failed:', error);
            return false;
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error('Redis client not initialized. Call initialize() first.');
        }
        return this.client;
    }
    getPubClient() {
        if (!this.pubClient) {
            throw new Error('Redis pub client not initialized. Call initialize() first.');
        }
        return this.pubClient;
    }
    getSubClient() {
        if (!this.subClient) {
            throw new Error('Redis sub client not initialized. Call initialize() first.');
        }
        return this.subClient;
    }
    isReady() {
        var _a;
        return this.isConnected && ((_a = this.client) === null || _a === void 0 ? void 0 : _a.status) === 'ready';
    }
    async disconnect() {
        try {
            if (this.client) {
                await this.client.quit();
            }
            if (this.pubClient) {
                await this.pubClient.quit();
            }
            if (this.subClient) {
                await this.subClient.quit();
            }
            this.isConnected = false;
            this.isInitialized = false;
            console.log('✅ All Redis clients disconnected');
        }
        catch (error) {
            console.error('❌ Error disconnecting Redis:', error);
        }
    }
    async clearAllCache() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log('🔄 Clearing all Redis cache...');
            await this.client.flushall();
            this.logger.log('✅ All Redis cache cleared successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to clear Redis cache:', error);
            return false;
        }
    }
    async clearCurrentDBCache() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log('🔄 Clearing current Redis database cache...');
            await this.client.flushdb();
            this.logger.log('✅ Current Redis database cache cleared successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to clear current Redis database cache:', error);
            return false;
        }
    }
    async clearCacheByPattern(pattern) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log(`🔄 Clearing cache with pattern: ${pattern}`);
            const keys = await this.client.keys(pattern);
            if (keys.length === 0) {
                this.logger.log(`ℹ️ No keys found with pattern: ${pattern}`);
                return 0;
            }
            const deletedCount = await this.client.del(...keys);
            this.logger.log(`✅ Deleted ${deletedCount} keys with pattern: ${pattern}`);
            return deletedCount;
        }
        catch (error) {
            console.error(`❌ Failed to clear cache with pattern ${pattern}:`, error);
            return 0;
        }
    }
    async clearMultipleCache(keys) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            if (keys.length === 0) {
                return 0;
            }
            const deletedCount = await this.client.del(...keys);
            this.logger.log(`✅ Deleted ${deletedCount} of ${keys.length} keys`);
            return deletedCount;
        }
        catch (error) {
            console.error('❌ Failed to clear multiple cache:', error);
            return 0;
        }
    }
    async clearCacheByPatternSafely(pattern, batchSize = 100) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log(`🔄 Safely clearing cache with pattern: ${pattern} (batch size: ${batchSize})`);
            const keys = await this.client.keys(pattern);
            const totalKeys = keys.length;
            if (totalKeys === 0) {
                this.logger.log(`ℹ️ No keys found with pattern: ${pattern}`);
                return { totalDeleted: 0, batches: 0 };
            }
            let totalDeleted = 0;
            let batchesProcessed = 0;
            for (let i = 0; i < totalKeys; i += batchSize) {
                const batch = keys.slice(i, i + batchSize);
                if (batch.length > 0) {
                    const deletedInBatch = await this.client.del(...batch);
                    totalDeleted += deletedInBatch;
                    batchesProcessed++;
                    this.logger.log(`Processed batch ${batchesProcessed}: deleted ${deletedInBatch} keys ` +
                        `(${Math.round(((i + batch.length) / totalKeys) * 100)}%)`);
                    if (i + batchSize < totalKeys) {
                        await new Promise((resolve) => setTimeout(resolve, 10));
                    }
                }
            }
            this.logger.log(`✅ Safely cleared cache: ${totalDeleted}/${totalKeys} keys deleted ` +
                `in ${batchesProcessed} batches`);
            return { totalDeleted, batches: batchesProcessed };
        }
        catch (error) {
            console.error(`❌ Failed to safely clear cache with pattern ${pattern}:`, error);
            return { totalDeleted: 0, batches: 0 };
        }
    }
    async clearExpiredCache() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log('🔄 Checking for expired cache...');
            const keys = await this.client.keys('*');
            let expiredCount = 0;
            for (const key of keys) {
                const ttl = await this.client.ttl(key);
                if (ttl === -2) {
                    expiredCount++;
                }
                else if (ttl === -1) {
                    continue;
                }
            }
            this.logger.log(`✅ Expired cache check completed: ` +
                `checked ${keys.length} keys, ${expiredCount} already expired`);
            return { checked: keys.length, expired: expiredCount };
        }
        catch (error) {
            console.error('❌ Failed to check expired cache:', error);
            return { checked: 0, expired: 0 };
        }
    }
    async clearCacheByTags(tags) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            this.logger.log(`🔄 Clearing cache with tags: ${tags.join(', ')}`);
            let totalDeleted = 0;
            for (const tag of tags) {
                const tagKey = `tag:${tag}`;
                const taggedKeys = await this.client.smembers(tagKey);
                if (taggedKeys.length > 0) {
                    const deleted = await this.client.del(...taggedKeys);
                    totalDeleted += deleted;
                    await this.client.del(tagKey);
                    this.logger.log(`  Tag "${tag}": deleted ${deleted} keys`);
                }
            }
            this.logger.log(`✅ Cleared cache by tags: ${totalDeleted} total keys deleted`);
            return totalDeleted;
        }
        catch (error) {
            console.error(`❌ Failed to clear cache by tags:`, error);
            return 0;
        }
    }
    async tagCache(key, tags) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            for (const tag of tags) {
                const tagKey = `tag:${tag}`;
                await this.client.sadd(tagKey, key);
            }
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to tag cache key ${key}:`, error);
            return false;
        }
    }
    async getCacheStats() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const info = await this.client.info();
            const infoLines = info.split('\r\n');
            let totalKeys = 0;
            let usedMemory = '0';
            let dbSize = 0;
            for (const line of infoLines) {
                if (line.startsWith('db0:keys=')) {
                    totalKeys = parseInt(line.split('=')[1]);
                }
                else if (line.startsWith('used_memory_human:')) {
                    usedMemory = line.split(':')[1].trim();
                }
                else if (line.startsWith('keyspace_db0:')) {
                    const match = line.match(/keys=(\d+)/);
                    if (match) {
                        dbSize = parseInt(match[1]);
                    }
                }
            }
            return {
                totalKeys,
                memoryUsage: usedMemory,
                connected: this.isConnected,
                databaseSize: dbSize,
            };
        }
        catch (error) {
            console.error('❌ Failed to get cache stats:', error);
            return {
                totalKeys: 0,
                memoryUsage: '0',
                connected: this.isConnected,
                databaseSize: 0,
            };
        }
    }
    async set(key, value, ttl) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            if (ttl && ttl > 0) {
                await this.client.setex(key, ttl, JSON.stringify(value));
            }
            else {
                await this.client.set(key, JSON.stringify(value));
            }
            return true;
        }
        catch (error) {
            console.error(`Redis set error for key ${key}:`, error);
            return false;
        }
    }
    async get(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error(`Redis get error for key ${key}:`, error);
            return null;
        }
    }
    async del(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.del(key);
            return true;
        }
        catch (error) {
            console.error(`Redis del error for key ${key}:`, error);
            return false;
        }
    }
    async exists(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            console.error(`Redis exists error for key ${key}:`, error);
            return false;
        }
    }
    async expire(key, ttl) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.expire(key, ttl);
            return true;
        }
        catch (error) {
            console.error(`Redis expire error for key ${key}:`, error);
            return false;
        }
    }
    async ttl(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.ttl(key);
        }
        catch (error) {
            console.error(`Redis ttl error for key ${key}:`, error);
            return -2;
        }
    }
    async lpush(key, ...values) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.lpush(key, ...values);
        }
        catch (error) {
            console.error(`Redis lpush error for key ${key}:`, error);
            throw error;
        }
    }
    async rpush(key, ...values) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.rpush(key, ...values);
        }
        catch (error) {
            console.error(`Redis rpush error for key ${key}:`, error);
            throw error;
        }
    }
    async lpop(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.lpop(key);
        }
        catch (error) {
            console.error(`Redis lpop error for key ${key}:`, error);
            throw error;
        }
    }
    async rpop(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.rpop(key);
        }
        catch (error) {
            console.error(`Redis rpop error for key ${key}:`, error);
            throw error;
        }
    }
    async lrange(key, start, stop) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.lrange(key, start, stop);
        }
        catch (error) {
            console.error(`Redis lrange error for key ${key}:`, error);
            throw error;
        }
    }
    async lrem(key, count, value) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.lrem(key, count, value);
        }
        catch (error) {
            console.error(`Redis lrem error for key ${key}:`, error);
            throw error;
        }
    }
    async llen(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.llen(key);
        }
        catch (error) {
            console.error(`Redis llen error for key ${key}:`, error);
            throw error;
        }
    }
    async lindex(key, index) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.lindex(key, index);
        }
        catch (error) {
            console.error(`Redis lindex error for key ${key}:`, error);
            throw error;
        }
    }
    async lset(key, index, value) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.lset(key, index, value);
        }
        catch (error) {
            console.error(`Redis lset error for key ${key}:`, error);
            throw error;
        }
    }
    async ltrim(key, start, stop) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.ltrim(key, start, stop);
        }
        catch (error) {
            console.error(`Redis ltrim error for key ${key}:`, error);
            throw error;
        }
    }
    async hset(key, field, value) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.hset(key, field, JSON.stringify(value));
        }
        catch (error) {
            console.error(`Redis hset error for key ${key}, field ${field}:`, error);
            throw error;
        }
    }
    async hget(key, field) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const data = await this.client.hget(key, field);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error(`Redis hget error for key ${key}, field ${field}:`, error);
            throw error;
        }
    }
    async hgetall(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const data = await this.client.hgetall(key);
            const result = {};
            for (const [field, value] of Object.entries(data)) {
                try {
                    result[field] = JSON.parse(value);
                }
                catch (_a) {
                    result[field] = value;
                }
            }
            return result;
        }
        catch (error) {
            console.error(`Redis hgetall error for key ${key}:`, error);
            throw error;
        }
    }
    async hdel(key, ...fields) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.hdel(key, ...fields);
        }
        catch (error) {
            console.error(`Redis hdel error for key ${key}:`, error);
            throw error;
        }
    }
    async hexists(key, field) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return (await this.client.hexists(key, field)) === 1;
        }
        catch (error) {
            console.error(`Redis hexists error for key ${key}, field ${field}:`, error);
            throw error;
        }
    }
    async sadd(key, ...members) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.sadd(key, ...members);
        }
        catch (error) {
            console.error(`Redis sadd error for key ${key}:`, error);
            throw error;
        }
    }
    async smembers(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.smembers(key);
        }
        catch (error) {
            console.error(`Redis smembers error for key ${key}:`, error);
            throw error;
        }
    }
    async srem(key, ...members) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.srem(key, ...members);
        }
        catch (error) {
            console.error(`Redis srem error for key ${key}:`, error);
            throw error;
        }
    }
    async sismember(key, member) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return (await this.client.sismember(key, member)) === 1;
        }
        catch (error) {
            console.error(`Redis sismember error for key ${key}, member ${member}:`, error);
            throw error;
        }
    }
    async scard(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.scard(key);
        }
        catch (error) {
            console.error(`Redis scard error for key ${key}:`, error);
            throw error;
        }
    }
    async zadd(key, ...args) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.zadd(key, ...args);
        }
        catch (error) {
            console.error(`Redis zadd error for key ${key}:`, error);
            throw error;
        }
    }
    async zrange(key, start, stop, withScores = false) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            if (withScores) {
                return await this.client.zrange(key, start, stop, 'WITHSCORES');
            }
            return await this.client.zrange(key, start, stop);
        }
        catch (error) {
            console.error(`Redis zrange error for key ${key}:`, error);
            throw error;
        }
    }
    async zrem(key, ...members) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.zrem(key, ...members);
        }
        catch (error) {
            console.error(`Redis zrem error for key ${key}:`, error);
            throw error;
        }
    }
    async publish(channel, message) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.pubClient.publish(channel, JSON.stringify(message));
        }
        catch (error) {
            console.error(`Redis publish error for channel ${channel}:`, error);
            return 0;
        }
    }
    subscribe(channel, callback) {
        try {
            if (!this.isConnected) {
                console.warn('Redis not connected, cannot subscribe');
                return;
            }
            this.subClient.subscribe(channel, (err) => {
                if (err) {
                    console.error(`Redis subscribe error for channel ${channel}:`, err);
                    return;
                }
                console.log(`✅ Subscribed to channel: ${channel}`);
            });
            this.subClient.on('message', (ch, msg) => {
                if (ch === channel) {
                    try {
                        const parsed = JSON.parse(msg);
                        callback(parsed);
                    }
                    catch (error) {
                        console.error(`Error parsing message from channel ${channel}:`, error);
                    }
                }
            });
        }
        catch (error) {
            console.error(`Redis subscribe error for channel ${channel}:`, error);
        }
    }
    unsubscribe(channel) {
        try {
            if (this.subClient) {
                this.subClient.unsubscribe(channel);
                console.log(`✅ Unsubscribed from channel: ${channel}`);
            }
        }
        catch (error) {
            console.error(`Redis unsubscribe error for channel ${channel}:`, error);
        }
    }
    async pipeline(operations) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const pipeline = this.client.pipeline();
            operations.forEach((op) => {
                pipeline[op.command](...op.args);
            });
            const results = await pipeline.exec();
            return results.map(([err, result]) => {
                if (err)
                    throw err;
                return result;
            });
        }
        catch (error) {
            console.error('Redis pipeline error:', error);
            throw error;
        }
    }
    async multi(operations) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            const multi = this.client.multi();
            operations.forEach((op) => {
                multi[op.command](...op.args);
            });
            const results = await multi.exec();
            return results.map(([err, result]) => {
                if (err)
                    throw err;
                return result;
            });
        }
        catch (error) {
            console.error('Redis multi error:', error);
            throw error;
        }
    }
    async keys(pattern) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.keys(pattern);
        }
        catch (error) {
            console.error(`Redis keys error for pattern ${pattern}:`, error);
            throw error;
        }
    }
    async flushall() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.flushall();
        }
        catch (error) {
            console.error('Redis flushall error:', error);
            throw error;
        }
    }
    async flushdb() {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.flushdb();
        }
        catch (error) {
            console.error('Redis flushdb error:', error);
            throw error;
        }
    }
    async incr(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.incr(key);
        }
        catch (error) {
            console.error(`Redis incr error for key ${key}:`, error);
            throw error;
        }
    }
    async decr(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.decr(key);
        }
        catch (error) {
            console.error(`Redis decr error for key ${key}:`, error);
            throw error;
        }
    }
    async incrby(key, increment) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.incrby(key, increment);
        }
        catch (error) {
            console.error(`Redis incrby error for key ${key}:`, error);
            throw error;
        }
    }
    async decrby(key, decrement) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.decrby(key, decrement);
        }
        catch (error) {
            console.error(`Redis decrby error for key ${key}:`, error);
            throw error;
        }
    }
    async SetCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        return await this.set(keycache, data, time);
    }
    async SetCacheKey(setData) {
        const keycache = setData.keycache;
        const data = setData.data;
        return await this.set(keycache, data);
    }
    async UpdateCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        const client = this.getClient();
        await client.hset(keycache, time.toString(), JSON.stringify(data));
        return keycache;
    }
    async GetCacheData(keycache) {
        return await this.get(keycache);
    }
    async GetCacheData2(keycache) {
        return await this.get(keycache);
    }
    async DeleteCacheData(keycache) {
        return await this.del(keycache);
    }
    async OTP(keycache) {
        const time = 30;
        const data = format.getRandomint(6);
        const keyotp = format.getRandomString(11);
        const key = keyotp;
        const nowseconds = new Date().getTime();
        const timestamp = nowseconds;
        const datenew = new Date(timestamp);
        const dayth = format.toThaiDate(datenew);
        const dayen = format.toEnDate(datenew);
        await this.set(key, data, time);
        const OTP = {
            key: key,
            time: time,
            OTP: data,
            day_th: dayth,
            day_en: dayen,
            timestamp: timestamp,
            time_start: datenew,
        };
        return OTP;
    }
    async GetAllCacheDatakeys() {
        const client = this.getClient();
        try {
            const keys = await client.keys('*');
            const allData = {};
            for (const key of keys) {
                const result = await client.get(key);
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
}
exports.RedisHelper = RedisHelper;
exports.redisHelper = RedisHelper.getInstance();
class CacheDataOne {
    constructor() {
        this.helper = exports.redisHelper;
    }
    async SetCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        return await this.helper.set(keycache, data, time);
    }
    async SetCacheKey(setData) {
        const keycache = setData.keycache;
        const data = setData.data;
        return await this.helper.set(keycache, data);
    }
    async UpdateCacheData(setData) {
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        const client = this.helper.getClient();
        await client.hset(keycache, time.toString(), JSON.stringify(data));
        return keycache;
    }
    async GetCacheData(keycache) {
        return await this.helper.get(keycache);
    }
    async GetCacheData2(keycache) {
        return await this.helper.get(keycache);
    }
    async DeleteCacheData(keycache) {
        return await this.helper.del(keycache);
    }
    async OTP(keycache) {
        const time = 30;
        const data = format.getRandomint(6);
        const keyotp = format.getRandomString(11);
        const key = keyotp;
        const nowseconds = new Date().getTime();
        const timestamp = nowseconds;
        const datenew = new Date(timestamp);
        const dayth = format.toThaiDate(datenew);
        const dayen = format.toEnDate(datenew);
        await this.helper.set(key, data, time);
        const OTP = {
            key: key,
            time: time,
            OTP: data,
            day_th: dayth,
            day_en: dayen,
            timestamp: timestamp,
            time_start: datenew,
        };
        return OTP;
    }
    async lpush(key, ...values) {
        return await this.helper.lpush(key, ...values);
    }
    async lrange(key, start, stop) {
        return await this.helper.lrange(key, start, stop);
    }
    async lrem(key, count, value) {
        return await this.helper.lrem(key, count, value);
    }
    async rpush(key, ...values) {
        return await this.helper.rpush(key, ...values);
    }
    async lpop(key) {
        return await this.helper.lpop(key);
    }
    async rpop(key) {
        return await this.helper.rpop(key);
    }
    async llen(key) {
        return await this.helper.llen(key);
    }
    async lindex(key, index) {
        return await this.helper.lindex(key, index);
    }
    async lset(key, index, value) {
        return await this.helper.lset(key, index, value);
    }
    async ltrim(key, start, stop) {
        return await this.helper.ltrim(key, start, stop);
    }
    async hset(key, field, value) {
        return await this.helper.hset(key, field, value);
    }
    async hget(key, field) {
        return await this.helper.hget(key, field);
    }
    async hgetall(key) {
        return await this.helper.hgetall(key);
    }
    async hdel(key, ...fields) {
        return await this.helper.hdel(key, ...fields);
    }
    async hexists(key, field) {
        return await this.helper.hexists(key, field);
    }
    async sadd(key, ...members) {
        return await this.helper.sadd(key, ...members);
    }
    async smembers(key) {
        return await this.helper.smembers(key);
    }
    async srem(key, ...members) {
        return await this.helper.srem(key, ...members);
    }
    async sismember(key, member) {
        return await this.helper.sismember(key, member);
    }
    async scard(key) {
        return await this.helper.scard(key);
    }
    async zadd(key, ...args) {
        return await this.helper.zadd(key, ...args);
    }
    async zrange(key, start, stop, withScores = false) {
        return await this.helper.zrange(key, start, stop, withScores);
    }
    async zrem(key, ...members) {
        return await this.helper.zrem(key, ...members);
    }
    async exists(key) {
        return await this.helper.exists(key);
    }
    async expire(key, ttl) {
        return await this.helper.expire(key, ttl);
    }
    async ttl(key) {
        return await this.helper.ttl(key);
    }
    async keys(pattern) {
        return await this.helper.keys(pattern);
    }
    async flushall() {
        return await this.helper.flushall();
    }
    async flushdb() {
        return await this.helper.flushdb();
    }
    async incr(key) {
        return await this.helper.incr(key);
    }
    async decr(key) {
        return await this.helper.decr(key);
    }
    async incrby(key, increment) {
        return await this.helper.incrby(key, increment);
    }
    async decrby(key, decrement) {
        return await this.helper.decrby(key, decrement);
    }
    async publish(channel, message) {
        return await this.helper.publish(channel, message);
    }
    subscribe(channel, callback) {
        return this.helper.subscribe(channel, callback);
    }
    unsubscribe(channel) {
        return this.helper.unsubscribe(channel);
    }
    async healthCheck() {
        return await this.helper.healthCheck();
    }
    async connect() {
        return await this.helper.connect();
    }
    async disconnect() {
        return await this.helper.disconnect();
    }
    isReady() {
        return this.helper.isReady();
    }
    async GetAllCacheDatakeys() {
        const client = this.helper.getClient();
        try {
            const keys = await client.keys('*');
            const allData = {};
            for (const key of keys) {
                const result = await client.get(key);
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
    async pipeline(operations) {
        return await this.helper.pipeline(operations);
    }
    async multi(operations) {
        return await this.helper.multi(operations);
    }
}
exports.CacheDataOne = CacheDataOne;
exports.cacheDataOne = new CacheDataOne();
//# sourceMappingURL=redis.helper.js.map