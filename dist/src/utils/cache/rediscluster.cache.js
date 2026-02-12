"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheData = void 0;
const { promisify } = require('util');
const ioRedis = require('ioredis');
const RedisTimeout = require('ioredis-timeout');
const moment = require('moment');
require("dotenv/config");
require('dotenv').config();
const rediscluster_config_cache_1 = __importDefault(require("./rediscluster-config.cache"));
let client = null;
const ConnectionCache = () => {
    client = new ioRedis.Cluster(rediscluster_config_cache_1.default.host, rediscluster_config_cache_1.default.option);
    RedisTimeout(client, rediscluster_config_cache_1.default.option.timeout);
    client.on('ready', () => {
        console.log('2rd Cache Redis Cluster Connect is success');
    });
    client.on('error', (err) => {
        console.log(`2rd init Cache Redis Cluster init fail : ${err}`);
    });
};
const retRet = {
    result: true,
    remark: 'success',
    runlotime: null,
    data: [],
};
class CacheData {
    async SetCacheData(setData) {
        if (client === null) {
            await ConnectionCache();
        }
        const time = setData.time;
        const keycache = setData.keycache;
        const data = setData.data;
        await client.setex(keycache, time, JSON.stringify(data));
        return keycache;
    }
    async GetCacheData(keycache) {
        if (client === null) {
            await ConnectionCache();
        }
        const result = await promisify(client.get).bind(client)(keycache);
        const resultcache = JSON.parse(result);
        return resultcache;
    }
    async DeleteCacheData(keycache) {
        if (client === null) {
            await ConnectionCache();
        }
        await promisify(client.del).bind(client)(keycache);
        return keycache;
    }
    async resetCacheById(keycache) {
        if (client === null) {
            await ConnectionCache();
        }
        await promisify(client.getset).bind(client)(keycache, 0);
        return keycache;
    }
    async UpdateCacheData(setData) {
        if (client === null) {
            await ConnectionCache();
        }
        let id = setData.id;
        const time = setData.time;
        const keycache = setData.keycache;
        const value_data = setData.data;
        console.log('setcache setData', setData);
        if (id == '') {
            await client.getset(keycache, JSON.stringify(value_data));
        }
        else {
            await client.hset(id, keycache, time, JSON.stringify(value_data));
        }
        return keycache;
    }
    async gethCacheById(setData) {
        if (client === null) {
            await ConnectionCache();
        }
        let id = setData.id;
        const time = setData.time;
        const keycache = setData.keycache;
        const value_data = setData.data;
        const result = await promisify(client.hmget).bind(client)(id, keycache);
        return keycache;
    }
    async Test(setData) {
        if (client === null) {
            await ConnectionCache();
        }
        const time = setData.time;
        const keycache = 'Test_Cache';
        return keycache;
    }
    async OTP(keycache) {
        if (client === null) {
            await ConnectionCache();
        }
        let date = Date.now();
        var nowseconds = new Date().getTime();
        var timestamp = nowseconds;
        var datenew = new Date(timestamp);
        const dayth = toThaiDate(datenew);
        const dayen = toEnDate(datenew);
        const time = 30;
        const data = getRandomint(6);
        const keyotp = getRandomString(7);
        const key = 'OTP_Auth_' + data;
        await client.setex(key, time, JSON.stringify(data));
        console.log('keycache ', key);
        const getOTP = await promisify(client.get).bind(client)(key);
        console.log('getOTP ', getOTP);
        const resultlocacheloOTP = JSON.parse(getOTP);
        var startDate = new Date(timestamp);
        var endDate = new Date(timestamp);
        if (startDate < endDate) {
        }
        const OTP = {
            key: key,
            time: time,
            OTP: resultlocacheloOTP,
            dayloth: dayth,
            dayloen: dayen,
            timestamp: timestamp,
            timelostart: datenew,
        };
        return OTP;
    }
    async validateOTP(setData) {
        const keycache = setData.keycache;
        const otpval = setData.otpval;
        const timestamp = setData.timestamp;
        const keycachedata = 'OTP_Auth_' + otpval;
        if (client === null) {
            await ConnectionCache();
        }
        const rsOTP = await promisify(client.get).bind(client)(keycachedata);
        const resultlocacheloOTP = JSON.parse(rsOTP);
        console.log('validateOTP otp val=>', otpval);
        console.log('validateOTP rs OTP=>', resultlocacheloOTP);
        console.log('validateOTP key=>', keycachedata);
        if (otpval == resultlocacheloOTP) {
            var status = 1;
        }
        else {
            var status = 0;
        }
        return status;
    }
    async Run(keycache) {
        if (client === null) {
            await ConnectionCache();
        }
        const time = 30;
        const data = getRandomint(6);
        const keyotp = getRandomString(12);
        const key = 'True_plookpanya_OTP_' + keyotp + '_' + data;
        await client.setex(key, time, JSON.stringify(data));
        const result = await promisify(client.get).bind(client)(key);
        const resultcache = JSON.parse(result);
        const run = {
            key: key,
            time: time,
            OTP: resultcache,
        };
        return run;
    }
}
exports.CacheData = CacheData;
function getRandomString(length) {
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
//# sourceMappingURL=rediscluster.cache.js.map