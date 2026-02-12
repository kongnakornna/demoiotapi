"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["OPERATOR"] = "operator";
    UserRole["VIEWER"] = "viewer";
    UserRole["USER"] = "user";
    UserRole["GUEST"] = "guest";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=user-role.enum.js.map