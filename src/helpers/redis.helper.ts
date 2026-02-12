import * as path from 'path';
import * as format from '@src/helpers/format.helper';
import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
// Config
const API_VERSION = '1';
const redis_option: any = process.env.REDIS_OPTION || '1';
const redis_host: any = process.env.REDIS_HOST || '172.25.99.10';
const redis_port: any = parseInt(process.env.REDIS_PORT, 10) || 6379;
const redis_ttl: any = parseInt(process.env.REDIS_TTL, 10) || undefined;
const redis_password: any = process.env.REDIS_PASSWORD || '';
const redis_key_file: any = process.env.REDIS_KEY_FILE || '';
const redis_cert: any = process.env.REDIS_CERT || '';
const redis_ca: any = process.env.REDIS_CA || '';
const moment = require('moment');
// ========== Singleton Redis Helper ==========
export class RedisHelper {
  private static instance: RedisHelper;
  private client: any;
  private pubClient: any;
  private subClient: any;
  private isConnected: boolean = false;
  private isInitialized: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private IoRedis: any;
  private readonly logger = new Logger(RedisHelper.name);
  private constructor() {
    // Load ioredis แบบ lazy
    this.IoRedis = require('ioredis');
  }

  public static getInstance(): RedisHelper {
    if (!RedisHelper.instance) {
      RedisHelper.instance = new RedisHelper();
    }
    return RedisHelper.instance;
  }

