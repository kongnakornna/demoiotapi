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
var Mqtt2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mqtt2Service = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const format = __importStar(require("../../helpers/format.helper"));
const microservices_1 = require("@nestjs/microservices");
const redis_cache_1 = require("../../utils/cache/redis.cache");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const devicetype_entity_1 = require("../settings/entities/devicetype.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
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
const deviceaction_entity_1 = require("../settings/entities/deviceaction.entity");
const deviceactionlog_entity_1 = require("../settings/entities/deviceactionlog.entity");
const deviceactionuser_entity_1 = require("../settings/entities/deviceactionuser.entity");
const devivicealarmaction_entity_1 = require("../settings/entities/devivicealarmaction.entity");
const telegram_entity_1 = require("../settings/entities/telegram.entity");
const alarmdevice_entity_1 = require("../settings/entities/alarmdevice.entity");
const alarmdeviceevent_entity_1 = require("../settings/entities/alarmdeviceevent.entity");
const dashboard_config_entity_1 = require("../settings/entities/dashboard-config.entity");
const scheduleprocesslog_entity_1 = require("../settings/entities/scheduleprocesslog.entity");
const alarmprocesslog_entity_1 = require("../settings/entities/alarmprocesslog.entity");
const alarmprocesslogtemp_entity_1 = require("../settings/entities/alarmprocesslogtemp.entity");
const alarmprocesslogmqtt_entity_1 = require("../settings/entities/alarmprocesslogmqtt.entity");
const alarmprocesslogemail_entity_1 = require("../settings/entities/alarmprocesslogemail.entity");
const alarmprocesslogline_entity_1 = require("../settings/entities/alarmprocesslogline.entity");
const alarmprocesslogsms_entity_1 = require("../settings/entities/alarmprocesslogsms.entity");
const alarmprocesslogtelegram_entity_1 = require("../settings/entities/alarmprocesslogtelegram.entity");
const mqtthost_entity_1 = require("../settings/entities/mqtthost.entity");
const tz = require('moment-timezone');
var Cache = new redis_cache_1.CacheDataOne();
var md5 = require('md5');
const mqtt_1 = require("mqtt");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
var md5 = require('md5');
require("dotenv/config");
var tzString = process.env.tzString;
require('dotenv').config();
var Url_api = process.env.API_URL;
const format_helper_1 = require("../../helpers/format.helper");
var moment = require('moment');
var connectUrl_mqtt = process.env.MQTT_HOST2 || 'mqtt://broker.hivemq.com:1883';
if (!connectUrl_mqtt) {
    var connectUrl_mqtt = process.env.MQTT_HOST || 'mqtt://localhost:1883';
}
let Mqtt2Service = Mqtt2Service_1 = class Mqtt2Service {
    constructor(client, DevicealarmactionRepository, dashboardConfigRepository, SettingRepository, LocationRepository, TypeRepository, SensorRepository, GroupRepository, MqttRepository, ApiRepository, DeviceTypeRepository, DeviceRepository, EmailRepository, HostRepository, InfluxdbRepository, LineRepository, NoderedRepository, ScheduleRepository, SmsRepository, TokenRepository, scheduleDeviceRepository, DeviceactionRepository, DeviceactionlogRepository, DeviceactionuserRepository, TelegramRepository, alarmDeviceRepository, alarmDeviceEventRepository, scheduleprocesslogRepository, alarmprocesslogRepository, alarmprocesslogtempRepository, alarmprocesslogmqttRepository, alarmprocesslogemailRepository, alarmprocessloglineRepository, alarmprocesslogsmsRepository, alarmprocesslogtelegramRepository, userRepository, SdUserRoleRepository, SdUserRolesAccessRepository, UserRolePermissionRepository, mqtthostRepository) {
        this.client = client;
        this.DevicealarmactionRepository = DevicealarmactionRepository;
        this.dashboardConfigRepository = dashboardConfigRepository;
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
        this.TelegramRepository = TelegramRepository;
        this.alarmDeviceRepository = alarmDeviceRepository;
        this.alarmDeviceEventRepository = alarmDeviceEventRepository;
        this.scheduleprocesslogRepository = scheduleprocesslogRepository;
        this.alarmprocesslogRepository = alarmprocesslogRepository;
        this.alarmprocesslogtempRepository = alarmprocesslogtempRepository;
        this.alarmprocesslogmqttRepository = alarmprocesslogmqttRepository;
        this.alarmprocesslogemailRepository = alarmprocesslogemailRepository;
        this.alarmprocessloglineRepository = alarmprocessloglineRepository;
        this.alarmprocesslogsmsRepository = alarmprocesslogsmsRepository;
        this.alarmprocesslogtelegramRepository = alarmprocesslogtelegramRepository;
        this.userRepository = userRepository;
        this.SdUserRoleRepository = SdUserRoleRepository;
        this.SdUserRolesAccessRepository = SdUserRolesAccessRepository;
        this.UserRolePermissionRepository = UserRolePermissionRepository;
        this.mqtthostRepository = mqtthostRepository;
        this.latestData = new Map();
        this.messageStream = new rxjs_1.Subject();
        this.logger = new common_1.Logger(Mqtt2Service_1.name);
        this.messageStreams = new rxjs_1.BehaviorSubject({
            topic: '',
            payload: Buffer.from(''),
        });
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
            error: null,
        };
    }
    onModuleInit() {
        this.IsonModuleInit(connectUrl_mqtt);
    }
    async IsonModuleInit(connectUrl_mqtt) {
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
        console.log(` ✅ mqtt_connectUrl_mqtt=>` +
            connectUrl_mqtt +
            ` ✅ mqtt_clientId=>` +
            clientId);
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
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            if (err.toString().includes('TimeoutError') ||
                err.toString().includes('timeout')) {
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
                cacheSize: this.messageCached.size,
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
                cacheSize: this.messageCached.size,
            };
            return rt;
        }
    }
    updateCache(topic, payload) {
        try {
            const payloadString = payload.toString();
            let result;
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
        const encodedTopics = topics.map((topic) => encodeURI(topic));
        try {
            await new Promise((resolve, reject) => {
                this.mqttClient.subscribe(encodedTopics, { qos: 0 }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        encodedTopics.forEach((topic) => {
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
            cacheSize: this.messageCached.size,
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
            keys: Array.from(this.messageCached.keys()),
        };
    }
    async subscribeToTopicWithResponse(topic, timeoutMs = 10000) {
        const encodedTopic = encodeURI(topic);
        if (!this.isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client is not connected',
            };
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
                return {
                    case: 2,
                    status: 0,
                    msg: 0,
                    message: `Failed to subscribe: ${error.message}`,
                };
            }
        }
        return new Promise((resolve) => {
            const subscription = this.messageStream
                .pipe((0, operators_1.filter)((msg) => msg.topic === encodedTopic), (0, operators_1.map)((msg) => {
                const payloadString = msg.payload.toString();
                let result;
                if (payloadString.trim().startsWith('{') ||
                    payloadString.trim().startsWith('[')) {
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
            }))
                .subscribe({
                next: (data) => {
                    subscription.unsubscribe();
                    resolve({ case: 3, status: 1, msg: data });
                },
                error: (error) => {
                    subscription.unsubscribe();
                    resolve({
                        case: 4,
                        status: 0,
                        msg: 0,
                        message: `Error: ${error.message}`,
                    });
                },
            });
            setTimeout(() => {
                subscription.unsubscribe();
                resolve({
                    case: 5,
                    status: 0,
                    msg: 0,
                    message: `Timeout: No message received within ${timeoutMs}ms`,
                });
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
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
                    },
                });
                setTimeout(() => {
                    subscription.unsubscribe();
                    reject({
                        case: 0,
                        status: 0,
                        msg: 0,
                        message: `Timeout after ${timeoutMs}ms`,
                    });
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
                msg: this.messageCache.get(topic),
            };
        }
        if (!this.isConnected || !((_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.connected)) {
            console.error(`MQTT client is not connected for topic: ${topic}`);
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client is not connected',
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
                    msg: 0,
                    message: `Failed to subscribe to topic "${topic}": ${err.message}`,
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
            }), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => {
                const hasMessages = messages.length > 0;
                if (hasMessages) {
                    console.log(`Received ${messages.length} messages for topic: ${topic}`);
                }
                return hasMessages;
            }), (0, operators_1.map)((messages) => {
                console.log(`Taking first message from ${messages.length} messages`);
                return messages[0];
            }), (0, operators_1.take)(1), (0, operators_1.timeout)({
                each: 10000,
                with: () => {
                    throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                },
            }), (0, operators_1.catchError)((error) => {
                console.error(`Error in message stream for topic ${topic}:`, error);
                throw error;
            })));
            console.log(`Processing message for topic: ${topic}`);
            let result;
            const payloadString = message.payload.toString();
            console.log(`Raw payload: ${payloadString}`);
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
                msg: result,
            };
        }
        catch (err) {
            console.error(`Error receiving message for topic "${topic}":`, err);
            if (((_b = err.message) === null || _b === void 0 ? void 0 : _b.includes('Timeout')) || err.name === 'TimeoutError') {
                return {
                    case: 4,
                    status: 0,
                    msg: 0,
                    message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0,
                    message: `Error receiving message from topic "${topic}": ${err.message}`,
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
            data: { result, timestamp },
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
            isConnected: data.isConnected,
        };
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getMqttConnectionStatus() {
        return {
            connected: this.mqttClient ? this.mqttClient.connected : false,
            lastConnectionTime: this.connectionStatus.lastConnectionTime,
            error: this.connectionStatus.error,
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
        const isConnectedCli = (await this.mqttClient) && this.mqttClient.connected;
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
            connectUrl_mqtt,
            msg: `MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`,
        };
    }
    async checkConnectionStatusMqtts(UrlMqtt) {
        const isConnect = await this.IsonModuleInit(UrlMqtt);
        const isConnected = await this.isMqttConnected();
        const isConnectedCli = (await this.mqttClient) && this.mqttClient.connected;
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        const topic = encodeURI(topics);
        const isConnected = await this.isMqttConnected();
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0',
                msg: 0,
                message: 'MQTT client is not connected',
                time: timestamp,
                timestamp: timestamp,
            };
        }
        if (this.messageCache.has(topic)) {
            return {
                case: 1,
                status: 1,
                data: this.messageCache.get(topic),
                msg: 0,
                message: 'MQTT client is connected',
                time: timestamp,
                timestamp: timestamp,
            };
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
                    msg: 0,
                    message: `Failed to subscribe to topic "${topic}": ${err.message}`,
                    time: timestamp,
                    timestamp: timestamp,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 3,
                status: 1,
                msg: result,
                time: timestamp,
                timestamp: timestamp,
            };
        }
        catch (err) {
            if (err.name === 'TimeoutError' || ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
                return {
                    case: 4,
                    status: 0,
                    msg: 0,
                    message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
                    time: timestamp,
                    timestamp: timestamp,
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0,
                    message: `Error receiving message from topic "${topic}": ${err.message}`,
                    time: timestamp,
                    timestamp: timestamp,
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
                    pad(now.getDate()),
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds()),
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
                    var InpuDatacache = {
                        keycache: keycache,
                        time: 5,
                        data: dataObject,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                }
                console.log(`-----------------getdMqttdataTopics----------------END-----getdata-----` +
                    getdataFrom);
                this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataObject}`);
                const parts = dataObject.split(',');
                var rs = { mqtt: dataObject, data: parts, timestamp };
                return rs;
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
                return {
                    case: 2,
                    status: 0,
                    msg: 0,
                    message: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            while (true) {
                const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.timeout)(10000)));
                let result;
                const payloadString = message.payload.toString();
                if (payloadString.trim().startsWith('{') ||
                    payloadString.trim().startsWith('[')) {
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
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        catch (err) {
            return {
                case: 4,
                status: 0,
                msg: 0,
                message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
            pad(now.getDate()),
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
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
                    data: parts,
                };
                var InpuDatacache = {
                    keycache: keycache,
                    time: 10,
                    data: dataObjects,
                };
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
                return {
                    case: 2,
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 4,
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
                return {
                    case: 2,
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 4,
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
                return {
                    case: 2,
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
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
                var InpuDatacache = {
                    keycache: kaycache_cache,
                    time: 10,
                    data: rs,
                };
                await Cache.SetCacheData(InpuDatacache);
            }
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 4,
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
                return {
                    case: 2,
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 4,
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
                return {
                    case: 2,
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 4,
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
            if (err.toString().includes('TimeoutError') ||
                err.toString().includes('timeout')) {
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                return {
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp,
                };
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
                    var InpuDatacache = {
                        keycache: topic_key,
                        time: time,
                        data: results,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    return {
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
                else {
                    return {
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
        }
    }
    async getDataTopic(topics, deletecache, retryCount = 2) {
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                return {
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp,
                };
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
                    var InpuDatacache = {
                        keycache: topic_key,
                        time: time,
                        data: results,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    return {
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
                else {
                    return {
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
        }
    }
    async getDataTopicPage(topics, deletecache, retryCount = 2) {
        var date = format.getCurrentDatenow();
        var timenow = format.getCurrentTimenow();
        var now = new Date();
        var pad = (num) => String(num).padStart(2, '0');
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                return {
                    case: 1,
                    status: 1,
                    msg: cached.result,
                    fromCache: true,
                    time: time,
                    timestamp: cached.timestamp,
                };
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
                    var InpuDatacache = {
                        keycache: topic_key,
                        time: time,
                        data: results,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    return {
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
                else {
                    return {
                        case: 4,
                        status: 3,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    };
                }
            }
        }
    }
    async getMqttTopicPA(topics, deletecache, retryCount = 2) {
        const isConnected = await this.isMqttConnected();
        const timestamp = this.generateTimestamp();
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                    timestamp: cached.timestamp,
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
                        timestamp: timestamp,
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
                        timestamp: timestamp,
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
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!this.isMqttConnected()) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
        }
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                    timestamp: cached.timestamp,
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
                        timestamp: timestamp,
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
                        timestamp: timestamp,
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
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    });
                }
            }
        }
    }
    async getMqttTopic(topics, deletecache, retryCount = 2) {
        const isConnected = await this.isMqttConnected();
        const timestamp = this.generateTimestamp();
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
        }
        const topic = encodeURI(topics);
        const time = 50;
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
                    timestamp: cached.timestamp,
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
                        timestamp: timestamp,
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
                        timestamp: timestamp,
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
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
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
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
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
                    timestamp: cached.timestamp,
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
                        data: { result, timestamp },
                    };
                    Cache.SetCacheData(cacheData).catch((err) => console.error('Cache set error:', err));
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
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
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
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
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
        }
        var topic = encodeURI(topics);
        var time = 5;
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
                    timestamp: cached.timestamp,
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
                        data: { result, timestamp },
                    };
                    Cache.SetCacheData(cacheData).catch((err) => console.error('Cache set error:', err));
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
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
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
        }
        const topic = encodeURI(topics);
        var time = 5;
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
                    timestamp: cached.timestamp,
                };
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
                if (payloadString.trim().startsWith('{') ||
                    payloadString.trim().startsWith('[')) {
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
                    var InpuDatacache = {
                        keycache: topic_key,
                        time: time,
                        data: results,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
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
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    };
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                msg: 0,
                message: 'MQTT client not connected',
            };
        }
        const topic = encodeURI(topics);
        var time = 5;
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
                    timestamp: cached.timestamp,
                };
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
                if (payloadString.trim().startsWith('{') ||
                    payloadString.trim().startsWith('[')) {
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
                    var InpuDatacache = {
                        keycache: topic_key,
                        time: time,
                        data: results,
                    };
                    await Cache.SetCacheData(InpuDatacache);
                    return {
                        isConnected,
                        case: 3,
                        status: 1,
                        msg: result,
                        fromCache: false,
                        time: time,
                        timestamp: timestamp,
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
                        timestamp: timestamp,
                    };
                }
            }
            catch (err) {
                console.log(`Attempt ${attempt} failed:`, err.message);
                if (attempt < retryCount) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                else {
                    return {
                        isConnected,
                        case: 5,
                        status: 0,
                        msg: 0,
                        message: `No message from "${topic}" after ${retryCount} attempts`,
                        time: time,
                        timestamp: timestamp,
                    };
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
        var datePart = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
        ].join('-');
        var timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        var timestamp = datePart + ' ' + timePart;
        const topic = encodeURI(topics);
        const isConnected = await this.isMqttConnected();
        if (!isConnected) {
            return {
                case: 0,
                status: 0,
                data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0',
                msg: 0,
                message: 'MQTT client is not connected',
                time: timestamp,
                timestamp: timestamp,
            };
        }
        if (this.messageCache.has(topic)) {
            return {
                case: 1,
                status: 1,
                data: this.messageCache.get(topic),
                msg: 0,
                message: 'MQTT client is connected',
                time: timestamp,
                timestamp: timestamp,
            };
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
                    msg: 0,
                    message: `Failed to subscribe to topic "${topic}": ${err.message}`,
                    time: timestamp,
                    timestamp: timestamp,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, operators_1.take)(1), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                case: 3,
                status: 1,
                msg: result,
                time: timestamp,
                timestamp: timestamp,
            };
        }
        catch (err) {
            if (err.name === 'TimeoutError' || ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
                return {
                    case: 4,
                    status: 0,
                    msg: 0,
                    message: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
                    time: timestamp,
                    timestamp: timestamp,
                };
            }
            else {
                return {
                    case: 5,
                    status: 0,
                    msg: 0,
                    message: `Error receiving message from topic "${topic}": ${err.message}`,
                    time: timestamp,
                    timestamp: timestamp,
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
                return {
                    status: 0,
                    msg: `Failed to subscribe to topic "${topic}": ${err.message}`,
                };
            }
        }
        try {
            const message = await (0, rxjs_1.firstValueFrom)(this.messageStream.pipe((0, operators_1.filter)((msg) => msg.topic === topic), (0, rxjs_1.bufferTime)(100), (0, operators_1.filter)((messages) => messages.length > 0), (0, operators_1.map)((messages) => messages[0]), (0, operators_1.timeout)(10000)));
            let result;
            const payloadString = message.payload.toString();
            if (payloadString.trim().startsWith('{') ||
                payloadString.trim().startsWith('[')) {
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
            return {
                status: 0,
                msg: `Timeout: No message received from topic "${topic}" within 10 seconds.`,
            };
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
            var InpuDatacache = { keycache: kaycache_cache, time: 5, data: rs };
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
        var message = typeof payload === 'object'
            ? JSON.stringify(payload)
            : payload.toString();
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
        await Cache.SetCacheData({
            keycache: cacheKey,
            time: 86400,
            data: payload,
        });
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
            var InpuDatacache = {
                keycache: `${topic_mqtt}`,
                data: message_mqtt,
            };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate()),
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds()),
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
            if (message_mqtt == 1 ||
                message_mqtt == 'on' ||
                message_mqtt == 'ON' ||
                message_mqtt == 'a1' ||
                message_mqtt == 'a1' ||
                message_mqtt == 'b1' ||
                message_mqtt == 'c1' ||
                message_mqtt == 'd1' ||
                message_mqtt == 'e1' ||
                message_mqtt == 'f1' ||
                message_mqtt == 'g1') {
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
            var InpuDatacache = {
                keycache: `${newTopic}`,
                time: 3,
                data: getDataObject,
            };
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
            var InpuDatacache = {
                keycache: `${topic_mqtt}`,
                data: message_mqtt,
            };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate()),
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds()),
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
            if (message_mqtt == 1 ||
                message_mqtt == 'on' ||
                message_mqtt == 'ON' ||
                message_mqtt == 'a1' ||
                message_mqtt == 'a1' ||
                message_mqtt == 'b1' ||
                message_mqtt == 'c1' ||
                message_mqtt == 'd1' ||
                message_mqtt == 'e1' ||
                message_mqtt == 'f1' ||
                message_mqtt == 'g1') {
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
            var InpuDatacache = {
                keycache: `${newTopic}`,
                time: 3,
                data: getDataObject,
            };
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
            var InpuDatacache = {
                keycache: `${topic_mqtt}`,
                data: message_mqtt,
            };
            await Cache.SetCacheKey(InpuDatacache);
            var today = format.getDayname();
            var getDaynameall = format.getDaynameall();
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1),
                pad(now.getDate()),
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds()),
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
                contRelay1: parseFloat(parts[1]),
                actRelay1: parseFloat(parts[2]),
                fan1: parseFloat(parts[3]),
                overFan1: parseFloat(parts[4]),
                contRelay2: parseFloat(parts[5]),
                actRelay2: parseFloat(parts[6]),
                fan2: parseFloat(parts[7]),
                overFan2: parseFloat(parts[8]),
            };
            var InpuDatacache = {
                keycache: `${newTopic}`,
                time: 5,
                data: getDataObject,
            };
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
                    pad(now.getDate()),
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds()),
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
                    await Cache.SetCacheData({
                        keycache: keycache,
                        time: 3,
                        data: mqttdata,
                    });
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
                    pad(now.getDate()),
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds()),
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
                            overFan2: [],
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
                        contRelay1: parseFloat(parts[1]),
                        actRelay1: parseFloat(parts[2]),
                        fan1: parseFloat(parts[3]),
                        overFan1: parseFloat(parts[4]),
                        contRelay2: parseFloat(parts[5]),
                        actRelay2: parseFloat(parts[6]),
                        fan2: parseFloat(parts[7]),
                        overFan2: parseFloat(parts[8]),
                    };
                    var InpuDatacache = {
                        keycache: `${topic}`,
                        time: 3,
                        data: dataObject,
                    };
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
                    pad(now.getDate()),
                ].join('-');
                const timePart = [
                    pad(now.getHours()),
                    pad(now.getMinutes()),
                    pad(now.getSeconds()),
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
                    var InpuDatacache = {
                        keycache: keycache,
                        time: 5,
                        data: dataRS,
                    };
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
                pad(now.getDate()),
            ].join('-');
            const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds()),
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
            pad(now.getDate()),
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
        ].join(':');
        return `${datePart} ${timePart}`;
    }
    async cacheDataAsyncs(keycache, data) {
        try {
            await Cache.SetCacheData({ keycache: keycache, time: 5, data: data });
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
            pad(now.getDate()),
        ].join('-');
        const timePart = [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds()),
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
                    data: parts,
                };
                var InpuDatacache = {
                    keycache: keycache,
                    time: 5,
                    data: dataObjects,
                };
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
    async AlarmDetailValidate(dto) {
        var _a, _b;
        try {
            console.log('getAlarmDetails dto-->', dto);
            const unit = dto.unit || '';
            let type_id = dto.type_id ? parseFloat(dto.type_id) : 0;
            if (dto.alarmTypeId) {
                type_id = parseFloat(dto.alarmTypeId);
            }
            let sensorValues = dto.value_data;
            if (sensorValues !== null &&
                sensorValues !== undefined &&
                sensorValues !== '') {
                const sensorValueNum = parseFloat(sensorValues);
                if (!isNaN(sensorValueNum)) {
                    sensorValues = sensorValueNum;
                }
            }
            var max = (_a = dto.max) !== null && _a !== void 0 ? _a : '';
            var min = (_b = dto.min) !== null && _b !== void 0 ? _b : '';
            const statusAlert = parseFloat(dto.status_alert) || 0;
            const statusWarning = parseFloat(dto.status_warning) || 0;
            const recoveryWarning = parseFloat(dto.recovery_warning) || 0;
            const recoveryAlert = parseFloat(dto.recovery_alert) || 0;
            const mqttName = '';
            const deviceName = dto.device_name || '';
            const alarmActionName = dto.action_name || '';
            const mqttControlOn = dto.mqtt_control_on || '';
            const mqttControlOff = dto.mqtt_control_off || '';
            const count_alarm = parseFloat(dto.count_alarm) || 0;
            const event = parseFloat(dto.event) || 0;
            let dataAlarm = 999;
            let eventControl = event;
            let messageMqttControl = event === 1 ? mqttControlOn : mqttControlOff;
            let alarmStatusSet = 999;
            let subject = '';
            let content = '';
            let status = 5;
            let data_alarm = 0;
            let value_data = dto.value_data;
            let value_alarm = dto.value_alarm || '';
            let value_relay = dto.value_relay || '';
            let value_control_relay = dto.value_control_relay || '';
            let sensor_data = null;
            let title = 'Normal';
            sensor_data = parseFloat(dto.value_data) || 0;
            const sensorValue = sensor_data;
            if (max != '' && sensorValue >= max) {
                alarmStatusSet = 1;
                title = 'Warning Highest value';
                subject = `${mqttName} Warning Highest value: ${deviceName} data : ${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Warning Highest value Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = statusWarning;
                data_alarm = statusWarning;
                status = 1;
            }
            else if (min != '' && sensorValue <= min) {
                alarmStatusSet = 1;
                title = 'Warning Minimum value';
                subject = `${mqttName} Warning Minimum value: ${deviceName} data : ${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Warning Minimum value Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = statusWarning;
                data_alarm = statusWarning;
                status = 1;
            }
            else if ((sensorValue > statusWarning || sensorValue === statusWarning) &&
                statusWarning < statusAlert) {
                alarmStatusSet = 1;
                title = 'Warning';
                subject = `${mqttName} Warning : ${deviceName} data : ${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Warning Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = statusWarning;
                data_alarm = statusWarning;
                status = 1;
            }
            else if ((sensorValue > statusAlert || sensorValue === statusAlert) &&
                statusAlert > statusWarning) {
                alarmStatusSet = 2;
                title = 'Alarm';
                subject = `${mqttName} Critical Alarm : ${deviceName} data :${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Alarm Alarm Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = statusAlert;
                data_alarm = statusAlert;
                status = 2;
            }
            else if (count_alarm >= 1 &&
                (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
                recoveryWarning <= recoveryAlert) {
                alarmStatusSet = 3;
                title = 'Recovery Warning ';
                subject = `${mqttName} Recovery Warning : ${deviceName} data :${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Recovery Warning Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = recoveryWarning;
                data_alarm = recoveryWarning;
                eventControl = event === 1 ? 0 : 1;
                messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
                status = 3;
            }
            else if (count_alarm >= 1 &&
                (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
                recoveryAlert >= recoveryWarning) {
                alarmStatusSet = 4;
                title = `${mqttName} Recovery Critical Alarm`;
                subject = `${mqttName} Recovery Critical Alarm :${deviceName} data :${sensorValue} ${unit}`;
                content = `${mqttName} ${alarmActionName} Recovery Alarm Alarm Device : ${deviceName} data :${sensorValue}`;
                dataAlarm = recoveryAlert;
                data_alarm = recoveryAlert;
                eventControl = event === 1 ? 0 : 1;
                messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
                status = 4;
            }
            else {
                alarmStatusSet = 999;
                title = 'Normal';
                subject = 'Normal';
                content = 'Normal Status ';
                dataAlarm = 0;
                data_alarm = 0;
                status = 5;
            }
            const result = {
                status: status,
                statusControl: status,
                alarmTypeId: type_id,
                type_id: type_id,
                alarmStatusSet: alarmStatusSet,
                title,
                subject: subject,
                content: content,
                value_data: value_data,
                value_alarm: dto.value_alarm || '',
                value_relay: value_relay,
                value_control_relay: value_control_relay,
                dataAlarm: dataAlarm,
                data_alarm: data_alarm,
                max: max,
                min: min,
                eventControl: eventControl,
                messageMqttControl: messageMqttControl,
                sensor_data: sensor_data,
                count_alarm: count_alarm,
                mqttName: mqttName,
                mqtt_name: dto.mqtt_name || '',
                device_name: dto.device_name || '',
                mqtt_control_on: dto.mqtt_control_on || '',
                unit: dto.unit || '',
                sensorValue: dto.sensorValueData || '',
                statusAlert: statusAlert,
                statusWarning: statusWarning,
                recoveryWarning: recoveryWarning,
                recoveryAlert: dto.recovery_alert || '',
                deviceName: dto.device_name || '',
                alarmActionName: dto.action_name || '',
                mqttControlOn: dto.mqtt_control_on || '',
                mqttControlOff: dto.mqtt_control_off || '',
                event: dto.event || 0,
            };
            return result;
        }
        catch (error) {
            console.error('Error in getAlarmDetails:', error);
            throw error;
        }
    }
    async alarm_device(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            var alarm_action_id = dto.alarm_action_id;
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            const query = await this.DevicealarmactionRepository.createQueryBuilder('al');
            query.select(['al.*']);
            query.where('1=1');
            if (keyword) {
                query.andWhere('al.action_name like :action_name', {
                    action_name: keyword ? `%${keyword}%` : '%',
                });
            }
            if (dto.alarm_action_id) {
                query.andWhere('al.alarm_action_id=:alarm_action_id', {
                    alarm_action_id: dto.alarm_action_id,
                });
            }
            if (dto.event) {
                query.andWhere('al.event=:event', { event: dto.event });
            }
            var status = 1;
            query.andWhere('al.status=:status', { status: status });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            query.orderBy(`al.alarm_action_id`, 'ASC');
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
    async alarm_device_paginate_status(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            var alarm_action_id = dto.alarm_action_id;
            var keyword = dto.keyword || '';
            var status = dto.status;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.DevicealarmactionRepository.createQueryBuilder('al');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT al.alarm_action_id)', 'cnt');
            }
            else {
                query.select(['al.*']);
            }
            query.where('1=1');
            if (keyword) {
                query.andWhere('al.action_name like :action_name', {
                    action_name: keyword ? `%${keyword}%` : '%',
                });
            }
            if (dto.alarm_action_id) {
                query.andWhere('al.alarm_action_id=:alarm_action_id', {
                    alarm_action_id: dto.alarm_action_id,
                });
            }
            if (dto.event) {
                query.andWhere('al.event=:event', { event: dto.event });
            }
            var status = 1;
            query.andWhere('al.status=:status', { status: status });
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
                    query.orderBy(`al.alarm_action_id.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`al.alarm_action_id`, 'ASC');
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
    async device_lists_id(dto) {
        console.log(`type_list_paginate dto=`);
        console.info(dto);
        try {
            var device_id = dto.device_id;
            var layout = dto.layout;
            var mqtt_id = dto.mqtt_id;
            var keyword = dto.keyword || '';
            var type_id = dto.type_id || '';
            var hardware_id = dto.hardware_id || '';
            var status = dto.status;
            var mqtt_data_value = dto.mqtt_data_value;
            var createddate = dto.createddate;
            var updateddate = dto.updateddate;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 1000;
            var isCount = dto.isCount || 0;
            const query = await this.DeviceRepository.createQueryBuilder('d');
            query.select([
                'd.device_id AS device_id',
                'd.type_id AS type_id',
                'd.hardware_id AS hardware_id',
                't.type_name AS type_name',
                'd.device_name AS device_name',
                'd.status_warning AS status_warning',
                'd.recovery_warning AS recovery_warning',
                'd.status_alert AS status_alert',
                'd.recovery_alert AS recovery_alert',
                'd.time_life AS time_life',
                'd.period AS period',
                'd.model AS model',
                'd.vendor AS vendor',
                'd.status AS status',
                'd.unit AS unit',
                'd.mqtt_id AS mqtt_id',
                'd.mqtt_data_value AS mqtt_data_value',
                'd.mqtt_data_control AS mqtt_data_control',
                'd.mqtt_control_on AS mqtt_control_on',
                'd.mqtt_control_off AS mqtt_control_off',
                'd.measurement AS measurement',
                'l.location_name AS location_name',
                'mq.mqtt_name AS mqtt_name',
                'mq.org AS mqtt_org',
                'mq.bucket AS mqtt_bucket',
                'mq.envavorment AS mqtt_envavorment',
                'd.max AS max',
                'd.min AS min',
                'd.action_id AS action_id',
                'mq.host AS mqtt_host',
                'mq.port AS mqtt_port',
                'd.mqtt_device_name AS mqtt_device_name',
                'd.mqtt_status_over_name AS mqtt_status_over_name',
                'd.mqtt_status_data_name AS mqtt_status_data_name',
                'd.mqtt_act_relay_name AS mqtt_act_relay_name',
                'd.mqtt_control_relay_name AS mqtt_control_relay_name',
                'd.menu AS menu',
                'd.alert_set AS alert_set',
                'd.icon_normal AS icon_normal',
                'd.icon_warning AS icon_warning',
                'd.icon_alert AS icon_alert',
                'd.icon AS icon',
                'd.icon_on AS icon_on',
                'd.icon_off AS icon_off',
                'd.color_normal AS color_normal',
                'd.color_warning AS color_warning',
                'd.color_alert AS color_alert',
                'd.code AS code',
            ]);
            query.leftJoin('sd_iot_setting', 'st', 'st.setting_id= d.setting_id');
            query.leftJoin('sd_iot_device_type', 't', 't.type_id = d.type_id');
            query.leftJoin('sd_iot_mqtt', 'mq', 'mq.mqtt_id = d.mqtt_id');
            query.leftJoin('sd_iot_location', 'l', 'l.location_id= d.location_id');
            query.where('1=1');
            var org = dto.original;
            var bucket = dto.bucket;
            var mqtt_data_value = dto.mqtt_data_value;
            if (device_id) {
                query.andWhere('d.device_id=:device_id', { device_id: device_id });
            }
            if (mqtt_id) {
                query.andWhere('d.mqtt_id=:mqtt_id', { mqtt_id: mqtt_id });
            }
            if (dto.menu) {
                query.andWhere('d.menu=:menu', { menu: dto.menu });
            }
            if (dto.alert_set) {
                query.andWhere('d.alert_set=:alert_set', { alert_set: dto.alert_set });
            }
            if (keyword) {
                query.andWhere('d.device_name like :device_name', {
                    device_name: keyword ? `%${keyword}%` : '%',
                });
            }
            if (hardware_id) {
                query.andWhere('d.hardware_id=:hardware_id', {
                    hardware_id: hardware_id,
                });
            }
            if (type_id) {
                query.andWhere('d.type_id=:type_id', { type_id: type_id });
            }
            if (layout) {
                query.andWhere('d.layout=:layout', { layout: layout });
            }
            if (org) {
                query.andWhere('d.org =:org', { org: org });
            }
            if (bucket) {
                query.andWhere('d.bucket =:bucket', { bucket: bucket });
            }
            var measurement = dto.measurement;
            if (measurement) {
                query.andWhere('d.measurement =:measurement', {
                    measurement: measurement,
                });
            }
            if (mqtt_data_value) {
                query.andWhere('d.mqtt_data_value =:mqtt_data_value', {
                    mqtt_data_value: mqtt_data_value,
                });
            }
            if (status) {
                query.andWhere('d.status=:status', { status: status });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
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
                query.orderBy(`d.${sortField}`, sortOrders.toUpperCase());
            }
            else {
                query.orderBy('mq.sort', 'ASC');
                query.addOrderBy('d.device_id', 'ASC');
            }
            query.limit(pageSize);
            query.offset(pageSize * (page - 1));
            return await query.getRawMany();
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: 'Failed to retrieve device list.',
                    details: error,
                },
            });
        }
    }
    async devicetype(dto) {
        console.log(`=devicetype_all=`);
        try {
            const query = await this.DeviceTypeRepository.createQueryBuilder('dt');
            query.innerJoin('sd_iot_device', 'd', 'dt.type_id = d.type_id');
            query.innerJoin('sd_iot_location', 'l', 'l.location_id= d.location_id');
            query.innerJoin('sd_iot_mqtt', 'mq', 'mq.mqtt_id = d.mqtt_id');
            query.select(['dt.type_id,dt.type_name,d.hardware_id']);
            var org = dto.org;
            var layout = dto.layout;
            var bucket = dto.bucket;
            var type_id = dto.type_id || '';
            var hardware_id = dto.hardware_id || '';
            var status = dto.status;
            query.andWhere('1=1');
            if (hardware_id) {
                query.andWhere('d.hardware_id=:hardware_id', {
                    hardware_id: hardware_id,
                });
            }
            if (layout) {
                query.andWhere('d.layout=:layout', { layout: layout });
            }
            if (type_id) {
                query.andWhere('d.type_id=:type_id', { type_id: type_id });
            }
            if (org) {
                query.andWhere('d.org =:org', { org: org });
            }
            if (bucket) {
                query.andWhere('d.bucket =:bucket', { bucket: bucket });
            }
            if (status) {
                query.andWhere('d.status=:status', { status: status });
            }
            query.groupBy('dt.type_id');
            query.addGroupBy('d.type_id');
            query.addGroupBy('d.hardware_id');
            query.orderBy(`dt.type_id`, 'ASC');
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
    async scheduleprocess(dto) {
        try {
            var host_name = dto.host_name;
            var device_id = dto.device_id;
            var schedule_id = dto.schedule_id;
            var keyword = dto.keyword || '';
            var createddate = dto.createddate;
            var updateddate = dto.updateddate;
            var ipaddress = dto.ipaddress;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            var query = await this.DeviceRepository.createQueryBuilder('d');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT d.device_id)', 'cnt');
            }
            else {
                query.select([
                    'd.device_id AS device_id',
                    'sd.schedule_id AS schedule_id',
                    'scd.schedule_name AS schedule_name',
                    'scd.start AS schedule_event_start',
                    'scd.event AS schedule_event',
                    'scd.sunday AS sunday',
                    'scd.monday AS monday',
                    'scd.tuesday AS tuesday',
                    'scd.wednesday AS wednesday',
                    'scd.thursday AS thursday',
                    'scd.friday AS friday',
                    'scd.saturday AS saturday',
                    'd.mqtt_id AS mqtt_id',
                    'd.setting_id AS setting_id',
                    'type.type_id AS type_id',
                    'type.type_name AS type_name',
                    'type.group_id AS group_id',
                    'h.host_id AS host_id',
                    'h.host_name AS host_name',
                    'h.idhost AS idhost',
                    'd.type_id AS type_id',
                    'd.device_name AS device_name',
                    'd.sn AS sn',
                    'd.hardware_id AS hardware_id',
                    'd.status_warning AS status_warning',
                    'd.recovery_warning AS recovery_warning',
                    'd.status_alert AS status_alert',
                    'd.recovery_alert AS recovery_alert',
                    'd.time_life AS time_life',
                    'd.period AS period',
                    'd.work_status AS work_status',
                    'd.max AS max',
                    'd.min AS min',
                    'd.oid AS oid',
                    'd.mqtt_data_value AS mqtt_data_value',
                    'd.mqtt_data_control AS mqtt_data_control',
                    'd.model AS model',
                    'd.vendor AS vendor',
                    'd.comparevalue AS comparevalue',
                    'd.createddate AS createddate',
                    'd.updateddate AS updateddate',
                    'd.status AS status',
                    'd.unit AS unit',
                    'd.action_id AS action_id',
                    'd.status_alert_id AS status_alert_id',
                    'd.measurement AS measurement',
                    'd.mqtt_control_on AS mqtt_control_on',
                    'd.mqtt_control_off AS mqtt_control_off',
                    'd.org AS device_org',
                    'd.bucket AS device_bucket',
                    'd.updateddate AS timestamp',
                    'd.mqtt_device_name AS mqtt_device_name',
                    'd.mqtt_status_over_name AS mqtt_status_over_name',
                    'd.mqtt_status_data_name AS mqtt_status_data_name',
                    'd.mqtt_act_relay_name AS mqtt_act_relay_name',
                    'd.mqtt_control_relay_name AS mqtt_control_relay_name',
                    't.type_name AS type_name',
                    'l.location_id AS location_id',
                    'l.location_name AS location_name',
                    'l.ipaddress AS location_address',
                    'l.configdata AS configdata',
                    'mq.mqtt_name AS mqtt_name',
                    'mq.org AS mqtt_org',
                    'mq.bucket AS mqtt_bucket',
                    'mq.envavorment AS mqtt_envavorment',
                    'mq.host AS mqtt_host',
                    'mq.port AS mqtt_port',
                ]);
            }
            query.innerJoin('sd_iot_schedule_device', 'sd', 'sd.device_id= d.device_id');
            query.innerJoin('sd_iot_schedule', 'scd', 'scd.schedule_id= sd.schedule_id');
            query.innerJoin('sd_iot_device_type', 't', 't.type_id = d.type_id');
            query.innerJoin('sd_iot_mqtt', 'mq', 'mq.mqtt_id = d.mqtt_id');
            query.innerJoin('sd_iot_location', 'l', 'l.location_id= mq.location_id');
            query.leftJoin('sd_iot_type', 'type', 'type.type_id = mq.mqtt_type_id');
            query.leftJoin('sd_iot_host', 'h', 'mq.mqtt_main_id = h.idhost');
            query.where('1=1');
            if (keyword) {
                query.andWhere('d.device_name LIKE :keyword', {
                    keyword: `%${keyword}%`,
                });
            }
            var status = 1;
            query.andWhere('d.status=:status', { status: status });
            query.andWhere('scd.status=:status', { status: status });
            if (host_name) {
                query.andWhere('h.host_name=:host_name', {
                    host_name: host_name,
                });
            }
            if (schedule_id) {
                query.andWhere('scd.schedule_id=:schedule_id', {
                    schedule_id: schedule_id,
                });
            }
            if (device_id) {
                query.andWhere('scd.device_id=:device_id', { device_id: device_id });
            }
            if (dto.org) {
                query.andWhere('d.org=:org', { org: dto.org });
            }
            if (dto.bucket) {
                query.andWhere('d.bucket =:bucket', { bucket: dto.bucket });
            }
            if (ipaddress) {
                query.andWhere('l.ipaddress=:ipaddress', {
                    ipaddress: ipaddress,
                });
            }
            if (createddate) {
                query.andWhere('d.createddate=:createddate', {
                    createddate: createddate,
                });
            }
            if (updateddate) {
                query.andWhere('d.updateddate=:updateddate', {
                    updateddate: updateddate,
                });
            }
            if (dto.type_id) {
                query.andWhere('d.type_id=:type_id', { type_id: dto.type_id });
            }
            if (dto.location_id) {
                query.andWhere('st.location_id=:location_id', {
                    location_id: dto.location_id,
                });
            }
            if (dto.sn) {
                query.andWhere('d.sn=:sn', { sn: dto.sn });
            }
            if (dto.status_warning) {
                query.andWhere('d.status_warning=:status_warning', {
                    status_warning: dto.status_warning,
                });
            }
            if (dto.recovery_warning) {
                query.andWhere('d.recovery_warning=:recovery_warning', {
                    recovery_warning: dto.recovery_warning,
                });
            }
            if (dto.status_alert) {
                query.andWhere('d.status_alert=:status_alert', {
                    status_alert: dto.status_alert,
                });
            }
            if (dto.recovery_alert) {
                query.andWhere('d.recovery_alert=:recovery_alert', {
                    recovery_alert: dto.recovery_alert,
                });
            }
            if (dto.time_life) {
                query.andWhere('d.time_life=:time_life', { time_life: dto.time_life });
            }
            if (dto.period) {
                query.andWhere('d.period=:period', { period: dto.period });
            }
            if (dto.max) {
                query.andWhere('d.max=:max', { max: dto.max });
            }
            if (dto.min) {
                query.andWhere('d.min=:min', { min: dto.min });
            }
            if (dto.hardware_id) {
                query.andWhere('d.hardware_id=:hardware_id', {
                    hardware_id: dto.hardware_id,
                });
            }
            if (dto.model) {
                query.andWhere('d.model=::model', { model: dto.model });
            }
            if (dto.vendor) {
                query.andWhere('d.vendor=:vendor', { vendor: dto.vendor });
            }
            if (dto.comparevalue) {
                query.andWhere('d.comparevalue=:comparevalue', {
                    comparevalue: dto.comparevalue,
                });
            }
            if (dto.mqtt_id) {
                query.andWhere('d.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.oid) {
                query.andWhere('d.oid=:oid', { oid: dto.oid });
            }
            if (dto.action_id) {
                query.andWhere('d.action_id=:action_id', { action_id: dto.action_id });
            }
            if (dto.mqtt_data_value) {
                query.andWhere('d.mqtt_data_value=:mqtt_data_value', {
                    mqtt_data_value: dto.mqtt_data_value,
                });
            }
            if (dto.mqtt_data_control) {
                query.andWhere('d.mqtt_data_control=:mqtt_data_control', {
                    mqtt_data_control: dto.mqtt_data_control,
                });
            }
            if (createddate) {
                query.andWhere('d.createddate=:createddate', {
                    createddate: createddate,
                });
            }
            if (updateddate) {
                query.andWhere('d.updateddate=:updateddate', {
                    updateddate: updateddate,
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult == false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`d.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy('scd.start', 'ASC');
                    query.addOrderBy('scd.schedule_id', 'ASC');
                    query.addOrderBy('mq.sort', 'ASC');
                    query.addOrderBy('d.device_id', 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                const deviceList = await query.getRawMany();
                return deviceList;
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
    async scheduleprocesslog_count_status(dto) {
        console.log(`scheduleprocesslog_count_status_dto=`);
        console.info(dto);
        try {
            var schedule_id = dto.schedule_id;
            var device_id = dto.device_id;
            var schedule_event_start = dto.schedule_event_start;
            var day = dto.day;
            var doday = dto.doday;
            var dotime = dto.dotime;
            var schedule_event = dto.schedule_event;
            var device_status = dto.device_status;
            const query = await this.scheduleprocesslogRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.id)', 'cnt');
            query.where('1=1');
            if (schedule_id) {
                query.andWhere('l.schedule_id=:schedule_id', {
                    schedule_id: schedule_id,
                });
            }
            if (device_id) {
                query.andWhere('l.device_id=:device_id', { device_id: device_id });
            }
            if (schedule_event_start) {
                query.andWhere('l.schedule_event_start=:schedule_event_start', {
                    schedule_event_start: schedule_event_start,
                });
            }
            if (dto.date) {
                query.andWhere('l.date=:date', { date: dto.date });
            }
            if (dto.schedule_event) {
                query.andWhere('l.schedule_event=:schedule_event', {
                    schedule_event: dto.schedule_event,
                });
            }
            var status = 1;
            query.andWhere('l.status=:status', { status: status });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            console.log(`count =>` + count);
            console.log(`tempCountt.count =>` + tempCounts.count);
            return count;
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
    async scheduleprocesslog_count(dto) {
        console.log(`scheduleprocesslog_count_dto=`);
        console.info(dto);
        try {
            var schedule_id = dto.schedule_id;
            var device_id = dto.device_id;
            var schedule_event_start = dto.schedule_event_start;
            var day = dto.day;
            var doday = dto.doday;
            var dotime = dto.dotime;
            var schedule_event = dto.schedule_event;
            var device_status = dto.device_status;
            const query = await this.scheduleprocesslogRepository.createQueryBuilder('l');
            var countRs = await query.select('COUNT(DISTINCT l.id)', 'cnt');
            query.where('1=1');
            if (schedule_id) {
                query.andWhere('l.schedule_id=:schedule_id', {
                    schedule_id: schedule_id,
                });
            }
            if (device_id) {
                query.andWhere('l.device_id=:device_id', { device_id: device_id });
            }
            if (schedule_event_start) {
                query.andWhere('l.schedule_event_start=:schedule_event_start', {
                    schedule_event_start: schedule_event_start,
                });
            }
            if (dto.date) {
                query.andWhere('l.date=:date', { date: dto.date });
            }
            if (dto.schedule_event) {
                query.andWhere('l.schedule_event=:schedule_event', {
                    schedule_event: dto.schedule_event,
                });
            }
            if (dto.device_status) {
                query.andWhere('l.device_status=:device_status', {
                    device_status: dto.device_status,
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            var count = await query.getCount();
            let tempCounts = {};
            tempCounts.count = countRs;
            console.log(`count =>` + count);
            console.log(`tempCountt.count =>` + tempCounts.count);
            return count;
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
    async update_scheduleprocesslog_v2(dto) {
        var id = dto.id;
        var DataUpdate = {};
        if (dto.day != '') {
            DataUpdate.day = dto.day;
        }
        if (dto.doday != '') {
            DataUpdate.doday = dto.doday;
        }
        if (dto.dotime != '') {
            DataUpdate.dotime = dto.dotime;
        }
        if (dto.time != '') {
            DataUpdate.time = dto.time;
        }
        if (dto.device_status) {
            DataUpdate.device_status = dto.device_status;
        }
        if (dto.device_status == dto.schedule_event) {
            DataUpdate.status = 1;
        }
        else {
            DataUpdate.status = 0;
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
        await this.alarmDeviceRepository
            .createQueryBuilder()
            .update('sd_schedule_process_log')
            .set(DataUpdate)
            .where('schedule_id=:schedule_id', { schedule_id: dto.schedule_id })
            .andWhere('device_id=:device_id', { device_id: dto.device_id })
            .andWhere('schedule_event_start=:schedule_event_start', {
            schedule_event_start: dto.schedule_event_start,
        })
            .andWhere('schedule_event=:schedule_event', {
            schedule_event: dto.schedule_event,
        })
            .andWhere('date=:date', { date: dto.date })
            .execute();
        return 200;
    }
    create(createMqtt2Dto) {
        return 'This action adds a new mqtt2';
    }
    findAll() {
        return `This action returns all mqtt2`;
    }
    findOne(id) {
        return `This action returns a #${id} mqtt2`;
    }
    update(id, updateMqtt2Dto) {
        return `This action updates a #${id} mqtt2`;
    }
    remove(id) {
        return `This action removes a #${id} mqtt2`;
    }
};
Mqtt2Service = Mqtt2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MQTT_CLIENT')),
    __param(1, (0, typeorm_1.InjectRepository)(devivicealarmaction_entity_1.Devicealarmaction)),
    __param(2, (0, typeorm_1.InjectRepository)(dashboard_config_entity_1.dashboardConfig)),
    __param(3, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(4, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(5, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(6, (0, typeorm_1.InjectRepository)(sensor_entity_1.Sensor)),
    __param(7, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(8, (0, typeorm_1.InjectRepository)(mqtt_entity_1.Mqtt)),
    __param(9, (0, typeorm_1.InjectRepository)(api_entity_1.Api)),
    __param(10, (0, typeorm_1.InjectRepository)(devicetype_entity_1.DeviceType)),
    __param(11, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(12, (0, typeorm_1.InjectRepository)(email_entity_1.Email)),
    __param(13, (0, typeorm_1.InjectRepository)(host_entity_1.Host)),
    __param(14, (0, typeorm_1.InjectRepository)(influxdb_entity_1.Influxdb)),
    __param(15, (0, typeorm_1.InjectRepository)(line_entity_1.Line)),
    __param(16, (0, typeorm_1.InjectRepository)(nodered_entity_1.Nodered)),
    __param(17, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(18, (0, typeorm_1.InjectRepository)(sms_entity_1.Sms)),
    __param(19, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(20, (0, typeorm_1.InjectRepository)(scheduledevice_entity_1.scheduleDevice)),
    __param(21, (0, typeorm_1.InjectRepository)(deviceaction_entity_1.Deviceaction)),
    __param(22, (0, typeorm_1.InjectRepository)(deviceactionlog_entity_1.Deviceactionlog)),
    __param(23, (0, typeorm_1.InjectRepository)(deviceactionuser_entity_1.Deviceactionuser)),
    __param(24, (0, typeorm_1.InjectRepository)(telegram_entity_1.Telegram)),
    __param(25, (0, typeorm_1.InjectRepository)(alarmdevice_entity_1.alarmDevice)),
    __param(26, (0, typeorm_1.InjectRepository)(alarmdeviceevent_entity_1.alarmDeviceEvent)),
    __param(27, (0, typeorm_1.InjectRepository)(scheduleprocesslog_entity_1.scheduleprocesslog)),
    __param(28, (0, typeorm_1.InjectRepository)(alarmprocesslog_entity_1.alarmprocesslog)),
    __param(29, (0, typeorm_1.InjectRepository)(alarmprocesslogtemp_entity_1.alarmprocesslogtemp)),
    __param(30, (0, typeorm_1.InjectRepository)(alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt)),
    __param(31, (0, typeorm_1.InjectRepository)(alarmprocesslogemail_entity_1.alarmprocesslogemail)),
    __param(32, (0, typeorm_1.InjectRepository)(alarmprocesslogline_entity_1.alarmprocesslogline)),
    __param(33, (0, typeorm_1.InjectRepository)(alarmprocesslogsms_entity_1.alarmprocesslogsms)),
    __param(34, (0, typeorm_1.InjectRepository)(alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram)),
    __param(35, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(36, (0, typeorm_1.InjectRepository)(sduserrole_entity_1.SdUserRole)),
    __param(37, (0, typeorm_1.InjectRepository)(rolesaccess_entity_1.SdUserRolesAccess)),
    __param(38, (0, typeorm_1.InjectRepository)(userrolepermission_entity_1.UserRolePermission)),
    __param(39, (0, typeorm_1.InjectRepository)(mqtthost_entity_1.mqtthost)),
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
], Mqtt2Service);
exports.Mqtt2Service = Mqtt2Service;
//# sourceMappingURL=mqtt2.service.js.map