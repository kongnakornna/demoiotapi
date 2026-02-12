"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const settings_controller_1 = require("./settings.controller");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const devicetype_entity_1 = require("./entities/devicetype.entity");
const setting_entity_1 = require("./entities/setting.entity");
const location_entity_1 = require("./entities/location.entity");
const type_entity_1 = require("./entities/type.entity");
const sensor_entity_1 = require("./entities/sensor.entity");
const group_entity_1 = require("./entities/group.entity");
const mqtt_entity_1 = require("./entities/mqtt.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const deviceaction_entity_1 = require("./entities/deviceaction.entity");
const deviceactionlog_entity_1 = require("./entities/deviceactionlog.entity");
const deviceactionuser_entity_1 = require("./entities/deviceactionuser.entity");
const devivicealarmaction_entity_1 = require("./entities/devivicealarmaction.entity");
const telegram_entity_1 = require("./entities/telegram.entity");
const api_entity_1 = require("./entities/api.entity");
const device_entity_1 = require("./entities/device.entity");
const email_entity_1 = require("./entities/email.entity");
const host_entity_1 = require("./entities/host.entity");
const influxdb_entity_1 = require("./entities/influxdb.entity");
const line_entity_1 = require("./entities/line.entity");
const nodered_entity_1 = require("./entities/nodered.entity");
const schedule_entity_1 = require("./entities/schedule.entity");
const sms_entity_1 = require("./entities/sms.entity");
const token_entity_1 = require("./entities/token.entity");
const scheduledevice_entity_1 = require("./entities/scheduledevice.entity");
const alarmdevice_entity_1 = require("./entities/alarmdevice.entity");
const alarmdeviceevent_entity_1 = require("./entities/alarmdeviceevent.entity");
const scheduleprocesslog_entity_1 = require("./entities/scheduleprocesslog.entity");
const alarmprocesslog_entity_1 = require("./entities/alarmprocesslog.entity");
const alarmprocesslogtemp_entity_1 = require("./entities/alarmprocesslogtemp.entity");
const alarmprocesslogemail_entity_1 = require("./entities/alarmprocesslogemail.entity");
const alarmprocesslogline_entity_1 = require("./entities/alarmprocesslogline.entity");
const alarmprocesslogsms_entity_1 = require("./entities/alarmprocesslogsms.entity");
const alarmprocesslogtelegram_entity_1 = require("./entities/alarmprocesslogtelegram.entity");
const alarmprocesslogmqtt_entity_1 = require("./entities/alarmprocesslogmqtt.entity");
const mqtthost_entity_1 = require("./entities/mqtthost.entity");
const mqttlog_entity_1 = require("../iot/entities/mqttlog.entity");
const dashboard_config_entity_1 = require("./entities/dashboard-config.entity");
const aircontrol_entity_1 = require("../iot/entities/aircontrol.entity");
const airmod_entity_1 = require("../iot/entities/airmod.entity");
const airperiod_entity_1 = require("../iot/entities/airperiod.entity");
const airsettingwarning_entity_1 = require("../iot/entities/airsettingwarning.entity");
const airwarning_entity_1 = require("../iot/entities/airwarning.entity");
const aircontroldevicemap_entity_1 = require("../iot/entities/aircontroldevicemap.entity");
const airmoddevicemap_entity_1 = require("../iot/entities/airmoddevicemap.entity");
const airperioddevicemap_entity_1 = require("../iot/entities/airperioddevicemap.entity");
const airsettingwarningdevicemap_entity_1 = require("../iot/entities/airsettingwarningdevicemap.entity");
const airwarningdevicemap_entity_1 = require("../iot/entities/airwarningdevicemap.entity");
const aircontrollog_entity_1 = require("../iot/entities/aircontrollog.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const microservices_1 = require("@nestjs/microservices");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const mqtt2_service_1 = require("../mqtt2/mqtt2.service");
const mqtt3_service_1 = require("../mqtt3/mqtt3.service");
const iot_service_1 = require("../iot/iot.service");
const logger = new common_1.Logger('SettingsModule');
const mailer_1 = require("@nestjs-modules/mailer");
const path_1 = require("path");
const fs = require('fs');
var filePath = (0, path_1.join)(__dirname, 'public', 'emailConfigs.json');
let SettingsModule = class SettingsModule {
};
SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                scheduledevice_entity_1.scheduleDevice,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
                api_entity_1.Api,
                device_entity_1.Device,
                devicetype_entity_1.DeviceType,
                email_entity_1.Email,
                host_entity_1.Host,
                influxdb_entity_1.Influxdb,
                line_entity_1.Line,
                nodered_entity_1.Nodered,
                schedule_entity_1.Schedule,
                sms_entity_1.Sms,
                token_entity_1.Token,
                deviceaction_entity_1.Deviceaction,
                deviceactionlog_entity_1.Deviceactionlog,
                deviceactionuser_entity_1.Deviceactionuser,
                devivicealarmaction_entity_1.Devicealarmaction,
                telegram_entity_1.Telegram,
                alarmdevice_entity_1.alarmDevice,
                alarmdeviceevent_entity_1.alarmDeviceEvent,
                scheduleprocesslog_entity_1.scheduleprocesslog,
                alarmprocesslog_entity_1.alarmprocesslog,
                alarmprocesslogtemp_entity_1.alarmprocesslogtemp,
                alarmprocesslogemail_entity_1.alarmprocesslogemail,
                alarmprocesslogline_entity_1.alarmprocesslogline,
                alarmprocesslogsms_entity_1.alarmprocesslogsms,
                alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram,
                alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt,
                mqtthost_entity_1.mqtthost,
                mqttlog_entity_1.mqttlog, aircontrol_entity_1.aircontrol, airmod_entity_1.airmod, airperiod_entity_1.airperiod, airsettingwarning_entity_1.airsettingwarning, airwarning_entity_1.airwarning, aircontroldevicemap_entity_1.aircontroldevicemap, airmoddevicemap_entity_1.airmoddevicemap, airperioddevicemap_entity_1.airperioddevicemap,
                airsettingwarningdevicemap_entity_1.airsettingwarningdevicemap, airwarningdevicemap_entity_1.airwarningdevicemap, aircontrollog_entity_1.aircontrollog, mqttlog_entity_1.mqttlog, dashboard_config_entity_1.dashboardConfig
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'MQTT_CLIENT',
                    imports: [typeorm_1.TypeOrmModule.forFeature([mqtthost_entity_1.mqtthost])],
                    inject: [(0, typeorm_1.getRepositoryToken)(mqtthost_entity_1.mqtthost)],
                    useFactory: async (mqtthostRepo) => {
                        const mqtthostConfig = await mqtthostRepo.findOne({ where: { status: 1 } });
                        if (!mqtthostConfig) {
                            throw new Error('MQTT host config not found in database');
                        }
                        return {
                            transport: microservices_1.Transport.MQTT,
                            options: {
                                url: mqtthostConfig.host || process.env.MQTT_HOST,
                                clientId: `nestjs-client-${Math.random().toString(16).slice(3)}`,
                                serializer: {
                                    serialize: (value) => value.data,
                                },
                            },
                        };
                    },
                },
            ]),
            mailer_1.MailerModule.forRootAsync({
                imports: [typeorm_1.TypeOrmModule.forFeature([email_entity_1.Email])],
                inject: [(0, typeorm_1.getRepositoryToken)(email_entity_1.Email)],
                useFactory: async (emailRepo) => {
                    try {
                        const emailConfig = await emailRepo.findOneBy({ status: 1 });
                        var setup = Number(2);
                        const host = (emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.host) || process.env.SMTP_HOST || '172.29.16.52';
                        const port = Number(emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.port) || Number(process.env.SMTP_PORT) || 587;
                        const username = (emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.username) || process.env.SMTP_USER || 'strux.ware';
                        const password = (emailConfig === null || emailConfig === void 0 ? void 0 : emailConfig.password) || process.env.SMTP_PASS || 'baac@123';
                        const secure = process.env.SMTP_SECURE !== 'false';
                        console.log('Email configuration:', {
                            source: emailConfig ? 'database' : 'environment',
                            host,
                            port
                        });
                        if (setup == 1) {
                            return {
                                transport: {
                                    host: '172.29.16.52',
                                    port: Number(587),
                                    secure: false,
                                    auth: {
                                        user: 'strux.ware',
                                        pass: 'baac@123',
                                    },
                                    connectionTimeout: 60000,
                                    greetingTimeout: 30000,
                                    socketTimeout: 45000,
                                    debug: true,
                                    logger: true,
                                    tls: {
                                        rejectUnauthorized: false
                                    }
                                },
                                defaults: {
                                    from: `"No Reply" <Icmon>`,
                                },
                                verifyTransporters: false,
                            };
                        }
                        else {
                            return {
                                transport: {
                                    host,
                                    port,
                                    secure,
                                    auth: {
                                        user: username,
                                        pass: password,
                                    },
                                    connectionTimeout: 60000,
                                    greetingTimeout: 30000,
                                    socketTimeout: 45000,
                                    debug: true,
                                    logger: true,
                                    tls: {
                                        rejectUnauthorized: false
                                    }
                                },
                                defaults: {
                                    from: `"No Reply " <${username}>`,
                                },
                                verifyTransporters: false,
                            };
                        }
                    }
                    catch (err) {
                        console.error('Mailer configuration error, using fallback:', err);
                        return {
                            transport: {
                                host: '172.29.16.52',
                                port: Number(587),
                                secure: false,
                                auth: {
                                    user: 'strux.ware',
                                    pass: 'baac@123',
                                },
                                connectionTimeout: 60000,
                                greetingTimeout: 30000,
                                socketTimeout: 45000,
                                debug: true,
                                logger: true,
                                tls: {
                                    rejectUnauthorized: false
                                }
                            },
                            defaults: {
                                from: `"No Reply" <Icmon>`,
                            },
                            verifyTransporters: false,
                        };
                    }
                },
            }),
        ],
        controllers: [settings_controller_1.SettingsController],
        providers: [settings_service_1.SettingsService, users_service_1.UsersService, auth_service_1.AuthService, mqtt_service_1.MqttService, mqtt2_service_1.Mqtt2Service, mqtt3_service_1.Mqtt3Service, iot_service_1.IotService],
        exports: [
            users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                scheduledevice_entity_1.scheduleDevice,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
                api_entity_1.Api,
                device_entity_1.Device,
                devicetype_entity_1.DeviceType,
                email_entity_1.Email,
                host_entity_1.Host,
                influxdb_entity_1.Influxdb,
                line_entity_1.Line,
                nodered_entity_1.Nodered,
                schedule_entity_1.Schedule,
                sms_entity_1.Sms,
                token_entity_1.Token,
                deviceaction_entity_1.Deviceaction,
                deviceactionlog_entity_1.Deviceactionlog,
                deviceactionuser_entity_1.Deviceactionuser,
                devivicealarmaction_entity_1.Devicealarmaction,
                telegram_entity_1.Telegram,
                alarmdevice_entity_1.alarmDevice,
                alarmdeviceevent_entity_1.alarmDeviceEvent,
                scheduleprocesslog_entity_1.scheduleprocesslog,
                alarmprocesslog_entity_1.alarmprocesslog,
                alarmprocesslogtemp_entity_1.alarmprocesslogtemp,
                alarmprocesslogemail_entity_1.alarmprocesslogemail,
                alarmprocesslogline_entity_1.alarmprocesslogline,
                alarmprocesslogsms_entity_1.alarmprocesslogsms,
                alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram,
                alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt,
                mqtthost_entity_1.mqtthost,
                mqttlog_entity_1.mqttlog,
                dashboard_config_entity_1.dashboardConfig
            ]),
        ],
    })
], SettingsModule);
exports.SettingsModule = SettingsModule;
//# sourceMappingURL=settings.module.js.map