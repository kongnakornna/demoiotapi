import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare function Serialize(dto: any): MethodDecorator & ClassDecorator;
export declare class SerializeInterceptor implements NestInterceptor {
    private dto;
    constructor(dto: any);
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>;
}
export declare function CustomSerialize(customDto: {
    key: string;
    dto: any;
}): MethodDecorator & ClassDecorator;
export declare class CustomSerializeInterceptor implements NestInterceptor {
    private customDto;
    constructor(customDto: {
        key: string;
        dto: any;
    });
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>;
    private applySerialization;
}
