"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessmenuModule = void 0;
const common_1 = require("@nestjs/common");
const accessmenu_service_1 = require("./accessmenu.service");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("../users/users.service");
const accessmenu_controller_1 = require("./accessmenu.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const accessmenu_entity_1 = require("./entities/accessmenu.entity");
const useraccessmenu_entity_1 = require("./entities/useraccessmenu.entity");
const sduserrole_entity_1 = require("../users/entities/sduserrole.entity");
const file_entity_1 = require("../users/entities/file.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("../users/entities/userrolepermission.entity");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
let AccessmenuModule = class AccessmenuModule {
};
AccessmenuModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User,
                accessmenu_entity_1.AccessMenu,
                useraccessmenu_entity_1.Useraccessmenu,
                sduserrole_entity_1.SdUserRole,
                file_entity_1.UserFile,
                rolesaccess_entity_1.SdUserRolesAccess,
                userrolepermission_entity_1.UserRolePermission,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [accessmenu_controller_1.AccessmenuController],
        providers: [accessmenu_service_1.AccessmenuService, users_service_1.UsersService, auth_service_1.AuthService],
        exports: [accessmenu_service_1.AccessmenuService],
    })
], AccessmenuModule);
exports.AccessmenuModule = AccessmenuModule;
//# sourceMappingURL=accessmenu.module.js.map