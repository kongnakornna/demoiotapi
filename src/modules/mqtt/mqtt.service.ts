import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
  OnModuleInit, 
  OnModuleDestroy,
} from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
/****entity****/
import { DeviceType } from '@src/modules/settings/entities/devicetype.entity';
import { User } from '@src/modules/users/entities/user.entity';
import { SdUserRole } from '@src/modules/users/entities/sduserrole.entity';   
import { UserFile } from '@src/modules/users/entities/file.entity';
import { SdUserRolesAccess } from '@src/modules/users/entities/rolesaccess.entity';
import { UserRolePermission } from '@src/modules/users/entities/userrolepermission.entity';
import { Setting } from '@src/modules/settings/entities/setting.entity';
import { Location } from '@src/modules/settings/entities/location.entity';
import { Type } from '@src/modules/settings/entities/type.entity';
import { Sensor } from '@src/modules/settings/entities/sensor.entity';
import { Group } from '@src/modules/settings/entities/group.entity';
import { Mqtt } from '@src/modules/settings/entities/mqtt.entity';
import { Deviceaction } from '@src/modules/settings/entities/deviceaction.entity';
import { Deviceactionlog } from '@src/modules/settings/entities/deviceactionlog.entity';
import { Deviceactionuser } from '@src/modules/settings/entities/deviceactionuser.entity';
import { Devicealarmaction } from '@src/modules/settings/entities/devivicealarmaction.entity';
import { Telegram } from '@src/modules/settings/entities//telegram.entity';
import { Api } from '@src/modules/settings/entities/api.entity';
import { Device } from '@src/modules/settings/entities/device.entity';
import { Email } from '@src/modules/settings/entities/email.entity';
import { Host } from '@src/modules/settings/entities/host.entity';
import { Influxdb } from '@src/modules/settings/entities/influxdb.entity';
import { Line } from '@src/modules/settings/entities/line.entity';
import { Nodered } from '@src/modules/settings/entities/nodered.entity';
import { Schedule } from '@src/modules/settings/entities/schedule.entity';
import { Sms } from '@src/modules/settings/entities/sms.entity';
import { Token } from '@src/modules/settings/entities/token.entity';
import { scheduleDevice } from '@src/modules/settings/entities/scheduledevice.entity'; 
import { scheduleprocesslog } from '@src/modules/settings/entities/scheduleprocesslog.entity';
import { alarmprocesslog } from '@src/modules/settings/entities/alarmprocesslog.entity';
import { mqttlog } from '@src/modules/iot/entities/mqttlog.entity';
/****entity****/
import * as format from '@src/helpers/format.helper';
import { CreateMqttDto } from '@src/modules/mqtt/dto/create-mqtt.dto';
import { UpdateMqttDto } from '@src/modules/mqtt/dto/update-mqtt.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
import { redisDto } from '@src/modules/redis/dto/redis.dto';
import { redisUserDto } from '@src/modules/redis/dto/redisuser.dto';
const tz = require('moment-timezone');
var Cache = new CacheDataOne();
var md5 = require('md5');
import { connect, MqttClient,IClientOptions } from 'mqtt'; // <-- ใช้ 'mqtt' โดยตรง
import { BehaviorSubject, Subject,firstValueFrom,TimeoutError,bufferTime,Observable } from 'rxjs';
import { filter, first, take, timeout,map,catchError } from 'rxjs/operators';
import { TransformInterceptor } from '@src/modules/mqtt/transform.interceptor';
//transform.interceptor
import {
  getCurrentDateTimeForSQL,
  convertSortInput,
} from '@helpers/format.helper';
var moment = require('moment'); 
var connectUrl_mqtt:any = process.env.MQTT_HOST;  
if(!connectUrl_mqtt){
       var connectUrl_mqtt:any = 'mqtt://localhost:1883';  
} 
if(!connectUrl_mqtt){
       var connectUrl_mqtt:any = 'mqtt://127.0.0.1:1883';  
} 
// เพิ่ม interface สำหรับเก็บสถานะ
interface MqttConnectionStatus {
  connected: boolean;
  lastConnectionTime: Date | null;
  error: any;
} 
interface MqttMessage {
  topic: string;
  payload: Buffer;
}
@Injectable()
export class MqttService {
   // Key: ชื่อ topic (string), Value: ข้อมูลที่ได้รับ (any)
  private latestData = new Map<string, any>();
  private mqttClient: MqttClient;
  private connectionStatus: MqttConnectionStatus; // ประกาศตัวแปรนี้
  // ใช้ Subject เพื่อจัดการกับ message ที่เข้ามาแบบ stream
  private messageStream = new Subject<{ topic: string; payload: Buffer }>();
  private readonly logger = new Logger(MqttService.name);
  private messageStreams = new BehaviorSubject<MqttMessage>({ topic: '', payload: Buffer.from('') });
  private messageCache1 = new Map<string, any>();
  private subscribedTopics1 = new Set<string>();
  private isConnected = false;
  private connectionPromise: Promise<boolean> | null = null;
  private subscribedTopics = new Set<string>(); // เก็บ topic ที่ subscribe แล้ว
  private messageCache = new Map<string, {result: any, timestamp: number}>(); //เก็บ cache แบบ realtime

