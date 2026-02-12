"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const schedules_service_1 = require("./schedules.service");
const schedules_controller_1 = require("./schedules.controller");
let SchedulesModule = class SchedulesModule {
};
SchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([setting_entity_1.Setting, location_entity_1.Location, type_entity_1.Type, sensor_entity_1.Sensor, group_entity_1.Group, mqtt_entity_1.Mqtt,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [schedules_controller_1.SchedulesController],
        providers: [schedules_service_1.SchedulesService, users_service_1.UsersService, auth_service_1.AuthService],
        exports: [users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([setting_entity_1.Setting, location_entity_1.Location, type_entity_1.Type, sensor_entity_1.Sensor, group_entity_1.Group, mqtt_entity_1.Mqtt,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
            ])
        ],
    })
], SchedulesModule);
exports.SchedulesModule = SchedulesModule;
//# sourceMappingURL=schedules.module.js.map