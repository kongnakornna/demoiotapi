"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDataOne = void 0;
require("dotenv/config");
require('dotenv').config();
const API_VERSION = '1';
const redis_option = process.env.REDIS_OPTION || '1';
const redis_port = process.env.REDIS_PORT || '6379';
const redis_host = process.env.REDIS_HOST || '127.0.0.1';
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
const retRet = {
    result: true,
    remark: 'success',
    runlotime: null,
    data: [],
};
const client = redis.createClient({
    host: redis_host,
    port: parseInt(redis_port),
    password: redis_password,
});
const clienton = client.on('ready', () => {
});
const clienterror = client.on('error', (err) => {
});
const redis_ready = client.ready;
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
    async DeleteCacheData(keycache) {
        await promisify(client.del).bind(client)(keycache);
        return keycache;
    }
    async OTP(keycache) {
        let date = Date.now();
        let nowseconds = new Date().getTime();
        let timestamp = nowseconds;
        let datenew = new Date(timestamp);
        const dayth = toThaiDate(datenew);
        const dayen = toEnDate(datenew);
        const time = 30;
        const data = getRandomint(6);
        const keyotp = getRandomString(7);
        const key = 'OTP_' + data;
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
    async validateOTP(setData) {
        const keycache = setData.keycache;
        const otpval = setData.otpval;
        const timestamp = setData.timestamp;
        const keycachedata = 'OTP_' + otpval;
        const rsOTP = await promisify(client.get).bind(client)(keycachedata);
        const resultlocacheloOTP = JSON.parse(rsOTP);
        if (otpval == resultlocacheloOTP) {
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
        const dataotp = getRandomint(6);
        const data = datars;
        let keyotp = getRandomString(8);
        const key = keyotp;
        const input = {};
        input.key = key;
        input.time = time;
        input.OTP = data;
        return input;
    }
}
exports.CacheDataOne = CacheDataOne;
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
function getRandomStrings(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
function getRandomint(length) {
    var randomChars = '0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
function toThaiDate(date) {
    let monthNames = [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
    ];
    let year = date.getFullYear() + 543;
    let month = monthNames[date.getMonth()];
    let numOfDay = date.getDate();
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let second = date.getSeconds().toString().padStart(2, '0');
    return `${numOfDay} ${month} ${year} ` + `${hour}:${minutes}:${second} น.`;
}
function toEnDate(date) {
    let monthNames = [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May.',
        'Jun.',
        'Jul.',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.',
    ];
    let monthNameslong = [
        'January',
        'February',
        'March.',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let year = date.getFullYear() + 0;
    let month = monthNameslong[date.getMonth()];
    let numOfDay = date.getDate();
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let second = date.getSeconds().toString().padStart(2, '0');
    return `${numOfDay} ${month} ${year} ` + `${hour}:${minutes}:${second}`;
}
//# sourceMappingURL=redisv2.cache.js.map