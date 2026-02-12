"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            return this.convertTopLevelOnly(data);
        }));
    }
    convertTopLevelOnly(data) {
        if (data === null || data === undefined) {
            return data;
        }
        if (Array.isArray(data)) {
            return data.map((item) => this.convertObjectTopLevel(item));
        }
        return this.convertObjectTopLevel(data);
    }
    convertObjectTopLevel(obj) {
        if (!obj ||
            typeof obj !== 'object' ||
            obj instanceof Date ||
            obj instanceof Buffer) {
            return obj;
        }
        const result = {};
        Object.keys(obj).forEach((key) => {
            const camelKey = this.toCamelCase(key);
            result[camelKey] = obj[key];
        });
        return result;
    }
    toCamelCase(str) {
        if (str.includes('_') && str === str.toUpperCase()) {
            return str
                .toLowerCase()
                .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        }
        return str;
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map