 constructor(
    @Inject('MQTT_CLIENT') private readonly client: ClientProxy,
    @InjectRepository(Setting) private SettingRepository: Repository<Setting>,
    @InjectRepository(Location)private LocationRepository: Repository<Location>,
    @InjectRepository(Type)private TypeRepository: Repository<Type>,
    @InjectRepository(Sensor) private SensorRepository: Repository<Sensor>,
    @InjectRepository(Group)private GroupRepository: Repository<Group>,
    @InjectRepository(Mqtt)private MqttRepository: Repository<Mqtt>,
    @InjectRepository(Api)private ApiRepository: Repository<Api>,
    @InjectRepository(DeviceType)private DeviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(Device)private DeviceRepository: Repository<Device>,
    @InjectRepository(Email)private EmailRepository: Repository<Email>,
    @InjectRepository(Host)private HostRepository: Repository<Host>,
    @InjectRepository(Influxdb)private InfluxdbRepository: Repository<Influxdb>,
    @InjectRepository(Line)private LineRepository: Repository<Line>,
    @InjectRepository(Nodered)private NoderedRepository: Repository<Nodered>,
    @InjectRepository(Schedule)private ScheduleRepository: Repository<Schedule>,
    @InjectRepository(Sms)private SmsRepository: Repository<Sms>,
    @InjectRepository(Token)private TokenRepository: Repository<Token>,
    @InjectRepository(scheduleDevice)private scheduleDeviceRepository: Repository<scheduleDevice>, 
    @InjectRepository(Deviceaction)private DeviceactionRepository: Repository<Deviceaction>,
    @InjectRepository(Deviceactionlog)private DeviceactionlogRepository: Repository<Deviceactionlog>,
    @InjectRepository(Deviceactionuser)private DeviceactionuserRepository: Repository<Deviceactionuser>,
    @InjectRepository(Devicealarmaction)private DevicealarmactionRepository: Repository<Devicealarmaction>,
    @InjectRepository(Telegram)private TelegramRepository: Repository<Telegram>,
    @InjectRepository(scheduleprocesslog) private scheduleprocesslogRepository: Repository<scheduleprocesslog>,
    @InjectRepository(alarmprocesslog) private alarmprocesslogRepository: Repository<alarmprocesslog>,
    @InjectRepository(mqttlog) private mqttlogRepository: Repository<mqttlog>,
  ){ 
      this.logger.log(' 🔌 MqttService initialized. ✅ In-memory state is ready. 🚀🚀🚀'); 
      this.connectionStatus = {
        connected: false,
        lastConnectionTime: null,
        error: null
      };
  }
  // tzString
  onModuleInit() { 
    this.IsonModuleInit(connectUrl_mqtt)
  }
  // tzString
  async IsonModuleInit(connectUrl_mqtt) {
    // โค้ดสร้างการเชื่อมต่อจะอยู่ในนี้...
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // สร้าง Client ID ที่ไม่ซ้ำกัน
    console.log(` ✅ mqtt_connectUrl_mqtt=>`+connectUrl_mqtt+` ✅ mqtt_clientId=>`+clientId); 
    this.mqttClient = connect(connectUrl_mqtt, {
      clientId,
      clean: true,
      connectTimeout: 10000,
      // username: 'your_username', // ถ้ามี
      // password: 'your_password', // ถ้ามี
      reconnectPeriod: 10000,
    });

    this.mqttClient.on('connect', () => {
      console.log(` ✅ mqtt_hostt=>`+connectUrl_mqtt); 
      console.log(' 🟢 Connected to  ✅  MQTT 🔌 Broker 🚀🚀🚀  Ready! 🚀🚀🚀');
    });

    this.mqttClient.on('error', (err) => {
      console.log(` ✅ mqtt_hostt=>`+connectUrl_mqtt);  
      console.error('❌ MQTT Connection 🔴 Error:', err);
    });

    // เมื่อมี message เข้ามา ให้ส่งข้อมูลเข้า stream 
    this.mqttClient.on('message', (topic, payload) => {
      console.log(` ✅ topic 📨 =>`); 
      console.info(topic); 
      console.log(` ✅ payload 📨 =>`); 
      console.info(payload); 
      this.messageStream.next({ topic, payload });
    });
  }
  // Successfully subscribed to 
  // ฟังก์ชันตรวจสอบสถานะการเชื่อมต่อ
  isMqttConnected(): boolean {
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
        } catch (error) {
          console.error(' ❌ Error checking MQTT connection:', error);
          return false;
        }
  } 
  /********mqtt**********/
  // เพิ่ม cache สำหรับ topic ที่เคย subscribe แล้ว
  private subscribedTopic = new Set<string>();
  private messageCached = new Map<string, any>();
  async getdevicedataDirecs(topics: string): Promise<any> {
          const topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCached.has(topic)) {
            return this.messageCached.get(topic);
          }
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopic.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopic.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) {
              throw new Error(` ❌ Failed to subscribe to topic "${topic}": ${err.message}`);
            }
          }
          try {
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCached.set(topic, result);
              return result;
          } catch (err) {
              if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                  throw new Error(` ❌ Timeout: No message received from topic "${topic}" within 10 seconds.`);
              } else {
                  throw new Error(` ❌ Error receiving message from topic "${topic}": ${err.message}`);
              }
          }
  }
  // เพิ่ม method สำหรับ clear cache เมื่อจำเป็น
  clearTopicCache(topic?: string) {
        if (topic) {
          const encodedTopic = encodeURI(topic);
          this.messageCached.delete(encodedTopic);
        } else {
          this.messageCached.clear();
        }
  } 
  // เพิ่ม method สำหรับ unsubscribe เมื่อไม่ใช้แล้ว
  unsubscribeTopic(topic: string) {
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
        // เริ่มต้นการเชื่อมต่อ
        await mqttService.initializeMqttClient('mqtt://localhost:1883');
        // ส่งข้อความ
        await mqttService.publishMessage('test/topic', { message: 'Hello MQTT' });
        // Subscribe และรับข้อความแบบ real-time
        const subscription = mqttService.subscribeToTopic('test/topic')
          .subscribe({
            next: (data) => {
              console.log('Received:', data);
            },
            error: (err) => {
              console.error('Error:', err);
            }
          });
        // ตรวจสอบสถานะ
        const status = mqttService.getDetailedConnectionStatus();
        console.log('Connection status:', status);
        // เมื่อไม่ต้องการใช้งานแล้ว
        subscription.unsubscribe();
        await mqttService.unsubscribeFromTopic('test/topic');
        await mqttService.disconnect();
  */
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  async initializeMqttClient(brokerUrl?: any): Promise<boolean> {
          // ใช้ brokerUrl ที่ระบุ หรือใช้ default
          const url = brokerUrl; 
          this.connectionPromise = new Promise((resolve, reject) => {
            try {
              const clientOptions: IClientOptions = {
                clientId: 'client_' + Math.random().toString(16).substr(2, 8),
                clean: true,
                connectTimeout: 4000,
                reconnectPeriod: 1000,
                keepalive: 60,
              };

              console.log(`Connecting to MQTT broker: ${url}`);
              this.mqttClient = connect(url, clientOptions);

              this.mqttClient.on('connect', () => {
                console.log('✅ Connected to MQTT broker');
                this.isConnected = true;
                resolve(true);
              });

              this.mqttClient.on('message', (topic: string, payload: Buffer) => {
                console.log(`📨 Received message from topic: ${topic}`);
                this.messageStream.next({ topic, payload });
                
                // อัพเดท cache ทันทีเมื่อได้รับ message ใหม่
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

            } catch (error) { 
              console.error('❌ Failed to initialize MQTT client:', error);
              this.connectionPromise = null;
              reject(error);
            }
          });
          if(this.isConnected ==true){
            var statusMqtt:any=1;
            var msg:any=' 🔌  Connected to MQTT broker';
          }else{
            var statusMqtt:any=0;
            var msg:any=' 🔌  Disconnected MQTT broker';
          }  
          var connectionPromise:any =this.connectionPromise; //true 
          
      // ถ้ากำลังเชื่อมต่ออยู่ ให้ return promise เดิม
      if (this.connectionPromise) {
          //return this.connectionPromise;
          var rt:any= { 
                      url:url,
                      status:statusMqtt,
                      msg, 
                      connected: true, 
                      isConnected: this.isConnected,
                      mqttClientConnected: this.mqttClient?.connected || false,
                      subscribedTopics: Array.from(this.subscribedTopics),
                      cacheSize: this.messageCached.size
              };   
          return rt;
      }else{
             var rt:any= { 
                      url:url,
                      status:statusMqtt,
                      msg, 
                      connected:false, 
                      isConnected: this.isConnected,
                      mqttClientConnected: this.mqttClient?.connected || false,
                      subscribedTopics: Array.from(this.subscribedTopics),
                      cacheSize: this.messageCached.size 
              };   
          return rt;
      }
     
  }
  private updateCache(topic: string, payload: Buffer): void {
    try {
      const payloadString = payload.toString();
      let result: any;

      if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
        try {
          result = JSON.parse(payloadString);
        } catch (e) {
          result = payloadString;
        }
      } else {
        result = payloadString;
      }

      this.messageCached.set(topic, result);
      console.log(`Cache updated for topic: ${topic}`);
    } catch (error) {
      console.error('Error updating cache for topic:', topic, error);
    }
  }
  async getMqttData(topic: string): Promise<any> {
    return await this.getDataTopicCacheDataMqtt(topic);
  } 
  // Method สำหรับส่ง message
  async publishMessage(topic: string, message: string | object): Promise<{ success: boolean; error?: string }> {
    if (!this.isConnected || !this.mqttClient?.connected) {
      const errorMsg = 'MQTT client is not connected';
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const payload = typeof message === 'object' ? JSON.stringify(message) : message;
      
      await new Promise<void>((resolve, reject) => {
        this.mqttClient.publish(topic, payload, { qos: 0, retain: false }, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Message published to topic: ${topic}`);
            resolve();
          }
        });
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to publish message:', error);
      return { success: false, error: error.message };
    }
  } 
  // Method สำหรับ subscribe หลาย topics พร้อมกัน
  async subscribeToMultipleTopics(topics: string[]): Promise<{ success: boolean; errors?: string[] }> {
    if (!this.isConnected) {
      return { success: false, errors: ['MQTT client is not connected'] };
    }

    const errors: string[] = [];
    const encodedTopics = topics.map(topic => encodeURI(topic));

    try {
      await new Promise<void>((resolve, reject) => {
        this.mqttClient.subscribe(encodedTopics, { qos: 0 }, (err) => {
          if (err) {
            reject(err);
          } else {
            encodedTopics.forEach(topic => {
              this.subscribedTopics.add(topic);
            });
            console.log(`Subscribed to topics: ${encodedTopics.join(', ')}`);
            resolve();
          }
        });
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to subscribe to topics:', error);
      return { success: false, errors: [error.message] };
    }
  }
  // Method สำหรับ unsubscribe
  unsubscribeFromTopic(topic: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const encodedTopic = encodeURI(topic);
      
      this.mqttClient.unsubscribe(encodedTopic, (err) => {
        if (err) {
          console.error(`Failed to unsubscribe from topic "${encodedTopic}":`, err);
          resolve({ success: false, error: err.message });
        } else {
          this.subscribedTopics.delete(encodedTopic);
          this.messageCached.delete(encodedTopic);
          console.log(`Unsubscribed from topic: ${encodedTopic}`);
          resolve({ success: true });
        }
      });
    });
  }
  // Method สำหรับตรวจสอบสถานะการเชื่อมต่อ
  getConnectionStatus(): boolean {
    return this.isConnected && this.mqttClient?.connected === true;
  }
  // Method สำหรับตรวจสอบการเชื่อมต่อแบบละเอียด
  async getDetailedConnectionStatus() {
    return {
      isConnected: this.isConnected,
      mqttClientConnected: this.mqttClient?.connected || false,
      subscribedTopics: Array.from(this.subscribedTopics),
      cacheSize: this.messageCached.size
    };
  }
  // Method สำหรับล้าง cache
  clearCache(): void {
    this.messageCached.clear();
    console.log('Cache cleared');
  }
  // Method สำหรับล้าง cache เฉพาะ topic
  clearTopicCached(topic: string): void { // แก้ชื่อ method จาก clearTopicCached เป็น clearTopicCache
    const encodedTopic = encodeURI(topic);
    const deleted = this.messageCached.delete(encodedTopic);
    if (deleted) {
      console.log(`Cache cleared for topic: ${encodedTopic}`);
    } else {
      console.log(`No cache found for topic: ${encodedTopic}`);
    }
  }
  // Method สำหรับดึงข้อมูลจาก cache
  async getCachedData(topic: any) {
    const encodedTopic = encodeURI(topic);
    return this.messageCached.get(encodedTopic);
  }
  // Method สำหรับตรวจสอบว่ามีข้อมูลใน cache หรือไม่
  hasCachedData(topic: string): boolean {
    const encodedTopic = encodeURI(topic);
    return this.messageCached.has(encodedTopic);
  }
  // Method สำหรับ disconnect
  async disconnect(): Promise<void> {
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
  // Method สำหรับ reconnect
  async reconnect(brokerUrl?: string): Promise<boolean> {
    if (this.mqttClient) {
      await this.disconnect();
    }
    return await this.initializeMqttClient(brokerUrl);
  }
  // Method สำหรับรอจนกว่าจะเชื่อมต่อสำเร็จ
  async waitForConnection(timeoutMs: number = 5000): Promise<boolean> {
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
  // Method สำหรับดึง MQTT client instance (สำหรับ advanced usage)
  getMqttClient(): MqttClient | null {
    return this.mqttClient || null;
  }
  // Method สำหรับดึง subscribed topics
  getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }
  // Method สำหรับดึง cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.messageCached.size,
      keys: Array.from(this.messageCached.keys())
    };
  } 
  // เพิ่ม method ใหม่ใน MqttService
  async subscribeToTopicWithResponse(topic: string, timeoutMs: number = 10000): Promise<any> {
      const encodedTopic = encodeURI(topic);
      
      // ตรวจสอบการเชื่อมต่อ
      if (!this.isConnected) {
          return { case: 0, status: 0, msg: 0,message: 'MQTT client is not connected' };
      }

      // ตรวจสอบ cache ก่อน
      if (this.messageCache.has(encodedTopic)) {
          return { case: 1, status: 1, msg: this.messageCache.get(encodedTopic) };
      }

      // Subscribe topic
      if (!this.subscribedTopics.has(encodedTopic)) {
          try {
              await new Promise<void>((resolve, reject) => {
                  this.mqttClient.subscribe(encodedTopic, { qos: 0 }, (err) => {
                      if (err) {
                          reject(err);
                      } else {
                          this.subscribedTopics.add(encodedTopic);
                          console.log(`Subscribed to topic: ${encodedTopic}`);
                          resolve();
                      }
                  });
              });
          } catch (error: any) {
              return { case: 2, status: 0, msg: 0,message: `Failed to subscribe: ${error.message}` };
          }
      }

      // รอรับ message
      return new Promise((resolve) => {
          const subscription = this.messageStream.pipe(
              filter((msg) => msg.topic === encodedTopic),
              map((msg) => {
                  const payloadString = msg.payload.toString();
                  let result: any;

                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                      try {
                          result = JSON.parse(payloadString);
                      } catch (e) {
                          result = payloadString;
                      }
                  } else {
                      result = payloadString;
                  }

                  // อัพเดท cache
                  this.messageCache.set(encodedTopic, result);
                  return result;
              })
          ).subscribe({
              next: (data) => {
                  subscription.unsubscribe();
                  resolve({ case: 3, status: 1, msg: data });
              },
              error: (error) => {
                  subscription.unsubscribe();
                  resolve({ case: 4, status: 0, msg: 0,message: `Error: ${error.message}` });
              }
          });

          // Timeout handling
          setTimeout(() => {
              subscription.unsubscribe();
              resolve({ case: 5, status: 0, msg: 0,message: `Timeout: No message received within ${timeoutMs}ms` });
          }, timeoutMs);
      });
  } 
  // Method ที่รองรับทั้งสองรูปแบบ
  subscribeToTopic(topic: string, returnAsPromise: boolean = false, timeoutMs: number = 10000): Observable<any> | Promise<any> {
      const encodedTopic = encodeURI(topic);
      
      if (!this.subscribedTopics.has(encodedTopic)) {
          this.mqttClient.subscribe(encodedTopic, { qos: 0 }, (err) => {
              if (err) {
                  console.error(`Failed to subscribe to topic "${encodedTopic}":`, err);
              } else {
                  this.subscribedTopics.add(encodedTopic);
                  console.log(`Subscribed to topic: ${encodedTopic}`);
              }
          });
      }

      const observable = this.messageStream.pipe(
          filter((msg) => msg.topic === encodedTopic),
          map((msg) => {
              const payloadString = msg.payload.toString();
              let result: any;

              if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                  try {
                      result = JSON.parse(payloadString);
                  } catch (e) {
                      result = payloadString;
                  }
              } else {
                  result = payloadString;
              }

              this.messageCache.set(encodedTopic, result);
              return result;
          })
      );

      // ถ้าต้องการรูปแบบ Promise
      if (returnAsPromise) {
          return new Promise((resolve, reject) => {
              const subscription = observable.subscribe({
                  next: (data) => {
                      subscription.unsubscribe();
                      resolve({ case: 1, status: 1, msg: data });
                  },
                  error: (error) => {
                      subscription.unsubscribe();
                      reject({ case: 0, status: 0, msg: 0,message: error.message });
                  }
              });

              setTimeout(() => {
                  subscription.unsubscribe();
                  reject({ case: 0, status: 0, msg: 0,message: `Timeout after ${timeoutMs}ms` });
              }, timeoutMs);
          });
      }

      // ถ้าต้องการรูปแบบ Observable
      return observable;
  }
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  async getDataTopics(topics: string): Promise<any> {
      const topic = encodeURI(topics);
      
      // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
      if (this.messageCache.has(topic)) { 
          console.log(`Returning cached data for topic: ${topic}`);
          return { 
              case: 1, 
              status: 1, 
              msg: this.messageCache.get(topic) 
          };
      }
      
      // ตรวจสอบการเชื่อมต่อ MQTT
      if (!this.isConnected || !this.mqttClient?.connected) {
          console.error(`MQTT client is not connected for topic: ${topic}`);
          return { 
              case: 0, 
              status: 0, 
              msg: 0,message: 'MQTT client is not connected' 
          };
      }

      // Subscribe เฉพาะ topic ใหม่
      if (!this.subscribedTopics.has(topic)) {
          try {
              console.log(`Subscribing to new topic: ${topic}`);
              await new Promise<void>((resolve, reject) => {
                  this.mqttClient.subscribe(topic, { qos: 0 }, (err) => {
                      if (err) {
                          console.error(`Subscription failed for topic ${topic}:`, err);
                          reject(err);
                      } else {
                          this.subscribedTopics.add(topic);
                          console.log(`Successfully subscribed to topic: ${topic}`);
                          resolve();
                      }
                  });
              });
          } catch (err: any) {
              console.error(`Subscription error for topic ${topic}:`, err);
              return { 
                  case: 2, 
                  status: 0, 
                  msg: 0,message: `Failed to subscribe to topic "${topic}": ${err.message}` 
              };
          }
      }

      try {
          console.log(`Waiting for message on topic: ${topic}`);
          
          // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
          const message = await firstValueFrom(
              this.messageStream.pipe(
                  filter((msg) => {
                      const matches = msg.topic === topic;
                      if (matches) {
                          console.log(`Found matching message for topic: ${topic}`);
                      }
                      return matches;
                  }),
                  bufferTime(100), // รวบรวม message ภายใน 100ms
                  filter(messages => {
                      const hasMessages = messages.length > 0;
                      if (hasMessages) {
                          console.log(`Received ${messages.length} messages for topic: ${topic}`);
                      }
                      return hasMessages;
                  }),
                  map(messages => {
                      console.log(`Taking first message from ${messages.length} messages`);
                      return messages[0]; // เอาแค่ message แรก
                  }),
                  take(1), // รับแค่ message เดียว
                  timeout({
                      each: 10000, // timeout 10 seconds
                      with: () => {
                          throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                      }
                  }),
                  catchError((error) => {
                      console.error(`Error in message stream for topic ${topic}:`, error);
                      throw error;
                  })
              )
          );

          console.log(`Processing message for topic: ${topic}`);
          let result: any;
          const payloadString = message.payload.toString();
          console.log(`Raw payload: ${payloadString}`);
          
          // พยายาม parse JSON แบบเร็ว
          if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
              try {
                  result = JSON.parse(payloadString);
                  console.log(`Parsed JSON successfully for topic: ${topic}`);
              } catch (e) {
                  console.warn(`JSON parse failed for topic ${topic}, using raw string`);
                  result = payloadString;
              }
          } else {
              result = payloadString;
              console.log(`Using raw string payload for topic: ${topic}`);
          }
          
          // cache ผลลัพธ์
          this.messageCache.set(topic, result);
          console.log(`Cached data for topic: ${topic}`);
          
          return { 
              case: 3, 
              status: 1, 
              msg: result 
          };

      } catch (err: any) {
          console.error(`Error receiving message for topic "${topic}":`, err);
          
          // ตรวจสอบประเภท error
          if (err.message?.includes('Timeout') || err.name === 'TimeoutError') {
              return { 
                  case: 4, 
                  status: 0, 
                  msg: 0,message: `Timeout: No message received from topic "${topic}" within 10 seconds.` 
              };
          } else {
              return { 
                  case: 5, 
                  status: 0, 
                  msg: 0,message: `Error receiving message from topic "${topic}": ${err.message}` 
              };
          }
      }
  }
  private async subscribeToTopicS(topic: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.mqttClient.subscribe(topic, (err) => {
        err ? reject(err) : resolve();
      });
    });
  } 
  private async waitForMessage(topic: string): Promise<any> {
    return firstValueFrom(
      this.messageStream.pipe(
        filter((msg) => msg.topic === topic),
        take(1),
        timeout(5000)
      )
    );
  }  
  private generateTimestamp(): string {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, '0');
    
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  } 
  private processPayload(payloadString: string): any {
    const trimmedPayload = payloadString.trim();
    
    if (trimmedPayload.startsWith('{') || trimmedPayload.startsWith('[')) {
      try {
        return JSON.parse(trimmedPayload);
      } catch (e) {
        return trimmedPayload;
      }
    }
    
    return trimmedPayload;
  } 
  private async cacheResult(key: string, result: any, timestamp: string, time: number): Promise<void> {
    const cacheData = { 
      keycache: key, 
      time: time, 
      data: { result, timestamp } 
    };
    
    try {
      await Cache.SetCacheData(cacheData);
    } catch (err) {
      console.error('Cache set error:', err);
    }
  } 
  private buildResponse(data: any): any {
    // สร้าง response object ที่ชัดเจนเพื่อป้องกัน recursion
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
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getMqttConnectionStatus(): MqttConnectionStatus {
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
            console.log(`isConnectedCli=>`+isConnectedCli);
            console.log(`isConnected=>`+isConnected);
            if(isConnected==true){
              var statusMqtt:any=1;
            }else{
              var statusMqtt:any=0;
            }
            console.log(`statusMqtt=>'`);
            console.info(statusMqtt); 
  }
  async checkConnectionStatusMqtt(){
          const isConnected:any = await this.isMqttConnected();
          const isConnectedCli:any= await this.mqttClient && this.mqttClient.connected;
          console.log(`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
          console.log(`isConnectedCli=>`+isConnectedCli);
          console.log(`isConnected=>`+isConnected);
          if(isConnected==true){
            var statusMqtt:any=1;
          }else{
            var statusMqtt:any=0;
          }
          console.log(`statusMqtt=>`+statusMqtt);
          return {
                  isConnected,
                  connected:isConnectedCli,
                  status:statusMqtt,
                  msg:`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`,
          };  

  }
  async checkConnectionStatusMqtts(UrlMqtt){
          const isConnect:any = await this.IsonModuleInit(UrlMqtt);
          const isConnected:any = await this.isMqttConnected();
          const isConnectedCli:any= await this.mqttClient && this.mqttClient.connected;
          console.log(`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
          console.log(`isConnectedCli=>`+isConnectedCli);
          console.log(`isConnected=>`+isConnected);
          if(isConnected==true){
            var statusMqtt:any=1;
          }else{
            var statusMqtt:any=0;
          }
          console.log(`statusMqtt=>`+statusMqtt);
          return {
                  url:UrlMqtt,
                  isConnect,
                  isConnected, 
                  connected:isConnectedCli,
                  status:statusMqtt,
                  msg:`MQTT Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`,
          };  

  }   
  async getDataTopicCacheDataMqtt(topics: string): Promise<any> {
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
    const topic = encodeURI(topics);
    const isConnected:any = await this.isMqttConnected();
    // ตรวจสอบการเชื่อมต่อ
    if (!isConnected) {
      return { case: 0, status: 0, data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0', msg: 0,message: 'MQTT client is not connected',time: timestamp ,timestamp:timestamp  }; 
    }

    // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
    if (this.messageCache.has(topic)) { 
      return { case: 1, status: 1,data: this.messageCache.get(topic), msg: 0,message: 'MQTT client is connected',time: timestamp ,timestamp:timestamp };
    }
    
    // Subscribe เฉพาะ topic ใหม่
    if (!this.subscribedTopics.has(topic)) {
      try {
        await new Promise<void>((resolve, reject) => {
          this.mqttClient.subscribe(topic, (err) => {
            if (err) {
              reject(err);
            } else {
              this.subscribedTopics.add(topic);
              console.log(`Subscribed to topic: ${topic}`);
              resolve();
            }
          });
        });
      } catch (err: any) {
        return { 
          case: 2, 
          status: 0, 
          data: null,
          msg: 0,message: `Failed to subscribe to topic "${topic}": ${err.message}` 
          ,time: timestamp ,timestamp:timestamp 
        };
      }
    }  

    try {
      // Real-time message receiving
      const message = await firstValueFrom(
        this.messageStream.pipe(
          filter((msg: MqttMessage) => msg.topic === topic),
          take(1),
          timeout(10000)
        )
      );
      
      // Process the message and update cache
      let result: any;
      const payloadString = message.payload.toString();
      
      // พยายาม parse JSON
      if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
        try {
          result = JSON.parse(payloadString);
        } catch (e) {
          result = payloadString;
        }
      } else {
        result = payloadString;
      }
      
      // อัพเดท cache
      this.messageCache.set(topic, result);
      return { case: 3, status: 1, msg: result ,time: timestamp ,timestamp:timestamp };
      
    } catch (err: any) {
      if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
        return { 
          case: 4, 
          status: 0, 
          msg: 0,message: `Timeout: No message received from topic "${topic}" within 10 seconds.` 
          ,time: timestamp ,timestamp:timestamp 
        };
      } else {
        return { 
          case: 5, 
          status: 0, 
          msg: 0,message: `Error receiving message from topic "${topic}": ${err.message}` 
          ,time: timestamp ,timestamp:timestamp 
        };
      }
    }
  } 
  async getdMqttdataTopics(topics: any): Promise<void> {
      console.log(`-----------------getdMqttdataTopics----------------START----------`);   
      var topic:any =encodeURI(topics);
      if(!topic){
                    var ResultData:any = {
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
              if(topic){
                // var dataObject = await this.getDataFromTopic(topic);   
                // return dataObject;  
                  const now = new Date();  
                  const pad = (num) => String(num).padStart(2, '0'); 
                  // จัดรูปแบบวันที่ YYYY-MM-DD
                  const datePart = [
                      now.getFullYear(),
                      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                      pad(now.getDate())
                  ].join('-'); 
                  // จัดรูปแบบเวลา HH:MM:SS
                  const timePart = [
                      pad(now.getHours()),
                      pad(now.getMinutes()),
                      pad(now.getSeconds())
                  ].join(':');
                // รวมวันที่และเวลาเข้าด้วยกัน
                var timestamp = datePart + ' ' + timePart; 
                console.log(`Requesting data from topic: ${topic}`);
                var keycache:any='getdMqttdataTopics_'+topic;
                var data:any =  await Cache.GetCacheData(keycache); 
                if (data) { 
                      var dataObject:any = data; 
                      var getdataFrom = 'Cache';
                }else if (!data) {  
                      var getdataFrom = 'MQTT';
                      var dataObject = await this.getDataFromTopic(topic); 
                      var InpuDatacache: any = {keycache: keycache,time: 3,data: dataObject};
                      await Cache.SetCacheData(InpuDatacache); 
                }  
                console.log(`-----------------getdMqttdataTopics----------------END-----getdata-----`+getdataFrom);   
            return dataObject; 
        }
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  }
  async getMqttTopicData(topics: string, deletecache: any): Promise<any> {
      const topic = encodeURI(topics);
      if (this.messageCache.has(topic)) {
        return { case: 1, status: 1, msg: this.messageCache.get(topic) };
      }
      if (!this.subscribedTopics.has(topic)) {
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              if (err) reject(err);
              else {
                this.subscribedTopics.add(topic);
                resolve();
              }
            });
          });
        } catch (err) {
          return { case: 2, status: 0, msg: 0,message: `Failed to subscribe to topic "${topic}": ${err.message}` };
        }
      }
      // Loop ดึงข้อมูลทุก 5 วินาที
      try {
        while (true) {
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              timeout(10000)
            )
          );
          let result: any;
          const payloadString = message.payload.toString();
          if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
            try {
              result = JSON.parse(payloadString);
            } catch (e) {
              result = payloadString;
            }
          } else {
            result = payloadString;
          }
          this.messageCache.set(topic, result);
          // ส่งข้อมูลกลับทุก 5 วินาที
          await new Promise(resolve => setTimeout(resolve, 5000));
          // return { case: 3, status: 1, msg: result }; // ส่งผลลัพธ์ทันที (ถ้าต้องกลับ loop ให้ใช้ callback หรือ event)
        }
      } catch (err) {
        return { case: 4, status: 0, msg: 0,message: `Timeout: No message received from topic "${topic}" within 10 seconds.` };
      }
  }
  async getMqttTopicDataRS(topics: any, deletecache: any): Promise<void> {
        console.log('------mqtt getMqttTopicDataRS------');
        var topic:any =encodeURI(topics);
        const now = new Date();  
        const pad = (num) => String(num).padStart(2, '0'); 
        // จัดรูปแบบวันที่ YYYY-MM-DD
        const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                pad(now.getDate())
            ].join('-'); 
        // จัดรูปแบบเวลา HH:MM:SS
        const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamp = datePart + ' ' + timePart; 
      console.log('-topic------'+topic);
      console.log('-now------'+now);
      console.log('----datePart---');
      console.info(datePart);
      console.log('---timePart---');
      console.info(timePart);
      console.log('--timestamp---');
      console.info(timestamp);
      console.log(`Requesting data from _topic: ${topic}`);
       if(!topic){
                    var ResultData:any = {
                          topic: topic,
                          data: [], 
                          timestamp: timestamp, 
                          status: 0,
                          message: `Please specify topic..`,
                          message_th: `กรุณาระบุ topic..`,
                        }; 
                    return ResultData; 
        }     
      var keycache :any='cache_mqtt_topic_'+md5(topic);
      try {  
                  console.log(`Requesting data from keycache: ${keycache}`);
                  var data:any= await Cache.GetCacheData(keycache); 
                  if (data) {   
                      return data; 
                  }else {
                        var mqttdata:any=await this.getDataFromTopic(topic);
                        console.log(`connectUrl_mqtt=>`); 
                        console.info(connectUrl_mqtt);   
                        console.log(`mqttdata-getDataFromTopic-topic==>`);
                        console.info(mqttdata);  
                        var parts:any=mqttdata.split(','); 
                        var dataObjects:any={
                                      topic: topic,   
                                      cache: 'cache', 
                                      status: 1,
                                      timestamp: timestamp, 
                                     // mqtt: mqttdata,  
                                      msg: mqttdata, 
                                      //rs: mqttdata, 
                                      data:parts
                                  };
                        var InpuDatacache: any = {keycache: keycache,time: 10,data: dataObjects};
                        await Cache.SetCacheData(InpuDatacache);   
                      return dataObjects; 
                  }  
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  }
  async _getMqttTopicData(topics: string,deletecache:any): Promise<any> {
          var topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {case:1,status:1,msg:this.messageCache.get(topic)};
          }
          // cache time
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) { 
              return {case:2,status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          } 
          // real time
          try {
                  //////////////////////////////////////////////////////////  
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {case:3,status:1,msg:result};
          } catch (err) {
                  return {case:4,status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
          }
  }   
  async getMqttTopicDataV1(topics: string,deletecache:any): Promise<any> {
          var topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {case:1,status:1,msg:this.messageCache.get(topic)};
          }
          // cache time
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) { 
              return {case:2,status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          } 
          // real time
          try {
                  //////////////////////////////////////////////////////////  
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {case:3,status:1,msg:result};
          } catch (err) {
                  return {case:4,status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
          }
  }  
  async getMqttTopicS(topics: string,deletecache:any): Promise<any> {
          var topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {case:1,status:1,msg:this.messageCache.get(topic)};
          }
          // cache time
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) { 
              return {case:2,status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          } 
          // real time
          try {
                  //////////////////////////////////////////////////////////
                  var kaycache_cache:any= 'getDataTopic_'+md5(topic); 
                  if(deletecache==1){
                      await Cache.DeleteCacheData(kaycache_cache); 
                  }
                  var rs:any =  await Cache.GetCacheData(kaycache_cache); 
                  if(!rs){ 
                        var rs:any =  await this.getDataTopicMqtt(topic); 
                        if(!rs.status || rs.status==0){ return rs; }
                        var InpuDatacache: any = {keycache: kaycache_cache,time: 10,data: rs};
                      await Cache.SetCacheData(InpuDatacache);  
                  }
                  //////////////////////////////////////////////////////////
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {case:3,status:1,msg:result,rs};
          } catch (err) {
                  return {case:4,status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
          }
  }  
  async getDataTopicCacheData(topics: string): Promise<any> {
          const topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {case:1,status:1,msg:this.messageCache.get(topic)};
          }
          // cache time
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) {
              // throw new Error(`Failed to subscribe to topic "${topic}": ${err.message}`); 
              return {case:2,status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          }
          /*
            
                        var topic_key:any= 'getDataTopic_'+md5(topic);
                        var kaycache_cache:any=topic_key;  
                        if(deletecache==1){
                            await Cache.DeleteCacheData(kaycache_cache); 
                        }
                        var rs:any =  await Cache.GetCacheData(kaycache_cache); 
                        if(!rs){ 
                             var rs:any =  await this.getDataTopicMqtt(topic); 
                             if(!rs.status || rs.status==0){ return rs; }
                             var InpuDatacache: any = {keycache: kaycache_cache,time: 3,data: rs};
                            await Cache.SetCacheData(InpuDatacache);  
                            return rs;
                        }else{ 
                             return rs;
                        } 
          */
          // real time
          try {
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {case:3,status:1,msg:result};
          } catch (err) {
                  return {case:4,status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
                  // if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                  //     throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                  // } else {
                  //     throw new Error(`Error receiving message from topic "${topic}": ${err.message}`);
                  // }
          }
  } 
  async getDataTopic2(topics: string): Promise<any> {
          const topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {case:1,status:1,msg:this.messageCache.get(topic)};
          }
          // cache time
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) {
              // throw new Error(`Failed to subscribe to topic "${topic}": ${err.message}`); 
              return {case:2,status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          }
          // real time
          try {
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {case:3,status:1,msg:result};
          } catch (err) {
                  return {case:4,status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
                  if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                      throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                  } else {
                      throw new Error(`Error receiving message from topic "${topic}": ${err.message}`);
                  }
          }
  }  
  async getDataTopicdevicemqtt(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!this.isMqttConnected()) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      const topic = encodeURI(topics);
      var time = 120; // ลดเหลือ 20วินาที
      var topic_key: any = 'getDataTopicdevicemqtt_'+topic;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        }
        var cached: any = await Cache.GetCacheData(topic_key); 
        if (cached !== null) { 
          return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time ,timestamp:cached.timestamp};
        } 
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          let result: any;
          const payloadString = message.payload.toString(); 
          
          try {
            result = JSON.parse(payloadString);
          } catch {
            result = payloadString;
          } 
          
          if (result) {  
            var results:any={ result,timestamp }
            var InpuDatacache: any = { keycache: topic_key, time: time, data: results };
            await Cache.SetCacheData(InpuDatacache);   
            return { case: 3, status: 1, msg: result, fromCache: false, time: time,timestamp:timestamp}; 
          }else{ 
            return { case: 4, status: 3, msg: result, fromCache: false, time: time ,timestamp:timestamp}; 
          }
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // รอ 1 วินาทีก่อน retry
          } else {
            return { case: 5, status: 0, msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, time: time ,timestamp:timestamp };
          }
        }
      }
  }
  async getDataTopic(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!this.isMqttConnected()) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      const topic = encodeURI(topics);
      var time = 120; // ลดเหลือ 20วินาที
      var topic_key: any = topic;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        }
        var cached: any = await Cache.GetCacheData(topic_key); 
        if (cached !== null) { 
          return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time ,timestamp:cached.timestamp};
        } 
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          let result: any;
          const payloadString = message.payload.toString(); 
          
          try {
            result = JSON.parse(payloadString);
          } catch {
            result = payloadString;
          } 
          
          if (result) {  
            var results:any={ result,timestamp }
            var InpuDatacache: any = { keycache: topic_key, time: time, data: results };
            await Cache.SetCacheData(InpuDatacache);   
            return { case: 3, status: 1, msg: result, fromCache: false, time: time,timestamp:timestamp}; 
          }else{ 
            return { case: 4, status: 3, msg: result, fromCache: false, time: time ,timestamp:timestamp}; 
          }
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // รอ 1 วินาทีก่อน retry
          } else {
            return { case: 5, status: 0, msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, time: time ,timestamp:timestamp };
          }
        }
      }
  }
  async getDataTopicPage(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!this.isMqttConnected()) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      const topic = encodeURI(topics);
      var time = 10; // ลดเหลือ 10 วินาที
      var topic_key: any = 'getData_Topic_Page_'+md5(topic);
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        }
        var cached: any = await Cache.GetCacheData(topic_key); 
        if (cached !== null) { 
          return { case: 1, status: 1, msg: cached.result, fromCache: true, time: time ,timestamp:cached.timestamp};
        } 
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          let result: any;
          const payloadString = message.payload.toString(); 
          
          try {
            result = JSON.parse(payloadString);
          } catch {
            result = payloadString;
          } 
          
          if (result) {  
            var results:any={ result,timestamp }
            var InpuDatacache: any = { keycache: topic_key, time: time, data: results };
            await Cache.SetCacheData(InpuDatacache);   
            return { case: 3, status: 1, msg: result, fromCache: false, time: time,timestamp:timestamp}; 
          }else{ 
            return { case: 4, status: 3, msg: result, fromCache: false, time: time ,timestamp:timestamp}; 
          }
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // รอ 1 วินาทีก่อน retry
          } else {
            return { case: 5, status: 0, msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, time: time ,timestamp:timestamp };
          }
        }
      }
  }
  async getMqttTopicPA(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
    const isConnected = await this.isMqttConnected();
    const timestamp = this.generateTimestamp();

    if (!isConnected) {
      return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
    }

    const topic = encodeURI(topics);
    const time = 10; // cache time in seconds
    const topic_key = 'getMqttTopicCA_' + topic;

    // Clear cache only on first attempt if requested
    if (deletecache == 1) {
      this.messageCache.delete(topic_key);
      await Cache.DeleteCacheData(topic_key); 
    }

    // Check cache first
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

        // Subscribe only if not subscribed before
        if (!this.subscribedTopics.has(topic)) {
          await this.subscribeToTopicS(topic);
          this.subscribedTopics.add(topic);
        }

        // Wait for message realtime with timeout 5 seconds
        const message = await this.waitForMessageWithTimeout(topic, 5000); // กำหนด timeout เร็วขึ้น

        const result = this.processPayload(message.payload.toString());

        if (result) {
          // Update cache in memory and persistent cache 
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
        } else {
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
      } catch (err) {
        console.log(`Attempt ${attempt} failed:`, err.message);

        if (attempt < retryCount) {
          await this.delay(1000);
        } else {
          return this.buildResponse({
            isConnected,
            case: 5,
            status: 0,
            msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`,
            time: time,
            timestamp: timestamp
          });
        }
      }
    }
  }
  waitForMessageWithTimeout(topic: string, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout waiting for message'));
      }, timeout);

      const onMessage = (message: any) => {
        if (message.topic === topic) {
          clearTimeout(timer);
          this.mqttClient.off('message', onMessage); // assumed mqttClient instance
          resolve(message);
        }
      };

      this.mqttClient.on('message', onMessage);
    });
  }
  async getMqttTopicPA1(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
    const isConnected = await this.isMqttConnected();
    // const timestamp = this.generateTimestamp();
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!this.isMqttConnected()) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
    
    if (!isConnected) {
      return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
    } 
    const topic = encodeURI(topics);
    const time = 45;
    const topic_key = 'getMqttTopicPA_'+topic; 
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
      
      // Clear cache only on first attempt if requested
      if (deletecache == 1 && attempt == 1) { 
        await Cache.DeleteCacheData(topic_key); 
      } 
      // Check cache
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
        // Subscribe to topic
        await this.subscribeToTopicS(topic); 
        // Wait for message with timeout
        const message = await this.waitForMessage(topic); 
        // Process payload
        const result = this.processPayload(message.payload.toString()); 
        // Cache and return result
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
        } else { 
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
        
      } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message);  
          if (attempt < retryCount) {
            await this.delay(1000);
          } else {
            return this.buildResponse({
              isConnected,
              case: 5, 
              status: 0, 
              msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, 
              time: time,
              timestamp: timestamp
            });
          }
      }
    }
  } 
  async getMqttTopic(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
    const isConnected = await this.isMqttConnected();
    const timestamp = this.generateTimestamp();
    
    if (!isConnected) {
      return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
    } 
    const topic = encodeURI(topics);
    const time = 3;
    const topic_key = 'getMqttTopicV1_'+topic; 
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
      
      // Clear cache only on first attempt if requested
      if (deletecache == 1 && attempt == 1) { 
        await Cache.DeleteCacheData(topic_key); 
      } 
      // Check cache
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
        // Subscribe to topic
        await this.subscribeToTopicS(topic); 
        // Wait for message with timeout
        const message = await this.waitForMessage(topic); 
        // Process payload
        const result = this.processPayload(message.payload.toString()); 
        // Cache and return result
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
        } else { 
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
        
      } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message);  
          if (attempt < retryCount) {
            await this.delay(1000);
          } else {
            return this.buildResponse({
              isConnected,
              case: 5, 
              status: 0, 
              msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, 
              time: time,
              timestamp: timestamp
            });
          }
      }
    }
  } 
  async getMqttTopicTest(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {

      var isConnected = await this.isMqttConnected();
      var now = new Date();
      var pad = (num: number) => String(num).padStart(2, '0');
      
      // Optimized timestamp generation
      var timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      
      if (!isConnected) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }

      var topic = encodeURI(topics); 
      var time = 5;
      var topic_key = 'Test_'+topic;
        
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        // Clear cache only on first attempt if requested
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        } 
        // Check cache
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
          // Subscribe to topic
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          // Wait for message with timeout
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          // Optimized payload processing
          const payloadString = message.payload.toString().trim();
          let result: any;
          
          // Fast JSON parse check
          if (payloadString.startsWith('{') || payloadString.startsWith('[')) {
            try {
              result = JSON.parse(payloadString);
            } catch (e) {
              result = payloadString;
            }
          } else {
            result = payloadString;
          }
          
          // Cache and return result
          if (result) {  
            const cacheData = { 
              keycache: topic_key, 
              time: time, 
              data: { result, timestamp } 
            };
            
            // Non-blocking cache set
            Cache.SetCacheData(cacheData).catch(err => 
              console.error('Cache set error:', err)
            );
            
            return {
              isConnected,
              case: 3, 
              status: 1, 
              msg: result, 
              fromCache: false, 
              time: time,
              timestamp: timestamp
            }; 
          } else { 
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
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            return {
              isConnected,
              case: 5, 
              status: 0, 
              msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, 
              time: time,
              timestamp: timestamp
            };
          }
        }
      }
  }
  async getMqttTopicSS(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var isConnected = await this.isMqttConnected();
      var now = new Date();
      var pad = (num: number) => String(num).padStart(2, '0');
      // Optimized timestamp generation
      var timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      if (!isConnected) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      var topic = encodeURI(topics);
      var time = 3; 
      var topic_key = topic;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        // Clear cache only on first attempt if requested
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        } 
        // Check cache
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
          // Subscribe to topic
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          // Wait for message with timeout
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          // Optimized payload processing
          const payloadString = message.payload.toString().trim();
          let result: any;
          
          // Fast JSON parse check
          if (payloadString.startsWith('{') || payloadString.startsWith('[')) {
            try {
              result = JSON.parse(payloadString);
            } catch (e) {
              result = payloadString;
            }
          } else {
            result = payloadString;
          }
          
          // Cache and return result
          if (result) {  
            const cacheData = { 
              keycache: topic_key, 
              time: time, 
              data: { result, timestamp } 
            };
            
            // Non-blocking cache set
            Cache.SetCacheData(cacheData).catch(err => 
              console.error('Cache set error:', err)
            );
            
            return {
              isConnected,
              case: 3, 
              status: 1, 
              msg: result, 
              fromCache: false, 
              time: time,
              timestamp: timestamp
            }; 
          } else { 
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
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            return {
              isConnected,
              case: 5, 
              status: 0, 
              msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, 
              time: time,
              timestamp: timestamp
            };
          }
        }
      }
  } 
  async _2_getMqttTopic(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var isConnected:any = await this.isMqttConnected();
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!isConnected) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      const topic = encodeURI(topics);
      var time = 3; // ลดเหลือ 20 วินาที
      var topic_key: any = topic;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        }
        var cached: any = await Cache.GetCacheData(topic_key); 
        if (cached !== null) { 
          return { isConnected,case: 1, status: 1, msg: cached.result, fromCache: true, time: time ,timestamp:cached.timestamp};
        } 
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          let result: any;
          const payloadString = message.payload.toString(); 
          // พยายาม parse JSON แบบเร็ว
          if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
              try {
                  result = JSON.parse(payloadString);
              } catch (e) {
                  result = payloadString;
              }
          } else {
              result = payloadString;
          }
          if (result) {  
            var results:any={ result,timestamp }
            var InpuDatacache: any = { keycache: topic_key, time: time, data: results };
            await Cache.SetCacheData(InpuDatacache);   
            return { isConnected,case: 3, status: 1, msg: result, fromCache: false, time: time,timestamp:timestamp}; 
          }else{ 
            return { isConnected,case: 4, status: 3, msg: result, fromCache: false, time: time ,timestamp:timestamp}; 
          }
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // รอ 1 วินาทีก่อน retry
          } else {
            return { isConnected,case: 5, status: 0, msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, time: time ,timestamp:timestamp };
          }
        }
      }
  } 
  async getMqttTopicSlow(topics: string, deletecache: any, retryCount: number = 2): Promise<any> {
      var isConnected:any = await this.isMqttConnected();
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
      if (!isConnected) {
        return { case: 0, status: 0, msg: 0,message: "MQTT client not connected" };
      }
      const topic = encodeURI(topics);
      var time = 3; // ลดเหลือ 20 วินาที
      var topic_key: any = topic;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        console.log(`🔄 Attempt ${attempt} for topic: ${topic}`);
        
        if (deletecache == 1 && attempt == 1) { 
          await Cache.DeleteCacheData(topic_key); 
        }
        var cached: any = await Cache.GetCacheData(topic_key); 
        if (cached !== null) { 
          return { isConnected,case: 1, status: 1, msg: cached.result, fromCache: true, time: time ,timestamp:cached.timestamp};
        } 
        try {
          await new Promise<void>((resolve, reject) => {
            this.mqttClient.subscribe(topic, (err) => {
              err ? reject(err) : resolve();
            });
          });
          
          const message = await firstValueFrom(
            this.messageStream.pipe(
              filter((msg) => msg.topic === topic),
              take(1),
              timeout(5000)
            )
          );
          
          let result: any;
          const payloadString = message.payload.toString(); 
          // พยายาม parse JSON แบบเร็ว
          if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
              try {
                  result = JSON.parse(payloadString);
              } catch (e) {
                  result = payloadString;
              }
          } else {
              result = payloadString;
          }
          if (result) {  
            var results:any={ result,timestamp }
            var InpuDatacache: any = { keycache: topic_key, time: time, data: results };
            await Cache.SetCacheData(InpuDatacache);   
            return { isConnected,case: 3, status: 1, msg: result, fromCache: false, time: time,timestamp:timestamp}; 
          }else{ 
            return { isConnected,case: 4, status: 3, msg: result, fromCache: false, time: time ,timestamp:timestamp}; 
          }
          
        } catch (err) {
          console.log(`Attempt ${attempt} failed:`, err.message); 
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // รอ 1 วินาทีก่อน retry
          } else {
            return { isConnected,case: 5, status: 0, msg: 0,message: `No message from "${topic}" after ${retryCount} attempts`, time: time ,timestamp:timestamp };
          }
        }
      }
  } 
  async getMqttTopicFast(topics: string): Promise<any> {
      var date:any= format.getCurrentDatenow();
      var timenow :any=  format.getCurrentTimenow();
      var now = new Date();  
      var pad = (num) => String(num).padStart(2, '0'); 
      var datePart = [now.getFullYear(),
                              pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                              pad(now.getDate())
                          ].join('-'); 
                          // จัดรูปแบบเวลา HH:MM:SS
      var timePart = [
                              pad(now.getHours()),
                              pad(now.getMinutes()),
                              pad(now.getSeconds())
                          ].join(':');
                        // รวมวันที่และเวลาเข้าด้วยกัน 

      var timestamp = datePart + ' ' + timePart; 
    const topic = encodeURI(topics);
    const isConnected:any = await this.isMqttConnected();
    // ตรวจสอบการเชื่อมต่อ
    if (!isConnected) {
      return { case: 0, status: 0, data: 'AIR1,10.00,0,0,0,0,0,0,0,0,0,0,0,0', msg: 0,message: 'MQTT client is not connected',time: timestamp ,timestamp:timestamp  }; 
    }

    // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
    if (this.messageCache.has(topic)) { 
      return { case: 1, status: 1,data: this.messageCache.get(topic), msg: 0,message: 'MQTT client is connected',time: timestamp ,timestamp:timestamp };
    }
    
    // Subscribe เฉพาะ topic ใหม่
    if (!this.subscribedTopics.has(topic)) {
      try {
        await new Promise<void>((resolve, reject) => {
          this.mqttClient.subscribe(topic, (err) => {
            if (err) {
              reject(err);
            } else {
              this.subscribedTopics.add(topic);
              console.log(`Subscribed to topic: ${topic}`);
              resolve();
            }
          });
        });
      } catch (err: any) {
        return { 
          case: 2, 
          status: 0, 
          data: null,
          msg: 0,message: `Failed to subscribe to topic "${topic}": ${err.message}` 
          ,time: timestamp ,timestamp:timestamp 
        };
      }
    }  

    try {
      // Real-time message receiving
      const message = await firstValueFrom(
        this.messageStream.pipe(
          filter((msg: MqttMessage) => msg.topic === topic),
          take(1),
          timeout(10000)
        )
      );
      
      // Process the message and update cache
      let result: any;
      const payloadString = message.payload.toString();
      
      // พยายาม parse JSON
      if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
        try {
          result = JSON.parse(payloadString);
        } catch (e) {
          result = payloadString;
        }
      } else {
        result = payloadString;
      }
      
      // อัพเดท cache
      this.messageCache.set(topic, result);
      return { case: 3, status: 1, msg: result ,time: timestamp ,timestamp:timestamp };
      
    } catch (err: any) {
      if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
        return { 
          case: 4, 
          status: 0, 
          msg: 0,message: `Timeout: No message received from topic "${topic}" within 10 seconds.` 
          ,time: timestamp ,timestamp:timestamp 
        };
      } else {
        return { 
          case: 5, 
          status: 0, 
          msg: 0,message: `Error receiving message from topic "${topic}": ${err.message}` 
          ,time: timestamp ,timestamp:timestamp 
        };
      }
    }
  }  
  async getDataTopicMqtt(topics: string): Promise<any> {
          const topic = encodeURI(topics);
          // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
          if (this.messageCache.has(topic)) { 
            return {status:1,msg:this.messageCache.get(topic)};
          }
          // Subscribe เฉพาะ topic ใหม่
          if (!this.subscribedTopics.has(topic)) {
            try {
              await new Promise<void>((resolve, reject) => {
                this.mqttClient.subscribe(topic, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.subscribedTopics.add(topic);
                    resolve();
                  }
                });
              });
            } catch (err) {
             // throw new Error(`Failed to subscribe to topic "${topic}": ${err.message}`); 
              return {status:0,msg:`Failed to subscribe to topic "${topic}": ${err.message}`};
            }
          }
          try {
                  // ใช้ bufferTime เพื่อรวบรวม message และลดการ process บ่อยๆ
                  const message = await firstValueFrom(
                    this.messageStream.pipe(
                      filter((msg) => msg.topic === topic),
                      bufferTime(100), // รวบรวม message ภายใน 100ms
                      filter(messages => messages.length > 0),
                      map(messages => messages[0]), // เอาแค่ message แรก
                      timeout(10000) // ลด timeout จาก 60s เป็น 10s
                    )
                  );
                  let result: any;
                  const payloadString = message.payload.toString();
                  // พยายาม parse JSON แบบเร็ว
                  if (payloadString.trim().startsWith('{') || payloadString.trim().startsWith('[')) {
                    try {
                      result = JSON.parse(payloadString);
                    } catch (e) {
                      result = payloadString;
                    }
                  } else {
                    result = payloadString;
                  }
                  // cache ผลลัพธ์
                  this.messageCache.set(topic, result); 
                  return {status:1,msg:result};
          } catch (err) {
                  return {status:0,msg:`Timeout: No message received from topic "${topic}" within 10 seconds.`};
                  // if (err.toString().includes('TimeoutError') || err.toString().includes('timeout')) {
                  //     throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
                  // } else {
                  //     throw new Error(`Error receiving message from topic "${topic}": ${err.message}`);
                  // }
          }
  } 
  async getDataTopicCache(topics: string,deletecache:any): Promise<any> {
                        const topic = encodeURI(topics);
                        var topic_key:any= 'topic_key_'+md5(topic);
                        var kaycache_cache:any=topic_key;  
                        if(deletecache==1){
                            await Cache.DeleteCacheData(kaycache_cache); 
                        }
                        var rs:any =  await Cache.GetCacheData(kaycache_cache); 
                        if(!rs){ 
                             var rs:any =  await this.getDataTopicMqtt(topic); 
                             if(!rs.status || rs.status==0){ return rs; }
                             var InpuDatacache: any = {keycache: kaycache_cache,time: 3,data: rs};
                            await Cache.SetCacheData(InpuDatacache);  
                            return rs;
                        }else{ 
                             return rs;
                        }  
                       
  } 
  async getDataFromTopics(topics: string): Promise<string> {
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
        
        const messageHandler = (receivedTopic: string, message: Buffer) => {
          if (receivedTopic === topic) {
            clearTimeout(timeoutId);
            this.mqttClient.unsubscribe(topic);
            this.mqttClient.removeListener('message', messageHandler); 
            // ใช้ .trim() ลบช่องว่าง开头และ结尾 + replace ลบช่องว่างทั้งหมด
             const messageString = message.toString().trim().replace(/\s+/g, '');
            // พยายาม parse JSON ถ้าล้มเหลวให้ใช้ string ตรงๆ
            try {
              const jsonData = JSON.parse(messageString);
              
              console.log(`---jsonData --- ${jsonData}`);
              const csvString = typeof jsonData === 'object' && jsonData !== null 
                ? Object.values(jsonData).join(',') 
                : messageString;
              // ลบช่องว่างทั้งหมดและส่งคืน
              resolve(csvString.replace(/\s+/g, ''));
            } catch {
              // ลบช่องว่างทั้งหมดจาก string ดั้งเดิม
              resolve(messageString.replace(/\s+/g, ''));
            }
          }
        };
        
        this.mqttClient.on('message', messageHandler);
      });
    });
  }
  async getDataFromTopicsOL(topics: string): Promise<string> {
    console.log(`-------------getDataFromTopic ----------------${topics}--------------------`);
    const topic = encodeURI(topics); 
    return new Promise((resolve,reject) => {
      // Subscribe
      this.mqttClient.subscribe(topic,(subscribeError) => {
        if (subscribeError) {
          return reject(subscribeError);
        }
        console.log(`Successfully subscribed to ${topic}`);
        // ตั้ง timeout 10 วินาที
        const timeoutId = setTimeout(() => {
          this.mqttClient.unsubscribe(topic);
          reject(new Error(`Timeout: No message from topic "${topic}"`));
        },10000);
        
        // Handler สำหรับ message
        const messageHandler = (receivedTopic: string,message: Buffer) => {
          if (receivedTopic === topic) {
            clearTimeout(timeoutId);
            this.mqttClient.unsubscribe(topic);
            this.mqttClient.removeListener('message',messageHandler); 
            try {
              // พยายามแปลงเป็น JSON ก่อน
              const jsonData = JSON.parse(message.toString());
              // ถ้าเป็น object ให้แปลงเป็น string แบบ CSV
              if (typeof jsonData === 'object' && jsonData !== null) {
                const csvString = Object.values(jsonData).join(',');
                resolve(csvString);
              } else {
                resolve(message.toString());
              }
            } catch {
              // ถ้าไม่ใช่ JSON ให้ใช้ message ตรงๆ
              resolve(message.toString());
            }
          }
        }; 
        this.mqttClient.on('message',messageHandler);
      });
    });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /*  
    ต้องการ ผลลัพธ์ 
    หรือ AIR2,33.92,1,1,1,0,0,1,0,0,1,0,1,0
    หรือ BAACTW01,28.63,0,0,0,0,0,0,1,1
    หรือ 31.9,3.0,27.0,6.0,2.0,1,1,1,1,0,0,1,1,0,1,1,1,1
  */  
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  async getDataFromTopic(topics: string): Promise<any> {
     console.log(`-------------getDataFromTopic ----------------${topics}--------------------`);
      const topic = encodeURI(topics);
      return new Promise((resolve, reject) => {
        // Subscribe
        this.mqttClient.subscribe(topic, (subscribeError) => {
          if (subscribeError) {
            return reject(subscribeError);
          }
          console.log(`Successfully subscribed to ${topic}`);
          // ตั้ง timeout
          const timeoutId = setTimeout(() => {
            this.mqttClient.unsubscribe(topic);
            reject(new Error(`Timeout: No message from topic "${topic}"`));
          }, 10000);
          // Handler สำหรับ message
          const messageHandler = (receivedTopic: string, message: Buffer) => {
            if (receivedTopic === topic) {
              clearTimeout(timeoutId);
              this.mqttClient.unsubscribe(topic);
              this.mqttClient.removeListener('message', messageHandler);
              
              try {
                resolve(JSON.parse(message.toString()));
              } catch {
                resolve(message.toString());
              }
            }
          };
          this.mqttClient.on('message', messageHandler);
        });
      });
  }
  async _getDataFromTopic(topics: string): Promise<any> {
      var topic: any = encodeURI(topics); 
      console.log(`------getDataFromTopic------`);
      console.log(`connectUrl_mqtt=>`); 
      console.info(connectUrl_mqtt);  
      console.log(`topic=>`); 
      console.info(topic);  
      // async await
      // สร้าง Promise สำหรับรับ message แรกจาก topic ที่ subscribe
        var messagePromise: any = new Promise((resolve, reject) => {
        this.mqttClient.subscribe(topic, (err) => {
          if (err) {
            return reject(err);
          }
        });
        var subscription = this.messageStream
          .pipe(
            filter((message) => message.topic === topic),
            first(),
            timeout(5000), // timeout 5 วินาที ตามที่เขียนไว้ใน comment
          )
          .subscribe({
            next: (message) => {
              this.mqttClient.unsubscribe(topic);
              subscription.unsubscribe();
              try {
                resolve(JSON.parse(message.payload.toString()));
                console.log(`try=>`+message.payload.toString()); 
              } catch (e) {
                console.log(`catch=>`+message.payload.toString()); 
                resolve(message.payload.toString());
              }
            },
            error: (err) => {
              this.mqttClient.unsubscribe(topic);
              subscription.unsubscribe();
              console.log(`mqtt_hostt=>`+connectUrl_mqtt); 
              console.log(`Timeout: No message received from topic "${topic}" within 5 seconds.`); 
              reject(new Error(`Timeout: No message received from topic "${topic}" within 5 seconds.`));
            },
          });
      });
      // ใช้ await รอการรับ message
      return await messagePromise; 

      /*
          {
                "status": 422,
                "topic": "BAACTW06/DATA",
                "timestamp": "2025-09-15 10:36:36",
                "error": {
                    "errorMessage": "Timeout: No message received from topic \"BAACTW06/DATA\" within 10 seconds.",
                    "ms": "Unprocessable Entity Exception"
                }
            }
      */

  } 
  publishs(topics: string, payload: any) {
    var topic:any =encodeURI(topics);
    var message = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString();
    console.log(`----publishs------`);
    console.log(`mqtt_hostt=>`+connectUrl_mqtt); 
    console.log(`topic=>`); console.info(topic);
    console.log(`message=>`); console.info(message);
    var rss:any = this.mqttClient.publish(topic, message);
    console.log(`rss=>`); console.info(rss); 
  }
  async publish(topics: string, payload: any): Promise<void> {
    console.log(`------publish------`); 
    var topic:any =encodeURI(topics);
    console.log(`topics=>`); 
    console.info(topics); 
    console.log(`payload=>`); 
    console.info(payload); 
    try {
      // client.emit() is for fire-and-forget messaging
      await firstValueFrom(this.client.emit(topic, payload));
      var InpuDatacache: any = { 
                    keycache: `${topic}`,
                    time: 86400,
                    data: payload,   
      };
      await Cache.SetCacheData(InpuDatacache); 
      const originalTopic = topic;
      // แทนที่ 'CONTROL' ด้วย 'DATA'
      const newTopic = originalTopic.replace('CONTROL', 'DATA'); 
      console.log(`originalTopic=>`); 
      console.info(originalTopic); 
      console.log(`newTopic=>`); 
      console.info(newTopic); 
      Cache.DeleteCacheData(newTopic); 
      console.log(`mqtt_hostt=>`+connectUrl_mqtt); 
      this.logger.log(`Published to topic "${topic}"`); 
    } catch (error) { 
      const originalTopic = topic;
      const newTopic = originalTopic.replace('CONTROL', 'DATA'); 
      this.logger.error(`newTopic "${newTopic}"`, error);
      this.logger.error(`connectUrl_mqtt "${connectUrl_mqtt}"`, error);
      this.logger.error(`Failed to publish to topic "${topic}"`, error);
    }
  }
  async updateData(topics: string, payload: any): Promise<void> {
        var topic:any =encodeURI(topics);
        //const dataString = JSON.stringify(payload);
        var InpuDatacache: any = { 
                    keycache: `topic-${topic}`,
                    time: 86400,
                    data: `mqtt:data:${topic}`,   
           };
        await Cache.SetCacheData(InpuDatacache); 
        this.logger.log(`Cached data for topic: ${topic}`);
  } 
  async getData(topics: string): Promise<any | null> {
        var topic:any =encodeURI(topics);
        const dataString =  await Cache.GetCacheData(topic); 
        if (!dataString) {
            return null;
        }
        return dataString;
  }
  async cacheMqttData(topics: string, payload: any): Promise<void> {
    var topic:any =encodeURI(topics);
    const cacheKey = `mqtt-data:${topic}`;
    await Cache.SetCacheData({ keycache: cacheKey, time: 86400, data: payload });
    this.logger.log(`Cached data for topic: ${topic}`);
  }
  async getDataFromCache(topics: string): Promise<any | null> {
    var topic:any =encodeURI(topics);
    const cacheKey = `mqtt-data:${topic}`;
    const data = await Cache.GetCacheData(cacheKey);
    return data;
  }
  updateLatestData(topics: string, payload: any): void {
    var topic:any =encodeURI(topics);
    this.latestData.set(topic, payload);
    this.logger.log(`In-memory state updated for topic: ${topic}`);
  }
  getLatestData(topics: string): any | null {
    var topic:any =encodeURI(topics);
    if (this.latestData.has(topic)) {
      this.logger.log(`Retrieved data from in-memory state for topic: ${topic}`);
      return this.latestData.get(topic);
    }
    this.logger.warn(`No data in memory for topic: ${topic}`);
    return null;
  }
  async devicecontrols(topics: string, message_mqtt: any,message_control:any): Promise<void> {
          var topic_mqtt:any =encodeURI(topics); 
          this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
          this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
          this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
           try {
               var Rt:any= await this.publish(topic_mqtt,message_mqtt); 
               this.logger.log(`devicecontrol publish Rt: ${Rt}`);
               var InpuDatacache: any = {keycache: `${topic_mqtt}`,data: message_mqtt};
               await Cache.SetCacheKey(InpuDatacache); 
               var today:any= format.getDayname();
               var getDaynameall:any= format.getDaynameall(); 
               const now = new Date();  
                 const pad = (num) => String(num).padStart(2, '0'); 
                 // จัดรูปแบบวันที่ YYYY-MM-DD
                 const datePart = [
                     now.getFullYear(),
                     pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                     pad(now.getDate())
                 ].join('-'); 
                 // จัดรูปแบบเวลา HH:MM:SS
                 const timePart = [
                     pad(now.getHours()),
                     pad(now.getMinutes()),
                     pad(now.getSeconds())
                 ].join(':');
               // รวมวันที่และเวลาเข้าด้วยกัน
               var timestamp = datePart + ' ' + timePart; 
               const originalTopic = topic_mqtt;
               // แทนที่ 'CONTROL' ด้วย 'DATA'
               const newTopic = originalTopic.replace('CONTROL', 'DATA');
               //var topicrs:any='topic_mqtt_'+newTopic; 
              this.logger.log(`devicecontrol newTopic: ${newTopic}`);
               Cache.DeleteCacheData(newTopic); 
               var GetCacheData =  await Cache.GetCacheData(newTopic); 
               if(GetCacheData){ 
                   Cache.DeleteCacheData(newTopic); 
               } 
               var mqttdata =  await Cache.GetCacheData(newTopic); 
               console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA'   
              if(message_control=='ON'){
                var  message_status:any=1;
              }else{
                var  message_status:any=0;
              } 
              console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA'   
            if(message_mqtt==1 || message_mqtt=='on' || message_mqtt=='ON' || message_mqtt=='a1' || message_mqtt=='a1' || message_mqtt=='b1' || message_mqtt=='c1' || message_mqtt=='d1'|| message_mqtt=='e1'|| message_mqtt=='f1'|| message_mqtt=='g1'){
                 var message_control:any='ON';
                 var  message_status:any=1;
              }else{
                var message_control:any='OFF';
                var  message_status:any=0;
              }
            var dataObject:any={
                                  timestamp:timestamp,
                                  device_1:message_status,
                                  device_status:message_mqtt, 
                                }; 
            var dataRs = await this.getDataFromTopic(newTopic);
            this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
            const parts =dataRs.split(','); 
            const getDataObject = parts; 
            var InpuDatacache: any = {keycache: `${newTopic}`,time: 3,data: getDataObject};
            await Cache.SetCacheData(InpuDatacache); 
            var ResultData:any={
                          statusCode: 200,
                          code: 200,
                          topic_mqtt: topic_mqtt,   
                          dataRs: dataRs, 
                          dataObject, 
                          message_status,
                          mqttdata:mqttdata,
                          today:today,
                          payload:getDataObject,
                          daynameall:getDaynameall,
                          mqtt_data_control: topic_mqtt,  
                          mqtt_dada_get: newTopic, 
                          status: message_status,
                          status_msg: dataObject,
                          message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                          message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                   };
                    this.logger.log(`devicecontrol ResultData: ${dataRs}`);
                    console.log(`devicecontrol ResultData`);console.info(ResultData);
              return ResultData; 
         } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                //  throw new UnprocessableEntityException({
                //      status: HttpStatus.UNPROCESSABLE_ENTITY,
                //      error: {
                //      errorMessage: err.message,
                //      },
                //  });
                var ResultDataerr:any={
                                        statusCode: 500,
                                        code: 500,
                                        message: err.message,
                                        errorMessage: err.message,
                                      }
                 return ResultDataerr; 
        }
  }
  async devicecontrol(topics: string, message_mqtt: any): Promise<void> {
          var topic_mqtt:any =encodeURI(topics); 
          this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
          this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
          this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
           try {
               var Rt:any= await this.publish(topic_mqtt,message_mqtt); 
               this.logger.log(`devicecontrol publish Rt: ${Rt}`);
               var InpuDatacache: any = {keycache: `${topic_mqtt}`,data: message_mqtt};
               await Cache.SetCacheKey(InpuDatacache); 
               var today:any= format.getDayname();
               var getDaynameall:any= format.getDaynameall(); 
               const now = new Date();  
                 const pad = (num) => String(num).padStart(2, '0'); 
                 // จัดรูปแบบวันที่ YYYY-MM-DD
                 const datePart = [
                     now.getFullYear(),
                     pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                     pad(now.getDate())
                 ].join('-'); 
                 // จัดรูปแบบเวลา HH:MM:SS
                 const timePart = [
                     pad(now.getHours()),
                     pad(now.getMinutes()),
                     pad(now.getSeconds())
                 ].join(':');
               // รวมวันที่และเวลาเข้าด้วยกัน
               var timestamp = datePart + ' ' + timePart; 
               const originalTopic = topic_mqtt;
               // แทนที่ 'CONTROL' ด้วย 'DATA'
               const newTopic = originalTopic.replace('CONTROL', 'DATA');
               //var topicrs:any='topic_mqtt_'+newTopic; 
              this.logger.log(`devicecontrol newTopic: ${newTopic}`);
               Cache.DeleteCacheData(newTopic); 
               var GetCacheData =  await Cache.GetCacheData(newTopic); 
               if(GetCacheData){ 
                   Cache.DeleteCacheData(newTopic); 
               } 
               var mqttdata =  await Cache.GetCacheData(newTopic); 
               console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA'   
              if(message_mqtt==1 || message_mqtt=='on' || message_mqtt=='ON' || message_mqtt=='a1' || message_mqtt=='a1' || message_mqtt=='b1' || message_mqtt=='c1' || message_mqtt=='d1'|| message_mqtt=='e1'|| message_mqtt=='f1'|| message_mqtt=='g1'){
                var message_control:any='ON';
                 var  message_status:any=1;
              }else{
                var message_control:any='OFF';
                var  message_status:any=0;
              }
            var dataObject:any={
                                  timestamp:timestamp,
                                  device_1:message_status,
                                  device_status:message_mqtt, 
                                }; 
            var dataRs = await this.getDataFromTopic(newTopic);
            this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
            const parts =dataRs.split(','); 
            const getDataObject = parts; 
            var InpuDatacache: any = {keycache: `${newTopic}`,time: 3,data: getDataObject};
            await Cache.SetCacheData(InpuDatacache);  
            var ResultData:any={
                          statusCode: 200,
                          code: 200,
                          topic_mqtt: topic_mqtt,   
                          dataRs: dataRs, 
                          dataObject, 
                          message_status,
                          mqttdata:mqttdata,
                          today:today,
                          payload:getDataObject,
                          daynameall:getDaynameall,
                          mqtt_data_control: topic_mqtt,  
                          mqtt_dada_get: newTopic, 
                          status: message_status,
                          status_msg: dataObject,
                          message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                          message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                   };
                    this.logger.log(`devicecontrol ResultData: ${dataRs}`);
                    console.log(`devicecontrol ResultData`);console.info(ResultData);
              return ResultData; 
         } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                //  throw new UnprocessableEntityException({
                //      status: HttpStatus.UNPROCESSABLE_ENTITY,
                //      error: {
                //      errorMessage: err.message,
                //      },
                //  });
                var ResultDataerr:any={
                                        statusCode: 500,
                                        code: 500,
                                        message: err.message,
                                        errorMessage: err.message,
                                      }
                 return ResultDataerr; 
        }
  }
  async devicecontrolV2(topics: string, message_mqtt: any): Promise<void> {
          var topic_mqtt:any =encodeURI(topics); 
          this.logger.log(`devicecontrol connectUrl_mqtt: ${connectUrl_mqtt}`);
          this.logger.log(`devicecontrol topic_mqtt: ${topic_mqtt}`);
          this.logger.log(`devicecontrol message_mqtt: ${message_mqtt}`);
           try {
               var Rt:any= await this.publish(topic_mqtt,message_mqtt); 
               this.logger.log(`devicecontrol publish Rt: ${Rt}`);
               var InpuDatacache: any = {keycache: `${topic_mqtt}`,data: message_mqtt};
               await Cache.SetCacheKey(InpuDatacache); 
               var today:any= format.getDayname();
               var getDaynameall:any= format.getDaynameall(); 
               const now = new Date();  
                 const pad = (num) => String(num).padStart(2, '0'); 
                 // จัดรูปแบบวันที่ YYYY-MM-DD
                 const datePart = [
                     now.getFullYear(),
                     pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                     pad(now.getDate())
                 ].join('-'); 
                 // จัดรูปแบบเวลา HH:MM:SS
                 const timePart = [
                     pad(now.getHours()),
                     pad(now.getMinutes()),
                     pad(now.getSeconds())
                 ].join(':');
               // รวมวันที่และเวลาเข้าด้วยกัน
               var timestamp = datePart + ' ' + timePart; 
               const originalTopic = topic_mqtt;
               // แทนที่ 'CONTROL' ด้วย 'DATA'
               const newTopic = originalTopic.replace('CONTROL', 'DATA');
               //var topicrs:any='topic_mqtt_'+newTopic; 
              this.logger.log(`devicecontrol newTopic: ${newTopic}`);
               Cache.DeleteCacheData(newTopic); 
               var GetCacheData =  await Cache.GetCacheData(newTopic); 
               if(GetCacheData){ 
                   Cache.DeleteCacheData(newTopic); 
               } 
               var mqttdata =  await Cache.GetCacheData(newTopic); 
               console.log(newTopic); // ผลลัพธ์: 'BAACTW02/DATA' 
               if(message_mqtt==0){
                   var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_1: 0, 
                                     device_status: 'off', 
                             }; 
     
               }else if(message_mqtt==1){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_1: 1, 
                                     device_status: 'on', 
                             }; 
                 
               }else if(message_mqtt==2){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 0, 
                                     device_status: 'off', 
                             }; 
                 
                 
               }else if(message_mqtt==3){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 1, 
                                     device_status: 'on', 
                             }; 
               }else if(message_mqtt==4){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 0, 
                                     device_status: 'off', 
                             }; 
                 
                 
               }else if(message_mqtt==5){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 1, 
                                     device_status: 'on', 
                             }; 
               }else if(message_mqtt==6){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 0, 
                                     device_status: 'off', 
                             }; 
                 
                 
               }else if(message_mqtt==7){
                 var dataObject:any={ 
                                     timestamp: timestamp,  
                                     device_2: 1, 
                                     device_status: 'on', 
                             }; 
               }   
                 var dataRs = await this.getDataFromTopic(newTopic);
                 this.logger.log(`devicecontrol getDataFromTopic dataRs: ${dataRs}`);
                 const parts =dataRs.split(','); 
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
            var InpuDatacache: any = {keycache: `${newTopic}`,time: 3,data: getDataObject};
            await Cache.SetCacheData(InpuDatacache); 
            var ResultData:any={
                          statusCode: 200,
                          code: 200,
                          topic_mqtt: topic_mqtt, 
                          Rt: Rt, 
                          dataRs: dataRs, 
                          dataObject: dataObject, 
                          mqttdata:mqttdata,
                          today:today,
                          payload:getDataObject,
                          daynameall:getDaynameall,
                          mqtt_data_control: topic_mqtt,  
                          mqtt_dada_get: newTopic, 
                          status: message_mqtt,
                          status_msg: dataObject['device_status'],
                          message: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                          message_th: `Topic: ${topic_mqtt} value: ${message_mqtt}`,
                   };
              return ResultData; 
         } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                //  throw new UnprocessableEntityException({
                //      status: HttpStatus.UNPROCESSABLE_ENTITY,
                //      error: {
                //      errorMessage: err.message,
                //      },
                //  });
                var ResultDataerr:any={
                                        statusCode: 500,
                                        code: 500,
                                        message: err.message,
                                        errorMessage: err.message,
                                      }
                 return ResultDataerr; 
        }
  }
  async getdevicedatatopics(topics: any): Promise<void> {
      var topic:any =encodeURI(topics);
      if(!topic){
                    var ResultData:any = {
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
              if(topic){
                  const now = new Date();  
                  const pad = (num) => String(num).padStart(2, '0'); 
                  // จัดรูปแบบวันที่ YYYY-MM-DD
                  const datePart = [
                      now.getFullYear(),
                      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                      pad(now.getDate())
                  ].join('-'); 
                  // จัดรูปแบบเวลา HH:MM:SS
                  const timePart = [
                      pad(now.getHours()),
                      pad(now.getMinutes()),
                      pad(now.getSeconds())
                  ].join(':');
                // รวมวันที่และเวลาเข้าด้วยกัน
                var timestamp = datePart + ' ' + timePart; 
                console.log(`Requesting data from topic: `+topic);
                var keycache:any='key_cache_air_'+md5(topic);
                var data:any =  await Cache.GetCacheData(topic); 
                  if (data) { 
                      var dataObjects:any = data; 
                      var getdataFrom = 'Cache';
                  }else if (!data) { 
                      
                      var data = await this.getDataFromTopic(keycache); 
                      if (!data) {  
                            var dataObjects:any=[]; 
                            return dataObjects; 
                            // var dataObjects:any=data; 
                            //   var ResultData:any = {
                            //       statusCode: 200,
                            //       code: 200,
                            //       topic: topic,
                            //       payload: dataObjects, 
                            //       mqttdata: {},    
                            //       status: 0,
                            //       message: `Please specify topic..`,
                            //       message_th: `กรุณาระบุ topic..`,
                            //     };
                            // return ResultData; 
                      } 
                      var getdataFrom = 'MQTT';
                      var mqttdata = await this.getDataFromTopic(topic);
                      if(!mqttdata){
                        var data:any=[];
                      } 
                      var data:any =  mqttdata; 
                      await Cache.SetCacheData({keycache: keycache,time: 3,data: mqttdata}); 
                  }     
               return data;  
        }
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  }
  async getdevicedata(topics: any): Promise<void> {
      var topic:any =encodeURI(topics);
      if(!topic){
                    var ResultData:any = {
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
              if(topic){
                  const now = new Date();  
                  const pad = (num) => String(num).padStart(2, '0'); 
                  // จัดรูปแบบวันที่ YYYY-MM-DD
                  const datePart = [
                      now.getFullYear(),
                      pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                      pad(now.getDate())
                  ].join('-'); 
                  // จัดรูปแบบเวลา HH:MM:SS
                  const timePart = [
                      pad(now.getHours()),
                      pad(now.getMinutes()),
                      pad(now.getSeconds())
                  ].join(':');
                // รวมวันที่และเวลาเข้าด้วยกัน
                var timestamp = datePart + ' ' + timePart; 
                console.log(`Requesting data from topic: ${topic}`);
                var data:any =  await Cache.GetCacheData(topic); 
                  if (data) { 
                      var dataObject:any = data; 
                      var getdataFrom = 'Cache';
                  }else if (!data) { 
                      var data = await this.getDataFromTopic(topic); 
                      if (!data) {  
                            var dataObjects:any={
                                      // เพิ่ม timestamp เป็น field แรก
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
                              var ResultData:any = {
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
                    //  var InpuDatacache: any = {keycache: `${topic}`,time: 3,data: data};
                    //  await Cache.SetCacheData(InpuDatacache); 
                      var getdataFrom = 'MQTT';
                      var mqttdata = await this.getDataFromTopic(topic);
                      const parts =mqttdata.split(','); 
                      const dataObject = {
                          // เพิ่ม timestamp เป็น field แรก
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
                      var InpuDatacache: any = {keycache: `${topic}`,time: 3,data: dataObject};
                      await Cache.SetCacheData(InpuDatacache); 
                  }    
                      // var mqttdata = await this.getDataFromTopic(topic);
                      // const parts =mqttdata.split(','); 
                      /**********แจ้งเตียน**********/  
                      var temperature:any = dataObject['temperature'];
                      var fan1:any = dataObject['fan1'];
                      var fan2:any = dataObject['fan2'];
                      var overFan1:any = dataObject['overFan1'];
                      var overFan2:any = dataObject['overFan2'];
                      if(overFan1==0){
                        /**********แจ้งเตียน**********/    
                        var fan1:any = dataObject['fan1'];           
                      }if(overFan2==0){
                        /**********แจ้งเตียน**********/  
                      } 
                      /**********แจ้งเตียน**********/  
                      var dataObjectRs: any = { 
                                mqtt_dada: topic, 
                                timestamp: timestamp, 
                                temperature: temperature,
                                contRelay1: dataObject['contRelay1'],
                                actRelay1:dataObject['actRelay1'],
                                fan1: fan1,
                                overFan1: overFan1,
                                contRelay2: dataObject['contRelay2'],
                                actRelay2: dataObject['actRelay2'],
                                fan2: fan2,
                                overFan2: overFan2,
                      }; 
                      var ResultData:any = {
                                statusCode: 200,
                                code: 200,
                                topic: topic,  
                                payload: dataObjectRs,  
                                mqttdata: mqttdata,   
                                getdataFrom:getdataFrom,
                                version: '1.0.1',
                                status: 1,
                                message: `Message successfully Get to topic: ${topic}`,
                                message_th: `Message successfully Get to topic: ${topic}`,
                              };
                    return ResultData; 
        }
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  } 
  async getdevicedataALL(topics: any): Promise<void> {
      var topic:any =encodeURI(topics);
      if(!topic){
                    var ResultData:any = {
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
                if(topic){
                    const now = new Date();  
                    const pad = (num) => String(num).padStart(2, '0'); 
                    // จัดรูปแบบวันที่ YYYY-MM-DD
                    const datePart = [
                        now.getFullYear(),
                        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                        pad(now.getDate())
                    ].join('-'); 
                    // จัดรูปแบบเวลา HH:MM:SS
                    const timePart = [
                        pad(now.getHours()),
                        pad(now.getMinutes()),
                        pad(now.getSeconds())
                    ].join(':');
                  // รวมวันที่และเวลาเข้าด้วยกัน
                  var timestamp = datePart + ' ' + timePart; 
                  var keycache:any='get_device_data_ALL'+topic;
                  console.log(`Requesting data from topic: ${topic}`);
                  var dataRS:any =  await Cache.GetCacheData(topic); 
                    if (dataRS) {  
                       var getdataFrom = 'Cache';
                    }else if (!dataRS) {   
                        var getdataFrom = 'MQTT';
                        var dataRS = await this.getDataFromTopic(topic); 
                        var InpuDatacache: any = {keycache: keycache,time: 3,data: dataRS};
                        await Cache.SetCacheData(InpuDatacache); 
                    }     
                    return dataRS; 
          }
        } catch (err) {
                  this.logger.error(`Error ${JSON.stringify(err)}`);
                  throw new UnprocessableEntityException({
                      status: HttpStatus.UNPROCESSABLE_ENTITY,
                      error: {
                      errorMessage: err.message,
                      ms: 'Unprocessable Entity Exception',
                      },
                  });
        }
  } 
  async getdevicedataMqttV11(topics: any): Promise<void> {
      var topic:any =encodeURI(topics);
      if(!topic){
                    var ResultData:any = {
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
                    // จัดรูปแบบวันที่ YYYY-MM-DD
                    const datePart = [
                        now.getFullYear(),
                        pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                        pad(now.getDate())
                    ].join('-'); 
                    // จัดรูปแบบเวลา HH:MM:SS
                    const timePart = [
                        pad(now.getHours()),
                        pad(now.getMinutes()),
                        pad(now.getSeconds())
                    ].join(':');
                  // รวมวันที่และเวลาเข้าด้วยกัน
            var timestamp = datePart + ' ' + timePart; 
            var keycache = 'getdevicedataMqtt_'+md5(topic); 
            if(topic){ 
                  console.log(`Requesting data from topic: ${keycache}`);
                  var data:any =  await Cache.GetCacheData(keycache); 
                  if (data) { 
                        var dataObject:any = data; 
                        var getdataFrom = 'Cache';
                  }else if (!data) { 
                        var data = await this.getDataFromTopic(topic); 
                        if (!data) {   
                              return data; 
                        }  
                        var data = await this.getDataFromTopic(topic);
                      // const parts =data.split(','); 
                        
                  }    
                  return data; 
             }
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     topic,
                     timestamp,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  }
  async getdevicedataMqtt(topics: any): Promise<any> {
      // 1. ตรวจสอบ topic ก่อนทำ encoding
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
      const timestamp = this.generateTimestamps(); // แยกฟังก์ชันสร้าง timestamp
      const keycache = `getdevicedataMqtt_${md5(topic)}`;
      try {
            console.log(`Requesting data from topic: ${keycache}`); 
            // 2. ตรวจสอบ cache ก่อน
            const cachedData = await Cache.GetCacheData(keycache);
            if (cachedData) {
              console.log('Cache hit');
              return  cachedData;
            } 
            console.log('Cache miss, fetching from MQTT'); 
            // 3. ดึงข้อมูลจาก MQTT (เรียกเพียงครั้งเดียว)
            const mqttData = await this.getDataFromTopic(topic); 
            if (!mqttData) {
              return  null;
            } 
            // 4. บันทึกข้อมูลลง cache (แบบ non-blocking)
            this.cacheDataAsyncs(keycache, mqttData); 
        return mqttData;
      } catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              topic,
              timestamp,
              error: {
                errorMessage: err.message,
                ms: 'Unprocessable Entity Exception',
              },
            });
      }
  }
  private generateTimestamps(): string {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      
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
  private async cacheDataAsyncs(keycache: string, data: any): Promise<void> {
      try { 
         await Cache.SetCacheData({keycache: keycache,time: 3,data: data}); 
        // ตั้งค่า TTL 5 นาที
      } catch (cacheError) {
        this.logger.error(`Cache set error: ${cacheError.message}`);
      }
  } 
  async getdevicedataAll(topics: any): Promise<void> {
        console.log('------mqtt getdevicedataAll------');
        var topic:any =encodeURI(topics);
        const now = new Date();  
        const pad = (num) => String(num).padStart(2, '0'); 
        // จัดรูปแบบวันที่ YYYY-MM-DD
        const datePart = [
                now.getFullYear(),
                pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
                pad(now.getDate())
            ].join('-'); 
        // จัดรูปแบบเวลา HH:MM:SS
        const timePart = [
                pad(now.getHours()),
                pad(now.getMinutes()),
                pad(now.getSeconds())
            ].join(':');
      // รวมวันที่และเวลาเข้าด้วยกัน
      var timestamp = datePart + ' ' + timePart; 
      console.log('-topic------'+topic);
      console.log('-now------'+now);
      console.log('-----datePart------');
      console.info(datePart);
      console.log('-----timePart------');
      console.info(timePart);
      console.log('-----timestamp------');
      console.info(timestamp);
      console.log(`Requesting data from topic: ${topic}`);
       if(!topic){
                    var ResultData:any = {
                          topic: topic,
                          data: [], 
                          timestamp: timestamp, 
                          status: 0,
                          message: `Please specify topic..`,
                          message_th: `กรุณาระบุ topic..`,
                        }; 
                    return ResultData; 
        }     
      var keycache :any=md5('mqtt_get_data_'+topic);
      try {  
                  console.log(`Requesting data from keycache: ${keycache}`);
                  var data:any= await Cache.GetCacheData(keycache); 
                  if (data) {   
                      return data; 
                  }else {
                        var mqttdata:any=await this.getDataFromTopic(topic);
                        console.log(`connectUrl_mqtt=>`); 
                        console.info(connectUrl_mqtt);   
                        console.log(`mqttdata-getDataFromTopic-topic==>`);
                        console.info(mqttdata);

                        var parts:any=mqttdata.split(','); 
                        var dataObjects:any={
                                      topic: topic,   
                                      cache: 'cache', 
                                      status: 1,
                                      timestamp: timestamp, 
                                      mqtt: mqttdata, 
                                      data:parts
                                  };
                        var InpuDatacache: any = {keycache: keycache,time: 3,data: dataObjects};
                        await Cache.SetCacheData(InpuDatacache);   
                      return dataObjects; 
                  }  
      } catch (err) {
                 this.logger.error(`Error ${JSON.stringify(err)}`);
                 throw new UnprocessableEntityException({
                     status: HttpStatus.UNPROCESSABLE_ENTITY,
                     error: {
                     errorMessage: err.message,
                     ms: 'Unprocessable Entity Exception',
                     },
                 });
      }
  }
  /********mqtt**********/ 
  async getdevicedataDirec(topics: string): Promise<any> {
    var topic:any =encodeURI(topics);
      // Subscribe ไปยัง topic ที่ต้องการ
      await new Promise<void>((resolve, reject) => {
        this.mqttClient.subscribe(topic, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
          
      try {
        // รอรับ message แรกจาก topic ที่ตรงกัน
        const message = await firstValueFrom(
          this.messageStream.pipe(
            filter((message) => message.topic === topic),
            timeout(10000)
          )
        );

        // เมื่อได้รับข้อมูลแล้ว ให้ unsubscribe ทันทีเพื่อไม่รับข้อมูลซ้ำ
        this.mqttClient.unsubscribe(topic);

        try {
          // ข้อมูลที่ได้รับจาก MQTT จะเป็น Buffer ต้องแปลงเป็น string ก่อน
          // และอาจจะต้อง parse เป็น JSON หากข้อมูลที่ส่งมาเป็น JSON string
          return JSON.parse(message.payload.toString());
        } catch (e) {
          // หาก parse JSON ไม่ได้ ให้ส่งกลับเป็น string ธรรมดา
          return message.payload.toString();
        }
      } catch (err) {
        this.mqttClient.unsubscribe(topic);
        throw new Error(`Timeout: No message received from topic "${topic}" within 10 seconds.`);
      }
  } 
  async mqtt_all(): Promise<Mqtt> {
      console.log(`=group_all=`); 
      try { 
        const query: any = await this.MqttRepository.createQueryBuilder('mq'); 
        query.select(['mq.*',]); 
        return await query.getRawMany(); 
      } catch (error) {
        var error1: any = JSON.stringify(error);
        var error2: any = JSON.parse(error1);
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            //args: { errorMessage: JSON.stringify(error) },
            args: { errorMessage: error2 },
          },
        });
      }
  }
  async mqtt_list_paginate(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
        var mqtt_id: any = dto.mqtt_id; 
        var mqtt_type_id: any = dto.mqtt_type_id; 
        var keyword: any = dto.keyword || '';
        var status: any = dto.status;
        /*****************/
        var createddate: any = dto.createddate;
        var updateddate: any = dto.updateddate;
        var sort: string = dto.sort;
        var page: number = dto.page || 1;
        var pageSize: number = dto.pageSize || 100;
        var isCount: number = dto.isCount || 0;
        const query: any = await this.MqttRepository.createQueryBuilder('mq');
        if (isCount == 1) {
         // var countRs: number = await query.getCount();
          var countRs: number = await query.select('COUNT(DISTINCT mq.mqtt_id)', 'cnt');
        } else { 
           
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
        query.leftJoin(
                          "sd_iot_device_type",
                          "t",
                          "t.type_id = mq.mqtt_type_id"
                      ); 
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
        }if (dto.secret) {
                query.andWhere('mq.secret=:secret', { secret: dto.secret });
        }if (dto.expire_in) {
                query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
        }if (dto.token) {
                query.andWhere('mq.token=:token', { token: dto.token });
        }if (dto.org) {
                query.andWhere('mq.org=:org', { org: dto.org });
        }if (dto.bucket) {
                query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
        }if (dto.envavorment) {
                query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
        }if (updateddate) {
          query.andWhere('mq.updateddate=:updateddate', { updateddate: updateddate });
        }
        if (status) {
          query.andWhere('mq.status=:status', { status: status });
        }
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        if (isCount == 1) {
          // let tempCounts:any = {};
          // tempCountt.count = countRs;
          // return tempCountt.count;
          var count: any = await query.getCount();
          let tempCounts: any = {};
          tempCounts.count = countRs;
          console.log(`count =>` + count);
          console.log(`tempCountt.count =>` + tempCounts.count);
          return count;
        } else {
          // Sorting logic
          if (sort) {
            const sortResult = convertSortInput(sort);
            if (sortResult === false) {
              throw new BadRequestException(`Invalid sort option.`);
            }
            const { sortField, sortOrder } = sortResult; 
          console.log(`sort=`);
          console.info(sort);
          console.log(`sortField=`+sortField);
          console.log(`sortOrder=`+sortOrder);
          console.log(`sortResult=`);
          console.info(sortResult); 
          if(sortOrder=='ASC' || sortOrder=='asc'){
            var sortOrders:any ='ASC';
          }else if(sortOrder=='DESC' || sortOrder=='desc'){
            var sortOrders:any ='DESC';
          }else{
            var sortOrders:any ='ASC';
          }
            query.orderBy(
              `mq.${sortField}`,
              sortOrders.toUpperCase(),
            );
          } else {
            // Default sorting
            query.orderBy(`mq.mqtt_id `, 'ASC');
          }
          query.limit(pageSize);
          query.offset(pageSize * (page - 1));
          return await query.getRawMany();
        }
      } catch (error) {
        var error1: any = JSON.stringify(error);
        var error2: any = JSON.parse(error1);
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            //args: { errorMessage: JSON.stringify(error) },
            args: { errorMessage: error2 },
          },
        });
      }
  }
  async mqtt_list_paginate_active(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
            // var mqtt_id: any = dto.mqtt_id; 
            // var mqtt_type_id: any = dto.mqtt_type_id; 
            // var keyword: any = dto.keyword || '';
            // var status: any = dto.status; 
            // var createddate: any = dto.createddate;
            // var updateddate: any = dto.updateddate;
            // var sort: string = dto.sort;
            const query: any = await this.MqttRepository.createQueryBuilder('mq');
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
            query.leftJoin(
                              "sd_iot_device_type",
                              "t",
                              "t.type_id = mq.mqtt_type_id"
                          ); 
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
            }if (dto.secret) {
                    query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }if (dto.expire_in) {
                    query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }if (dto.token) {
                    query.andWhere('mq.token=:token', { token: dto.token });
            }if (dto.org) {
                    query.andWhere('mq.org=:org', { org: dto.org });
            }if (dto.bucket) {
                    query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }if (dto.envavorment) {
                    query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }if (dto.updateddate) {
              query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }if (dto.status) {
               query.andWhere('mq.status=:status', { status: dto.status });
            } 
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql(); 
            if (dto.sort) {
                const sortResult = convertSortInput(dto.sort);
                if (sortResult === false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult; 
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `mq.${sortField}`,
                  sortOrders.toUpperCase(),
                );
            } else {
                // Default sorting
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
          return await query.getRawMany();
      } catch (error) {
          var error1: any = JSON.stringify(error);
          var error2: any = JSON.parse(error1);
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              //args: { errorMessage: JSON.stringify(error) },
              args: { errorMessage: error2 },
            },
          });
      }
  }
  async mqtt_list_paginate_active_air(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
            if(!dto.location_id){
              var location_id :any =5;
            }else{
               var location_id :any =dto.location_id;
            } 
            const query: any = await this.MqttRepository.createQueryBuilder('mq');
            query.select([   
                  'mq.*',  
                  't.type_name AS type_name', 
                  'l.location_id AS location_id', 
                  'l.location_name AS location_name',          
            ]).distinct(true);
             query.innerJoin(
                              "sd_iot_location",
                              "l",
                              "l.location_id = mq.location_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device_type",
                              "t",
                              "t.type_id = mq.mqtt_type_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device",
                              "d",
                              "d.bucket = mq.bucket"
                          ); 
            query.where('1=1');
            if (dto.keyword) {
              query.andWhere('mq.mqtt_name like :mqtt_name', {
                name: dto.keyword ? `%${dto.keyword}%` : '%',
              });
            } 
            query.andWhere('mq.location_id=:location_id', { location_id: location_id});
            if (dto.mqtt_id) {
              query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
              query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
              query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }if (dto.secret) {
                    query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }if (dto.expire_in) {
                    query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }if (dto.token) {
                    query.andWhere('mq.token=:token', { token: dto.token });
            }if (dto.org) {
                    query.andWhere('mq.org=:org', { org: dto.org });
            }if (dto.bucket) {
                    query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }if (dto.envavorment) {
                    query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }if (dto.updateddate) {
              query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }if (dto.status) {
               query.andWhere('mq.status=:status', { status: dto.status });
            } 
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql(); 
            if (dto.sort) {
                const sortResult = convertSortInput(dto.sort);
                if (sortResult === false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult; 
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `mq.${sortField}`,
                  sortOrders.toUpperCase(),
                );
            } else {
                // Default sorting
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
          return await query.getRawMany();
      } catch (error) {
          var error1: any = JSON.stringify(error);
          var error2: any = JSON.parse(error1);
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              //args: { errorMessage: JSON.stringify(error) },
              args: { errorMessage: error2 },
            },
          });
      }
  }
  async mqtt_list_paginate_active_fan_app(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
            if(!dto.location_id){
              var location_id :any =5;
            }else{
               var location_id :any =dto.location_id;
            } 
            const query: any = await this.MqttRepository.createQueryBuilder('mq');
            query.select([   
                  'mq.*',  
                  't.type_name AS type_name', 
                  'l.location_id AS location_id', 
                  'l.location_name AS location_name',          
            ]).distinct(true);
             query.innerJoin(
                              "sd_iot_location",
                              "l",
                              "l.location_id = mq.location_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device_type",
                              "t",
                              "t.type_id = mq.mqtt_type_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device",
                              "d",
                              "d.bucket = mq.bucket"
                          ); 
            query.where('1=1');
            if (dto.keyword) {
              query.andWhere('mq.mqtt_name like :mqtt_name', {
                name: dto.keyword ? `%${dto.keyword}%` : '%',
              });
            } 
            query.andWhere('mq.location_id=:location_id', { location_id: location_id});
            if (dto.mqtt_id) {
              query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
              query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
              query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }if (dto.secret) {
                    query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }if (dto.expire_in) {
                    query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }if (dto.token) {
                    query.andWhere('mq.token=:token', { token: dto.token });
            }if (dto.org) {
                    query.andWhere('mq.org=:org', { org: dto.org });
            }if (dto.bucket) {
                    query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }if (dto.envavorment) {
                    query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }if (dto.updateddate) {
              query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }if (dto.status) {
               query.andWhere('mq.status=:status', { status: dto.status });
            } 
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql(); 
            if (dto.sort) {
                const sortResult = convertSortInput(dto.sort);
                if (sortResult === false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult; 
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `mq.${sortField}`,
                  sortOrders.toUpperCase(),
                );
            } else {
                // Default sorting
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
          return await query.getRawMany();
      } catch (error) {
          var error1: any = JSON.stringify(error);
          var error2: any = JSON.parse(error1);
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              //args: { errorMessage: JSON.stringify(error) },
              args: { errorMessage: error2 },
            },
          });
      }
  }
  async mqtt_list_paginate_active_fan(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
            // var mqtt_id: any = dto.mqtt_id; 
            // var mqtt_type_id: any = dto.mqtt_type_id; 
            // var keyword: any = dto.keyword || '';
            // var status: any = dto.status; 
            // var createddate: any = dto.createddate;
            // var updateddate: any = dto.updateddate;
            // var sort: string = dto.sort;
            /*
                SELECT  
                  "mq".*, 
                  "t"."type_name" AS type_name, 
                  "l"."location_id" AS location_id, 
                  "l"."location_name" AS location_name 
                  FROM  "public"."sd_iot_mqtt" "mq" 
                  INNER JOIN "public"."sd_iot_location" "l" ON "l"."location_id" = "mq"."location_id" 
                  INNER JOIN "public"."sd_iot_device_type" "t" ON "t"."type_id" = "mq"."mqtt_type_id" 
                  WHERE 1 = 1  AND "mq"."location_id" =1 
                  AND "mq"."status" = 1
                  AND "mq"."bucket" = 'BAACTW05'
                  ORDER BY "mq"."mqtt_id" ASC  
            */
            /*
                  SELECT distinct "mq".*, 
                  "t"."type_name" AS type_name, 
                  "l"."location_id" AS location_id, 
                  "l"."location_name" AS location_name 
                  FROM  "public"."sd_iot_mqtt" "mq" 
                  INNER JOIN "public"."sd_iot_location" "l" ON "l"."location_id" = "mq"."location_id" 
                  INNER JOIN "public"."sd_iot_device_type" "t" ON "t"."type_id" = "mq"."mqtt_type_id" 
                  INNER JOIN "public"."sd_iot_device" "d" ON "d"."bucket" = "mq"."bucket" 
                  WHERE 1 = 1  AND "mq"."location_id" =1 
                  AND "mq"."status" = 1
                  ORDER BY "mq"."mqtt_id" ASC  
           */
            var location_id :any =1;
            const query: any = await this.MqttRepository.createQueryBuilder('mq');
            query.select([   
                  'mq.*',  
                  't.type_name AS type_name', 
                  'l.location_id AS location_id', 
                  'l.location_name AS location_name',          
            ]).distinct(true);
             query.innerJoin(
                              "sd_iot_location",
                              "l",
                              "l.location_id = mq.location_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device_type",
                              "t",
                              "t.type_id = mq.mqtt_type_id"
                          ); 
            query.innerJoin(
                              "sd_iot_device",
                              "d",
                              "d.bucket = mq.bucket"
                          ); 
            query.where('1=1');
            if (dto.keyword) {
              query.andWhere('mq.mqtt_name like :mqtt_name', {
                name: dto.keyword ? `%${dto.keyword}%` : '%',
              });
            } 
            query.andWhere('mq.location_id=:location_id', { location_id: location_id});
            if (dto.mqtt_id) {
              query.andWhere('mq.mqtt_id=:mqtt_id', { mqtt_id: dto.mqtt_id });
            }
            if (dto.mqtt_type_id) {
              query.andWhere('mq.mqtt_type_id=:mqtt_type_id', { mqtt_type_id: dto.mqtt_type_id });
            }
            if (dto.createddate) {
              query.andWhere('mq.createddate=:createddate', { createddate: dto.createddate });
            }if (dto.secret) {
                    query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }if (dto.expire_in) {
                    query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }if (dto.token) {
                    query.andWhere('mq.token=:token', { token: dto.token });
            }if (dto.org) {
                    query.andWhere('mq.org=:org', { org: dto.org });
            }if (dto.bucket) {
                    query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }if (dto.envavorment) {
                    query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }if (dto.updateddate) {
              query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }if (dto.status) {
               query.andWhere('mq.status=:status', { status: dto.status });
            } 
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql(); 
            if (dto.sort) {
                const sortResult = convertSortInput(dto.sort);
                if (sortResult === false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult; 
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `mq.${sortField}`,
                  sortOrders.toUpperCase(),
                );
            } else {
                // Default sorting
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
          return await query.getRawMany();
      } catch (error) {
          var error1: any = JSON.stringify(error);
          var error2: any = JSON.parse(error1);
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              //args: { errorMessage: JSON.stringify(error) },
              args: { errorMessage: error2 },
            },
          });
      }
  }
  /********mqtt**********/
  async mqtt_list_paginate_all_data(dto: any): Promise<Mqtt> {
      console.log(`type_list_paginate dto=`);
      console.info(dto);
      try { 
            // var mqtt_id: any = dto.mqtt_id; 
            // var mqtt_type_id: any = dto.mqtt_type_id; 
            // var keyword: any = dto.keyword || '';
            // var status: any = dto.status; 
            // var createddate: any = dto.createddate;
            // var updateddate: any = dto.updateddate;
            // var sort: string = dto.sort;
            const query: any = await this.MqttRepository.createQueryBuilder('mq');
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
            query.leftJoin(
                              "sd_iot_device_type",
                              "t",
                              "t.type_id = mq.mqtt_type_id"
                          ); 
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
            }if (dto.secret) {
                    query.andWhere('mq.secret=:secret', { secret: dto.secret });
            }if (dto.expire_in) {
                    query.andWhere('mq.expire_in=:expire_in', { expire_in: dto.expire_in });
            }if (dto.token) {
                    query.andWhere('mq.token=:token', { token: dto.token });
            }if (dto.org) {
                    query.andWhere('mq.org=:org', { org: dto.org });
            }if (dto.bucket) {
                    query.andWhere('mq.bucket=:bucket', { bucket: dto.bucket });
            }if (dto.envavorment) {
                    query.andWhere('mq.envavorment=:envavorment', { envavorment: dto.envavorment });
            }if (dto.updateddate) {
              query.andWhere('mq.updateddate=:updateddate', { updateddate: dto.updateddate });
            }if (dto.status) {
               query.andWhere('mq.status=:status', { status: dto.status });
            } 
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql(); 
            if (dto.sort) {
                const sortResult = convertSortInput(dto.sort);
                if (sortResult === false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult; 
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `mq.${sortField}`,
                  sortOrders.toUpperCase(),
                );
            } else {
                // Default sorting
                query.orderBy(`mq.mqtt_id `, 'ASC');
            }
          return await query.getRawMany();
      } catch (error) {
          var error1: any = JSON.stringify(error);
          var error2: any = JSON.parse(error1);
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              //args: { errorMessage: JSON.stringify(error) },
              args: { errorMessage: error2 },
            },
          });
      }
  }
  async create_mqttlogRepository(dto: any): Promise<mqttlog> {
            // console.log('create_airwarning');console.info(dto);   
            const result: any = await this.mqttlogRepository.save(
              this.mqttlogRepository.create(dto),
            );
            return result;
  }
  async mqttlog_paginate(dto: any): Promise<mqttlog>{
      console.log(`dto=>`);
      console.info(dto);
      try { 
        var keyword: any = dto.keyword || '';
        var status: any = dto.status;
        /*****************/
        var sort: string = dto.sort;
        var page: number = dto.page || 1;
        var pageSize: number = dto.pageSize || 1000;
        var isCount: number = dto.isCount || 0;
        const query: any = await this.mqttlogRepository.createQueryBuilder('a');
        if (isCount == 1) {
          //var countRs: number = await query.getCount(); 
          var countRs: number = await query.select('COUNT(DISTINCT a.id)', 'cnt');
        } else {   
          query.select(['a.*']);
        } 
        query.leftJoin(
                          "sd_iot_device",
                          "d",
                          "d.device_id= l.device_id"
                      );     
        query.where('1=1');
        if (dto.keyword ) {
              query.andWhere('a.name like :name', {name: keyword ? `%${dto.keyword }%` : '%',});
        }if (dto.device_name ) {
              query.andWhere('a.device_name like :device_name', {device_name: dto.device_name? `%${dto.device_name }%` : '%',});
        }if (dto.message ) {
              query.andWhere('a.msg like :msg', {msg: dto.message? `%${dto.message }%` : '%',});
        }if (dto.statusmqtt) {
              query.andWhere('a.statusmqtt =:statusmqtt', { statusmqtt: dto.statusmqtt });
        }if (dto.device_id) {
              query.andWhere('a.device_id =:device_id', { device_id: dto.device_id });
        }if (dto.type_id) {
              query.andWhere('a.type_id =:type_id', { type_id: dto.type_id });
        }if (dto.date) {
              query.andWhere('a.date=:date', { date: dto.date});
        }if (dto.time) {
             query.andWhere('a.time=:time', { time: dto.time});
        }if (dto.status) {
             query.andWhere('a.status=:status', { status: dto.status});
        } 
        // เงื่อนไข BETWEEN createddate
        if (dto.start && dto.end) {
            query.andWhere('a.createddate BETWEEN :startDate AND :endDate', {
              startDate: dto.start,
              endDate: dto.end,
            });
        } else if (dto.start) {
            query.andWhere('a.createddate >= :startDate', { startDate: dto.start });
        } else if (dto.end) {
            query.andWhere('a.createddate <= :endDate', { endDate: dto.end });
        } 
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        if (isCount == 1) {
              // let tempCounts:any = {};
              // tempCountt.count = countRs;
              // return tempCountt.count;
              var count: any = await query.getCount();
              let tempCounts: any = {};
              tempCounts.count = countRs;
              console.log(`count =>` + count);
              console.log(`tempCountt.count =>` + tempCounts.count);
              return count;
        } else {
          // Sorting logic
          if (sort) {
                const sortResult:any = convertSortInput(sort);
                if (sortResult == false) {
                  throw new BadRequestException(`Invalid sort option.`);
                }
                const { sortField, sortOrder } = sortResult;
                console.log(`sort=`);
                console.info(sort);
                console.log(`sortField=`+sortField);
                console.log(`sortOrder=`+sortOrder);
                console.log(`sortResult=`);
                console.info(sortResult); 
                if(sortOrder=='ASC' || sortOrder=='asc'){
                  var sortOrders:any ='ASC';
                }else if(sortOrder=='DESC' || sortOrder=='desc'){
                  var sortOrders:any ='DESC';
                }else{
                  var sortOrders:any ='ASC';
                }
                query.orderBy(
                  `a.${sortField}`,
                  sortOrders.toUpperCase(),
                );
          } else {
              // Default sorting
              query.orderBy(`a.createddate`, 'DESC');
          }
          query.limit(pageSize);
          query.offset(pageSize * (page - 1));
          return await query.getRawMany();
        }
      } catch (error) {
        var error1: any = JSON.stringify(error);
        var error2: any = JSON.parse(error1);
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            //args: { errorMessage: JSON.stringify(error) },
            args: { errorMessage: error2 },
          },
        });
      }
  } 
}