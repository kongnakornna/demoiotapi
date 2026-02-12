import * as path from 'path';
//const envPath = path.join(__dirname, '../config.conf')
//require('dotenv').config({ path: envPath })
import * as format from '@src/helpers/format.helper';
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
const redis_option: any = process.env.REDIS_OPTION || '1';
const redis_host: any = process.env.REDIS_HOST || "192.168.1.37" || "192.168.1.37";
const redis_port: any = parseInt(process.env.REDIS_PORT, 10) || '6379';
const redis_ttl: any = parseInt(process.env.REDIS_TTL, 10) || undefined;
const redis_password: any = process.env.REDIS_PASSWORD || '';
const redis_key_file: any = process.env.REDIS_KEY_FILE || '';
const redis_cert: any = process.env.REDIS_CERT || '';
const redis_ca: any = process.env.REDIS_CA || '';
const { promisify } = require('util');
const axios = require('axios');
const redis = require('redis');
const ioRedis = require('ioredis');
const RedisTimeout = require('ioredis-timeout');
const moment = require('moment');
const clients = redis.createClient(redis_port, redis_host);
console.log(
  '==============================✅ Redis createClient...================================================================',
);
const retRet: any = {
  result: true,
  remark: 'success',
  runlotime: null,
  data: [],
};
var client: any = null;
var isRedisConnected = false;
// console.log('REDIS_OPTION:=> ' + process.env.REDIS_OPTION);
// console.log('REDIS_HOSTT:=> ' + process.env.REDIS_HOST);
// console.log('REDIS_PORT PASSWORD:=>' + redis_password);
// console.log('REDIS_PORT:=> ' + process.env.REDIS_PORT);
var client = ioRedis.createClient({
  host: redis_host,
  port: parseInt(redis_port),
  password: redis_password,
});
// console.log('Redis client=>')
// console.info(client)

////////////////////////

// Create Redis client with proper configuration and error handling

export class RedisClient {
  private client: any;
  private isConnected: boolean = false;
  constructor() {
    this.initializeRedis();
  }

  private initializeRedis() {
    try {
      // ตรวจสอบว่ามี client แล้วและกำลังเชื่อมต่อหรือเชื่อมต่ออยู่แล้ว
      if (
        this.client &&
        (this.client.status === 'connecting' || this.client.status === 'ready')
      ) {
        console.log(
          '⚠️ Redis client is already initialized, skipping initialization...',
        );
        return;
      }
      const IoRedis = require('ioredis');

      this.client = new IoRedis({
        host: redis_host,
        port: redis_port,
        password: redis_password,
        //db: redis_db,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true, // Don't connect immediately
        enableReadyCheck: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryStrategy(times: number) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      // Event handlers
      this.client.on('connect', () => {
        // console.log('🟢 Redis: Connecting...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        // console.log('✅ Redis: Connected and ready');
      });

      this.client.on('error', (err: any) => {
        this.isConnected = false;
        console.error('🔴 Redis Error:', err.message);
      });

      this.client.on('end', () => {
        this.isConnected = false;
        // console.log('🔴 Redis: Connection closed');
      });

      this.client.on('reconnecting', () => {
        // console.log('🟡 Redis: Reconnecting...');
      });

      // Initialize connection
      this.connect();
    } catch (error) {
      console.error('❌ Failed to initialize Redis client:', error);
    }
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.client.connect();
        this.isConnected = true;
      }
      return true;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return false;
    }
  }

  getClient() {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected && this.client?.status === 'ready';
  }
}

