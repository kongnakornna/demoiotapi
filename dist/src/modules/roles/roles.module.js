"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roles_service_1 = require("./roles.service");
const roles_controller_1 = require("./roles.controller");
const users_service_1 = require("../users/users.service");
const users_controller_1 = require("../users/users.controller");
const user_entity_1 = require("../users/entities/user.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const role_entity_1 = require("./entities/role.entity");
const rolesaccess_entity_2 = require("./entities/rolesaccess.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
let RolesModule = class RolesModule {
};
RolesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [roles_controller_1.RolesController, users_controller_1.UsersController],
        providers: [roles_service_1.RolesService, auth_service_1.AuthService, users_service_1.UsersService, auth_service_1.AuthService],
        exports: [roles_service_1.RolesService, users_service_1.UsersService,
            typeorm_1.TypeOrmModule.forFeature([
                role_entity_1.Role,
                rolesaccess_entity_2.Rolesaccess,
                user_entity_1.User,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
            ])
        ],
    })
], RolesModule);
exports.RolesModule = RolesModule;
//# sourceMappingURL=roles.module.js.map