  async initialize(): Promise<void> {
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

  public async initializeRedis(): Promise<void> {
    try {
      console.log('🟡 Initializing Redis connection...');

      // ลบ client เก่าถ้ามี
      if (this.client) {
        try {
          await this.client.quit();
        } catch (e) {
          // ignore
        }
      }

      // สร้าง client ใหม่
      this.client = new this.IoRedis({
        host: redis_host,
        port: redis_port,
        password: redis_password,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      // สร้าง pub/sub clients สำหรับ publish/subscribe
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

      // ตั้งค่า event handlers
      this.setupEventHandlers();

      // รอจนกว่า client จะพร้อม
      await new Promise<void>((resolve, reject) => {
        this.client.once('ready', () => {
          console.log('✅ Redis main client connected and ready');
          resolve();
        });

        this.client.once('error', (err: any) => {
          console.error('❌ Redis main client connection failed:', err);
          reject(err);
        });
      });

      // รอ pub/sub clients พร้อม
      await Promise.all([
        new Promise<void>((resolve) => {
          this.pubClient.once('ready', () => {
            console.log('✅ Redis pub client ready');
            resolve();
          });
        }),
        new Promise<void>((resolve) => {
          this.subClient.once('ready', () => {
            console.log('✅ Redis sub client ready');
            resolve();
          });
        }),
      ]);

      this.isConnected = true;
      this.isInitialized = true;

      console.log('🎉 All Redis clients connected successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error);
      this.isConnected = false;
      this.isInitialized = false;
      throw error;
    }
  }

  public setupEventHandlers(): void {
    // Main client events
    this.client.on('connect', () => {
      console.log('🟢 Redis main client connecting...');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      console.log('✅ Redis main client ready');
    });

    this.client.on('error', (err: any) => {
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

    // Pub client events
    this.pubClient.on('error', (err: any) => {
      console.error('🔴 Redis pub client error:', err.message);
    });

    // Sub client events
    this.subClient.on('error', (err: any) => {
      console.error('🔴 Redis sub client error:', err.message);
    });
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }
      return true;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        await this.connect();
      }
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return false;
    }
  }

  getClient(): any {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call initialize() first.');
    }
    return this.client;
  }

  getPubClient(): any {
    if (!this.pubClient) {
      throw new Error(
        'Redis pub client not initialized. Call initialize() first.',
      );
    }
    return this.pubClient;
  }

  getSubClient(): any {
    if (!this.subClient) {
      throw new Error(
        'Redis sub client not initialized. Call initialize() first.',
      );
    }
    return this.subClient;
  }

  isReady(): boolean {
    return this.isConnected && this.client?.status === 'ready';
  }

  async disconnect(): Promise<void> {
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
    } catch (error) {
      console.error('❌ Error disconnecting Redis:', error);
    }
  }
  /**
   * ล้างข้อมูลทั้งหมดใน Redis (ทั้ง database)
   * ใช้ด้วยความระมัดระวัง! จะลบข้อมูลทั้งหมดออก
   */
  async clearAllCache(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log('🔄 Clearing all Redis cache...');

      // ใช้ FLUSHALL เพื่อล้างข้อมูลทั้งหมด
      await this.client.flushall();

      this.logger.log('✅ All Redis cache cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear Redis cache:', error);
      return false;
    }
  }
  /**
   * ล้างข้อมูลใน Redis database ปัจจุบัน
   */
  async clearCurrentDBCache(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log('🔄 Clearing current Redis database cache...');

      // ใช้ FLUSHDB เพื่อล้างข้อมูลใน database ปัจจุบัน
      await this.client.flushdb();

      this.logger.log('✅ Current Redis database cache cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear current Redis database cache:', error);
      return false;
    }
  }
  /**
   * ล้าง cache ด้วย pattern ที่กำหนด
   * @param pattern รูปแบบของ key (เช่น 'user:*', 'session:*')
   */
  async clearCacheByPattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log(`🔄 Clearing cache with pattern: ${pattern}`);

      // หา keys ทั้งหมดที่ตรงกับ pattern
      const keys = await this.client.keys(pattern);

      if (keys.length === 0) {
        this.logger.log(`ℹ️ No keys found with pattern: ${pattern}`);
        return 0;
      }

      // ลบ keys ทั้งหมดที่พบ
      const deletedCount = await this.client.del(...keys);

      this.logger.log(
        `✅ Deleted ${deletedCount} keys with pattern: ${pattern}`,
      );
      return deletedCount;
    } catch (error) {
      console.error(`❌ Failed to clear cache with pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * ลบ cache หลายรายการพร้อมกัน
   * @param keys รายการ keys ที่ต้องการลบ
   */
  async clearMultipleCache(keys: string[]): Promise<number> {
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
    } catch (error) {
      console.error('❌ Failed to clear multiple cache:', error);
      return 0;
    }
  }

  /**
   * ลบ cache แบบค่อยๆ ลบ (เพื่อป้องกันการ block Redis)
   * @param pattern รูปแบบของ key
   * @param batchSize ขนาด batch ต่อการลบ
   */
  async clearCacheByPatternSafely(
    pattern: string,
    batchSize: number = 100,
  ): Promise<{ totalDeleted: number; batches: number }> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log(
        `🔄 Safely clearing cache with pattern: ${pattern} (batch size: ${batchSize})`,
      );

      // หา keys ทั้งหมดที่ตรงกับ pattern
      const keys = await this.client.keys(pattern);
      const totalKeys = keys.length;

      if (totalKeys === 0) {
        this.logger.log(`ℹ️ No keys found with pattern: ${pattern}`);
        return { totalDeleted: 0, batches: 0 };
      }

      let totalDeleted = 0;
      let batchesProcessed = 0;

      // ลบทีละ batch
      for (let i = 0; i < totalKeys; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);

        if (batch.length > 0) {
          const deletedInBatch = await this.client.del(...batch);
          totalDeleted += deletedInBatch;
          batchesProcessed++;

          this.logger.log(
            `Processed batch ${batchesProcessed}: deleted ${deletedInBatch} keys ` +
              `(${Math.round(((i + batch.length) / totalKeys) * 100)}%)`,
          );

          // พักสักครู่ระหว่าง batches เพื่อลด load
          if (i + batchSize < totalKeys) {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      }

      this.logger.log(
        `✅ Safely cleared cache: ${totalDeleted}/${totalKeys} keys deleted ` +
          `in ${batchesProcessed} batches`,
      );

      return { totalDeleted, batches: batchesProcessed };
    } catch (error) {
      console.error(
        `❌ Failed to safely clear cache with pattern ${pattern}:`,
        error,
      );
      return { totalDeleted: 0, batches: 0 };
    }
  }

  /**
   * ล้าง cache ที่หมดอายุแล้ว
   * หมายเหตุ: Redis จะลบ keys ที่หมดอายุอัตโนมัติ แต่เมธอดนี้ช่วยตรวจสอบ
   */
  async clearExpiredCache(): Promise<{ checked: number; expired: number }> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log('🔄 Checking for expired cache...');

      // หา keys ทั้งหมด (ใช้ด้วยความระมัดระวังใน production!)
      const keys = await this.client.keys('*');
      let expiredCount = 0;

      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -2) {
          // -2 หมายถึง key ไม่存在แล้ว
          expiredCount++;
        } else if (ttl === -1) {
          // key มีอยู่แต่ไม่มี TTL (permanent)
          continue;
        }
      }

      this.logger.log(
        `✅ Expired cache check completed: ` +
          `checked ${keys.length} keys, ${expiredCount} already expired`,
      );

      return { checked: keys.length, expired: expiredCount };
    } catch (error) {
      console.error('❌ Failed to check expired cache:', error);
      return { checked: 0, expired: 0 };
    }
  }

  /**
   * ล้าง cache ตามประเภท (ใช้ tagging system)
   * @param tags รายการ tags ที่ต้องการลบ
   */
  async clearCacheByTags(tags: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      this.logger.log(`🔄 Clearing cache with tags: ${tags.join(', ')}`);

      let totalDeleted = 0;

      // สำหรับแต่ละ tag
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;

        // ดึง keys ทั้งหมดที่เกี่ยวข้องกับ tag นี้
        const taggedKeys = await this.client.smembers(tagKey);

        if (taggedKeys.length > 0) {
          // ลบ keys ที่เกี่ยวข้องกับ tag
          const deleted = await this.client.del(...taggedKeys);
          totalDeleted += deleted;

          // ลบ tag ด้วย
          await this.client.del(tagKey);

          this.logger.log(`  Tag "${tag}": deleted ${deleted} keys`);
        }
      }

      this.logger.log(
        `✅ Cleared cache by tags: ${totalDeleted} total keys deleted`,
      );
      return totalDeleted;
    } catch (error) {
      console.error(`❌ Failed to clear cache by tags:`, error);
      return 0;
    }
  }

  /**
   * เพิ่ม tag ให้กับ cache key
   * @param key cache key
   * @param tags รายการ tags
   */
  async tagCache(key: string, tags: string[]): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        await this.client.sadd(tagKey, key);
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to tag cache key ${key}:`, error);
      return false;
    }
  }
  // ========== Cache Statistics ==========
  /**
   * รับสถิติ cache
   */
  async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    connected: boolean;
    databaseSize: number;
  }> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      // ดึงข้อมูลจาก Redis INFO command
      const info = await this.client.info();
      const infoLines = info.split('\r\n');

      let totalKeys = 0;
      let usedMemory = '0';
      let dbSize = 0;

      for (const line of infoLines) {
        if (line.startsWith('db0:keys=')) {
          totalKeys = parseInt(line.split('=')[1]);
        } else if (line.startsWith('used_memory_human:')) {
          usedMemory = line.split(':')[1].trim();
        } else if (line.startsWith('keyspace_db0:')) {
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
    } catch (error) {
      console.error('❌ Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: '0',
        connected: this.isConnected,
        databaseSize: 0,
      };
    }
  }

  // ========== Basic Operations ==========

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (ttl && ttl > 0) {
        await this.client.setex(key, ttl, JSON.stringify(value));
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error(`Redis set error for key ${key}:`, error);
      return false;
    }
  }

  async get(key: string): Promise<any> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Redis del error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis exists error for key ${key}:`, error);
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error(`Redis expire error for key ${key}:`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Redis ttl error for key ${key}:`, error);
      return -2;
    }
  }

  // ========== List Operations ==========

  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.lpush(key, ...values);
    } catch (error) {
      console.error(`Redis lpush error for key ${key}:`, error);
      throw error;
    }
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.rpush(key, ...values);
    } catch (error) {
      console.error(`Redis rpush error for key ${key}:`, error);
      throw error;
    }
  }

  async lpop(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.lpop(key);
    } catch (error) {
      console.error(`Redis lpop error for key ${key}:`, error);
      throw error;
    }
  }

  async rpop(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.rpop(key);
    } catch (error) {
      console.error(`Redis rpop error for key ${key}:`, error);
      throw error;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.lrange(key, start, stop);
    } catch (error) {
      console.error(`Redis lrange error for key ${key}:`, error);
      throw error;
    }
  }

  async lrem(key: string, count: number, value: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.lrem(key, count, value);
    } catch (error) {
      console.error(`Redis lrem error for key ${key}:`, error);
      throw error;
    }
  }

  async llen(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.llen(key);
    } catch (error) {
      console.error(`Redis llen error for key ${key}:`, error);
      throw error;
    }
  }

  async lindex(key: string, index: number): Promise<string | null> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.lindex(key, index);
    } catch (error) {
      console.error(`Redis lindex error for key ${key}:`, error);
      throw error;
    }
  }

  async lset(key: string, index: number, value: string): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.lset(key, index, value);
    } catch (error) {
      console.error(`Redis lset error for key ${key}:`, error);
      throw error;
    }
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.ltrim(key, start, stop);
    } catch (error) {
      console.error(`Redis ltrim error for key ${key}:`, error);
      throw error;
    }
  }

  // ========== Hash Operations ==========

  async hset(key: string, field: string, value: any): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.hset(key, field, JSON.stringify(value));
    } catch (error) {
      console.error(`Redis hset error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  async hget(key: string, field: string): Promise<any> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const data = await this.client.hget(key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis hget error for key ${key}, field ${field}:`, error);
      throw error;
    }
  }

  async hgetall(key: string): Promise<{ [field: string]: any }> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const data = await this.client.hgetall(key);
      const result: { [field: string]: any } = {};

      for (const [field, value] of Object.entries(data)) {
        try {
          result[field] = JSON.parse(value as string);
        } catch {
          result[field] = value;
        }
      }

      return result;
    } catch (error) {
      console.error(`Redis hgetall error for key ${key}:`, error);
      throw error;
    }
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.hdel(key, ...fields);
    } catch (error) {
      console.error(`Redis hdel error for key ${key}:`, error);
      throw error;
    }
  }

  async hexists(key: string, field: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return (await this.client.hexists(key, field)) === 1;
    } catch (error) {
      console.error(
        `Redis hexists error for key ${key}, field ${field}:`,
        error,
      );
      throw error;
    }
  }

  // ========== Set Operations ==========

  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.sadd(key, ...members);
    } catch (error) {
      console.error(`Redis sadd error for key ${key}:`, error);
      throw error;
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.smembers(key);
    } catch (error) {
      console.error(`Redis smembers error for key ${key}:`, error);
      throw error;
    }
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.srem(key, ...members);
    } catch (error) {
      console.error(`Redis srem error for key ${key}:`, error);
      throw error;
    }
  }

  async sismember(key: string, member: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return (await this.client.sismember(key, member)) === 1;
    } catch (error) {
      console.error(
        `Redis sismember error for key ${key}, member ${member}:`,
        error,
      );
      throw error;
    }
  }

  async scard(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.scard(key);
    } catch (error) {
      console.error(`Redis scard error for key ${key}:`, error);
      throw error;
    }
  }

  // ========== Sorted Set Operations ==========

  async zadd(key: string, ...args: (number | string)[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.zadd(key, ...args);
    } catch (error) {
      console.error(`Redis zadd error for key ${key}:`, error);
      throw error;
    }
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      if (withScores) {
        return await this.client.zrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrange(key, start, stop);
    } catch (error) {
      console.error(`Redis zrange error for key ${key}:`, error);
      throw error;
    }
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.zrem(key, ...members);
    } catch (error) {
      console.error(`Redis zrem error for key ${key}:`, error);
      throw error;
    }
  }

  // ========== Pub/Sub Operations ==========

  async publish(channel: string, message: any): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      return await this.pubClient.publish(channel, JSON.stringify(message));
    } catch (error) {
      console.error(`Redis publish error for channel ${channel}:`, error);
      return 0;
    }
  }

  subscribe(channel: string, callback: (message: any) => void): void {
    try {
      if (!this.isConnected) {
        console.warn('Redis not connected, cannot subscribe');
        return;
      }

      this.subClient.subscribe(channel, (err: any) => {
        if (err) {
          console.error(`Redis subscribe error for channel ${channel}:`, err);
          return;
        }
        console.log(`✅ Subscribed to channel: ${channel}`);
      });

      this.subClient.on('message', (ch: string, msg: string) => {
        if (ch === channel) {
          try {
            const parsed = JSON.parse(msg);
            callback(parsed);
          } catch (error) {
            console.error(
              `Error parsing message from channel ${channel}:`,
              error,
            );
          }
        }
      });
    } catch (error) {
      console.error(`Redis subscribe error for channel ${channel}:`, error);
    }
  }

  unsubscribe(channel: string): void {
    try {
      if (this.subClient) {
        this.subClient.unsubscribe(channel);
        console.log(`✅ Unsubscribed from channel: ${channel}`);
      }
    } catch (error) {
      console.error(`Redis unsubscribe error for channel ${channel}:`, error);
    }
  }

  // ========== Batch Operations ==========

  async pipeline(
    operations: Array<{ command: string; args: any[] }>,
  ): Promise<any[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const pipeline = this.client.pipeline();

      operations.forEach((op) => {
        pipeline[op.command](...op.args);
      });

      const results = await pipeline.exec();
      return results.map(([err, result]: [any, any]) => {
        if (err) throw err;
        return result;
      });
    } catch (error) {
      console.error('Redis pipeline error:', error);
      throw error;
    }
  }

  async multi(
    operations: Array<{ command: string; args: any[] }>,
  ): Promise<any[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const multi = this.client.multi();

      operations.forEach((op) => {
        multi[op.command](...op.args);
      });

      const results = await multi.exec();
      return results.map(([err, result]: [any, any]) => {
        if (err) throw err;
        return result;
      });
    } catch (error) {
      console.error('Redis multi error:', error);
      throw error;
    }
  }

  // ========== Utility Methods ==========

  async keys(pattern: string): Promise<string[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.keys(pattern);
    } catch (error) {
      console.error(`Redis keys error for pattern ${pattern}:`, error);
      throw error;
    }
  }

  async flushall(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.flushall();
    } catch (error) {
      console.error('Redis flushall error:', error);
      throw error;
    }
  }

  async flushdb(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.flushdb();
    } catch (error) {
      console.error('Redis flushdb error:', error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.incr(key);
    } catch (error) {
      console.error(`Redis incr error for key ${key}:`, error);
      throw error;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.decr(key);
    } catch (error) {
      console.error(`Redis decr error for key ${key}:`, error);
      throw error;
    }
  }

  async incrby(key: string, increment: number): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.incrby(key, increment);
    } catch (error) {
      console.error(`Redis incrby error for key ${key}:`, error);
      throw error;
    }
  }

  async decrby(key: string, decrement: number): Promise<number> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.decrby(key, decrement);
    } catch (error) {
      console.error(`Redis decrby error for key ${key}:`, error);
      throw error;
    }
  }

  async SetCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;

    return await this.set(keycache, data, time);
  }

  async SetCacheKey(setData: any) {
    const keycache = setData.keycache;
    const data = setData.data;

    return await this.set(keycache, data);
  }

  async UpdateCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;

    // สำหรับ hash set
    const client = this.getClient();
    await client.hset(keycache, time.toString(), JSON.stringify(data));
    return keycache;
  }

  async GetCacheData(keycache: any) {
    return await this.get(keycache);
  }

  async GetCacheData2(keycache: any) {
    // Same as GetCacheData
    return await this.get(keycache);
  }

  async DeleteCacheData(keycache: any) {
    return await this.del(keycache);
  }

  async OTP(keycache: any) {
    const time = 30;
    const data = format.getRandomint(6);
    const keyotp = format.getRandomString(11);
    const key: any = keyotp;
    const nowseconds = new Date().getTime();
    const timestamp: any = nowseconds;
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
      const allData: { [key: string]: any } = {};

      for (const key of keys) {
        const result = await client.get(key);
        if (result) {
          allData[key] = JSON.parse(result);
        } else {
          allData[key] = null;
        }
      }

      return allData;
    } catch (error) {
      console.error('Error getting all cache data:', error);
      throw error;
    }
  }
}
// Singleton instance สำหรับใช้งานทั่วทั้งแอป
export const redisHelper = RedisHelper.getInstance();
// ========== CacheDataOne class สำหรับ backward compatibility ==========
export class CacheDataOne {
  private helper: RedisHelper;