// Create singleton instance
export const redisClient = new RedisClient();
///////////////////////
const clienton = client.on('ready', () => {
  console.log(
    'Services Connecting to redis!',
    ' host:' +
      redis_host +
      ' port:' +
      redis_port +
      ' password :' +
      redis_password,
  );
});
//console.info('clienton=>'+clienton)
const clienterror = client.on('error', (err: any) => {
  console.error('❌ Failed to initialize Redis client:', err);
});
console.info('clienterror=>');
console.info(clienterror);
const redis_ready = client.ready;
// console.log('✅ Redis: Connected and ready');
console.info(redis_ready);
console.log('===============================✅ Redis:Ready process 🟡==========================');
export class CacheDataOne {
  async SetCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;
    // console.log('setcache setData',setData);
    await client.setex(keycache, time, JSON.stringify(data)); // set data cache
    // console.log('keycache',keycache);
    return keycache;
  }
  async SetCacheKey(setData: any) {
    const keycache = setData.keycache;
    const data = setData.data;
    // console.log('setcache setData',setData);
    await client.set(keycache, JSON.stringify(data)); // set data cache
    // console.log('keycache',keycache);
    return keycache;
  }
  async UpdateCacheData(setData: any) {
    const time = setData.time;
    const keycache = setData.keycache;
    const data = setData.data;
    // console.log('Update setData',setData);
    await client.hset(keycache, time, JSON.stringify(data)); // set data cache
    // console.log('keycache',keycache);
    return keycache;
  }
  async GetCacheData(keycache: any) {
    // console.log('------GetCacheData------');
    const result = await promisify(client.get).bind(client)(keycache); // get data cache
    const resultcache = JSON.parse(result);
    // console.log('keycache',keycache);
    // console.log('getcache resultcache',resultcache);
    return resultcache;
  }
  async GetCacheData2(keycache: any) {
    try {
      // ลองเรียกแบบ async ก่อน
      const result = await client.get(keycache);
      // const result = await getCache(keycache);
      return result;
    } catch (error) {
      // ถ้าไม่ได้ ให้ลองใช้ promisify
      if (error.message.includes('not a function') || 
          error.message.includes('callback')) {
        const promisifiedGet = promisify(client.get).bind(client);
        return await promisifiedGet(keycache);
      }
      throw error;
    }
  } 
  async DeleteCacheData(keycache: any) {
    await promisify(client.del).bind(client)(keycache); // del data cache
    // console.log('del keycache',keycache);
    return keycache;
  }
  async OTP(keycache: any) {
    let date: any = Date.now();
    let nowseconds = new Date().getTime();
    let timestamp: any = nowseconds;
    let datenew = new Date(timestamp);
    const dayth = format.toThaiDate(datenew);
    const dayen = format.toEnDate(datenew);
    const time = 30;
    const data = format.getRandomint(6);
    const keyotp = format.getRandomString(11);
    //  const key: any = 'OTP_'+keyotp+'_'+data+'_'+timestamp;
    //const keys: any = 'OTP_'+data;
    const key: any = keyotp;
    // console.log('key=>', key);
    // console.log('Randomint==>', data);
    // console.log('keyOtp==>',keyotp);
    await client.setex(key, time, JSON.stringify(data)); // set data cache
    // console.log('keycache==>', key);
    const getOTP = await promisify(client.get).bind(client)(key); // get data cache
    const result_cache_OTP = JSON.parse(getOTP);
    let startDate = new Date(timestamp);
    let endDate = new Date(timestamp);
    if (startDate < endDate) {
      // Do something
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
    // console.log('OTP', OTP);
    return OTP;
    // await client.disconnect();
  }
  async OTPTIME(keycache: any, ttm: any) {
    let date: any = Date.now();
    let nowseconds = new Date().getTime();
    let timestamp: any = nowseconds;
    let datenew = new Date(timestamp);
    const dayth = format.toThaiDate(datenew);
    const dayen = format.toEnDate(datenew);
    const data: number = format.getRandomint(6);
    const keyotp = format.getRandomString(11);
    //  const key: any = 'OTP_'+keyotp+'_'+data+'_'+timestamp;
    //  const keys: any = 'OTP_'+data;
    const key: any = keyotp;
    // console.log('key=>', key);
    // console.log('Randomint==>', data);
    // console.log('keyOtp==>', keyotp);
    if (ttm) {
      const time = ttm;
      await client.setex(key, time, JSON.stringify(data)); // set data cache
      // console.log('keycache==>', key);
      const getOTP = await promisify(client.get).bind(client)(key); // get data cache
      const result_cache_OTP = JSON.parse(getOTP);
      let startDate = new Date(timestamp);
      let endDate = new Date(timestamp);
      if (startDate < endDate) {
        // Do something
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
      // console.log('OTP', OTP);
      return OTP;
      // await client.disconnect();
    } else {
      const time = 30;
      await client.setex(key, time, JSON.stringify(data)); // set data cache
      // console.log('keycache==>', key);
      const getOTP = await promisify(client.get).bind(client)(key); // get data cache
      const result_cache_OTP = JSON.parse(getOTP);
      let startDate = new Date(timestamp);
      let endDate = new Date(timestamp);
      if (startDate < endDate) {
        // Do something
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
      // console.log('OTP', OTP);
      return OTP;
      // await client.disconnect();
    }
  }
  async validateOTP(setData: any) {
    // otpvalidate  , keycache
    const keycache = setData.keycache;
    const otpvalidate = setData.otpvalidate;
    const rsOTP = await promisify(client.get).bind(client)(keycache); // get data cache
    const resultlocacheloOTP = JSON.parse(rsOTP);
    // console.log('validateOTP otpvalidate=>', otpvalidate);
    // console.log('keycache=>', keycache);
    if (otpvalidate == resultlocacheloOTP) {
      await this.DeleteCacheData(keycache);
      let status: number = 1;
      // console.log('status=>', status);
      return status;
    } else {
      let status: number = 0;
      // console.log('status=>', status);
      return status;
    }
  }
  async validateGet(setData: any) {
    // otpvalidate  , keycache
    const keycache = setData.keycache;
    const otpvalidate = setData.otpvalidate;
    const rsOTP = await promisify(client.get).bind(client)(keycache); // get data cache
    if (!rsOTP) {
      // let status:number=0
      // console.log('---------null-----------------');
      let status: number = 0;
      return status;
    }
    const resultlocacheloOTP = JSON.parse(rsOTP);
    // console.log('validateOTP otpvalidate=>', otpvalidate);
    // console.log('keycache=>', keycache);
    if (otpvalidate == resultlocacheloOTP) {
      // await this.DeleteCacheData(keycache);
      let status: number = 1;
      return status;
    } else {
      let status: number = 0;
      return status;
    }
  }
  async Run(datars: any) {
    const time = 30;
    const dataotp = format.getRandomint(6);
    const data = datars;
    let keyotp = format.getRandomString(8);
    //const key: any = 'OTP_'+keyotp+'_'+data;
    const key: any = keyotp;
    //// console.log('Random int', data);
    //// console.log('key otp',keyotp);
    //await client.setex(key,time,JSON.stringify(data));  // set data cache
    //// console.log('keycache', key);
    //const result =await promisify(client.get).bind(client)(key); // get data cache
    //const resultcache = JSON.parse(result);
    const input: any = {};
    input.key = key;
    input.time = time;
    input.OTP = data;
    //// console.log('input', input);
    return input;
    // await client.disconnect();
  }
  async OTPTIMEUSER(
    keycache: any,
    ttm: any,
    uid: any,
    email: any,
    username: any,
    token: any,
    roleId: any,
  ) {
    let date: any = Date.now();
    let nowseconds = new Date().getTime();
    let timestamp: any = nowseconds;
    let datenew = new Date(timestamp);
    const dayth = format.toThaiDate(datenew);
    const dayen = format.toEnDate(datenew);
    const data: number = format.getRandomint(6);
    const dataRs: any = {
      otp: data,
      uid: uid,
      email: email,
      username: username,
      token: token,
      roleId: roleId,
    };
    const keyotp = format.getRandomString(11);
    //  const key: any = 'OTP_'+keyotp+'_'+data+'_'+timestamp;
    //  const keys: any = 'OTP_'+data;
    const key: any = keyotp;
    // console.log('key=>', key);
    // console.log('Randomint==>');  console.info(dataRs);
    // console.log('keyOtp==>',keyotp);
    if (ttm) {
      const time = ttm;
      await client.setex(key, time, JSON.stringify(dataRs)); // set data cache
      // console.log('keycache==>', key);
      const getOTP = await promisify(client.get).bind(client)(key); // get data cache
      const result_cache_OTP = JSON.parse(getOTP);
      let startDate = new Date(timestamp);
      let endDate = new Date(timestamp);
      if (startDate < endDate) {
        // Do something
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
      // console.log('OTP', OTP);
      return OTP;
      // await client.disconnect();
    } else {
      const time = 120;
      await client.setex(key, time, JSON.stringify(dataRs)); // set data cache
      // console.log('keycache==>', key);
      const getOTP = await promisify(client.get).bind(client)(key); // get data cache
      const result_cache_OTP = JSON.parse(getOTP);
      let startDate = new Date(timestamp);
      let endDate = new Date(timestamp);
      if (startDate < endDate) {
        // Do something
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
      // console.log('OTP', OTP);
      return OTP;
      // await client.disconnect();
    }
  }
  async validateGetUser(setData: any) {
    // console.log('------------- validateGetUser-------------');
    // console.log('setData=>'); console.info(setData);
    const keycache = setData.keycache;
    const otpvalidate: number = setData.otpvalidate;
    const rsOTP = await promisify(client.get).bind(client)(keycache); // get data cache
    if (!rsOTP) {
      // let status:number=0
      //  // console.log('---------null-----------------');
      return null;
    }
    const resultOTP = JSON.parse(rsOTP);
    const otp: number = resultOTP.otp;
    const resultlocacheOTP: any = {
      otp: resultOTP.otp,
      uid: resultOTP.uid,
      username: resultOTP.username,
      roleId: resultOTP.roleId,
      email: resultOTP.email,
      token: resultOTP.token,
    };
    //  // console.log('--------------------------');
    //  // console.log('resultOTP----->');console.info(resultOTP);
    if (otpvalidate === otp) {
      // console.log('--------------------------');
      // console.log('otpvalidate----->'+otpvalidate+'--otp----->'+otp);
      //  // console.log('--------------------------');
      //  // console.log('resultlocacheOTP----->');console.info(resultlocacheOTP);
      //  // console.log('--------------------------');
      // await this.DeleteCacheData(keycache);
      //let status:number=1
      return resultlocacheOTP;
    } else {
      // let status:number=0
      // console.log('---------null-----------------');
      return null;
    }
  }
  //******************/
  async GetAllCacheDatakeys() {
      // console.log('------GetAllCacheData------'); 
      try {
        // ใช้คำสั่ง KEYS เพื่อดึง key ทั้งหมด
        const keys = await promisify(client.keys).bind(client)('*');
        // console.log('Found keys:', keys);

        // ดึงข้อมูลของแต่ละ key
        const allData: { [key: string]: any } = {};
        
        for (const key of keys) {
          const result = await promisify(client.get).bind(client)(key);
          if (result) {
            allData[key] = JSON.parse(result);
          } else {
            allData[key] = null;
          }
        }

        // console.log('All cache data:', allData);
        return allData;
      } catch (error) {
        console.error('Error getting all cache data:', error);
        throw error;
      }
  } 
  // หรือใช้ SCAN สำหรับฐานข้อมูลขนาดใหญ่ (แนะนำ)
  async GetAllCacheDataWithScan() {
    // console.log('------GetAllCacheDataWithScan------'); 
    try {
      const allData: { [key: string]: any } = {};
      let cursor = '0'; 
      do {
        // ใช้ SCAN เพื่อดึง key แบบแบ่งหน้า (เหมาะสำหรับฐานข้อมูลใหญ่)
        const scanResult = await promisify(client.scan).bind(client)(cursor, 'MATCH', '*', 'COUNT', 100);
        cursor = scanResult[0];
        const keys = scanResult[1];
        
        console.log(`Scan cursor: ${cursor}, found keys: ${keys.length}`);

        // ดึงข้อมูลของแต่ละ key
        for (const key of keys) {
          const result = await promisify(client.get).bind(client)(key);
          if (result) {
            allData[key] = JSON.parse(result);
          } else {
            allData[key] = null;
          }
        }
      } while (cursor !== '0');

      // console.log('All cache data:', allData);
      return allData;
    } catch (error) {
      console.error('Error getting all cache data with scan:', error);
      throw error;
    }
  } 
  // ฟังก์ชันดึงเฉพาะ key ทั้งหมด
  async GetAllKeys() {
    // console.log('------GetAllKeys------');
    try {
      const keys = await promisify(client.keys).bind(client)('*');
      // console.log('All keys:', keys);
      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw error;
    }
  }
  async SearchKeys(pattern: string) {
    // console.log('------SearchKeys------');
    // console.log('Search pattern:', pattern);
    
    try {
      // ใช้ KEYS กับ pattern
      const keys = await promisify(client.keys).bind(client)(pattern);
      // console.log('Found keys:', keys);
      return keys;
    } catch (error) {
      console.error('Error searching keys:', error);
      throw error;
    }
  }
  async SearchKeysWithScan(pattern: string) {
      // console.log('------SearchKeysWithScan------');
      // console.log('Search pattern:', pattern);
      
      try {
        const foundKeys: string[] = [];
        let cursor = '0';
        
        do {
          // ใช้ SCAN กับ pattern
          const scanResult = await promisify(client.scan).bind(client)(
            cursor, 
            'MATCH', 
            pattern, 
            'COUNT', 
            100
          );
          cursor = scanResult[0];
          const keys = scanResult[1];
          
          console.log(`Scan cursor: ${cursor}, found keys: ${keys.length}`);
          foundKeys.push(...keys);
          
        } while (cursor !== '0');

        // console.log('All found keys:', foundKeys);
        return foundKeys;
      } catch (error) {
        console.error('Error searching keys with scan:', error);
        throw error;
      }
  }
  async SearchCacheData(pattern: string) {
    // console.log('------SearchCacheData------');
    // console.log('Search pattern:', pattern);
    
    try {
      const keys = await this.SearchKeys(pattern);
      const resultData: { [key: string]: any } = {};
      
      for (const key of keys) {
        const value = await promisify(client.get).bind(client)(key);
        if (value) {
          resultData[key] = JSON.parse(value);
        } else {
          resultData[key] = null;
        }
      }

      // console.log('Search result:', resultData);
      return resultData;
    } catch (error) {
      console.error('Error searching cache data:', error);
      throw error;
    }
  }
  // ฟังก์ชันตรวจสอบว่ามี key ที่ตรงกับ pattern หรือไม่
  async HasKey(pattern: string): Promise<boolean> {
      try {
        const keys = await this.SearchKeys(pattern);
        return keys.length > 0;
      } catch (error) {
        console.error('Error checking key existence:', error);
        return false;
      }
  } 
  // ฟังก์ชันนับจำนวน key ที่ตรงกับ pattern
  async CountKeys(pattern: string): Promise<number> {
      try {
        const keys = await this.SearchKeys(pattern);
        return keys.length;
      } catch (error) {
        console.error('Error counting keys:', error);
        return 0;
      }
  }
  // ฟังก์ชันเสริมสำหรับดึง TTL ของ key
  async getKeyTTL(key: string): Promise<number> {
      try {
        // ใช้คำสั่ง TTL ของ Redis
        const ttl = await promisify(client.ttl).bind(client)(key);
        return ttl;
      } catch (error) {
        console.error(`Error getting TTL for key ${key}:`, error);
        return -1;
      }
  }
  //******************/
}