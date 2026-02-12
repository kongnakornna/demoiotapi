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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const devicetype_entity_1 = require("../settings/entities/devicetype.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
const deviceaction_entity_1 = require("../settings/entities/deviceaction.entity");
const deviceactionlog_entity_1 = require("../settings/entities/deviceactionlog.entity");
const deviceactionuser_entity_1 = require("../settings/entities/deviceactionuser.entity");
const devivicealarmaction_entity_1 = require("../settings/entities/devivicealarmaction.entity");
const telegram_entity_1 = require("../settings/entities/telegram.entity");
const api_entity_1 = require("../settings/entities/api.entity");
const device_entity_1 = require("../settings/entities/device.entity");
const email_entity_1 = require("../settings/entities/email.entity");
const host_entity_1 = require("../settings/entities/host.entity");
const influxdb_entity_1 = require("../settings/entities/influxdb.entity");
const line_entity_1 = require("../settings/entities/line.entity");
const nodered_entity_1 = require("../settings/entities/nodered.entity");
const schedule_entity_1 = require("../settings/entities/schedule.entity");
const sms_entity_1 = require("../settings/entities/sms.entity");
const token_entity_1 = require("../settings/entities/token.entity");
const scheduledevice_entity_1 = require("../settings/entities/scheduledevice.entity");
const scheduleprocesslog_entity_1 = require("../settings/entities/scheduleprocesslog.entity");
const alarmprocesslog_entity_1 = require("../settings/entities/alarmprocesslog.entity");
const mqttlog_entity_1 = require("../iot/entities/mqttlog.entity");
const format = __importStar(require("../../helpers/format.helper"));
const microservices_1 = require("@nestjs/microservices");
const redis_cache_1 = require("../../utils/cache/redis.cache");
const tz = require('moment-timezone');
var Cache = new redis_cache_1.CacheDataOne();
var md5 = require('md5');
const mqtt_1 = require("mqtt");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const format_helper_1 = require("../../helpers/format.helper");
var moment = require('moment');
var connectUrl_mqtt = process.env.MQTT_HOST;
if (!connectUrl_mqtt) {
    var connectUrl_mqtt = 'mqtt://localhost:1883';
}
if (!connectUrl_mqtt) {
    var connectUrl_mqtt = 'mqtt://127.0.0.1:1883';
}
let MqttService = MqttService_1 = class MqttService {
    constructor(client, SettingRepository, LocationRepository, TypeRepository, SensorRepository, GroupRepository, MqttRepository, ApiRepository, DeviceTypeRepository, DeviceRepository, EmailRepository, HostRepository, InfluxdbRepository, LineRepository, NoderedRepository, ScheduleRepository, SmsRepository, TokenRepository, scheduleDeviceRepository, DeviceactionRepository, DeviceactionlogRepository, DeviceactionuserRepository, DevicealarmactionRepository, TelegramRepository, scheduleprocesslogRepository, alarmprocesslogRepository, mqttlogRepository) {
        this.client = client;
        this.SettingRepository = SettingRepository;
        this.LocationRepository = LocationRepository;
        this.TypeRepository = TypeRepository;
        this.SensorRepository = SensorRepository;
        this.GroupRepository = GroupRepository;
        this.MqttRepository = MqttRepository;
        this.ApiRepository = ApiRepository;
        this.DeviceTypeRepository = DeviceTypeRepository;
        this.DeviceRepository = DeviceRepository;
        this.EmailRepository = EmailRepository;
        this.HostRepository = HostRepository;
        this.InfluxdbRepository = InfluxdbRepository;
        this.LineRepository = LineRepository;
        this.NoderedRepository = NoderedRepository;
        this.ScheduleRepository = ScheduleRepository;
        this.SmsRepository = SmsRepository;
        this.TokenRepository = TokenRepository;
        this.scheduleDeviceRepository = scheduleDeviceRepository;
        this.DeviceactionRepository = DeviceactionRepository;
        this.DeviceactionlogRepository = DeviceactionlogRepository;
        this.DeviceactionuserRepository = DeviceactionuserRepository;
        this.DevicealarmactionRepository = DevicealarmactionRepository;
        this.TelegramRepository = TelegramRepository;
        this.scheduleprocesslogRepository = scheduleprocesslogRepository;
        this.alarmprocesslogRepository = alarmprocesslogRepository;
        this.mqttlogRepository = mqttlogRepository;
        this.latestData = new Map();
        this.messageStream = new rxjs_1.Subject();
        this.logger = new common_1.Logger(MqttService_1.name);
        this.messageStreams = new rxjs_1.BehaviorSubject({ topic: '', payload: Buffer.from('') });
        this.messageCache1 = new Map();
        this.subscribedTopics1 = new Set();
        this.isConnected = false;
        this.connectionPromise = null;
        this.subscribedTopics = new Set();
        this.messageCache = new Map();
        this.subscribedTopic = new Set();
        this.messageCached = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
        this.logger.log(' 🔌 MqttService initialized. ✅ In-memory state is ready. 🚀🚀🚀');
        this.connectionStatus = {
            connected: false,
            lastConnectionTime: null,
            error: null
        };
    }
    onModuleInit() {
        this.IsonModuleInit(connectUrl_mqtt);
    }
    async IsonModuleInit(connectUrl_mqtt) {
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
        console.log(` ✅ mqtt_connectUrl_mqtt=>` + connectUrl_mqtt + ` ✅ mqtt_clientId=>` + clientId);
        this.mqttClient = (0, mqtt_1.connect)(connectUrl_mqtt, {
            clientId,
            clean: true,
            connectTimeout: 10000,
            reconnectPeriod: 10000,
        });
        this.mqttClient.on('connect', () => {
            console.log(` ✅ mqtt_hostt=>` + connectUrl_mqtt);
            console.log(' 🟢 Connected to  ✅  MQTT 🔌 Broker 🚀🚀🚀  Ready! 🚀🚀🚀');
        });
        this.mqttClient.on('error', (err) => {
            console.log(` ✅ mqtt_hostt=>` + connectUrl_mqtt);
            console.error('❌ MQTT Connection 🔴 Error:', err);
        });
        this.mqttClient.on('message', (topic, payload) => {
            console.log(` ✅ topic 📨 =>`);
            console.info(topic);
            console.log(` ✅ payload 📨 =>`);
            console.info(payload);
            this.messageStream.next({ topic, payload });
        });
    }
    isMqttConnected() {
        try {
            if (!this.mqttClient) {
                console.warn('  ❌  MQTT client is not initialized 🔴');
                return false;
            }
            const isConnected = this.mqttClient.connected;
            console.log(` 🟡 MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
            if (!isConnected && this.connectionStatus.error) {
                console.error(' ❌ Last connection error:', this.connectionStatus.error);
            }
            return isConnected;
        }
        catch (error) {
            console.error(' ❌ Error checking MQTT connection:', error);
            return false;
        }
    }
    async getdevicedataDirecs(topics) {
        const topic = encodeURI(topics);
        if (this.messageCached.has(topic)) {
            return this.messageCached.get(topic);
        }
        if (!this.subscribedTopic.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopic.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                throw new Error(` ❌ Failed to subscribe to topic "${topic}": ${err.message}`);
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCached.set(topic, result);
            return result;
        }
        catch (err) {
            if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                throw new Error(` ❌ Timeout: No message received from topic "${topic}" within 10 seconds.`);
            }
            else {
                throw new Error(` ❌ Error receiving message from topic "${topic}": ${err.message}`);
            }
        }
    }
    clearTopicCache(topic) {
        if (topic) {
            const encodedTopic = encodeURI(topic);
            this.messageCached.delete(encodedTopic);
        }
        else {
            this.messageCached.clear();
        }
    }
    unsubscribeTopic(topic) {
        const encodedTopic = encodeURI(topic);
        this.mqttClient.unsubscribe(encodedTopic);
        this.subscribedTopic.delete(encodedTopic);
        this.messageCached.delete(encodedTopic);
    }
    onModuleDestroy() {
        if (this.mqttClient) {
            this.mqttClient.end();
        }
    }
    async initializeMqttClient(brokerUrl) {
        var _a, _b;
        const url = brokerUrl;
        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                const clientOptions = {
                    clientId: 'client_' + Math.random().toString(16).substr(2, 8),
                    clean: true,
                    connectTimeout: 4000,
                    reconnectPeriod: 1000,
                    keepalive: 60,
                };
                console.log(`Connecting to MQTT broker: ${url}`);
                this.mqttClient = (0, mqtt_1.connect)(url, clientOptions);
                this.mqttClient.on('connect', () => {
                    console.log('✅ Connected to MQTT broker');
                    this.isConnected = true;
                    resolve(true);
                });
                this.mqttClient.on('message', (topic, payload) => {
                    console.log(`📨 Received message from topic: ${topic}`);
                    this.messageStream.next({ topic, payload });
                    this.updateCache(topic, payload);
                });
                this.mqttClient.on('error', (error) => {
                    console.error('❌ MQTT error:', error);
                    this.isConnected = false;
                    reject(error);
                });
                this.mqttClient.on('close', () => {
                    console.log('🔌 MQTT connection closed');
                    this.isConnected = false;
                    this.connectionPromise = null;
                });
                this.mqttClient.on('reconnect', () => {
                    console.log('🔄 MQTT reconnecting...');
                });
                this.mqttClient.on('offline', () => {
                    console.log('MQTT client offline');
                    this.isConnected = false;
                });
            }
            catch (error) {
                console.error('❌ Failed to initialize MQTT client:', error);
                this.connectionPromise = null;
                reject(error);
            }
        });
        if (this.isConnected == true) {
            var statusMqtt = 1;
            var msg = ' 🔌  Connected to MQTT broker';
        }
        else {
            var statusMqtt = 0;
            var msg = ' 🔌  Disconnected MQTT broker';
        }
        var connectionPromise = this.connectionPromise;
        if (this.connectionPromise) {
            var rt = {
                url: url,
                status: statusMqtt,
                msg,
                connected: true,
                isConnected: this.isConnected,
                mqttClientConnected: ((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected) || false,
                subscribedTopics: Array.from(this.subscribedTopics),
                cacheSize: this.messageCached.size
            };
            return rt;
        }
        else {
            var rt = {
                url: url,
                status: statusMqtt,
                msg,
                connected: false,
                isConnected: this.isConnected,
                mqttClientConnected: ((_b = this.mqttClient) === null || _b === void 0 ? void 0 : _b.connected) || false,
                subscribedTopics: Array.from(this.subscribedTopics),
                cacheSize: this.messageCached.size
            };
            return rt;
        }
    }
    updateCache(topic, payload) {
        try {
            const payloadString = payload.toString();
            let result;
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCached.set(topic, result);
            console.log(`Cache updated for topic: ${topic}`);
        }
        catch (error) {
            console.error('Error updating cache for topic:', topic, error);
        }
    }
    async getMqttData(topic) {
        return await this.getDataTopicCacheDataMqtt(topic);
    }
    async publishMessage(topic, message) {
        var _a;
        if (!this.isConnected || !((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected)) {
            const errorMsg = 'MQTT client is not connected';
            console.error(errorMsg);
            return { success: false, error: errorMsg };
        }
        try {
            const payload = typeof message === 'object' ? JSON.stringify(message) : message;
            await new Promise((resolve, reject) => {
                this.mqttClient.publish(topic, payload, { qos: 0, retain: false }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log(`Message published to topic: ${topic}`);
                        resolve();
                    }
                });
            });
            return { success: true };
        }
        catch (error) {
            console.error('Failed to publish message:', error);
            return { success: false, error: error.message };
        }
    }
    async subscribeToMultipleTopics(topics) {
        if (!this.isConnected) {
            return { success: false, errors: ['MQTT client is not connected'] };
        }
        const errors = [];
        const encodedTopics = topics.map(topic => encodeURI(topic));
        try {
            await new Promise((resolve, reject) => {
                this.mqttClient.subscribe(encodedTopics, { qos: 0 }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        encodedTopics.forEach(topic => {
                            this.subscribedTopics.add(topic);
                        });
                        console.log(`Subscribed to topics: ${encodedTopics.join(', ')}`);
                        resolve();
                    }
                });
            });
            return { success: true };
        }
        catch (error) {
            console.error('Failed to subscribe to topics:', error);
            return { success: false, errors: [error.message] };
        }
    }
    unsubscribeFromTopic(topic) {
        return new Promise((resolve) => {
            const encodedTopic = encodeURI(topic);
            this.mqttClient.unsubscribe(encodedTopic, (err) => {
                if (err) {
                    console.error(`Failed to unsubscribe from topic "${encodedTopic}":`, err);
                    resolve({ success: false, error: err.message });
                }
                else {
                    this.subscribedTopics.delete(encodedTopic);
                    this.messageCached.delete(encodedTopic);
                    console.log(`Unsubscribed from topic: ${encodedTopic}`);
                    resolve({ success: true });
                }
            });
        });
    }
    getConnectionStatus() {
        var _a;
        return this.isConnected && ((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected) === true;
    }
    async getDetailedConnectionStatus() {
        var _a;
        return {
            isConnected: this.isConnected,
            mqttClientConnected: ((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected) || false,
            subscribedTopics: Array.from(this.subscribedTopics),
            cacheSize: this.messageCached.size
        };
    }
    clearCache() {
        this.messageCached.clear();
        console.log('Cache cleared');
    }
    clearTopicCached(topic) {
        const encodedTopic = encodeURI(topic);
        const deleted = this.messageCached.delete(encodedTopic);
        if (deleted) {
            console.log(`Cache cleared for topic: ${encodedTopic}`);
        }
        else {
            console.log(`No cache found for topic: ${encodedTopic}`);
        }
    }
    async getCachedData(topic) {
        const encodedTopic = encodeURI(topic);
        return this.messageCached.get(encodedTopic);
    }
    hasCachedData(topic) {
        const encodedTopic = encodeURI(topic);
        return this.messageCached.has(encodedTopic);
    }
    async disconnect() {
        if (this.mqttClient) {
            return new Promise((resolve) => {
                this.mqttClient.end(false, () => {
                    this.isConnected = false;
                    this.subscribedTopics.clear();
                    this.messageCached.clear();
                    this.connectionPromise = null;
                    console.log('MQTT client disconnected');
                    resolve();
                });
            });
        }
    }
    async reconnect(brokerUrl) {
        if (this.mqttClient) {
            await this.disconnect();
        }
        return await this.initializeMqttClient(brokerUrl);
    }
    async waitForConnection(timeoutMs = 5000) {
        if (this.isConnected) {
            return true;
        }
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                this.mqttClient.removeListener('connect', onConnect);
                resolve(false);
            }, timeoutMs);
            const onConnect = () => {
                clearTimeout(timeoutId);
                resolve(true);
            };
            this.mqttClient.once('connect', onConnect);
        });
    }
    getMqttClient() {
        return this.mqttClient || null;
    }
    getSubscribedTopics() {
        return Array.from(this.subscribedTopics);
    }
    getCacheStats() {
        return {
            size: this.messageCached.size,
            keys: Array.from(this.messageCached.keys())
        };
    }
    async subscribeToTopicWithResponse(topic, timeoutMs = 10000) {
        const encodedTopic = encodeURI(topic);
        if (!this.isConnected) {
            return { case: 0, status: 0, msg: 0, message: 'MQTT client is not connected' };
        }
        if (this.messageCache.has(encodedTopic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(encodedTopic) };
        }
        if (!this.subscribedTopics.has(encodedTopic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(encodedTopic, { qos: 0 }, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(encodedTopic);
                            console.log(`Subscribed to topic: ${encodedTopic}`);
                            resolve();
                        }
                    });
                });
            }
            catch (error) {
                return { case: 2, status: 0, msg: 0, message: `Failed to subscribe: ${error.message}` };
            }
        }
        return new Promise((resolve) => {
            const subscription = this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === encodedTopic), (0, operators_1.map)((msg) => {
                const payloadString = msg.payload.toString();
                let result;
                if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                this.messageCache.set(encodedTopic, result);
                return result;
            })).subscribe({
                next: (data) => {
                    subscription.unsubscribe();
                    resolve({ case: 3, status: 1, msg: data });
                },
                error: (error) => {
                    subscription.unsubscribe();
                    resolve({ case: 4, status: 0, msg: 0, message: `Error: ${error.message}` });
                }
            });
            setTimeout(() => {
                subscription.unsubscribe();
                resolve({ case: 5, status: 0, msg: 0, message: `Timeout: No message received within ${timeoutMs}ms` });
            }, timeoutMs);
        });
    }
    subscribeToTopic(topic, returnAsPromise = false, timeoutMs = 10000) {
        const encodedTopic = encodeURI(topic);
        if (!this.subscribedTopics.has(encodedTopic)) {
            this.mqttClient.subscribe(encodedTopic, { qos: 0 }, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to topic "${encodedTopic}":`, err);
                }
                else {
                    this.subscribedTopics.add(encodedTopic);
                    console.log(`Subscribed to topic: ${encodedTopic}`);
                }
            });
        }
        const observable = this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === encodedTopic), (0, operators_1.map)((msg) => {
            const payloadString = msg.payload.toString();
            let result;
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(encodedTopic, result);
            return result;
        }));
        if (returnAsPromise) {
            return new Promise((resolve, reject) => {
                const subscription = observable.subscribe({
                    next: (data) => {
                        subscription.unsubscribe();
                        resolve({ case: 1, status: 1, msg: data });
                    },
                    error: (error) => {
                        subscription.unsubscribe();
                        reject({ case: 0, status: 0, msg: 0, message: error.message });
                    }
                });
                setTimeout(() => {
                    subscription.unsubscribe();
                    reject({ case: 0, status: 0, msg: 0, message: `Timeout after ${timeoutMs}ms` });
                }, timeoutMs);
            });
        }
        return observable;
    }
    async getDataTopics(topics) {
        var _a, _b;
        const topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            console.log(`Returning cached data for topic: ${topic}`);
            return {
                case: 1,
                status: 1,
                msg: this.messageCache.get(topic)
            };
        }
        if (!this.isConnected || !((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected)) {
            console.error(`MQTT client is not connected for topic: ${topic}`);
            return {
                case: 0,
                status: 0,
                msg: 0, message: 'MQTT client is not connected'
            };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                console.log(`Subscribing to new topic: ${topic}`);
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, { qos: 0 }, (err) => {
                        if (err) {
                            console.error(`Subscription failed for topic ${topic}:`, err);
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            console.log(`Successfully subscribed to topic: ${topic}`);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                console.error(`Subscription error for topic ${topic}:`, err);
                return {
                    case: 2,
                    status: 0,
                    msg: 0, message: `Failed to subscribe to topic "${topic}": ${err.message}`
                };
            }
        }
        try {
            console.log(`Waiting for message on topic: ${topic}`);
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => {
                const matches = msg.topic === topic;
                if (matches) {
                    console.log(`Found matching message for topic: ${topic}`);
                }
                return matches;
            }), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => {
                const hasMessages = messages.length > 0;
                if (hasMessages) {
                    console.log(`Received ${messages.length} messages for topic: ${topic}`);
                }
                return hasMessages;
            }), (0, operators_1.map)(messages => {
                console.log(`Taking first message from ${messages.length} messages`);
                return messages[0];
            }), (0, operators_1.take)(1), (0, operators_1.timeout)({
                each: 10000,
                with: () => {
                    throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                }
            }), (0, operators_1.catchError)((error) => {
                console.error(`Error in message stream for topic ${topic}:`, error);
                throw error;
            })));
            console.log(`Processing message for topic: ${topic}`);
            let result;
            const payloadString = message.payload.toString();
            console.log(`Raw payload: ${payloadString}`);
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                    console.log(`Parsed JSON successfully for topic: ${topic}`);
                }
                catch (e) {
                    console.warn(`JSON parse failed for topic ${topic}, using raw string`);
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
                console.log(`Using raw string payload for topic: ${topic}`);
            }
            this.messageCache.set(topic, result);
            console.log(`Cached data for topic: ${topic}`);
            return {
                case: 3,
                status: 1,
                msg: result
            };
        }
        catch (err) {
            console.error(`Error receiving message for topic "${topic}":`, err);
            if (((_b = err.message) === null || _b === void 0 ? void 0 : _b.includes('Timeout')) || err.name === 'TimeoutError') {
                return {
                    case: 4,
                    status: 0,
                    msg: 0, message: `Timeout: No message received from topic "${topic}" within 10 seconds.`
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0, message: `Error receiving message from topic "${topic}": ${err.message}`
                };
            }
        }
    }
    async subscribeToTopicS(topic) {
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
    async waitForMessage(topic) {
        return (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
    }
    generateTimestamp() {
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    processPayload(payloadString) {
        const trimmedPayload = payloadString.trim();
        if (trimmedPayload.startsWith('{') || trimmedPayload.startsWith('[')) {
            try {
                return JSON.parse(trimmedPayload);
            }
            catch (e) {
                return trimmedPayload;
            }
        }
        return trimmedPayload;
    }
    async cacheResult(key, result, timestamp, time) {
        const cacheData = {
            keycache: key,
            time: time,
            data: { result, timestamp }
        };
        try {
            await Cache.SetCacheData(cacheData);
        }
        catch (err) {
            console.error('Cache set error:', err);
        }
    }
    buildResponse(data) {
        return {
            case: data.case,
            status: data.status,
            msg: data.msg,
            fromCache: data.fromCache,
            time: data.time,
            timestamp: data.timestamp,
            isConnected: data.isConnected
        };
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getMqttConnectionStatus() {
        return {
            connected: this.mqttClient ? this.mqttClient.connected : false,
            lastConnectionTime: this.connectionStatus.lastConnectionTime,
            error: this.connectionStatus.error
        };
    }
    checkConnectionStatus() {
        const isConnected = this.isMqttConnected();
        const isConnectedCli = this.mqttClient && this.mqttClient.connected;
        console.log(`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
        console.log(`isConnectedCli=>` + isConnectedCli);
        console.log(`isConnected=>` + isConnected);
        if (isConnected == true) {
            var statusMqtt = 1;
        }
        else {
            var statusMqtt = 0;
        }
        console.log(`statusMqtt=>'`);
        console.info(statusMqtt);
    }
    async checkConnectionStatusMqtt() {
        const isConnected = await this.isMqttConnected();
        const isConnectedCli = await this.mqttClient && this.mqttClient.connected;
        console.log(`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
        console.log(`isConnectedCli=>` + isConnectedCli);
        console.log(`isConnected=>` + isConnected);
        if (isConnected == true) {
            var statusMqtt = 1;
        }
        else {
            var statusMqtt = 0;
        }
        console.log(`statusMqtt=>` + statusMqtt);
        return {
            isConnected,
            connected: isConnectedCli,
            status: statusMqtt,
            msg: `MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`,
        };
    }
    async checkConnectionStatusMqtts(UrlMqtt) {
        const isConnect = await this.IsonModuleInit(UrlMqtt);
        const isConnected = await this.isMqttConnected();
        const isConnectedCli = await this.mqttClient && this.mqttClient.connected;
        console.log(`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
        console.log(`isConnectedCli=>` + isConnectedCli);
        console.log(`isConnected=>` + isConnected);
        if (isConnected == true) {
            var statusMqtt = 1;
        }
        else {
            var statusMqtt = 0;
        }
        console.log(`statusMqtt=>` + statusMqtt);
        return {
            url: UrlMqtt,
            isConnect,
            isConnected,
            connected: isConnectedCli,
            status: statusMqtt,
            msg: `MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`,
        };
    }
    async getDataTopicCacheDataMqtt(topics) {
        var _a;
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        const topic = encodeURI(topics);
        const isConnected = await this.isMqttConnected();
        if (!isConnected) {
            return { case: 0, status: 0, data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0', msg: 0, message: 'MQTT client is not connected', time: timestamp, timestamp: timestamp };
        }
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, data: this.messageCache.get(topic), msg: 0, message: 'MQTT client is connected', time: timestamp, timestamp: timestamp };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            console.log(`Subscribed to topic: ${topic}`);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return {
                    case: 2,
                    status: 0,
                    data: null,
                    msg: 0, message: `Failed to subscribe to topic "${topic}": ${err.message}`,
                    time: timestamp, timestamp: timestamp
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result, time: timestamp, timestamp: timestamp };
        }
        catch (err) {
            if (err.name === 'TimeoutError' || ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
                return {
                    case: 4,
                    status: 0,
                    msg: 0, message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
                    time: timestamp, timestamp: timestamp
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0, message: `Error receiving message from topic "${topic}": ${err.message}`,
                    time: timestamp, timestamp: timestamp
                };
            }
        }
    }
    async getdMqttdataTopics(topics) {
        console.log(`-----------------getdMqttdataTopics----------------START----------`);
        var topic = encodeURI(topics);
        if (!topic) {
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic: topic,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        try {
            if (topic) {
                const now = new Date();
                const pad = (num) => String(num).padStart(2, '0');
                const datePart = [
                    now.getFullYear(),
                    pad(now.getMonth() + 1),
                    pad(now.getDate())
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds())
                ].join(':');
                var timestamp = datePart + ' ' + timePart;
                console.log(`Requesting data from topic: ${topic}`);
                var keycache = 'getdMqttdataTopics_' + topic;
                var data = await Cache.GetCacheData(keycache);
                if (data) {
                    var dataObject = data;
                    var getdataFrom = 'Cache';
                }
                else if (!data) {
                    var getdataFrom = 'MQTT';
                    var dataObject = await this.getDataFromTopic(topic);
                    var InpuDatacache = { keycache: keycache, time: 3, data: dataObject };
                    await Cache.SetCacheData(InpuDatacache);
                }
                console.log(`-----------------getdMqttdataTopics----------------END-----getdata-----` + getdataFrom);
                return dataObject;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getMqttTopicData(topics, deletecache) {
        const topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err)
                            reject(err);
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: 0, message: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            while (true) {
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.timeout)(10000)));
                let result;
                const payloadString = message.payload.toString();
                if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                this.messageCache.set(topic, result);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        catch (err) {
            return { case: 4, status: 0, msg: 0, message: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getMqttTopicDataRS(topics, deletecache) {
        console.log('------mqtt getMqttTopicDataRS------');
        var topic = encodeURI(topics);
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        console.log('-topic------' + topic);
        console.log('-now------' + now);
        console.log('----datePart---');
        console.info(datePart);
        console.log('---timePart---');
        console.info(timePart);
        console.log('--timestamp---');
        console.info(timestamp);
        console.log(`Requesting data from _topic: ${topic}`);
        if (!topic) {
            var ResultData = {
                topic: topic,
                data: [],
                timestamp: timestamp,
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        var keycache = 'cache_mqtt_topic_' + md5(topic);
        try {
            console.log(`Requesting data from keycache: ${keycache}`);
            var data = await Cache.GetCacheData(keycache);
            if (data) {
                return data;
            }
            else {
                var mqttdata = await this.getDataFromTopic(topic);
                console.log(`connectUrl_mqtt=>`);
                console.info(connectUrl_mqtt);
                console.log(`mqttdata-getDataFromTopic-topic==>`);
                console.info(mqttdata);
                var parts = mqttdata.split(',');
                var dataObjects = {
                    topic: topic,
                    cache: 'cache',
                    status: 1,
                    timestamp: timestamp,
                    msg: mqttdata,
                    data: parts
                };
                var InpuDatacache = { keycache: keycache, time: 10, data: dataObjects };
                await Cache.SetCacheData(InpuDatacache);
                return dataObjects;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async _getMqttTopicData(topics, deletecache) {
        var topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result };
        }
        catch (err) {
            return { case: 4, status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getMqttTopicDataV1(topics, deletecache) {
        var topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result };
        }
        catch (err) {
            return { case: 4, status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getMqttTopicS(topics, deletecache) {
        var topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            var kaycache_cache = 'getDataTopic_' + md5(topic);
            if (deletecache == 1) {
                await Cache.DeleteCacheData(kaycache_cache);
            }
            var rs = await Cache.GetCacheData(kaycache_cache);
            if (!rs) {
                var rs = await this.getDataTopicMqtt(topic);
                if (!rs.status || rs.status == 0) {
                    return rs;
                }
                var InpuDatacache = { keycache: kaycache_cache, time: 10, data: rs };
                await Cache.SetCacheData(InpuDatacache);
            }
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result, rs };
        }
        catch (err) {
            return { case: 4, status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getDataTopicCacheData(topics) {
        const topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result };
        }
        catch (err) {
            return { case: 4, status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getDataTopic2(topics) {
        const topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { case: 2, status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result };
        }
        catch (err) {
            return { case: 4, status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
            if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
            }
            else {
                throw new Error(`Error receiving message from topic "${topic}": ${err.message}`);
            }
        }
    }
    async getDataTopicdevicemqtt(topics, deletecache, retryCount = 2) {
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        var time = 120;
        var topic_key = 'getDataTopicdevicemqtt_' + topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time, timestamp: cached.timestamp };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                let result;
                const payloadString = message.payload.toString();
                try {
                    result = JSON.parse(payloadString);
                }
                catch (_a) {
                    result = payloadString;
                }
                if (result) {
                    var results = { result, timestamp };
                    var InpuDatacache = { keycache: topic_key, time: time, data: results };
                    await Cache.SetCacheData(InpuDatacache);
                    return { case: 3, status: 1, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
                else {
                    return { case: 4, status: 3, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return { case: 5, status: 0, msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`, time: time, timestamp: timestamp };
                }
            }
        }
    }
    async getDataTopic(topics, deletecache, retryCount = 2) {
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        var time = 120;
        var topic_key = topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time, timestamp: cached.timestamp };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                let result;
                const payloadString = message.payload.toString();
                try {
                    result = JSON.parse(payloadString);
                }
                catch (_a) {
                    result = payloadString;
                }
                if (result) {
                    var results = { result, timestamp };
                    var InpuDatacache = { keycache: topic_key, time: time, data: results };
                    await Cache.SetCacheData(InpuDatacache);
                    return { case: 3, status: 1, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
                else {
                    return { case: 4, status: 3, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return { case: 5, status: 0, msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`, time: time, timestamp: timestamp };
                }
            }
        }
    }
    async getDataTopicPage(topics, deletecache, retryCount = 2) {
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        var time = 10;
        var topic_key = 'getData_Topic_Page_' + md5(topic);
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time, timestamp: cached.timestamp };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                let result;
                const payloadString = message.payload.toString();
                try {
                    result = JSON.parse(payloadString);
                }
                catch (_a) {
                    result = payloadString;
                }
                if (result) {
                    var results = { result, timestamp };
                    var InpuDatacache = { keycache: topic_key, time: time, data: results };
                    await Cache.SetCacheData(InpuDatacache);
                    return { case: 3, status: 1, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
                else {
                    return { case: 4, status: 3, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return { case: 5, status: 0, msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`, time: time, timestamp: timestamp };
                }
            }
        }
    }
    async getMqttTopicPA(topics, deletecache, retryCount = 2) {
        const isConnected = await this.isMqttConnected();
        const timestamp = this.generateTimestamp();
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        const time = 10;
        const topic_key = 'getMqttTopicCA_' + topic;
        if (deletecache == 1) {
            this.messageCache.delete(topic_key);
            await Cache.DeleteCacheData(topic_key);
        }
        if (this.messageCache.has(topic_key)) {
            const cached = this.messageCache.get(topic_key);
            if (cached) {
                return this.buildResponse({
                    isConnected,
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp
                });
            }
        }
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
                if (!this.subscribedTopics.has(topic)) {
                    await this.subscribeToTopicS(topic);
                    this.subscribedTopics.add(topic);
                }
                const message = await this.waitForMessageWithTimeout(topic, 5000);
                const result = this.processPayload(message.payload.toString());
                if (result) {
                    this.messageCache.set(topic, result);
                    await this.cacheResult(topic_key, result, timestamp, time);
                    return this.buildResponse({
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await this.delay(1000);
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
        }
    }
    waitForMessageWithTimeout(topic, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Timeout waiting for message'));
            }, timeout);
            const onMessage = (message) => {
                if (message.topic === topic) {
                    clearTimeout(timer);
                    this.mqttClient.off('message', onMessage);
                    resolve(message);
                }
            };
            this.mqttClient.on('message', onMessage);
        });
    }
    async getMqttTopicPA1(topics, deletecache, retryCount = 2) {
        const isConnected = await this.isMqttConnected();
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        const time = 45;
        const topic_key = 'getMqttTopicPA_' + topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            const cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return this.buildResponse({
                    isConnected,
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp
                });
            }
            try {
                await this.subscribeToTopicS(topic);
                const message = await this.waitForMessage(topic);
                const result = this.processPayload(message.payload.toString());
                if (result) {
                    await this.cacheResult(topic_key, result, timestamp, time);
                    return this.buildResponse({
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await this.delay(1000);
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
        }
    }
    async getMqttTopic(topics, deletecache, retryCount = 2) {
        const isConnected = await this.isMqttConnected();
        const timestamp = this.generateTimestamp();
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        const time = 3;
        const topic_key = 'getMqttTopicV1_' + topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            const cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return this.buildResponse({
                    isConnected,
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp
                });
            }
            try {
                await this.subscribeToTopicS(topic);
                const message = await this.waitForMessage(topic);
                const result = this.processPayload(message.payload.toString());
                if (result) {
                    await this.cacheResult(topic_key, result, timestamp, time);
                    return this.buildResponse({
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await this.delay(1000);
                }
                else {
                    return this.buildResponse({
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp
                    });
                }
            }
        }
    }
    async getMqttTopicTest(topics, deletecache, retryCount = 2) {
        var isConnected = await this.isMqttConnected();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        var topic = encodeURI(topics);
        var time = 5;
        var topic_key = 'Test_' + topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return {
                    isConnected,
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp
                };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                const payloadString = message.payload.toString().trim();
                let result;
                if (payloadString.startsWith('{') || payloadString.startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                if (result) {
                    const cacheData = {
                        keycache: topic_key,
                        time: time,
                        data: { result, timestamp }
                    };
                    Cache.SetCacheData(cacheData).catch(err => console.error('Cache set error:', err));
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    };
                }
                else {
                    return {
                        isConnected,
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp
                    };
                }
            }
        }
    }
    async getMqttTopicSS(topics, deletecache, retryCount = 2) {
        var isConnected = await this.isMqttConnected();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        var topic = encodeURI(topics);
        var time = 3;
        var topic_key = topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return {
                    isConnected,
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp
                };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                const payloadString = message.payload.toString().trim();
                let result;
                if (payloadString.startsWith('{') || payloadString.startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                if (result) {
                    const cacheData = {
                        keycache: topic_key,
                        time: time,
                        data: { result, timestamp }
                    };
                    Cache.SetCacheData(cacheData).catch(err => console.error('Cache set error:', err));
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    };
                }
                else {
                    return {
                        isConnected,
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp
                    };
                }
            }
        }
    }
    async _2_getMqttTopic(topics, deletecache, retryCount = 2) {
        var isConnected = await this.isMqttConnected();
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        var time = 3;
        var topic_key = topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return { isConnected, case: 1, status: 1, msg: cached.result, fromCache: true, time: time, timestamp: cached.timestamp };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                let result;
                const payloadString = message.payload.toString();
                if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                if (result) {
                    var results = { result, timestamp };
                    var InpuDatacache = { keycache: topic_key, time: time, data: results };
                    await Cache.SetCacheData(InpuDatacache);
                    return { isConnected, case: 3, status: 1, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
                else {
                    return { isConnected, case: 4, status: 3, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return { isConnected, case: 5, status: 0, msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`, time: time, timestamp: timestamp };
                }
            }
        }
    }
    async getMqttTopicSlow(topics, deletecache, retryCount = 2) {
        var isConnected = await this.isMqttConnected();
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!isConnected) {
            return { case: 0, status: 0, msg: 0, message: "MQTT client not connected" };
        }
        const topic = encodeURI(topics);
        var time = 3;
        var topic_key = topic;
        for (let attempt = 1; attempt <= retryCount; attempt++) {
            console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
            if (deletecache == 1 && attempt == 1) {
                await Cache.DeleteCacheData(topic_key);
            }
            var cached = await Cache.GetCacheData(topic_key);
            if (cached !== null) {
                return { isConnected, case: 1, status: 1, msg: cached.result, fromCache: true, time: time, timestamp: cached.timestamp };
            }
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        err ? reject(err) : resolve();
                    });
                });
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(5000)));
                let result;
                const payloadString = message.payload.toString();
                if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                        result = JSON.parse(payloadString);
                    }
                    catch (e) {
                        result = payloadString;
                    }
                }
                else {
                    result = payloadString;
                }
                if (result) {
                    var results = { result, timestamp };
                    var InpuDatacache = { keycache: topic_key, time: time, data: results };
                    await Cache.SetCacheData(InpuDatacache);
                    return { isConnected, case: 3, status: 1, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
                else {
                    return { isConnected, case: 4, status: 3, msg: result, fromCache: false, time: time, timestamp: timestamp };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    return { isConnected, case: 5, status: 0, msg: 0, message: `No message from "${topic}" after ${retryCount} attempts`, time: time, timestamp: timestamp };
                }
            }
        }
    }
    async getMqttTopicFast(topics) {
        var _a;
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        const topic = encodeURI(topics);
        const isConnected = await this.isMqttConnected();
        if (!isConnected) {
            return { case: 0, status: 0, data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0', msg: 0, message: 'MQTT client is not connected', time: timestamp, timestamp: timestamp };
        }
        if (this.messageCache.has(topic)) {
            return { case: 1, status: 1, data: this.messageCache.get(topic), msg: 0, message: 'MQTT client is connected', time: timestamp, timestamp: timestamp };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            console.log(`Subscribed to topic: ${topic}`);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return {
                    case: 2,
                    status: 0,
                    data: null,
                    msg: 0, message: `Failed to subscribe to topic "${topic}": ${err.message}`,
                    time: timestamp, timestamp: timestamp
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { case: 3, status: 1, msg: result, time: timestamp, timestamp: timestamp };
        }
        catch (err) {
            if (err.name === 'TimeoutError' || ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
                return {
                    case: 4,
                    status: 0,
                    msg: 0, message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
                    time: timestamp, timestamp: timestamp
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0, message: `Error receiving message from topic "${topic}": ${err.message}`,
                    time: timestamp, timestamp: timestamp
                };
            }
        }
    }
    async getDataTopicMqtt(topics) {
        const topic = encodeURI(topics);
        if (this.messageCache.has(topic)) {
            return { status: 1, msg: this.messageCache.get(topic) };
        }
        if (!this.subscribedTopics.has(topic)) {
            try {
                await new Promise((resolve, reject) => {
                    this.mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.subscribedTopics.add(topic);
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                return { status: 0, msg: `Failed to subscribe to topic "${topic}": ${err.message}` };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)(messages => messages.length > 0), (0, operators_1.map)(messages => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                try {
                    result = JSON.parse(payloadString);
                }
                catch (e) {
                    result = payloadString;
                }
            }
            else {
                result = payloadString;
            }
            this.messageCache.set(topic, result);
            return { status: 1, msg: result };
        }
        catch (err) {
            return { status: 0, msg: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
        }
    }
    async getDataTopicCache(topics, deletecache) {
        const topic = encodeURI(topics);
        var topic_key = 'topic_key_' + md5(topic);
        var kaycache_cache = topic_key;
        if (deletecache == 1) {
            await Cache.DeleteCacheData(kaycache_cache);
        }
        var rs = await Cache.GetCacheData(kaycache_cache);
        if (!rs) {
            var rs = await this.getDataTopicMqtt(topic);
            if (!rs.status || rs.status == 0) {
                return rs;
            }
            var InpuDatacache = { keycache: kaycache_cache, time: 3, data: rs };
            await Cache.SetCacheData(InpuDatacache);
            return rs;
        }
        else {
            return rs;
        }
    }
    async getDataFromTopics(topics) {
        console.log(`--getDataFromTopic---${topics}----`);
        const topic = encodeURI(topics);
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (subscribeError) => {
                if (subscribeError) {
                    return reject(subscribeError);
                }
                console.log(`Successfully subscribed to ${topic}`);
                const timeoutId = setTimeout(() => {
                    this.mqttClient.unsubscribe(topic);
                    reject(new Error(`Timeout: No message from topic "${topic}"`));
                }, 10000);
                const messageHandler = (receivedTopic, message) => {
                    if (receivedTopic === topic) {
                        clearTimeout(timeoutId);
                        this.mqttClient.unsubscribe(topic);
                        this.mqttClient.removeListener('message', messageHandler);
                        const messageString = message.toString().trim().replace(/\s+/g, '');
                        try {
                            const jsonData = JSON.parse(messageString);
                            console.log(`---jsonData --- ${jsonData}`);
                            const csvString = typeof jsonData === 'object' && jsonData !== null
                                ? Object.values(jsonData).join(',')
                                : messageString;
                            resolve(csvString.replace(/\s+/g, ''));
                        }
                        catch (_a) {
                            resolve(messageString.replace(/\s+/g, ''));
                        }
                    }
                };
                this.mqttClient.on('message', messageHandler);
            });
        });
    }
    async getDataFromTopicsOL(topics) {
        console.log(`-------------getDataFromTopic ----------------${topics}--------------------`);
        const topic = encodeURI(topics);
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (subscribeError) => {
                if (subscribeError) {
                    return reject(subscribeError);
                }
                console.log(`Successfully subscribed to ${topic}`);
                const timeoutId = setTimeout(() => {
                    this.mqttClient.unsubscribe(topic);
                    reject(new Error(`Timeout: No message from topic "${topic}"`));
                }, 10000);
                const messageHandler = (receivedTopic, message) => {
                    if (receivedTopic === topic) {
                        clearTimeout(timeoutId);
                        this.mqttClient.unsubscribe(topic);
                        this.mqttClient.removeListener('message', messageHandler);
                        try {
                            const jsonData = JSON.parse(message.toString());
                            if (typeof jsonData === 'object' && jsonData !== null) {
                                const csvString = Object.values(jsonData).join(',');
                                resolve(csvString);
                            }
                            else {
                                resolve(message.toString());
                            }
                        }
                        catch (_a) {
                            resolve(message.toString());
                        }
                    }
                };
                this.mqttClient.on('message', messageHandler);
            });
        });
    }
    async getDataFromTopic(topics) {
        console.log(`-------------getDataFromTopic ----------------${topics}--------------------`);
        const topic = encodeURI(topics);
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (subscribeError) => {
                if (subscribeError) {
                    return reject(subscribeError);
                }
                console.log(`Successfully subscribed to ${topic}`);
                const timeoutId = setTimeout(() => {
                    this.mqttClient.unsubscribe(topic);
                    reject(new Error(`Timeout: No message from topic "${topic}"`));
                }, 10000);
                const messageHandler = (receivedTopic, message) => {
                    if (receivedTopic === topic) {
                        clearTimeout(timeoutId);
                        this.mqttClient.unsubscribe(topic);
                        this.mqttClient.removeListener('message', messageHandler);
                        try {
                            resolve(JSON.parse(message.toString()));
                        }
                        catch (_a) {
                            resolve(message.toString());
                        }
                    }
                };
                this.mqttClient.on('message', messageHandler);
            });
        });
    }
    async _getDataFromTopic(topics) {
        var topic = encodeURI(topics);
        console.log(`------getDataFromTopic------`);
        console.log(`connectUrl_mqtt=>`);
        console.info(connectUrl_mqtt);
        console.log(`topic=>`);
        console.info(topic);
        var messagePromise = new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
                if (err) {
                    return reject(err);
                }
            });
            var subscription = this.messageStream
                .pipe((0, operators_1.filter)((message) => message.topic === topic), (0, operators_1.first)(), (0, operators_1.timeout)(5000))
                .subscribe({
                next: (message) => {
                    this.mqttClient.unsubscribe(topic);
                    subscription.unsubscribe();
                    try {
                        resolve(JSON.parse(message.payload.toString()));
                        console.log(`try=>` + message.payload.toString());
                    }
                    catch (e) {
                        console.log(`catch=>` + message.payload.toString());
                        resolve(message.payload.toString());
                    }
                },
                error: (err) => {
                    this.mqttClient.unsubscribe(topic);
                    subscription.unsubscribe();
                    console.log(`mqtt_hostt=>` + connectUrl_mqtt);
                    console.log(`Timeout: No message received from topic "${topic}" within 5 seconds.`);
                    reject(new Error(`Timeout: No message received from topic "${topic}" within 5 seconds.`));
                },
            });
        });
        return await messagePromise;
    }
    publishs(topics, payload) {
        var topic = encodeURI(topics);
        var message = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString();
        console.log(`----publishs------`);
        console.log(`mqtt_hostt=>` + connectUrl_mqtt);
        console.log(`topic=>`);
        console.info(topic);
        console.log(`message=>`);
        console.info(message);
        var rss = this.mqttClient.publish(topic, message);
        console.log(`rss=>`);
        console.info(rss);
    }
    async publish(topics, payload) {
        console.log(`------publish------`);
        var topic = encodeURI(topics);
        console.log(`topics=>`);
        console.info(topics);
        console.log(`payload=>`);
        console.info(payload);
        try {
            await (0, rxjs_1.firstValueFrom)(this.client.emit(topic, payload));
            var InpuDatacache = {
                keycache: `${topic}`,
                time: 86400,
                data: payload,
            };
            await Cache.SetCacheData(InpuDatacache);
            const originalTopic = topic;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            console.log(`originalTopic=>`);
            console.info(originalTopic);
            console.log(`newTopic=>`);
            console.info(newTopic);
            Cache.DeleteCacheData(newTopic);
            console.log(`mqtt_hostt=>` + connectUrl_mqtt);
            this.logger.log(`Published to topic "${topic}"`);
        }
        catch (error) {
            const originalTopic = topic;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            this.logger.error(`newTopic "${newTopic}"`, error);
            this.logger.error(`connectUrl_mqtt "${connectUrl_mqtt}"`, error);
            this.logger.error(`Failed to publish to topic "${topic}"`, error);
        }
    }
    async updateData(topics, payload) {
        var topic = encodeURI(topics);
        var InpuDatacache = {
            keycache: `topic-${topic}`,
            time: 86400,
            data: `mqtt:data:${topic}`,
        };
        await Cache.SetCacheData(InpuDatacache);
        this.logger.log(`Cached data for topic: ${topic}`);
    }
    async getData(topics) {
        var topic = encodeURI(topics);
        const dataString = await Cache.GetCacheData(topic);
        if (!dataString) {
            return null;
        }
        return dataString;
    }
    async cacheMqttData(topics, payload) {
        var topic = encodeURI(topics);
        const cacheKey = `mqtt-data:${topic}`;
        await Cache.SetCacheData({ keycache: cacheKey, time: 86400, data: payload });
        this.logger.log(`Cached data for topic: ${topic}`);
    }
    async getDataFromCache(topics) {
        var topic = encodeURI(topics);
        const cacheKey = `mqtt-data:${topic}`;
        const data = await Cache.GetCacheData(cacheKey);
        return data;
    }
    updateLatestData(topics, payload) {
        var topic = encodeURI(topics);
        this.latestData.set(topic, payload);
        this.logger.log(`In-memory state updated for topic: ${topic}`);
    }
    getLatestData(topics) {
        var topic = encodeURI(topics);
        if (this.latestData.has(topic)) {
            this.logger.log(`Retrieved data from in-memory state for topic: ${topic}`);
            return this.latestData.get(topic);
        }
        this.logger.warn(`No data in memory for topic: ${topic}`);
        return null;
    }
    async devicecontrols(topics, message_mqtt, message_control) {
        var topic_mqtt = encodeURI(topics);
        this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
        this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
        this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
        try {
            var Rt = await this.publish(topic_mqtt, message_mqtt);
            this.logger.log(`devicecontrol publish Rt: ${Rt}`);
            var InpuDatacache = { keycache: `${topic_mqtt}`, data: message_mqtt };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamp = datePart + ' ' + timePart;
            const originalTopic = topic_mqtt;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            this.logger.log(`devicecontrol newTopic: ${newTopic}`);
            Cache.DeleteCacheData(newTopic);
            var GetCacheData = await Cache.GetCacheData(newTopic);
            if (GetCacheData) {
                Cache.DeleteCacheData(newTopic);
            }
            var mqttdata = await Cache.GetCacheData(newTopic);
            console.log(newTopic);
            if (message_control == 'ON') {
                var message_status = 1;
            }
            else {
                var message_status = 0;
            }
            console.log(newTopic);
            if (message_mqtt == 1 || message_mqtt == 'on' || message_mqtt == 'ON' || message_mqtt == 'a1' || message_mqtt == 'a1' || message_mqtt == 'b1' || message_mqtt == 'c1' || message_mqtt == 'd1' || message_mqtt == 'e1' || message_mqtt == 'f1' || message_mqtt == 'g1') {
                var message_control = 'ON';
                var message_status = 1;
            }
            else {
                var message_control = 'OFF';
                var message_status = 0;
            }
            var dataObject = {
                timestamp: timestamp,
                device_1: message_status,
                device_status: message_mqtt,
            };
            var dataRs = await this.getDataFromTopic(newTopic);
            this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
            const parts = dataRs.split(',');
            const getDataObject = parts;
            var InpuDatacache = { keycache: `${newTopic}`, time: 3, data: getDataObject };
            await Cache.SetCacheData(InpuDatacache);
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic_mqtt: topic_mqtt,
                dataRs: dataRs,
                dataObject,
                message_status,
                mqttdata: mqttdata,
                today: today,
                payload: getDataObject,
                daynameall: getDaynameall,
                mqtt_data_control: topic_mqtt,
                mqtt_dada_get: newTopic,
                status: message_status,
                status_msg: dataObject,
                message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
            };
            this.logger.log(`devicecontrol ResultData: ${dataRs}`);
            console.log(`devicecontrol ResultData`);
            console.info(ResultData);
            return ResultData;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            var ResultDataerr = {
                statusCode: 500,
                code: 500,
                message: err.message,
                errorMessage: err.message,
            };
            return ResultDataerr;
        }
    }
    async devicecontrol(topics, message_mqtt) {
        var topic_mqtt = encodeURI(topics);
        this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
        this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
        this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
        try {
            var Rt = await this.publish(topic_mqtt, message_mqtt);
            this.logger.log(`devicecontrol publish Rt: ${Rt}`);
            var InpuDatacache = { keycache: `${topic_mqtt}`, data: message_mqtt };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamp = datePart + ' ' + timePart;
            const originalTopic = topic_mqtt;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            this.logger.log(`devicecontrol newTopic: ${newTopic}`);
            Cache.DeleteCacheData(newTopic);
            var GetCacheData = await Cache.GetCacheData(newTopic);
            if (GetCacheData) {
                Cache.DeleteCacheData(newTopic);
            }
            var mqttdata = await Cache.GetCacheData(newTopic);
            console.log(newTopic);
            if (message_mqtt == 1 || message_mqtt == 'on' || message_mqtt == 'ON' || message_mqtt == 'a1' || message_mqtt == 'a1' || message_mqtt == 'b1' || message_mqtt == 'c1' || message_mqtt == 'd1' || message_mqtt == 'e1' || message_mqtt == 'f1' || message_mqtt == 'g1') {
                var message_control = 'ON';
                var message_status = 1;
            }
            else {
                var message_control = 'OFF';
                var message_status = 0;
            }
            var dataObject = {
                timestamp: timestamp,
                device_1: message_status,
                device_status: message_mqtt,
            };
            var dataRs = await this.getDataFromTopic(newTopic);
            this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
            const parts = dataRs.split(',');
            const getDataObject = parts;
            var InpuDatacache = { keycache: `${newTopic}`, time: 3, data: getDataObject };
            await Cache.SetCacheData(InpuDatacache);
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic_mqtt: topic_mqtt,
                dataRs: dataRs,
                dataObject,
                message_status,
                mqttdata: mqttdata,
                today: today,
                payload: getDataObject,
                daynameall: getDaynameall,
                mqtt_data_control: topic_mqtt,
                mqtt_dada_get: newTopic,
                status: message_status,
                status_msg: dataObject,
                message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
            };
            this.logger.log(`devicecontrol ResultData: ${dataRs}`);
            console.log(`devicecontrol ResultData`);
            console.info(ResultData);
            return ResultData;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            var ResultDataerr = {
                statusCode: 500,
                code: 500,
                message: err.message,
                errorMessage: err.message,
            };
            return ResultDataerr;
        }
    }
    async devicecontrolV2(topics, message_mqtt) {
        var topic_mqtt = encodeURI(topics);
        this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
        this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
        this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
        try {
            var Rt = await this.publish(topic_mqtt, message_mqtt);
            this.logger.log(`devicecontrol publish Rt: ${Rt}`);
            var InpuDatacache = { keycache: `${topic_mqtt}`, data: message_mqtt };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamp = datePart + ' ' + timePart;
            const originalTopic = topic_mqtt;
            const newTopic = originalTopic.replace('CONTROL', 'DATA');
            this.logger.log(`devicecontrol newTopic: ${newTopic}`);
            Cache.DeleteCacheData(newTopic);
            var GetCacheData = await Cache.GetCacheData(newTopic);
            if (GetCacheData) {
                Cache.DeleteCacheData(newTopic);
            }
            var mqttdata = await Cache.GetCacheData(newTopic);
            console.log(newTopic);
            if (message_mqtt == 0) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 1) {
                var dataObject = {
                    timestamp: timestamp,
                    device_1: 1,
                    device_status: 'on',
                };
            }
            else if (message_mqtt == 2) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 3) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 1,
                    device_status: 'on',
                };
            }
            else if (message_mqtt == 4) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 5) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 1,
                    device_status: 'on',
                };
            }
            else if (message_mqtt == 6) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 0,
                    device_status: 'off',
                };
            }
            else if (message_mqtt == 7) {
                var dataObject = {
                    timestamp: timestamp,
                    device_2: 1,
                    device_status: 'on',
                };
            }
            var dataRs = await this.getDataFromTopic(newTopic);
            this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
            const parts = dataRs.split(',');
            const getDataObject = {
                mqtt_dada: newTopic,
                timestamp: timestamp,
                temperature: parseFloat(parts[0]),
                contRelay1: parseInt(parts[1]),
                actRelay1: parseInt(parts[2]),
                fan1: parseInt(parts[3]),
                overFan1: parseInt(parts[4]),
                contRelay2: parseInt(parts[5]),
                actRelay2: parseInt(parts[6]),
                fan2: parseInt(parts[7]),
                overFan2: parseInt(parts[8])
            };
            var InpuDatacache = { keycache: `${newTopic}`, time: 3, data: getDataObject };
            await Cache.SetCacheData(InpuDatacache);
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic_mqtt: topic_mqtt,
                Rt: Rt,
                dataRs: dataRs,
                dataObject: dataObject,
                mqttdata: mqttdata,
                today: today,
                payload: getDataObject,
                daynameall: getDaynameall,
                mqtt_data_control: topic_mqtt,
                mqtt_dada_get: newTopic,
                status: message_mqtt,
                status_msg: dataObject['device_status'],
                message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
            };
            return ResultData;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            var ResultDataerr = {
                statusCode: 500,
                code: 500,
                message: err.message,
                errorMessage: err.message,
            };
            return ResultDataerr;
        }
    }
    async getdevicedatatopics(topics) {
        var topic = encodeURI(topics);
        if (!topic) {
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic: topic,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        try {
            if (topic) {
                const now = new Date();
                const pad = (num) => String(num).padStart(2, '0');
                const datePart = [
                    now.getFullYear(),
                    pad(now.getMonth() + 1),
                    pad(now.getDate())
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds())
                ].join(':');
                var timestamp = datePart + ' ' + timePart;
                console.log(`Requesting data from topic: ` + topic);
                var keycache = 'key_cache_air_' + md5(topic);
                var data = await Cache.GetCacheData(topic);
                if (data) {
                    var dataObjects = data;
                    var getdataFrom = 'Cache';
                }
                else if (!data) {
                    var data = await this.getDataFromTopic(keycache);
                    if (!data) {
                        var dataObjects = [];
                        return dataObjects;
                    }
                    var getdataFrom = 'MQTT';
                    var mqttdata = await this.getDataFromTopic(topic);
                    if (!mqttdata) {
                        var data = [];
                    }
                    var data = mqttdata;
                    await Cache.SetCacheData({ keycache: keycache, time: 3, data: mqttdata });
                }
                return data;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getdevicedata(topics) {
        var topic = encodeURI(topics);
        if (!topic) {
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic: topic,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        try {
            if (topic) {
                const now = new Date();
                const pad = (num) => String(num).padStart(2, '0');
                const datePart = [
                    now.getFullYear(),
                    pad(now.getMonth() + 1),
                    pad(now.getDate())
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds())
                ].join(':');
                var timestamp = datePart + ' ' + timePart;
                console.log(`Requesting data from topic: ${topic}`);
                var data = await Cache.GetCacheData(topic);
                if (data) {
                    var dataObject = data;
                    var getdataFrom = 'Cache';
                }
                else if (!data) {
                    var data = await this.getDataFromTopic(topic);
                    if (!data) {
                        var dataObjects = {
                            timestamp: timestamp,
                            temperature: [],
                            contRelay1: [],
                            actRelay1: [],
                            fan1: [],
                            overFan1: [],
                            contRelay2: [],
                            actRelay2: [],
                            fan2: [],
                            overFan2: []
                        };
                        var ResultData = {
                            statusCode: 200,
                            code: 200,
                            topic: topic,
                            payload: dataObjects,
                            mqttdata: {},
                            status: 0,
                            message: `Please specify topic..`,
                            message_th: `กรุณาระบุ topic..`,
                        };
                        return ResultData;
                    }
                    var getdataFrom = 'MQTT';
                    var mqttdata = await this.getDataFromTopic(topic);
                    const parts = mqttdata.split(',');
                    const dataObject = {
                        mqtt_dada: topic,
                        timestamp: timestamp,
                        temperature: parseFloat(parts[0]),
                        contRelay1: parseInt(parts[1]),
                        actRelay1: parseInt(parts[2]),
                        fan1: parseInt(parts[3]),
                        overFan1: parseInt(parts[4]),
                        contRelay2: parseInt(parts[5]),
                        actRelay2: parseInt(parts[6]),
                        fan2: parseInt(parts[7]),
                        overFan2: parseInt(parts[8])
                    };
                    var InpuDatacache = { keycache: `${topic}`, time: 3, data: dataObject };
                    await Cache.SetCacheData(InpuDatacache);
                }
                var temperature = dataObject['temperature'];
                var fan1 = dataObject['fan1'];
                var fan2 = dataObject['fan2'];
                var overFan1 = dataObject['overFan1'];
                var overFan2 = dataObject['overFan2'];
                if (overFan1 == 0) {
                    var fan1 = dataObject['fan1'];
                }
                if (overFan2 == 0) {
                }
                var dataObjectRs = {
                    mqtt_dada: topic,
                    timestamp: timestamp,
                    temperature: temperature,
                    contRelay1: dataObject['contRelay1'],
                    actRelay1: dataObject['actRelay1'],
                    fan1: fan1,
                    overFan1: overFan1,
                    contRelay2: dataObject['contRelay2'],
                    actRelay2: dataObject['actRelay2'],
                    fan2: fan2,
                    overFan2: overFan2,
                };
                var ResultData = {
                    statusCode: 200,
                    code: 200,
                    topic: topic,
                    payload: dataObjectRs,
                    mqttdata: mqttdata,
                    getdataFrom: getdataFrom,
                    version: '1.0.1',
                    status: 1,
                    message: `Message successfully Get to topic: ${topic}`,
                    message_th: `Message successfully Get to topic: ${topic}`,
                };
                return ResultData;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getdevicedataALL(topics) {
        var topic = encodeURI(topics);
        if (!topic) {
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic: topic,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        try {
            if (topic) {
                const now = new Date();
                const pad = (num) => String(num).padStart(2, '0');
                const datePart = [
                    now.getFullYear(),
                    pad(now.getMonth() + 1),
                    pad(now.getDate())
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds())
                ].join(':');
                var timestamp = datePart + ' ' + timePart;
                var keycache = 'get_device_data_ALL' + topic;
                console.log(`Requesting data from topic: ${topic}`);
                var dataRS = await Cache.GetCacheData(topic);
                if (dataRS) {
                    var getdataFrom = 'Cache';
                }
                else if (!dataRS) {
                    var getdataFrom = 'MQTT';
                    var dataRS = await this.getDataFromTopic(topic);
                    var InpuDatacache = { keycache: keycache, time: 3, data: dataRS };
                    await Cache.SetCacheData(InpuDatacache);
                }
                return dataRS;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getdevicedataMqttV11(topics) {
        var topic = encodeURI(topics);
        if (!topic) {
            var ResultData = {
                statusCode: 200,
                code: 200,
                topic: topic,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        try {
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate())
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
            var timestamp = datePart + ' ' + timePart;
            var keycache = 'getdevicedataMqtt_' + md5(topic);
            if (topic) {
                console.log(`Requesting data from topic: ${keycache}`);
                var data = await Cache.GetCacheData(keycache);
                if (data) {
                    var dataObject = data;
                    var getdataFrom = 'Cache';
                }
                else if (!data) {
                    var data = await this.getDataFromTopic(topic);
                    if (!data) {
                        return data;
                    }
                    var data = await this.getDataFromTopic(topic);
                }
                return data;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                topic,
                timestamp,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getdevicedataMqtt(topics) {
        if (!topics) {
            return {
                statusCode: 200,
                code: 200,
                topic: topics,
                payload: [],
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
        }
        const topic = encodeURI(topics);
        const timestamp = this.generateTimestamps();
        const keycache = `getdevicedataMqtt_${md5(topic)}`;
        try {
            console.log(`Requesting data from topic: ${keycache}`);
            const cachedData = await Cache.GetCacheData(keycache);
            if (cachedData) {
                console.log('Cache hit');
                return cachedData;
            }
            console.log('Cache miss, fetching from MQTT');
            const mqttData = await this.getDataFromTopic(topic);
            if (!mqttData) {
                return null;
            }
            this.cacheDataAsyncs(keycache, mqttData);
            return mqttData;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                topic,
                timestamp,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    generateTimestamps() {
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        return `${datePart} ${timePart}`;
    }
    async cacheDataAsyncs(keycache, data) {
        try {
            await Cache.SetCacheData({ keycache: keycache, time: 3, data: data });
        }
        catch (cacheError) {
            this.logger.error(`Cache set error: ${cacheError.message}`);
        }
    }
    async getdevicedataAll(topics) {
        console.log('------mqtt getdevicedataAll------');
        var topic = encodeURI(topics);
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        const datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        console.log('-topic------' + topic);
        console.log('-now------' + now);
        console.log('-----datePart------');
        console.info(datePart);
        console.log('-----timePart------');
        console.info(timePart);
        console.log('-----timestamp------');
        console.info(timestamp);
        console.log(`Requesting data from topic: ${topic}`);
        if (!topic) {
            var ResultData = {
                topic: topic,
                data: [],
                timestamp: timestamp,
                status: 0,
                message: `Please specify topic..`,
                message_th: `กรุณาระบุ topic..`,
            };
            return ResultData;
        }
        var keycache = md5('mqtt_get_data_' + topic);
        try {
            console.log(`Requesting data from keycache: ${keycache}`);
            var data = await Cache.GetCacheData(keycache);
            if (data) {
                return data;
            }
            else {
                var mqttdata = await this.getDataFromTopic(topic);
                console.log(`connectUrl_mqtt=>`);
                console.info(connectUrl_mqtt);
                console.log(`mqttdata-getDataFromTopic-topic==>`);
                console.info(mqttdata);
                var parts = mqttdata.split(',');
                var dataObjects = {
                    topic: topic,
                    cache: 'cache',
                    status: 1,
                    timestamp: timestamp,
                    mqtt: mqttdata,
                    data: parts
                };
                var InpuDatacache = { keycache: keycache, time: 3, data: dataObjects };
                await Cache.SetCacheData(InpuDatacache);
                return dataObjects;
            }
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                    ms: 'Unprocessable Entity Exception',
                },
            });
        }
    }
    async getdevicedataDirec(topics) {
        var topic = encodeURI(topics);
        await new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((message) => message.topic === topic), (0, operators_1.timeout)(10000)));
            this.mqttClient.unsubscribe(topic);
            try {
                return JSON.parse(message.payload.toString());
            }
            catch (e) {
                return message.payload.toString();
            }
        }
        catch (err) {
            this.mqttClient.unsubscribe(topic);
            throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
        }
    }
    async mqtt_all() {
        console.log(`=group_all=`);
        try {
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select(['mq.*',]);
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            var mqtt_id = dto.mqtt_id;
            var mqtt_type_id = dto.mqtt_type_id;
            var keyword = dto.keyword || '';
            var status = dto.status;
            var createddate = dto.createddate;
            var updateddate = dto.updateddate;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 100;
            var isCount = dto.isCount || 0;
            const query = await this.MqttRepository.createQueryBuilder('mq');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT mq.mqtt_id)', 'cnt');
            }
            else {
                query.select([
                    'mq.mqtt_id AS mqtt_id',
                    'mq.mqtt_type_id AS mqtt_type_id',
                    'mq.mqtt_name AS mqtt_name',
                    'mq.host AS host',
                    'mq.port AS port',
                    'mq.username AS username',
                    'mq.password AS password',
                    'mq.secret AS secret',
                    'mq.expire_in AS expire_in',
                    'mq.token AS token',
                    'mq.org AS org',
                    'mq.bucket AS bucket',
                    'mq.envavorment AS envavorment',
                    'mq.updateddate AS updateddate',
                    'mq.latitude AS latitude',
                    'mq.longitude AS longitude',
                    'mq.status AS status',
                    't.type_name AS type_name',
                ]);
            }
            query.leftJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.where('1=1');
            if (keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: keyword ? `%${keyword}%` : '%',
                });
            }
            if (mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: mqtt_id });
            }
            if (mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: mqtt_type_id });
            }
            if (createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: updateddate });
            }
            if (status) {
                query.andWhere('mq.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCountt.count =>` + tempCounts.count);
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult === false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    console.log(`sort=`);
                    console.info(sort);
                    console.log(`sortField=` + sortField);
                    console.log(`sortOrder=` + sortOrder);
                    console.log(`sortResult=`);
                    console.info(sortResult);
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`mq.mqtt_id `, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate_active(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select([
                'mq.mqtt_id AS mqtt_id',
                'mq.mqtt_type_id AS mqtt_type_id',
                'mq.sort AS sort',
                'mq.mqtt_name AS mqtt_name',
                'mq.org AS org',
                'mq.bucket AS bucket',
                'mq.envavorment AS envavorment',
                'mq.status AS status',
                'mq.latitude AS latitude',
                'mq.longitude AS longitude',
                't.type_name AS type_name',
            ]);
            query.leftJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: dto.keyword ? `%${dto.keyword}%` : '%',
                });
            }
            if (dto.mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (dto.updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }
            if (dto.status) {
                query.andWhere('mq.status=:status', { status: dto.status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (dto.sort) {
                const sortResult = (0, format_helper_1.convertSortInput)(dto.sort);
                if (sortResult === false) {
                    throw new common_1.BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sortField=` + sortField);
                console.log(`sortOrder=` + sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult);
                if (sortOrder == 'ASC' || sortOrder == 'asc') {
                    var sortOrders = 'ASC';
                }
                else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                    var sortOrders = 'DESC';
                }
                else {
                    var sortOrders = 'ASC';
                }
                query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate_active_air(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            if (!dto.location_id) {
                var location_id = 5;
            }
            else {
                var location_id = dto.location_id;
            }
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select([
                'mq.*',
                't.type_name AS type_name',
                'l.location_id AS location_id',
                'l.location_name AS location_name',
            ]).distinct(true);
            query.innerJoin("sd_iot_location", "l", "l.location_id = mq.location_id");
            query.innerJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.innerJoin("sd_iot_device", "d", "d.bucket = mq.bucket");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: dto.keyword ? `%${dto.keyword}%` : '%',
                });
            }
            query.andWhere('mq.location_id=:location_id', { location_id: location_id });
            if (dto.mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (dto.updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }
            if (dto.status) {
                query.andWhere('mq.status=:status', { status: dto.status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (dto.sort) {
                const sortResult = (0, format_helper_1.convertSortInput)(dto.sort);
                if (sortResult === false) {
                    throw new common_1.BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sortField=` + sortField);
                console.log(`sortOrder=` + sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult);
                if (sortOrder == 'ASC' || sortOrder == 'asc') {
                    var sortOrders = 'ASC';
                }
                else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                    var sortOrders = 'DESC';
                }
                else {
                    var sortOrders = 'ASC';
                }
                query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate_active_fan_app(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            if (!dto.location_id) {
                var location_id = 5;
            }
            else {
                var location_id = dto.location_id;
            }
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select([
                'mq.*',
                't.type_name AS type_name',
                'l.location_id AS location_id',
                'l.location_name AS location_name',
            ]).distinct(true);
            query.innerJoin("sd_iot_location", "l", "l.location_id = mq.location_id");
            query.innerJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.innerJoin("sd_iot_device", "d", "d.bucket = mq.bucket");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: dto.keyword ? `%${dto.keyword}%` : '%',
                });
            }
            query.andWhere('mq.location_id=:location_id', { location_id: location_id });
            if (dto.mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (dto.updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }
            if (dto.status) {
                query.andWhere('mq.status=:status', { status: dto.status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (dto.sort) {
                const sortResult = (0, format_helper_1.convertSortInput)(dto.sort);
                if (sortResult === false) {
                    throw new common_1.BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sortField=` + sortField);
                console.log(`sortOrder=` + sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult);
                if (sortOrder == 'ASC' || sortOrder == 'asc') {
                    var sortOrders = 'ASC';
                }
                else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                    var sortOrders = 'DESC';
                }
                else {
                    var sortOrders = 'ASC';
                }
                query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate_active_fan(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            var location_id = 1;
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select([
                'mq.*',
                't.type_name AS type_name',
                'l.location_id AS location_id',
                'l.location_name AS location_name',
            ]).distinct(true);
            query.innerJoin("sd_iot_location", "l", "l.location_id = mq.location_id");
            query.innerJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.innerJoin("sd_iot_device", "d", "d.bucket = mq.bucket");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: dto.keyword ? `%${dto.keyword}%` : '%',
                });
            }
            query.andWhere('mq.location_id=:location_id', { location_id: location_id });
            if (dto.mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (dto.updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }
            if (dto.status) {
                query.andWhere('mq.status=:status', { status: dto.status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (dto.sort) {
                const sortResult = (0, format_helper_1.convertSortInput)(dto.sort);
                if (sortResult === false) {
                    throw new common_1.BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sortField=` + sortField);
                console.log(`sortOrder=` + sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult);
                if (sortOrder == 'ASC' || sortOrder == 'asc') {
                    var sortOrders = 'ASC';
                }
                else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                    var sortOrders = 'DESC';
                }
                else {
                    var sortOrders = 'ASC';
                }
                query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async mqtt_list_paginate_all_data(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            const query = await this.MqttRepository.createQueryBuilder('mq');
            query.select([
                'mq.mqtt_id AS mqtt_id',
                'mq.mqtt_type_id AS mqtt_type_id',
                'mq.sort AS sort',
                'mq.mqtt_name AS mqtt_name',
                'mq.org AS org',
                'mq.bucket AS bucket',
                'mq.envavorment AS envavorment',
                'mq.status AS status',
                'mq.latitude AS latitude',
                'mq.longitude AS longitude',
                't.type_name AS type_name',
            ]);
            query.leftJoin("sd_iot_device_type", "t", "t.type_id = mq.mqtt_type_id");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('mq.mqtt_name like :mqtt_name', {
                    name: dto.keyword ? `%${dto.keyword}%` : '%',
                });
            }
            if (dto.mqtt_id) {
                query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
                query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
                query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }
            if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }
            if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }
            if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
            }
            if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }
            if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }
            if (dto.updateddate) {
                query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }
            if (dto.status) {
                query.andWhere('mq.status=:status', { status: dto.status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (dto.sort) {
                const sortResult = (0, format_helper_1.convertSortInput)(dto.sort);
                if (sortResult === false) {
                    throw new common_1.BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sortField=` + sortField);
                console.log(`sortOrder=` + sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult);
                if (sortOrder == 'ASC' || sortOrder == 'asc') {
                    var sortOrders = 'ASC';
                }
                else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                    var sortOrders = 'DESC';
                }
                else {
                    var sortOrders = 'ASC';
                }
                query.orderBy(`mq.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
            return await query.getRawMany();
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async create_mqttlogRepository(dto) {
        const result = await this.mqttlogRepository.save(this.mqttlogRepository.create(dto));
        return result;
    }
    async mqttlog_paginate(dto) {
        console.log(`dto=>`);
        console.info(dto);
        try {
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 1000;
            var isCount = dto.isCount || 0;
            const query = await this.mqttlogRepository.createQueryBuilder('a');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT a.id)', 'cnt');
            }
            else {
                query.select(['a.*']);
            }
            query.leftJoin("sd_iot_device", "d", "d.device_id= l.device_id");
            query.where('1=1');
            if (dto.keyword) {
                query.andWhere('a.name like :name', { name: keyword ? `%${dto.keyword}%` : '%', });
            }
            if (dto.device_name) {
                query.andWhere('a.device_name like :device_name', { device_name: dto.device_name ? `%${dto.device_name}%` : '%', });
            }
            if (dto.message) {
                query.andWhere('a.msg like :msg', { msg: dto.message ? `%${dto.message}%` : '%', });
            }
            if (dto.statusmqtt) {
                query.andWhere('a.statusmqtt =:statusmqtt', { statusmqtt: dto.statusmqtt });
            }
            if (dto.device_id) {
                query.andWhere('a.device_id =:device_id', { device_id: dto.device_id });
            }
            if (dto.type_id) {
                query.andWhere('a.type_id =:type_id', { type_id: dto.type_id });
            }
            if (dto.date) {
                query.andWhere('a.date=:date', { date: dto.date });
            }
            if (dto.time) {
                query.andWhere('a.time=:time', { time: dto.time });
            }
            if (dto.status) {
                query.andWhere('a.status=:status', { status: dto.status });
            }
            if (dto.start && dto.end) {
                query.andWhere('a.createddate BETWEEN :startDate AND :endDate', {
                    startDate: dto.start,
                    endDate: dto.end,
                });
            }
            else if (dto.start) {
                query.andWhere('a.createddate >= :startDate', { startDate: dto.start });
            }
            else if (dto.end) {
                query.andWhere('a.createddate <= :endDate', { endDate: dto.end });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCountt.count =>` + tempCounts.count);
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    console.log(`sort=`);
                    console.info(sort);
                    console.log(`sortField=` + sortField);
                    console.log(`sortOrder=` + sortOrder);
                    console.log(`sortResult=`);
                    console.info(sortResult);
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`a.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`a.createddate`, 'DESC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
};
MqttService = MqttService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MQTT_CLIENT')),
    __param(1, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(2, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(3, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(4, (0, typeorm_1.InjectRepository)(sensor_entity_1.Sensor)),
    __param(5, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(6, (0, typeorm_1.InjectRepository)(mqtt_entity_1.Mqtt)),
    __param(7, (0, typeorm_1.InjectRepository)(api_entity_1.Api)),
    __param(8, (0, typeorm_1.InjectRepository)(devicetype_entity_1.DeviceType)),
    __param(9, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(10, (0, typeorm_1.InjectRepository)(email_entity_1.Email)),
    __param(11, (0, typeorm_1.InjectRepository)(host_entity_1.Host)),
    __param(12, (0, typeorm_1.InjectRepository)(influxdb_entity_1.Influxdb)),
    __param(13, (0, typeorm_1.InjectRepository)(line_entity_1.Line)),
    __param(14, (0, typeorm_1.InjectRepository)(nodered_entity_1.Nodered)),
    __param(15, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(16, (0, typeorm_1.InjectRepository)(sms_entity_1.Sms)),
    __param(17, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(18, (0, typeorm_1.InjectRepository)(scheduledevice_entity_1.scheduleDevice)),
    __param(19, (0, typeorm_1.InjectRepository)(deviceaction_entity_1.Deviceaction)),
    __param(20, (0, typeorm_1.InjectRepository)(deviceactionlog_entity_1.Deviceactionlog)),
    __param(21, (0, typeorm_1.InjectRepository)(deviceactionuser_entity_1.Deviceactionuser)),
    __param(22, (0, typeorm_1.InjectRepository)(devivicealarmaction_entity_1.Devicealarmaction)),
    __param(23, (0, typeorm_1.InjectRepository)(telegram_entity_1.Telegram)),
    __param(24, (0, typeorm_1.InjectRepository)(scheduleprocesslog_entity_1.scheduleprocesslog)),
    __param(25, (0, typeorm_1.InjectRepository)(alarmprocesslog_entity_1.alarmprocesslog)),
    __param(26, (0, typeorm_1.InjectRepository)(mqttlog_entity_1.mqttlog)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MqttService);
exports.MqttService = MqttService;
//# sourceMappingURL=mqtt.service.js.map