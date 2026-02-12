"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mqtt2Module = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const mqtt2_service_1 = require("./mqtt2.service");
const mqtt3_service_1 = require("../mqtt3/mqtt3.service");
const mqtt2_controller_1 = require("./mqtt2.controller");
const auth_module_1 = require("../auth/auth.module");
const settings_service_1 = require("../settings/settings.service");
const iot_service_1 = require("../iot/iot.service");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const rolesaccess_entity_2 = require("../roles/entities/rolesaccess.entity");
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
const dashboard_config_entity_1 = require("../settings/entities/dashboard-config.entity");
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
const mqttlog_entity_1 = require("../iot/entities/mqttlog.entity");
let Mqtt2Module = class Mqtt2Module {
};
Mqtt2Module = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, sduserrole_entity_1.SdUserRole, file_entity_1.UserFile, rolesaccess_entity_1.SdUserRolesAccess,
                role_entity_1.Role, rolesaccess_entity_2.Rolesaccess, userrolepermission_entity_1.UserRolePermission,
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                scheduledevice_entity_1.scheduleDevice,
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
            config_1.ConfigModule.forRoot(),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'MQTT_CLIENT',
                    useFactory: async () => {
                        return {
                            transport: microservices_1.Transport.MQTT,
                            options: {
                                url: process.env.MQTT_HOST2 || 'mqtt://broker.hivemq.com:1883',
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
        ],
        controllers: [mqtt2_controller_1.Mqtt2Controller],
        providers: [mqtt_service_1.MqttService, mqtt2_service_1.Mqtt2Service, mqtt3_service_1.Mqtt3Service, iot_service_1.IotService, settings_service_1.SettingsService, users_service_1.UsersService],
        exports: [mqtt_service_1.MqttService, mqtt2_service_1.Mqtt2Service, mqtt3_service_1.Mqtt3Service, iot_service_1.IotService, settings_service_1.SettingsService, users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, sduserrole_entity_1.SdUserRole, file_entity_1.UserFile, rolesaccess_entity_1.SdUserRolesAccess,
                role_entity_1.Role, rolesaccess_entity_2.Rolesaccess, userrolepermission_entity_1.UserRolePermission,
                setting_entity_1.Setting,
                location_entity_1.Location,
                type_entity_1.Type,
                sensor_entity_1.Sensor,
                group_entity_1.Group,
                mqtt_entity_1.Mqtt,
                scheduledevice_entity_1.scheduleDevice,
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
            ]),],
    })
], Mqtt2Module);
exports.Mqtt2Module = Mqtt2Module;
//# sourceMappingURL=mqtt2.module.js.map