  constructor() {
    this.helper = redisHelper;
  }

  async SetCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;

    return await this.helper.set(keycache, data, time);
  }

  async SetCacheKey(setData: any) {
    const keycache = setData.keycache;
    const data = setData.data;

    return await this.helper.set(keycache, data);
  }

  async UpdateCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;

    // สำหรับ hash set
    const client = this.helper.getClient();
    await client.hset(keycache, time.toString(), JSON.stringify(data));
    return keycache;
  }

  async GetCacheData(keycache: any) {
    return await this.helper.get(keycache);
  }

  async GetCacheData2(keycache: any) {
    // Same as GetCacheData
    return await this.helper.get(keycache);
  }

  async DeleteCacheData(keycache: any) {
    return await this.helper.del(keycache);
  }

  async OTP(keycache: any) {
    const time = 30;
    const data = format.getRandomint(6);
    const keyotp = format.getRandomString(11);
    const key: any = keyotp;
    const nowseconds = new Date().getTime();
    const timestamp: any = nowseconds;
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

  // List Operations สำหรับ CacheDataOne
  async lpush(key: string, ...values: string[]): Promise<number> {
    return await this.helper.lpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.helper.lrange(key, start, stop);
  }

  async lrem(key: string, count: number, value: string): Promise<number> {
    return await this.helper.lrem(key, count, value);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return await this.helper.rpush(key, ...values);
  }

  async lpop(key: string): Promise<string | null> {
    return await this.helper.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return await this.helper.rpop(key);
  }

  async llen(key: string): Promise<number> {
    return await this.helper.llen(key);
  }

  async lindex(key: string, index: number): Promise<string | null> {
    return await this.helper.lindex(key, index);
  }

  async lset(key: string, index: number, value: string): Promise<void> {
    return await this.helper.lset(key, index, value);
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    return await this.helper.ltrim(key, start, stop);
  }

  // Hash Operations สำหรับ CacheDataOne
  async hset(key: string, field: string, value: any): Promise<number> {
    return await this.helper.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<any> {
    return await this.helper.hget(key, field);
  }

  async hgetall(key: string): Promise<{ [field: string]: any }> {
    return await this.helper.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return await this.helper.hdel(key, ...fields);
  }

  async hexists(key: string, field: string): Promise<boolean> {
    return await this.helper.hexists(key, field);
  }

  // Set Operations สำหรับ CacheDataOne
  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.helper.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.helper.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return await this.helper.srem(key, ...members);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    return await this.helper.sismember(key, member);
  }

  async scard(key: string): Promise<number> {
    return await this.helper.scard(key);
  }

  // Sorted Set Operations สำหรับ CacheDataOne
  async zadd(key: string, ...args: (number | string)[]): Promise<number> {
    return await this.helper.zadd(key, ...args);
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    return await this.helper.zrange(key, start, stop, withScores);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return await this.helper.zrem(key, ...members);
  }

  // Utility Methods สำหรับ CacheDataOne
  async exists(key: string): Promise<boolean> {
    return await this.helper.exists(key);
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    return await this.helper.expire(key, ttl);
  }

  async ttl(key: string): Promise<number> {
    return await this.helper.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.helper.keys(pattern);
  }

  async flushall(): Promise<void> {
    return await this.helper.flushall();
  }

  async flushdb(): Promise<void> {
    return await this.helper.flushdb();
  }

  async incr(key: string): Promise<number> {
    return await this.helper.incr(key);
  }

  async decr(key: string): Promise<number> {
    return await this.helper.decr(key);
  }

  async incrby(key: string, increment: number): Promise<number> {
    return await this.helper.incrby(key, increment);
  }

  async decrby(key: string, decrement: number): Promise<number> {
    return await this.helper.decrby(key, decrement);
  }

  async publish(channel: string, message: any): Promise<number> {
    return await this.helper.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: any) => void): void {
    return this.helper.subscribe(channel, callback);
  }

  unsubscribe(channel: string): void {
    return this.helper.unsubscribe(channel);
  }

  async healthCheck(): Promise<boolean> {
    return await this.helper.healthCheck();
  }

  async connect(): Promise<boolean> {
    return await this.helper.connect();
  }

  async disconnect(): Promise<void> {
    return await this.helper.disconnect();
  }

  isReady(): boolean {
    return this.helper.isReady();
  }

  async GetAllCacheDatakeys() {
    const client = this.helper.getClient();
    try {
      const keys = await client.keys('*');
      const allData: { [key: string]: any } = {};

      for (const key of keys) {
        const result = await client.get(key);
        if (result) {
          allData[key] = JSON.parse(result);
        } else {
          allData[key] = null;
        }
      }

      return allData;
    } catch (error) {
      console.error('Error getting all cache data:', error);
      throw error;
    }
  }

  // Pipeline and Multi operations
  async pipeline(
    operations: Array<{ command: string; args: any[] }>,
  ): Promise<any[]> {
    return await this.helper.pipeline(operations);
  }

  async multi(
    operations: Array<{ command: string; args: any[] }>,
  ): Promise<any[]> {
    return await this.helper.multi(operations);
  }
}
// สร้าง global instance สำหรับใช้งานทันที
export const cacheDataOne = new CacheDataOne();

