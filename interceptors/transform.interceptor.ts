import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // แปลงเฉพาะ top-level เท่านั้น ไม่ recursive
        return this.convertTopLevelOnly(data);
      }),
    );
  }

  private convertTopLevelOnly(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    // กรณีเป็น array
    if (Array.isArray(data)) {
      return data.map((item) => this.convertObjectTopLevel(item));
    }

    // กรณีเป็น object
    return this.convertObjectTopLevel(data);
  }

  private convertObjectTopLevel(obj: any): any {
    if (
      !obj ||
      typeof obj !== 'object' ||
      obj instanceof Date ||
      obj instanceof Buffer
    ) {
      return obj;
    }

    const result: any = {};

    // แปลงเฉพาะ keys ของ object นี้เท่านั้น
    Object.keys(obj).forEach((key) => {
      const camelKey = this.toCamelCase(key);
      result[camelKey] = obj[key]; // เก็บ value ตามเดิม ไม่แปลง nested
    });

    return result;
  }

  private toCamelCase(str: string): string {
    if (str.includes('_') && str === str.toUpperCase()) {
      return str
        .toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    return str;
  }
}
