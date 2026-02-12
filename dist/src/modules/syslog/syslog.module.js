"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogModule = void 0;
const common_1 = require("@nestjs/common");
const syslog_service_1 = require("./syslog.service");
const syslog_controller_1 = require("./syslog.controller");
const typeorm_1 = require("@nestjs/typeorm");
const roles_service_1 = require("../roles/roles.service");
const users_service_1 = require("../users/users.service");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
const devicelog_entity_1 = require("./entities/devicelog.entity");
const userlog_entity_1 = require("./entities/userlog.entity");
const userlogtype_entity_1 = require("./entities/userlogtype.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const rolesaccess_entity_2 = require("../roles/entities/rolesaccess.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
let SyslogModule = class SyslogModule {
};
SyslogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([devicelog_entity_1.DeviceLog,
                user_entity_1.User,
                userlog_entity_1.UserLog,
                userlogtype_entity_1.UserLogtype,
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission, setting_entity_1.Setting, location_entity_1.Location, type_entity_1.Type, sensor_entity_1.Sensor, group_entity_1.Group, mqtt_entity_1.Mqtt,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [syslog_controller_1.SyslogController],
        providers: [syslog_service_1.SyslogService, roles_service_1.RolesService, auth_service_1.AuthService, users_service_1.UsersService, auth_service_1.AuthService],
        exports: [roles_service_1.RolesService, users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([devicelog_entity_1.DeviceLog,
                user_entity_1.User,
                userlog_entity_1.UserLog,
                userlogtype_entity_1.UserLogtype,
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission, setting_entity_1.Setting, location_entity_1.Location, type_entity_1.Type, sensor_entity_1.Sensor, group_entity_1.Group, mqtt_entity_1.Mqtt,
            ])
        ],
    })
], SyslogModule);
exports.SyslogModule = SyslogModule;
//# sourceMappingURL=syslog.module.js.map