export declare enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    VIEWER = "viewer",
    USER = "user",
    GUEST = "guest"
}
export type Role = UserRole;
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