/**
     * 
    # เอกสารประกอบการใช้งาน Redis Helper

    ## 📌 Overview
    คลาส RedisHelper เป็น Singleton class สำหรับจัดการ Redis connection และ operations หลากหลายรูปแบบ

    ## 🚀 การเริ่มต้นใช้งาน

    ### 1. Import และ Initialization
    ```typescript
    import { redisHelper, CacheDataOne, cacheDataOne } from '@path/to/redis.helper';

    // วิธีที่ 1: ใช้ Singleton instance
    const redis = redisHelper;

    // วิธีที่ 2: สร้าง instance ใหม่ (สำหรับ backward compatibility)
    const cache = new CacheDataOne();

    // วิธีที่ 3: ใช้ global instance
    const globalCache = cacheDataOne;
    ```

    ### 2. การเชื่อมต่อ Redis
    ```typescript
    // เชื่อมต่ออัตโนมัติ
    await redisHelper.connect();

    // เช็คสถานะการเชื่อมต่อ
    const isConnected = await redisHelper.healthCheck();
    console.log('Redis connected:', isConnected);

    // เช็คสถานะพร้อมใช้งาน
    const isReady = redisHelper.isReady();
    ```

    ## 🔧 รูปแบบการเรียกใช้งาน

    ### 1. **Basic Cache Operations**

    #### 1.1 Set Cache Data
    ```typescript
    // วิธีที่ 1: ใช้ method เฉพาะ
    const setData = {
      keycache: 'user:1001',
      data: { name: 'John', age: 25 },
      time: 3600 // TTL in seconds
    };
    await redisHelper.SetCacheData(setData);

    // วิธีที่ 2: ใช้ method ทั่วไป
    await redisHelper.set('user:1001', { name: 'John', age: 25 }, 3600);
    ```

    #### 1.2 Get Cache Data
    ```typescript
    // วิธีที่ 1
    const data1 = await redisHelper.GetCacheData('user:1001');

    // วิธีที่ 2
    const data2 = await redisHelper.GetCacheData2('user:1001');

    // วิธีที่ 3
    const data3 = await redisHelper.get('user:1001');
    ```

    #### 1.3 Delete Cache Data
    ```typescript
    // วิธีที่ 1
    await redisHelper.DeleteCacheData('user:1001');

    // วิธีที่ 2
    await redisHelper.del('user:1001');
    ```

    #### 1.4 Check Cache Existence
    ```typescript
    const exists = await redisHelper.exists('user:1001');
    ```

    #### 1.5 Set TTL
    ```typescript
    // ตั้งค่า TTL สำหรับ key ที่มีอยู่แล้ว
    await redisHelper.expire('user:1001', 1800); // 30 นาที

    // ดู TTL ที่เหลือ
    const ttl = await redisHelper.ttl('user:1001');
    ```

    ### 2. **List Operations**

    #### 2.1 Push Operations
    ```typescript
    // เพิ่มข้อมูลด้านซ้าย
    await redisHelper.lpush('tasks', 'task1', 'task2', 'task3');

    // เพิ่มข้อมูลด้านขวา
    await redisHelper.rpush('tasks', 'task4', 'task5');
    ```

    #### 2.2 Pop Operations
    ```typescript
    // ดึงและลบข้อมูลด้านซ้าย
    const leftTask = await redisHelper.lpop('tasks');

    // ดึงและลบข้อมูลด้านขวา
    const rightTask = await redisHelper.rpop('tasks');
    ```

    #### 2.3 Range Operations
    ```typescript
    // ดึงข้อมูลทั้งหมด
    const allTasks = await redisHelper.lrange('tasks', 0, -1);

    // ดึงข้อมูลบางส่วน
    const first3Tasks = await redisHelper.lrange('tasks', 0, 2);
    ```

    #### 2.4 Other List Operations
    ```typescript
    // นับจำนวนสมาชิก
    const length = await redisHelper.llen('tasks');

    // ดึงข้อมูลตาม index
    const task = await redisHelper.lindex('tasks', 2);

    // ลบข้อมูลตามค่า
    await redisHelper.lrem('tasks', 2, 'task1'); // ลบ 2 รายการแรกของ 'task1'

    // ตั้งค่าข้อมูลตาม index
    await redisHelper.lset('tasks', 0, 'newTask');

    // ตัด list
    await redisHelper.ltrim('tasks', 0, 4); // เก็บแค่ 5 รายการแรก
    ```

    ### 3. **Hash Operations**

    #### 3.1 Set/Get Hash Fields
    ```typescript
    // ตั้งค่า field เดียว
    await redisHelper.hset('user:1001:profile', 'name', 'John Doe');
    await redisHelper.hset('user:1001:profile', 'email', 'john@example.com');

    // ดึง field เดียว
    const name = await redisHelper.hget('user:1001:profile', 'name');

    // ดึง所有 fields
    const profile = await redisHelper.hgetall('user:1001:profile');
    ```

    #### 3.2 Delete Hash Fields
    ```typescript
    // ลบ field เดียว
    await redisHelper.hdel('user:1001:profile', 'email');

    // ลบหลาย fields
    await redisHelper.hdel('user:1001:profile', 'name', 'age');
    ```

    #### 3.3 Check Hash Fields
    ```typescript
    const hasEmail = await redisHelper.hexists('user:1001:profile', 'email');
    ```

    ### 4. **Set Operations**

    #### 4.1 Basic Set Operations
    ```typescript
    // เพิ่มสมาชิก
    await redisHelper.sadd('online:users', 'user1', 'user2', 'user3');

    // ดึง所有สมาชิก
    const onlineUsers = await redisHelper.smembers('online:users');

    // ตรวจสอบสมาชิก
    const isOnline = await redisHelper.sismember('online:users', 'user1');

    // นับจำนวนสมาชิก
    const onlineCount = await redisHelper.scard('online:users');
    ```

    #### 4.2 Remove Set Members
    ```typescript
    // ลบสมาชิก
    await redisHelper.srem('online:users', 'user2', 'user3');
    ```

    ### 5. **Sorted Set Operations**

    #### 5.1 Add with Scores
    ```typescript
    // เพิ่มสมาชิกพร้อมคะแนน
    await redisHelper.zadd('leaderboard', 
      100, 'player1',
      85, 'player2',
      92, 'player3'
    );
    ```

    #### 5.2 Range Operations
    ```typescript
    // ดึงอันดับต้นๆ
    const topPlayers = await redisHelper.zrange('leaderboard', 0, 9);

    // ดึงพร้อมคะแนน
    const topPlayersWithScores = await redisHelper.zrange('leaderboard', 0, 9, true);
    ```

    #### 5.3 Remove Members
    ```typescript
    await redisHelper.zrem('leaderboard', 'player2');
    ```

    ### 6. **Pub/Sub Operations**

    #### 6.1 Publish Messages
    ```typescript
    await redisHelper.publish('notifications', {
      type: 'message',
      userId: '1001',
      content: 'Hello!'
    });
    ```

    #### 6.2 Subscribe to Channels
    ```typescript
    redisHelper.subscribe('notifications', (message) => {
      console.log('Received notification:', message);
    });

    // ยกเลิก subscription
    redisHelper.unsubscribe('notifications');
    ```

    ### 7. **Batch Operations**

    #### 7.1 Pipeline Operations
    ```typescript
    const results = await redisHelper.pipeline([
      { command: 'set', args: ['key1', 'value1'] },
      { command: 'set', args: ['key2', 'value2'] },
      { command: 'get', args: ['key1'] }
    ]);
    ```

    #### 7.2 Multi Operations (Transactional)
    ```typescript
    const transactionResults = await redisHelper.multi([
      { command: 'incr', args: ['counter'] },
      { command: 'set', args: ['last_update', Date.now()] }
    ]);
    ```

    ### 8. **Utility Operations**

    #### 8.1 Increment/Decrement
    ```typescript
    // เพิ่มค่า
    await redisHelper.incr('page:views');
    await redisHelper.incrby('page:views', 5);

    // ลดค่า
    await redisHelper.decr('inventory:item1');
    await redisHelper.decrby('inventory:item1', 3);
    ```

    #### 8.2 Search Keys
    ```typescript
    // ค้นหา keys ด้วย pattern
    const userKeys = await redisHelper.keys('user:*');
    const sessionKeys = await redisHelper.keys('session:*');
    ```

    #### 8.3 Clear Cache
    ```typescript
    // ล้างทั้งหมด
    await redisHelper.flushall();

    // ล้าง database ปัจจุบัน
    await redisHelper.flushdb();
    ```

    ### 9. **Advanced Cache Management**

    #### 9.1 OTP Generation
    ```typescript
    const otpData = await redisHelper.OTP('user:1001:otp');
    // ผลลัพธ์: { key, time, OTP, day_th, day_en, timestamp, time_start }
    ```

    #### 9.2 Get All Keys
    ```typescript
    const allData = await redisHelper.GetAllCacheDatakeys();
    ```

    #### 9.3 Cache Statistics
    ```typescript
    const stats = await redisHelper.getCacheStats();
    console.log('Total keys:', stats.totalKeys);
    console.log('Memory usage:', stats.memoryUsage);
    console.log('Database size:', stats.databaseSize);
    ```

    ### 10. **Cache Clearing Methods**

    #### 10.1 Clear All Cache
    ```typescript
    await redisHelper.clearAllCache(); // ล้างทั้งหมด
    await redisHelper.clearCurrentDBCache(); // ล้างเฉพาะ database ปัจจุบัน
    ```

    #### 10.2 Clear by Pattern
    ```typescript
    // ล้างตาม pattern
    const deletedCount = await redisHelper.clearCacheByPattern('user:*');

    // ล้างแบบปลอดภัย (แบ่ง batch)
    const result = await redisHelper.clearCacheByPatternSafely('session:*', 100);
    console.log(`Deleted ${result.totalDeleted} keys in ${result.batches} batches`);
    ```

    #### 10.3 Clear Multiple Keys
    ```typescript
    const keysToDelete = ['user:1001', 'user:1002', 'session:abc123'];
    const deleted = await redisHelper.clearMultipleCache(keysToDelete);
    ```

    #### 10.4 Clear by Tags
    ```typescript
    // Tag cache ก่อน
    await redisHelper.tagCache('user:1001:profile', ['user_data', 'profile_data']);

    // ล้างตาม tags
    const deleted = await redisHelper.clearCacheByTags(['user_data']);
    ```

    #### 10.5 Check Expired Cache
    ```typescript
    const expiredStats = await redisHelper.clearExpiredCache();
    console.log(`Checked ${expiredStats.checked} keys, ${expiredStats.expired} expired`);
    ```

    ### 11. **Connection Management**

    #### 11.1 Health Check และ Reconnect
    ```typescript
    // เช็คสุขภาพการเชื่อมต่อ
    const isHealthy = await redisHelper.healthCheck();

    // เชื่อมต่อใหม่ถ้าต้องการ
    await redisHelper.connect();

    // ตัดการเชื่อมต่อ
    await redisHelper.disconnect();
    ```

    ## 📊 ตัวอย่างการใช้งานจริง

    ### ตัวอย่าง 1: User Session Management
    ```typescript
    class UserService {
      async saveUserSession(userId: string, sessionData: any) {
        const key = `session:${userId}`;
        await redisHelper.set(key, sessionData, 24 * 3600); // 1 วัน
        
        // Tag สำหรับการล้างง่าย
        await redisHelper.tagCache(key, ['sessions', `user:${userId}`]);
      }

      async getUserSession(userId: string) {
        return await redisHelper.get(`session:${userId}`);
      }

      async logoutUser(userId: string) {
        await redisHelper.del(`session:${userId}`);
      }
    }
    ```

    ### ตัวอย่าง 2: API Rate Limiting
    ```typescript
    class RateLimiter {
      async checkRateLimit(apiKey: string, limit: number = 100) {
        const key = `ratelimit:${apiKey}:${new Date().toISOString().slice(0, 10)}`;
        
        const current = await redisHelper.incr(key);
        
        if (current === 1) {
          await redisHelper.expire(key, 86400); // 1 วัน
        }
        
        return current <= limit;
      }
    }
    ```

    ### ตัวอย่าง 3: Real-time Notifications
    ```typescript
    class NotificationService {
      async sendNotification(userId: string, message: string) {
        // เก็บใน cache
        const notificationKey = `notification:${userId}:${Date.now()}`;
        await redisHelper.set(notificationKey, { message, timestamp: Date.now() }, 604800); // 7 วัน
        
        // ส่งแบบ real-time
        await redisHelper.publish(`user:${userId}:notifications`, { message });
      }

      subscribeToNotifications(userId: string, callback: (msg: any) => void) {
        redisHelper.subscribe(`user:${userId}:notifications`, callback);
      }
    }
    ```
    ## ⚠️ ข้อควรระวัง
    ### 1. **การจัดการ Connection**
    ```typescript
    // ✅ ถูกต้อง: ตรวจสอบ connection ก่อนใช้
    if (!redisHelper.isReady()) {
      await redisHelper.connect();
    }
    // ❌ ผิด: ไม่ตรวจสอบ connection
    await redisHelper.set('key', 'value'); // อาจ error ถ้าไม่เชื่อมต่อ
    ```
    ### 2. **Memory Management**
    ```typescript
    // หลีกเลี่ยงการดึง keys ทั้งหมดใน production
    // ❌ หลีกเลี่ยง:
    const allKeys = await redisHelper.keys('*'); // อาจใช้ memory สูง

    // ✅ ควรใช้:
    const stats = await redisHelper.getCacheStats(); // ใช้ method ตรวจสอบแทน
    ```
    ### 3. **Error Handling**
    ```typescript
    try {
      await redisHelper.set('important:data', data);
    } catch (error) {
      console.error('Failed to cache data:', error);
      // fallback logic
    }
    ```
    ## 🔧 Best Practices
    1. **ใช้ Key Prefix**: `user:${id}:profile`, `session:${token}`
    2. **ตั้ง TTL เหมาะสม**: ตามประเภทข้อมูล
    3. **ใช้ Pipeline สำหรับ bulk operations**
    4. **Tag cache สำหรับการจัดการที่ง่าย**
    5. **ตรวจสอบ connection ก่อนใช้งาน**
    6. **Handle errors อย่างเหมาะสม**
    ## 📝 Note
    - คลาสนี้สนับสนุนทั้งรูปแบบใหม่ (RedisHelper) และรูปแบบเก่า (CacheDataOne)
    - ออกแบบมาให้ใช้งานได้ทั้งใน NestJS และแอปทั่วไป
    - มีระบบ retry และ reconnection อัตโนมัติ
    - รองรับทั้ง synchronous และ asynchronous operations
 */