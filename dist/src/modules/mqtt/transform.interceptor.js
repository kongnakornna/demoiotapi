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
        return next.handle().pipe((0, operators_1.map)(data => this.transformToCamelCase(data)));
    }
    transformToCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.transformToCamelCase(item));
        }
        else if (obj !== null && obj !== undefined && typeof obj === 'object') {
            return Object.keys(obj).reduce((result, key) => {
                const camelKey = this.toCamelCase(key);
                result[camelKey] = this.transformToCamelCase(obj[key]);
                return result;
            }, {});
        }
        return obj;
    }
    toCamelCase(str) {
        return str.replace(/([-_][a-z])/gi, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map