"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const sduserrole_entity_1 = require("./entities/sduserrole.entity");
const file_entity_1 = require("./entities/file.entity");
const rolesaccess_entity_1 = require("./entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("./entities/userrolepermission.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const sd_notification_type_entity_1 = require("../iot/entities/sd-notification-type.entity");
const sd_device_category_entity_1 = require("../iot/entities/sd-device-category.entity");
const notification_condition_entity_1 = require("../iot/entities/notification-condition.entity");
const sd_notification_channel_entity_1 = require("../iot/entities/sd-notification-channel.entity");
const device_notification_config_entity_1 = require("../iot/entities/device-notification-config.entity");
const sensor_data_entity_1 = require("../iot/entities/sensor-data.entity");
const notification_log_entity_1 = require("../iot/entities/notification-log.entity");
const device_status_history_entity_1 = require("../iot/entities/device-status-history.entity");
const report_data_entity_1 = require("../iot/entities/report-data.entity");
const device_group_entity_1 = require("../iot/entities/device-group.entity");
const sd_device_group_member_entity_1 = require("../iot/entities/sd-device-group-member.entity");
const device_schedule_entity_1 = require("../iot/entities/device-schedule.entity");
const channel_template_entity_1 = require("../iot/entities/channel-template.entity");
const sd_group_notification_config_entity_1 = require("../iot/entities/sd-group-notification-config.entity");
const sd_audit_log_entity_1 = require("../iot/entities/sd-audit-log.entity");
const sd_system_setting_entity_1 = require("../iot/entities/sd-system-setting.entity");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission, sd_notification_type_entity_1.NotificationType, sd_device_category_entity_1.DeviceCategory, notification_condition_entity_1.NotificationCondition, sd_notification_channel_entity_1.NotificationChannel, device_notification_config_entity_1.DeviceNotificationConfig,
                sensor_data_entity_1.SensorData, notification_log_entity_1.NotificationLog, device_status_history_entity_1.DeviceStatusHistory, report_data_entity_1.ReportData, device_group_entity_1.DeviceGroup, sd_device_group_member_entity_1.DeviceGroupMember, device_schedule_entity_1.DeviceSchedule, channel_template_entity_1.ChannelTemplate,
                sd_group_notification_config_entity_1.GroupNotificationConfig, sd_audit_log_entity_1.AuditLog, sd_system_setting_entity_1.SystemSetting,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, auth_service_1.AuthService],
        exports: [users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission, sd_notification_type_entity_1.NotificationType, sd_device_category_entity_1.DeviceCategory, notification_condition_entity_1.NotificationCondition, sd_notification_channel_entity_1.NotificationChannel, device_notification_config_entity_1.DeviceNotificationConfig,
                sensor_data_entity_1.SensorData, notification_log_entity_1.NotificationLog, device_status_history_entity_1.DeviceStatusHistory, report_data_entity_1.ReportData, device_group_entity_1.DeviceGroup, sd_device_group_member_entity_1.DeviceGroupMember, device_schedule_entity_1.DeviceSchedule, channel_template_entity_1.ChannelTemplate,
                sd_group_notification_config_entity_1.GroupNotificationConfig, sd_audit_log_entity_1.AuditLog, sd_system_setting_entity_1.SystemSetting,
            ])
        ],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map