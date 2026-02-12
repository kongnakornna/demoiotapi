"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSerializeInterceptor = exports.CustomSerialize = exports.SerializeInterceptor = exports.Serialize = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
function Serialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
exports.Serialize = Serialize;
class SerializeInterceptor {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, handler) {
        return handler.handle().pipe((0, operators_1.map)((response) => {
            if (response && response.data && Array.isArray(response.data)) {
                const serializedData = response.data.map((item) => (0, class_transformer_1.plainToInstance)(this.dto, item, {
                    excludeExtraneousValues: true,
                }));
                return Object.assign(Object.assign({}, response), { data: serializedData });
            }
            return (0, class_transformer_1.plainToInstance)(this.dto, response, {
                excludeExtraneousValues: true,
            });
        }));
    }
}
exports.SerializeInterceptor = SerializeInterceptor;
function CustomSerialize(customDto) {
    return (0, common_1.UseInterceptors)(new CustomSerializeInterceptor(customDto));
}
exports.CustomSerialize = CustomSerialize;
class CustomSerializeInterceptor {
    constructor(customDto) {
        this.customDto = customDto;
    }
    intercept(context, handler) {
        return handler.handle().pipe((0, operators_1.map)((response) => {
            return this.applySerialization(response, this.customDto.key, this.customDto.dto);
        }));
    }
    applySerialization(data, key, dto) {
        if (Array.isArray(data)) {
            return data.map((item) => this.applySerialization(item, key, dto));
        }
        else if (data !== null && typeof data === 'object') {
            const newData = Object.assign({}, data);
            Object.keys(newData).forEach((propKey) => {
                if (propKey === key && newData[propKey]) {
                    newData[propKey] = (0, class_transformer_1.plainToInstance)(dto, newData[propKey], {
                        excludeExtraneousValues: true,
                    });
                }
                else {
                    newData[propKey] = this.applySerialization(newData[propKey], key, dto);
                }
            });
            return newData;
        }
        return data;
    }
}
exports.CustomSerializeInterceptor = CustomSerializeInterceptor;
//# sourceMappingURL=serialize.interceptor.js.map