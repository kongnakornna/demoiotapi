"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roles_service_1 = require("../roles/roles.service");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const iot_service_1 = require("./iot.service");
const users_service_1 = require("../users/users.service");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
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
const alarmdevice_entity_1 = require("../settings/entities/alarmdevice.entity");
const alarmdeviceevent_entity_1 = require("../settings/entities/alarmdeviceevent.entity");
const scheduleprocesslog_entity_1 = require("../settings/entities/scheduleprocesslog.entity");
const alarmprocesslog_entity_1 = require("../settings/entities/alarmprocesslog.entity");
const alarmprocesslogtemp_entity_1 = require("../settings/entities/alarmprocesslogtemp.entity");
const alarmprocesslogemail_entity_1 = require("../settings/entities/alarmprocesslogemail.entity");
const alarmprocesslogline_entity_1 = require("../settings/entities/alarmprocesslogline.entity");
const alarmprocesslogsms_entity_1 = require("../settings/entities/alarmprocesslogsms.entity");
const alarmprocesslogtelegram_entity_1 = require("../settings/entities/alarmprocesslogtelegram.entity");
const alarmprocesslogmqtt_entity_1 = require("../settings/entities/alarmprocesslogmqtt.entity");
const mqtthost_entity_1 = require("../settings/entities/mqtthost.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const rolesaccess_entity_2 = require("../roles/entities/rolesaccess.entity");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const mqtt2_service_1 = require("../mqtt2/mqtt2.service");
const mqtt3_service_1 = require("../mqtt3/mqtt3.service");
const microservices_1 = require("@nestjs/microservices");
const aircontrol_entity_1 = require("./entities/aircontrol.entity");
const airmod_entity_1 = require("./entities/airmod.entity");
const airperiod_entity_1 = require("./entities/airperiod.entity");
const airsettingwarning_entity_1 = require("./entities/airsettingwarning.entity");
const airwarning_entity_1 = require("./entities/airwarning.entity");
const aircontroldevicemap_entity_1 = require("./entities/aircontroldevicemap.entity");
const airmoddevicemap_entity_1 = require("./entities/airmoddevicemap.entity");
const airperioddevicemap_entity_1 = require("./entities/airperioddevicemap.entity");
const airsettingwarningdevicemap_entity_1 = require("./entities/airsettingwarningdevicemap.entity");
const airwarningdevicemap_entity_1 = require("./entities/airwarningdevicemap.entity");
const aircontrollog_entity_1 = require("./entities/aircontrollog.entity");
const mqttlog_entity_1 = require("./entities/mqttlog.entity");
const dashboard_config_entity_1 = require("../settings/entities/dashboard-config.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sd_notification_type_entity_1 = require("./entities/sd-notification-type.entity");
const sd_device_category_entity_1 = require("./entities/sd-device-category.entity");
const notification_condition_entity_1 = require("./entities/notification-condition.entity");
const sd_notification_channel_entity_1 = require("./entities/sd-notification-channel.entity");
const device_notification_config_entity_1 = require("./entities/device-notification-config.entity");
const sensor_data_entity_1 = require("./entities/sensor-data.entity");
const notification_log_entity_1 = require("./entities/notification-log.entity");
const device_status_history_entity_1 = require("./entities/device-status-history.entity");
const report_data_entity_1 = require("./entities/report-data.entity");
const device_group_entity_1 = require("./entities/device-group.entity");
const sd_device_group_member_entity_1 = require("./entities/sd-device-group-member.entity");
const device_schedule_entity_1 = require("./entities/device-schedule.entity");
const channel_template_entity_1 = require("./entities/channel-template.entity");
const sd_group_notification_config_entity_1 = require("./entities/sd-group-notification-config.entity");
const sd_api_key_entity_1 = require("./entities/sd-api-key.entity");
const sd_audit_log_entity_1 = require("./entities/sd-audit-log.entity");
const sd_system_setting_entity_1 = require("./entities/sd-system-setting.entity");
const device_status_entity_1 = require("./entities/device-status.entity");
const device_config_entity_1 = require("./entities/device-config.entity");
const iot_data_entity_1 = require("./entities/iot-data.entity");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const command_log_entity_1 = require("./entities/command-log.entity");
const device_alert_entity_1 = require("./entities/device-alert.entity");
const settings_service_1 = require("../settings/settings.service");
const device_service_1 = require("./device.service");
const deviceio_service_1 = require("./deviceio.service");
const iotsocketio_service_1 = require("./iotsocketio.service");
const iot_data_service_1 = require("./iot-data.service");
const iotsocket_controller_1 = require("./iotsocket.controller");
const iotsocket_gateway_1 = require("./iotsocket.gateway");
const ENV = process.env.NODE_ENV;
console.log('NODE_ENV: ' + ENV);
console.log('MQTT_HOST: ' + process.env.MQTT_HOST);
const iot_controller_1 = require("./iot.controller");
let IotModule = class IotModule {
};
IotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                user_entity_1.User,
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
                scheduledevice_entity_1.scheduleDevice,
                alarmdevice_entity_1.alarmDevice,
                alarmdeviceevent_entity_1.alarmDeviceEvent,
                scheduleprocesslog_entity_1.scheduleprocesslog,
                alarmprocesslog_entity_1.alarmprocesslog,
                alarmprocesslogtemp_entity_1.alarmprocesslogtemp,
                alarmprocesslogemail_entity_1.alarmprocesslogemail,
                alarmprocesslogline_entity_1.alarmprocesslogline,
                alarmprocesslogsms_entity_1.alarmprocesslogsms,
                alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram,
                mqtthost_entity_1.mqtthost,
                alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt,
                aircontrol_entity_1.aircontrol,
                airmod_entity_1.airmod,
                airperiod_entity_1.airperiod,
                airsettingwarning_entity_1.airsettingwarning,
                airwarning_entity_1.airwarning,
                aircontroldevicemap_entity_1.aircontroldevicemap,
                airmoddevicemap_entity_1.airmoddevicemap,
                airperioddevicemap_entity_1.airperioddevicemap,
                airsettingwarningdevicemap_entity_1.airsettingwarningdevicemap,
                airwarningdevicemap_entity_1.airwarningdevicemap,
                aircontrollog_entity_1.aircontrollog,
                mqttlog_entity_1.mqttlog,
                dashboard_config_entity_1.dashboardConfig,
                sd_notification_type_entity_1.NotificationType,
                sd_device_category_entity_1.DeviceCategory,
                notification_condition_entity_1.NotificationCondition,
                sd_notification_channel_entity_1.NotificationChannel,
                device_notification_config_entity_1.DeviceNotificationConfig,
                sensor_data_entity_1.SensorData,
                notification_log_entity_1.NotificationLog,
                device_status_history_entity_1.DeviceStatusHistory,
                report_data_entity_1.ReportData,
                device_group_entity_1.DeviceGroup,
                sd_device_group_member_entity_1.DeviceGroupMember,
                device_schedule_entity_1.DeviceSchedule,
                channel_template_entity_1.ChannelTemplate,
                sd_group_notification_config_entity_1.GroupNotificationConfig,
                sd_api_key_entity_1.ApiKey,
                sd_audit_log_entity_1.AuditLog,
                sd_system_setting_entity_1.SystemSetting,
                device_status_entity_1.DeviceStatus,
                device_config_entity_1.DeviceConfig,
                iot_data_entity_1.IotData,
                activity_log_entity_1.ActivityLog,
                command_log_entity_1.CommandLog,
                device_alert_entity_1.DeviceAlert,
            ]),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'MQTT_CLIENT',
                    imports: [typeorm_1.TypeOrmModule.forFeature([mqtthost_entity_1.mqtthost])],
                    inject: [(0, typeorm_1.getRepositoryToken)(mqtthost_entity_1.mqtthost)],
                    useFactory: async (mqtthostRepo) => {
                        const mqtthostConfig = await mqtthostRepo.findOne({
                            where: { status: 1 },
                        });
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
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [iot_controller_1.IotController, iotsocket_controller_1.IotsocketController],
        providers: [
            mqtt_service_1.MqttService,
            mqtt2_service_1.Mqtt2Service,
            mqtt3_service_1.Mqtt3Service,
            roles_service_1.RolesService,
            auth_service_1.AuthService,
            auth_service_1.AuthService,
            settings_service_1.SettingsService,
            iot_service_1.IotService,
            users_service_1.UsersService,
            device_service_1.Deviceervice,
            deviceio_service_1.DeviceioService,
            iotsocket_gateway_1.IotsocketGateway,
            iot_data_service_1.IotDataService,
            iotsocketio_service_1.IotioService,
        ],
        exports: [
            roles_service_1.RolesService,
            iot_service_1.IotService,
            deviceio_service_1.DeviceioService,
            iot_data_service_1.IotDataService,
            users_service_1.UsersService,
            iotsocket_gateway_1.IotsocketGateway,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                user_entity_1.User,
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
                scheduledevice_entity_1.scheduleDevice,
                alarmdevice_entity_1.alarmDevice,
                alarmdeviceevent_entity_1.alarmDeviceEvent,
                scheduleprocesslog_entity_1.scheduleprocesslog,
                alarmprocesslog_entity_1.alarmprocesslog,
                alarmprocesslogtemp_entity_1.alarmprocesslogtemp,
                alarmprocesslogemail_entity_1.alarmprocesslogemail,
                alarmprocesslogline_entity_1.alarmprocesslogline,
                alarmprocesslogsms_entity_1.alarmprocesslogsms,
                alarmprocesslogtelegram_entity_1.alarmprocesslogtelegram,
                mqtthost_entity_1.mqtthost,
                alarmprocesslogmqtt_entity_1.alarmprocesslogmqtt,
                aircontrol_entity_1.aircontrol,
                airmod_entity_1.airmod,
                airperiod_entity_1.airperiod,
                airsettingwarning_entity_1.airsettingwarning,
                airwarning_entity_1.airwarning,
                aircontroldevicemap_entity_1.aircontroldevicemap,
                airmoddevicemap_entity_1.airmoddevicemap,
                airperioddevicemap_entity_1.airperioddevicemap,
                airsettingwarningdevicemap_entity_1.airsettingwarningdevicemap,
                airwarningdevicemap_entity_1.airwarningdevicemap,
                aircontrollog_entity_1.aircontrollog,
                mqttlog_entity_1.mqttlog,
                dashboard_config_entity_1.dashboardConfig,
                sd_notification_type_entity_1.NotificationType,
                sd_device_category_entity_1.DeviceCategory,
                notification_condition_entity_1.NotificationCondition,
                sd_notification_channel_entity_1.NotificationChannel,
                device_notification_config_entity_1.DeviceNotificationConfig,
                sensor_data_entity_1.SensorData,
                notification_log_entity_1.NotificationLog,
                device_status_history_entity_1.DeviceStatusHistory,
                report_data_entity_1.ReportData,
                device_group_entity_1.DeviceGroup,
                sd_device_group_member_entity_1.DeviceGroupMember,
                device_schedule_entity_1.DeviceSchedule,
                channel_template_entity_1.ChannelTemplate,
                sd_group_notification_config_entity_1.GroupNotificationConfig,
                sd_api_key_entity_1.ApiKey,
                sd_audit_log_entity_1.AuditLog,
                sd_system_setting_entity_1.SystemSetting,
                device_status_entity_1.DeviceStatus,
                device_config_entity_1.DeviceConfig,
                iot_data_entity_1.IotData,
                activity_log_entity_1.ActivityLog,
                command_log_entity_1.CommandLog,
                device_alert_entity_1.DeviceAlert,
                iotsocketio_service_1.IotioService,
            ]),
        ],
    })
], IotModule);
exports.IotModule = IotModule;
//# sourceMappingURL=iot.module.js.map